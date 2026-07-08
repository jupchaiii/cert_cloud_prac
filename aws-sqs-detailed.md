# Amazon SQS (Simple Queue Service) — คู่มือฉบับสมบูรณ์

> แหล่งอ้างอิง: [Amazon SQS Developer Guide](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/)
> แหล่งอ้างอิง: [SQS FIFO Queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html)
> แหล่งอ้างอิง: [SQS Pricing](https://aws.amazon.com/sqs/pricing/)

---

## 1. ภาพรวม (Overview)

Amazon Simple Queue Service (SQS) คือ fully managed message queuing service ที่ให้เราส่ง message ระหว่าง components หรือ services ได้อย่างปลอดภัย รองรับ producer-consumer pattern โดย producer ส่ง message เข้า queue และ consumer ดึง message ออกไปประมวลผล

**SQS เป็น distributed queue system** — queue ถูกเก็บบน servers หลายตัว spanning multiple AZs ใน region ที่เลือก ทำให้ไม่มี single point of failure

**Key characteristics:**
- **Fully managed** — ไม่ต้อง provision, patch, or manage servers
- **Highly available** — messages stored redundantly across multiple AZs
- **Scalable** — handle from 1 message/sec ถึง nearly unlimited
- **Decoupling** — producer และ consumer ไม่ต้องรู้จักกันโดยตรง
- **At-least-once delivery** — message อาจถูกส่งมากกว่า 1 ครั้งเป็นบางครั้ง (ต้องออกแบบให้ idempotent)
- **No ordering guarantee** (สำหรับ Standard Queue)

---

## 2. Queue Types

### 2.1 Standard Queue (Default)

**Best-effort ordering** — messages อาจจะถูกส่งมาในลำดับที่ไม่ตรงกับตอนส่ง (best-effort ordering)

**Characteristics:**
- **Unlimited throughput** — unlimited number of transactions per second (TPS)
- **At-least-once delivery** — message อาจถูก deliver มากกว่า 1 ครั้งเป็นบางครั้ง
- **Best-effort ordering** — ไม่ guarantee ลำดับ
- **Multiple copies** — message อาจมี copies หลายฉบับใน queue เป็นบางครั้ง

**Use cases:**
- Task offloading (background jobs)
- Decoupling microservices
- Batch processing
- Event notification systems

### 2.2 FIFO Queue (First-In-First-Out)

**Guaranteed ordering** — messages ถูกส่งและรับตามลำดับที่ส่งเข้ามาอย่างเคร่งครัด

**Characteristics:**
- **Exactly-once processing** — message ถูก delivered หนึ่งครั้งเท่านั้น (no duplicates)
- **FIFO ordering** — ลำดับแน่นอน
- **Throughput limits:** 300 TPS (without batching) หรือ 3,000 TPS (with batching)
- **Message groups:** multiple ordered message groups within a single queue
- **Deduplication:** เลือก deduplication interval 5 นาทีหรือ 1 นาที

**Use cases:**
- Financial transactions (ที่ต้องการ exact order)
- Order processing systems
- Systems that cannot tolerate duplicate processing
- Inventory management

**FIFO Queue naming:** ต้องลงท้ายด้วย `.fifo`

```
# ตัวอย่างชื่อ FIFO queue
order-processing.fifo
```

---

## 3. Core Concepts

### 3.1 Message Lifecycle

```
1. Producer sends message to SQS queue
2. Message is stored redundantly across multiple AZs
3. Consumer polls queue (ReceiveMessage API)
4. Message is returned to consumer (with visibility timeout window)
5. Consumer processes message
6. Consumer deletes message (DeleteMessage API)
```

### 3.2 Message Structure

| Component | คำอธิบาย |
|-----------|----------|
| **Message ID** | Unique identifier ของ message |
| **Receipt Handle** | Token ที่ได้เมื่อ message ถูก received — ใช้สำหรับ delete หรือ change visibility |
| **Body** | Message content (up to 256 KB) — text (UTF-8) หรือ JSON |
| **Metadata** | System attributes (sender ID, timestamp, etc.) และ custom attributes |
| **MD5 checksum** | MD5 hash ของ message body — สำหรับตรวจสอบความถูกต้อง |

### 3.3 Queue Structure

| Component | คำอธิบาย |
|-----------|----------|
| **Queue URL** | Unique identifier ของ queue ใน AWS |
| **Queue Name** | User-defined name (ต้อง unique within AWS account + region) |
| **Queue ARN** | Amazon Resource Name ของ queue |
| **Region** | ถูกสร้างใน specific region |

---

## 4. Key Features

### 4.1 Visibility Timeout

เมื่อ consumer ได้รับ message — message จะไม่ถูก delete ทันที แต่จะถูก "invisible" ต่อ consumers ตัวอื่นเป็นระยะเวลาที่กำหนด

```
[Message visible] → Consumer A polls → [Message invisible for 30 sec]
                   → Consumer A processes
                   → Consumer A deletes within 30 sec
                   → Message removed
```

**Characteristics:**
- Default: 30 seconds (สามารถตั้งได้ 0 วินาที – 12 ชั่วโมง)
- ถ้า consumer ไม่ delete message ภายใน visibility timeout → message จะกลับมา visible อีกครั้ง (และ consumer ตัวอื่นอาจได้รับ)
- **Short poll vs Long poll** — short poll คือ immediate return (อาจ empty), long poll รอจนมี message หรือ timeout

### 4.2 Message Retention

Messages ถูกเก็บไว้ใน queue เป็นระยะเวลาที่กำหนด:

- **Default retention:** 4 days (345,600 seconds)
- **Minimum:** 60 seconds
- **Maximum:** 1,200 seconds (20 minutes) — จริงๆ คือ 14 days

```
Retention period:
Minimum:  60 seconds
Default:  4 days (345,600 seconds)
Maximum:  14 days (1,209,600 seconds)
```

**หลังจาก retention period หมด** — message จะถูกลบอัตโนมัติ

### 4.3 Dead Letter Queue (DLQ)

Messages ที่ไม่สามารถ process ได้ (failed after all retries) จะถูกส่งไปยัง DLQ

**Use cases:**
- Debug failed messages
- Manual inspection and reprocessing
- Alert on failed messages

**Configuration:**
- Set `maxReceiveCount` — จำนวนครั้งที่ message ถูก received แต่ไม่ถูก deleted
- เมื่อเกิน maxReceiveCount → message ถูก move ไป DLQ

### 4.4 Delay Queues และ Per-Queue Delays

**Delay Queue:** ทำให้ message ที่เข้ามาใหม่ไม่สามารถถูก consume ได้ทันที

- **DelaySeconds:** 0 – 900 seconds (15 นาที)
- คล้าย visibility timeout แต่ apply ตอน message เข้ามาใหม่ (ไม่ใช่ตอนถูก consumed)

**Use cases:**
- Schedule tasks
- Rate limiting
- Delay processing

### 4.5 Large Message Support

สำหรับ message ใหญ่กว่า 256 KB:

- **SQS Extended Client Library (Java)** — store payload ใน S3 แล้วส่ง reference ผ่าน SQS
- **Maximum message body size:** 256 KB (payload in S3 สำหรับ large messages สูงสุด 2 GB)

### 4.6 Batching

**SQS batch operations** ช่วยลด cost โดยส่ง/รับ/delete multiple messages ในครั้งเดียว:

- **SendMessageBatch:** ส่งได้สูงสุด 10 messages ต่อ batch
- **ReceiveMessage:** รับได้สูงสุด 10 messages ต่อ call
- **DeleteMessageBatch:** ลบได้สูงสุด 10 messages ต่อ batch

**Cost benefit:** 1 API call แทน 10 separate calls

---

## 5. Message Deduplication (FIFO)

FIFO queues มี built-in deduplication:

**Deduplication methods:**

| Method | คำอธิบาย |
|--------|----------|
| **Content-based deduplication** | ใช้ SHA-256 hash ของ message body เป็น deduplication ID |
| **Explicit deduplication ID** | Producer ส่ง deduplication ID เองในแต่ละ message |

**Deduplication interval:** 5 นาที — messages ที่มี deduplication ID เดียวกันที่ส่งภายใน 5 นาทีจะถูก deduplicate (เก็บเฉพาะตัวแรก)

---

## 6. Security

### 6.1 Encryption

| Type | คำอธิบาย |
|------|----------|
| **In-flight (TLS)** | Messages encrypted ระหว่าง producer/consumer กับ SQS |
| **At-rest (SSE)** | Server-side encryption ใช้ KMS keys |
| **Client-side** | Encrypt message ก่อนส่งไป SQS เลย |

**SSE with KMS:**
- ใช้ AWS managed keys หรือ customer managed keys (CMK)
- CMK สามารถ rotate อัตโนมัติ
- Audit ได้ผ่าน CloudTrail

### 6.2 Access Control

**IAM policies สำหรับ SQS:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"AWS": "arn:aws:iam::123456789012:user/username"},
      "Action": [
        "sqs:SendMessage",
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage"
      ],
      "Resource": "arn:aws:sqs:us-east-1:123456789012:my-queue"
    }
  ]
}
```

**Queue-level Resource Policies** (similar to bucket policies):
- Control who can send/receive/delete from queue
- Support cross-account access
- Deny specific IPs or conditions

### 6.3 VPC Endpoints (PrivateLink)

เข้าถึง SQS ผ่าน private IP โดยไม่ต้องผ่าน internet:

- **Interface endpoint (PrivateLink):** ใช้ ENI + private IP
- รองรับ both Standard และ FIFO queues
- ทำให้ traffic อยู่ภายใน VPC

---

## 7. Polling Patterns

### 7.1 Short Poll (Default)

- Consumer ส่ง request ทุกครั้งและได้ response ทันที
- ถ้าไม่มี message → return empty response ทันที
- **Cost:** 1 SQS API request ทุก poll

### 7.2 Long Poll

- Consumer รอจนกว่าจะมี message ใน queue หรือ timeout
- **Recommended:** ลด number of empty responses และ cost
- **ReceiveMessageWaitTimeSeconds:** 1 – 20 seconds
- **Benefits:** fewer API calls, lower cost, reduced latency

```
# Long poll example:
# Consumer polls → No message → Wait up to 20 sec
# Message arrives at 5 sec → Return immediately
```

### 7.3 Best Practice

**ใช้ Long Polling เสมอ** — ประหยัด cost และลด latency

---

## 8. Lambda Integration with SQS

**Event Source Mapping:** Lambda สามารถ poll SQS queue โดยอัตโนมัติ:

- Lambda polls queue และ invoke function synchronously
- แต่ละ message ถูก process โดย Lambda function
- รองรับ Standard และ FIFO queues
- **Concurrency:** Lambda processes multiple messages concurrently
- **Error handling:** Failed messages → retry → DLQ

**Lambda SQS integration:**
```json
{
  "EventSource": "aws:sqs",
  "QueueUrl": "https://sqs.region.amazonaws.com/account-id/queue-name",
  "BatchSize": 10,
  "MaximumBatchingWindow": 60
}
```

---

## 9. Standard Queue vs FIFO Queue Summary

| Feature | Standard Queue | FIFO Queue |
|---------|---------------|------------|
| **Ordering** | Best-effort | Guaranteed FIFO |
| **Delivery** | At-least-once | Exactly-once |
| **Throughput** | Unlimited TPS | 300 TPS (3,000 with batching) |
| **Duplicates** | May occur | No duplicates |
| **Naming** | Any name | Must end with `.fifo` |
| **Message groups** | Not supported | Supported |
| **Deduplication** | Not needed | Content-based or explicit ID |
| **Cost** | Pay per request | Pay per request (higher) |

---

## 10. Architecture Patterns

### 10.1 Simple Producer-Consumer

```
[Producer] → [SQS Queue] → [Consumer]
```

Producer ส่ง message เข้า queue, Consumer ดึงออกมาประมวลผล

### 10.2 Multiple Producers

```
[Producer A] ─┐
[Producer B] ─┼→ [SQS Queue] → [Consumer]
[Producer C] ─┘
```

หลาย producers ส่งไป queue เดียวกัน

### 10.3 Multiple Consumers (Competing Consumers)

```
                         ┌→ [Consumer A]
[SQS Queue] → messages ─┼→ [Consumer B]
                         └→ [Consumer C]
```

แต่ละ message ถูก process โดย consumer ตัวใดตัวหนึ่งเท่านัน

### 10.4 Fan-Out Pattern (SNS → SQS)

```
[Producer] → [SNS Topic] → [SQS Queue 1] → [Consumer 1]
                        → [SQS Queue 2] → [Consumer 2]
```

SNS fan-out ไปหลาย SQS queues

### 10.5 Dead Letter Queue Pattern

```
[Queue] → [Consumer] → [Success: Delete]
              ↓
         [MaxReceiveCount exceeded]
              ↓
            [DLQ]
```

Failed messages ไป DLQ

---

## 11. Monitoring และ Metrics

### 11.1 CloudWatch Metrics

| Metric | คำอธิบาย |
|--------|----------|
| **NumberOfMessagesSent** | Messages ที่ถูกส่งเข้า queue |
| **NumberOfMessagesReceived** | Messages ที่ถูก received โดย consumers |
| **NumberOfMessagesDeleted** | Messages ที่ถูก deleted |
| **ApproximateNumberOfMessagesVisible** | Messages ที่พร้อมถูก consume |
| **ApproximateNumberOfMessagesNotVisible** | Messages ที่กำลังถูก process (in-flight) |
| **ApproximateAgeOfOldestMessage** | เวลาที่ oldest visible message อยู่ใน queue |
| **ReceiveMessageWaitTimeAverage** | Average long poll wait time |
| **SentMessageSize** | ขนาดของ message ที่ส่ง |

### 11.2 CloudWatch Alarms

**Common alarms:**
- `ApproximateNumberOfMessagesVisible` > threshold (backlog building)
- `ApproximateAgeOfOldestMessage` > threshold (slow processing)
- `NumberOfMessagesDeleted` = 0 for extended period (consumer failure)

---

## 12. Limits

| Limit | Value |
|-------|-------|
| **Message body size** | 256 KB (2 GB via S3 Extended Client) |
| **Message retention** | 60 sec – 14 days |
| **Queue name length** | Up to 80 characters |
| **Maximum messages in queue** | Unlimited (no hard limit) |
| **Message attributes** | Up to 10 |
| **Message attribute value size** | 256 KB total |
| **Receive batch size** | Up to 10 messages |
| **Visibility timeout** | 0 – 12 hours |
| **Delay seconds** | 0 – 900 seconds |
| **FIFO throughput** | 300 TPS (up to 3,000 with batching) |
| **DLQ max receive count** | 1 – 1000 |

---

## 13. Pricing

**SQS ไม่มี reserved capacity — pay per use:**

| Component | Cost |
|-----------|------|
| **Standard Queue** | $0.40 per 1 million requests |
| **FIFO Queue** | $0.50 per 1 million requests |
| **Data transfer** | Data transfer in/out เหมือน EC2 |
| **Long poll** | Long poll ไม่มีค่าใช้จ่ายเพิ่ม |

**Tips to reduce cost:**
- ใช้ long polling แทน short polling
- Batch operations (SendMessageBatch, DeleteMessageBatch)
- ใช้ message ขนาดเล็กที่สุดเท่าที่จะทำได้
- ใช้ SSE-KMS แทน CMK ที่ดีกว่า (customer managed CMKs มีค่าใช้จ่ายเพิ่ม)

---

## 14. Use Cases

### 14.1 Microservices Communication
- Decouple services that run at different times
- Buffer requests during peak load

### 14.2 Batch Job Processing
- Accept batch jobs into queue
- Workers process jobs at their own pace

### 14.3 Distributed Task Processing
- Distribute tasks across multiple workers
- Automatic retry with visibility timeout

### 14.4 Event-Driven Architecture
- Buffer events between producer and processor
- Lambda + SQS event source mapping

### 14.5 Order Processing (FIFO)
- Process orders in exact sequence
- Prevent duplicate order processing

### 14.6 SQS vs SNS vs Kafka

| Feature | SQS | SNS | Kafka |
|---------|-----|-----|-------|
| **Type** | Message Queue | Pub/Sub | Event Streaming |
| **Pattern** | Point-to-point | Fan-out | Streaming |
| **Message consumption** | Once at a time | All subscribers | All consumers |
| **Ordering** | FIFO (FIFO queues) | None | Partition ordering |
| **Replay** | No | No | Yes |
| **Retention** | Up to 14 days | Ephemeral | Configurable |
| **Throughput** | Unlimited (Standard) | High | Very high |
| **Managed** | Fully (AWS) | Fully (AWS) | MSK (AWS) or self-managed |

---

## 15. Best Practices

1. **ใช้ Long Polling** — ลด cost และ latency
2. **Set appropriate visibility timeout** — ควรเผื่อเวลาประมวลผลสูงสุด + buffer
3. **Use idempotent processing** — เพราะ at-least-once delivery
4. **Implement DLQ** — สำหรับ messages ที่ fail ซ้ำๆ
5. **Monitor ApproximateAgeOfOldestMessage** — เพื่อ detect backlog
6. **Use FIFO for order-sensitive work** — เสีย cost เล็กน้อยแลกกับ guarantee
7. **Batch operations** — SendMessageBatch, DeleteMessageBatch
8. **Use CloudWatch alarms** — alert ก่อน queue มีปัญหา
9. **Encrypt sensitive data** — ใช้ SSE-KMS หรือ client-side encryption
10. **Design for eventual scaling** — start with visibility timeout และ scaling ตาม

---

## 16. ลิงค์อ้างอิง

- [SQS Developer Guide](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/)
- [SQS API Reference](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/)
- [SQS Pricing](https://aws.amazon.com/sqs/pricing/)
- [SQS FAQ](https://aws.amazon.com/sqs/faqs/)

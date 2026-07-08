# Amazon SNS (Simple Notification Service) — คู่มือฉบับสมบูรณ์

> แหล่งอ้างอิง: [Amazon SNS Developer Guide](https://docs.aws.amazon.com/sns/)
> แหล่งอ้างอิง: [SNS FIFO Topics](https://docs.aws.amazon.com/sns/latest/dg/sns-fifo-topics.html)
> แหล่งอ้างอิง: [SNS Pricing](https://aws.amazon.com/sns/pricing/)

---

## 1. ภาพรวม (Overview)

Amazon Simple Notification Service (SNS) คือ fully managed pub/sub messaging และ mobile notifications service ที่ให้เราส่ง message จาก publisher ไปยัง subscribers ได้อย่างง่ายดาย

**SNS เป็น pub/sub (publisher/subscriber) system** — publisher ส่ง message ไปยัง "topic" และ subscribers ที่ subscribe กับ topic นั้นจะได้รับ message ทั้งหมด

**Key characteristics:**
- **Fully managed** — ไม่ต้อง manage servers, infrastructure, or capacity planning
- **Pub/Sub messaging** — one publisher → many subscribers (fan-out)
- **Multiple protocols** — SQS, Lambda, HTTP(S), Email, SMS, Mobile push
- **Highly available** — messages stored redundantly across multiple AZs
- **Decoupling** — publisher และ subscriber ไม่ต้องรู้จักกัน
- **Message filtering** — subscribers สามารถกรอง message ตาม attributes
- **Mobile notifications** — push notifications ไป mobile devices

---

## 2. Core Concepts

### 2.1 Topic

Topic คือ channel หรือ logical access point ที่ publisher ส่ง message ไป:

- **Globally unique name** — ต้อง unique ภายใน AWS account
- **Region-specific** — ถูกสร้างใน specific AWS region
- **Message publication** — publisher ส่ง message ไปที่ topic ARN

```
# Topic ARN format
arn:aws:sns:region:account-id:topic-name
```

### 2.2 Publisher

Publisher (หรือ producer) คือ application ที่ส่ง message ไปยัง SNS topic:

- ไม่ต้องรู้ว่าใครจะได้รับ message
- ส่ง message ไป topic เดียว
- Message ถูก distributed ไปยัง subscribers ทั้งหมด

### 2.3 Subscriber

Subscriber คือ endpoint ที่รับ message จาก topic:

- **Protocol types:** SQS, Lambda, HTTP(S), Email, SMS, Mobile push, Kinesis Data Firehose
- Subscribe ไปยัง topic
- ได้รับทุก message ที่ถูก publish ไปยัง topic นั้น (หรือกรองตาม filter policy)

### 2.4 Message

| Component | คำอธิบาย |
|-----------|----------|
| **Topic ARN** | Topic ที่ message ถูกส่งไป |
| **Subject** | Optional short description (max 100 characters) |
| **Body** | Message content (up to 256 KB) |
| **Message ID** | Unique identifier |
| **Timestamp** | เวลาที่ message ถูก published |
| **Message attributes** | Optional metadata (type, name, value) — สำหรับ filtering |
| **Structure** | Raw string หรือ JSON (JSON is recommended) |

### 2.5 Subscription

Subscription คือการเชื่อมต่อระหว่าง topic กับ endpoint:

- ต้อง subscribe endpoint ไปยัง topic ก่อนถึงจะได้รับ messages
- Subscription มี status: `Confirmed`, `Pending`, `Deleted`
- สามารถ subscribe หลาย endpoints ไปยัง topic เดียวกันได้

---

## 3. Topic Types

### 3.1 Standard Topic (Default)

**Best-effort ordering** — messages อาจถูก deliver ไม่ตรงลำดับ

**Characteristics:**
- **At-least-once delivery** — message อาจถูก deliver มากกว่า 1 ครั้ง
- **Best-effort ordering** — ไม่ guarantee ลำดับ
- **Very high throughput** — ไม่มี limit ตายตัว
- **Multiple subscribers** — support หลาย protocols

**Use cases:**
- Application alerts
- Event broadcasting
- Fan-out to multiple systems

### 3.2 FIFO Topic

**Guaranteed ordering** — messages ถูกส่งและรับตามลำดับที่ส่งเข้ามาอย่างเคร่งครัด

**Characteristics:**
- **Exactly-once delivery** — message ถูก delivered หนึ่งครั้งเท่านั้น
- **FIFO ordering** — ลำดับแน่นอน
- **Message groups** — multiple ordered groups within a topic
- **Deduplication** — built-in deduplication 5 นาที

**Requirements:**
- Topic name ต้องลงท้ายด้วย `.fifo`
- Subscribers ต้อง be FIFO-capable (SQS FIFO หรือ Lambda)
- Message group ID ต้องระบุสำหรับ message ordering

**Use cases:**
- Financial transactions
- Order processing
- Systems requiring exact order

---

## 4. Protocols และ Endpoints

### 4.1 Amazon SQS

ส่ง message ไปยัง SQS queue:

```
[SNS Topic] → [SQS Queue] → [Consumer]
```

**Characteristics:**
- เหมาะสำหรับ queue-based processing
- รองรับ Standard และ FIFO queues
- Message ถูกส่งเป็น JSON envelope
- ใช้ SQS queue as subscriber เพื่อ buffer messages

**Benefits over direct SNS:**
- Persistence (SQS retains messages until consumed)
- Retry handling
- Batch processing

### 4.2 AWS Lambda

ส่ง message ไป trigger Lambda function:

```
[SNS Topic] → [Lambda Function] → [Process]
```

**Characteristics:**
- Synchronous invocation
- Event object contains SNS message
- Lambda processes message on-demand
- Supports retry with DLQ

### 4.3 HTTP(S) / Webhook

ส่ง message ไปยัง web endpoint:

```
[SNS Topic] → [HTTP/HTTPS Endpoint] → [Webhook Receiver]
```

**Characteristics:**
- HTTP POST request to subscriber endpoint
- Must confirm subscription (via validation token)
- Supports custom headers
- Retry on failure (with exponential backoff)

### 4.4 Email

ส่ง email notification:

```
[SNS Topic] → [Email] → [User Inbox]
```

**Characteristics:**
- JSON or plain text messages
- Email must be confirmed subscription
- Subject prefix option
- เหมาะสำหรับ admin alerts

**Email-JSON vs Email:** Email-JSON ส่ง structured JSON payload, Email ส่ง plain text

### 4.5 SMS

ส่ง text message ไปยัง mobile phones:

```
[SNS Topic] → [SMS] → [Mobile Device]
```

**Characteristics:**
- Worldwide SMS delivery
- Cost varies by country
- Sender ID support (in supported countries)
- เหมาะสำหรับ critical alerts

### 4.6 Mobile Push

ส่ง push notifications ไปยัง mobile devices:

**Platforms:**
- **Apple Push Notification Service (APNs)** — iOS, macOS
- **Firebase Cloud Messaging (FCM)** — Android
- **Amazon Device Messaging (ADM)** — Kindle
- **Windows Push Notification Services (WNS)** — Windows
- **Microsoft Push Notification Service (MPNS)** — Windows Phone

**Message types:**
- **Notification** — predefined UI (handled by OS)
- **Data** — custom payload (handled by app)
- **Mixed** — both notification and data

### 4.7 Kinesis Data Firehose

ส่ง message ไปยัง Kinesis Data Firehose:

```
[SNS Topic] → [Kinesis Data Firehose] → [S3 / Redshift / Elasticsearch]
```

**Characteristics:**
- Near real-time streaming
- Batch delivery to destinations
- Automatic retries

---

## 5. Message Filtering

SNS Message Filtering ช่วยให้ subscribers ได้รับเฉพาะ message ที่ต้องการ:

### 5.1 Filter Policy

JSON policy ที่กำหนดว่า message attribute ต้องมีค่าอะไรถึงจะ deliver:

```json
{
  "store": ["example_corp"],
  "event": ["order_placed", "order_shipped"]
}
```

### 5.2 Message Attributes vs Message Body

| Component | Filterable | Description |
|-----------|-----------|-------------|
| **Message Attributes** | ✅ Yes | Metadata แนบมากับ message (type, name, value) |
| **Message Body** | ❌ No | Content ของ message เอง |
| **Message Tags** | ✅ Yes | SNS topic tags |

### 5.3 Filter Policy Examples

```json
// Example 1: Filter by single attribute
{
  "eventType": ["order", "shipment"]
}

// Example 2: Multiple attributes (AND logic)
{
  "eventType": ["order"],
  "region": ["us-east-1"]
}

// Example 3: Numeric matching
{
  "price": [{"numeric": [">", 100]}]
}

// Example 4: Prefix matching
{
  "category": [{"prefix": "electronics/"}]
}
```

### 5.4 Setting Filter Policies

- Filter policy ตั้งที่ subscription level ไม่ใช่ topic level
- Subscription ที่ไม่มี filter policy จะได้รับทุก message
- Default: ไม่มี filter (receive all)

---

## 6. Message Fan-Out

### 6.1 Fan-Out Pattern

```
[Publisher] → [SNS Topic] → [SQS Queue 1] → [Consumer 1]
                        → [SQS Queue 2] → [Consumer 2]
                        → [Lambda] → [Processor]
                        → [HTTP Endpoint] → [Webhook]
```

**Use cases:**
- Broadcast events to multiple systems
- Replicate data across multiple queues
- Trigger multiple processing pipelines

### 6.2 Fan-Out to Lambda

```
[SNS Topic] → [Lambda 1]
            → [Lambda 2]
            → [Lambda 3]
```

- Lambda processes each message concurrently
- Each Lambda function is independent

### 6.3 Fan-Out to SQS (with DLQ per queue)

```
[SNS Topic] → [SQS Queue A] → [Consumer A]
            → [SQS Queue B] → [Consumer B]
```

- Each queue can have its own DLQ
- Different consumers for different processing needs

---

## 7. Security

### 7.1 Encryption

| Type | คำอธิบาย |
|------|----------|
| **In-flight (TLS)** | Messages encrypted ระหว่าง publisher/SNS และ SNS/subscriber |
| **At-rest (SSE)** | Server-side encryption ใช้ AWS managed keys |
| **Customer managed keys** | SSE-KMS ด้วย CMK ที่ตั้งเอง (audit ได้, rotate ได้) |
| **Client-side** | Encrypt message ก่อนส่งไป SNS |

### 7.2 Access Control (IAM)

**IAM policies สำหรับ SNS:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"AWS": "arn:aws:iam::123456789012:user/username"},
      "Action": [
        "sns:Publish",
        "sns:Subscribe"
      ],
      "Resource": "arn:aws:sns:us-east-1:123456789012:my-topic"
    }
  ]
}
```

### 7.3 Topic Resource Policy

SNS topic policies (similar to S3 bucket policies):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"AWS": "*"},
      "Action": "sns:Publish",
      "Resource": "arn:aws:sns:us-east-1:123456789012:my-topic",
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": "arn:aws:s3:::my-bucket"
        }
      }
    }
  ]
}
```

**Use cases:**
- Cross-account access
- Allow specific services to publish
- Restrict by IP

### 7.4 VPC Endpoints (PrivateLink)

เข้าถึง SNS ผ่าน private IP โดยไม่ต้องผ่าน internet:

```bash
# Create VPC endpoint for SNS
aws ec2 create-vpc-endpoint \
  --vpc-id vpc-xxxxx \
  --service-name com.amazonaws.us-east-1.sns \
  --vpc-endpoint-type Interface
```

---

## 8. Message Structure

### 8.1 Message JSON Format

SNS wraps the original message:

```json
{
  "Message": "{\"orderId\": \"12345\", \"status\": \"shipped\"}",
  "MessageId": "unique-message-id",
  "Timestamp": "2024-01-15T10:30:00.000Z",
  "TopicArn": "arn:aws:sns:us-east-1:123456789012:my-topic",
  "Type": "Notification",
  "Subject": "Order Shipped",
  "MessageAttributes": {
    "eventType": {
      "Type": "String",
      "Value": "order_shipped"
    }
  }
}
```

### 8.2 Message Attributes

Optional metadata for filtering:

```json
{
  "eventType": {
    "Type": "String",
    "Value": "order_placed"
  },
  "priority": {
    "Type": "Number",
    "Value": "1"
  }
}
```

**Supported types:** String, Number, Binary

### 8.3 Raw Message Delivery

ถ้าเปิด Raw Message Delivery:
- Message ถูกส่งไปโดยไม่ wrap ใน SNS JSON envelope
- Subscriber ได้รับ message body โดยตรง
- เหมาะสำหรับ simple consumers

---

## 9. Subscription Confirmation

### 9.1 HTTP/HTTPS Endpoint Confirmation

เมื่อ subscribe HTTP endpoint ใหม่:

```
1. SNS sends subscription confirmation request to endpoint
2. Endpoint must call ConfirmSubscription with token
3. Subscription becomes active
```

**Confirmation request:**
```json
{
  "Type": "SubscriptionConfirmation",
  "MessageId": "...",
  "Token": "...",
  "TopicArn": "...",
  "SubscribeURL": "https://sns.region.amazonaws.com/..."
}
```

### 9.1 Email Confirmation

เมื่อ subscribe email:

```
1. SNS sends confirmation email
2. User clicks confirmation link
3. Subscription becomes active
```

---

## 10. Monitoring และ Metrics

### 10.1 CloudWatch Metrics

| Metric | คำอธิบาย |
|--------|----------|
| **NumberOfMessagesPublished** | Messages ที่ถูก published ไป topic |
| **NumberOfNotificationsDelivered** | Notifications ที่ถูก delivered ไป subscribers |
| **PublishSize** | ขนาดของ message ที่ published |
| **PublishingLatency** | เวลาตั้งแต่ publish จน SNS receive |
| **NumberOfSubscriptionsPending** | Subscriptions ที่ยัง pending |
| **NumberOfSubscriptionsRejected** | Subscriptions ที่ถูก reject (access denied) |

### 10.2 SNS Topic Metrics

| Metric | คำอธิบาย |
|--------|----------|
| **NumberOfMessagesPublishedToTopic** | Messages published ไป topic นี้ |
| **NumberOfNotificationsDeliveredToTopic** | Notifications delivered ไป subscribers ของ topic |
| **NumberOfNotificationsFailed** | Notifications ที่ fail |

### 10.3 CloudWatch Alarms

```bash
# Example: Alarm when publish rate drops
aws cloudwatch put-metric-alarm \
  --alarm-name sns-low-publishing \
  --metric-name NumberOfMessagesPublished \
  --namespace AWS/SNS \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator LessThanThreshold \
  --dimensions Name=TopicName,Value=my-topic
```

---

## 11. SNS + SQS Fan-Out Pattern

### 11.1 Pattern Overview

```
[S3 Event] → [SNS Topic] → [SQS Queue 1] → [Worker 1]
                        → [SQS Queue 2] → [Worker 2]
                        → [SQS Queue 3] → [Worker 3]
```

### 11.2 Benefits

- **Decoupling:** S3 event and processing are decoupled
- **Persistence:** Messages buffered in SQS if workers are slow
- **Parallel processing:** Multiple workers process simultaneously
- **Isolation:** Failure in one worker doesn't affect others
- **Replay:** SQS retains messages for replay

### 11.3 Implementation

```
1. Create SNS topic
2. Create multiple SQS queues
3. Subscribe each SQS queue to SNS topic
4. Set appropriate filter policies (optional)
5. S3 event notification → SNS topic
```

---

## 12. SNS vs SQS vs Kafka

| Feature | SNS | SQS | Kafka |
|---------|-----|-----|-------|
| **Type** | Pub/Sub | Message Queue | Event Streaming |
| **Pattern** | Fan-out | Point-to-point | Streaming |
| **Message consumption** | All subscribers | One consumer | All consumers (per partition) |
| **Delivery** | At-least-once (Standard) / Exactly-once (FIFO) | At-least-once (Standard) / Exactly-once (FIFO) | At-least-once |
| **Ordering** | None (Standard) / FIFO (FIFO) | Per-queue (FIFO) | Per-partition |
| **Replay** | No | No | Yes (retain offset) |
| **Retention** | Ephemeral | Up to 14 days | Configurable (hours to unlimited) |
| **Throughput** | Very high | Unlimited (Standard) | Very high |
| **Protocols** | SQS, Lambda, HTTP, Email, SMS, Push | Poll-based | Consumer groups |
| **Message filtering** | Yes (Subscription-level) | No | Yes (consumer-side) |
| **Fan-out** | Native | Via SNS fan-out | Via consumer groups |
| **Dead letter queue** | Via Lambda/SQS DLQ | Native DLQ | Via consumer lag |
| **Managed** | Fully (AWS) | Fully (AWS) | MSK (AWS) or self-managed |

---

## 13. Limits

| Limit | Value |
|-------|-------|
| **Message body size** | 256 KB |
| **Message subject length** | 100 characters |
| **Message attributes** | Up to 10 |
| **Message attribute value size** | 256 KB per attribute |
| **Topic name length** | Up to 256 characters |
| **Subscription per topic** | 12,500,000 (default) |
| **Filter policy size** | 256 KB |
| **Raw message delivery** | Per-subscription setting |
| **FIFO topic throughput** | 300 TPS (with batching 3000) |
| **SMS sender ID** | 11 alphanumeric characters (US) |

---

## 14. Pricing

**SNS pay per use:**

| Component | Cost |
|-----------|------|
| **Publish** | $0.50 per 1 million publishes |
| **Notification delivery (SQS, Lambda, HTTP/S)** | $0.50 per 1 million deliveries |
| **Notification delivery (Email, SMS, Push)** | Varies by destination country |
| **Data transfer** | Data transfer in/out เหมือน EC2 |
| **SSE-KMS** | KMS key costs |

**Tips to reduce cost:**
- Use batching where possible
- Filter at SNS level แทน Lambda level (ประหยัด Lambda invocations)
- Use topic ARN prefix แทน subject-based routing
- Consider SQS fan-out for high-volume scenarios

---

## 15. Best Practices

1. **ใช้ SNS สำหรับ fan-out, SQS สำหรับ persistence** — SNS + SQS pattern
2. **ใช้ FIFO topics สำหรับ order-sensitive work** — guarantee ordering + exactly-once
3. **ใช้ message attributes สำหรับ filtering** — ลด unnecessary processing
4. **ใช้ HTTPS endpoints ที่มี TLS** — encrypt data in transit
5. **Confirm subscriptions in production** — prevent unauthorized subscriptions
6. **Monitor NumberOfNotificationsFailed** — detect delivery issues
7. **Set appropriate retry policies** — for HTTP/HTTPS endpoints
8. **ใช้ DLQ** — สำหรับ failed Lambda invocations
9. **Encrypt sensitive messages** — ใช้ SSE-KMS หรือ client-side encryption
10. **Separate topics for different environments** — dev vs prod
11. **Use AWS SAM or CloudFormation** — for infrastructure as code
12. **Set CloudWatch alarms** — for publish rate anomalies

---

## 16. Common Use Cases

### 16.1 Application Alerts
```
[CloudWatch Alarm] → [SNS Topic] → [Email/SMS]
```

### 16.2 Event-Driven Architecture
```
[S3 Event] → [SNS Topic] → [Lambda] → [Process]
```

### 16.3 Microservices Fan-Out
```
[Order Service] → [SNS Topic] → [Email Service]
                               → [Shipping Service]
                               → [Inventory Service]
                               → [Analytics Service]
```

### 16.4 Mobile Push Notifications
```
[Backend] → [SNS Topic] → [APNs] → [iOS App]
                          → [FCM] → [Android App]
```

### 16.5 Cross-Region Replication
```
[SNS Topic US-EAST] → [SQS Queue US-WEST]
```

---

## 17. ลิงค์อ้างอิง

- [SNS Developer Guide](https://docs.aws.amazon.com/sns/)
- [SNS API Reference](https://docs.aws.amazon.com/sns/latest/api/)
- [SNS Pricing](https://aws.amazon.com/sns/pricing/)
- [SNS FAQ](https://aws.amazon.com/sns/faqs/)
- [SNS Message Filtering](https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html)
- [SNS FIFO Topics](https://docs.aws.amazon.com/sns/latest/dg/sns-fifo-topics.html)

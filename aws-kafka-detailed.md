# Apache Kafka บน AWS — คู่มือฉบับสมบูรณ์

> แหล่งอ้างอิง: [Amazon MSK Developer Guide](https://docs.aws.amazon.com/msk/)
> แหล่งอ้างอิง: [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
> แหล่งอ้างอิง: [Amazon MSK Pricing](https://aws.amazon.com/msk/pricing/)

---

## 1. ภาพรวม (Overview)

Apache Kafka คือ distributed event streaming platform ที่ใช้สำหรับ building real-time streaming pipelines และ event-driven applications

**Kafka เป็น distributed streaming system** — messages ถูกเก็บใน log-based structure ที่เรียกว่า topic ซึ่งถูก partitioned และ replicated ข้าม brokers หลายตัวใน cluster

**Key characteristics:**
- **Distributed** — data ถูก partitioned ข้าม multiple brokers
- **Durable** — messages ถูก persisted ลง disk (configurable retention)
- **Scalable** — scale ได้โดยเพิ่ม brokers และ partitions
- **Ordered within partition** — messages ใน partition เดียวกันมี order guarantee
- **Replay** — consumers สามารถ replay จาก offset ใดก็ได้
- **High throughput** — รองรับ millions of messages per second

**Kafka on AWS:** Amazon MSK (Managed Streaming for Apache Kafka) คือ fully managed Kafka service ที่ AWS จัดการ infrastructure ให้

---

## 2. Core Concepts

### 2.1 Topic

Topic คือ category หรือ feed ของ messages:

```
# Topic example
orders-topic
click-events-topic
sensor-data-topic
```

**Characteristics:**
- Topic ถูกจัดเก็บเป็น log (append-only)
- Messages ใน topic มี order
- Topic ถูก consumed โดย multiple consumers
- Topic มี configurable retention period

### 2.2 Message (Record)

Message (Kafka record) ประกอบด้วย:

| Component | คำอธิบาย |
|-----------|----------|
| **Key** | Optional — ใช้สำหรับ partition routing (same key → same partition) |
| **Value** | Message payload (up to 1 MB default, configurable up to 10 MB) |
| **Timestamp** | เวลาที่ message ถูก produce |
| **Headers** | Optional metadata (key-value pairs) |
| **Offset** | Unique sequential ID ของ message ใน partition |

### 2.3 Partition

Partition คือ fundamental unit of parallelism ใน Kafka:

```
[Topic: orders-topic]
├── Partition 0  → [offset 0, 1, 2, 3, ...]
├── Partition 1  → [offset 0, 1, 2, ...]
└── Partition 2  → [offset 0, 1, 2, ...]
```

**Characteristics:**
- Topic ถูก split เป็นหลาย partitions
- Each partition อยู่บน broker เดียว (แต่ broker มีได้หลาย partitions)
- Messages ภายใน partition มี order guarantee
- Partition สามารถ replicated ไปยัง brokers อื่น

**Partitioning strategy:**
- **By key:** messages ที่มี key เดียวกันไป partition เดียวกันเสมอ
- **By value:** ใช้ message value เพื่อ hash
- **Custom partitioner:** developer-defined logic

### 2.4 Offset

Offset คือ sequential ID ของ message ใน partition:

```
Partition 0:
[offset 0: "order_123"] → [offset 1: "order_456"] → [offset 2: "order_789"]
```

**Consumer offset:**
- Consumer จำ offset ของ message ล่าสุดที่ consume แล้ว
- Consumer group offset ถูก commit เป็น offset ล่าสุดที่ processed
- เปลี่ยน offset ที่ commit = replay

### 2.5 Producer

Producer คือ application ที่ publish messages ไปยัง Kafka topic:

```
[Producer] → [Topic Partition 0]
           → [Topic Partition 1]
           → [Topic Partition 2]
```

**Producer behaviors:**
- เลือก partition สำหรับ message (by key hash or round-robin)
- รับ acknowledgement (acks) ตาม configuration
- Retry on failure

**Producer acknowledgements (acks):**

| Setting | Behavior | Durability |
|---------|---------|------------|
| **acks=0** | Fire and forget — ไม่รอ acknowledgement | Lowest |
| **acks=1** | Wait for leader partition write | Medium |
| **acks=all (-1)** | Wait for all in-sync replicas | Highest |

### 2.6 Consumer

Consumer คือ application ที่ subscribe และ consume messages จาก topic:

```
[Consumer Group A]
├── Consumer 1 → [Topic Partition 0]
├── Consumer 2 → [Topic Partition 1]
└── Consumer 3 → [Topic Partition 2]
```

**Consumer group:**
- 多个 consumers รวมกันเป็น consumer group
- แต่ละ partition ถูก consume โดย consumer เดียวใน group
- Multiple groups = same message ถูก consume หลายครั้ง

### 2.7 Broker

Broker คือ Kafka server ที่เก็บ messages:

```
[Broker 1] ← leader for Partition 0, follower for Partition 1
[Broker 2] ← leader for Partition 1, follower for Partition 2
[Broker 3] ← leader for Partition 2, follower for Partition 0
```

**Broker responsibilities:**
- เก็บ messages (write to disk)
- Serve produce/consume requests
- Replicate partitions to other brokers
- Handle leader elections

### 2.8 Replica

Replicas ทำให้ Kafka durable และ fault-tolerant:

**Replica types:**

| Type | Description |
|------|-------------|
| **Leader** | รับ read/write requests ทั้งหมด |
| **Follower** | Replicate messages จาก leader |
| **ISR (In-Sync Replica)** | Replicas ที่ catch up กับ leader (lag < replica.lag.max.messages) |

**Replication factor:**
- `replication.factor = 3` หมายว่าแต่ละ partition มี 3 copies
- `min.insync.replicas = 2` หมายว่าต้องมีอย่างน้อย 2 ISR ก่อน write succeed

---

## 3. Kafka Architecture

### 3.1 Kafka Cluster

```
┌─────────────────────────────────────────────────────────┐
│                    Kafka Cluster                         │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │  Broker  │  │  Broker  │  │  Broker  │               │
│  │    1     │  │    2     │  │    3     │               │
│  │          │  │          │  │          │               │
│  │ P0(L),P1 │  │ P1(L),P2 │  │ P2(L),P0 │               │
│  │   (F)    │  │   (F)    │  │   (F)    │               │
│  └──────────┘  └──────────┘  └──────────┘               │
│                                                          │
│  Zookeeper / KRaft (Kafka 3.5+)                         │
└─────────────────────────────────────────────────────────┘
```

**Components:**
- **Broker:** Kafka server ที่เก็บ messages
- **ZooKeeper (pre-3.5):** จัดการ cluster metadata, leader election
- **KRaft (3.5+):** Kafka's own consensus protocol — แทน ZooKeeper

### 3.2 Message Flow (Producer → Kafka → Consumer)

```
1. Producer publishes message to Topic Partition
   → Broker receives message
   → Leader partition writes to disk
   → Follower partitions replicate

2. Consumer polls for messages
   → Consumer specifies topic + partition + offset
   → Broker returns messages from offset
   → Consumer processes messages
   → Consumer commits offset
```

### 3.3 Kafka Topic Replication

```
Topic: orders-topic, Partitions: 3, Replication Factor: 3

Broker 1: Partition 0 (Leader), Partition 1 (Follower), Partition 2 (Follower)
Broker 2: Partition 0 (Follower), Partition 1 (Leader), Partition 2 (Follower)
Broker 3: Partition 0 (Follower), Partition 1 (Follower), Partition 2 (Leader)
```

---

## 4. Consumer Groups และ Partition Assignment

### 4.1 Consumer Group

Consumer group คือ set ของ consumers ที่ collaborate เพื่อ consume topic:

```
Consumer Group "order-processors"
├── Consumer 1 → Partition 0
├── Consumer 2 → Partition 1
└── Consumer 3 → Partition 2
```

**Rules:**
- แต่ละ partition ถูก assign ให้ consumer เดียวใน group
- Consumer เพิ่ม/ลด → partitions ถูก rebalanced
- Different consumer groups = independent consumption (each gets all messages)

### 4.2 Partition Rebalance

เมื่อ consumer joins or leaves group → partitions ถูก reassign:

**Rebalance triggers:**
- Consumer ตายหรือ disconnect
- Consumer ใหม่ join
- Consumer group metadata changes

**Rebalance process:**
```
1. Consumer sends JoinGroup request to broker
2. Group leader triggers rebalance
3. Partitions reassigned to members
4. Each consumer gets new partition assignment
5. Consumers resume from last committed offset
```

**Consumer group offsets:**
- Offsets ถูก committed ไปที่ `__consumer_offsets` topic
- `auto.offset.reset` = earliest (rewind) หรือ latest (from current)

### 4.3 Scaling Consumers

**Scaling up:**
```
3 partitions → 4 consumers (1 consumer idle)
```

**Scaling down:**
```
4 consumers → 3 consumers (rebalance occurs)
```

**Maximum consumers:** ไม่เกินจำนวน partitions (เพราะ 1 partition ต่อ 1 consumer)

---

## 5. Kafka Topic Configuration

### 5.1 Retention

Messages ถูกเก็บไว้ตาม retention period:

| Setting | Description |
|---------|-------------|
| **log.retention.hours** | เก็บ hours ที่กำหนด (default: 168 = 7 days) |
| **log.retention.bytes** | เก็บ bytes สูงสุดต่อ partition |
| **log.retention.check.interval.ms** | ความถี่ในการเช็ค retention |

**Retention strategies:**
- **Time-based:** เก็บ X ชั่วโมง/วัน/weeks
- **Size-based:** เก็บจนถึงขนาดสูงสุด
- **Segment-based:** ลบ segment files เก่าๆ

### 5.2 Replication Factor

| Setting | Description |
|---------|-------------|
| **replication.factor** | จำนวน copies ของแต่ละ partition |
| **min.insync.replicas** | minimum ISR สำหรับ write to succeed |

**Recommendations:**
- `replication.factor = 3` (production)
- `min.insync.replicas = 2`

### 5.3 Partition Count

จำนวน partitions กำหนด:
- **Parallelism:** partitions = max consumers in group
- **Throughput:** partitions = max producers × 3 (for replication)
- **Broker distribution:** partitions ควรกระจายข้าม brokers

### 5.4 Other Important Configs

| Config | Default | Description |
|--------|---------|-------------|
| **num.io.threads** | 8 | Threads สำหรับ disk I/O |
| **num.network.threads** | 3 | Threads สำหรับ network requests |
| **socket.send.buffer.bytes** | 100 MB | TCP send buffer |
| **socket.receive.buffer.bytes** | 100 MB | TCP receive buffer |
| **log.segment.bytes** | 1 GB | Segment file size |
| **message.max.bytes** | 1 MB | Max message size (up to 10 MB) |

---

## 6. Amazon MSK (Managed Streaming for Apache Kafka)

### 6.1 What is Amazon MSK?

Amazon MSK คือ fully managed Kafka service:

- **AWS manages:** ZooKeeper nodes, brokers, OS patches, Kafka upgrades
- **User manages:** Topic configuration, producer/consumer apps, scaling
- **High availability:** MSK automatically replaces failed brokers
- **Security:** VPC isolation, encryption at rest and in transit, IAM

### 6.2 MSK Cluster Types

| Type | Description |
|------|-------------|
| **MSK Serverless** | Auto-provisioning, no capacity planning |
| **MSK PRO** | Pay for brokers + storage |
| **MSK Standard** | Broker-level pricing |

### 6.3 MSK Networking

**VPC Mode (default):**
```
[Your VPC] → [MSK Cluster in VPC]
            → Security Groups control access
            → Private DNS names for brokers
```

**Public access (optional):**
```
MSK Cluster → AWS-managed network → Internet → Producer/Consumer
```

### 6.4 MSK Security

**Encryption:**
| Type | Description |
|------|-------------|
| **TLS encryption in transit** | Encrypt data between clients and brokers |
| **KMS encryption at rest** | AWS-managed or customer-managed CMK |
| **SASL/SCRAM** | Authentication with username/password |
| **IAM access control** | Fine-grained permissions via IAM |
| **Apache Kafka ACLs** | Kafka-native ACLs |

**Authentication options:**
- **TLS certificates** (mutual TLS)
- **SASL/SCRAM** (username/password)
- **IAM** (AWS identity-based)

### 6.5 MSK Broker Configuration

MSK ให้ Kafka configurations ที่ปรับแต่งได้:

```bash
# Example: Custom broker config via CloudFormation
BrokerNodeGroupInfo:
  InstanceType: kafka.m5.large
  BrokerAZDistribution: DEFAULT
  StorageInfo:
    EBSStorageInfo:
      VolumeSize: 100
      EncryptionInfos:
        Enable: true
        EncryptionType: KMS
        KMSKeyArn: arn:aws:kms:region:account:key/key-id
```

---

## 7. Kafka Connect

### 7.1 Overview

Kafka Connect คือ framework สำหรับ connecting Kafka กับ external systems:

```
[External System] ←→ [Kafka Connect] ←→ [Kafka Topic]
                  Source Connector    Sink Connector
```

**Two types of connectors:**
- **Source Connector:** reads from external system → writes to Kafka topic
- **Sink Connector:** reads from Kafka topic → writes to external system

### 7.2 Common Connectors

| Connector | Type | Use Case |
|-----------|------|----------|
| **JDBC Source** | Source | Database changes → Kafka |
| **JDBC Sink** | Sink | Kafka → Database |
| **S3 Source** | Source | S3 files → Kafka |
| **S3 Sink** | Sink | Kafka → S3 |
| **Elasticsearch Sink** | Sink | Kafka → Elasticsearch |
| **Lambda Sink (MSK Connect)** | Sink | Kafka → Lambda |

### 7.3 MSK Connect

MSK Connect คือ fully managed Kafka Connect:

- **No servers to manage** — AWS provisions workers
- **Scales automatically**
- **Supports both source and sink connectors**
- **Built-in S3, Lambda, OpenSearch connectors**

---

## 8. Kafka Streams และ AWS Lambda

### 8.1 Kafka Streams

Kafka Streams คือ library สำหรับ building stream processing applications:

**Characteristics:**
- **Lightweight** — ใช้ Kafka เป็น state store
- **Exactly-once processing** — no duplicates
- **Stateful** — รองรับ aggregations, joins
- **Scalable** — scale by adding instances

**Use cases:**
- Real-time aggregations
- Stream joins
- Windowed computations

### 8.2 AWS Lambda with Kafka

**MSK Lambda Integration:**

```
[MSK Topic] → [Lambda Event Source Mapping] → [Lambda Function]
```

**Configuration:**
```json
{
  "EventSourceArn": "arn:aws:kafka:region:account:topic/topic-name",
  "StartingPosition": "LATEST",
  "BatchSize": 100,
  "MaximumBatchingWindow": 1.0
}
```

**Lambda Kafka consumer behavior:**
- Polls MSK และ invoke Lambda synchronously
- Batch processing (processes multiple messages per invocation)
- ไม่ต้อง manage consumer group

---

## 9. Schema Registry

### 9.1 Why Schema Registry?

Kafka messages เป็นแค่ bytes — producer และ consumer ต้องตกลงกันเรื่อง schema:

**Without schema registry:**
```
Producer: {"orderId": "123", "amount": 99.99}
Consumer: expects "order_id" → ERROR
```

**With schema registry:**
```
Schema Registry (AWS Glue Schema Registry)
├── Topic: orders-topic
├── Producer → validates against schema → serialize
└── Consumer → validates against schema → deserialize
```

### 9.2 AWS Glue Schema Registry

**Features:**
- **Schema versioning** — track schema changes
- **Backward/forward compatibility** — evolve schemas safely
- **Integration** — works with MSK, Kinesis Data Analytics, Lambda
- **Supported formats:** JSON Schema, Apache Avro

**Compatibility modes:**

| Mode | Allows |
|------|--------|
| **BACKWARD** | Consumer using new schema can read old data |
| **FORWARD** | Producer using old schema can write new data |
| **FULL** | Both BACKWARD and FORWARD |
| **NONE** | No compatibility checking |

---

## 10. Security

### 10.1 Encryption

| Type | Description |
|------|-------------|
| **TLS in transit** | Encrypt between clients and brokers |
| **KMS at rest** | Encrypt stored data on brokers |
| **SASL/SCRAM** | Authentication + encrypted passwords |

### 10.2 Authentication

| Method | Description |
|--------|-------------|
| **TLS certificates** | Mutual TLS (mTLS) — certificate-based auth |
| **SASL/SCRAM** | Username/password with salted challenge |
| **IAM** | AWS IAM-based access (MSK specific) |
| **Apache Kafka ACLs** | Kafka-native authorization |

### 10.3 Authorization

**Kafka ACLs:**

```bash
# Example: Grant read on topic to principal
kafka-acls.sh \
  --authorizer-properties zookeeper.connect=localhost:2181 \
  --add \
  --allow-principal User:producer1 \
  --operation Read \
  --topic orders-topic
```

### 10.4 VPC Security

```
[Your VPC]
├── Security Group (allow port 9092/9094 for brokers)
├── MSK Cluster (in private subnets)
│   ├── Broker 1 (private IP)
│   ├── Broker 2 (private IP)
│   └── Broker 3 (private IP)
└── Clients (in same VPC or via VPC Peering)
```

---

## 11. Monitoring และ Metrics

### 11.1 CloudWatch Metrics for MSK

| Metric | Description |
|--------|-------------|
| **MessagesPerSecond** | Messages published per second |
| **BytesPerSecond** | Data throughput (bytes/sec) |
| **ProducerMessagePerSecond** | Producer throughput |
| **ConsumerMessagePerSecond** | Consumer throughput |
| **BrokerCPUUser** | CPU usage per broker |
| **ReplicaFetchRate** | Replication rate |
| **UnderMinIsrPartitionCount** | Partitions with insufficient replicas |
| **OfflinePartitionsCount** | Partitions with no leader |

### 11.2 Important Metrics to Monitor

**Consumer lag:**
```
consumer_lag = consumer_position - end_of_partition
high lag = consumer can't keep up with producer
```

**Under-replicated partitions:**
```
under_min_isr = partitions with ISR < min.insync.replicas
indicates potential data loss risk
```

**Disk usage:**
```
disk_usage > 85% = risk of broker going offline
```

### 11.3 MSK Monitoring Best Practices

```bash
# CloudWatch dashboard for MSK
# Metrics to include:
- MessagesPerSecond (sum across brokers)
- BytesPerSecond (sum across brokers)
- ConsumerLag (max across partitions)
- UnderMinIsrPartitionCount (any > 0 is problem)
- ZooKeeperSessionState (for ZooKeeper-based MSK)
```

---

## 12. MSK vs Self-Managed Kafka

| Aspect | Amazon MSK | Self-Managed Kafka |
|--------|-----------|---------------------|
| **Infrastructure** | AWS managed | You manage everything |
| **Patching** | Automatic | Manual |
| **Upgrades** | Managed upgrades | Manual |
| **High availability** | Built-in broker replacement | You implement HA |
| **Cost** | MSK pricing + storage | EC2/instances + storage |
| **Control** | Limited configurations | Full control |
| **Scaling** | Managed, some limits | Full flexibility |
| **Monitoring** | CloudWatch metrics | Your own tools |
| **Compliance** | AWS compliance programs | Your compliance |

---

## 13. Kafka vs SQS vs SNS

| Feature | Kafka | SQS | SNS |
|---------|-------|-----|-----|
| **Type** | Event Streaming | Message Queue | Pub/Sub |
| **Pattern** | Streaming | Point-to-point | Fan-out |
| **Message consumption** | All consumers (per partition) | One consumer | All subscribers |
| **Delivery guarantee** | At-least-once / Exactly-once | At-least-once / Exactly-once (FIFO) | At-least-once |
| **Ordering** | Per-partition | FIFO (FIFO queues) | None (Standard) |
| **Replay** | ✅ Yes (from any offset) | ❌ No | ❌ No |
| **Retention** | Configurable (hours to unlimited) | Up to 14 days | Ephemeral |
| **Throughput** | Very high (millions/sec) | High | High |
| **Consumer groups** | Native | Competing consumers | Multiple subscribers |
| **Message filtering** | Consumer-side | No | Subscription-level |
| **Fan-out** | Via consumer groups | Via SNS fan-out | Native |
| **Dead letter queue** | Via consumer lag/TTL | Native DLQ | Via Lambda/SQS |
| **Schema registry** | ✅ Yes (Glue) | ❌ No | ❌ No |
| **Stream processing** | Kafka Streams | ❌ No | ❌ No |
| **Managed service** | MSK | Fully managed (SQS) | Fully managed (SNS) |
| **Cost model** | Broker + storage | Per request | Per publish + delivery |

---

## 14. Common Use Cases

### 14.1 Event-Driven Microservices

```
[Order Service] → [Kafka Topic: orders] → [Shipping Service]
                                         → [Inventory Service]
                                         → [Analytics Service]
```

### 14.2 Real-Time Analytics Pipeline

```
[App Events] → [Kafka] → [Kafka Streams] → [Real-Time Dashboard]
            → [S3 via Kafka Connect] → [Batch Analytics]
```

### 14.3 CDC (Change Data Capture)

```
[Database] → [Debezium Connector] → [Kafka Topic] → [Data Warehouse]
```

### 14.4 Log Aggregation

```
[Servers] → [Filebeat] → [Kafka] → [Elasticsearch]
                              → [S3]
```

### 14.5 Click Stream Processing

```
[Website] → [Kafka] → [Real-time Processing] → [Recommendation Engine]
                          → [Analytics] → [S3/Data Lake]
```

---

## 15. Best Practices

1. **Partition count วางแผนล่วงหน้า** — partitions เพิ่มได้แต่ลดไม่ได้ (หรือต้อง reassign)
2. **Replication factor = 3** — และ `min.insync.replicas = 2`
3. **Monitor consumer lag** — lag สูง = consumers can't keep up
4. **Use compression** — เช่น `compression.type=gzip` ลด network/disk usage
5. **Size partitions appropriately** — ไม่ควรเกิน broker storage ที่มี
6. **Set retention appropriately** — เก็บตาม business need, ไม่ใช่ตาม default
7. **Use idempotent producers** — `enable.idempotence=true` prevents duplicates
8. **Handle rebalances gracefully** — consumer close ต้อง call `consumer.close()`
9. **Use meaningful topic names** — `domain.entity.event-type` เช่น `orders.order.created`
10. **Version your schemas** — ใช้ Schema Registry for Avro/JSON Schema
11. **Separate producer and consumer configs** — tune independently
12. **Use MSK Serverless for unpredictable workloads** — auto scales
13. **Security: encrypt everything** — TLS in transit, KMS at rest
14. **Avoid single-partition topics** — limits parallelism

---

## 16. Kafka Streams Quick Reference

### 16.1 Word Count Example

```java
KStreamBuilder builder = new KStreamBuilder();

KStream<String, String> textLines = builder.stream("streams-plaintext-input");

KTable<String, Long> wordCounts = textLines
    .flatMapValues(textLine -> Arrays.asList(textLine.toLowerCase().split("\\W+")))
    .groupBy((key, word) -> word)
    .count("counts");

wordCounts.to(Serdes.String(), Serdes.Long(), "streams-wordcount-output");
```

### 16.2 Exactly-Once Semantics

Kafka supports exactly-once processing:

```properties
# Producer
enable.idempotence=true
acks=all
max.in.flight.requests.per.connection=5

# Consumer
enable.auto.commit=false
```

### 16.3 Windowed Aggregations

```java
// Tumbling window (fixed size, non-overlapping)
KTable<Windowed<String>, Long> windowedCounts = textLines
    .groupBy((key, value) -> value)
    .windowedBy(TimeWindows.of(Duration.ofMinutes(5)))
    .count();
```

---

## 17. Limits

### 17.1 Kafka Limits

| Limit | Value |
|-------|-------|
| **Message size** | 1 MB default (up to 10 MB with `message.max.bytes`) |
| **Topic name length** | 249 characters |
| **Partition count per topic** | 200 (default, adjustable) |
| **Replication factor** | Max 15 brokers |
| **Consumer group size** | No hard limit (limited by partitions) |
| **Message retention** | Configurable (hours to unlimited) |
| **Segments per partition** | No hard limit |

### 17.2 Amazon MSK Limits

| Limit | Value |
|-------|-------|
| **Brokers per cluster** | 1–30 (depending on cluster type) |
| **Partitions per broker** | 2,000 default (adjustable up to 50,000) |
| **Partitions per cluster** | 60,000 default |
| **MSK Connect workers** | Varies by account |

---

## 18. ลิงค์อ้างอิง

- [Amazon MSK Developer Guide](https://docs.aws.amazon.com/msk/)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Amazon MSK Pricing](https://aws.amazon.com/msk/pricing/)
- [MSK Connect](https://docs.aws.amazon.com/msk/latest/connect/what-is-msk-connect.html)
- [AWS Glue Schema Registry](https://docs.aws.amazon.com/glue/latest/dg/schema-registry.html)
- [Kafka Streams Documentation](https://kafka.apache.org/documentation/streams/)
- [MSK FAQ](https://aws.amazon.com/msk/faqs/)

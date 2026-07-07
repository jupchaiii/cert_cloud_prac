# Amazon S3 (Simple Storage Service) — คู่มือฉบับสมบูรณ์

> แหล่งอ้างอิง: [Amazon S3 User Guide](https://docs.aws.amazon.com/s3/)
> แหล่งอ้างอิง: [S3 Storage Classes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html)
> แหล่งอ้างอิง: [AWS S3 API Reference](https://docs.aws.amazon.com/AmazonS3/latest/API/)

---

## 1. ภาพรวม (Overview)

Amazon Simple Storage Service (Amazon S3) คือ object storage service ที่ให้บริการเก็บข้อมูลในรูปแบบ object ใน cloud ด้วยความสามารถระดับ enterprise ที่ scale ได้ไม่จำกัด S3 ช่วยให้ผู้ใช้สามารถ:

- **Store** ไฟล์ทุกประเภท (documents, images, videos, datasets, backups)
- **Retrieve** ข้อมูลได้จากที่ใดก็ได้ผ่าน internet
- **Protect** ข้อมูลด้วย durability และ security ระดับสูง
- **Manage** การเข้าถึง, versioning, lifecycle ได้อย่างละเอียด
- **Analyze** ข้อมูลในตัว (S3 Analytics, S3 Select)

S3 มี **11 9's durability** (99.999999999%) — หมายความว่าถ้าเก็บ 10,000,000 objects คาดว่าจะเสียหายเฉลี่ย 1 object ต่อ 10,000 ปี

---

## 2. พื้นฐาน S3: Buckets และ Objects

### 2.1 Bucket

Bucket คือ container สำหรับเก็บ objects

- **Global uniqueness** — ทุก bucket ต้องมีชื่อไม่ซ้ำกันทั่วโลก (ไม่ใช่แค่ใน account)
- **Namespace เดียว** — ทั้ง AWS ใช้ namespace เดียวกัน
- **Regional** — ถูกเก็บใน specific AWS Region แต่เข้าถึงได้จากทั่วโลก
- **上限** — ต่อ account default: 100 buckets (สามารถขอเพิ่มได้)
- **Folder-like structure** — ใช้ prefix และ delimiters จำลองโครงสร้าง folder ได้

**Bucket naming rules:**
```
- ชื่อ: 3-63 ตัวอักษร
- ใช้ได้: lowercase letters, numbers, periods (.), hyphens (-)
- ห้ามเริ่มต้นด้วย period (.)
- ห้ามจบด้วย period (.)
- ห้ามใช้ IP format (เช่น 192.168.5.11)
```

### 2.2 Object

Object คือไฟล์ที่เก็บใน S3 ประกอบด้วย:

| Component | คำอธิบาย |
|-----------|---------|
| **Key** | ชื่อ object (เช่น `photos/vacation.jpg`) — รวม path ด้วย |
| **Value** | ข้อมูล (data content) — ขนาด 0 bytes ถึง 5 TB |
| **Version ID** | ID ที่ uniquely identify object ใน versioned bucket |
| **Metadata** | ข้อมูลอธิบาย object (system-defined หรือ user-defined) |
| **Tags** | Key-value pairs สำหรับ labeling (สูงสุด 10 tags) |
| **Storage class** | ระบุ storage class ของ object นั้น |

**Object URL format:**
```
https://<bucket-name>.s3.<region>.amazonaws.com/<key>
# หรือ
https://s3.<region>.amazonaws.com/<bucket-name>/<key>
```

### 2.3 S3 prefixes และ folder-like structure

S3 ไม่มี directory แท้ๆ แต่ใช้ key prefixes จำลองโครงสร้าง:

```
photos/
  vacation/
    beach.jpg        → key: "photos/vacation/beach.jpg"
    mountains.jpg     → key: "photos/vacation/mountains.jpg"
  profile/
    avatar.png        → key: "photos/profile/avatar.png"
```

---

## 3. Storage Classes

S3 มีหลาย storage classes เพื่อรองรับ use case และ cost ที่แตกต่างกัน

### 3.1 S3 Standard (Default)

- **Use case:** ข้อมูลที่เข้าถึงบ่อย (frequently accessed data)
- **Durability:** 11 9's
- **Availability:** 99.99%
- **Min storage duration:** None
- **First-byte latency:** milliseconds
- **Storage cost:** สูงที่สุดในบรรดา classes

เหมาะสำหรับ: web hosting, mobile apps, content distribution, big data analytics

### 3.2 S3 Intelligent-Tiering

- **Use case:** ข้อมูลที่เข้าถึงไม่แน่นอน หรือ access pattern ที่เปลี่ยนแปลง
- **Mechanism:** ย้าย object ระหว่าง tiers อัตโนมัติตาม usage
- **Tiers:**
  - **Frequent Access** — เหมือน S3 Standard
  - **Infrequent Access** — สำหรับ object ที่ไม่ได้เข้าถึง 30 วันขึ้นไป
  - **Archive Instant Access** — สำหรับ object ที่ไม่ได้เข้าถึง 90 วันขึ้นไป
  - **Deep Archive Access** — สำหรับ object ที่ไม่ได้เข้าถึง 180-270+ วัน
- **Storage cost:** ค่าบริการ monitoring ต่อ 1,000 objects

เหมาะสำหรับ: data lakes, analytics, backup, regulatory compliance data

### 3.3 S3 Standard-IA (Infrequent Access)

- **Use case:** ข้อมูลที่เข้าถึงน้อยแต่ต้องการ access เร็วเมื่อเรียก
- **Availability:** 99.9%
- **Min storage duration:** 30 days
- **Retrieval fee:** คิดค่าต่อ GB ที่ดึงข้อมูล
- **First-byte latency:** milliseconds

เหมาะสำหรับ: disaster recovery backups, long-term storage ที่ต้องดึงบางครั้ง

### 3.4 S3 Glacier Instant Retrieval

- **Use case:** ข้อมูลที่เก็บระยะยาวแต่ต้อง access นานๆ ครั้งด้วยการดึงแบบ instant (< 1 วินาที)
- **Availability:** 99.9%
- **Min storage duration:** 90 days
- **Retrieval:** instant (milliseconds)
- **Storage cost:** ถูกกว่า Standard-IA

เหมาะสำหรับ: archival data ที่ต้อง access ได้ทันทีเมื่อต้องการ

### 3.5 S3 Glacier Flexible Retrieval

- **Use case:** ข้อมูล archival ที่ยอมรอ retrieval สักครู่เพื่อค่าใช้จ่ายต่ำกว่า
- **Retrieval options และเวลา:**

| Option | เวลา | Use Case |
|--------|------|----------|
| **Expedited** | 1-5 นาที | Urgent retrieval |
| **Standard** | 3-12 ชั่วโมง | Standard retrieval |
| **Bulk** | 5-12 ชั่วโมง | Large amounts, free |

- **Min storage duration:** 90 days
- **No instant retrieval** — ต้องรอตาม option

เหมาะสำหรับ: tape replacement, digital preservation, compliance archives

### 3.6 S3 Glacier Deep Archive

- **Use case:** ข้อมูลที่ต้องเก็บ 7-10 ปีขึ้นไปและเข้าถึงปีละ 1-2 ครั้ง
- **Retrieval time:**
  - **Standard:** 12 ชั่วโมง
  - **Bulk:** 24-48 ชั่วโมง
- **Min storage duration:** 180 days
- **Storage cost:** ถูกที่สุดในบรรดา S3 storage classes

เหมาะสำหรับ: regulatory compliance, financial records, healthcare archives

### 3.7 S3 One Zone-IA

- **Use case:** ข้อมูลที่เข้าถึงน้อย และสามารถ recreate ได้ง่าย
- **Availability:** 99.5% (อยู่ใน AZ เดียว — ไม่ resilient ต่อ AZ failure)
- **Min storage duration:** 30 days
- **Retrieval fee:** คิดค่าต่อ GB

เหมาะสำหรับ: secondary backups, output data ที่สร้างจาก processed data

### 3.8 Storage Class Summary

| Storage Class | ความถี่เข้าถึง | Retrieval Time | Min Duration | Use Case |
|---------------|---------------|----------------|--------------|----------|
| **S3 Standard** | บ่อย | Instant (< ms) | None | Active data |
| **S3 Intelligent-Tiering** | เปลี่ยนแปลง | Instant | None | Unknown patterns |
| **S3 Standard-IA** | น้อย | Instant (< ms) | 30 days | DR, long-term |
| **S3 Glacier Instant** | อาจจะน้อยมาก | Instant (< 1 sec) | 90 days | Archival, instant need |
| **S3 Glacier Flexible** | หายากมาก | 1 min - 12 hr | 90 days | Tape replacement |
| **S3 Glacier Deep Archive** | หายากที่สุด | 12-48 hr | 180 days | Compliance, 10yr+ |
| **S3 One Zone-IA** | น้อย | Instant (< ms) | 30 days | Reproducible data |

---

## 4. S3 Features และ Capabilities

### 4.1 S3 Versioning

Versioning ช่วยเก็บรักษา object versions ทุกครั้งที่ overwrite หรือ delete

**Characteristics:**
- เปิด/ปิดได้ระดับ bucket
- เก็บทุก version รวมถึง delete markers
- สามารถ suspend versioning ได้ (หยุดสร้าง new versions แต่เก็บ existing versions)
- มี **Lifecycle rules** สำหรับจัดการ noncurrent versions

**Delete behavior:**
- **Delete object (without version ID):** สร้าง delete marker แทน — object ยังอยู่ใน version ก่อนหน้า
- **Delete specific version:** ลบ version นั้นจริงๆ
- **Permanent delete:** ลบ delete marker เพื่อ restore object

### 4.2 S3 Replication

**S3 Replication Options:**

| Type | คำอธิบาย |
|------|---------|
| **S3 Replication (SCRR)** | Replicate ไปยัง bucket อื่นใน account เดียวหรือต่าง account |
| **S3 Replication Time Control (S3 RTC)** | Replicate ภายใน 15 นาที guaranteed |
| **S3 Batch Replication** | Replicate existing objects ที่อยู่ก่อนเปิด feature |

**Replication requirements:**
- Source and destination buckets ต้อง have versioning enabled
- Source bucket owner ต้อง have permissions บน destination bucket
- IAM role ที่ S3 จะ assume เพื่อทำ replication

**Use cases:** DR, data residency, latency reduction, compliance

### 4.3 S3 Multipart Upload

สำหรับไฟล์ใหญ่กว่า 5 GB — แนะนำสำหรับไฟล์ใหญ่กว่า 100 MB:

```
ขนาดไฟล์:
- < 5 MB:    Single PUT (ไม่ต้องใช้ multipart)
- 5 MB - 5 TB: Multipart Upload (parts: 5 MB - 5 GB each, max 10,000 parts)
```

**Benefits:**
- แบ่ง upload เป็นส่วนๆ — ถ้าส่วนใดล้มเหลวส่งใหม่เฉพาะส่วนนั้น
- เร็วขึ้นเพราะ upload parts หลายส่วนพร้อมกัน (parallel)
- สามารถ upload ไฟล์ 5 TB ได้

**Steps:**
```
1. Initiate Multipart Upload (คืน upload ID)
2. Upload Parts (แต่ละส่วน — ส่ง part number + ETags กลับมา)
3. Complete Multipart Upload (ส่ง list ของ parts + ETags)
   → S3 ประกอบ parts เป็น object เดียว
```

**Abort:** สามารถ abort ได้ — S3 จะลบ uploaded parts ทิ้ง

### 4.4 S3 Transfer Acceleration

- ใช้ **CloudFront edge locations** ทั่วโลกเพื่อ accelerate uploads/downloads
- ไม่ต้องเปลี่ยน code — แค่เปลี่ยน endpoint เป็น `bucketname.s3-accelerate.amazonaws.com`
- เหมาะกับ: uploads ขนาดใหญ่จาก various locations, downloads ข้าม continent

### 4.5 S3 Byte-Range Fetches

- ดึงเฉพาะส่วน (byte range) ของ object แทนทั้งไฟล์
- ลด bandwidth และเวลาโหลดสำหรับ partial data
- ใช้สำหรับ: resumable downloads, streaming video/audio, random access to large files

### 4.6 S3 Select

- Query object โดยตรง (server-side filtering)
- ใช้ SQL-like syntax เพื่อเลือกเฉพาะ columns/rows ที่ต้องการ
- **รองรับ:** CSV, JSON, Parquet, GZIP/BZIP2 compressed
- ลด data transfer และ cost อย่างมากเมื่อต้องการ subset ของ large dataset

---

## 5. Security

### 5.1 S3 Block Public Access

- ตั้งค่าระดับ account หรือ bucket เพื่อป้องกัน accidental public exposure
- **4 ตัวเลือก:**

| Setting | ป้องกันอะไร |
|---------|------------|
| **Block public access to buckets and objects granted via new access control lists (ACLs)** | ACLs ใหม่ที่เป็น public |
| **Block public access to buckets and objects granted via any access control lists (ACLs)** | ทุก ACL ที่เป็น public |
| **Block public access to buckets and objects granted via new public bucket or access point policies** | policies ใหม่ที่เป็น public |
| **Block public access to buckets and objects granted via public bucket or access point policies** | ทุก public policies |

- **Default: enabled** สำหรับ bucket ใหม่ทุก bucket
- แนะนำ: เปิดไว้เสมอ ยกเว้นต้องการ host static website จริงๆ

### 5.2 Access Control: IAM Policies

IAM policies ใช้ควบคุม access ถึง S3 resources:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"AWS": "arn:aws:iam::123456789012:user/username"},
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

**Best practice:** ใช้ IAM policies แทน ACLs เมื่อเป็นไปได้

### 5.3 Access Control: Bucket Policies

Bucket policies คือ JSON policies ที่ attach กับ bucket:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/public/*",
      "Condition": {
        "IpAddress": {"aws:SourceIp": "203.0.113.0/24"}
      }
    }
  ]
}
```

**Use cases:**
- Grant cross-account access
- Enforce encryption (Require SSE-S3 or SSE-KMS)
- Restrict by IP address
- Force SSL (`aws:SecureTransport: true`)

### 5.4 Access Control: ACLs (Access Control Lists)

| ACL | Scope | Use Case |
|-----|-------|----------|
| **Bucket ACL** | ทั้ง bucket | Grant cross-account permissions |
| **Object ACL** | ต่อ object | Grant individual object permissions |

- ACL format แบบ legacy แต่ยังใช้ได้
- **S3 Object Ownership:** ตั้งค่าให้ bucket owner เป็นเจ้าของทุก objects อัตโนมัติ (recommended)

### 5.5 Access Control: Access Points

S3 Access Points ช่วยจัดการ access ที่ซับซ้อน:

- สร้าง named access points สำหรับแต่ละ use case หรือ application
- แต่ละ access point มี:
  - **Own VPC** — จำกัด access ให้อยู่ใน specific VPC
  - **Custom DNS name**
  - **IAM policy** เฉพาะ
  - **Block public access** settings เฉพาะ

```
arn:aws:s3:region:account-id:accesspoint/myaccesspoint/object/mykey
```

### 5.6 Encryption

**Server-Side Encryption (SSE):**

| Type | Key Management | Description |
|------|---------------|-------------|
| **SSE-S3** | S3-managed keys | AES-256, S3 จัดการ keys ทั้งหมด |
| **SSE-KMS** | AWS KMS (AWS-managed หรือ customer-managed) | ใช้ KMS keys, audit ได้ละเอียด |
| **SSE-C** | Customer-provided keys | ลูกค้า provide encryption key, S3 ไม่เก็บ key |

**Client-Side Encryption:**
- Encrypt ก่อน upload เอง (ใช้ AWS Encryption SDK หรือ library อื่น)
- S3 ได้รับ encrypted data ไม่เคยเห็น plaintext

**Enforcing encryption:**
```json
{
  "Condition": {
    "Null": {"s3:x-amz-server-side-encryption": true}
  }
}
```

### 5.7 S3 Object Lock (WORM Storage)

ป้องกัน object ถูก overwrite หรือ delete:

**Modes:**

| Mode | ป้องกันอะไร | Compliance |
|------|------------|-----------|
| **Governance** | ลบ/overwrite ไม่ได้ถ้าไม่มี special permission | IAM permission พิเศษ bypass ได้ |
| **Compliance** | ลบ/overwrite ไม่ได้เด็ดขาด — แม้แต่ root user | ไม่มีใคร bypass ได้ จนกว่าจะหมด retention period |

**Retention Periods:**
- **Days หรือ Years:** ระบุวันที่สิ้นสุด
- **Legal Hold:** ไม่มีวันหมด — ปลดได้เมื่อต้องการ (ต้องมี `s3:PutObjectLegalHold` permission)

**Use cases:** regulatory compliance, litigation hold, immutable backups

### 5.8 Bucket Ownership

**S3 Object Ownership:**
- `Bucket owner enforced` (recommended) — bucket owner เป็นเจ้าของทุก objects ไม่ว่าใครจะ upload ก็ตาม, ACLs ถูก disabled
- ACLs ที่ `bucket-owner-full-control` จะไม่จำเป็นอีกต่อไป

---

## 6. Data Protection และ Backup

### 6.1 S3 Versioning (Data Protection)

- เก็บทุก version ของ object เมื่อ overwrite/delete
- ดึง version เก่ากลับมาได้เสมอ
- รวมกับ Lifecycle rules เพื่อลด cost ของ old versions

### 6.2 S3 Lifecycle Policies

Automate object transitions และ expirations:

**Actions ที่ใช้ได้:**

| Action | คำอธิบาย |
|--------|---------|
| **Transition to S3 Standard-IA** | ย้ายหลัง X วัน (≥ 30 days default) |
| **Transition to S3 Intelligent-Tiering** | ย้ายหลัง X วัน |
| **Transition to S3 Glacier** | ย้ายหลัง X วัน (≥ 90 days default) |
| **Transition to S3 Deep Archive** | ย้ายหลัง X วัน (≥ 180 days default) |
| **Object Expiration** | ลบ object หลัง X วัน |
| **Abort Incomplete Multipart Upload** | ลบ parts ที่ยังไม่ complete หลัง X วัน |
| **Noncurrent version transitions** | จัดการ versions ที่ไม่ใช่ current |
| **Noncurrent version expiration** | ลบ noncurrent versions หลัง X วัน |

**Example lifecycle rule:**
```
Rule 1: Move to Standard-IA after 30 days
Rule 2: Move to Glacier after 90 days
Rule 3: Delete after 365 days
Rule 4: Delete incomplete multipart uploads after 7 days
```

### 6.3 S3 Backup Options

| Method | คำอธิบาย |
|--------|---------|
| **S3 Replication** | Sync ไป bucket อื่น (same หรือ cross-region) |
| **S3 Batch Operations** | Copy/replicate existing objects จำนวนมาก |
| **AWS Backup** | Centralized backup service รวม S3 |
| **S3 Object Lock + Compliance** | Immutable storage ตาม regulation |
| **AWS Storage Gateway** | Hybrid backup จาก on-premises |

---

## 7. Networking และ Data Access

### 7.1 S3 Access Points

Named network endpoints สำหรับเข้าถึง S3:

```
# Access point URL
https://myaccesspoint-123456789012.s3-accesspoint.region.amazonaws.com/mykey

# Or via VPC endpoint
https://myaccesspoint-123456789012.vpce-abc.s3-accesspoint.region.vpce.amazonaws.com/mykey
```

**VPC Origin:**
- ผูก access point กับ specific VPC
- VPC ต้องมี VPC endpoint (S3 Gateway Type หรือ Interface Type)
- เข้าถึงได้เฉพาะจาก VPC นั้นๆ

### 7.2 VPC Endpoints for S3

เชื่อมต่อ S3 โดยไม่ต้องผ่าน internet:

**Types:**

| Type | Description |
|------|-------------|
| **Gateway Endpoint** | ใช้ route table — สำหรับ S3 เท่านั้น — **ไม่มีค่าใช้จ่าย** |
| **Interface Endpoint (PrivateLink)** | ใช้ ENI + private IP — สำหรับ S3 และ DynamoDB — มีค่าใช้จ่าย |

**Gateway Endpoint:**
```
# สร้าง endpoint: vpce-xxxxx (Gateway type)
# เลือก bucket หรือ policy เพื่อจำกัด access
# S3 traffic: S3 → VPC Endpoint → S3
```

### 7.3 S3 Transfer Acceleration

- ใช้ AWS edge locations (CloudFront) รอบโลก
- Endpoints:
  - `bucketname.s3-accelerate.amazonaws.com`
  - `bucketname.s3-accelerate.dualstack.amazonaws.com` (IPv6)
- รองรับ: multipart uploads, downloads
- **ไม่รองรับ:** S3 Transfer Acceleration กับ requester pays buckets

### 7.4 Cross-Region Replication (CRR) vs Same-Region Replication (SRR)

| Feature | CRR | SRR |
|---------|-----|-----|
| **โลเคชัน** | ต่าง Region | ซ้าย Region |
| **Use case หลัก** | DR, latency reduction | Backup, compliance |
| **Data transfer cost** | มี (inter-region) | มี (ถ้าต่าง AZ) |
| **Bandwidth** | ใช้ replication capacity |

### 7.5 S3 Event Notifications

Trigger actions เมื่อเกิด events:

**Event types:**
- `s3:ObjectCreated:*` (Put, Post, Copy, Multipart Upload)
- `s3:ObjectRemoved:*` (Delete, lifecycle expiration)
- `s3:ObjectRestore:*` (Glacier restore)
- `s3:Replication:*` (replication operations)
- `s3:LifecycleExpiration:*`

**Destinations:**
| Destination | Notes |
|-------------|-------|
| **SNS Topic** | Push notifications |
| **SQS Queue** | Message queue |
| **Lambda Function** | Serverless trigger |
| **EventBridge** | ใช้ EventBridge เพื่อควบคุมได้มากกว่า |

---

## 8. S3 Batch Operations

จัดการ object จำนวนมากใน operation เดียว:

**Use cases:**
- Copy existing objects ไปยัง bucket ใหม่หรือ storage class ใหม่
- Replace object ACLs หรือ tags
- Invoke Lambda function บน object สำหรับ custom processing
- Unencrypt objects (decrypt ก่อน upload)
- Create cross-region replicas

**How it works:**
```
1. สร้าง Job (ระบุ objects ผ่าน S3 Inventory manifest หรือ CSV)
2. S3 Batch Operations ประมวลผลทุก object
3. ได้รายงาน Completion report
```

**Features:**
- Track progress, completion, failures
- Retry failed operations
- สามารถ set priority สำหรับ jobs

---

## 9. Performance และ Optimization

### 9.1 S3 Performance Guidelines

**Request Rate:**
- S3 รองรับ **3,500 PUT/COPY/POST/DELETE** และ **5,500 GET/HEAD** requests ต่อวินาทีต่อ prefix
- **ไม่มี limits ต่อ bucket** — scale ได้ไม่จำกัด

**Prefixes:**
- `photos/vacation/beach.jpg` → prefix: `photos/vacation/`
- ยิ่ง randomize prefix ยิ่ง distribute requests ได้ดี
- เพิ่ม randomness ด้วย key naming: `mybucket/tenant_id/object_id`

**Best practices for high request rates:**
- Use sequential prefixes only สำหรับ LIST operations ที่มี common prefix
- ใช้ CloudFront สำหรับ cache GET requests
- ใช้ S3 Transfer Acceleration สำหรับ uploads
- ใช้ Multipart Upload สำหรับ large objects

### 9.2 S3 Accelerator (Transfer Acceleration)

- ใช้ CloudFront edge รับไฟล์ → routing ไป S3 ผ่าน AWS backbone
- เร็วขึ้นโดยเฉพาะ distance ที่ไกล
- ลด packet loss และ retransmission
- รวมกับ Multipart Upload สำหรับ best performance

### 9.3 S3 Select

- Query data โดยไม่ต้องดาวน์โหลดทั้งไฟล์
- ลด data transfer อย่างมาก (บางครั้งถึง 99%)
- รองรับ: CSV, JSON, Parquet, GZIP, BZIP2
- ใช้ SQL expressions

### 9.4 Multipart Upload Optimization

| Part Size | Use Case |
|-----------|----------|
| **5 MB (minimum)** | Small files |
| **8 MB - 64 MB** | Standard large files |
| **512 MB** | Very large files (parallelize best) |

**Concurrency:**
- Upload parts หลายส่วนพร้อมกัน (แนะนำ 4-10 concurrent parts)
- ใช้ `max_concurrency` ใน SDK

---

## 10. Monitoring และ Logging

### 10.1 Amazon CloudWatch Metrics for S3

**Bucket-level metrics (free):**
- `BucketSizeBytes` — ขนาด bucket
- `NumberOfObjects` — จำนวน objects
- `AllRequests` — ทุก request type
- `GetRequests`, `PutRequests`, `DeleteRequests`
- `BytesDownloaded`, `BytesUploaded`

**Request-level metrics (with request metrics):**
- `4xxErrors`, `5xxErrors`
- `FirstByteLatency`, `TotalRequestLatency`
- `SelectRequests`, `SelectBytesScanned`, `SelectBytesReturned`

**Enable request metrics:**
```
S3 Console → Management → Metrics → "Request metrics" → Create filter
# หรือ
aws s3 put-metric-configuration --bucket my-bucket --id default \
  --metrics '{"AccessMetricsDestination": "arn:aws:cloudwatch:..."}'
```

### 10.2 S3 Server Access Logging

Log ทุก request ที่เข้ามายัง bucket:

```bash
# เปิด logging
aws s3api put-bucket-logging \
  --bucket source-bucket \
  --bucket-logging-status '{
    "LoggingEnabled": {
      "TargetBucket": "my-log-bucket",
      "TargetPrefix": "logs/"
    }
  }'
```

- **Target bucket:** ต้องอยู่ใน account เดียวกัน (หรือ cross-account พร้อม permissions)
- **Target prefix:** จัดระเบียบ logs เช่น `logs/2024/07/`
- **Log format:** Apache Common Log Format (CLF)

### 10.3 AWS CloudTrail for S3

Log S3 API calls ใน CloudTrail:

**S3 data events (ต้อง enable แยก — มีค่าใช้จ่าย):**
- `GetObject`, `PutObject`, `DeleteObject`
- `ListObjects`, `HeadObject`

**Management events (default — ฟรี):**
- `CreateBucket`, `DeleteBucket`
- `PutBucketPolicy`, `DeleteBucketPolicy`

### 10.4 S3 Inventory

สร้างรายงาน inventory ของ objects ใน bucket (Apache Parquet/CSV output):

```bash
# Setup inventory
aws s3api put-bucket-inventory-configuration \
  --bucket my-bucket \
  --id inventory-config \
  --inventory-configuration '{
    "Destination": {
      "S3BucketDestination": {
        "Format": "Parquet",
        "Bucket": "arn:aws:s3:::my-inventory-bucket",
        "Prefix": "reports/inventory"
      }
    },
    "Schedule": {"Frequency": "Daily"},
    "IncludedObjectVersions": "All",
    "OptionalFields": ["Size","LastModified","StorageClass","EncryptionStatus"]
  }'
```

**Use cases:**
- Audit compliance
- Optimize storage costs
- Generate S3 Batch Operations manifest

### 10.5 S3 Analytics

- **Storage Class Analysis** — แนะนำ lifecycle rules โดยวิเคราะห์ access patterns
- ดูข้อมูลต่างๆ ผ่าน S3 Console dashboards

---

## 11. Static Website Hosting

S3 สามารถ host static website ได้:

**Configuration:**
```bash
aws s3 website s3://my-bucket/ \
  --index-document index.html \
  --error-document error.html \
  --routing-rule '{"Condition":{"KeyPrefixEquals":"docs/"},"Redirect":{"ReplaceKeyPrefixWith":"documents/"}}'
```

**Website endpoint format:**
```
http://my-bucket.s3-website.<region>.amazonaws.com
```

**Note:** Website endpoints ไม่ใช่ HTTPS — ถ้าต้องการ HTTPS ใช้ CloudFront + S3

**Required settings:**
1. เปิด static website hosting ใน bucket properties
2. เปิด public access (หรือใช้ CloudFront with OAI)
3. Bucket policy หรือ ACL ให้ public read สำหรับ objects

---

## 12. S3 Pricing และค่าใช้จ่าย

### 12.1 Storage Pricing

| Storage Class | ราคาต่อ GB/เดือน (us-east-1 approx) |
|--------------|--------------------------------------|
| **S3 Standard** | ~$0.023 |
| **S3 Intelligent-Tiering** | ~$0.023 (monitoring fee ต่างหาก) |
| **S3 Standard-IA** | ~$0.0125 |
| **S3 Glacier Instant** | ~$0.004 |
| **S3 Glacier Flexible** | ~$0.0036 |
| **S3 Glacier Deep Archive** | ~$0.00099 |
| **S3 One Zone-IA** | ~$0.01 |

### 12.2 Request and Data Transfer Pricing

**Requests (per 1,000):**

| Request Type | S3 Standard | S3 IA/Intelligent | S3 Glacier* |
|-------------|-------------|------------------|-------------|
| **PUT, COPY, POST, LIST** | ~$0.005 | ~$0.01 | ~$0.03 |
| **GET, SELECT, others** | ~$0.0004 | ~$0.001 | ~$0.0004 |
| **DELETE** | ฟรี | ฟรี | ฟรี |

*Glacier retrieval มีค่าต่างหากตาม option

**Data Transfer (outbound):**

| Transfer | ค่าบริการ |
|----------|----------|
| **Data IN to S3** | ฟรี |
| **Data OUT from S3 to Internet** | $0.09/GB (first 10 TB) |
| **Data OUT to CloudFront** | ฟรี |
| **Data OUT to same Region EC2** | ฟรี (via private IP) |
| **Inter-region replication** | $0.02-$0.09/GB |

### 12.3 Storage Management Features

| Feature | ค่าบริการ |
|---------|----------|
| **S3 Analytics** | ฟรี (Storage Class Analysis) |
| **S3 Inventory** | ค่า manifest + data output |
| **S3 CloudWatch Metrics** | ฟรี (bucket-level), มีค่า (request-level) |
| **S3 Server Access Logs** | ค่า storage สำหรับ logs ที่เก็บ |
| **S3 Object Lock** | ฟรี (รวมใน storage cost) |

### 12.4 Cost Optimization Strategies

1. **ใช้ S3 Intelligent-Tiering** — ลดค่าใช้จ่ายโดยอัตโนมัติ
2. **Lifecycle policies** — ย้ายไป storage class ที่ถูกกว่าเมื่อไม่เข้าถึงบ่อย
3. **S3 Glacier สำหรับ archival** — ถูกกว่า Standard มากสำหรับ long-term
4. **ใช้ prefixes อย่างเหมาะสม** — ไม่มี minimum storage charge
5. **เปิด S3 Analytics** — ดูว่า n% แรกเข้าถึงบ่อยแค่ไหน
6. **Delete incomplete multipart uploads** — ป้องกันค่าใช้จ่ายจาก orphaned parts

---

## 13. S3 use Cases หลัก

| Use Case | Storage Class | Features |
|----------|--------------|----------|
| **Static Website Hosting** | S3 Standard | Static hosting, CloudFront |
| **Data Lake** | S3 Standard + Intelligent-Tiering | S3 Select, Lake Formation, Athena |
| **Big Data Analytics** | S3 Standard | Athena, Redshift Spectrum, EMR |
| **Backup & Restore** | S3 Standard-IA / Glacier | Cross-region replication, Object Lock |
| **Disaster Recovery (DR)** | S3 Standard + CRR | Cross-region replication, S3 RTC |
| **Archival** | Glacier / Deep Archive | Object Lock (Compliance), Vault Lock |
| **Software Delivery / CDN** | S3 Standard | Transfer Acceleration, CloudFront |
| **Machine Learning Data** | S3 Standard | S3 Select, Data Lake, SageMaker |
| **Media Streaming** | S3 Standard + CloudFront | HLS/DASH streaming via CloudFront |
| **Log Storage** | S3 Standard-IA / One Zone-IA | Lifecycle rules, Analytics |
| **Hybrid Cloud Storage** | S3 Standard | Storage Gateway (File Gateway, Tape Gateway) |
| **Compliance / WORM** | S3 + Object Lock | Governance/Compliance mode, Legal Hold |
| **Cross-account Data Sharing** | S3 Standard | Bucket policies, Access Points, Object Ownership |

---

## 14. S3 และ AWS Services Integration

| AWS Service | S3 Integration |
|-------------|----------------|
| **CloudFront** | CDN cache, edge delivery |
| **Lambda** | Event-driven processing on S3 events |
| **Athena** | Query S3 data directly with SQL |
| **Glue** | ETL, Data Catalog |
| **SageMaker** | ML training data, model artifacts |
| **DynamoDB** | S3 for large objects (S3-DDB connector) |
| **Redshift** | Spectrum query S3, data warehouse |
| **EMR** | Spark/Hadoop on S3 data |
| **Storage Gateway** | Hybrid storage (File/Tape/Virtual Tape) |
| **AWS Backup** | Centralized backup including S3 |
| **EventBridge** | Advanced event routing from S3 |
| **KMS** | SSE-KMS encryption |
| **CloudTrail** | API call logging |
| **CloudWatch** | Metrics and alarms |
| **Lake Formation** | Data lake governance |
| **FSx** | Lustre integration for HPC |

---

## 15. คำศัพท์และความหมาย (Glossary)

| คำศัพท์ | ความหมาย |
|---------|---------|
| **Bucket** | Container สำหรับเก็บ objects ใน S3 |
| **Object** | ไฟล์ที่เก็บใน S3 ประกอบด้วย key, value, metadata, version ID, tags |
| **Key** | ชื่อ object รวม path (เช่น `photos/vacation.jpg`) |
| **Prefix** | ส่วนของ key ก่อน delimiter (เช่น `photos/`) |
| **SSE** | Server-Side Encryption — เข้ารหัสที่ S3 ก่อนเก็บ |
| **CSE** | Client-Side Encryption — เข้ารหัสก่อน upload เอง |
| **CRR** | Cross-Region Replication — replicate ข้าม region |
| **SRR** | Same-Region Replication — replicate ใน region เดียวกัน |
| **WORM** | Write Once Read Many — ไม่สามารถแก้ไข/ลบได้ |
| **Multipart Upload** | แบ่ง upload เป็นหลายส่วนสำหรับไฟล์ใหญ่ |
| **Lifecycle Policy** | Rules อัตโนมัติสำหรับ transition/expiration |
| **S3 Select** | Query object โดยตรงด้วย SQL-like syntax |
| **Access Point** | Named endpoint สำหรับเข้าถึง bucket |
| **Object Lock** | WORM storage สำหรับ objects |
| **Storage Class** | ระดับบริการเก็บข้อมูลที่มี cost/performance ต่างกัน |
| **Version ID** | Unique ID สำหรับแต่ละ version ของ object |
| **Delete Marker** | Marker ที่สร้างขึ้นเมื่อ delete object ใน versioned bucket |
| **Transfer Acceleration** | ใช้ CloudFront edge เพื่อเร่ง upload/download |
| **Batch Operations** | จัดการ object จำนวนมากใน operation เดียว |
| **Inventory** | รายงาน contents ของ bucket ในรูปแบบ Parquet/CSV |

---

## 16. ลิงค์อ้างอิง

| เนื้อหา | ลิงค์ |
|---------|------|
| **Amazon S3 User Guide** | https://docs.aws.amazon.com/s3/ |
| **S3 Storage Classes** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html |
| **S3 Developer Guide** | https://docs.aws.amazon.com/AmazonS3/latest/dev/ |
| **S3 API Reference** | https://docs.aws.amazon.com/AmazonS3/latest/API/ |
| **S3 Pricing** | https://aws.amazon.com/s3/pricing/ |
| **S3 Data Transfer** | https://aws.amazon.com/s3/pricing/data-transfer/ |
| **S3 Replication** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html |
| **S3 Lifecycle** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html |
| **S3 Object Lock** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html |
| **S3 Versioning** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html |
| **S3 Encryption** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingEncryption.html |
| **S3 Access Points** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-points.html |
| **S3 Multipart Upload** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html |
| **S3 Select** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/selecting-content-from-objects.html |
| **S3 Batch Operations** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/batch-ops.html |
| **S3 Static Website Hosting** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html |
| **S3 Inventory** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-inventory.html |
| **S3 Analytics** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/analytics-storage-class.html |
| **S3 Transfer Acceleration** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html |
| **S3 VPC Endpoints** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/vpc-endpoints.html |
| **S3 Event Notifications** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/NotificationHowTo.html |
| **CloudWatch S3 Metrics** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/monitoring-automated-manual.html |
| **CloudTrail S3 Data Events** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/logging-using-cloudtrail.html |
| **AWS CLI for S3** | https://docs.aws.amazon.com/cli/latest/reference/s3/ |
| **S3 on Outposts** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/S3onOutposts.html |
| **S3 Express One Zone** | https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-OneZone.html |

---

*S3 Storage Classes ที่มีในปี 2026: S3 Standard, S3 Intelligent-Tiering, S3 Standard-IA, S3 One Zone-IA, S3 Glacier Instant Retrieval, S3 Glacier Flexible Retrieval, S3 Glacier Deep Archive, S3 Express One Zone*

*ไฟล์นี้สร้างโดย Hermes Agent — แหล่งอ้างอิงจาก AWS Official Documentation ณ วันที่ July 2026*

# AWS Certified Cloud Practitioner — คู่มือศึกษาและสรุป Services ทั้งหมด

> จัดทำเพื่อเตรียมสอบ AWS Certified Cloud Practitioner  
> ข้อมูลอ้างอิงจาก Exam Guide ฉบับล่าสุด (CLF-C02)

---

## สารบัญ

1. [ภาพรวมข้อสอบ](#1-ภาพรวมข้อสอบ)
2. [Domain 1: Cloud Concepts (26%)](#2-domain-1-cloud-concepts-26)
3. [Domain 2: Security and Compliance (25%)](#3-domain-2-security-and-compliance-25)
4. [Domain 3: Technology (33%)](#4-domain-3-technology-33)
5. [Domain 4: Billing and Pricing (16%)](#5-domain-4-billing-and-pricing-16)
6. [สรุป Services ที่ออกสอบ](#6-สรุป-services-ที่ออกสอบ)

---

## 1. ภาพรวมข้อสอบ

| รายการ | รายละเอียด |
|---|---|
| **รหัสข้อสอบ** | CLF-C02 |
| **จำนวนข้อ** | 65 ข้อ |
| **เวลา** | 90 นาที |
| **คะแนน** | 100–1000 คะแนน (ผ่านที่ 700 คะแนน) |
| **รูปแบบ** | ตัวเลือก (Multiple Choice / Multiple Response) |
| **ราคา** | ~100 USD (ราคาเปลี่ยนแปลงตามภูมิภาค) |
| **อายุวุฒิ** | 3 ปี |

### 4 Domains หลัก

| Domain | % | เนื้อหา |
|---|---|---|
| 1. Cloud Concepts | 26% | หลักการ cloud, benefits, architecture |
| 2. Security and Compliance | 25% | IAM, security, compliance, encryption |
| 3. Technology | 33% | Compute, Storage, DB, Networking |
| 4. Billing and Pricing | 16% | ราคา, cost management, billing |

---

## 2. Domain 1: Cloud Concepts (26%)

### 2.1 ประโยชน์ของ AWS Cloud

| ประโยชน์ | คำอธิบาย |
|---|---|
| **High Availability** | ระบบทำงานต่อเนื่องโดยกระจายไปหลาย Availability Zones |
| **Scalability** | ขยายขนาดทรัพยากรตาม demand ได้อัตโนมัติ |
| **Elasticity** | ปรับ capacity ขึ้น-ลงได้อัตโนมัติ |
| **Cost Optimization** | จ่ายเท่าที่ใช้ (Pay-as-you-go) |
| **Global Reach** | เข้าถึง region ทั่วโลก |
| **Agility** | สร้างและ deploy ทรัพยากรได้รวดเร็ว |

### 2.2 Cloud Architecture Principles

- **Design for failure** — ทำระบบให้รองรับ failure ได้
- **Loose coupling** — ออกแบบให้ component พึ่งพากันน้อยที่สุด
- **Implement elasticity** — ใช้ auto-scaling และ load balancing
- **Think parallel** — ใช้ประโยชน์จาก parallelism

### 2.3 ประเภทของ Cloud Computing

| ประเภท | คำอธิบาย | ตัวอย่าง |
|---|---|---|
| **IaaS** | Infrastructure as a Service | EC2, EC2, VPC |
| **PaaS** | Platform as a Service | Beanstalk, Lambda, Lightsail |
| **SaaS** | Software as a Service | Gmail, Salesforce, AWS Docs |
| **FaaS** | Function as a Service | Lambda |

### 2.4 Deployment Models

| Model | คำอธิบาย |
|---|---|
| **Cloud** | ใช้ cloud provider ทั้งหมด |
| **Hybrid** | ผสมผสาน on-premises กับ cloud |
| **On-premises (Private)** | ดูแลโครงสร้างเองทั้งหมด |

### 2.5 AWS Global Infrastructure

| คำศัพท์ | คำอธิบาย |
|---|---|
| **Region** | พื้นที่ภูมิศาสตร์ เช่น us-east-1, ap-southeast-1 |
| **Availability Zone (AZ)** | Data center หลายแห่งใน region |
| **Edge Location** | CDN endpoint สำหรับ cache content |
| **Local Zone** | ใกล้ผู้ใช้มากขึ้น |
| **Wavelength Zone** | สำหรับ ultra-low latency (5G) |

---

## 3. Domain 2: Security and Compliance (25%)

### 3.1 AWS IAM (Identity and Access Management)

**หลักการทำงาน:** IAM ควบคุมว่าใครสามารถเข้าถึง AWS resources อะไรได้บ้าง

| คอมโพเนนต์ | หน้าที่ |
|---|---|
| **IAM User** | บัญชีผู้ใช้งานรายบุคคล |
| **IAM Group** | กลุ่มผู้ใช้ที่มี policy เดียวกัน |
| **IAM Role** | กำหนดสิทธิ์ชั่วคราวสำหรับ service/user/cross-account |
| **IAM Policy** | JSON document กำหนด permission |
| **Root Account** | บัญชีหลักที่มีสิทธิ์ทุกอย่าง (ไม่ควรใช้งานประจำวัน) |

**IAM Policy Types:**
- **Identity-based** — ติด attached กับ user, group, role
- **Resource-based** — ติด attached กับ resource (เช่น S3 bucket policy)
- **Permission boundary** — จำกัด max permissions

**Security Best Practices:**
- ใช้ MFA สำหรับ root account
- ใช้ least privilege principle
- ใช้ IAM role แทน access key
- เปลี่ยน password root ทุก 90 วัน

### 3.2 AWS Organizations

**หลักการทำงาน:** จัดการหลาย AWS accounts ใน hierarchy จาก master account

| Feature | คำอธิบาย |
|---|---|
| **OU (Organizational Unit)** | กลุ่มของ accounts |
| **SCP (Service Control Policy)** | จำกัด permissions ของ accounts ใน org |
| **Consolidated Billing** | รวม billing จากหลาย accounts |

### 3.3 AWS Artifact

**หลักการทำงาน:** ระบบออนไลน์สำหรับดาวน์โหลด compliance reports

- **Artifact Agreements** — NDA, BAA สำหรับ compliance
- **Artifact Reports** — SOC, PCI, ISO reports

### 3.4 AWS KMS (Key Management Service)

**หลัการทำงาน:** สร้างและจัดการ encryption keys

| ประเภท Key | คำอธิบาย |
|---|---|
| **AWS managed keys** | สร้างโดย AWS ให้อัตโนมัติ (ไม่ต้องตั้งค่า) |
| **Customer managed keys (CMK)** | สร้างและจัดการเอง มีค่าใช้จ่าย |
| **Custom key store** | ใช้ HSM ของตัวเอง |

### 3.5 AWS CloudTrail

**หลักการทำงาน:** บันทึก API calls ทั้งหมดใน AWS account

- บันทึกเรื่อง **who, what, when, where**
- Logs เก็บไว้ใน S3
- CloudTrail Insights ตรวจจับ anomalous activity

### 3.6 AWS Config

**หลักการทำงาน:** บันทึกและประเมิน configurations ของ AWS resources

- Track resource changes over time
- ใช้ตรวจสอบ compliance

### 3.7 AWS GuardDuty

**หลักการทำงาน:** Threat detection service ที่ใช้ machine learning

- วิเคราะห์ CloudTrail logs, VPC flow logs, DNS logs
- แจ้งเตือนเมื่อพบ threats

### 3.8 AWS Security Hub

**หลักการทำงาน:** รวม security findings จากหลาย AWS services

- Centralized security dashboard
- Aggregates findings from GuardDuty, Inspector, Macie

### 3.9 Amazon Inspector

**หลัการทำงาน:** สแกน EC2 และ container หาช่องโหว่ด้าน security

- Network assessments
- CVE checks

### 3.10 Amazon Macie

**หลักการทำงาน:** สแกน S3 bucket หา sensitive data

- ใช้ machine learning
- ตรวจจับ PII, PHI, financial data

### 3.11 AWS WAF (Web Application Firewall)

**หลักการทำงาน:** ป้องกัน web application จาก common attacks

- **OWASP Top 10** protection
- **Rate limiting**
- **Geographic matching**
- ทำงานร่วมกับ CloudFront และ ALB

### 3.12 AWS Shield

**หลักการทำงาน:** DDoS protection

| Tier | คำอธิบาย |
|---|---|
| **Shield Standard** | ฟรี, ป้องกัน Layer 3/4 DDoS |
| **Shield Advanced** | จ่ายเงิน, ป้องกัน Layer 7, 24/7 support |

### 3.13 Amazon VPC (Virtual Private Cloud)

**หลักการทำงาน:** สร้าง isolated network ใน AWS

| คอมโพเนนต์ | หน้าที่ |
|---|---|
| **Subnet** | ส่วนย่อยของ VPC (public/private) |
| **Internet Gateway** | เชื่อมต่อ VPC กับ internet |
| **NAT Gateway** | ให้ private subnet เข้า internet ได้ |
| **Virtual Private Gateway** | เชื่อมต่อ VPN |
| **Security Group** | Stateful firewall (instance level) |
| **NACL** | Network ACL — Stateless firewall (subnet level) |
| **VPC Endpoint** | เชื่อมต่อ AWS services โดยไม่ต้องผ่าน internet |
| **PrivateLink** | ต่อ private service ผ่าน VPC endpoint |

### 3.14 Compliance

| Concept | คำอธิบาย |
|---|---|
| **Shared Responsibility Model** | AWS ดูแล infrastructure; ลูกค้าดูแล data/access |
| **AWS Artifact** | ดาวน์โหลด compliance reports |
| **Customer Compliance Center** | แหล่งรวม compliance resources |
| **AWS Config Rules** | ตรวจสอบ compliance อัตโนมัติ |

---

## 4. Domain 3: Technology (33%)

### 4.1 Amazon EC2 (Elastic Compute Cloud)

**หลักการทำงาน:** Virtual servers ใน cloud ที่ปรับขนาดได้

**Instance Types:**

| Family | Use Case |
|---|---|
| **General Purpose (T, M)** | เว็บเซิร์ฟเวอร์, dev/test |
| **Compute Optimized (C)** | High-performance computing, gaming |
| **Memory Optimized (R, X)** | In-memory databases, big data |
| **Storage Optimized (D, I, H)** | Data warehousing, NoSQL |
| **GPU (G, P)** | Machine learning, graphics |

**Instance Purchasing Options:**

| Option | คำอธิบาย | Use Case |
|---|---|---|
| **On-Demand** | จ่ายตามใช้ วินาที/ชั่วโมง | Short-term, testing |
| **Reserved Instance (RI)** | จอง 1-3 ปี ลดราคา | Long-term, predictable |
| **Savings Plans** | จ่ายตาม usage ลดราคา | Flexible workloads |
| **Spot Instance** | ใช้ idle capacity ลดราคา 90% | Fault-tolerant, batch |
| **Dedicated Host** | เซิร์ฟเวอร์เฉพาะ physical | Compliance, licensing |

**EC2 Auto Scaling:**
- **Dynamic Scaling** — ปรับตาม metric (CPU, network)
- **Scheduled Scaling** — ปรับตาม schedule
- **Predictive Scaling** — ใช้ ML ทำนาย demand

### 4.2 Amazon EC2 Image Builder

**หลักการทำงาน:** สร้างและ maintain VM images อัตโนมัติ

### 4.3 AWS Lambda

**หลักการทำงาน:** Serverless compute — รันโค้ดตอบ event โดยไม่ต้องจัดการ server

- จ่ายตาม execution time (ระดับ millisecond)
- Max execution time: 15 นาที
- Support languages: Node.js, Python, Ruby, Java, Go, .NET, custom runtime
- **Lambda@Edge** — รัน edge locations สำหรับ customize CloudFront content

### 4.4 AWS Elastic Beanstalk

**หลักการทำงาน:** PaaS สำหรับ deploy web applications

- Upload code → Beanstalk auto provisions
- Supports: Node.js, Python, PHP, Ruby, Java, .NET, Docker
- Managed: capacity, load balancing, scaling, app health monitoring

### 4.5 Amazon Lightsail

**หลักการทำงาน:** VPS แบบง่าย สำหรับ beginners

- Fixed price virtual servers
- ใช้งานง่ายกว่า EC2

### 4.6 AWS Batch

**หลักการทำงาน:** Batch processing at scale

- Schedule และ execute batch jobs
- Managed compute environment

---

### 4.7 Amazon S3 (Simple Storage Service)

**หลักการทำงาน:** Object storage — เก็บไฟล์ใน buckets

**Storage Classes:**

| Class | คำอธิบาย | Use Case |
|---|---|---|
| **S3 Standard** | ความเร็วสูง, 3 AZs | Frequently accessed data |
| **S3 Intelligent-Tiering** | Auto-tiering ตามการใช้ | Unknown/unpredictable access |
| **S3 Standard-IA** | ถูกกว่า, แต่ retrieval fee | Less frequently accessed |
| **S3 Glacier Instant Retrieval** | ราคาถูกมาก, retrieval < 1 second | Archive, backup |
| **S3 Glacier Flexible Retrieval** | ราคาถูกกว่า, retrieval minutes to hours | Long-term archive |
| **S3 Glacier Deep Archive** | ราคาถูกที่สุด, retrieval 12+ hours | Longest-term archive |
| **S3 One Zone-IA** | เก็บใน AZ เดียว | Secondary copies |

**S3 Features:**
- **Versioning** — เก็บ history ของ object
- **MFA Delete** — ต้องใช้ MFA ถึงลบได้
- **Replication** — CRR (cross-region), SRR (same-region)
- **Lifecycle Policies** — ย้าย/ลบอัตโนมัติตาม age
- **Encryption** — SSE-S3, SSE-KMS, SSE-C, CSE-KMS, CSE-C
- **Access Control** — Bucket policy, ACL, IAM policy
- **S3 Select** — query subset ของ object

### 4.8 Amazon EFS (Elastic File System)

**หลักการทำงาน:** Managed NFS (network file system) สำหรับ Linux

- Multi-AZ, highly available
- Pay-per-use
- ใช้กับ EC2, Lambda, on-premises

### 4.9 Amazon FSx

**หลักการทำงาน:** Managed third-party file systems

| Type | คำอธิบาย |
|---|---|
| **FSx for Windows File Server** | SMB protocol, Windows-native |
| **FSx for Lustre** | High-performance computing (HPC) |
| **FSx for NetApp ONTAP** | Enterprise file storage |
| **FSx for OpenZFS** | Managed ZFS file system |

### 4.10 Amazon EBS (Elastic Block Store)

**หลักการทำงาน:** Block storage สำหรับ EC2

**Volume Types:**

| Type | คำอธิบาย | Use Case |
|---|---|---|
| **gp3** | SSD ราคาถูก, baseline 125 MB/s | General purpose |
| **gp2** | SSD, burst to 3,000 IOPS | Boot volumes, dev/test |
| **io2** | High-performance, 99.999% durability | Mission-critical |
| **io2 Block Express** | Sub-millisecond latency, 4 TB–64 TB | Largest workloads |
| **st1** | HDD ราคาถูก, throughput-optimized | Big data, log processing |
| **sc1** | HDD ราคาถูกที่สุด, cold storage | Infrequently accessed |

**EBS Features:**
- Snapshots — incremental backups ไป S3
- Encryption — AES-256, KMS
- Multi-attach — attach volume หลาย EC2 (io2 ที่ cluster-enabled)

### 4.11 AWS Storage Gateway

**หลักการทำงาน:** เชื่อมต่อ on-premises กับ AWS storage

| Type | คำอธิบาย |
|---|---|
| **File Gateway** | NFS/SMB ไป S3 |
| **Volume Gateway** | iSCSI, store data ใน S3 (cached/stored) |
| **Tape Gateway** | Virtual tape library ไป S3/Glacier |

### 4.12 Amazon S3 Glacier

**หลักการทำงาน:** Low-cost archive storage (ครอบคลุมใน S3 storage classes)

- Vault — container สำหรับ archives
- Vault Lock — enforce compliance policies

---

### 4.13 Amazon RDS (Relational Database Service)

**หลักการทำงาน:** Managed relational database

**Engine Options:**

| Engine | คำอธิบาย |
|---|---|
| **MySQL** | Open-source, popular |
| **PostgreSQL** | Open-source, advanced |
| **MariaDB** | MySQL-compatible, open-source |
| **Oracle** | Enterprise, BYOL หรือ license included |
| **SQL Server** | Microsoft, BYOL หรือ license included |
| **Aurora** | AWS proprietary, MySQL/PostgreSQL compatible, 5x faster than MySQL |

**RDS Features:**
- **Multi-AZ** — synchronous replication, automatic failover
- **Read Replica** — asynchronous replication for read scaling (MySQL, PostgreSQL, Aurora)
- **Automated Backups** — daily snapshots + transaction logs
- **Automated Patching** — maintenance windows
- **Encryption** — KMS, TLS in transit
- **IAM Authentication** — database login ด้วย IAM

### 4.14 Amazon Aurora

**หลักการทำงาน:** Cloud-native relational database

- Auto-scaling storage (10 GB–128 TB)
- 6-way replication across 3 AZs
- Continuous backup to S3
- Point-in-time recovery
- Serverless option — auto pause/resume

### 4.15 Amazon DynamoDB

**หลักการทำงาน:** Serverless NoSQL database

**Features:**
- **Tables, Items, Attributes** — NoSQL document model
- **Primary Key** — Partition key หรือ Partition + Sort key
- **Partitioning** — Auto partitions based on size and throughput
- **On-Demand** — pay per request
- **Provisioned** — set RCU/WCU, discounted with RI
- **DAX (DynamoDB Accelerator)** — in-memory cache (10x faster reads)
- **Global Tables** — multi-region active-active replication
- **TTL** — auto-delete expired items
- **Streams** — capture item-level changes (like CDC)

### 4.16 Amazon ElastiCache

**หลักการทำงาน:** Managed in-memory caching

| Engine | คำอธิบาย |
|---|---|
| **Memcached** | Simple, multi-threaded, no persistence |
| **Redis** | Data structures, pub/sub, persistence, replication |

### 4.17 Amazon Redshift

**หลักการทำงาน:** Enterprise data warehouse (Petabyte-scale)

- Columnar storage
- Massively Parallel Processing (MPP)
- **RA3** — separate compute and storage
- **Redshift Serverless** — auto-provision
- **Data sharing** — share data across accounts

### 4.18 Amazon DocumentDB

**หลักการทำงาน:** Managed MongoDB-compatible database

- JSON document store
- Auto-scaling storage
- Fully managed

### 4.19 Amazon Neptune

**หลักการทำงาน:** Managed graph database

- **Property Graph** (Apache TinkerPop Gremlin)
- **RDF** (SPARQL)
- Use cases: fraud detection, knowledge graphs, recommendation

### 4.20 Amazon Timestream

**หลักการทำงาน:** Managed time-series database

- Serverless, auto scaling
- Scheduled queries
- Store IoT, monitoring, analytics data

### 4.21 Amazon QLDB (Quantum Ledger Database)

**หลักการทำงาน:** Immutable, cryptographically verifiable ledger

- Append-only
- Crypto-verifiable transaction history
- Not for blockchain — centralized ledger

### 4.22 Amazon Keyspaces

**หลักการทำงาน:** Managed Apache Cassandra-compatible database

- Serverless, auto scaling
- Cassandra Query Language (CQL)

---

### 4.23 Amazon VPC — Networking

(ดู Domain 2 ส่วน VPC แล้วข้างบน)

### 4.24 Amazon Route 53

**หลักการทำงาน:** Managed DNS และ domain registration

**DNS Record Types:**

| Type | คำอธิบาย |
|---|---|
| **A** | Map domain → IPv4 |
| **AAAA** | Map domain → IPv6 |
| **CNAME** | Domain → another domain (no Apex) |
| **Alias** | AWS-specific, map to AWS resource (รวม Apex) |
| **MX** | Mail servers |
| **TXT** | Text records (SPF, verification) |
| **PTR** | Reverse DNS |
| **SOA** | Start of Authority |
| **NS** | Name servers |

**Routing Policies:**

| Policy | คำอธิบาย |
|---|---|
| **Simple** | 1 record, multiple values → random |
| **Weighted** | % กระจายไปแต่ละ target |
| **Latency** | เลือก region ที่ latency ต่ำสุด |
| **Failover** | Primary → Secondary เมื่อ primary down |
| **Geolocation** | เลือกตามตำแหน่งผู้ใช้ |
| **Geoproximity** | กระจายตามตำแหน่ง + bias |
| **IP-based** | เลือกตาม IP range ของผู้ใช้ |
| **Multi-Value Answer** | หลาย records + health check |

**Health Checks:**
- Monitor endpoint health
- Automated DNS failover

### 4.25 Amazon CloudFront

**หลักการทำงาน:** CDN (Content Delivery Network)

- **Edge Locations** — cache content ทั่วโลก
- **Regional Edge Cache** — cache layer หลังจาก edge
- **Origins** — source of content (S3, EC2, ELB, custom HTTP)
- **Viewer Protocol Policy** — HTTP/HTTPS redirect
- **Origin Protocol Policy** — HTTP/HTTPS to origin
- **Cache Behavior** — path-specific rules
- **Signed URLs / Signed Cookies** — restrict content access
- **Lambda@Edge** — run functions at edge
- **AWS WAF** integration
- **AWS Shield** integration
- **Geo-restriction** — block/allow countries

### 4.26 Amazon API Gateway

**หลักการทำงาน:** Managed API service สำหรับ REST, WebSocket, HTTP APIs

- **REST API** — RESTful, features ครบ
- **HTTP API** — lightweight, 45% cheaper, 60% faster
- **WebSocket API** — real-time apps (chat, dashboards)
- **Stages** — dev, staging, prod
- **Authorizers** — Lambda, Cognito, IAM
- **Rate limiting** — throttle per client
- **Caching** — cache responses
- **CORS** — cross-origin support
- **Mock integration** — for testing

### 4.27 AWS Direct Connect

**หลักการทำงาน:** เชื่อมต่อ on-premises กับ AWS โดยตรงผ่าน dedicated line

- **Dedicated Connection** — physical 1 Gbps หรือ 10 Gbps
- **Hosted Connection** — 50 Mbps ถึง 10 Gbps ผ่าน AWS partner
- **Private Virtual Interface** — เข้า VPC privately
- **Public Virtual Interface** — เข้า AWS public services
- **Transit Virtual Interface** — เชื่อมหลาย VPCs ผ่าน Transit Gateway
- ไม่ผ่าน internet → consistent network, lower cost

### 4.28 AWS VPN

**หลักการทำงาน:** Encrypted tunnel ผ่าน internet

| Type | คำอธิบาย |
|---|---|
| **Site-to-Site VPN** | On-premises → VPC (IPSec) |
| **Client VPN** | Remote user → AWS (OpenVPN) |

### 4.29 AWS Transit Gateway

**หลักการทำงาน:** Hub สำหรับเชื่อมต่อ VPCs และ on-premises

- Centralized routing
-减少 complexity ของ VPC peering
- Supports Direct Connect และ VPN
- Transit Gateway Route Tables

### 4.30 Amazon Route 53 Resolver

**หลักการทำงาน:** Managed DNS สำหรับ VPC

- **Inbound Resolver** — ให้ on-premises query Route 53
- **Outbound Resolver** — ให้ VPC query on-premises DNS
- **Conditional Forwarding Rules**

### 4.31 AWS Application Discovery Service

**หลักการทำงาน:** ช่วยวางแผน migration โดย collect data

### 4.32 AWS Migration Hub

**หลักการทำงาน:** Track migration projects ที่เดียว

---

## 5. Domain 4: Billing and Pricing (16%)

### 5.1 AWS Pricing Model

| Model | คำอธิบาย | ตัวอย่าง |
|---|---|---|
| **Pay-as-you-go** | จ่ายตามที่ใช้ | EC2, Lambda |
| **Pay less by using more** | Volume discounts | S3, EBS |
| **Pay even less by committing** | Reserved capacity | RDS, ElastiCache |
| **Free** | ฟรี tier | CloudWatch, IAM |

### 5.2 AWS Free Tier

| Type | รายละเอียด |
|---|---|
| **Always Free** | Lambda (400,000 GB-seconds), DynamoDB (25 GB), SNS, SQS ฯลฯ |
| **12 Months Free** | EC2 (750 hr), S3 (5 GB), RDS (750 hr), CloudFront (1 TB) |
| **Short-term Trials** | Free trials for specific services |

### 5.3 AWS Pricing Calculator

**หลักการทำงาน:** Tool สำหรับประมาณค่าใช้จ่ายก่อนใช้งานจริง

- Create estimate ก่อน deploy
- Compare pricing of different configurations
- Export to CSV

### 5.4 AWS Cost Explorer

**หลักการทำงาน:** Visualize และ analyze costs

- Cost by service, linked account, tag
- Forecast future costs
- Reserved Instance utilization
- Recommendation for Savings Plans

### 5.5 AWS Budgets

**หลักการทำงาน:** ตั้งงบประมาณและแจ้งเตือน

- **Budget Types:** Cost, Usage, RI Coverage, RI Utilization
- **Alert Thresholds:** actual vs forecasted
- **Actions:** SNS alert เมื่อใกล้เกิน budget

### 5.6 AWS Cost and Usage Report

**หลักการทำงาน:** Most detailed billing data

- Granular data at resource level
- Publish ไป S3
- ใช้ Athena, QuickSight วิเคราะห์

### 5.7 AWS Billing and Cost Management

| Feature | คำอธิบาย |
|---|---|
| **Consolidated Billing** | รวม bills จาก multiple accounts ใน Organization |
| **Payment Methods** | Credit card, invoice |
| **Credits** | Apply promotional credits |
| **Tax Settings** | Tax exemption settings |

### 5.8 AWS Cost Anomaly Detection

**หลักการทำงาน:** ML ตรวจจับค่าใช้จ่ายผิดปกติ

- Monitor spending patterns
- Alert เมื่อ detects anomaly
- Automatic root cause analysis

### 5.9 AWS Savings Plans

**หลักการทำงาน:** Flexible pricing model ที่ลดราคาสูงสุด 72%

| Type | คำอธิบาย |
|---|---|
| **Compute Savings Plans** | EC2, Lambda, Fargate — flexible |
| **EC2 Instance Savings Plans** | เฉพาะ EC2 — ลดราคามากที่สุด |
| **SageMaker Savings Plans** | เฉพาะ SageMaker |

### 5.10 Reserved Instance (RI)

**หลักการทำงาน:** Reserve capacity 1-3 ปี ลดราคา

| Offering | Payment Options |
|---|---|
| **No Upfront** | จ่ายทีหลัง |
| **Partial Upfront** | จ่ายบางส่วนก่อน |
| **All Upfront** | จ่ายเต็มที ลดราคามากสุด |

**Types:**
- **Standard RI** — ลดราคาสูงสุด 72%, ปรับเปลี่ยนได้น้อย
- **Convertible RI** — ลดราคา 54%, ปรับเปลี่ยนได้มากกว่า

### 5.11 Spot Instance Pricing

**หลักการทำงาน:** ใช้ idle EC2 capacity ลดราคา 90%

- Interruptible anytime (2-minute warning)
- ใช้ batch processing, fault-tolerant workloads

### 5.12 TCO (Total Cost of Ownership)

**หลักการทำงาน:** เปรียบเทียบค่าใช้จ่าย on-premises กับ cloud

- AWS Pricing Calculator ช่วย estimate
- รวม: hardware, software, facilities, staff

### 5.13 AWS Landing Zone

**หลักการทำงาน:** Secure, multi-account AWS environment

- Account Vending Machine (AVM)
- Managed via AWS Control Tower

### 5.14 AWS License Manager

**หลักการทำงาน:** จัดการ software licenses

- Track license usage
- Enforce compliance
- BYOL support

### 5.15 AWS Marketplace

**หลักการทำงาน:** Digital catalog ของ third-party software

- ใช้ existing AWS account ซื้อ
- License billing through AWS

---

## 6. สรุป Services ที่ออกสอบ

### ครอบคลุมทั้ง 4 Domains

#### Domain 1: Cloud Concepts
- AWS Cloud benefits และ principles
- Cloud architecture design patterns
- Cloud computing types (IaaS, PaaS, SaaS)
- AWS Global Infrastructure

#### Domain 2: Security & Compliance
| Service | หน้าที่ |
|---|---|
| IAM | จัดการ identity และ access |
| Organizations | จัดการ multi-account |
| Artifact | Compliance reports |
| KMS | Encryption keys |
| CloudTrail | API call logging |
| Config | Resource configuration tracking |
| GuardDuty | Threat detection |
| Security Hub | Centralized security |
| Inspector | Vulnerability scanning |
| Macie | S3 data classification |
| WAF | Web application firewall |
| Shield | DDoS protection |
| VPC | Isolated network |
| Inspector | Network vulnerability assessment |

#### Domain 3: Technology
| Service | หน้าที่ |
|---|---|
| EC2 | Virtual servers |
| Lambda | Serverless compute |
| Elastic Beanstalk | PaaS deployment |
| Lightsail | Simple VPS |
| Batch | Batch processing |
| S3 | Object storage |
| EFS | Network file system |
| FSx | Third-party file systems |
| EBS | Block storage for EC2 |
| Storage Gateway | Hybrid storage |
| RDS | Managed relational DB |
| Aurora | Cloud-native relational DB |
| DynamoDB | Serverless NoSQL DB |
| ElastiCache | In-memory cache |
| Redshift | Data warehouse |
| DocumentDB | MongoDB-compatible DB |
| Neptune | Graph database |
| Route 53 | DNS และ domain |
| CloudFront | CDN |
| API Gateway | Managed API |
| Direct Connect | Dedicated network |
| VPN | Encrypted tunnel |
| Transit Gateway | Network hub |

#### Domain 4: Billing & Pricing
| Service | หน้าที่ |
|---|---|
| Pricing Calculator | Estimate costs |
| Cost Explorer | Visualize costs |
| Budgets | ตั้งงบประมาณ + alerts |
| Cost & Usage Report | Detailed billing data |
| Savings Plans | Discounted pricing |
| Reserved Instances | Reserved capacity |
| Cost Anomaly Detection | ตรวจจับค่าใช้จ่ายผิดปกติ |
| Billing & Cost Management | AWS billing console |
| AWS Marketplace | Third-party software catalog |

---

## หลักการสำคัญที่ต้องจำ

### Shared Responsibility Model
```
AWS รับผิดชอบ: "Security OF the Cloud"
  - Physical infrastructure
  - Network infrastructure
  - Hypervisor
  - Managed services

ลูกค้ารับผิดชอบ: "Security IN the Cloud"
  - Data encryption
  - IAM policies
  - Application security
  - Network configuration
```

### Well-Architected Framework — 5 Pillars
1. **Operational Excellence** — run, monitor, improve
2. **Security** — protect data, systems, assets
3. **Reliability** — recover from failures, scale
4. **Performance Efficiency** — use resources efficiently
5. **Cost Optimization** — avoid unnecessary costs
6. **Sustainability** (new pillar) — minimize environmental impact

### AWS Support Plans

| Plan | คำอธิบาย |
|---|---|
| **Basic** | ฟรี, ไม่มี TAM, case limits |
| **Developer** | 29 USD/เดือน, business hours support, 1 primary contact |
| **Business** | 100 USD/เดือน, 24/7 support, TAM, all features |
| **Enterprise** | 15,000 USD/เดือน, Enterprise TAM, Concierge Support Team |

---

*ไฟล์นี้จัดทำจากข้อมูล Exam Guide CLF-C02 ของ AWS Certified Cloud Practitioner*
*ต้องการข้อมูลเพิ่มเติม service ไหน บอกได้เลยครับ*
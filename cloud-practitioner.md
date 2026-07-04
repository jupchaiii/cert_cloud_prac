# คู่มือศึกษาสำหรับ AWS Certified Cloud Practitioner (CLF-C02)

> **หมายเหตุ**: เอกสารนี้จัดทำขึ้นเพื่อเป็นแนวทางในการเตรียมสอบ AWS Certified Cloud Practitioner ข้อมูลทั้งหมดอ้างอิงจากแหล่งข้อมูลอย่างเป็นทางการของ AWS และอาจมีการเปลี่ยนแปลงตามดุลยพินิจของ AWS

---

## สารบัญ

1. [ภาพรวมของการสอบ](#1-ภาพรวมของการสอบ)
2. [โดเมนเนื้อหาการสอบ](#2-โดเมนเนื้อหาการสอบ)
3. [บริการ AWS ที่อยู่ในขอบเขตการสอบ](#3-บริการ-aws-ที่อยู่ในขอบเขตการสอบ)
4. [เทคโนโลยีและแนวคิดที่ควรศึกษา](#4-เทคโนโลยีและแนวคิดที่ควรศึกษา)
5. [แนวทางการเตรียมตัวสอบ](#5-แนวทางการเตรียมตัวสอบ)
6. [เคล็ดลับในการสอบ](#6-เคล็ดลับในการสอบ)
7. [คำถามที่พบบ่อย (FAQ)](#7-คำถามที่พบบ่อย-faq)

---

## 1. ภาพรวมของการสอบ

### ข้อมูลพื้นฐาน

| หัวข้อ | รายละเอียด |
|--------|-------------|
| **รหัสการสอบ** | CLF-C02 |
| **ระดับ** | Foundational (ระดับพื้นฐาน) |
| **ระยะเวลา** | 90 นาที |
| **จำนวนข้อสอบ** | 65 ข้อ (50 ข้อที่ใช้คะแนน + 15 ข้อที่ไม่นับคะแนน) |
| **รูปแบบข้อสอบ** | คำถามแบบเลือกตอบเดียว (Single Choice) หรือเลือกหลายคำตอบ (Multiple Choice) |
| **ค่าใช้จ่าย** | 100 USD (อาจมีอัตราแลกเปลี่ยนตามประเทศ) |
| **วิธีการสอบ** | สอบที่ศูนย์สอบ Pearson VUE หรือ Online Proctored Exam |
| **ภาษาที่รองรับ** | อาหรับ, อังกฤษ, บาฮาซา (อินโดนีเซีย), ฝรั่งเศส, เยอรมัน, อิตาลี, ญี่ปุ่น, เกาหลี, โปรตุเกส (บราซิล), สเปน (ละตินอเมริกา), สเปน (สเปน), จีนตัวย่อ, จีนตัวเต็ม |
| **ความถูกต้องของใบรับรอง** | 3 ปี |

### ใครควรสอบการสอบนี้?

การสอบนี้ออกแบบมาสำหรับผู้ที่เริ่มต้นใช้งาน Cloud และอาจไม่มีพื้นฐานด้าน IT มาก่อน เหมาะสำหรับ:

- พนักงานในตำแหน่งงานที่เกี่ยวกับธุรกิจ เช่น ฝ่ายขาย, การตลาด, ผลิตภัณฑ์ หรือการจัดการโครงการ
- ผู้ที่ต้องการเปลี่ยนอาชีพเข้าสู่สาย Cloud
- ผู้ที่ต้องการความรู้พื้นฐานเกี่ยวกับ AWS Cloud เพื่อสื่อสารกับทีมเทคนิคได้ดีขึ้น
- ไม่จำเป็นต้องมีประสบการณ์ IT หรือ Cloud มาก่อน (แนะนำมีประสบการณ์ Cloud ไม่เกิน 6 เดือน)

### ขั้นตอนการสมัครสอบ

```
1. สร้างบัญชี AWS Certification → https://www.aws.training/certification/
2. ชำระค่าสอบ 100 USD
3. นัดหมายการสอบที่ Pearson VUE หรือเลือก Online Proctored
4. เข้าสอบตามเวลาที่นัดหมาย
```

---

## 2. โดเมนเนื้อหาการสอบ

การสอบแบ่งเนื้อหาออกเป็น 4 โดเมนหลัก โดยมีน้ำหนักคะแนนดังนี้:

| โดเมน | ชื่อ | น้ำหนัก |
|-------|------|---------|
| 1 | Cloud Concepts | 24% |
| 2 | Security and Compliance | 30% |
| 3 | Cloud Technology and Services | 34% |
| 4 | Billing, Pricing, and Support | 12% |

---

### โดเมนที่ 1: Cloud Concepts (24%)

#### หัวข้อที่ต้องรู้:

**1.1 คุณประโยชน์ของ AWS Cloud**
- ข้อเสนอคุณค่าของ AWS Cloud
- ข้อดีของโครงสร้างพื้นฐานระดับโลก (เช่น ความเร็วในการ Deploy, การเข้าถึงทั่วโลก)
- ข้อดีของ High Availability, Elasticity และ Agility

**1.2 Design Principles ของ AWS Cloud**
- AWS Well-Architected Framework
- 6 เสาหลักของ Well-Architected Framework:
  1. Operational Excellence
  2. Security
  3. Reliability
  4. Performance Efficiency
  5. Cost Optimization
  6. Sustainability

**1.3 การย้ายระบบไปยัง AWS Cloud**
- Cloud Adoption Strategies
- AWS Cloud Adoption Framework (AWS CAF)
  - ลดความเสี่ยงทางธุรกิจ
  - ปรับปรุงด้าน ESG
  - เพิ่มรายได้
  - เพิ่มประสิทธิภาพการดำเนินงาน
- กลยุทธ์การย้าย (เช่น Database Replication, AWS Snowball)

**1.4 แนวคิดเศรษฐศาสตร์ของ Cloud**
- ต้นทุนคงที่ vs ต้นทุนแปรผัน
- ต้นทุนที่เกี่ยวข้องกับ On-premises
- ความแตกต่างของ Licensing (BYOL vs Included Licenses)
- แนวคิด Rightsizing
- ประโยชน์ของ Automation
- Economies of Scale

---

### โดเมนที่ 2: Security and Compliance (30%)

#### หัวข้อที่ต้องรู้:

**2.1 AWS Shared Responsibility Model**
- ส่วนประกอบของ Shared Responsibility Model
- ความรับผิดชอบของลูกค้าบน AWS
- ความรับผิดชอบของ AWS
- ความรับผิดชอบร่วมกัน
- การเปลี่ยนแปลงความรับผิดชอบตามบริการที่ใช้ (เช่น Amazon RDS, Lambda, EC2)

**2.2 AWS Compliance and Governance Concepts**
- ข้อดีของ Cloud Security (เช่น Encryption)
- ที่เก็บ Log ที่เกี่ยวข้องกับ Cloud Security
- AWS Artifact
- ความต้องการ Compliance ตามภูมิศาสตร์หรืออุตสาหกรรม
- บริการสำหรับความปลอดภัย:
  - Amazon Inspector
  - AWS Security Hub
  - Amazon GuardDuty
  - AWS Shield
- Encryption options: Encryption in Transit, Encryption at Rest
- บริการ Governance และ Compliance:
  - Amazon CloudWatch (Monitoring)
  - AWS CloudTrail (Auditing)
  - AWS Audit Manager
  - AWS Config
  - Access Reports

**2.3 Identity and Access Management (IAM)**
- ความสำคัญของการปกป้อง AWS Root User Account
- หลักการ Principle of Least Privilege
- AWS IAM Identity Center (AWS Single Sign-On)
- Access Keys, Password Policies, Credential Storage:
  - AWS Secrets Manager
  - AWS Systems Manager
- Authentication Methods:
  - Multi-Factor Authentication (MFA)
  - IAM Identity Center
  - Cross-account IAM Roles
- Groups, Users, Custom Policies, Managed Policies
- งานที่ Only Root User ทำได้
- วิธีการปกป้อง Root User
- ประเภทของ Identity Management (เช่น Federated)

**2.4 Security Capabilities และ Documentation**
- AWS Security Features และ Services:
  - AWS WAF
  - AWS Firewall Manager
  - AWS Shield
  - Amazon GuardDuty
- Third-party Security Products จาก AWS Marketplace
- แหล่งข้อมูล Security:
  - AWS Knowledge Center
  - AWS Security Center
  - AWS Security Blog
- AWS Trusted Advisor

---

### โดเมนที่ 3: Cloud Technology and Services (34%)

#### หัวข้อที่ต้องรู้:

**3.1 วิธีการ Provision และ Operate ใน AWS Cloud**
- การเข้าถึง AWS Services:
  - Programmatic Access (APIs, SDKs, CLI)
  - AWS Management Console
  - Infrastructure as Code (IaC)
- One-time Operations vs Repeatable Processes
- Cloud Deployment Models: Cloud, Hybrid, On-premises

**3.2 AWS Regions, Availability Zones, Edge Locations**
- ความสัมพันธ์ระหว่าง Regions, Availability Zones, Edge Locations
- การบรรลุ High Availability โดยใช้หลาย Availability Zones
- Availability Zones ไม่มี Single Points of Failure
- การใช้หลาย Regions: Disaster Recovery, Business Continuity, Low Latency, Data Sovereignty

**3.3 AWS Compute Services**
- Amazon EC2:
  - Instance Types: Compute Optimized, Storage Optimized, Memory Optimized, General Purpose
  - Purchasing Options: On-Demand, Reserved, Spot, Savings Plans, Dedicated Hosts, Dedicated Instances, Capacity Reservations
- Containers:
  - Amazon ECS (Elastic Container Service)
  - Amazon EKS (Elastic Kubernetes Service)
  - AWS Fargate (Serverless Compute for Containers)
- Serverless:
  - AWS Lambda
- Auto Scaling สำหรับ Elasticity
- Load Balancers

**3.4 AWS Database Services**
- EC2 Hosted Databases vs AWS Managed Databases
- Relational Databases: Amazon RDS, Amazon Aurora
- NoSQL Databases: Amazon DynamoDB
- Memory-based Databases: Amazon ElastiCache
- Database Migration Tools:
  - AWS DMS (Database Migration Service)
  - AWS SCT (Schema Conversion Tool)

**3.5 AWS Network Services**
- VPC Components: Subnets, Gateways
- VPC Security: Network ACLs, Security Groups, Amazon Inspector
- Amazon Route 53 (DNS Service)
- Network Connectivity Options:
  - AWS VPN
  - AWS Direct Connect
- Amazon CloudFront (CDN)
- API Gateway

**3.6 AWS Storage Services**
- Object Storage: Amazon S3
  - S3 Storage Classes: Standard, Intelligent-Tiering, Standard-IA, Glacier, Glacier Deep Archive
- Block Storage: Amazon EBS, Instance Store
- File Storage: Amazon EFS, Amazon FSx
- Cached File Systems: AWS Storage Gateway
- Lifecycle Policies
- AWS Backup

**3.7 AWS AI/ML Services**
- Amazon SageMaker AI
- Amazon Lex (Chatbots)
- Amazon Kendra (Enterprise Search)

**3.8 AWS Analytics Services**
- Amazon Athena (Query S3 with SQL)
- Amazon Kinesis (Stream Processing)
- AWS Glue (Data Integration)
- Amazon QuickSight (Business Intelligence)

**3.9 Application Integration**
- Amazon EventBridge
- Amazon SNS (Simple Notification Service)
- Amazon SQS (Simple Queue Service)
- AWS Step Functions

**3.10 Business Applications**
- Amazon Connect (Contact Center)
- Amazon SES (Simple Email Service)

**3.11 Developer Tools**
- AWS CodeBuild
- AWS CodePipeline
- AWS X-Ray

**3.12 End User Computing**
- Amazon AppStream 2.0
- Amazon WorkSpaces
- Amazon WorkSpaces Secure Browser

**3.13 IoT**
- AWS IoT Core

---

### โดเมนที่ 4: Billing, Pricing, and Support (12%)

#### หัวข้อที่ต้องรู้:

**4.1 Compute Purchasing Options**
- On-Demand Instances
- Reserved Instances (และความยืดหยุ่น)
- Spot Instances
- AWS Savings Plans
- Dedicated Hosts
- Dedicated Instances
- Capacity Reservations
- ต้นทุน Data Transfer:
  - Incoming Data Transfer (ฟรี)
  - Outgoing Data Transfer (มีค่าใช้จ่าย)

**4.2 Storage Pricing**
- ตัวเลือกและระดับราคาของ Storage ต่างๆ
- ราคาตาม S3 Storage Classes

**4.3 Billing Support and Information**
- AWS Budgets
- AWS Cost Explorer
- AWS Pricing Calculator
- AWS Organizations:
  - Consolidated Billing
  - Cost Allocation
- Cost Allocation Tags และ Billing Reports (AWS Cost and Usage Report)

**4.4 Support Plans**
| Plan | Description |
|------|-------------|
| Basic | สำหรับลูกค้าทั่วไป, เอกสาร, ฟอรัม |
| Developer | สำหรับนักพัฒนา, ตอบคำถามทางเทคนิคในเวลาทำการ |
| Business | สำหรับองค์กร, Support ตลอด 24 ชม., ตอบคำถามใน 1 ชม. |
| Enterprise On-Ramp | สำหรับองค์กรใหญ่, Technical Account Manager |
| Enterprise | สำหรับองค์กรใหญ่มาก, Dedicated TAM, 24/7 phone support |

**4.5 AWS Partner Network**
- AWS Marketplace
- Independent Software Vendors (ISVs)
- System Integrators
- Partner Training และ Certification
- Partner Volume Discounts

**4.6 Technical Assistance**
- AWS Professional Services
- AWS Solutions Architects
- AWS Trusted Advisor
- AWS Health Dashboard / AWS Health API
- AWS Trust and Safety Team (สำหรับ Report Abuse)
- AWS Prescriptive Guidance
- AWS Knowledge Center
- AWS re:Post

---

## 3. บริการ AWS ที่อยู่ในขอบเขตการสอบ

### Analytics
- Amazon Athena
- Amazon EMR
- AWS Glue
- Amazon Kinesis
- Amazon OpenSearch Service
- Amazon QuickSight
- Amazon Redshift

### Application Integration
- Amazon EventBridge
- Amazon Simple Notification Service (SNS)
- Amazon Simple Queue Service (SQS)
- AWS Step Functions

### Business Applications
- Amazon Connect
- Amazon Simple Email Service (SES)

### Cloud Financial Management
- AWS Budgets
- AWS Cost Explorer
- AWS Pricing Calculator

### Compute
- AWS Auto Scaling
- Amazon EC2
- Amazon ECS
- Amazon EKS
- AWS Elastic Beanstalk
- AWS Fargate
- AWS Lambda

### Containers
- Amazon ECR (Elastic Container Registry)
- Amazon ECS
- Amazon EKS

### Customer Enablement
- AWS Training
- AWS Skill Builder

### Database
- Amazon Aurora
- Amazon DynamoDB
- Amazon ElastiCache
- Amazon RDS
- AWS DMS (Database Migration Service)
- AWS SCT (Schema Conversion Tool)

### Developer Tools
- AWS CodeBuild
- AWS CodePipeline
- AWS X-Ray

### End User Computing
- Amazon AppStream 2.0
- Amazon WorkSpaces
- Amazon WorkSpaces Secure Browser

### Frontend Web and Mobile
- AWS Amplify
- AWS AppSync

### Internet of Things (IoT)
- AWS IoT Core

### Machine Learning
- Amazon Lex
- Amazon Kendra
- Amazon SageMaker AI

### Management and Governance
- AWS Auto Scaling
- AWS CloudFormation
- AWS CloudTrail
- Amazon CloudWatch
- AWS Compute Optimizer
- AWS Config
- AWS Control Tower
- AWS Health Dashboard
- AWS License Manager
- AWS Management Console
- AWS Organizations
- AWS Service Catalog
- Service Quotas
- AWS Systems Manager
- AWS Trusted Advisor
- AWS Well-Architected Tool

### Migration and Transfer
- AWS Application Discovery Service
- AWS Application Migration Service
- AWS Database Migration Service (DMS)
- Migration Evaluator
- AWS Migration Hub
- AWS Schema Conversion Tool (SCT)
- AWS Snow Family

### Networking and Content Delivery
- Amazon API Gateway
- Amazon CloudFront
- AWS Direct Connect
- Amazon Route 53
- AWS VPN
- Amazon VPC

### Security, Identity, and Compliance
- AWS Artifact
- AWS Audit Manager
- AWS Certificate Manager (ACM)
- AWS CloudHSM
- Amazon Cognito
- Amazon Detective
- AWS Directory Service
- AWS Firewall Manager
- Amazon GuardDuty
- AWS Identity and Access Management (IAM)
- AWS IAM Identity Center
- Amazon Inspector
- AWS Key Management Service (KMS)
- Amazon Macie
- AWS Resource Access Manager (RAM)
- AWS Secrets Manager
- AWS Security Hub
- AWS Shield
- AWS WAF

### Serverless
- AWS Lambda
- Amazon DynamoDB
- Amazon S3

### Storage
- Amazon EBS (Elastic Block Store)
- Amazon EFS (Elastic File System)
- Amazon FSx
- Amazon S3 (Simple Storage Service)
- AWS Storage Gateway
- AWS Backup

---

## 4. เทคโนโลยีและแนวคิดที่ควรศึกษา

### APIs และการเข้าถึง Services
- REST APIs
- AWS SDKs (Software Development Kits)
- AWS CLI (Command Line Interface)
- AWS Management Console

### AWS Cloud Adoption Framework (AWS CAF)
- Business Capabilities
- People Capabilities
- Governance Capabilities
- Platform Capabilities
- Security Capabilities
- Operations Capabilities

### AWS Compliance Programs
- SOC (Service Organization Control)
- PCI DSS (Payment Card Industry Data Security Standard)
- HIPAA (Health Insurance Portability and Accountability Act)
- GDPR (General Data Protection Regulation)
- FedRAMP (Federal Risk and Authorization Management Program)

### AWS Global Infrastructure
- AWS Regions
- Availability Zones
- Edge Locations (CloudFront PoPs)
- Local Zones
- Wavelength Zones

### Infrastructure as Code (IaC)
- AWS CloudFormation
- AWS CDK (Cloud Development Kit)

### AWS Well-Architected Framework (6 ประเภท)
1. **Operational Excellence** - ประสิทธิภาพการทำงาน
2. **Security** - ความปลอดภัย
3. **Reliability** - ความน่าเชื่อถือ
4. **Performance Efficiency** - ประสิทธิภาพของระบบ
5. **Cost Optimization** - การปรับปรุงต้นทุน
6. **Sustainability** - ความยั่งยืน

### AWS Support Plans และ Services
- AWS Support Center
- AWS Trusted Advisor
- AWS Health Dashboard
- AWS Professional Services
- AWS Solutions Architects

---

## 5. แนวทางการเตรียมตัวสอบ

### ขั้นตอนที่ 1: ทำความเข้าใจการสอบ
1. ศึกษา Exam Guide อย่างละเอียด
2. ทำ Official Practice Question Set
3. ทำ Official Pretest เพื่อประเมินจุดอ่อน

### ขั้นตอนที่ 2: เรียนรู้และฝึกฝน
1. ลงทะเบียน Digital Courses บน AWS Skill Builder
2. ฝึกฝนกับ AWS Builder Labs
3. เล่น AWS Cloud Quest
4. ทดลองใช้ AWS Jam

### ขั้นตอนที่ 3: ทบทวนและฝึกถามตอบ
1. ทบทวน Exam Domain Topics ทั้ง 4 โดเมน
2. ทำ Flashcards เพื่อทบทวน
3. เรียนจาก Instructors ที่สอนวิธีทำข้อสอบ
4. ฝึกกับ AWS SimuLearn หรือ AWS Escape Room

### ขั้นตอนที่ 4: ประเมินความพร้อม
1. ทำ Official Practice Exam
2. ประเมินผลคะแนน
3. ทบทวนหัวข้อที่ยังไม่แน่นใจ

### ทรัพยากรการเรียนรู้ที่แนะนำ

| ทรัพยากร | รายละเอียด |
|---------|-------------|
| AWS Skill Builder | แพลตฟอร์มเรียนรู้อย่างเป็นทางการของ AWS |
| AWS Cloud Quest | เกมส์การเรียนรู้แบบ Game-based |
| AWS Official Documentation | เอกสารทางการของ AWS |
| AWS re:Post | ชุมชนถาม-ตอบของ AWS |
| AWS Training Partners | พันธมิตรที่ได้รับการรับรองจาก AWS |
| AWS Whitepapers | เอกสาร Whitepaper ของ AWS |

---

## 6. เคล็ดลับในการสอบ

### ก่อนวันสอบ
- พักผ่อนให้เพียงพอ
- เตรียมเอกสารที่จำเป็น ( Passport หรือ ID ที่มีรูปถ่าย)
- ทดสอบระบบ Computer สำหรับ Online Proctoring ล่วงหน้า
- ศึกษาเส้นทางไปศูนย์สอบ

### ระหว่างการสอบ
- อ่านคำถามให้ละเอียด
- ระวังคำถามที่เป็น "NOT", "EXCEPT", "FALSE"
- จัดการเวลาให้ดี (ประมาณ 1.5 นาทีต่อข้อ)
- ทำข้อที่แน่ใจก่อน
- ไม่มีคะแนนติดลบ - ควรเดาถ้าไม่แน่ใจ
- ระวังเรื่อง Distractors (ตัวเลือกที่หลอก)

### หลังสอบ
- รอผลอย่างเป็นทางการ 5 วัการทำงาน
- ผลสอบจะแสดงใน AWS Certification Account

---

## 7. คำถามที่พบบ่อย (FAQ)

### Q: การสอบนี้มีค่าใช้จ่ายเท่าไหร่?
**A:** 100 USD สำหรับการสอบปกติ อาจมีอัตราแลกเปลี่ยนตามประเทศ

### Q: สอบผ่านแล้วต้อง Renew อย่างไร?
**A:** ใบรับรองมีอายุ 3 ปี สามารถ:
1. สอบใหม่ (มีส่วนลด 50% หลังสอบผ่าน)
2. สอบ Associate หรือ Professional Exam
3. ทำ AWS Cloud Quest: Recertify Cloud Practitioner (ฟรีในช่วง Beta)

### Q: ต้องมีประสบการณ์ AWS มาก่อนไหม?
**A:** ไม่จำเป็นต้องมีประสบการณ์มาก่อน แต่แนะนำให้มีความรู้พื้นฐานหรือประสบการณ์ Cloud ไม่เกิน 6 เดือน

### Q: ควรเตรียมตัวนานแค่ไหน?
**A:** ขึ้นอยู่กับพื้นฐานของแต่ละคน โดยเฉลี่ย 20-40 ชั่วโมง สำหรับผู้เริ่มต้นอาจต้อง 40-60 ชั่วโมง

### Q: สอบผ่านแล้วไปต่ออะไรได้อีก?
**A:** หลังจากได้ Cloud Practitioner แนะนำ:
- AWS Certified Solutions Architect - Associate
- AWS Certified Developer - Associate
- AWS Certified SysOps Administrator - Associate

### Q: มีส่วนลดสำหรับการสอบไหม?
**A:** หลังจากสอบผ่านวุฒิใดก็ตาม จะได้ส่วนลด 50% สำหรับการสอบวุฒิอื่นๆ

### Q: ข้อสอบมีกี่ข้อ และต้องตอบถูกกี่ข้อ?
**A:** มี 65 ข้อ (50 ข้อที่ใช้คะแนน + 15 ข้อไม่นับคะแนน) ไม่มีข้อมูลอย่างเป็นทางการเกี่ยวกับคะแนนขั้นต่ำที่ต้องได้ แต่โดยทั่วไปต้องได้ประมาณ 70% ขึ้นไป

### Q: สามารถสอบเป็นภาษาไทยได้ไหม?
**A:** จากข้อมูลล่าสุด AWS Certified Cloud Practitioner ไม่รองรับภาษาไทยโดยตรง แต่มีให้เลือกหลายภาษา รวมถึงภาษาจีนตัวเต็มและตัวย่อ

---

## สรุป

AWS Certified Cloud Practitioner เป็นการสอบระดับ Foundational ที่เหมาะสำหรับผู้เริ่มต้นใช้งาน AWS Cloud การสอบครอบคลุม 4 โดเมนหลัก โดยโดเมนที่มีน้ำหนักมากที่สุดคือ Cloud Technology and Services (34%) ตามด้วย Security and Compliance (30%)

การเตรียมตัวที่ดีควรประกอบด้วย:
1. การศึกษา Exam Guide อย่างละเอียด
2. การเรียนรู้จาก AWS Skill Builder และ Cloud Quest
3. การทำ Practice Questions และ Practice Exam
4. การทบทวน Services และ Concepts ที่อยู่ในขอบเขต

---

*เอกสารนี้จัดทำเมื่อ กรกฎาคม 2568 ข้อมูลอาจมีการเปลี่ยนแปลง โปรดตรวจสอบจากแหล่งข้อมูลอย่างเป็นทางการของ AWS เสมอ*

**แหล่งข้อมูลอย่างเป็นทางการ:**
- https://aws.amazon.com/certification/certified-cloud-practitioner/
- https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html
- https://skillbuilder.aws/

# Amazon EC2 (Elastic Compute Cloud) — คู่มือฉบับสมบูรณ์

> แหล่งอ้างอิง: [Amazon EC2 User Guide](https://docs.aws.amazon.com/ec2/)
> แหล่งอ้างอิง: [Amazon EC2 Instance Types](https://docs.aws.amazon.com/ec2/latest/instancetypes/)
> แหล่งอ้างอิง: [AWS EC2 API Reference](https://docs.aws.amazon.com/AWSEC2/latest/APIReference/)

---

## 1. ภาพรวม (Overview)

Amazon Elastic Compute Cloud (Amazon EC2) คือ web service ที่ предоставляет computing capacity ในรูปแบบ virtual servers (instances) ภายใน AWS Cloud โดย EC2 ช่วยให้ผู้ใช้สามารถ:

- **Provision** virtual servers (instances) ได้ภายในไม่กี่นาที
- **Scale** capacity ขึ้นหรือลงตามความต้องการ
- **Pay** เฉพาะสิ่งที่ใช้งานจริง (pay-as-you-go)
- **Customize** hardware configuration, operating system, และ software stack

EC2 ทำงานบน **AWS Nitro System** — platform ฮาร์ดแวร์ที่ AWS พัฒนาเองเพื่อประสิทธิภาพสูงสุด

---

## 2. ประเภทของ Instance (Instance Types)

Instance types แบ่งออกเป็น 5 กลุ่มหลักตาม workload ที่เหมาะสม:

### 2.1 General Purpose (ตระกูล M, T, Mac)

เหมาะสำหรับ: web servers, small-to-medium databases, development environments, sandbox

| Series | คุณสมบัติเด่น |
|--------|-------------|
| **M** | Balanced compute, memory, networking — ตระกูลที่นิยมที่สุด |
| **T** | Burstable performance — CPU สามารถ burst ได้เมื่อ workload สูง |
| **Mac** | Apple Mac mini — สำหรับ macOS workloads (Xcode, iOS builds) |

**รายละเอียด:**
- **M5 / M5a / M5ad / M5d / M5dn / M5n / M5zn** — 5th gen, Intel/AMD, NVMe SSD local storage
- **M6 / M6g / M6gd / M6i / M6id / M6idn / M6in** — 6th gen, Graviton/Intel
- **M7 / M7g / M7gd / M7i / M7i-flex** — 7th gen, latest
- **M8 / M8a / M8azn / M8g / M8gb / M8gd / M8gn / M8i / M8id / M8i-flex / M8in / M8idn / M8ine / M8ib / M8idb / M9g / M9gd** — 8th gen, latest
- **T3 / T3a / T4g** — Burstable, credit-based CPU, เหมาะกับ workload ที่ไม่ได้ใช้ CPU ตลอดเวลา

### 2.2 Compute Optimized (ตระกูล C)

เหมาะสำหรับ: high-performance web servers, scientific modeling, batch processing, machine learning inference, gaming servers

| Series | คุณสมบัติเด่น |
|--------|-------------|
| **C5 / C5a / C5ad / C5d / C5n** | High-performance processors, เหมาะกับ compute-intensive |
| **C6 / C6g / C6gd / C6i / C6id / C6in** | 6th gen, Graviton/Intel |
| **C7 / C7g / C7gd / C7i / C7i-flex** | 7th gen, latest |
| **C8 / C8g / C8gd** | 8th gen, Graviton |

**CPU ratio:** Compute Optimized มี vCPU ต่อ memory ratio สูงกว่า General Purpose

### 2.3 Memory Optimized (ตระกูล R, X, U, Z)

เหมาะสำหรับ: in-memory caches (Redis, Memcached), real-time big data analytics, SAP HANA, Oracle

| Series | คุณสมบัติเด่น |
|--------|-------------|
| **R5 / R5a / R5ad / R5b / R5n** | High memory, DDR4 |
| **R6 / R6g / R6gd / R6i / R6id** | 6th gen |
| **R7 / R7g / R7i / R7i-flex** | 7th gen |
| **R8 / R8g** | 8th gen, latest |
| **X1 / X1e** | Ultra-high memory (3,904 GB ขึ้นไป), SAP HANA certified |
| **X2 / X2idn / X2iedn / X2iezn / X2dn** | High memory, DDR5 |
| **U-7i / U9tb1 / U12tb1** | Ultra high-memory (6TB+), IBM PowerPC |
| **z1d** | High compute + high memory, SAP certified |

### 2.4 Storage Optimized (ตระกูล D, I, H)

เหมาะสำหรับ: distributed file systems (HDFS, GlusterFS), data warehousing, NoSQL databases, log processing

| Series | คุณสมบัติเด่น |
|--------|-------------|
| **D2 / D3 / D3en** | Dense storage, HDD (up to 48 TB), เหมาะกับ massive sequential I/O |
| **I3 / I3en / I4g / I4i / I5 / I5a / I5ad / I5d / I7i** | NVMe SSD, high IOPS, low latency |
| **H1** | High density, HDD (up to 16 TB), balanced |

**I4i, I5, I5a, I5d, I7i** — ใช้ Intel/NVIDIA processors, NVMe SSD

### 2.5 Accelerated Computing (ตระกูล P, G, Inf, Train)

เหมาะสำหรับ: machine learning training/inference, HPC, graphics rendering, video transcoding

| Series | GPU/Accelerator | การใช้งาน |
|--------|----------------|---------|
| **P4 / P4de** | NVIDIA A100 (400 GB GPU memory) | ML training, HPC |
| **P5 / P5e** | NVIDIA H100 | ML training (latest) |
| **P3** | NVIDIA V100 | ML training |
| **G4 / G4ad / G5 / G6** | NVIDIA T4 / A10G / L4 | ML inference, graphics |
| **G6e** | NVIDIA L40S | Graphics, ML inference |
| **Trn1 / Trn1n** | AWS Trainium | ML training (AWS custom chip) |
| **Inf1 / Inf2** | AWS Inferentia | ML inference (AWS custom chip) |
| **DL1** | Gaudi HPUs (Habana) | ML training |
| **P6** | NVIDIA H200 | ML training (latest) |

### 2.6 High Performance Computing (HPC — ตระกูล Hpc)

เหมาะสำหรับ: climate modeling, computational fluid dynamics, financial Monte Carlo simulations

- **Hpc6a** — AMD EPYC, 96 cores, high-speed networking (EFA)
- **Hpc7g / Hpc7a / Hpc7i** — Latest HPC instances

### 2.7 Instance Naming Convention

รูปแบบ: `<family><generation><size>`

ตัวอย่าง: `m5.4xlarge`

| ส่วนประกอบ | ความหมาย |
|-----------|---------|
| **m** | Instance family (general purpose) |
| **5** | Generation (5th gen) |
| **4xlarge** | Size (4x large = 16 vCPU) |

**Size suffixes:**

| Size | vCPU | Memory (approx) |
|------|------|-----------------|
| nano | 1 | 0.5 GB |
| micro | 1 | 1 GB |
| small | 1 | 2 GB |
| medium | 2 | 4 GB |
| large | 2 | 8 GB |
| xlarge | 4 | 16 GB |
| 2xlarge | 8 | 32 GB |
| 4xlarge | 16 | 64 GB |
| 8xlarge | 32 | 128 GB |
| 12xlarge | 48 | 192 GB |
| 16xlarge | 64 | 256 GB |
| 24xlarge | 96 | 384 GB |
| 32xlarge | 128 | 512 GB |
| 48xlarge | 192 | 768 GB |
| metal | 192+ | Same as largest |

**Suffix พิเศษ:**

| Suffix | ความหมาย |
|--------|---------|
| **a** | AMD processors |
| **g** | AWS Graviton (ARM) processors |
| **i** | Intel processors |
| **d** | Local NVMe SSD storage |
| **n** | High network bandwidth (100 Gbps+) |
| **dn** | High network + local NVMe |
| **ad** | AMD + local storage |
| **zn** | High frequency (Intel Xeon Scalable) |

---

## 3. ตัวเลือกการซื้อ (Purchasing Options)

### 3.1 On-Demand Instances

- **จ่ายตาม usage** — วินาทีที่ใช้ไป คิดเงินตามนั้น
- **ไม่มี upfront payment** ไม่มี commitment
- **ราคาสูงที่สุด** เมื่อเทียบกับตัวเลือกอื่น
- **เหมาะกับ:** short-term, unpredictable workloads, spikey traffic, testing/development

### 3.2 Reserved Instances (RI)

- **Commit 1 หรือ 3 ปี** เพื่อราคาลด (up to 72% vs On-Demand)
- **Upfront หรือ No upfront** payment options
- **ประเภท:**
  - **Standard RI** — ลดราคามากที่สุด, สามารถ modify size ได้ แต่ไม่สามารถเปลี่ยน instance family
  - **Convertible RI** — สามารถเปลี่ยน instance family, size, และ OS type ได้, ลดราคาน้อยกว่า Standard
- **เหมาะกับ:** predictable, steady-state workloads

### 3.3 Savings Plans

- **Commit เป็น $/hour** สำหรับ 1 หรือ 3 ปี
- **Flexible มากกว่า RI** — สามารถเปลี่ยน instance family, size, Region, OS ได้
- **2 ประเภท:**
  - **Compute Savings Plans** — ใช้ได้กับ EC2, Fargate, Lambda ที่ยืดหยุ่นที่สุด
  - **Instance Savings Plans** — ใช้ได้เฉพาะ EC2 เท่านั้น แต่ลดราคามากกว่า Compute SP
- **เหมาะกับ:** consistent workloads ที่ต้องการความยืดหยุ่น

### 3.4 Spot Instances

- **ใช้ spare capacity** ของ AWS ที่ราคาลด up to 90% vs On-Demand
- **AWS สามารถ terminate ได้ทุกเมื่อ** เมื่อต้องการ capacity คืน (2-minute warning)
- **เหมาะกับ:** fault-tolerant workloads, batch processing, ML training, CI/CD, big data analytics
- **ไม่เหมาะกับ:** databases, stateful applications, interactive workloads

### 3.5 Dedicated Hosts

- **Physical server ที่ dedicated เฉพาะคุณ** ไม่แชร์กับผู้อื่น
- **ใช้ existing per-socket/per-core software licenses** ได้ (Windows Server, SQL Server)
- **ราคาสูง** แต่เหมาะกับ compliance หรือ regulatory requirements
- **เหมาะกับ:** regulatory compliance, licensing requirements, server-bound workloads

### 3.6 Dedicated Instances

- **Instances ที่ run เฉพาะบน hardware ที่ dedicated** แต่ไม่ได้ isolate แบบ Dedicated Hosts
- **ถูกกว่า Dedicated Hosts** แต่ไม่สามารถใช้ existing licenses ได้

### 3.7 Capacity Reservations

- **Reserve capacity** ใน specific Availability Zone
- **ใช้ได้ทันที** ไม่ต้องรอ
- **สามารถใช้ร่วมกับ RI** เพื่อ coverage
- **เหมาะกับ:** critical workloads ที่ต้องมั่นใจว่ามี capacity พอ

---

## 4. Amazon Machine Images (AMI)

AMI คือ image ที่ใช้ launch EC2 instance ประกอบด้วย:

- **Operating system** (Amazon Linux 2023, Ubuntu, Windows, etc.)
- **Application server** และ applications
- **Libraries**
- **Configurations**

### 4.1 ประเภท AMI

| ประเภท | คำอธิบาย |
|--------|---------|
| **Public AMIs** | AWS และ partners จัดเตรียมไว้ (Amazon Linux, Ubuntu, Windows) |
| **AWS Marketplace AMIs** | ซื้อจาก third-party vendors (Bitnami, Red Hat, etc.) |
| **Community AMIs** | จาก AWS community |
| **Private AMIs** | สร้างเองจาก instance ที่ running |

### 4.2 การสร้าง Private AMI

```
1. Launch instance จาก public AMI
2. Customize (install software, configure)
3. Create image (Create Image จาก EC2 console หรือ aws ec2 create-image)
4. Launch instances ใหม่จาก private AMI
```

### 4.3 AMI Copy

- สามารถ copy AMI ข้าม Regions ได้
- สามารถ encrypt ได้ระหว่าง copy
- Copy ข้าม accounts ได้ด้วย permissions

---

## 5. Storage

### 5.1 Amazon EBS (Elastic Block Store)

**EBS** คือ persistent block storage ที่ใช้กับ EC2 instances

**Volume Types:**

| Type | Use Case | Max IOPS | Max Throughput |
|------|----------|----------|---------------|
| **gp3** | General purpose SSD (default) | 16,000 | 1,000 MB/s |
| **gp2** | General purpose (legacy) | 10,000 | 250 MB/s |
| **io1** | High performance ( provisioned IOPS) | 64,000 | 1,000 MB/s |
| **io2** | Highest performance | 256,000 | 4,000 MB/s |
| **io2 Block Express** | Ultra-high performance | 1,000,000 | 4,000 MB/s |
| **st1** | Throughput optimized HDD | 500 | 500 MB/s |
| **sc1** | Cold storage HDD | 250 | 250 MB/s |

**EBS Multi-Attach:** io1/io2 สามารถ attach ไปยังหลาย instancesใน AZ เดียวกันได้ (clustered databases)

**EBS Snapshots:**
- Incremental backups ไปยัง S3
- สามารถ copy ข้าม Regions
- สามารถสร้าง AMI จาก snapshot

### 5.2 Instance Store

- **Temporary block storage** อยู่บน disk ที่ attach กับ host computer
- **ไม่ persistent** — ข้อมูลหายเมื่อ instance ถูก stop/terminate
- **มี IOPS สูงมาก** เหมาะกับ cache, scratch data, temporary workloads
- บาง instance types มี Instance Store รวมอยู่แล้ว (เช่น I3, D2)

### 5.3 EFSS (Elastic File System) และ FSx

| Service | คำอธิบาย |
|---------|---------|
| **EFS** | Managed NFS (Network File System) สำหรับ Linux, multi-AZ, pay per use |
| **FSx for Windows File Server** | Managed Windows file share (SMB), AD integration |
| **FSx for Lustre** | Managed Lustre (parallel file system), HPC/ML workloads |
| **FSx for NetApp ONTAP** | Managed ONTAP, data efficiency, cross-region replication |
| **FSx for OpenZFS** | Managed OpenZFS file system |

---

## 6. Networking และ Security

### 6.1 Virtual Private Cloud (VPC)

EC2 instances launch เข้า VPC ซึ่งมี:

- **Subnets** — public (มี internet gateway) หรือ private (ไม่มี IGW)
- **Route Tables** — กำหนด routing
- **Internet Gateway (IGW)** — เชื่อมต่อ internet
- **NAT Gateway / NAT Instance** — ให้ private instances เข้า internet ได้ outbound
- **Virtual Private Gateway** — เชื่อมต่อ VPN หรือ Direct Connect
- **VPC Endpoints** — เชื่อมต่อ AWS services โดยไม่ต้องผ่าน internet

### 6.2 Security Groups

- **Stateful firewall** — inbound/outbound rules
- **ทำงานที่ instance level** ไม่ใช่ subnet level
- **Allow rules only** — ไม่มี deny explicit
- **Default: deny all inbound, allow all outbound**
- สามารถ reference security groups อื่นหรือ CIDR blocks

### 6.3 Network Access Control Lists (NACLs)

- **Stateless firewall** ทำงานที่ subnet level
- **Allow และ Deny rules** ทั้งคู่
- **evaluated in order** จากตัวเลข thấpไปสูง

### 6.4 Elastic Network Interfaces (ENI)

- Virtual network card ใน VPC
- มี: private IP, public IP (หรือ EIP), MAC address, security groups
- สามารถ attach/detach ขณะ instance running (某些 instance types)
- Primary ENI มาพร้อมกับ instance, secondary ENI สร้างเพิ่มได้

### 6.5 Enhanced Networking

| Technology | Speed | Notes |
|-----------|-------|-------|
| **ENA (Elastic Network Adapter)** | 100 Gbps | ใช้กับ most instance types |
| **EFA (Elastic Fabric Adapter)** | 400 Gbps | HPC/ML, OS-bypass networking |
| **Intel 82599 VF** | 10 Gbps | Legacy, ใช้กับ older instances |

### 6.6 Elastic IP Addresses (EIP)

- Static public IPv4 address ที่ associate กับ account
- สามารถ remap ไปยัง instance ใหม่ได้
- AWS ไม่คิดค่าบริการถ้า EIP ถูก associate กับ running instance
- ถ้า EIP ไม่ได้ใช้ จะมี charge

### 6.7 Public IP vs Private IP

| Type | คำอธิบาย |
|------|---------|
| **Private IP** | ภายใน VPC, ใช้สำหรับ internal communication |
| **Public IP** | กำหนดโดย AWS อัตโนมัติ, ไม่ fixed |
| **Elastic IP (EIP)** | Static public IP ที่ owned โดย account |

---

## 7. Instance Lifecycle

```
Pending → Running → Shutting-down → Terminated
              ↓
           Stopping → Stopped
              ↓
           Starting → Running
```

| State | คำอธิบาย |
|-------|---------|
| **Pending** | Instance กำลัง boot |
| **Running** | Instance ทำงานปกติ (billing active) |
| **Stopping** | Instance กำลัง shutdown (ข้อมูลบน instance store หาย) |
| **Stopped** | Instance หยุด (EBS data ยังอยู่, billing paused) |
| **Shutting-down** | กำลัง terminate |
| **Terminated** | Instance ถูกลบแล้ว (ไม่สามารถ recovery ได้) |

**ระหว่าง Stop/Start vs Reboot:**

| Action | Data on root volume | Data on instance store | Public/Private IP |
|--------|--------------------|-----------------------|-------------------|
| **Reboot** | เก็บไว้ | เก็บไว้ | เหมือนเดิม |
| **Stop/Start** | เก็บไว้ (EBS) | **หาย** | เปลี่ยน (ได้ EIP คงที่) |
| **Terminate** | ถูกลบ (default) | หาย | ถูกปล่อย |

---

## 8. Auto Scaling

### 8.1 EC2 Auto Scaling Groups (ASG)

- **Maintain desired capacity** — รักษาจำนวน instances ตามที่กำหนด
- **Scale out** — เพิ่ม instances เมื่อ workload สูงขึ้น
- **Scale in** — ลด instances เมื่อ workload ลดลง
- **AZ rebalancing** — distribute instances ข้าม AZs

### 8.2 Scaling Policies

| Policy | คำอธิบาย |
|--------|---------|
| **Target Tracking** | กำหนด target metric (เช่น CPU 60%) แล้ว ASG ปรับเอง |
| **Step Scaling** | ปรับตามขั้นที่กำหนด |
| **Simple Scaling** | ปรับเมื่อ metric สูง/ต่ำกว่าค่าที่กำหนด |
| **Scheduled Scaling** | ปรับตาม schedule (เช่น ทุกวันศุกร์ 18:00) |

### 8.3 Health Checks

- **EC2** — checks instance status
- **ELB** — checks via load balancer health checks
- Unhealthy instances จะถูก terminate และ replace

---

## 9. AWS Nitro System

Nitro System คือ underlying platform ที่ power EC2 instances รุ่นใหม่:

### 9.1 Components

| Component | หน้าที่ |
|-----------|--------|
| **Nitro Card** | I/O แยกออกจาก CPU, offloads network/storage virtualization |
| **Nitro Hypervisor** | Lightweight hypervisor, near bare-metal performance |
| **Nitro Security Chip** | Hardware-based security, protection against firmware attacks |
| **Nitro Enclaves** | Isolated execution environments for processing sensitive data |

### 9.2 Benefits

- **Near bare-metal performance** — ไม่มี hypervisor overhead
- **Better security** — hardware-level isolation
- **Higher network throughput** — ไม่ใช้ CPU resources สำหรับ networking
- **Higher IOPS** — dedicated NVMe controllers

---

## 10. การเชื่อมต่อ Instance

### 10.1 SSH (Linux)

```bash
# ใช้ key pair
ssh -i "my-key-pair.pem" ec2-user@<public-ip>

# ใช้ EC2 Instance Connect
aws ec2 instance-connect ssh --instance-id <instance-id>
```

### 10.2 RDP (Windows)

- ใช้ Remote Desktop Connection
- Password ถอดรหัสจาก key pair ผ่าน console หรือ CLI

### 10.3 EC2 Instance Connect

- เชื่อมต่อผ่าน browser-based SSH ไม่ต้อง open inbound SSH port
- ใช้ IAM policies เพื่อ authorize access
- ใช้ SSO/STS temporary credentials

### 10.4 Systems Manager Session Manager

- เชื่อมต่อ terminal ผ่าน SSM agent ไม่ต้องมี SSH port open
- Support Linux และ Windows
- บันทึก session logs ไป S3/CloudWatch
- ใช้ IAM เพื่อ control access

### 10.5 EC2 Serial Console

- เชื่อมต่อไปยัง serial port ของ instance
- เหมาะสำหรับ troubleshoot boot issues

---

## 11. ความปลอดภัย (Security)

### 11.1 IAM Roles for EC2

- EC2 instances สามารถ assume IAM role เพื่อ access AWS services
- ข้อมูลประจำตัว (access key/secret) ถูก inject อัตโนมัติผ่าน **instance metadata**
- ไม่ควร hardcode credentials ใน instance

### 11.2 Key Pairs

- ใช้ RSA หรือ ED25519 algorithms
- Private key อยู่ที่ user (ไม่เก็บใน AWS)
- ใช้สำหรับ SSH (Linux) หรือ decrypt password (Windows)

### 11.3 Instance Metadata Service (IMDS)

```
# IMDSv2 (recommended)
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/

# IMDSv1 (legacy)
curl http://169.254.169.254/latest/meta-data/
```

Metadata ประกอบด้วย: instance ID, instance type, security groups, IAM role, MAC address, local IP, public IP (ถ้ามี)

### 11.4 Placement Groups

| Strategy | คำอธิบาย | Use Case |
|----------|---------|---------|
| **Cluster** | Instances ใน same AZ, same hardware | HPC, ML training ที่ต้องการ low latency |
| **Partition** | แบ่งเป็น partitions ข้าม racks | Hadoop, Kafka, HBase |
| **Spread** | แต่ละ instance แยก rack | Mission-critical, high availability |

---

## 12. Monitoring และ Logging

### 12.1 Amazon CloudWatch

| Feature | คำอธิบาย |
|---------|---------|
| **CloudWatch Metrics** | CPU, network, disk I/O — 1-minute granularity (free tier: 5-min) |
| **CloudWatch Logs** | System logs, application logs, agent-based |
| **CloudWatch Alarms** | Alert เมื่อ metric เกิน threshold |
| **CloudWatch Dashboards** | Custom dashboards |

### 12.2 AWS CloudTrail

- **Log API calls** ที่เกิดขึ้นใน account
- เก็บไว้ 90 วัน default
- ส่งไป S3, CloudWatch Logs

---

## 13. การ Pricing และค่าใช้จ่าย

### 13.1 On-Demand Pricing Factors

| Factor | รายละเอียด |
|--------|-----------|
| **Instance type** | แต่ละ type มีราคาต่อชั่วโมงต่างกัน |
| **Region** | แต่ละ region มีราคาต่างกัน |
| **OS** | Linux ถูกที่สุด, Windows และ RHEL ราคาสูงกว่า |
| **Billing granularity** | Linux คิดเป็น second (minimum 60 seconds) |

### 13.2 Data Transfer Costs

| Transfer | ค่าบริการ |
|---------|----------|
| **Data IN** | ฟรี |
| **Data OUT** | $0.09/GB (first 10 TB/month, region dependent) |
| **Inter-region transfer** | $0.02-$0.09/GB (depends on source/destination) |
| **Same-AZ transfer** | ฟรี (ถ้าใช้ private IP) |

### 13.3 Storage Costs

- **EBS volumes** — คิดตาม GB-month provisioned
- **EBS snapshots** — คิดตาม GB-month stored
- **EFS** — คิดตาม GB used
- **Instance Store** — รวมใน instance price

---

## 14. Use Cases หลัก

| Use Case | Instance Type | Storage | Notes |
|----------|--------------|---------|-------|
| **Web Application** | T3, M5 | EBS gp3 | Auto Scaling, Load Balancer |
| **Database** | R5, R6 | EBS io2 + Multi-AZ | RDS หรือ EC2-based |
| **Big Data / Analytics** | D2, I3, C5 | Instance Store + S3 | EMR cluster |
| **ML Training** | P4, P5, Trn1 | S3 (data) | SageMaker หรือ EC2 |
| **ML Inference** | Inf2, G4, M6 | S3 | Endpoints |
| **HPC** | Hpc6a, Hpc7g | FSx Lustre | EFA networking |
| **CI/CD** | C5, M5 | EBS | CodeBuild หรือ self-hosted |
| **Gaming Server** | C5, M5 | EBS | Real-time multiplayer |
| **macOS Development** | Mac1, Mac2 | EBS | Xcode, iOS builds |
| **SAP on AWS** | X1, X2, z1d | EBS | SAP certified instances |

---

## 15. �คำศัพท์และความหมาย (Glossary)

| คำศัพท์ | ความหมาย |
|---------|---------|
| **vCPU** | Virtual CPU — แต่ละ vCPU เป็น hardware thread ของ physical CPU |
| **EBS** | Elastic Block Store — persistent block storage |
| **ENA** | Elastic Network Adapter — high-speed network driver |
| **EFA** | Elastic Fabric Adapter — HPC networking |
| **IMDS** | Instance Metadata Service — ข้อมูล instance ผ่าน 169.254.169.254 |
| **ASG** | Auto Scaling Group — กลุ่ม instances ที่ scale อัตโนมัติ |
| **AMI** | Amazon Machine Image — template สำหรับ launch instance |
| **EIP** | Elastic IP Address — static public IP |
| **VPC** | Virtual Private Cloud — isolated virtual network |
| **Nitro** | AWS proprietary hardware platform ที่ power EC2 |

---

## 16. ลิงค์อ้างอิง

| เนื้อหา | ลิงค์ |
|---------|------|
| **Amazon EC2 User Guide** | https://docs.aws.amazon.com/ec2/ |
| **EC2 Instance Types** | https://docs.aws.amazon.com/ec2/latest/instancetypes/ |
| **EC2 Developer Guide** | https://docs.aws.amazon.com/ec2/latest/devguide/ |
| **EC2 API Reference** | https://docs.aws.amazon.com/AWSEC2/latest/APIReference/ |
| **EC2 Pricing** | https://aws.amazon.com/ec2/pricing/ |
| **EC2 On-Demand** | https://aws.amazon.com/ec2/pricing/on-demand/ |
| **EC2 Spot Instances** | https://aws.amazon.com/ec2/spot/ |
| **EC2 Reserved Instances** | https://aws.amazon.com/ec2/reserved-instances/ |
| **EBS Product Page** | https://aws.amazon.com/ebs/ |
| **VPC Documentation** | https://docs.aws.amazon.com/vpc/ |
| **Auto Scaling Documentation** | https://docs.aws.amazon.com/autoscaling/ |
| **AWS Nitro System** | https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html |
| **EC2 Instance Connect** | https://docs.aws.amazon.com/ec2-instance-connect/ |
| **AWS Systems Manager** | https://docs.aws.amazon.com/systems-manager/ |
| **CloudWatch Monitoring** | https://docs.aws.amazon.com/cloudwatch/ |
| **AWS CLI for EC2** | https://docs.aws.amazon.com/cli/latest/reference/ec2/ |
| **VM Import/Export** | https://docs.aws.amazon.com/vm-import/latest/ |

---

*ไฟล์นี้สร้างโดย Hermes Agent — แหล่งอ้างอิงจาก AWS Official Documentation ณ วันที่ July 2026*

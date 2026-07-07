# Amazon ECS (Elastic Container Service) — คู่มือฉบับสมบูรณ์

> เอกสารสรุปข้อมูลครบทุกด้านของบริการ AWS ECS — ความหมาย การใช้งาน ข้อจำกัด การทำงานร่วมกัน และการตั้งค่า
> อ้างอิง: [User Guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/) · [Product Page](https://aws.amazon.com/ecs/)

---

## สารบัญ

1. [ความหมาย (What is ECS)](#1-ความหมาย-what-is-ecs)
2. [การใช้งาน (Use Cases)](#2-การใช้งาน-use-cases)
3. [ข้อจำกัด (Limits & Constraints)](#3-ข้อจำกัด-limits--constraints)
4. [การทำงานร่วมกัน (Integrations)](#4-การทำงานร่วมกัน-integrations)
5. [การตั้งค่า (Configuration)](#5-การตั้งค่า-configuration)
6. [Launch Types เปรียบเทียบ](#6-launch-types-เปรียบเทียบ)
7. [Pricing สรุป](#7-pricing-สรุป)
8. [ข้อแนะนำ / Best Practices](#8-ข้อแนะนำ--best-practices)

---

## 1. ความหมาย (What is ECS)

**Amazon ECS (Elastic Container Service)** คือ **fully managed container orchestration service** ที่ช่วยให้คุณรัน หยุด และจัดการ **Docker containers** บนคลัสเตอร์ได้อย่างง่ายดาย โดยไม่ต้องติดตั้งหรือดูแล Kubernetes control plane เอง

### แนวคิดหลัก (Core Concepts)

| คำศัพท์ | ความหมาย |
| --- | --- |
| **Cluster** | กลุ่มของ compute resources (EC2 instances หรือ Fargate) ที่ containers จะรันอยู่ |
| **Task Definition** | ไฟล์ JSON ที่ระบุว่า container ใดรันอะไรบ้าง (image, port, env, CPU/RAM) — เปรียบเหมือน "blueprint" |
| **Task** | instance ของ task definition ที่กำลังรันอยู่ (1 task = 1+ containers) |
| **Service** | ตัวจัดการ tasks จำนวนหนึ่ง ให้รันตามจำนวนที่ต้องการ (desired count) + auto-recovery |
| **Container Agent** | โปรแกรมที่รันในแต่ละ EC2 instance เพื่อเชื่อมต่อกับ ECS control plane |
| **Capacity Provider** | กลไกจัดการ scaling infrastructure (Fargate Spot, EC2 Auto Scaling Group) |

### ความแตกต่างจาก Kubernetes

- **ECS**: AWS-managed, เรียนรู้ง่าย, integrate กับ AWS services ได้แน่น, ไม่ต้องจัดการ control plane
- **EKS (Kubernetes)**: ใช้ standard Kubernetes API, portable ไป cloud อื่น, learning curve สูงกว่า
- **ECS Anywhere**: รัน ECS task บน on-premises server ได้

---

## 2. การใช้งาน (Use Cases)

### เหมาะกับ

1. **Microservices deployment** — แยก services เป็น containers แต่ละตัว scale อิสระ
2. **Web applications & APIs** — containerized Node.js, Python, Java, Go apps
3. **Batch processing & scheduled jobs** — รัน job ตามเวลา หรือตาม trigger
4. **CI/CD pipelines** — build/test ใน container แบบ isolated
5. **Machine Learning inference** — deploy ML models ใน container
6. **Migration จาก on-premises** — ย้าย legacy apps มาเป็น container
7. **Hybrid cloud** — ใช้ ECS Anywhere รันบน on-premises

### ตัวอย่าง Architecture

```
Internet → ALB → ECS Service (Fargate)
                  ├── Task 1: API container
                  ├── Task 2: API container
                  └── Task 3: API container
                              ↓
                       RDS / DynamoDB / S3
```

### ไม่เหมาะกับ

- ใช้ standard Kubernetes tooling ทั้งหมด → ใช้ EKS ดีกว่า
- ต้องการ multi-cloud portability → EKS หรือ self-managed K8s
- ต้องการ orchestrator อื่นที่ไม่ใช่ Docker (เช่น containerd-only) → EKS

---

## 3. ข้อจำกัด (Limits & Constraints)

### Soft Limits (ปรับได้ผ่าน AWS Support)

| Resource | Default Limit |
| --- | --- |
| Clusters per region | 10,000 |
| Services per cluster | 5,000 |
| Tasks per service | 5,000 |
| Task Definitions per region | 100,000 |
| Containers per task definition | 10 |
| Tasks launched per service (steady state) | 1,000 |
| Load balancers per service | 5 |
| Target groups per service | 5 |
| Capacity providers per cluster | 6 |

### Fargate-specific Limits

| Resource | Limit |
| --- | --- |
| vCPU per task | 0.25 – 16 vCPU |
| Memory per task | 0.5 – 120 GB |
| Ephemeral storage per task | 21 – 200 GB |
| Task startup time | ปกติ 30-60 วินาที |
| ENIs per task | 1 |
| Public IP per task | 1 |

### EC2 Launch Type Limits

- ขึ้นกับ EC2 instance type (vCPU, RAM, ENI, EBS)
- Container instance ต้องมี ECS agent ติดตั้ง (AMI มาตรฐานมีให้แล้ว)
- Disk space สำหรับ images ต้องเพียงพอ (แนะนำ ≥ 30 GB)

### ข้อจำกัดทั่วไป

- **Region availability**: บาง regions อาจมี Fargate แต่ไม่มี Fargate Spot
- **Container size**: image ต้อง ≤ 10 GB (Fargate) / ขึ้นกับ disk ของ EC2
- **Network mode**: `awsvpc` เป็นโหมดเดียวที่รองรับใน Fargate
- **Logs**: ใช้ CloudWatch Logs, FireLens (Fluent Bit/Fluentd) หรือ custom destinations
- **Secrets**: inject ผ่าน AWS Secrets Manager หรือ SSM Parameter Store
- **GPU**: รองรับเฉพาะ EC2 launch type (ไม่รองรับใน Fargate ณ ปัจจุบัน)

### Quotas ที่ต้องระวัง

- **EC2 instance ENI quota** — Fargate แต่ละ task ใช้ 1 ENI
- **CloudWatch Logs ingestion rate**
- **Secrets Manager / SSM API rate limits**
- **ALB target group** — มี connection timeout

---

## 4. การทำงานร่วมกัน (Integrations)

### Compute & Storage

- **EC2** — launch type สำหรับรัน containers บน EC2 instances
- **Fargate** — serverless launch type (ไม่ต้องจัดการ EC2)
- **ECR (Elastic Container Registry)** — private Docker registry เก็บ images
- **S3** — mount เป็น volume ผ่าน S3 CSI driver (EFS ดีกว่าสำหรับ shared filesystem)
- **EFS** — shared filesystem ระหว่าง tasks (เหมาะกับ multi-container)
- **FSx** — high-performance file system (Lustre สำหรับ ML, Windows สำหรับ Windows containers)

### Networking

- **VPC** — tasks รันใน VPC พร้อม ENI ของตัวเอง
- **Application Load Balancer (ALB)** — distribute traffic ตาม path/host
- **Network Load Balancer (NLB)** — TCP/UDP load balancing, static IP
- **Cloud Map** — service discovery (DNS-based)
- **API Gateway** — front door สำหรับ ECS APIs
- **Route 53** — DNS routing
- **Global Accelerator** — multi-region traffic management

### Security & Identity

- **IAM Roles for Tasks** — แต่ละ task มี IAM role ของตัวเอง
- **AWS Secrets Manager** — inject secrets (DB password, API key)
- **AWS Systems Manager Parameter Store** — config values
- **AWS KMS** — encryption at rest
- **ACM** — SSL/TLS certificates สำหรับ ALB
- **AWS WAF** — web application firewall หน้า ALB
- **AWS PrivateLink** — private connectivity ไป services อื่น

### Observability

- **CloudWatch Logs** — central logging
- **CloudWatch Metrics** — CPU, memory, task count
- **CloudWatch Container Insights** — detailed metrics สำหรับ containers
- **AWS X-Ray** — distributed tracing
- **CloudTrail** — audit logs สำหรับ ECS API calls

### CI/CD & DevOps

- **CodePipeline + CodeBuild + CodeDeploy** — end-to-end CI/CD (CodeDeploy supports blue/green deployment สำหรับ ECS)
- **GitHub Actions / GitLab CI** — third-party CI/CD
- **ECR** — image registry เชื่อมกับ CI/CD ได้โดยตรง

### Messaging & Events

- **EventBridge** — trigger ECS tasks ตาม events
- **SQS** — async task queue
- **SNS** — pub/sub fanout
- **Step Functions** — orchestrate ECS tasks ใน workflow

### Data & Database

- **RDS / Aurora** — relational database
- **DynamoDB** — NoSQL database
- **ElastiCache** — Redis/Memcached

---

## 5. การตั้งค่า (Configuration)

### 5.1 สร้าง Cluster

**ผ่าน Console:**
1. เปิด ECS Console → Clusters → Create Cluster
2. เลือก template:
   - **Networking only (Fargate)** — ใช้ Fargate launch type
   - **EC2 Linux + Networking** — ใช้ EC2 launch type + Linux
   - **EC2 Windows + Networking** — Windows containers
3. ตั้งชื่อ cluster → Create

**ผ่าน AWS CLI:**
```bash
aws ecs create-cluster --cluster-name my-cluster
```

### 5.2 สร้าง Task Definition

ตัวอย่าง `task-def.json`:

```json
{
  "family": "my-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::123456789012:role/myAppTaskRole",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/my-app:latest",
      "portMappings": [
        { "containerPort": 3000, "protocol": "tcp" }
      ],
      "environment": [
        { "name": "NODE_ENV", "value": "production" }
      ],
      "secrets": [
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:db-password-AbCdEf"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/my-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

**Register task definition:**
```bash
aws ecs register-task-definition --cli-input-json file://task-def.json
```

### 5.3 สร้าง Service

```bash
aws ecs create-service \
  --cluster my-cluster \
  --service-name my-app-service \
  --task-definition my-app:1 \
  --desired-count 3 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=app,containerPort=3000"
```

### 5.4 ตั้งค่า Auto Scaling

**Application Auto Scaling (target tracking):**
```bash
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/my-cluster/my-app-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 2 \
  --max-capacity 10

aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --resource-id service/my-cluster/my-app-service \
  --scalable-dimension ecs:service:DesiredCount \
  --policy-name cpu-scaling \
  --policy-type TargetTrackingScaling \
  --target-tracking-scaling-policy-configuration file://scaling-policy.json
```

`scaling-policy.json`:
```json
{
  "TargetValue": 70.0,
  "PredefinedMetricSpecification": {
    "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
  }
}
```

### 5.5 ตั้งค่า Load Balancer

1. สร้าง ALB:
   - **Internet-facing** หรือ **Internal**
   - ตั้งค่า listener (HTTP:80 → redirect HTTPS, HTTPS:443)
   - เลือก certificate จาก ACM
2. สร้าง Target Group:
   - **Target type**: `ip` (Fargate) หรือ `instance` (EC2)
   - **Port**: ตรงกับ containerPort
   - **Health check path**: `/health`
3. ผูก ALB กับ ECS Service ในขั้นตอน create service

### 5.6 IAM Roles ที่ต้องมี

**ecsTaskExecutionRole** (สำหรับ pull image, write logs):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

**Task Role** (สำหรับ app เรียก AWS APIs):
- ตั้งสิทธิ์ตามที่ app ต้องการ (เช่น S3:GetObject, DynamoDB:Query)
- **แนะนำ**: ใช้ least privilege

### 5.7 ตั้งค่า Networking

**Security Group rules (ตัวอย่าง):**
- **ALB SG**: allow 80, 443 from 0.0.0.0/0
- **ECS Tasks SG**: allow port 3000 from ALB SG
- **DB SG**: allow 3306 from ECS Tasks SG

**Subnets:**
- แนะนำ **private subnets** สำหรับ tasks
- NAT Gateway สำหรับ outbound internet (เช่น pull packages)
- ALB อยู่ใน **public subnets**

### 5.8 การตั้งค่า Logging

**awslogs driver (default):**
```json
"logConfiguration": {
  "logDriver": "awslogs",
  "options": {
    "awslogs-group": "/ecs/my-app",
    "awslogs-region": "us-east-1",
    "awslogs-stream-prefix": "ecs"
  }
}
```

**สร้าง log group:**
```bash
aws logs create-log-group --log-group-name /ecs/my-app
```

---

## 6. Launch Types เปรียบเทียบ

| Feature | EC2 Launch Type | Fargate Launch Type |
| --- | --- | --- |
| จัดการ EC2 instances | คุณจัดการเอง | AWS จัดการให้ |
| ควบคุม instance type | ได้เต็มที่ | ไม่ได้ (ระบุ vCPU/RAM แทน) |
| Pricing | จ่ายตาม EC2 instance | จ่ายตาม vCPU + RAM ต่อวินาที |
| Auto Scaling | ต้องตั้ง ASG เอง | built-in |
| Patch & update OS | คุณทำเอง | AWS ทำให้ |
| GPU support | รองรับ | ไม่รองรับ |
| Spot pricing | รองรับ (EC2 Spot) | รองรับ (Fargate Spot) |
| Windows containers | รองรับ | รองรับ |
| Startup time | เร็วมาก (instance พร้อม) | 30-60 วินาที |
| Use case | apps ต้องการ GPU, custom AMI, ประหยัดค่าใช้จ่าย | apps ทั่วไป, serverless mindset |

**Fargate Spot** — ราคาถูกกว่า Fargate ปกติ 70% แต่อาจถูก interrupt ได้ (เหมาะกับ fault-tolerant workloads)

---

## 7. Pricing สรุป

### Fargate Pricing (per vCPU/GB-hour)

| Region | vCPU per hour | GB per hour |
| --- | --- | --- |
| US East (N. Virginia) | $0.04048 | $0.004445 |
| Asia Pacific (Singapore) | $0.05656 | $0.006161 |
| Asia Pacific (Bangkok) | $0.05656 | $0.006161 |

*ราคาเป็น On-Demand ไม่รวม Savings Plans / Spot*

**ตัวอย่าง**: Task 0.5 vCPU + 1 GB รัน 24 ชม.
- vCPU: 0.5 × $0.04048 × 24 = **$0.486**
- Memory: 1 × $0.004445 × 24 = **$0.107**
- **Total: ~$0.59 ต่อวัน** (~$18 ต่อเดือน)

### EC2 Launch Type
- จ่ายตาม EC2 instance pricing (On-Demand, Reserved, Spot)
- ไม่มีค่า ECS control plane เพิ่ม (ECS ฟรี)
- ECR storage: $0.10/GB-month

### ไม่มีค่าใช้จ่ายสำหรับ
- ECS control plane
- Task definitions
- Services (จ่ายเฉพาะ underlying compute)
- API calls (ส่วนใหญ่)

### ใช้ AWS Pricing Calculator
https://calculator.aws/#/createCalculator/ECS

---

## 8. ข้อแนะนำ / Best Practices

### Security
1. **ใช้ IAM Task Role** แทนการใส่ credentials ใน environment variables
2. **เก็บ secrets ใน Secrets Manager / SSM Parameter Store** ไม่ใช่ใน env vars
3. **ใช้ private subnets** สำหรับ tasks (NAT Gateway สำหรับ egress)
4. **Scan images** ด้วย Amazon Inspector หรือ ECR scanning ก่อน deploy
5. **เปิด Container Insights** เพื่อ monitor security
6. **ใช้ least privilege IAM** — task role มีสิทธิ์เท่าที่จำเป็น

### Cost Optimization
1. **ใช้ Fargate Spot** สำหรับ fault-tolerant workloads (ลด 70%)
2. **ใช้ Savings Plans** ถ้าใช้ Fargate แบบ steady state
3. **ตั้ง Auto Scaling** ให้ scale down ตอน traffic น้อย
4. **right-size tasks** — อย่าใช้ 4 vCPU ถ้าแค่ 0.5 ก็พอ
5. **ใช้ ARM/Graviton** (Fargate รองรับ arm64) — ประหยัด 20%

### Reliability
1. **Deploy ข้าม ≥ 2 AZs** (multi-AZ)
2. **ตั้ง desired count ≥ 2** เพื่อ high availability
3. **ใช้ ALB health checks** ที่เชื่อถือได้
4. **เปิด Container Insights + CloudWatch Alarms**
5. **ใชะ CodeDeploy blue/green deployment** สำหรับ zero-downtime
6. **Circuit breaker** (built-in ใน ECS) — rollback อัตโนมัติเมื่อ deploy ล้มเหลว

### Operations
1. **ใช้ ECS Service Connect** (v2) — service-to-service communication ในตัว
2. **External Deployment Controller** (ECS feature) — integrate กับ ArgoCD, Flagger
3. **ใช้ Capacity Providers** แทน static ASG
4. **Tag resources** ทุกตัว (cost allocation)
5. **ใช้ AWS Copilot** — CLI สำหรับจัดการ ECS apps แบบ opinionated

### Development
1. **ทดสอบ locally ด้วย Docker** ก่อน push image
2. **ใช้ multi-stage Dockerfile** — image เล็ก ปลอดภัยกว่า
3. **Tag images แบบ immutable** (`:v1.0.0` ไม่ใช่ `:latest`)
4. **ใชะ .dockerignore** — ไม่ให้ copy node_modules, .git
5. **ทำ health check endpoint** — `/health` ที่ตอบ 200 OK เมื่อพร้อม

---

## เอกสารอ้างอิง (References)

- [User Guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/)
- [Product Page](https://aws.amazon.com/ecs/)
- [Pricing](https://aws.amazon.com/ecs/pricing/)
- [FAQs](https://aws.amazon.com/ecs/faqs/)
- [AWS Copilot](https://aws.github.io/copilot-cli/)
- [Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Container-Insights.html)
- [Service Connect](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-connect.html)
- [ECS Anywhere](https://aws.amazon.com/ecs/anywhere/)

---

*จัดทำเมื่อ: 6 กรกฎาคม 2569 · อ้างอิงเอกสาร AWS ฉบับล่าสุด*

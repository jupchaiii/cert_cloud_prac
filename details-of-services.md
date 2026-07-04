# ความสามารถ ขอบเขต และการนำไปใช้งานของบริการ AWS ที่อยู่ในขอบเขต Cloud Practitioner

> เอกสารนี้อ้างอิงตาม Exam Guide CLF-C02 จัดทำเพื่อเสริมความเข้าใจรายละเอียดของ AWS Services แต่ละรายการ ครอบคลุมความสามารถหลัก (Capabilities) ขอบเขตการใช้งาน (Scope) และตัวอย่างการนำไปใช้ (Use Cases) พร้อมลิงค์อ้างอิงไปยัง AWS Pricing Calculator และ Product Page

---

## สารบัญ

1. [Analytics](#1-analytics)
2. [Application Integration](#2-application-integration)
3. [Business Applications](#3-business-applications)
4. [Cloud Financial Management](#4-cloud-financial-management)
5. [Compute](#5-compute)
6. [Containers](#6-containers)
7. [Customer Enablement](#7-customer-enablement)
8. [Database](#8-database)
9. [Developer Tools](#9-developer-tools)
10. [End User Computing](#10-end-user-computing)
11. [Frontend Web and Mobile](#11-frontend-web-and-mobile)
12. [Internet of Things (IoT)](#12-internet-of-things-iot)
13. [Machine Learning](#13-machine-learning)
14. [Management and Governance](#14-management-and-governance)
15. [Migration and Transfer](#15-migration-and-transfer)
16. [Networking and Content Delivery](#16-networking-and-content-delivery)
17. [Security, Identity, and Compliance](#17-security-identity-and-compliance)
18. [Serverless](#18-serverless)
19. [Storage](#19-storage)
20. [Quick Reference Links](#20-quick-reference-links)

---

## 1. Analytics

### Amazon Athena
**ความสามารถ:** บริการ query แบบ serverless ที่ใช้ SQL วิเคราะห์ข้อมูลที่เก็บใน Amazon S3 โดยไม่ต้องตั้ง infrastructure ลูกค้าจ่ายตามการ query ที่ทำจริง

**ขอบเขต:** รองรับการ query ไฟล์ในรูปแบบ CSV, JSON, ORC, Parquet, Avro ทำงานร่วมกับ AWS Glue Data Catalog

**Use Cases:** วิเคราะห์ log จาก S3, BI reports, ad-hoc queries บน data lake

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/athena) | [Product Page](https://aws.amazon.com/athena/)

---

### Amazon EMR (Elastic MapReduce)
**ความสามารถ:** จัดการ Big Data framework (Apache Spark, Hadoop, HBase, Presto) บนคลัสเตอร์ของ EC2 instances ที่สามารถ scale ได้ตาม workload

**ขอบเขต:** รองรับหลาย framework, สามารถใช้ spot instances เพื่อลดต้นทุน, ทำงานร่วมกับ S3 เป็น data layer

**Use Cases:** Data processing ขนาดใหญ่, machine learning, log analysis, real-time streaming

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/elastic-map-reduce) | [Product Page](https://aws.amazon.com/emr/)

---

### AWS Glue
**ความสามารถ:** ETL (Extract, Transform, Load) service แบบ serverless สำหรับเตรียมและ transform ข้อมูล มี Glue Data Catalog เป็น central metadata repository

**ขอบเขต:** Serverless, ไม่ต้องจัดการ servers, รองรับ Python และ Scala, มี built-in transforms

**Use Cases:** Data lake building, data migration, data preparation ก่อน analytics

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/glue) | [Product Page](https://aws.amazon.com/glue/)

---

### Amazon Kinesis
**ความสามารถ:** รวบรวม ประมวลผล และวิเคราะห์ streaming data แบบ real-time มี 4 ผลิตภัณฑ์: Kinesis Data Streams, Data Firehose, Data Analytics, Video Streams

**ขอบเขต:** Kinesis Data Firehose ส่งข้อมูลไป S3/Redshift/ES โดยอัตโนมัติ, Kinesis Data Analytics สำหรับ SQL queries บน streaming data

**Use Cases:** IoT telemetry, log ingestion, real-time dashboards, fraud detection, live leaderboards

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/kinesis-data-streams) | [Product Page](https://aws.amazon.com/kinesis/)

---

### Amazon OpenSearch Service
**ความสามารถ:** Search engine แบบ open-source สำหรับ full-text search และ analytics รองรับ visualization ผ่าน OpenSearch Dashboards

**ขอบเขต:** รองรับการ scale แนวนอน, ทำงานแบบ cluster, สามารถทำ near real-time search

**Use Cases:** Application search, log analytics, security analytics, monitoring

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-opensearch-service) | [Product Page](https://aws.amazon.com/opensearch-service/)

---

### Amazon QuickSight
**ความสามารถ:** Business Intelligence (BI) service แบบ cloud-native สร้าง visualizations และ dashboards สำหรับ business insights

**ขอบเขต:** Serverless, ใช้ SPICE (in-memory engine) สำหรับ fast queries, รองรับ many data sources, mobile BI

**Use Cases:** Executive dashboards, sales analytics, operational reporting, self-service BI

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/quicksight) | [Product Page](https://aws.amazon.com/quicksight/)

---

### Amazon Redshift
**ความสามารถ:** Data warehouse enterprise-grade ที่ใช้ SQL วิเคราะห์ข้อมูลขนาดใหญ่ รองรับ petabyte-scale ใช้ columnar storage และ massively parallel processing (MPP)

**ขอบเขต:** รองรับ complex queries, federated queries กับ S3 และ operational DBs, ML-based optimization

**Use Cases:** Enterprise data warehousing, business intelligence, data analytics

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-redshift) | [Product Page](https://aws.amazon.com/redshift/)

---

## 2. Application Integration

### Amazon EventBridge
**ความสามารถ:** Serverless event bus ที่เชื่อมต่อ applications โดยใช้ events ช่วยให้ส่งข้อมูลระหว่าง SaaS apps, AWS services และ custom applications ได้ง่าย

**ขอบเขต:** รองรับ SaaS integration (Salesforce, Zendesk, etc.), schema registry, event filtering, event replay

**Use Cases:** Microservices communication, SaaS integration, audit logging, real-time notifications

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-eventbridge) | [Product Page](https://aws.amazon.com/eventbridge/)

---

### Amazon SNS (Simple Notification Service)
**ความสามารถ:** Pub/sub messaging และ mobile notifications service ที่ส่ง messages จาก publisher ไปยัง subscribers (SQS, HTTP/S, Lambda, email, SMS, push notifications)

**ขอบเขต:** Topics-based pub/sub, push-based delivery, รองรับ FIFO topics, รองรับ SMS และ email

**Use Cases:** Application alerts, fanout messaging, mobile push notifications, event-driven workflows

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-sns) | [Product Page](https://aws.amazon.com/sns/)

---

### Amazon SQS (Simple Queue Service)
**ความสามารถ:** Message queue service ที่แยก services ออกจากกัน มี Standard Queue (best-effort ordering, at-least-once delivery) และ FIFO Queue (exact ordering, exactly-once processing)

**ขอบเขต:** Serverless, fully managed, ไม่มี limit ของ message throughput, messages ถูกเก็บ 1-14 วัน

**Use Cases:** Decoupling microservices, batch processing, task queues, request buffering

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-sqs) | [Product Page](https://aws.amazon.com/sqs/)

---

### AWS Step Functions
**ความสามารถ:** Orchestration service สำหรับจัดลำดับ AWS Lambda functions และกิจกรรมอื่นๆ เป็น workflow ที่ visualize ได้

**ขอบเขต:** รองรับ 200+ AWS service integrations, error handling, retry logic, branching, parallel execution

**Use Cases:** Workflow automation, order processing, data processing pipelines, ETL orchestration

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/step-functions) | [Product Page](https://aws.amazon.com/step-functions/)

---

## 3. Business Applications

### Amazon Connect
**ความสามารถ:** Cloud contact center service ที่สร้าง customer service center ได้ภายในไม่กี่ชั่วโมง รองรับ omnichannel (voice, chat, tasks)

**ขอบเขต:** CTI integration, IVR builder, real-time and historical analytics, AI-powered agents (Amazon Lex)

**Use Cases:** Customer support centers, sales hotlines, help desks, outbound campaigns

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-connect) | [Product Page](https://aws.amazon.com/connect/)

---

### Amazon SES (Simple Email Service)
**ความสามารถ:** Email service แบบ cloud-native สำหรับส่งและรับ email รองรับ transactional emails, marketing emails, mass emails

**ขอบเขต:** ใช้ SMTP หรือ AWS SDK, DKIM/SPF verification, sandbox mode สำหรับทดสอบ, dedicated IPs สำหรับ reputation

**Use Cases:** Transactional emails, marketing campaigns, system notifications, bounce/complaint handling

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-ses) | [Product Page](https://aws.amazon.com/ses/)

---

## 4. Cloud Financial Management

### AWS Budgets
**ความสามารถ:** ติดตามและจัดการค่าใช้จ่าย AWS สร้าง budget กำหนด threshold และ alert เมื่อใช้เกินที่ตั้งไว้ รองรับ Reserved Instance/Savings Plans coverage และ utilization tracking

**ขอบเขต:** สร้างได้ 2 budgets ฟรี (เพิ่มได้), รองรับ custom filters, ส่ง alert ได้หลายช่องทาง

**Use Cases:** Cost monitoring, spend alerts, RI utilization tracking, anomaly detection

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-budgets) | [Product Page](https://aws.amazon.com/aws-cost-management/aws-budgets/)

---

### AWS Cost Explorer
**ความสามารถ:** วิเคราะห์ค่าใช้จ่าย AWS ด้วย visualize charts และ filters มี RI recommendations สำหรับ cost optimization

**ขอบเขต:** ดู cost ย้อนหลัง 12 เดือน, forecast ค่าใช้จ่าย, รองรับ tag-based filtering, built-in recommendations

**Use Cases:** Cost trend analysis, cost attribution by team/project, cost optimization planning

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-cost-explorer) | [Product Page](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/)

---

### AWS Pricing Calculator
**ความสามารถ:** ประมาณการค่าใช้จ่าย AWS ก่อนสร้าง resources ใช้วางแผน budget สำหรับโปรเจกต์ใหม่

**ขอบเขต:** รองรับ almost all AWS services, ปรับ usage parameters ได้, export เป็น CSV

**Use Cases:** Budget planning, project cost estimation, architecture cost comparison

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws) | [Product Page](https://aws.amazon.com/pricing/calculator/)

---

## 5. Compute

### AWS Auto Scaling
**ความสามารถ:** ปรับ capacity อัตโนมัติสำหรับหลาย AWS resources (EC2, ECS, DynamoDB, Aurora) ตั้งค่า scale-out/in ตาม metrics ที่กำหนด

**ขอบเขต:** รองรับ EC2 Auto Scaling Groups, ECS tasks, DynamoDB tables/indexes, Aurora replicas

**Use Cases:** Variable workloads, batch processing, web applications with traffic spikes

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/auto-scaling) | [Product Page](https://aws.amazon.com/autoscaling/)

---

### Amazon EC2 (Elastic Compute Cloud)
**ความสามารถ:** Virtual servers ใน AWS Cloud มีหลาย instance types สำหรับ workloads ต่างๆ รองรับหลาย purchasing options

**ขอบเขต:**
- **Instance Types:** General Purpose (t3, m5), Compute Optimized (c5, c6i), Memory Optimized (r5, r6i), Storage Optimized (d3, i3)
- **Purchasing:** On-Demand, Reserved, Spot, Savings Plans, Dedicated Hosts, Dedicated Instances, Capacity Reservations
- **Features:** AMI, Key Pairs, Security Groups, Placement Groups

**Use Cases:** Web servers, databases, ML inference, batch processing, enterprise applications

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/ec2-enhancement) | [Product Page](https://aws.amazon.com/ec2/)

---

### Amazon ECS (Elastic Container Service)
**ความสามารถ:** Container orchestration service สำหรับ run Docker containers บน EC2 instances หรือ Fargate

**ขอบเขต:** รองรับ Docker Compose, service discovery, load balancing, auto scaling, IAM roles per task

**Use Cases:** Microservices deployment, batch jobs, long-running applications, containerized web apps

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-ecs) | [Product Page](https://aws.amazon.com/ecs/)

---

### Amazon EKS (Elastic Kubernetes Service)
**ความสามารถ:** Managed Kubernetes service ที่ run Kubernetes บน AWS โดยไม่ต้องจัดการ control plane

**ขอบเขต:** รองรับ standard Kubernetes, AWS Fargate integration, EKS Add-ons (CNI, CoreDNS, kube-proxy), AWS Outposts support

**Use Cases:** Enterprise Kubernetes workloads, hybrid cloud, cloud-native applications requiring Kubernetes

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-eks) | [Product Page](https://aws.amazon.com/eks/)

---

### AWS Elastic Beanstalk
**ความสามารถ:** PaaS-like service ที่ deploy และ scale web applications (Node.js, Python, Java, .NET, Go, PHP) โดยจัดการ infrastructure ให้อัตโนมัติ

**ขอบเขต:** รองรับ many platforms, environment management, rolling updates, monitoring

**Use Cases:** Quick application deployment, developers who want less ops overhead, prototypes

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/elastic-beanstalk) | [Product Page](https://aws.amazon.com/elasticbeanstalk/)

---

### AWS Fargate
**ความสามารถ:** Serverless compute engine สำหรับ containers ที่ run บน ECS หรือ EKS โดยไม่ต้องจัดการ EC2 instances

**ขอบเขต:** Pay per task/pod runtime, ไม่ต้อง provision servers, รองรับ ARM and x86 architectures

**Use Cases:** Serverless containers, microservices, periodic batch jobs, cost-sensitive workloads

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-fargate) | [Product Page](https://aws.amazon.com/fargate/)

---

### AWS Lambda
**ความสามารถ:** Serverless compute service ที่ run code ตอบสนอง events โดยไม่ต้อง provision servers

**ขอบเขต:** รองรับ many languages (Node.js, Python, Java, Go, Ruby, .NET, custom runtimes), 15-min max execution time, 10GB max memory per function, ephemeral storage 512MB-10GB

**Use Cases:** Event-driven processing, API backends, data processing, automation, real-time file processing

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/lambda) | [Product Page](https://aws.amazon.com/lambda/)

---

## 6. Containers

### Amazon ECR (Elastic Container Registry)
**ความสามารถ:** Managed container registry สำหรับเก็บ Docker และ OCI images ทำงานร่วมกับ ECS, EKS, Lambda

**ขอบเขต:** Highly available, encryption at rest, image scanning, lifecycle policies, pull-through cache

**Use Cases:** Container image storage, CI/CD pipelines, private image registries

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-ecr) | [Product Page](https://aws.amazon.com/ecr/)

---

### Amazon ECS (ดู Compute)

### Amazon EKS (ดู Compute)

---

## 7. Customer Enablement

### AWS Training
**ความสามารถ:** บริการเรียนรู้อย่างเป็นทางการจาก AWS มีหลายรูปแบบ digital training และ in-person training ผ่าน AWS Training Partners

**ขอบเขต:** ครอบคลุมทุก certifications และ skill levels, มีเฉพาะบาง courses ฟรี

**Use Cases:** AWS skill development, certification preparation, team training

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-training) | [Product Page](https://aws.amazon.com/training/)

---

### AWS Skill Builder
**ความสามารถ:** แพลตฟอร์มเรียนรู้ digital ของ AWS มี courses, labs, AWS Cloud Quest (game-based learning)

**ขอบเขต:** Individual learning plans, role-based learning paths, hands-on labs, exam prep

**Use Cases:** Self-paced learning, certification prep, hands-on practice

**ลิงค์อ้างอิง:** [Product Page](https://aws.amazon.com/training/learn/)

---

## 8. Database

### Amazon Aurora
**ความสามารถ:** MySQL- และ PostgreSQL-compatible relational database ที่มี enterprise features (global database, backtrack, serverless) เร็วกว่า standard MySQL 5x, PostgreSQL 3x

**ขอบเขต:** Automatic storage scaling, multi-AZ deployments, read replicas up to 15, global database (cross-region replication), Aurora Serverless v2

**Use Cases:** Enterprise applications, SaaS applications, e-commerce, gaming

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aurora) | [Product Page](https://aws.amazon.com/rds/aurora/)

---

### Amazon DynamoDB
**ความสามารถ:** Fully managed NoSQL database แบบ key-value และ document ที่มี single-digit millisecond latency ทุก scale

**ขอบเขต:** On-demand หรือ provisioned capacity modes, Global Tables (multi-region), DAX (in-memory cache), DynamoDB Streams, encryption at rest

**Use Cases:** Web and mobile backends, gaming, IoT, real-time bidding, microservices

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/dynamodb) | [Product Page](https://aws.amazon.com/dynamodb/)

---

### Amazon ElastiCache
**ความสามารถ:** Managed in-memory caching service รองรับ Redis และ Memcached ช่วยลด latency และ offload databases

**ขอบเขต:** Redis (cluster mode, pub/sub, sorted sets, persistence), Memcached (multi-threaded, SASL auth), automatic failover, backup/restore

**Use Cases:** Session stores, caching, leaderboards, real-time analytics, message queues

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-elasticache) | [Product Page](https://aws.amazon.com/elasticache/)

---

### Amazon RDS (Relational Database Service)
**ความสามารถ:** Managed relational database service รองรับ 6 engines: MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Amazon Aurora

**ขอบเขต:** Multi-AZ deployments, Read Replicas, automated backups, automated software patching, DB Subnet Groups

**Use Cases:** Traditional web applications, e-commerce, CMS, business applications

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/rds) | [Product Page](https://aws.amazon.com/rds/)

---

### AWS DMS (Database Migration Service)
**ความสามารถ:** Migration service สำหรับย้าย databases ไป AWS อย่างปลอดภัย รองรับ homogeneous และ heterogeneous migrations

**ขอบเขต:** Continuous data replication (CDC), SCT สำหรับ schema conversion, รองรับ 20+ data sources

**Use Cases:** Cloud migration, database modernization, development environment creation

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-dms) | [Product Page](https://aws.amazon.com/dms/)

---

### AWS SCT (Schema Conversion Tool)
**ความสามารถ:** แปลง database schemas และ code objects จาก Oracle, SQL Server, SAP ASE ไปเป็น formats ที่ RDS/Aurora/DynamoDB รองรับ

**ขอบเขต:** รองรับ heterogeneous conversions, วิเคราะห์ complexity ของ conversion, สร้าง assessment report

**Use Cases:** Database schema migration, heterogeneous to homogeneous migration

**ลิงค์อ้างอิง:** [Product Page](https://aws.amazon.com/dms/schema-conversion-tool/)

---

## 9. Developer Tools

### AWS CodeBuild
**ความสามารถ:** Managed build service ที่ compile code, run tests, และ produce software packages

**ขอบเขต:** Serverless, pay per minute, รองรับ many programming languages, Docker integration, รองรับ BYO build environments

**Use Cases:** CI/CD pipelines, automated builds, container builds, batch compilation

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/codebuild) | [Product Page](https://aws.amazon.com/codebuild/)

---

### AWS CodePipeline
**ความสามารถ:** Continuous delivery service ที่ automate release pipelines สำหรับ fast and reliable application updates

**ขอบเขต:** รองรับ custom workflows, 200+ integrations (GitHub, Jenkins, etc.), parallel execution, approval gates

**Use Cases:** CI/CD pipelines, release automation, multi-stage deployments

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/codepipeline) | [Product Page](https://aws.amazon.com/codepipeline/)

---

### AWS X-Ray
**ความสามารถ:** Tracing service ที่ช่วยวิเคราะห์และ debug distributed applications เช่น microservices

**ขอบเขต:** Request tracing, service maps, latency analysis, annotations, sampling controls

**Use Cases:** Distributed system debugging, performance optimization, production issue investigation

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/x-ray) | [Product Page](https://aws.amazon.com/xray/)

---

## 10. End User Computing

### Amazon AppStream 2.0
**ความสามารถ:** Managed desktop application streaming service ที่ stream แอปพลิเคชันไปยัง devices ไม่ต้อง install บนเครื่องผู้ใช้

**ขอบเขต:** Windows and Linux applications, persistent or pooled fleets, user profile management, SSO integration

**Use Cases:** Remote work, legacy application access, software training, contract workers

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/appstream2) | [Product Page](https://aws.amazon.com/appstream2/)

---

### Amazon WorkSpaces
**ความสามารถ:** Managed desktop-as-a-service (DaaS) ที่ provide virtual desktops ใน AWS สำหรับ end users

**ขอบเขต:** Windows and Linux desktops, AlwaysOn และ AutoStop bundles, BYOD (WorkSpaces Web), directory integration

**Use Cases:** Remote employees, contractors, temporary workers, secure desktop environments

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-workspaces) | [Product Page](https://aws.amazon.com/workspaces/)

---

### Amazon WorkSpaces Secure Browser
**ความสามารถ:** Browser-based access ไป SaaS และ internal applications โดยไม่ต้อง install อะไรบน device

**ขอบเขต:** Zero trust architecture, no data stored on endpoints, integrated with IAM, cloud-hosted browsers

**Use Cases:** Secure browsing, contractor access, BYOD environments, regulated industries

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-workspaces-web) | [Product Page](https://aws.amazon.com/workspaces/web/)

---

## 11. Frontend Web and Mobile

### AWS Amplify
**ความสามารถ:** Full-stack platform สำหรับสร้าง พัฒนา และ deploy scalable web และ mobile applications

**ขอบเขต:** Amplify CLI, Amplify Hosting (CI/CD, preview), Amplify DataStore (offline-first), Amplify Auth, Amplify API (GraphQL/REST)

**Use Cases:** Web apps, React/Vue/Angular apps, mobile apps (iOS/Android), JAMstack

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-amplify) | [Product Page](https://aws.amazon.com/amplify/)

---

### AWS AppSync
**ความสามารถ:** Managed GraphQL service ที่ simplify application development โดยการเชื่อมต่อ frontend กับ multiple data sources

**ขอบเขต:** Real-time subscriptions, offline sync (Amplify DataStore), fine-grained access control, Lambda resolvers

**Use Cases:** Mobile backends, real-time collaboration apps, IoT dashboards, microservices integration

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-appsync) | [Product Page](https://aws.amazon.com/appsync/)

---

## 12. Internet of Things (IoT)

### AWS IoT Core
**ความสามารถ:** Managed cloud platform สำหรับเชื่อมต่อ IoT devices กับ cloud applications รองรับ billions of devices, trillions of messages

**ขอบเขต:** MQTT, HTTP, WebSocket protocols, device shadow, rules engine, secure authentication (X.509 certificates, IAM)

**Use Cases:** Smart home, industrial IoT, connected vehicles, asset tracking

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-iot-core) | [Product Page](https://aws.amazon.com/iot-core/)

---

## 13. Machine Learning

### Amazon Lex
**ความสามารถ:** AI service สำหรับสร้าง conversational interfaces (chatbots, voice bots) ใช้เทคโนโลยีเดียวกับ Alexa

**ขอบเขต:** Automatic Speech Recognition (ASR), Natural Language Understanding (NLU), slot filling, multi-turn conversations

**Use Cases:** Customer service chatbots, IVR replacement, enterprise assistants, mobile apps

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-lex) | [Product Page](https://aws.amazon.com/lex/)

---

### Amazon Kendra
**ความสามารถ:** ML-powered enterprise search service ที่ search across multiple data sources ให้ผลลัพธ์ที่ relevant

**ขอบเขต:** Document connectors (S3, SharePoint, Salesforce, etc.), semantic search, natural language queries, metadata search

**Use Cases:** Enterprise knowledge management, document search, customer support search, research portals

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-kendra) | [Product Page](https://aws.amazon.com/kendra/)

---

### Amazon SageMaker AI
**ความสามารถ:** End-to-end ML platform ที่ prepare data, train models, และ deploy สำหรับ predictions

**ขอบเขต:** SageMaker Studio (IDE), Ground Truth (data labeling), Autopilot (auto-ML), Neo (model optimization), JumpStart (pre-built models)

**Use Cases:** Custom model training, pre-built AI applications, MLOps, real-time and batch inference

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/sagemaker) | [Product Page](https://aws.amazon.com/sagemaker/)

---

## 14. Management and Governance

### AWS Auto Scaling (ดู Compute)

### AWS CloudFormation
**ความสามารถ:** Infrastructure as Code (IaC) service ที่ model และ provision AWS resources ใช้ templates (YAML/JSON)

**ขอบเขต:** Drift detection, Change Sets, StackSets (cross-account/region), Nested Stacks, Registry (third-party resources)

**Use Cases:** Infrastructure provisioning, environment recreation, disaster recovery

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/cloudformation) | [Product Page](https://aws.amazon.com/cloudformation/)

---

### AWS CloudTrail
**ความสามารถ:** Governance, compliance, risk audit service ที่ log API calls ทั้งหมดใน AWS account

**ขอบเขต:** Management events, data events, insights events, CloudTrail Lake (queryable log storage), multi-region trails

**Use Cases:** Security analysis, incident investigation, compliance audit, operational troubleshooting

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/cloudtrail) | [Product Page](https://aws.amazon.com/cloudtrail/)

---

### Amazon CloudWatch
**ความสามารถ:** Monitoring และ observability service ที่ collect metrics, logs, events จาก AWS และ on-premises

**ขอบเขต:**
- **Metrics:** Custom metrics, detailed monitoring, math expressions, alarms
- **Logs:** Log groups, insights queries, Subscription filters, Live Tail
- **Dashboards:** Customizable dashboards, widget-based
- **Synthetics:** Canary monitoring
- **Application Insights:** Auto-instrument for Java, .NET, etc.

**Use Cases:** Infrastructure monitoring, application performance monitoring, log analysis, alerting

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/cloudwatch) | [Product Page](https://aws.amazon.com/cloudwatch/)

---

### AWS Compute Optimizer
**ความสามารถ:** ML service ที่วิเคราะห์ usage patterns และแนะนำ optimal resource configurations (EC2, EBS, Lambda)

**ขอบเขต:** Rightsizing recommendations, utilization data analysis, refresh recommendations, Savings Plans recommendations

**Use Cases:** Cost optimization, performance improvement, resource rightsizing

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/compute-optimizer) | [Product Page](https://aws.amazon.com/compute-optimizer/)

---

### AWS Config
**ความสามารถ:** Resource inventory และ change tracking service ที่บันทึก configuration history และ compliance ของ AWS resources

**ขอบเขต:** Configuration history, conformance packs, rules (managed/custom), remediation, aggregator for multi-account

**Use Cases:** Compliance auditing, security analysis, change management, inventory management

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/config) | [Product Page](https://aws.amazon.com/config/)

---

### AWS Control Tower
**ความสามารถ:** 設置 landing zone อย่างปลอดภัยและปฏิบัติตาม best practices สำหรับ multi-account AWS environments

**ขอบเขต:** Account Factory, Guardrails (preventive/detective), Dashboard, Enrollment, Service Catalog portfolios

**Use Cases:** Enterprise multi-account governance, regulated environments, new AWS onboarding

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-control-tower) | [Product Page](https://aws.amazon.com/controltower/)

---

### AWS Health Dashboard
**ความสามารถ:** แสดงสถานะของ AWS resources และข้อมูล personalized alerts เมื่อเกิด events ที่กระทบ workloads

**ขอบเขต:** Service Health Dashboard (public), Your Account Health Dashboard (personalized), AWS Health API

**Use Cases:** Proactive issue awareness, incident response, SLA monitoring

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-health) | [Product Page](https://aws.amazon.com/health/)

---

### AWS License Manager
**ความสามารถ:** Managed license service ที่ track, manage, และ control software licenses จาก vendors ต่างๆ

**ขอบเขต:** License tracking, vendor-specific rules (Oracle, SQL Server, SAP), BYOL support, shared enforcement

**Use Cases:** License compliance, vendor audits, license optimization

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-license-manager) | [Product Page](https://aws.amazon.com/license-manager/)

---

### AWS Management Console
**ความสามารถ:** Web-based interface สำหรับจัดการ AWS resources ทั้งหมด

**ขอบเขต:** Resource browsing, actions, settings, mobile app (AWS Console Mobile)

**Use Cases:** Daily AWS management, resource exploration, basic operations

**ลิงค์อ้างอิง:** [Product Page](https://aws.amazon.com/console/)

---

### AWS Organizations
**ความสามารถ:** Account management service สำหรับ central governance และ management ของ multiple AWS accounts

**ขอบเขต:** Organizational Units (OUs), Service Control Policies (SCPs), Consolidated Billing, AI Services Opt-Out Policies, Tag policies

**Use Cases:** Multi-account strategy, centralized billing, security baselines, departmental cost tracking

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-organizations) | [Product Page](https://aws.amazon.com/organizations/)

---

### AWS Service Catalog
**ความสามารถ:** Managed catalog ของ IT services (templates, products) ที่ end users สามารถ launch ได้อย่าง governed

**ขอบเขต:** Portfolios, Products, Constraints (launch/template/notification), IAM permissions, Versioning

**Use Cases:** Self-service provisioning, standard environment deployment, compliance enforcement

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-service-catalog) | [Product Page](https://aws.amazon.com/servicecatalog/)

---

### Service Quotas
**ความสามารถ:** แสดง AWS service quotas และ request quota increases สำหรับ account

**ขอบเขต:** AWS Console และ API, template-based requests, Trusted Advisor integration for quotas

**Use Cases:** Capacity planning, quota monitoring, resource limit management

**ลิงค์อ้างอิง:** [Product Page](https://aws.amazon.com/servicequotas/)

---

### AWS Systems Manager
**ความสามารถ:** Central hub สำหรับ operational data และ automation ของ AWS resources มีหลาย capabilities

**ขอบเขต:**
- **Inventory:** เก็บ configuration data
- **Session Manager:** เข้าถึง EC2 โดยไม่ต้อง SSH/RDP
- **Run Command:** Execute commands/automation
- **Patch Manager:** Automated patching
- **State Manager:** Maintain consistent configurations
- **Parameter Store:** Secure storage (configuration/secrets)
- **OpsCenter:** Aggregate operational tasks

**Use Cases:** Fleet management, patch management, secrets management, operational automation

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/systems-manager) | [Product Page](https://aws.amazon.com/systems-manager/)

---

### AWS Trusted Advisor
**ความสามารถ:** Advisor ที่ให้ real-time guidance ตาม AWS best practices ใน 5 categories: Cost Optimization, Performance, Security, Fault Tolerance, Service Limits

**ขอบเขต:** Basic support: 6 checks (ฟรี), Business/Enterprise: all checks, automated actions for some checks

**Use Cases:** Cost optimization, security hardening, performance tuning, limit monitoring

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/trusted-advisor) | [Product Page](https://aws.amazon.com/premiumsupport/technology/trusted-advisor/)

---

### AWS Well-Architected Tool
**ความสามารถ:** Review และ improve workloads ตาม AWS Well-Architected Framework 6 pillars

**ขอบเขต:** Workload reviews, lens extensions, improvement plans, milestone tracking

**Use Cases:** Architecture review, risk assessment, continuous improvement

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/wellarchitectedtool) | [Product Page](https://aws.amazon.com/wellarchitected-tool/)

---

## 15. Migration and Transfer

### AWS Application Discovery Service
**ความสามารถ:** รวบรวมข้อมูล about on-premises servers เพื่อวางแผน migration ไป AWS

**ขอบเขต:** Agent-based และ agentless collection, dependency mapping, usage and configuration data

**Use Cases:** Migration planning, data center assessment, dependency analysis

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/application-discovery-service) | [Product Page](https://aws.amazon.com/application-discovery/)

---

### AWS Application Migration Service (MGN)
**ความสามารถ:** Lift-and-shift migration service ที่ migrate physical, virtual, และ cloud servers ไป AWS อย่าง automated

**ขอบเขต:** Continuous replication, cutover planning, validation, ใช้ Agent MGN Client

**Use Cases:** Large-scale migrations, data center exit, cloud migration projects

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-application-migration-service) | [Product Page](https://aws.amazon.com/application-migration-service/)

---

### AWS Database Migration Service (DMS) (ดู Database)

### Migration Evaluator
**ความสามารถ:** วิเคราะห์ on-premises infrastructure และสร้าง data-driven business case สำหรับ AWS migration

**ขอบเขต:** TCO analysis, migration assessment, business case generation

**Use Cases:** Migration business case, cost comparison, strategic planning

**ลิงค์อ้างอิง:** [Product Page](https://aws.amazon.com/migration-evaluator/)

---

### AWS Migration Hub
**ความสามารถ:** Central hub สำหรับ track และ manage migrations ข้าม multiple AWS tools

**ขอบเขต:** Migration tracking, unified view, tool integrations (MGN, DMS, etc.)

**Use Cases:** Large migration program management, progress tracking, tool consolidation

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-migration-hub) | [Product Page](https://aws.amazon.com/migration-hub/)

---

### AWS Schema Conversion Tool (SCT) (ดู Database)

### AWS Snow Family
**ความสามารถ:** Physical devices สำหรับย้ายข้อมูลขนาดใหญ่ offline ไป AWS เมื่อ network ไม่เพียงพอ

**ขอบเขต:**
- **Snowball Edge Storage Optimized:** 80TB, for large data transfers
- **Snowball Edge Compute Optimized:** 42TB + compute (Lambda, EC2)
- **Snowcone:** 8TB (smallest), สำหรับ space-constrained environments
- **Snowmobile:** 100PB container, สำหรับ exabyte-scale transfers

**Use Cases:** Data center migration, disaster recovery, remote site data transfer, edge computing

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/snowball) | [Product Page](https://aws.amazon.com/snow/)

---

## 16. Networking and Content Delivery

### Amazon API Gateway
**ความสามารถ:** Managed service สำหรับสร้าง, deploy, และ manage APIs (REST, HTTP, WebSocket) ที่เชื่อมต่อ backend services

**ขอบเขต:** REST, HTTP, WebSocket APIs, Lambda integrations, AWS X-Ray tracing, throttling, caching, JWT/OAuth, API keys

**Use Cases:** Serverless APIs, microservices backends, mobile backends, real-time applications

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-api-gateway) | [Product Page](https://aws.amazon.com/api-gateway/)

---

### Amazon CloudFront
**ความสามารถ:** Content Delivery Network (CDN) ที่ distribute content ไป users ทั่วโลกด้วย low latency

**ขอบเขต:** Global network of 600+ PoPs, SNI-based TLS, Lambda@Edge, Origin Access Control (OAC), RTMP distribution (legacy), Functions

**Use Cases:** Static content delivery, video streaming, dynamic content, API acceleration, malware protection

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/cloudfront) | [Product Page](https://aws.amazon.com/cloudfront/)

---

### AWS Direct Connect
**ความสามารถ:** Dedicated network connection จาก on-premises ไป AWS ที่ bypasses internet

**ขอบเขต:** 1Gbps, 10Gbps, 100Gbps links, AWS Direct Connect SiteLink, VIFs (Public/Private/VLAN), LAG, redundant connections

**Use Cases:** Hybrid cloud, large data transfers, consistent network performance, compliance requirements

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/directconnect) | [Product Page](https://aws.amazon.com/directconnect/)

---

### Amazon Route 53
**ความสามารถ:** Highly available DNS และ domain registration service ที่ routing ด้วย latency, geolocation, health checks

**ขอบเขต:** DNS records (A, AAAA, CNAME, MX, TXT, etc.), health checks, routing policies (Simple, Weighted, Latency, Geolocation, Failover, IP-based), domain registration, Route 53 Resolver

**Use Cases:** DNS management, domain registration, health check-based routing, disaster recovery

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/route53) | [Product Page](https://aws.amazon.com/route53/)

---

### AWS VPN
**ความสามารถ:** Secure connectivity ระหว่าง on-premises และ AWS ผ่าน encrypted tunnel

**ขอบเขต:**
- **Site-to-Site VPN:** IPsec VPN ระหว่าง VPC และ on-premises, supports BGP
- **Client VPN:** Managed client-based VPN (OpenVPN-based), SSL-VPN

**Use Cases:** Hybrid cloud connectivity, remote access, site-to-site connections

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/vpn) | [Product Page](https://aws.amazon.com/vpn/)

---

### Amazon VPC (Virtual Private Cloud)
**ความสามารถ:** Isolated cloud network ที่ launch AWS resources ใน virtual network ที่กำหนดเอง

**ขอบเขต:**
- **Components:** Subnets (Public/Private), Route Tables, Internet Gateway, NAT Gateway, VPC Endpoints (Interface/Gateway), Peering, Security Groups, NACLs, VPN
- **Features:** VPC CIDR blocks, DHCP options, DNS settings, IP addressing (IPv4/IPv6), VPC Flow Logs, Traffic Mirroring

**Use Cases:** Isolated workloads, multi-tier applications, hybrid cloud, compliance isolation

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/vpc) | [Product Page](https://aws.amazon.com/vpc/)

---

## 17. Security, Identity, and Compliance

### AWS Artifact
**ความสามารถ:** Self-service portal สำหรับ access AWS compliance reports และ agreements (SAE, BAA, NDA)

**ขอบเขต:** Artifact Agreements (customer agreements), Artifact Reports (SOC, PCI, ISO, etc.), Audit Manager reports integration

**Use Cases:** Compliance evidence gathering, security reviews, regulatory audits

**ลิงค์อ้างอิง:** [Product Page](https://aws.amazon.com/artifact/)

---

### AWS Audit Manager
**ความสามารถ:** Automated evidence collection service สำหรับ continuous compliance auditing

**ขอบเขต:** Pre-built frameworks (SOC, PCI, GDPR, etc.), custom frameworks, automated evidence collection, assessment reports

**Use Cases:** Continuous compliance, audit preparation, control testing automation

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/audit-manager) | [Product Page](https://aws.amazon.com/audit-manager/)

---

### AWS Certificate Manager (ACM)
**ความสามารถ:** Provision, manage, และ deploy SSL/TLS certificates สำหรับ AWS services และ internal use

**ขอบเขต:** Free public certificates, import third-party CAs, ACM Private CA, auto-renewal, integration with ALB, CloudFront, API Gateway

**Use Cases:** HTTPS for websites, API security, encrypted communications

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/acm) | [Product Page](https://aws.amazon.com/certificate-manager/)

---

### AWS CloudHSM
**ความสามารถ:** Hardware Security Module (HSM) managed by AWS ที่ generate และ use encryption keys ใน single-tenant hardware

**ขอบเขต:** FIPS 140-2 Level 3, PKCS#11, JCE, CNSA compliant, dedicated hardware, no AWS access to keys

**Use Cases:** Cryptographic operations, key storage for compliance, DNSSEC, code signing

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/cloudhsm) | [Product Page](https://aws.amazon.com/cloudhsm/)

---

### Amazon Cognito
**ความสามารถ:** User authentication, authorization, และ user management สำหรับ web และ mobile apps

**ขอบเขต:** User Pools (sign-up/sign-in), Identity Pools (AWS credentials), Social IdPs (Google, Facebook, Apple), SAML/OIDC, MFA

**Use Cases:** Web/mobile app auth, microservice auth, B2C apps, access to AWS resources

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-cognito) | [Product Page](https://aws.amazon.com/cognito/)

---

### Amazon Detective
**ความสามารถ:** Analyze, investigate, และ identify root cause ของ security issues โดย aggregate logs และ apply ML

**ขอบเขต:** Integrates with CloudTrail, VPC Flow Logs, GuardDuty findings, visual graphs, timeline analysis

**Use Cases:** Security investigations, root cause analysis, behavioral analysis

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/detective) | [Product Page](https://aws.amazon.com/detective/)

---

### AWS Directory Service
**ความสามารถ:** Managed directories ใน AWS รองรับ Microsoft AD, Simple AD, AD Connector

**ขอบเขต:**
- **AWS Managed Microsoft AD:** Full Microsoft AD in AWS
- **Simple AD:** Samba-based, small workloads
- **AD Connector:** Proxy to on-premises AD

**Use Cases:** Windows workloads, SSO, user management, application authentication

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-directory-service) | [Product Page](https://aws.amazon.com/directoryservice/)

---

### AWS Firewall Manager
**ความสามารถ:** Central management ของ AWS WAF rules ข้าม accounts และ resources

**ขอบเขต:** WAF rules management, Shield Advanced protection, Security Groups policies, Centralized policy management

**Use Cases:** Multi-account security management, organization-wide firewall policies

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-firewall-manager) | [Product Page](https://aws.amazon.com/firewall-manager/)

---

### Amazon GuardDuty
**ความสามารถ:** Threat detection service ที่ continuously monitor สำหรับ malicious activity โดยใช้ ML

**ขอบเขต:** CloudTrail event logs, VPC Flow Logs, DNS logs, EKS audit logs, S3 data events, malware protection (S3)

**Use Cases:** Continuous threat detection, compromised credentials, cryptocurrency mining, data exfiltration

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/guardduty) | [Product Page](https://aws.amazon.com/guardduty/)

---

### AWS Identity and Access Management (IAM)
**ความสามารถ:** 核心 security service สำหรับ manage identities และ access ของ AWS resources

**ขอบเขต:**
- **Identities:** Users, Groups, Roles, Managed Policies, Inline Policies
- **Access Methods:** Access Keys, Passwords, MFA, Service Control Policies (SCPs)
- **Features:** Role-based access, federation, temporary credentials, policy conditions

**Use Cases:** Permission management, least privilege enforcement, cross-account access, federation

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/iam) | [Product Page](https://aws.amazon.com/iam/)

---

### AWS IAM Identity Center
**ความสามารถ:** Single Sign-On (SSO) service สำหรับ connect AWS accounts และ business applications

**ขอบเขต:** SSO to AWS accounts, SAML 2.0 applications, IAM Identity Center directory, Permission Sets, MFA

**Use Cases:** Enterprise SSO, multi-account management, SaaS application access

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/sso) | [Product Page](https://aws.amazon.com/iam/identity-center/)

---

### Amazon Inspector
**ความสามารถ:** Automated vulnerability management service ที่ scan EC2 instances และ container images

**ขอบเขต:** Network reachability analysis, package vulnerabilities (EC2), Lambda function scanning, container image scanning (ECR), CVE database

**Use Cases:** Vulnerability scanning, security posture, compliance checking

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/inspector) | [Product Page](https://aws.amazon.com/inspector/)

---

### AWS Key Management Service (KMS)
**ความสามารถ:** Managed encryption key service สำหรับ create และ control encryption keys

**ขอบเขต:** Symmetric keys (AES-256), Asymmetric keys (RSA, ECC), AWS managed keys, Customer managed keys, Custom key stores (CloudHSM), Key rotation, FIPS 140-2 Level 2/3

**Use Cases:** Data encryption, compliance, key rotation, envelope encryption

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/kms) | [Product Page](https://aws.amazon.com/kms/)

---

### Amazon Macie
**ความสามารถ:** Data security service ที่ discover และ protect sensitive data ใน S3 โดยใช้ ML

**ขอบเขต:** Sensitive data discovery, S3 inventory, automated findings, PII detection, policy findings

**Use Cases:** Data loss prevention, compliance, sensitive data discovery, privacy protection

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/amazon-macie) | [Product Page](https://aws.amazon.com/macie/)

---

### AWS Resource Access Manager (RAM)
**ความสามารถ:** Share AWS resources ข้าม AWS accounts โดยไม่ต้อง duplicate

**ขอบเขต:** Resource sharing (VPC subnets, Transit Gateways, License configs, etc.), Organizational units sharing

**Use Cases:** Multi-account resource sharing, VPC sharing, shared services

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/ram) | [Product Page](https://aws.amazon.com/ram/)

---

### AWS Secrets Manager
**ความสามารถ:** เก็บ, retrieve, และ rotate secrets (database credentials, API keys) อย่างปลอดภัย

**ขอบเขต:** Secret rotation (RDS, Redshift, etc.), Automatic rotation, Cross-account access, Fine-grained IAM policies, Secret versioning

**Use Cases:** Application credentials, database passwords, API keys, certificates

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/secrets-manager) | [Product Page](https://aws.amazon.com/secrets-manager/)

---

### AWS Security Hub
**ความสามารถ:** Central security dashboard ที่ aggregate และ prioritize security findings จาก multiple AWS และ third-party services

**ขอบเขต:** Security standards (CIS, PCI DSS, AWS FSBP), Integrations (GuardDuty, Inspector, Macie, partner products), Automated remediation, Findings aggregation

**Use Cases:** Centralized security visibility, compliance monitoring, security operations

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/security-hub) | [Product Page](https://aws.amazon.com/security-hub/)

---

### AWS Shield
**ความสามารถ:** DDoS protection service ที่ protect applications บน AWS

**ขอบเขต:**
- **Shield Standard:** ฟรี, always-on protection, L3/L4/L7 DDoS protection
- **Shield Advanced:** 24/7 DDoS Response Team, cost protection, WAF + CloudFront integration, health-based detection

**Use Cases:** DDoS protection, availability protection, critical applications protection

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/shield) | [Product Page](https://aws.amazon.com/shield/)

---

### AWS WAF (Web Application Firewall)
**ความสามารถ:** Web application firewall ที่ protect web apps จาก common exploits (SQL injection, XSS, etc.)

**ขอบเขต:** Web ACLs, Rules (managed rules, custom rules), Rate limiting, IP blocking, geo-blocking, Bot Control, Captcha

**Use Cases:** Web application security, OWASP Top 10 protection, API protection, bot mitigation

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/waf) | [Product Page](https://aws.amazon.com/waf/)

---

## 18. Serverless

### AWS Lambda (ดู Compute)

### Amazon DynamoDB (ดู Database)

### Amazon S3 (ดู Storage)

---

## 19. Storage

### Amazon EBS (Elastic Block Store)
**ความสามารถ:** Block storage ระดับ production สำหรับ EC2 instances ที่ persist โดยอิสระจาก instance lifecycle

**ขอบเขต:**
- **Volume Types:** gp3 (general purpose SSD), gp2, io2 (provisioned IOPS SSD), st1 (throughput optimized HDD), sc1 (cold storage HDD)
- **Features:** Encryption (EBS encryption), Snapshots, Multi-attach (io2 only), Fast snapshot restore

**Use Cases:** Database storage, boot volumes, enterprise applications, data warehouses

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/ebs) | [Product Page](https://aws.amazon.com/ebs/)

---

### Amazon EFS (Elastic File System)
**ความสามารถ:** Scalable file storage (NFS) สำหรับใช้กับ EC2 instances หลายตัวพร้อมกัน

**ขอบเขต:** Standard and Infrequent Access classes, Encryption at rest, Performance mode (General Purpose/Max I/O), Throughput mode (Bursting/Provisioned), Access via mount targets in VPC

**Use Cases:** Container storage, CMS, ML workloads, shared file storage, home directories

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/efs) | [Product Page](https://aws.amazon.com/efs/)

---

### Amazon FSx
**ความสามารถ:** Managed third-party file systems ที่รองรับ Windows File Server (FSx for Windows File Server) และ Lustre (FSx for Lustre)

**ขอบเขต:**
- **FSx for Windows File Server:** SMB, Active Directory integration, DFS, daily backups
- **FSx for Lustre:** S3 integration, HPC workloads, petabyte-scale, hot/cold storage tiers
- **FSx for NetApp ONTAP:** NFS/SMB, data tiering, snapshots, cloning
- **FSx for OpenZFS:** ZFS file system, NFS/SMB, snapshots

**Use Cases:** Windows-based workloads, HPC, media processing, analytics, lift-and-shift Windows apps

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/fsx) | [Product Page](https://aws.amazon.com/fsx/)

---

### Amazon S3 (Simple Storage Service)
**ความสามารถ:** Object storage ที่มีความสามารถ scale, durability, และ availability สูง สำหรับเก็บข้อมูลทุกประเภท

**ขอบเขต:**
- **Storage Classes:** S3 Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Instant Retrieval, Glacier Flexible Retrieval, Glacier Deep Archive
- **Features:** Versioning, Object Lock (WORM), Replication, Lifecycle policies, Inventory, Batch Operations, Select, Multipart upload, Transfer Acceleration
- **Security:** Block Public Access, ACLs, Policies, Encryption (SSE-S3, SSE-KMS, SSE-C), Access Points, MFA Delete

**Use Cases:** Data lakes, backup and restore, archive, disaster recovery, static website hosting, big data analytics

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/s3) | [Product Page](https://aws.amazon.com/s3/)

---

### AWS Storage Gateway
**ความสามารถ:** Hybrid storage service ที่ให้ on-premises applications เข้าถึง AWS storage อย่าง seamless

**ขอบเขต:**
- **File Gateway:** NFS/SMB เชื่อมต่อ S3
- **Volume Gateway (Stored):** iSCSI-backed, primary data on-premises, async backup to S3
- **Volume Gateway (Cached):** iSCSI-backed, data cached locally, primary data in S3
- **Tape Gateway:** Virtual tape library (VTL) เชื่อมต่อ S3/Glacier

**Use Cases:** Hybrid cloud storage, backup to cloud, tiered storage, disaster recovery

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/storage-gateway) | [Product Page](https://aws.amazon.com/storagegateway/)

---

### AWS Backup
**ความสามารถ:** Centralized backup service สำหรับ backup AWS resources อย่าง unified และ policy-driven

**ขอบเขต:** Cross-service backup (EC2, EBS, RDS, Aurora, DynamoDB, EFS, FSx, Storage Gateway, etc.), Backup plans, Lifecycle policies, Vault lock (WORM), Cross-account backup

**Use Cases:** Centralized backup management, compliance backup, cross-region backup, backup automation

**ลิงค์อ้างอิง:** [AWS Pricing Calculator](https://calculator.aws/#/createCalculator/aws-backup) | [Product Page](https://aws.amazon.com/backup/)

---

## 20. Quick Reference Links

ตารางสรุปลิงค์ทั้งหมดสำหรับการเข้าดูราคาและเอกสารอย่างเป็นทางการของ AWS Services ที่อยู่ในขอบเขต Cloud Practitioner

### Analytics
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| Amazon Athena | [ลิงค์](https://calculator.aws/#/createCalculator/athena) | [ลิงค์](https://aws.amazon.com/athena/) |
| Amazon EMR | [ลิงค์](https://calculator.aws/#/createCalculator/elastic-map-reduce) | [ลิงค์](https://aws.amazon.com/emr/) |
| AWS Glue | [ลิงค์](https://calculator.aws/#/createCalculator/glue) | [ลิงค์](https://aws.amazon.com/glue/) |
| Amazon Kinesis | [ลิงค์](https://calculator.aws/#/createCalculator/kinesis-data-streams) | [ลิงค์](https://aws.amazon.com/kinesis/) |
| Amazon OpenSearch | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-opensearch-service) | [ลิงค์](https://aws.amazon.com/opensearch-service/) |
| Amazon QuickSight | [ลิงค์](https://calculator.aws/#/createCalculator/quicksight) | [ลิงค์](https://aws.amazon.com/quicksight/) |
| Amazon Redshift | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-redshift) | [ลิงค์](https://aws.amazon.com/redshift/) |

### Application Integration
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| Amazon EventBridge | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-eventbridge) | [ลิงค์](https://aws.amazon.com/eventbridge/) |
| Amazon SNS | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-sns) | [ลิงค์](https://aws.amazon.com/sns/) |
| Amazon SQS | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-sqs) | [ลิงค์](https://aws.amazon.com/sqs/) |
| AWS Step Functions | [ลิงค์](https://calculator.aws/#/createCalculator/step-functions) | [ลิงค์](https://aws.amazon.com/step-functions/) |

### Business Applications
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| Amazon Connect | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-connect) | [ลิงค์](https://aws.amazon.com/connect/) |
| Amazon SES | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-ses) | [ลิงค์](https://aws.amazon.com/ses/) |

### Cloud Financial Management
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| AWS Budgets | [ลิงค์](https://calculator.aws/#/createCalculator/aws-budgets) | [ลิงค์](https://aws.amazon.com/aws-cost-management/aws-budgets/) |
| AWS Cost Explorer | [ลิงค์](https://calculator.aws/#/createCalculator/aws-cost-explorer) | [ลิงค์](https://aws.amazon.com/aws-cost-management/aws-cost-explorer/) |
| AWS Pricing Calculator | [ลิงค์](https://calculator.aws) | [ลิงค์](https://aws.amazon.com/pricing/calculator/) |

### Compute
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| AWS Auto Scaling | [ลิงค์](https://calculator.aws/#/createCalculator/auto-scaling) | [ลิงค์](https://aws.amazon.com/autoscaling/) |
| Amazon EC2 | [ลิงค์](https://calculator.aws/#/createCalculator/ec2-enhancement) | [ลิงค์](https://aws.amazon.com/ec2/) |
| Amazon ECS | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-ecs) | [ลิงค์](https://aws.amazon.com/ecs/) |
| Amazon EKS | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-eks) | [ลิงค์](https://aws.amazon.com/eks/) |
| AWS Elastic Beanstalk | [ลิงค์](https://calculator.aws/#/createCalculator/elastic-beanstalk) | [ลิงค์](https://aws.amazon.com/elasticbeanstalk/) |
| AWS Fargate | [ลิงค์](https://calculator.aws/#/createCalculator/aws-fargate) | [ลิงค์](https://aws.amazon.com/fargate/) |
| AWS Lambda | [ลิงค์](https://calculator.aws/#/createCalculator/lambda) | [ลิงค์](https://aws.amazon.com/lambda/) |

### Containers
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| Amazon ECR | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-ecr) | [ลิงค์](https://aws.amazon.com/ecr/) |
| Amazon ECS | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-ecs) | [ลิงค์](https://aws.amazon.com/ecs/) |
| Amazon EKS | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-eks) | [ลิงค์](https://aws.amazon.com/eks/) |

### Customer Enablement
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| AWS Training | [ลิงค์](https://calculator.aws/#/createCalculator/aws-training) | [ลิงค์](https://aws.amazon.com/training/) |
| AWS Skill Builder | — | [ลิงค์](https://aws.amazon.com/training/learn/) |

### Database
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| Amazon Aurora | [ลิงค์](https://calculator.aws/#/createCalculator/aurora) | [ลิงค์](https://aws.amazon.com/rds/aurora/) |
| Amazon DynamoDB | [ลิงค์](https://calculator.aws/#/createCalculator/dynamodb) | [ลิงค์](https://aws.amazon.com/dynamodb/) |
| Amazon ElastiCache | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-elasticache) | [ลิงค์](https://aws.amazon.com/elasticache/) |
| Amazon RDS | [ลิงค์](https://calculator.aws/#/createCalculator/rds) | [ลิงค์](https://aws.amazon.com/rds/) |
| AWS DMS | [ลิงค์](https://calculator.aws/#/createCalculator/aws-dms) | [ลิงค์](https://aws.amazon.com/dms/) |
| AWS SCT | — | [ลิงค์](https://aws.amazon.com/dms/schema-conversion-tool/) |

### Developer Tools
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| AWS CodeBuild | [ลิงค์](https://calculator.aws/#/createCalculator/codebuild) | [ลิงค์](https://aws.amazon.com/codebuild/) |
| AWS CodePipeline | [ลิงค์](https://calculator.aws/#/createCalculator/codepipeline) | [ลิงค์](https://aws.amazon.com/codepipeline/) |
| AWS X-Ray | [ลิงค์](https://calculator.aws/#/createCalculator/x-ray) | [ลิงค์](https://aws.amazon.com/xray/) |

### End User Computing
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| Amazon AppStream 2.0 | [ลิงค์](https://calculator.aws/#/createCalculator/appstream2) | [ลิงค์](https://aws.amazon.com/appstream2/) |
| Amazon WorkSpaces | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-workspaces) | [ลิงค์](https://aws.amazon.com/workspaces/) |
| WorkSpaces Secure Browser | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-workspaces-web) | [ลิงค์](https://aws.amazon.com/workspaces/web/) |

### Frontend Web and Mobile
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| AWS Amplify | [ลิงค์](https://calculator.aws/#/createCalculator/aws-amplify) | [ลิงค์](https://aws.amazon.com/amplify/) |
| AWS AppSync | [ลิงค์](https://calculator.aws/#/createCalculator/aws-appsync) | [ลิงค์](https://aws.amazon.com/appsync/) |

### Internet of Things (IoT)
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| AWS IoT Core | [ลิงค์](https://calculator.aws/#/createCalculator/aws-iot-core) | [ลิงค์](https://aws.amazon.com/iot-core/) |

### Machine Learning
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| Amazon Lex | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-lex) | [ลิงค์](https://aws.amazon.com/lex/) |
| Amazon Kendra | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-kendra) | [ลิงค์](https://aws.amazon.com/kendra/) |
| Amazon SageMaker AI | [ลิงค์](https://calculator.aws/#/createCalculator/sagemaker) | [ลิงค์](https://aws.amazon.com/sagemaker/) |

### Management and Governance
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| AWS CloudFormation | [ลิงค์](https://calculator.aws/#/createCalculator/cloudformation) | [ลิงค์](https://aws.amazon.com/cloudformation/) |
| AWS CloudTrail | [ลิงค์](https://calculator.aws/#/createCalculator/cloudtrail) | [ลิงค์](https://aws.amazon.com/cloudtrail/) |
| Amazon CloudWatch | [ลิงค์](https://calculator.aws/#/createCalculator/cloudwatch) | [ลิงค์](https://aws.amazon.com/cloudwatch/) |
| AWS Compute Optimizer | [ลิงค์](https://calculator.aws/#/createCalculator/compute-optimizer) | [ลิงค์](https://aws.amazon.com/compute-optimizer/) |
| AWS Config | [ลิงค์](https://calculator.aws/#/createCalculator/config) | [ลิงค์](https://aws.amazon.com/config/) |
| AWS Control Tower | [ลิงค์](https://calculator.aws/#/createCalculator/aws-control-tower) | [ลิงค์](https://aws.amazon.com/controltower/) |
| AWS Health Dashboard | [ลิงค์](https://calculator.aws/#/createCalculator/aws-health) | [ลิงค์](https://aws.amazon.com/health/) |
| AWS License Manager | [ลิงค์](https://calculator.aws/#/createCalculator/aws-license-manager) | [ลิงค์](https://aws.amazon.com/license-manager/) |
| AWS Management Console | — | [ลิงค์](https://aws.amazon.com/console/) |
| AWS Organizations | [ลิงค์](https://calculator.aws/#/createCalculator/aws-organizations) | [ลิงค์](https://aws.amazon.com/organizations/) |
| AWS Service Catalog | [ลิงค์](https://calculator.aws/#/createCalculator/aws-service-catalog) | [ลิงค์](https://aws.amazon.com/servicecatalog/) |
| Service Quotas | — | [ลิงค์](https://aws.amazon.com/servicequotas/) |
| AWS Systems Manager | [ลิงค์](https://calculator.aws/#/createCalculator/systems-manager) | [ลิงค์](https://aws.amazon.com/systems-manager/) |
| AWS Trusted Advisor | [ลิงค์](https://calculator.aws/#/createCalculator/trusted-advisor) | [ลิงค์](https://aws.amazon.com/premiumsupport/technology/trusted-advisor/) |
| AWS Well-Architected Tool | [ลิงค์](https://calculator.aws/#/createCalculator/wellarchitectedtool) | [ลิงค์](https://aws.amazon.com/wellarchitected-tool/) |

### Migration and Transfer
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| AWS Application Discovery Service | [ลิงค์](https://calculator.aws/#/createCalculator/application-discovery-service) | [ลิงค์](https://aws.amazon.com/application-discovery/) |
| AWS MGN | [ลิงค์](https://calculator.aws/#/createCalculator/aws-application-migration-service) | [ลิงค์](https://aws.amazon.com/application-migration-service/) |
| AWS DMS | [ลิงค์](https://calculator.aws/#/createCalculator/aws-dms) | [ลิงค์](https://aws.amazon.com/dms/) |
| Migration Evaluator | — | [ลิงค์](https://aws.amazon.com/migration-evaluator/) |
| AWS Migration Hub | [ลิงค์](https://calculator.aws/#/createCalculator/aws-migration-hub) | [ลิงค์](https://aws.amazon.com/migration-hub/) |
| AWS SCT | — | [ลิงค์](https://aws.amazon.com/dms/schema-conversion-tool/) |
| AWS Snow Family | [ลิงค์](https://calculator.aws/#/createCalculator/snowball) | [ลิงค์](https://aws.amazon.com/snow/) |

### Networking and Content Delivery
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| Amazon API Gateway | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-api-gateway) | [ลิงค์](https://aws.amazon.com/api-gateway/) |
| Amazon CloudFront | [ลิงค์](https://calculator.aws/#/createCalculator/cloudfront) | [ลิงค์](https://aws.amazon.com/cloudfront/) |
| AWS Direct Connect | [ลิงค์](https://calculator.aws/#/createCalculator/directconnect) | [ลิงค์](https://aws.amazon.com/directconnect/) |
| Amazon Route 53 | [ลิงค์](https://calculator.aws/#/createCalculator/route53) | [ลิงค์](https://aws.amazon.com/route53/) |
| AWS VPN | [ลิงค์](https://calculator.aws/#/createCalculator/vpn) | [ลิงค์](https://aws.amazon.com/vpn/) |
| Amazon VPC | [ลิงค์](https://calculator.aws/#/createCalculator/vpc) | [ลิงค์](https://aws.amazon.com/vpc/) |

### Security, Identity, and Compliance
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| AWS Artifact | — | [ลิงค์](https://aws.amazon.com/artifact/) |
| AWS Audit Manager | [ลิงค์](https://calculator.aws/#/createCalculator/audit-manager) | [ลิงค์](https://aws.amazon.com/audit-manager/) |
| AWS ACM | [ลิงค์](https://calculator.aws/#/createCalculator/acm) | [ลิงค์](https://aws.amazon.com/certificate-manager/) |
| AWS CloudHSM | [ลิงค์](https://calculator.aws/#/createCalculator/cloudhsm) | [ลิงค์](https://aws.amazon.com/cloudhsm/) |
| Amazon Cognito | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-cognito) | [ลิงค์](https://aws.amazon.com/cognito/) |
| Amazon Detective | [ลิงค์](https://calculator.aws/#/createCalculator/detective) | [ลิงค์](https://aws.amazon.com/detective/) |
| AWS Directory Service | [ลิงค์](https://calculator.aws/#/createCalculator/aws-directory-service) | [ลิงค์](https://aws.amazon.com/directoryservice/) |
| AWS Firewall Manager | [ลิงค์](https://calculator.aws/#/createCalculator/aws-firewall-manager) | [ลิงค์](https://aws.amazon.com/firewall-manager/) |
| Amazon GuardDuty | [ลิงค์](https://calculator.aws/#/createCalculator/guardduty) | [ลิงค์](https://aws.amazon.com/guardduty/) |
| AWS IAM | [ลิงค์](https://calculator.aws/#/createCalculator/iam) | [ลิงค์](https://aws.amazon.com/iam/) |
| AWS IAM Identity Center | [ลิงค์](https://calculator.aws/#/createCalculator/sso) | [ลิงค์](https://aws.amazon.com/iam/identity-center/) |
| Amazon Inspector | [ลิงค์](https://calculator.aws/#/createCalculator/inspector) | [ลิงค์](https://aws.amazon.com/inspector/) |
| AWS KMS | [ลิงค์](https://calculator.aws/#/createCalculator/kms) | [ลิงค์](https://aws.amazon.com/kms/) |
| Amazon Macie | [ลิงค์](https://calculator.aws/#/createCalculator/amazon-macie) | [ลิงค์](https://aws.amazon.com/macie/) |
| AWS RAM | [ลิงค์](https://calculator.aws/#/createCalculator/ram) | [ลิงค์](https://aws.amazon.com/ram/) |
| AWS Secrets Manager | [ลิงค์](https://calculator.aws/#/createCalculator/secrets-manager) | [ลิงค์](https://aws.amazon.com/secrets-manager/) |
| AWS Security Hub | [ลิงค์](https://calculator.aws/#/createCalculator/security-hub) | [ลิงค์](https://aws.amazon.com/security-hub/) |
| AWS Shield | [ลิงค์](https://calculator.aws/#/createCalculator/shield) | [ลิงค์](https://aws.amazon.com/shield/) |
| AWS WAF | [ลิงค์](https://calculator.aws/#/createCalculator/waf) | [ลิงค์](https://aws.amazon.com/waf/) |

### Storage
| Service | AWS Pricing Calculator | Product Page |
|---------|----------------------|--------------|
| Amazon EBS | [ลิงค์](https://calculator.aws/#/createCalculator/ebs) | [ลิงค์](https://aws.amazon.com/ebs/) |
| Amazon EFS | [ลิงค์](https://calculator.aws/#/createCalculator/efs) | [ลิงค์](https://aws.amazon.com/efs/) |
| Amazon FSx | [ลิงค์](https://calculator.aws/#/createCalculator/fsx) | [ลิงค์](https://aws.amazon.com/fsx/) |
| Amazon S3 | [ลิงค์](https://calculator.aws/#/createCalculator/s3) | [ลิงค์](https://aws.amazon.com/s3/) |
| AWS Storage Gateway | [ลิงค์](https://calculator.aws/#/createCalculator/storage-gateway) | [ลิงค์](https://aws.amazon.com/storagegateway/) |
| AWS Backup | [ลิงค์](https://calculator.aws/#/createCalculator/aws-backup) | [ลิงค์](https://aws.amazon.com/backup/) |

---

## สรุปตาราง Services ทั้งหมด

| หมวด | จำนวน Services |
|------|----------------|
| Analytics | 7 |
| Application Integration | 4 |
| Business Applications | 2 |
| Cloud Financial Management | 3 |
| Compute | 7 |
| Containers | 3 |
| Customer Enablement | 2 |
| Database | 6 |
| Developer Tools | 3 |
| End User Computing | 3 |
| Frontend Web and Mobile | 2 |
| IoT | 1 |
| Machine Learning | 3 |
| Management and Governance | 15 |
| Migration and Transfer | 7 |
| Networking and Content Delivery | 6 |
| Security, Identity, and Compliance | 19 |
| Serverless | 3 |
| Storage | 6 |
| **รวม** | **102** |

---

*เอกสารนี้อ้างอิงจาก AWS Certified Cloud Practitioner Exam Guide (CLF-C02) และ AWS Official Documentation*

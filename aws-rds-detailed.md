# Amazon RDS (Relational Database Service) — คู่มือฉบับสมบูรณ์

> แหล่งอ้างอิง: [Amazon RDS User Guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/)
> แหล่งอ้างอิง: [RDS Instance Classes](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.html)
> แหล่งอ้างอิง: [AWS RDS API Reference](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/)

---

## 1. ภาพรวม (Overview)

Amazon Relational Database Service (Amazon RDS) คือ managed relational database service ใน cloud ที่ช่วยให้ setup, operation, และ scale relational database ได้ง่ายขึ้น RDS ไม่ใช่ database แต่เป็น **service ที่จัดการ infrastructure ให้**

RDS ช่วยให้ผู้ใช้สามารถ:

- **Launch** database instances ได้ภายในไม่กี่นาที
- **Scale** compute และ storage ขึ้น/ลงตามความต้องการ
- **Automate** backups, patching, monitoring
- **Replicate** database สำหรับ high availability และ read scaling
- **Encrypt** data at rest และ in transit
- **Pay** เฉพาะสิ่งที่ใช้งานจริง

**RDS ไม่ได้จัดการ:**
- Database engine internals (query optimizer, buffer pool)
- Application-level tuning
- Database users และ permissions (ส่วนใหญ่)
- SQL queries และ schema design

---

## 2. Database Engines ที่รองรับ

RDS รองรับ 6 major database engines:

### 2.1 Amazon Aurora

**Aurora** คือ MySQL- และ PostgreSQL-compatible relational database ที่ AWS สร้างเอง ออกแบบมาเพื่อ enterprise workloads ที่ต้องการ high performance และ high availability

**Aurora vs ระบบอื่น:**

| Feature | Aurora | Standard RDS |
|---------|--------|--------------|
| **Storage** | Distributed, 6-way replication across AZs | Single-AZ (default), Multi-AZ optional |
| **Replication** | Up to 15 read replicas (MySQL), 5 (PostgreSQL) | Up to 5 read replicas |
| **Failover** | Automatic < 30 seconds typically | Automatic 1-2 minutes (Multi-AZ) |
| **Backups** | Continuous backup to S3, no performance impact | Point-in-time recovery |
| **Performance** | 5x throughput vs MySQL, 3x vs PostgreSQL (claimed) | Standard managed |
| **Serverless** | Aurora Serverless v2 | — |

Aurora มี 2 modes:
- **Aurora MySQL** — MySQL 5.7/8.0 compatible
- **Aurora PostgreSQL** — PostgreSQL 14+/15+ compatible

### 2.2 MySQL

| Version | Notes |
|---------|-------|
| **MySQL 8.0** | Current generation |
| **MySQL 5.7** | Legacy, approaching end of standard support |

**Use case:** Web applications, e-commerce, SaaS — ทำงานร่วมกับ LAMP/LEMP stack ง่าย, มี community ใหญ่

### 2.3 PostgreSQL

| Version | Notes |
|---------|-------|
| **PostgreSQL 16** | Current generation |
| **PostgreSQL 15** | Previous generation |
| **PostgreSQL 14** | Extended support |

**Use case:** Enterprise applications, geospatial (PostGIS), complex data types, JSONB, data warehousing

### 2.4 MariaDB

| Version | Notes |
|---------|-------|
| **MariaDB 10.11** | Long-term support |
| **MariaDB 10.6** | Previous LTS |
| **MariaDB 10.5** | Legacy |

**Use case:** MySQL replacement ที่ open source สมบูรณ์, backward compatible กับ MySQL

### 2.5 Oracle Database

| Edition | Licensing |
|---------|-----------|
| **Oracle Enterprise Edition** | BYOL (Bring Your Own License) |
| **Oracle Standard Edition** | BYOL |
| **Oracle Express Edition** | ฟรี, limited |

**Use case:** Enterprise applications ที่ต้องการ Oracle-specific features

### 2.6 SQL Server

| Edition | Licensing |
|---------|-----------|
| **Enterprise** | License Included หรือ BYOL |
| **Standard** | License Included หรือ BYOL |
| **Web** | License Included only |
| **Express** | ฟรี, limited |

**Use case:** Windows-centric applications, .NET stack, Microsoft ecosystem

---

## 3. ประเภท Instance (DB Instance Classes)

### 3.1 Instance Class Types

**Standard Classes (db.*):**

| Class | vCPU | Memory | مناسبสำหรับ |
|-------|------|--------|-------------|
| **db.m6i** | 2-128 | 8 GB - 512 GB | General purpose, balanced |
| **db.m5** | 2-96 | 8 GB - 384 GB | General purpose (previous gen) |
| **db.m4** | 2-16 | 16 GB - 64 GB | Legacy general purpose |
| **db.m3** | 1-8 | 3.75 GB - 32 GB | Legacy |

**Memory Optimized Classes (db.r*):**

| Class | vCPU | Memory | เหมาะสำหรับ |
|-------|------|--------|-------------|
| **db.r6i** | 2-128 | 16 GB - 1,024 GB | Memory-intensive, large buffers |
| **db.r5** | 2-96 | 16 GB - 768 GB | Memory optimized (previous gen) |
| **db.r4** | 2-16 | 15.25 GB - 122 GB | Legacy memory optimized |
| **db.x2idn / x2iedn** | 4-192 | 16 GB - 3,840 GB | Latest gen, DDR5 memory |

**Burstable Performance Classes (db.t*):**

| Class | vCPU | Memory | เหมาะสำหรับ |
|-------|------|--------|-------------|
| **db.t4g** | 1-4 | 1-16 GB | Low-traffic, development, testing |
| **db.t3** | 2-4 | 1-32 GB | Moderate usage, burstable |
| **db.t2** | 1-8 | 1-64 GB | Legacy, baseline performance |

**DB Instance Naming Convention:**
```
db.<class>.<size>.<availability zones>
ตัวอย่าง: db.r6g.large  = RDS MySQL, r6g class, large size
```

### 3.2 Instance Class Selection Guidelines

| Workload | Recommended Class |
|----------|------------------|
| **Development/Testing** | db.t3.micro, db.t4g.micro |
| **Web Application** | db.m6i.large, db.m5.large |
| **Enterprise Application** | db.r6i.xlarge ขึ้นไป |
| **OLTP High Performance** | db.r6i.2xlarge ขึ้นไป |
| **Data Warehouse / Analytics** | db.r5.4xlarge ขึ้นไป, หรือ Aurora |

---

## 4. Storage

### 4.1 Storage Types

| Type | Technology | Max Storage | Max IOPS | เหมาะสำหรับ |
|------|-----------|-------------|----------|-------------|
| **General Purpose (SSD)** | gp3 / gp2 | 64 TB | 16,000 / 3,000 | Most workloads |
| **Provisioned IOPS (SSD)** | io1 / io2 | 64 TB | 256,000 | High-performance OLTP |
| **Magnetic** | Standard | 3 TB | Slow | Legacy, rarely used |

### 4.2 Storage Details

**gp3 (Default):**
- Baseline 3,000 IOPS + 125 MB/s throughput
- สามารถ provision เพิ่ม IOPS ได้ถึง 16,000 โดยไม่ต้อง provision storage เพิ่ม
- ราคาถูกกว่า gp2 สำหรับ workload ที่ต้องการ IOPS สูง

**gp2:**
- Burst ได้ถึง 3,000 IOPS (ขึ้นอยู่กับ storage size)
- 1 GB = 3 IOPS สะสม
- ยิ่งใหญ่ยิ่งมี IOPS สูงขึ้น

**io1 / io2 (Provisioned IOPS SSD):**
- สามารถ provision IOPS แยกจาก storage size
- 50 IOPS ต่อ GB (io1), 500 IOPS ต่อ GB (io2)
- ใช้สำหรับ mission-critical, high-transaction workloads

### 4.3 Storage Scaling

- **Storage สามารถ scale up ได้โดยไม่มี downtime** (ในขณะที่ instance class ต้อง reboot)
- **Scale down ไม่ได้** — cannot reduce allocated storage
- **Maximum storage threshold** — ต้อง set ตอนสร้าง ถ้าต้องการใช้ storage มากขึ้นต้อง modify

---

## 5. High Availability (Multi-AZ)

### 5.1 Multi-AZ Deployment

Multi-AZ สร้าง standby replica ใน AZ อื่นเพื่อ redundancy:

**How it works:**
1. Primary DB instance ใน AZ-1
2. Standby replica ใน AZ-2 (synchronous replication)
3. เมื่อ failover เกิดขึ้น → DNS ชี้ไปที่ standby

**Features:**
- **Automatic failover** — เมื่อ primary down, RDS ทำ failover อัตโนมัติ (1-2 นาที)
- **Zero data loss** — synchronous replication ทำให้ไม่มี data loss
- **Read IP คงเดิม** — connection string เหมือนเดิมหลัง failover
- **No manual intervention** — ทุกอย่าง automatic

**Supported engines:** MySQL, PostgreSQL, MariaDB, Oracle, SQL Server

**Not supported:** Aurora (มี own HA mechanism), SQL Server DB Mirroring

### 5.2 Read Replicas

Read Replicas ช่วย scale read operations ขึ้น:

**MySQL/MariaDB/PostgreSQL:**
- Up to **5** direct Read Replicas
- Replicas สามารถมี Read Replicas ของตัวเองได้ (chain, max 3 layers)

**Aurora:**
- Up to **15** Read Replicas (MySQL), **5** (PostgreSQL)
- Replicas สามารถ promoted เป็น primary ได้ในกรณี failover

**Replication types:**

| Type | Sync | Latency | Use Case |
|------|------|---------|----------|
| **Asynchronous** | eventual consistency | low | Standard read scaling |
| **Synchronous** (Multi-AZ) | strong consistency | near-zero | HA/DR |

**Cross-Region Read Replicas:**
- สร้าง Read Replica ใน region อื่นได้
- ใช้สำหรับ disaster recovery, migration
- **MySQL/MariaDB:** supported
- **PostgreSQL:** supported (PostgreSQL 9.3+)

### 5.3 Aurora High Availability

Aurora ใช้ architectural ที่ต่างจาก standard RDS:

**Storage Layer:**
- Data ถูก replicate 6 copies ไปยัง 3 AZs (3 copies ในแต่ละ AZ)
- **Storage Auto-Sealing** — 10 GB segments, automatically replicate and repair
- **Self-healing** — continuous scanning หา corrupted data และ repair อัตโนมัติ

**Primary + Replicas:**
- Primary รับ write + read traffic
- Replicas รับ read-only traffic
- **Automatic failover** ไปยัง replica ใน AZ อื่น (< 30 seconds)
- **Failover ไม่ต้อง rebuild** — data อยู่ใน storage layer อยู่แล้ว

**Aurora Endpoints:**

| Endpoint | คำอธิบาย |
|----------|---------|
| **Cluster Endpoint** | Points to primary — use for writes |
| **Reader Endpoint** | Load-balanced across all replicas — use for reads |
| **Custom Endpoint** | User-defined — เลือก subset ของ instances |
| **Instance Endpoint** | เฉพาะ instance เดียว |

---

## 6. Backup และ Recovery

### 6.1 Automated Backups

**Daily backup windows:**
- RDS ทำ automated backup ทุกวัน during preferred maintenance window
- Backup retention: 1-35 days (configurable)
- **Point-in-time recovery (PITR):** กู้คืนได้ถึง any point within retention period

**How it works:**
- Full daily backup + transaction logs (WAL for PostgreSQL, binary log for MySQL)
- เก็บ incremental changes ตลอดวัน
- **No impact on performance** — backup ทำโดย separate process

### 6.2 Manual Snapshots

**DB Snapshots:**
- User-initiated manual snapshots
- **Retained until deleted manually**
- สามารถ copy ข้าม regions ได้
- สามารถ share กับ other AWS accounts ได้

**Aurora Backups:**
- Continuous backup to S3
- ไม่มี performance impact
- Backup retention: 1-35 days
- **Instant restore** จาก S3

### 6.3 Restore Process

**Standard RDS (MySQL/PostgreSQL/MariaDB):**
```
1. เลือก backup หรือ snapshot
2. RDS สร้าง new DB instance (คนละ instance)
3. Data ถูก restore ไปยัง new instance
4. Update connection strings ไปยัง new instance
```

**Aurora:**
```
1. เลือก point-in-time หรือ snapshot
2. Aurora clone storage volume ทันที
3. New DB cluster ready ใน minutes
4. Much faster than standard RDS restore
```

### 6.4 Backtrack (Aurora MySQL)

Aurora MySQL มี **backtrack feature** — ย้อนกลับ database ไปยัง specific point โดยไม่ต้อง restore:

- **Instant** — ไม่ต้อง provision new resources
- **Rewind ย้อนกลับได้ถึง** configured window (ถึง 72 hours)
- ใช้สำหรับ "oops" moments, accidental deletes

### 6.5 Restore to Point-in-Time Across Regions

- Standard RDS: Restore from snapshot to new instance (สามารถเลือก region ใหม่ได้)
- Cross-region PITR: Copy snapshot ไป region ใหม่ แล้ว restore

---

## 7. Security

### 7.1 Encryption

**Encryption at Rest:**
- **AWS KMS** — ใช้ KMS keys (AWS-managed หรือ CMK)
- Enable at creation time — **cannot enable หลังจากสร้างแล้ว** (ต้องสร้างใหม่)
- Encrypted: data files, logs, snapshots, backups, read replicas

**Encryption at Rest ราคา:**
- Aurora: ฟรี (included)
- MySQL/PostgreSQL/MariaDB: $0.20 per GB-month (KMS)
- Oracle/SQL Server: รวมใน license

**Encryption in Transit:**
- **SSL/TLS** connections ระหว่าง application และ RDS
- MySQL/PostgreSQL: `requireSSL` parameter
- Aurora: TLS ถูก enforce โดย default
- SQL Server: Force SSL on server

### 7.2 IAM Authentication

RDS รองรับ **IAM database authentication:**

- ใช้ IAM users/roles แทน database passwords
- Authentication ผ่าน auth token (ถูก expire หลัง 15 นาที)
- **Supported:** MySQL, PostgreSQL, Aurora
- **Not supported:** MariaDB, Oracle, SQL Server

**Benefits:**
- ไม่ต้อง manage database passwords
- ใช้ IAM policies ควบคุม access ง่าย
- Audit ง่ายผ่าน CloudTrail

### 7.3 VPC และ Security Groups

**VPC Requirements:**
- RDS instances ต้องอยู่ใน VPC (default VPC หรือ custom VPC)
- **ไม่สามารถอยู่นอก VPC ได้** (ClassicLink ถูก deprecated)

**Security Groups:**
- **Inbound:** RDS port (3306 MySQL, 5432 PostgreSQL, etc.)
- **Source:** มาจาก EC2 instances ที่ต้องการ access
- **Stateful:** outbound automatic

### 7.4 Network Isolation: Private Subnets

**Best Practice Architecture:**
```
VPC
├── Public Subnet (Application tier)
│   └── EC2 Instances
└── Private Subnets (Data tier)
    ├── RDS Primary (AZ-1)
    ├── RDS Standby (AZ-2)
    └── ElastiCache Redis
```

### 7.5 RDS Proxy

**RDS Proxy** คือ fully managed database proxy:

**Benefits:**
- **Connection pooling** — reduce connection overhead ( hundreds → dozens)
- **Automatic failover** — application ไม่ต้อง handle failover manually
- **IAM authentication** — ใช้ IAM แทน passwords
- **TLS/SSL** — encrypt connections อัตโนมัติ

**Supported engines:** Aurora, MySQL, PostgreSQL, MariaDB

**Use cases:**
- Serverless (Lambda) connecting to RDS
- Applications that open/close many connections
- Connection limit issues

### 7.6 Kerberos Authentication

- AWS Directory Service for Microsoft AD สำหรับ Kerberos
- ใช้ Windows Active Directory credentials
- **Supported:** SQL Server, Oracle

---

## 8. Monitoring และ Logging

### 8.1 Amazon CloudWatch Metrics

**Free Metrics (ทุก RDS):**

| Metric | คำอธิบาย |
|--------|---------|
| **CPUUtilization** | CPU usage % |
| **DatabaseConnections** | Number of connections |
| **FreeableMemory** | Available RAM |
| **FreeStorageSpace** | Available storage |
| **DiskQueueDepth** | I/O wait (higher = bottleneck) |
| **ReadIOPS / WriteIOPS** | I/O operations per second |
| **ReadLatency / WriteLatency** | I/O latency in ms |
| **NetworkReceiveThroughput** | Network inbound |
| **NetworkTransmitThroughput** | Network outbound |
| **BurstBalance** | gp2 burst bucket remaining % |

**Enhanced Monitoring (มีค่าใช้จ่าย):**
- OS-level metrics (process list, memory breakdown)
- Granularity: 1 second (vs 60 seconds ของ CloudWatch standard)
- Metrics จาก CloudWatch Agent ที่รันบน RDS instance

### 8.2 RDS Events

RDS publish events เมื่อเกิดการเปลี่ยนแปลง:

**Event categories:**
- `db-instance` (creation, deletion, reboot, failover, upgrade)
- `db-security-group` (changes)
- `db-parameter-group` (changes)
- `db-snapshot` (creation, deletion)
- `db-cluster` (Aurora)

**Notifications:** SNS topic subscription

### 8.3 Performance Insights

**AWS Performance Insights:**
- Visualize database performance
- Top SQL statements
- Wait events (bottleneck identification)
- **Free tier:** 7 days retention, 1 CPU equivalent
- **Paid:** longer retention, more dimensions

### 8.4 Database Log Files

| Log | Available For |
|-----|--------------|
| **Error log** | ทุก engine |
| **Slow query log** | MySQL, PostgreSQL, MariaDB |
| **General log** | MySQL |
| **Audit log** | Aurora (advanced), SQL Server |
| **PostgreSQL logs** | PostgreSQL |

**Export to CloudWatch Logs:**
```bash
# Enable via CLI
aws rds modify-db-instance \
  --db-instance-identifier my-db \
  --cloudwatch-logs-export-configuration '{"EnableLogTypes":["error","slowquery"]}'
```

### 8.5 CloudTrail Integration

- **API calls** ที่ RDS ถูก log ใน CloudTrail
- เห็น: who, when, what ของทุก RDS API call
- Default: 90 days retained in CloudTrail

---

## 9. Maintenance และ Patching

### 9.1 Auto Minor Version Upgrade

**Auto upgrade to minor versions:**
- Default: enabled
- RDS จะ upgrade minor versions อัตโนมัติ during maintenance window
- Major version upgrades: **never automatic**, must be manual

### 9.2 Preferred Maintenance Window

- Weekly scheduled maintenance window
- Default: random 30-minute window
- **ต้อง specify** during creation หรือ modify later
- **Preferred maintenance window** vs **Preferred backup window**

**Maintenance events:**
- **Operating system updates** — security patches
- **Database engine updates** — minor version upgrades
- **Instance class changes** — requires reboot
- **Multi-AZ failover** — may occur during maintenance

### 9.3 Instance Class Changes

**What happens:**
1. Standby (Multi-AZ) ถูก modify ก่อน
2. Failover เกิดขึ้น
3. Original primary ถูก modify
4. Total downtime: **3-5 นาที**

**Without Multi-AZ:**
- Single-AZ จะ reboot
- Downtime: **5-10 นาที** (ขึ้นอยู่กับ engine และ storage size)

### 9.4 Database Engine Version Management

**MySQL Version Lifecycle:**
- Each version has end-of-life date
- RDS จะ auto-deprecate versions ที่เก่า

**PostgreSQL Version Lifecycle:**
- Major versions: manual upgrades
- Minor versions: auto-upgrade if enabled

**Aurora Version Management:**
- Aurora versions ต่างจาก MySQL/PostgreSQL versions
- Aurora releases: 3.x, 2.x (not directly comparable)
- **Aurora auto-copy** ของ DB cluster parameter group

---

## 10. Parameter Groups และ Options Groups

### 10.1 DB Parameter Groups

**DB Parameter Groups** คือ configuration สำหรับ database engine:

**Static parameters** (require reboot):
- `max_connections`
- `shared_buffers`

**Dynamic parameters** (apply immediately):
- `query_cache_size` (MySQL)
- `log_output` (PostgreSQL)

**Types:**
- **Default parameter groups** — ถูกสร้างอัตโนมัติ, ไม่สามารถแก้ไข
- **Custom parameter groups** — user-created, editable

### 10.2 DB Option Groups

**DB Option Groups** ใช้ enable ฺdatabase features/options:

**MySQL/MariaDB options:**
- `MEMCACHED` — in-memory caching
- `TDE` — Transparent Data Encryption

**SQL Server options:**
- `SQLSERVER_BACKUP_RESTORE` — S3 backup/restore
- `TDE` — Transparent Data Encryption
- `SSIS` — SQL Server Integration Services

**Oracle options:**
- `NATIVE_NETWORK_ENCRYPTION`
- `Oracle Enterprise Manager`
- `APEX`

### 10.3 DB Cluster Parameter Groups (Aurora)

Aurora ใช้ **Cluster Parameter Groups** สำหรับ settings ที่ apply ทั้ง cluster:

- Parameters ที่เกี่ยวกับ cluster-wide settings (e.g., `aurora_select_into_tmp_table`)
- Instance-level parameter groups สำหรับ instance-specific settings

---

## 11. Pricing และค่าใช้จ่าย

### 11.1 Instance Pricing

**On-Demand (pay per hour):**
| Class | MySQL/PostgreSQL | Oracle (License Included) | SQL Server (Web) |
|-------|-----------------|--------------------------|-----------------|
| db.t3.micro | $0.017/hr | — | — |
| db.m5.large | $0.115/hr | $0.38/hr | $0.20/hr |
| db.r5.large | $0.19/hr | — | — |

**Reserved Instances (1-3 year):**
- Up to 69% savings vs On-Demand
- No upfront, Partial upfront, All upfront options

### 11.2 Storage Pricing

| Storage Type | ราคา (us-east-1) |
|-------------|-----------------|
| gp3 | $0.12/GB-month |
| gp2 | $0.115/GB-month |
| io1 | $0.125/GB-month + $0.10/provisioned IOPS |
| io2 | $0.125/GB-month + $0.10/provisioned IOPS |

### 11.3 Data Transfer Pricing

| Transfer | ค่าบริการ |
|----------|----------|
| **Data IN** | ฟรี |
| **Data OUT to Internet** | $0.09/GB (first 10 TB) |
| **Same-Region traffic** | ฟรี (EC2 ↔ RDS) |
| **Cross-Region Replication** | $0.02-$0.09/GB |

### 11.4 Multi-AZ Pricing

- **Multi-AZ data replication:** ฟรี (ไม่มี secondary DB charge แค่ pay สำหรับ storage)
- **แต่** — ยังต้อง pay instance ทั้งสองตัว (primary + standby)

### 11.5 Cost Optimization Strategies

1. **Right-size instances** — start small, scale up as needed
2. **Use Reserved Instances** — สำหรับ production ที่ run ตลอดเวลา
3. **Delete unused snapshots** — manual snapshots ไม่ auto-delete
4. **Use Aurora Serverless v2** — ถ้า workload ไม่แน่นอน
5. **Turn off test/development instances** — use `Stop DB instance` feature
6. **gp3 instead of gp2** — มักจะถูกกว่าสำหรับ high-IOPS workloads
7. **Monitor with Cost Explorer** — ดู trends และ anomalies

---

## 12. Use Cases หลัก

| Use Case | Recommended Config | Engine |
|----------|-------------------|--------|
| **Web Application** | db.m5.large + gp3, Multi-AZ | MySQL, PostgreSQL, Aurora |
| **E-commerce (OLTP)** | db.r5.xlarge + io1, Multi-AZ | PostgreSQL, Aurora |
| **Software as a Service (SaaS)** | Aurora MySQL/PostgreSQL, Multi-AZ | Aurora |
| **Data Warehouse / Analytics** | N/A — use Redshift | N/A |
| **Development / Testing** | db.t3.micro, no Multi-AZ | Any |
| **Enterprise ERP** | db.r5.2xlarge + Multi-AZ | Oracle, SQL Server |
| **Mobile App Backend** | Aurora Serverless v2 | Aurora |
| **Gaming** | db.r5.large + Multi-AZ | PostgreSQL, MySQL |
| **Geospatial (GIS)** | db.r5.xlarge | PostgreSQL (PostGIS) |
| **Legacy Migration** | db.r5.xlarge + Multi-AZ | Oracle, SQL Server |

---

## 13. Migration

### 13.1 AWS Database Migration Service (DMS)

**AWS DMS** คือ managed migration service ที่ช่วย migrate databases:

**Source support:**
- On-premises databases (MySQL, PostgreSQL, Oracle, SQL Server, etc.)
- Other cloud providers
- EC2-based databases
- Other RDS instances

**Target support:**
- RDS instances
- Aurora clusters
- EC2-based databases
- S3 (as a target for data lake migration)

**DMS Features:**
- **Homogeneous migrations** — same engine (Oracle → Oracle on RDS)
- **Heterogeneous migrations** — different engines (SQL Server → Aurora MySQL)
- **Ongoing replication** — CDC (Change Data Capture) for minimal downtime
- **Schema Conversion** — DMS Schema Conversion tool

**Migration types:**
| Type | Downtime | Use Case |
|------|----------|----------|
| **Full load** | High | One-time migration |
| **Full load + CDC** | Minimal | Production migration |
| **CDC only** | Near-zero | Ongoing replication |

### 13.2 Migration Strategies

**1. Backup and Restore (Native):**
```
mysqldump (MySQL)
pg_dump (PostgreSQL)
```

**2. Native Tools:**
- MySQL: `mysqldump`, MySQL Workbench, `mysqlimport`
- PostgreSQL: `pg_dump`, `pg_restore`, pgAdmin
- Oracle: Data Pump, RMAN
- SQL Server: BACPAC, native backup/restore

**3. AWS Schema Conversion Tool (SCT):**
- Convert schema from one engine to another
- Required for heterogeneous migrations
- Converts: tables, indexes, views, stored procedures, etc.

### 13.3 Best Practices for Migration

1. **Assess** — size, complexity, compatibility
2. **Validate** — test on staging environment
3. **Plan** — maintenance window, rollback plan
4. **Migrate** — full load + CDC for production
5. **Validate** — data integrity checks
6. **Cutover** — DNS/connection string update
7. **Monitor** — post-migration monitoring

---

## 14. Aurora Specific Features

### 14.1 Aurora Serverless v2

**Aurora Serverless v2** คือ on-demand, auto-scaling configuration:

- **Scale up/down** อัตโนมัติ based on workload
- **Zero compute** cost when idle (storage ยังคงมี cost)
- **ACU (Aurora Capacity Unit)** — 1 ACU ≈ 2 GB memory
- ใช้สำหรับ: intermittent, unpredictable workloads, development

**Aurora Serverless v1 (deprecated):**
- Original Serverless ถูก replace ด้วย Serverless v2
- v1: capacity scales in discrete steps, has limitations

### 14.2 Aurora Global Database

**Aurora Global Database** คือ cross-region replication:

- **Up to 5 secondary regions**
- **< 1 second replication lag** (typical)
- **Automatic failover** ไปยัง secondary region
- **Read replica** in each region
- **Use cases:** disaster recovery, global read distribution, low-latency access

### 14.3 Aurora Machine Learning

Aurora ML ช่วย run ML inference จาก database:

- **Aurora PostgreSQL:** supports SageMaker, Comprehend
- **SQL-like interface** — เรียก ML models ผ่าน SQL functions
- ใช้สำหรับ: fraud detection, sentiment analysis, recommendations

### 14.4 Aurora Backtrack ตอนที่ 2

- **Undo** ผิดพลาด (DML mistakes, accidental deletes)
- **Restore to specific LSN** or timestamp
- **No need for backups** — just rewind
- **Available:** Aurora MySQL (does not require backup retention settings)

### 14.5 Aurora Parallel Query

Aurora MySQL 8.0 มี **Parallel Query** feature:

- **Push compute to storage** — parallel query execution at storage layer
- **10x faster** สำหรับ analytical queries on large tables
- ลด movement ของ data จาก storage ไป compute layer

### 14.6 Aurora DRS (Database Replication Service)

Aurora DRS สำหรับ **continuous replication ไปยัง external MySQL:**

- Migrate from Aurora to external MySQL
- Upstream replication to on-premises
- Use for: migration out of AWS, hybrid deployments

---

## 15. RDS vs Other AWS Databases

| Service | Type | Best For |
|---------|------|----------|
| **RDS (Aurora/MySQL/PG)** | Relational | Transactional, ACID, SQL |
| **Aurora** | Relational | Enterprise, high-scale |
| **Redshift** | Analytical | Data warehouse, OLAP, analytics |
| **DynamoDB** | NoSQL (Key-Value + Document) | Serverless, massive scale, millisecond |
| **DocumentDB** | Document (MongoDB compatible) | JSON documents, flexible schema |
| **ElastiCache (Redis/Memcached)** | In-memory | Caching, sessions, real-time |
| **Neptune** | Graph | Social networks, fraud detection, knowledge graphs |
| **Timestream** | Time-series | IoT, monitoring, analytics |
| **QLDB** | Ledger | Immutable, auditable records |
| **Keyspaces** | Wide-column (Cassandra) | Cassandra workloads, massive write scale |

---

## 16. คำศัพท์และความหมาย (Glossary)

| คำศัพท์ | ความหมาย |
|---------|---------|
| **DB Instance** | Virtual database server — equivalent to a standalone database server |
| **DB Engine** | Database software type (MySQL, PostgreSQL, Oracle, SQL Server, Aurora, MariaDB) |
| **Multi-AZ** | High availability deployment — synchronous standby in another AZ |
| **Read Replica** | Read-only copy — asynchronous replica for read scaling |
| **Automated Backup** | Daily automated backups + transaction logs for point-in-time recovery |
| **DB Snapshot** | Manual, user-initiated backup — retained until deleted |
| **Parameter Group** | Collection of database engine configuration parameters |
| **Option Group** | Collection of database features/options (e.g., TDE, MEMCACHED) |
| **Subnet Group** | Collection of VPC subnets where RDS instances can be placed |
| **Security Group** | Stateful firewall — controls inbound/outbound access to RDS |
| **KMS** | AWS Key Management Service — ใช้ encrypt data at rest |
| **IAM Auth** | IAM Database Authentication — ใช้ IAM แทน password |
| **RDS Proxy** | Fully managed database proxy — connection pooling + failover |
| **Enhanced Monitoring** | OS-level metrics at 1-second granularity |
| **Performance Insights** | Database performance visualization — top SQL, wait events |
| **Backtrack** | Aurora MySQL feature — rewind database to previous point without restore |
| **Global Database** | Aurora cross-region replication — disaster recovery + global reads |
| **DMS** | Database Migration Service — migrate databases to/from AWS |
| **SCT** | Schema Conversion Tool — convert schema between database engines |
| **ACU** | Aurora Capacity Unit — unit of Aurora Serverless capacity |
| **Failover** | Automatic promotion of standby to primary — automatic for Multi-AZ |
| **CDC** | Change Data Capture — track ongoing changes for replication |
| **PITR** | Point-in-Time Recovery — restore to any point within backup retention |
| **WAL** | Write-Ahead Log — PostgreSQL transaction log |
| **Binary Log** | MySQL transaction log — used for replication and PITR |

---

## 17. ลิงค์อ้างอิง

| เนื้อหา | ลิงค์ |
|---------|------|
| **Amazon RDS User Guide** | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/ |
| **RDS Instance Classes** | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.html |
| **RDS Storage** | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Storage.html |
| **RDS Multi-AZ** | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html |
| **RDS Read Replicas** | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html |
| **RDS Backup & Restore** | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html |
| **RDS Security** | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.html |
| **RDS Encryption** | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Encryption.html |
| **RDS IAM Auth** | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAM.html |
| **RDS Proxy** | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html |
| **RDS Monitoring** | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/MonitoringOverview.html |
| **RDS Events** | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Events.html |
| **Performance Insights** | https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PerformanceInsights.html |
| **Aurora Documentation** | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/ |
| **Aurora Global Database** | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html |
| **Aurora Serverless** | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html |
| **Aurora ML** | https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-ml.html |
| **RDS Pricing** | https://aws.amazon.com/rds/pricing/ |
| **AWS DMS** | https://docs.aws.amazon.com/dms/latest/UserGuide/Welcome.html |
| **AWS SCT** | https://docs.aws.amazon.com/SchemaConversionTool/latest/userguide/What.html |
| **RDS API Reference** | https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/ |
| **RDS CLI Reference** | https://docs.aws.amazon.com/cli/latest/reference/rds/ |

---

*RDS Engines ที่มีในปี 2026: Aurora MySQL 3.x (MySQL 8.0 compatible), Aurora PostgreSQL 15+, MySQL 8.0, PostgreSQL 16, MariaDB 10.11, Oracle 19c, SQL Server 2022*

*ไฟล์นี้สร้างโดย Hermes Agent — แหล่งอ้างอิงจาก AWS Official Documentation ณ วันที่ July 2026*

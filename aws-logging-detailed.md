# AWS Logging Services — คู่มือฉบับสมบูรณ์

> แหล่งอ้างอิง: [CloudWatch Logs](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/) · [CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/) · [VPC Flow Logs](https://docs.aws.amazon.com/vpc/latest/flowlogs/) · [AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/) · [GuardDuty](https://docs.aws.amazon.com/guardduty/latest/ug/) · [Security Hub](https://docs.aws.amazon.com/securityhub/latest/userguide/)

---

## 1. ภาพรวม — AWS Logging Ecosystem

AWS มี logging services หลายตัวที่ทำงานแตกต่างกัน:

| Service | ใช้สำหรับ | Log Type | Storage |
|---------|-----------|----------|---------|
| **CloudWatch Logs** | Application + System logs | Custom, agent, SDK | CloudWatch (S3-backed) |
| **CloudTrail** | API activity / Audit | Management + Data events | S3 + CloudWatch Logs |
| **VPC Flow Logs** | Network traffic | Flow records | S3 หรือ CloudWatch |
| **Config** | Resource configuration | Configuration history | S3 |
| **GuardDuty** | Threat detection | Security findings | CloudWatch Events |
| **Security Hub** | Security posture | Aggregated findings | CloudWatch Events |
| **AWS WAF** | Web ACL logs | Request logs | S3 / CloudWatch Logs |
| **ELB Access Logs** | Load balancer traffic | Access logs | S3 |
| **CloudFront Logs** | CDN / Edge | Access logs | S3 |

**3 ประเภท log หลักใน AWS:**

1. **Audit Logs** — WHO did WHAT and WHEN (CloudTrail)
2. **Performance/Application Logs** — Application output, metrics (CloudWatch Logs)
3. **Network Flow Logs** — VPC traffic (VPC Flow Logs)

---

## 2. Amazon CloudWatch Logs

### 2.1 ความเข้าใจพื้นฐาน

CloudWatch Logs คือ **centralized logging service** สำหรับ:

- **Application logs** — logs จาก application code
- **System logs** — OS-level logs (via CloudWatch Agent)
- **Custom logs** — ไฟล์ log ที่มีอยู่แล้วบน server
- **Container logs** — Docker, ECS, EKS
- **Lambda logs** — automatically published

**Key Concepts:**

| Concept | ความหมาย |
|---------|---------|
| **Log Event** | single log record — timestamp + message |
| **Log Stream** | sequence of log events จาก single source (e.g., one EC2 instance) |
| **Log Group** | collection of log streams — set retention, encryption, access policy |
| **Metric Filter** | pattern ที่ extract metrics จาก log events |
| **Insights** | query language สำหรับ analyze logs |

### 2.2 Log Groups

**Log Group** คือ container หลัก:

- **Retention:** 1 day → 10 years (configurable per group)
- **Encryption:** KMS สำหรับ encrypt at rest
- **Monitoring:** CloudWatch contributor insights
- **Cost:** $0.76 per GB ingested (us-east-1), $0.03 per GB archived (S3)

**Default Limits:**
| Resource | Limit |
|----------|-------|
| Log groups per account | 10,000 (soft) |
| Log streams per group | 10,000 (soft) |
| Log events per second | 5,000 (soft) |
| Log event size | 256 KB max |

### 2.3 CloudWatch Agent

CloudWatch Unified Agent เก็บ system-level metrics + logs:

**Metrics ที่ collect (System-level):**
- CPU (steal, idle, user, system)
- Memory (available, cached, total, used)
- Disk (free, total, used) — per disk
- Disk I/O (ops, read, write bytes) — per disk
- Net (packets, bytes in/out, errors) — per interface
- Processes (running, sleeping, zombie)
- **RAM used %** (custom metric via agent)
- **Disk used %** (custom metric via agent)

**Install & Configure:**
```bash
# Install
sudo yum install amazon-cloudwatch-agent   # Amazon Linux / RHEL / CentOS
sudo apt-get install amazon-cloudwatch-agent   # Ubuntu / Debian

# Create config file
sudo vi /opt/aws/amazon-cloudwatch-agent/bin/config.json

# Start agent
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json
```

**Agent Config Structure:**
```json
{
  "agent": {
    "run_as_user": "cwagent"
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/syslog",
            "log_group_name": "/aws/ec2/syslog",
            "log_stream_name": "{instance_id}"
          }
        ]
      }
    }
  },
  "metrics": {
    "namespace": "CWAgent",
    "metrics_collection_interval": 60,
    "append_dimensions": {
      "InstanceId": "${aws:InstanceId}"
    }
  }
}
```

### 2.4 Metric Filters

Extract numeric data จาก log events:

```bash
# Example: count HTTP 500 errors from Apache access log
# Pattern: [ip, user, timestamp, request, status=500, ...]

# Create via AWS Console:
# Filter pattern: [ip, -, user, timestamp, request, status_code=500, ...]
```

**Metric Filter vs CloudWatch Embedded Metric Format (EMF):**
- **Metric Filter** — historical, parse existing logs
- **EMF** — for high-cardinality, embedded metric format (better for microservices)

### 2.5 CloudWatch Logs Insights

Query language สำหรับ analyze logs:

```sql
# Count errors by status code
fields @timestamp, @message
| filter statusCode >= 500
| stats count(*) as errorCount by statusCode
| sort errorCount desc
| limit 10

# Latency analysis
fields @message
| filter requestPath like /api/orders
| parse @message /responseTime=(\d+)ms/ as latency
| stats avg(latency), max(latency), pct(latency, 95) by bin(5m)

# Parse JSON logs
fields @message
| parse @message '{"level":"*","msg":"*"}' as level, msg
| filter level = "ERROR"
| sort @timestamp desc
```

**Supported Logs:** CloudWatch Logs, S3 (JSON/CSV), Kinesis Data Firehose

### 2.6 CloudWatch Subscription Filters

Real-time log processing — stream logs ไป services อื่น:

| Destination | Use Case |
|-------------|----------|
| **Kinesis Data Firehose** | Near-real-time delivery to S3, Elasticsearch, Splunk |
| **Kinesis Data Streams** | Real-time processing, custom consumers |
| **Lambda** | Custom processing, alerting, transformations |

**Kinesis Firehose → S3 (OpenSearch Serverless):**
```
CloudWatch Logs → Subscription Filter → Kinesis Firehose → S3 (raw) + OpenSearch (searchable)
```

### 2.7 Cross-Account Logging

**Cross-Account Observability (2023):**
- Centralized log group in one account
- Other accounts stream to it via subscription filters
- Single dashboard view across accounts
- Use Resource Access Manager (RAM) to share

### 2.8 Live Tail

Real-time log streaming in Console — equivalent to `tail -f` in terminal:

```bash
# CLI equivalent
aws logs tail <log-group-name> --follow
```

### 2.9 Cost Optimization

| Strategy | รายละเอียด |
|----------|-----------|
| **Set retention** | Don't keep logs forever unless needed |
| **Filter what you ingest** | Use metric filters to only extract what matters |
| **Compression** | Kinesis Firehose compresses before S3 |
| **Tiered storage** | Infrequent Access tier for older logs |
| **Export to S3** | Batch export then delete from CloudWatch |

---

## 3. AWS CloudTrail

### 3.1 ความเข้าใจพื้นฐาน

**CloudTrail** คือ **API activity logging / audit trail service**:

- **Records WHO made WHAT, WHEN, and FROM WHERE**
- **Logs all AWS API calls** — console, CLI, SDKs
- **Not real-time** — typically delivered within 15 minutes
- **Immutable** — logs cannot be modified or deleted (S3 Object Lock)

**CloudTrail vs CloudWatch Logs:**

| Aspect | CloudTrail | CloudWatch Logs |
|--------|-----------|-----------------|
| **Primary purpose** | Audit / Governance | Application + System logs |
| **Records** | AWS API calls | Custom application output |
| **Delivery delay** | ~15 minutes | Near real-time |
| **Storage** | S3 (primary) + CloudWatch Logs | CloudWatch Logs |
| **Cost** | First copy free, $2.00/100k events after | Per GB ingested + stored |
| **Integrity** | SHA-256 digest files | Digest files for integrity |

### 3.2 Event Types

**Management Events (formerly Control Plane):**
- Creating, modifying, deleting AWS resources
- e.g., `CreateBucket`, `RunInstances`, `DeleteDBInstance`
- **Logged by default** in all regions

**Data Events (formerly Data Plane):**
- Operations on data within a service
- e.g., `GetObject`, `PutObject`, `SelectObjectContent`
- **NOT logged by default** — need to explicitly enable
- Higher cost ($0.10/100k events vs $2.00/100k for management)

**Insight Events:**
- Anomaly detection in API activity
- Detects unusual API call patterns
- e.g., spike in `Delete*` operations, `StopInstances` outside business hours

### 3.3 Trail Configuration

**Single-Region Trail vs All-Regions Trail:**

| Type | Coverage |
|------|---------|
| **Single-Region** | One region only |
| **All-Regions** | All regions, can create organizational trail |
| **Organization Trail** | Logs across all accounts in AWS Organization |

**S3 Data Events Setup:**
```
# Enable S3 data events for specific bucket
aws cloudtrail put-event-selector \
  --name my-trail \
  --s3-bucket-name my-bucket \
  --s3-prefix "logs/" \
  --event-selectors '[{"ReadWriteType": "All", "Type": "S3"}]'
```

### 3.4 Log File Structure

CloudTrail delivers JSON log files to S3:

```json
{
  "Records": [
    {
      "eventVersion": "1.08",
      "userIdentity": {
        "type": "IAMUser",
        "principalId": "AIDAXXXXXXXXXX",
        "arn": "arn:aws:iam::123456789012:user/admin",
        "accountId": "123456789012",
        "userName": "admin"
      },
      "eventTime": "2026-07-07T12:00:00Z",
      "eventSource": "ec2.amazonaws.com",
      "eventName": "RunInstances",
      "awsRegion": "us-east-1",
      "sourceIPAddress": "203.0.113.42",
      "userAgent": "aws-cli/2.0",
      "requestParameters": {
        "instanceType": "t3.micro",
        "maxCount": 1
      },
      "responseElements": {
        "instances": [{"instanceId": "i-0123456789abcdef0"}]
      },
      "requestID": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
      "eventID": "a1b2c3d4-5678-90ab-cdef-1234567890ab",
      "readOnly": false,
      "eventType": "AwsApiCall",
      "managementEvent": true,
      "recipientAccountId": "123456789012",
      "vpcEndpointId": "vpce-0123456789abcdef0"
    }
  ]
}
```

### 3.5 CloudTrail Lake

**CloudTrail Lake** คือ data lake สำหรับ CloudTrail events:

- **Convert existing trails** to CloudTrail Lake query format
- **SQL queries** on CloudTrail data
- **Integrate with Athena** for cross-service analysis
- **Event data stores** — configurable retention (up to 7 years)
- **Cross-account queries** — query across accounts

```sql
-- Example: Find all failed console logins
SELECT eventTime, userIdentity.userName, sourceIPAddress, errorCode
FROM my_event_data_store
WHERE eventName = 'ConsoleLogin'
  AND additionalEventData.LoginResult = 'Failed'
ORDER BY eventTime DESC
```

### 3.6 CloudTrail vs AWS Config

| Aspect | CloudTrail | AWS Config |
|--------|-----------|-----------|
| **Records** | API calls (who did what) | Resource configurations (what is the state) |
| **Timeline** | Point-in-time (when) | Historical changes over time |
| **Coverage** | All services with API | ~200+ AWS resource types |
| **Purpose** | Security audit, forensics | Compliance, change tracking |
| **Delivery** | S3 + CloudWatch Logs | S3 (Config Rules) |

**ใช้ CloudTrail สำหรับ:** "ใครลบ RDS instance เมื่อวาน?" — "IAM user X สร้าง bucket เมื่อไหร่?"

**ใช้ AWS Config สำหรับ:** "RDS instance มี encryption enabled ตอนนี้ไหม?" — "Security group เปลี่ยนไปจากเดิมยังไง?"

### 3.7 CloudTrail Pricing

| Event Type | Free Tier | Price (after free) |
|------------|-----------|-------------------|
| **Management Events** | 1 trail × 1 region (free) | $2.00 / 100,000 events |
| **Data Events (S3)** | — | $0.10 / 100,000 events |
| **Insight Events** | — | $2.00 / 100,000 events |
| **CloudTrail Lake** | 30 GB-month | $0.023 / GB-day |

**Free Tier Included:**
- 1 trail management events in 1 region
- Management events from organizational trail in home region
- 90 days of event history (default)

---

## 4. VPC Flow Logs

### 4.1 ความเข้าใจพื้นฐาน

**VPC Flow Logs** คือ network traffic logging สำหรับ VPC:

- **Log ALL network traffic** flowing through VPC
- **Works at ENI (Elastic Network Interface) level**
- **Does NOT capture actual data/payload** — only metadata
- **99.99% availability** — near real-time

**Captured Information:**
- Source/destination IP
- Source/destination port
- Protocol (TCP/UDP/ICMP)
- Packets and bytes
- Accept/Reject status
- Timestamp

**NOT Captured:**
- Actual data/payload
- DNS query contents
- IAM role credentials in traffic
- Traffic to/from Windows activation servers
- Traffic to/from 169.254.169.254 (metadata)
- Traffic to/from Amazon DNS servers (VPC DNS)

### 4.2 Flow Log Record Format

```
<version> <account-id> <interface-id> <srcaddr> <dstaddr> <srcport> <dstport> <protocol> <packets> <bytes> <start> <end> <action> <log-status>
```

**Example:**
```
2 123456789012 eni-0a1234567890abcdef 10.0.1.201 52.95.128.69 443 443 6 1000 1000000 1623844800 1623844860 ACCEPT OK
```

**Field Descriptions:**

| Field | คำอธิบาย |
|-------|---------|
| **version** | VPC Flow Logs version (2 or 3) |
| **account-id** | AWS account ID |
| **interface-id** | ENI ID (e.g., eni-0a1234567890abcdef) |
| **srcaddr / dstaddr** | Source/destination IP address |
| **srcport / dstport** | Source/destination port |
| **protocol** | IANA protocol number (6=TCP, 17=UDP, 1=ICMP) |
| **packets** | Packets transferred |
| **bytes** | Bytes transferred |
| **start** | Unix timestamp (start of flow) |
| **end** | Unix timestamp (end of flow) |
| **action** | ACCEPT (allowed by SG/NAC) or REJECT (blocked) |
| **log-status** | OK, NODATA, SKIPDATA |

### 4.3 Flow Log Versions

| Version | Difference |
|---------|-----------|
| **v2 (default)** | Basic fields |
| **v3** | Adds direction field (SRC/DST) and logging interval |
| **v4** | Adds version field in front, more consistent |
| **v5** | Adds `flow-direction` and `pkt-src-aws-service` / `pkt-dst-aws-service` |

### 4.4 What Can Be Logged

**Log at 3 levels:**

| Level | What Gets Logged |
|-------|-----------------|
| **VPC** | All ENIs in VPC |
| **Subnet** | All ENIs in subnet |
| **Network Interface (ENI)** | Single ENI |

### 4.5 Traffic Types

**Log traffic accepted/rejected by security groups:**
```
ACCEPT: traffic allowed by security group rule
REJECT: traffic blocked by security group (RST, TCP FIN, or ICMP unreach)
```

**TCP flags in v5:**
- `FIN`, `SYN`, `RST`, `PSH`, `ACK`, `URG`
- Helps identify connection lifecycle issues

### 4.6 Publishing Destinations

| Destination | Use Case |
|-------------|----------|
| **S3** (default) | Long-term storage, Athena queries |
| **CloudWatch Logs** | Real-time monitoring, alarms, Insights |
| **Kinesis Data Firehose** | Near-real-time to S3, OpenSearch, Splunk |

**S3 Destination:**
```bash
# Create flow log
aws ec2 create-flow-logs \
  --resource-type VPC \
  --resource-ids vpc-0123456789abcdef0 \
  --traffic-type ACCEPT \
  --log-destination-type s3 \
  --log-destination arn:aws:s3:::my-flow-logs-bucket/prefix/ \
  --max-aggregation-interval 60-seconds
```

### 4.7 Querying with Athena

**Create table for VPC Flow Logs in Athena:**
```sql
CREATE EXTERNAL TABLE IF NOT EXISTS vpc_flow_logs (
  version int,
  account_id string,
  interface_id string,
  srcaddr string,
  dstaddr string,
  srcport int,
  dstport int,
  protocol int,
  packets bigint,
  bytes bigint,
  start int,
  end int,
  action string,
  log_status string
)
PARTITIONED BY (year string, month string, day string)
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ' '
LOCATION 's3://my-flow-logs-bucket/prefix/AWSLogs/123456789012/vpcflowlogs/'
TBLPROPERTIES ('skip.header.line.count'='1')
```

**Query examples:**
```sql
-- Top talkers by bytes
SELECT srcaddr, dstaddr, SUM(bytes) as total_bytes
FROM vpc_flow_logs
WHERE year = '2026' AND month = '07'
GROUP BY srcaddr, dstaddr
ORDER BY total_bytes DESC
LIMIT 20

-- Find rejected connections
SELECT srcaddr, dstaddr, dstport, action, COUNT(*) as cnt
FROM vpc_flow_logs
WHERE action = 'REJECT' AND year = '2026' AND month = '07'
GROUP BY srcaddr, dstaddr, dstport, action
ORDER BY cnt DESC
LIMIT 20

-- SSH/RDP brute force attempts
SELECT srcaddr, COUNT(*) as attempts
FROM vpc_flow_logs
WHERE dstport IN (22, 3389)
  AND action = 'REJECT'
  AND year = '2026' AND month = '07'
GROUP BY srcaddr
ORDER BY attempts DESC
```

### 4.8 Common Use Cases

| Use Case | Query |
|---------|-------|
| **Find talkative hosts** | SUM(bytes) by srcaddr |
| **Detect brute force** | REJECT on port 22/3389 |
| **Monitor bandwidth** | AVG(bytes) by hour |
| **Find data exfiltration** | Large outbound bytes to external IPs |
| **Debug connectivity** | ACCEPT but no response (one-way) |

---

## 5. AWS Config

### 5.1 ความเข้าใจพื้นฐาน

**AWS Config** คือ **resource inventory and change tracking service**:

- **Records WHAT changed** in AWS resource configurations
- **Shows the STATE of resources** over time
- **Evaluates resources against rules** (Config Rules / Conformance Packs)
- **Does NOT record WHO made the change** (use CloudTrail for that)

**Config vs CloudTrail:**

| AWS Config | CloudTrail |
|-----------|-----------|
| Resource **configuration state** | API **calls / actions** |
| "What is the current state?" | "Who did what?" |
| Configuration changes | All management events |
| Resource-level | Event-level |
| ~200+ resource types | All AWS services |

### 5.2 Configuration Items

**Configuration Item (CI)** = point-in-time snapshot of a resource:

```json
{
  "version": "1.3",
  "accountId": "123456789012",
  "resourceType": "AWS::EC2::Instance",
  "resourceId": "i-0123456789abcdef0",
  "arn": "arn:aws:ec2:us-east-1:123456789012:instance/i-0123456789abcdef0",
  "availabilityZone": "us-east-1a",
  "resourceCreationTime": "2026-01-01T00:00:00Z",
  "configuration": {
    "instanceType": "t3.micro",
    "imageId": "ami-0abcdef1234567890",
    "keyName": "my-keypair",
    "state": { "name": "running" },
    "securityGroups": [{"groupId": "sg-01234567"}]
  },
  "supplementaryConfiguration": {},
  "tags": { "Environment": "Production" }
}
```

### 5.3 Configuration Recorder

**Configuration Recorder** คือตัวเก็บ configuration history:

- Must be started explicitly
- Can record all resources or specific types
- Records to S3 bucket (encrypted with KMS)
- Organization-wide recorder = logs from all member accounts

### 5.4 Config Rules

**AWS Config Rules** evaluate resource compliance:

| Rule Type | คำอธิบาย |
|-----------|---------|
| **AWS Managed Rules** | Pre-built rules by AWS (~100+ rules) |
| **Custom Rules** | Lambda-based rules (Config Custom Rules) |
| **Conformance Packs** | Bundle of rules (e.g., "PCI DSS") |

**Example Managed Rules:**

| Rule | Checks |
|------|--------|
| `ec2-instance-managed-by-systems-manager` | EC2 instances are managed by SSM |
| `s3-bucket-server-side-encryption-enabled` | S3 buckets have SSE enabled |
| `iam-user-mfa-enabled` | IAM users have MFA enabled |
| `rds-instance-deletion-protection-enabled` | RDS has deletion protection |
| `vpc-flow-logs-enabled` | VPC has flow logs enabled |
| `restricted-common-ports` | Security groups don't open common ports |

**Remediation:**
- **AWS Config Auto Remediation** — automatic fix via SSM Automation
- Remediation action options: SSM Document, Lambda, API call

### 5.5 Conformance Packs

**Conformance Pack** = collection of Config Rules + remediations:

| Pack | Framework |
|------|----------|
| **Operational Best Practices** | CIS AWS Foundations |
| **PCI DSS** | Payment Card Industry |
| **AWS Best Practices Framework** | General security |

**Deploy via CloudFormation template:**
```
aws configservice put-conformance-pack \
  --conformance-pack-name my-conformance-pack \
  --template-body file://path/to/pack.yaml \
  --delivery-s3-bucket my-config-bucket
```

### 5.6 Config Dashboard

**AWS Config Dashboard shows:**
- Compliant vs Non-compliant resources
- Resource count by type
- Trend of compliance over time
- Discovered resources timeline

---

## 6. Amazon CloudWatch Metrics & Alarms

### 6.1 CloudWatch Metrics

**CloudWatch Metrics** คือ time-series data points:

- Metrics are organized by **Namespace** (e.g., `AWS/EC2`, `AWS/RDS`)
- Each metric has **Dimensions** (e.g., InstanceId, AvailabilityZone)
- **Resolution:** Standard (5-minute) vs High (1-minute, extra cost)
- **Retention:** 15 days (high res) / 63 days (5-min) / 455 days (1-hour aggregated)

**EC2 Instance Metrics (via CloudWatch Agent):**

| Metric | คำอธิบาย |
|--------|---------|
| `CPUUtilization` | CPU usage % |
| `MemoryUtilization` | RAM used % |
| `DiskSpaceUtilization` | Disk used % |
| `DiskReadBytes` | Disk read throughput |
| `DiskWriteBytes` | Disk write throughput |
| `NetworkIn` | Network bytes received |
| `NetworkOut` | Network bytes sent |

**Native EC2 Metrics (basic — no agent):**
- `CPUUtilization`, `NetworkIn`, `NetworkOut`, `DiskReadBytes`, `DiskWriteBytes`
- Only available when instance is running

### 6.2 CloudWatch Alarms

**Alarm States:**
- **OK** — metric within threshold
- **INSUFFICIENT_DATA** — not enough data yet
- **ALARM** — metric exceeded threshold

**Alarm Actions:**
- **Amazon SNS** — send notification
- **Auto Scaling** — trigger scaling action
- **EC2 Actions** — stop/terminate/reboot instance
- **Systems Manager** — run automation

**Alarm Configuration:**
```bash
# Example: Alarm when CPU > 80% for 3 consecutive datapoints
aws cloudwatch put-metric-alarm \
  --alarm-name high-cpu-alarm \
  --metric-name CPUUtilization \
  --namespace AWS/EC2 \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 3 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:my-topic
```

### 6.3 Composite Alarms

Combine multiple alarms with logical expressions:

```
ALARM(CPU) OR ALARM(Memory) → Notify immediately
ALARM(CPU) AND ALARM(Memory) → Critical alert
```

---

## 7. Amazon GuardDuty

### 7.1 ความเข้าใจพื้นฐาน

**GuardDuty** คือ **managed threat detection service**:

- Uses **Machine Learning + threat intelligence** to analyze logs
- **No agents needed** — reads CloudTrail, VPC Flow Logs, DNS logs
- **Findings** = security anomalies (not raw logs)
- **Automated remediation** via EventBridge rules

### 7.2 Data Sources

| Source | Log Type | What It Sees |
|--------|----------|-------------|
| **CloudTrail** | Management events | API calls, suspicious activity |
| **VPC Flow Logs** | Network traffic | Lateral movement, exfiltration |
| **DNS Logs** | DNS queries | C2 communication, cryptomining |
| **S3 Logs** | Data events | Data exfiltration, bucket enumeration |

**Enable S3 Protection separately:**
```bash
aws guardduty enable-organization-configuration \
  --feature-names S3_DATA_EVENTS
```

### 7.3 Finding Types

**High Severity:**
| Finding | หมายถึง |
|---------|--------|
| **Credential Access** | Suspicious credential harvesting |
| **Impact** | Data destruction, crypto mining |
| **Exfiltration** | Data leaving account |

**Medium Severity:**
| Finding | หมายถึง |
|---------|--------|
| **Reconnaissance** | Port scanning, DNS tunneling |
| **Pentration** | Compromised credentials used |

### 7.4 GuardDuty Pricing

| Data Source | Free Tier | Price |
|-------------|-----------|-------|
| CloudTrail Events | 30 days free | $0.000002 per event |
| VPC Flow Logs | 30 days free | $0.0015 per 1000 GB |
| DNS Logs | 30 days free | $0.000002 per event |
| S3 Protection | 30 days free | $0.000001 per object |

---

## 8. AWS Security Hub

### 8.1 ความเข้าใจพื้นฐาน

**Security Hub** คือ **security posture management / aggregator**:

- **Aggregates findings** from multiple AWS security services:
  - GuardDuty (threats)
  - Macie (S3 data)
  - Config (compliance)
  - Inspector (vulnerabilities)
  - IAM Access Analyzer
  - Detective
- **Cross-service correlation** of findings
- **Compliance checks** against standards (CIS, PCI, AWS FSBP)

### 8.2 Standards

| Standard | Description |
|---------|-----------|
| **CIS AWS Foundations** | Center for Internet Security benchmarks |
| **PCI DSS** | Payment Card Industry Data Security Standard |
| **AWS FSBP** | AWS Foundational Security Best Practices |
| **NIST** | National Institute of Standards and Technology |

### 8.3 Security Hub vs GuardDuty

| Aspect | GuardDuty | Security Hub |
|--------|-----------|-------------|
| **Purpose** | Threat detection | Security posture |
| **Output** | Findings (anomalies) | Findings + compliance |
| **Data sources** | CloudTrail, Flow Logs, DNS | Aggregates GuardDuty + others |
| **Custom rules** | No | Via Config Rules + EventBridge |

---

## 9. AWS CloudWatch vs CloudTrail vs VPC Flow Logs — เปรียบเทียบ

| Aspect | CloudWatch Logs | CloudTrail | VPC Flow Logs |
|--------|----------------|-----------|----------------|
| **Purpose** | Application/System logs | API audit trail | Network traffic |
| **Records** | Custom log events | API calls | Network flow metadata |
| **Delivery** | Near real-time | ~15 min delay | Near real-time |
| **Scope** | Application + OS | All AWS API calls | VPC network |
| **Storage** | CloudWatch Logs | S3 + CloudWatch | S3 / CloudWatch |
| **Searchable** | Yes (Insights) | Via Athena / Lake | Via Athena |
| **Cost** | Per GB ingested | First copy free | Per GB processed |
| **Agent required?** | Yes (for OS logs) | No | No |
| **Default enabled?** | No | Yes (90-day history) | No |

**Use Cases แยกกัน:**

```
CloudTrail  → "ใครลบ security group เมื่อเช้า?"
CloudWatch  → "Application error log มี error อะไรบ้าง?"
VPC Flow Logs → "มี traffic ผิดปกติไหม? มีใครพยายามเข้าพอร์ต 22 ไหม?"
```

---

## 10. Integration Patterns — วิธีใช้ร่วมกัน

### 10.1 Centralized Logging Architecture

```
EC2 Instances (CloudWatch Agent)
    ↓
CloudWatch Logs (per account / per environment)
    ↓ (Subscription Filters)
Kinesis Data Firehose
    ↓
S3 (raw) + OpenSearch (searchable)
    ↓ (for analysis)
CloudWatch Insights / Athena
```

### 10.2 Security Logging Architecture

```
CloudTrail (Management + Data Events)
    ↓
S3 (immutable with Object Lock)
    ↓
CloudWatch Logs (real-time alerts)
    ↓
EventBridge Rules → SNS → Lambda (automated response)
    ↓
GuardDuty (threat analysis)
    ↓
Security Hub (aggregated findings)
```

### 10.3 Multi-Account Logging

**AWS CloudFormation StackSets + AWS Organizations:**

```
Organization Root
├── Security Account (Security Tooling)
│   ├── CloudTrail (Organization Trail)
│   ├── GuardDuty (Master)
│   ├── Security Hub (Master)
│   └── Config Aggregator
│
├── Dev Account
│   └── CloudWatch Agent → CloudWatch Logs → Kinesis Firehose → Security S3
│
├── Prod Account
│   └── CloudWatch Agent → CloudWatch Logs → Kinesis Firehose → Security S3
```

### 10.4 Log Analysis with Athena

**Unified table for CloudTrail + VPC Flow Logs:**
```sql
-- Correlate API activity with network traffic
SELECT c.eventTime, c.userIdentity.userName, c.eventName,
       v.srcaddr, v.dstaddr, v.bytes
FROM cloudtrail_logs c
JOIN vpc_flow_logs v
  ON c.eventTime = v.start
WHERE c.eventName = 'PutObject'
  AND v.dstaddr LIKE '10.0.%'
```

---

## 11. AWS WAF & Shield Logs

### 11.1 AWS WAF Logging

**AWS WAF** logs บันทึก requests ที่ match Web ACL rules:

- **S3 as destination** — logs stored in S3 bucket
- **CloudWatch Logs** — real-time logging (extra cost)
- **Kinesis Firehose** → S3 + OpenSearch / Splunk

**Logged Information:**
- Request timestamp
- Client IP
- Country
- Matched rule (if any)
- Action taken (ALLOW/BLOCK/COUNT)
- Request headers

### 11.2 ELB Access Logs

**Application/Network Load Balancer Access Logs:**

- **Stored in S3** — must be enabled per ALB
- **Interval:** 5 minutes or 60 minutes (per request)
- **Format:** gzip-compressed JSON
- **Path:** `s3://bucket/prefix/AWSLogs/account-id/elasticloadbalancing/region/`

**CloudWatch Alarm on ELB 5xx:**
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name high-elb-5xx \
  --namespace AWS/ApplicationELB \
  --metric-name HTTPCode_Target_5XX_Count \
  --dimensions Name=LoadBalancer,Value=app/my-alb/1234567890 \
  --statistic Sum \
  --period 300 \
  --threshold 100 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

### 11.3 CloudFront Access Logs

- **Real-time** — logs streamed to S3
- **Standard logs** — delivered within 24 hours
- **Realtime logs** — via Kinesis Data Streams
- **Fields:** timestamp, IP, request, response code, referrer, user-agent

---

## 12. Amazon Detective

**Amazon Detective** คือ **investigation service**:

- **Automatically analyzes** data from GuardDuty, CloudTrail, VPC Flow Logs
- **Builds graph database** showing relationships between entities
- **Helps determine root cause** of security findings
- **No agents or logs to ingest** — uses existing GuardDuty/CloudTrail data
- **Use with GuardDuty + Security Hub** — Detective deep-dives on findings

---

## 13. AWS Macie

**Amazon Macie** คือ **data security / data loss prevention (DLP) service**:

- **Discovers and classifies** sensitive data in S3
- **Uses ML** to identify: PII, PHI, credentials, intellectual property
- **Monitors S3** — alerts on unusual access patterns or data leaks
- **Supported:** GuardDuty integration, Security Hub aggregation
- **Pricing:** $0.10 per 1000 objects analyzed

---

## 14. คำศัพท์และความหมาย (Glossary)

| คำศัพท์ | ความหมาย |
|---------|---------|
| **Log Event** | Single log record — timestamp + message |
| **Log Stream** | Sequence of log events จาก single source |
| **Log Group** | Container for log streams — set retention, encryption |
| **Metric Filter** | Pattern to extract numeric metrics from log events |
| **CloudWatch Insights** | SQL-like query language for CloudWatch Logs |
| **Subscription Filter** | Real-time log streaming to Lambda/Kinesis/Firehose |
| **CloudTrail** | API audit trail — WHO did WHAT, WHEN, WHERE |
| **Management Events** | Control plane operations (create/delete/modify) |
| **Data Events** | Data plane operations (GetObject, PutObject) |
| **Insight Events** | Anomaly detection in API activity |
| **VPC Flow Logs** | Network traffic metadata logging |
| **AWS Config** | Resource configuration state tracking |
| **Config Rules** | Compliance evaluation rules |
| **Conformance Pack** | Bundle of Config Rules + remediations |
| **GuardDuty** | ML-based threat detection |
| **Security Hub** | Security posture aggregation |
| **EMF** | Embedded Metric Format — high-cardinality metrics |
| **Athena** | SQL query on S3 data (including logs) |
| **Firehose** | Kinesis Data Firehose — delivery stream to S3/OpenSearch |
| **CloudWatch Agent** | Agent for collecting system-level metrics + logs |
| **Object Lock** | S3 feature preventing log deletion (immutable) |
| **Cross-Account** | Sharing logs across AWS accounts |
| **Master/Member** | GuardDuty/Security Hub architecture across accounts |
| **Finding** | Security anomaly detected by GuardDuty |
| **Macie** | Data discovery and classification for S3 |
| **Detective** | Investigation and root cause analysis |
| **FSBP** | Foundational Security Best Practices standard |
| **CIS** | Center for Internet Security benchmarks |

---

## 15. ลิงค์อ้างอิง

| เนื้อหา | ลิงค์ |
|---------|------|
| **CloudWatch Logs** | https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/ |
| **CloudWatch Agent** | https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/download-cloudwatch-agent.html |
| **CloudWatch Insights** | https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html |
| **CloudWatch Metrics** | https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html |
| **CloudWatch Alarms** | https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html |
| **CloudTrail** | https://docs.aws.amazon.com/awscloudtrail/latest/userguide/ |
| **CloudTrail Lake** | https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html |
| **VPC Flow Logs** | https://docs.aws.amazon.com/vpc/latest/flowlogs/ |
| **VPC Flow Logs Athena** | https://docs.aws.amazon.com/athena/latest/ug/vpc-flow-logs.html |
| **AWS Config** | https://docs.aws.amazon.com/config/latest/developerguide/ |
| **Config Rules** | https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config.html |
| **Config Conformance Packs** | https://docs.aws.amazon.com/config/latest/developerguide/conformance-packs.html |
| **GuardDuty** | https://docs.aws.amazon.com/guardduty/latest/ug/ |
| **Security Hub** | https://docs.aws.amazon.com/securityhub/latest/userguide/ |
| **Detective** | https://docs.aws.amazon.com/detective/latest/userguide/ |
| **Macie** | https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html |
| **CloudWatch Pricing** | https://aws.amazon.com/cloudwatch/pricing/ |
| **CloudTrail Pricing** | https://aws.amazon.com/cloudtrail/pricing/ |
| **Config Pricing** | https://aws.amazon.com/config/pricing/ |
| **GuardDuty Pricing** | https://aws.amazon.com/guardduty/pricing/ |
| **Security Hub Pricing** | https://aws.amazon.com/security-hub/pricing/ |
| **Athena Pricing** | https://aws.amazon.com/athena/pricing/ |
| **Kinesis Firehose** | https://docs.aws.amazon.com/firehose/latest/dev/ |

---

## 16. Quick Reference — ตารางเปรียบเทียบค่าใช้จ่าย

| Service | Free Tier | On-Demand |
|---------|-----------|-----------|
| **CloudWatch Logs** | 5 GB-month ingestion | $0.76/GB ingested |
| **CloudWatch Metrics** | 10 metrics ( detalhamento) | $0.30/metric-month |
| **CloudTrail** | 1 trail × 1 region | $2.00/100k events |
| **CloudTrail Data Events** | — | $0.10/100k events |
| **VPC Flow Logs** | — | $0.05/GB processed |
| **AWS Config** | 40k recorded resources | $0.003/config item recorded |
| **GuardDuty** | 30 days (all sources) | $0.002/event (CT), $0.0015/GB (VPC) |
| **Security Hub** | — | $0.0012/finding |
| **Detective** | — | $0.000004/event analyzed |
| **Macie** | — | $0.10/1000 objects |

---

## 17. Architecture Diagram — Centralized Logging

```
┌─────────────────────────────────────────────────────────┐
│                    AWS Cloud                             │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────────┐ │
│  │ EC2      │  │ Lambda   │  │  S3 Buckets              │ │
│  │ CloudWatch│  │ (auto)  │  │  CloudTrail, Config,     │ │
│  │ Agent    │  │ Logs     │  │  VPC Flow Logs, WAF     │ │
│  └────┬─────┘  └────┬─────┘  └──────────┬───────────────┘ │
│       │             │                    │                 │
│       └──────────┬───┘                    │                 │
│                  │                        │                 │
│       ┌──────────▼──────────┐   ┌──────────▼──────────────┐ │
│       │   CloudWatch Logs   │   │        S3               │ │
│       │   (per account)      │   │  (immutable logs)       │ │
│       └──────────┬──────────┘   └──────────┬──────────────┘ │
│                  │                          │                 │
│       ┌──────────▼──────────┐   ┌──────────▼──────────────┐ │
│       │  Kinesis Firehose   │   │  CloudWatch Logs        │ │
│       │  (real-time stream)  │──▶│  Insights               │ │
│       └──────────┬──────────┘   └─────────────────────────┘ │
│                  │                                          │
│       ┌──────────▼──────────┐                               │
│       │  S3 (raw logs)      │                               │
│       │  + OpenSearch       │                               │
│       │  (searchable)        │                               │
│       └─────────────────────┘                               │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │            Security Account (Aggregated)             │ │
│  │  CloudTrail (Org Trail)  │  GuardDuty  │  Security Hub │
│  └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

*ไฟล์นี้สร้างโดย Hermes Agent — แหล่งอ้างอิงจาก AWS Official Documentation ณ วันที่ July 2026*

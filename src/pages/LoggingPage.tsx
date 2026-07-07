import './S3Page.css'

export default function LoggingPage() {
  return (
    <div className="s3-page">
      {/* HERO */}
      <div className="s3-hero">
        <div className="badge">Observability</div>
        <h1>AWS Logging Services — คู่มือฉบับสมบูรณ์</h1>
        <p>
          ครอบคลุม CloudWatch Logs, CloudTrail, VPC Flow Logs, AWS Config,
          GuardDuty, Security Hub, WAF Logs และ architecture patterns
        </p>
        <div className="refs">
          แหล่งอ้างอิง:{' '}
          <a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/" target="_blank" rel="noopener noreferrer">
            CloudWatch Logs
          </a>{' '}
          ·{' '}
          <a href="https://docs.aws.amazon.com/awscloudtrail/latest/userguide/" target="_blank" rel="noopener noreferrer">
            CloudTrail
          </a>{' '}
          ·{' '}
          <a href="https://docs.aws.amazon.com/vpc/latest/flowlogs/" target="_blank" rel="noopener noreferrer">
            VPC Flow Logs
          </a>
        </div>
      </div>

      {/* TOC */}
      <div className="s3-toc-wrap">
        <div className="s3-toc">
          <span className="s3-toc-label">Sections</span>
          <a href="#s1">1. Overview</a>
          <a href="#s2">2. CloudWatch Logs</a>
          <a href="#s3">3. CloudTrail</a>
          <a href="#s4">4. VPC Flow Logs</a>
          <a href="#s5">5. AWS Config</a>
          <a href="#s6">6. CloudWatch Metrics</a>
          <a href="#s7">7. GuardDuty</a>
          <a href="#s8">8. Security Hub</a>
          <a href="#s9">9. เปรียบเทียบ</a>
          <a href="#s10">10. Integration</a>
          <a href="#s11">11. WAF / ELB / CloudFront</a>
          <a href="#s12">12. Detective & Macie</a>
          <a href="#s13">13. Glossary</a>
          <a href="#s14">14. ลิงค์อ้างอิง</a>
        </div>
      </div>

      {/* MAIN */}
      <div className="s3-main">

        {/* SECTION 1 */}
        <section id="s1" className="s3-section">
          <h2><span className="num">1</span> ภาพรวม — AWS Logging Ecosystem</h2>

          <h3>3 ประเภท Log หลักใน AWS</h3>
          <div className="s3-grid-3">
            <div className="s3-card">
              <h4>Audit Logs</h4>
              <p>WHO did WHAT and WHEN — CloudTrail, Config</p>
            </div>
            <div className="s3-card green">
              <h4>Application Logs</h4>
              <p>Application output, system metrics — CloudWatch Logs</p>
            </div>
            <div className="s3-card orange">
              <h4>Network Logs</h4>
              <p>VPC traffic metadata — VPC Flow Logs</p>
            </div>
          </div>

          <h3>Logging Services Overview</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Service</th><th>ใช้สำหรับ</th><th>Log Type</th><th>Storage</th></tr></thead>
              <tbody>
                <tr><td><strong>CloudWatch Logs</strong></td><td>Application + System logs</td><td>Custom, Agent, SDK</td><td>CloudWatch (S3-backed)</td></tr>
                <tr><td><strong>CloudTrail</strong></td><td>API activity / Audit</td><td>Management + Data events</td><td>S3 + CloudWatch Logs</td></tr>
                <tr><td><strong>VPC Flow Logs</strong></td><td>Network traffic</td><td>Flow records</td><td>S3 หรือ CloudWatch</td></tr>
                <tr><td><strong>Config</strong></td><td>Resource configuration</td><td>Configuration history</td><td>S3</td></tr>
                <tr><td><strong>GuardDuty</strong></td><td>Threat detection</td><td>Security findings</td><td>CloudWatch Events</td></tr>
                <tr><td><strong>Security Hub</strong></td><td>Security posture</td><td>Aggregated findings</td><td>CloudWatch Events</td></tr>
                <tr><td><strong>WAF</strong></td><td>Web ACL logs</td><td>Request logs</td><td>S3 / CloudWatch</td></tr>
                <tr><td><strong>ELB Access Logs</strong></td><td>Load balancer traffic</td><td>Access logs</td><td>S3</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 2 */}
        <section id="s2" className="s3-section">
          <h2><span className="num">2</span> Amazon CloudWatch Logs</h2>

          <h3>2.1 Key Concepts</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Concept</th><th>ความหมาย</th></tr></thead>
              <tbody>
                <tr><td><strong>Log Event</strong></td><td>single log record — timestamp + message</td></tr>
                <tr><td><strong>Log Stream</strong></td><td>sequence of log events จาก single source (e.g., one EC2)</td></tr>
                <tr><td><strong>Log Group</strong></td><td>collection of log streams — set retention, encryption</td></tr>
                <tr><td><strong>Metric Filter</strong></td><td>pattern ที่ extract metrics จาก log events</td></tr>
                <tr><td><strong>Insights</strong></td><td>SQL-like query language สำหรับ analyze logs</td></tr>
                <tr><td><strong>Subscription Filter</strong></td><td>real-time stream ไป Lambda / Kinesis / Firehose</td></tr>
              </tbody>
            </table>
          </div>

          <h3>2.2 Log Group Properties</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Property</th><th>Details</th></tr></thead>
              <tbody>
                <tr><td><strong>Retention</strong></td><td>1 day → 10 years (configurable per group)</td></tr>
                <tr><td><strong>Encryption</strong></td><td>KMS for encrypt at rest</td></tr>
                <tr><td><strong>Cost</strong></td><td>$0.76/GB ingested, $0.03/GB archived (us-east-1)</td></tr>
                <tr><td><strong>Limits</strong></td><td>10,000 log groups, 10,000 streams/group (soft limits)</td></tr>
              </tbody>
            </table>
          </div>

          <h3>2.3 CloudWatch Agent</h3>
          <p>เก็บ system-level metrics + logs จาก EC2:</p>

          <div className="s3-callout">
            <strong>Metrics ที่ collect (System-level):</strong><br />
            CPU (steal, idle, user, system) · Memory (available, cached, total, used)<br />
            Disk (free, total, used) per disk · Disk I/O per disk<br />
            Net (packets, bytes, errors) per interface · Processes (running, sleeping, zombie)
          </div>

          <h4>Installation & Configuration</h4>
<pre><code>{`# Install (Amazon Linux / RHEL / CentOS)
sudo yum install amazon-cloudwatch-agent

# Install (Ubuntu / Debian)
sudo apt-get install amazon-cloudwatch-agent

# Start agent with config
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \\
  -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/bin/config.json`}</code></pre>

          <h4>Agent Config Example</h4>
<pre><code>{`{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [{
          "file_path": "/var/log/syslog",
          "log_group_name": "/aws/ec2/syslog",
          "log_stream_name": "{instance_id}"
        }]
      }
    }
  },
  "metrics": {
    "namespace": "CWAgent",
    "metrics_collection_interval": 60,
    "append_dimensions": {
      "InstanceId": "\${aws:InstanceId}"
    }
  }
}`}</code></pre>

          <h3>2.4 CloudWatch Insights Queries</h3>
<pre><code>{`# Count errors by status code
fields @timestamp, @message
| filter statusCode >= 500
| stats count(*) as errorCount by statusCode
| sort errorCount desc

# Parse JSON logs
fields @message
| parse @message '{"level":"*","msg":"*"}' as level, msg
| filter level = "ERROR"
| sort @timestamp desc

# Latency analysis
fields @message
| parse @message /responseTime=(\\d+)ms/ as latency
| stats avg(latency), max(latency), pct(latency, 95) by bin(5m)`}</code></pre>

          <h3>2.5 Subscription Filters</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Destination</th><th>Use Case</th></tr></thead>
              <tbody>
                <tr><td><strong>Kinesis Data Firehose</strong></td><td>Near-real-time delivery to S3, OpenSearch, Splunk</td></tr>
                <tr><td><strong>Kinesis Data Streams</strong></td><td>Real-time processing, custom consumers</td></tr>
                <tr><td><strong>Lambda</strong></td><td>Custom processing, alerting, transformations</td></tr>
              </tbody>
            </table>
          </div>

          <h3>2.6 Cost Optimization</h3>
          <div className="s3-grid-2">
            <div className="s3-card">
              <h4>Reduce Ingestion</h4>
              <p>Set retention · Filter before ingest · Use metric filters wisely</p>
            </div>
            <div className="s3-card green">
              <h4>Reduce Storage</h4>
              <p>Export to S3 then delete · Infrequent Access tier · Compression via Firehose</p>
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 3 */}
        <section id="s3" className="s3-section">
          <h2><span className="num">3</span> AWS CloudTrail</h2>

          <h3>3.1 CloudTrail vs CloudWatch Logs</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Aspect</th><th>CloudTrail</th><th>CloudWatch Logs</th></tr></thead>
              <tbody>
                <tr><td><strong>Primary purpose</strong></td><td>Audit / Governance</td><td>Application + System logs</td></tr>
                <tr><td><strong>Records</strong></td><td>AWS API calls</td><td>Custom application output</td></tr>
                <tr><td><strong>Delivery delay</strong></td><td>~15 minutes</td><td>Near real-time</td></tr>
                <tr><td><strong>Storage</strong></td><td>S3 (primary) + CloudWatch Logs</td><td>CloudWatch Logs</td></tr>
                <tr><td><strong>Cost</strong></td><td>First copy free, $2.00/100k events</td><td>Per GB ingested + stored</td></tr>
              </tbody>
            </table>
          </div>

          <h3>3.2 Event Types</h3>
          <div className="s3-grid-2">
            <div className="s3-card">
              <h4>Management Events</h4>
              <p>
                Creating, modifying, deleting resources<br />
                e.g., RunInstances, CreateBucket<br />
                <strong>Logged by default</strong>
              </p>
            </div>
            <div className="s3-card orange">
              <h4>Data Events</h4>
              <p>
                Operations on data within a service<br />
                e.g., GetObject, PutObject, SelectObjectContent<br />
                <strong>NOT logged by default — enable explicitly</strong>
              </p>
            </div>
          </div>
          <div className="s3-callout green">
            <strong>Insight Events:</strong> Anomaly detection in API activity —
            detects unusual patterns เช่น spike ใน Delete* operations หรือ StopInstances นอกเวลางาน
          </div>

          <h3>3.3 Trail Configuration</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Type</th><th>Coverage</th></tr></thead>
              <tbody>
                <tr><td><strong>Single-Region</strong></td><td>One region only</td></tr>
                <tr><td><strong>All-Regions</strong></td><td>All regions, can create organizational trail</td></tr>
                <tr><td><strong>Organization Trail</strong></td><td>Logs across all accounts in AWS Organization</td></tr>
              </tbody>
            </table>
          </div>

          <h3>3.4 Log Record Example</h3>
<pre><code>{`{
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
  "requestParameters": {
    "instanceType": "t3.micro",
    "maxCount": 1
  },
  "responseElements": {
    "instances": [{"instanceId": "i-0123456789abcdef0"}]
  },
  "readOnly": false,
  "managementEvent": true
}`}</code></pre>

          <h3>3.5 CloudTrail Lake</h3>
          <p>Data lake สำหรับ CloudTrail events — query ด้วย SQL:</p>
<pre><code>{`-- Find all failed console logins
SELECT eventTime, userIdentity.userName, sourceIPAddress, errorCode
FROM my_event_data_store
WHERE eventName = 'ConsoleLogin'
  AND additionalEventData.LoginResult = 'Failed'
ORDER BY eventTime DESC`}</code></pre>

          <h3>3.6 CloudTrail vs AWS Config</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Question</th><th>Service</th></tr></thead>
              <tbody>
                <tr><td>"ใครลบ RDS instance เมื่อวาน?"</td><td>CloudTrail</td></tr>
                <tr><td>"IAM user X สร้าง bucket เมื่อไหร่?"</td><td>CloudTrail</td></tr>
                <tr><td>"RDS instance มี encryption enabled ตอนนี้ไหม?"</td><td>AWS Config</td></tr>
                <tr><td>"Security group เปลี่ยนไปจากเดิมยังไง?"</td><td>AWS Config</td></tr>
              </tbody>
            </table>
          </div>

          <h3>3.7 CloudTrail Pricing</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Event Type</th><th>Free Tier</th><th>Price (after free)</th></tr></thead>
              <tbody>
                <tr><td><strong>Management Events</strong></td><td>1 trail × 1 region</td><td>$2.00 / 100,000 events</td></tr>
                <tr><td><strong>Data Events (S3)</strong></td><td>—</td><td>$0.10 / 100,000 events</td></tr>
                <tr><td><strong>Insight Events</strong></td><td>—</td><td>$2.00 / 100,000 events</td></tr>
                <tr><td><strong>CloudTrail Lake</strong></td><td>30 GB-month</td><td>$0.023 / GB-day</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 4 */}
        <section id="s4" className="s3-section">
          <h2><span className="num">4</span> VPC Flow Logs</h2>

          <h3>4.1 ความเข้าใจพื้นฐาน</h3>
          <div className="s3-callout">
            <strong>Log ALL network traffic</strong> flowing through VPC at ENI level —
            <strong> does NOT capture actual data/payload</strong> — only metadata
          </div>

          <h3>4.2 Flow Log Record Format</h3>
<pre><code>{`<version> <account-id> <interface-id> <srcaddr> <dstaddr>
<srcport> <dstport> <protocol> <packets> <bytes>
<start> <end> <action> <log-status>

Example:
2 123456789012 eni-0a1234567890abcdef 10.0.1.201 52.95.128.69
443 443 6 1000 1000000 1623844800 1623844860 ACCEPT OK`}</code></pre>

          <h3>4.3 Field Descriptions</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Field</th><th>คำอธิบาย</th></tr></thead>
              <tbody>
                <tr><td><strong>version</strong></td><td>VPC Flow Logs version (2, 3, 4, 5)</td></tr>
                <tr><td><strong>srcaddr / dstaddr</strong></td><td>Source/destination IP address</td></tr>
                <tr><td><strong>srcport / dstport</strong></td><td>Source/destination port</td></tr>
                <tr><td><strong>protocol</strong></td><td>IANA protocol number (6=TCP, 17=UDP, 1=ICMP)</td></tr>
                <tr><td><strong>action</strong></td><td>ACCEPT (allowed) or REJECT (blocked by SG/NAC)</td></tr>
                <tr><td><strong>log-status</strong></td><td>OK, NODATA, SKIPDATA</td></tr>
              </tbody>
            </table>
          </div>

          <h3>4.4 Flow Log Versions</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Version</th><th>New Fields</th></tr></thead>
              <tbody>
                <tr><td><strong>v2</strong></td><td>Basic fields (default)</td></tr>
                <tr><td><strong>v3</strong></td><td>Adds direction field</td></tr>
                <tr><td><strong>v4</strong></td><td>Version field in front, more consistent</td></tr>
                <tr><td><strong>v5</strong></td><td>Adds flow-direction, pkt-src-aws-service, pkt-dst-aws-service</td></tr>
              </tbody>
            </table>
          </div>

          <h3>4.5 Log Levels</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Level</th><th>What Gets Logged</th></tr></thead>
              <tbody>
                <tr><td><strong>VPC</strong></td><td>All ENIs in VPC</td></tr>
                <tr><td><strong>Subnet</strong></td><td>All ENIs in subnet</td></tr>
                <tr><td><strong>Network Interface (ENI)</strong></td><td>Single ENI</td></tr>
              </tbody>
            </table>
          </div>

          <h3>4.6 Publishing Destinations</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Destination</th><th>Use Case</th></tr></thead>
              <tbody>
                <tr><td><strong>S3</strong></td><td>Long-term storage, Athena queries</td></tr>
                <tr><td><strong>CloudWatch Logs</strong></td><td>Real-time monitoring, alarms, Insights</td></tr>
                <tr><td><strong>Kinesis Data Firehose</strong></td><td>Near-real-time to S3, OpenSearch, Splunk</td></tr>
              </tbody>
            </table>
          </div>

          <h3>4.7 Create Flow Log</h3>
<pre><code>{`aws ec2 create-flow-logs \\
  --resource-type VPC \\
  --resource-ids vpc-0123456789abcdef0 \\
  --traffic-type ACCEPT \\
  --log-destination-type s3 \\
  --log-destination arn:aws:s3:::my-flow-logs-bucket/prefix/ \\
  --max-aggregation-interval 60-seconds`}</code></pre>

          <h3>4.8 Athena Query Table</h3>
<pre><code>{`CREATE EXTERNAL TABLE IF NOT EXISTS vpc_flow_logs (
  version int, account_id string, interface_id string,
  srcaddr string, dstaddr string, srcport int, dstport int,
  protocol int, packets bigint, bytes bigint,
  start int, end int, action string, log_status string
)
PARTITIONED BY (year string, month string, day string)
ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
LOCATION 's3://my-flow-logs-bucket/prefix/AWSLogs/123456789012/vpcflowlogs/'
TBLPROPERTIES ('skip.header.line.count'='1')`}</code></pre>

          <h3>4.9 Common Queries</h3>
<pre><code>{`-- Top talkers by bytes
SELECT srcaddr, dstaddr, SUM(bytes) as total_bytes
FROM vpc_flow_logs WHERE year='2026' AND month='07'
GROUP BY srcaddr, dstaddr ORDER BY total_bytes DESC LIMIT 20

-- Find rejected connections
SELECT srcaddr, dstaddr, dstport, action, COUNT(*) as cnt
FROM vpc_flow_logs
WHERE action='REJECT' AND year='2026' AND month='07'
GROUP BY srcaddr, dstaddr, dstport, action ORDER BY cnt DESC

-- SSH/RDP brute force attempts
SELECT srcaddr, COUNT(*) as attempts
FROM vpc_flow_logs
WHERE dstport IN (22, 3389) AND action='REJECT'
  AND year='2026' AND month='07'
GROUP BY srcaddr ORDER BY attempts DESC`}</code></pre>
        </section>

        <hr />

        {/* SECTION 5 */}
        <section id="s5" className="s3-section">
          <h2><span className="num">5</span> AWS Config</h2>

          <h3>5.1 AWS Config vs CloudTrail</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>AWS Config</th><th>CloudTrail</th></tr></thead>
              <tbody>
                <tr><td>Resource <strong>configuration state</strong></td><td>API <strong>calls / actions</strong></td></tr>
                <tr><td>"What is the current state?"</td><td>"Who did what?"</td></tr>
                <tr><td>Configuration changes</td><td>All management events</td></tr>
                <tr><td>~200+ resource types</td><td>All AWS services</td></tr>
              </tbody>
            </table>
          </div>

          <h3>5.2 Configuration Item (CI)</h3>
<pre><code>{`{
  "version": "1.3",
  "accountId": "123456789012",
  "resourceType": "AWS::EC2::Instance",
  "resourceId": "i-0123456789abcdef0",
  "arn": "arn:aws:ec2:us-east-1:123456789012:instance/i-0123456789abcdef0",
  "configuration": {
    "instanceType": "t3.micro",
    "imageId": "ami-0abcdef1234567890",
    "keyName": "my-keypair",
    "state": { "name": "running" },
    "securityGroups": [{"groupId": "sg-01234567"}]
  },
  "resourceCreationTime": "2026-01-01T00:00:00Z"
}`}</code></pre>

          <h3>5.3 Config Rules</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Rule</th><th>Checks</th></tr></thead>
              <tbody>
                <tr><td>ec2-instance-managed-by-systems-manager</td><td>EC2 instances are managed by SSM</td></tr>
                <tr><td>s3-bucket-server-side-encryption-enabled</td><td>S3 buckets have SSE enabled</td></tr>
                <tr><td>iam-user-mfa-enabled</td><td>IAM users have MFA enabled</td></tr>
                <tr><td>rds-instance-deletion-protection-enabled</td><td>RDS has deletion protection</td></tr>
                <tr><td>vpc-flow-logs-enabled</td><td>VPC has flow logs enabled</td></tr>
                <tr><td>restricted-common-ports</td><td>Security groups don't open common ports</td></tr>
              </tbody>
            </table>
          </div>

          <h3>5.4 Conformance Packs</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Pack</th><th>Framework</th></tr></thead>
              <tbody>
                <tr><td><strong>Operational Best Practices</strong></td><td>CIS AWS Foundations</td></tr>
                <tr><td><strong>PCI DSS</strong></td><td>Payment Card Industry</td></tr>
                <tr><td><strong>AWS FSBP</strong></td><td>AWS Foundational Security Best Practices</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 6 */}
        <section id="s6" className="s3-section">
          <h2><span className="num">6</span> CloudWatch Metrics & Alarms</h2>

          <h3>6.1 CloudWatch Metrics</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Metric</th><th>คำอธิบาย</th><th>Source</th></tr></thead>
              <tbody>
                <tr><td>CPUUtilization</td><td>CPU usage %</td><td>EC2 native</td></tr>
                <tr><td>MemoryUtilization</td><td>RAM used %</td><td>CloudWatch Agent</td></tr>
                <tr><td>DiskSpaceUtilization</td><td>Disk used %</td><td>CloudWatch Agent</td></tr>
                <tr><td>NetworkIn / NetworkOut</td><td>Network bytes</td><td>EC2 native</td></tr>
                <tr><td>DiskReadBytes / DiskWriteBytes</td><td>Disk throughput</td><td>EC2 native</td></tr>
                <tr><td>DatabaseConnections</td><td>DB connections</td><td>RDS</td></tr>
                <tr><td>DiskQueueDepth</td><td>I/O wait</td><td>EBS</td></tr>
              </tbody>
            </table>
          </div>

          <h3>6.2 Alarm States</h3>
          <div className="s3-grid-3">
            <div className="s3-card">
              <h4>OK</h4>
              <p>Metric within threshold</p>
            </div>
            <div className="s3-card orange">
              <h4>INSUFFICIENT_DATA</h4>
              <p>Not enough data yet</p>
            </div>
            <div className="s3-card green">
              <h4>ALARM</h4>
              <p>Metric exceeded threshold</p>
            </div>
          </div>

          <h3>6.3 Alarm Actions</h3>
          <ul>
            <li><strong>Amazon SNS</strong> — send notification</li>
            <li><strong>Auto Scaling</strong> — trigger scaling action</li>
            <li><strong>EC2 Actions</strong> — stop/terminate/reboot instance</li>
            <li><strong>Systems Manager</strong> — run automation</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 7 */}
        <section id="s7" className="s3-section">
          <h2><span className="num">7</span> Amazon GuardDuty</h2>

          <h3>7.1 Data Sources</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Source</th><th>Log Type</th><th>What It Sees</th></tr></thead>
              <tbody>
                <tr><td><strong>CloudTrail</strong></td><td>Management events</td><td>API calls, suspicious activity</td></tr>
                <tr><td><strong>VPC Flow Logs</strong></td><td>Network traffic</td><td>Lateral movement, exfiltration</td></tr>
                <tr><td><strong>DNS Logs</strong></td><td>DNS queries</td><td>C2 communication, cryptomining</td></tr>
                <tr><td><strong>S3 Logs</strong></td><td>Data events</td><td>Data exfiltration, bucket enumeration</td></tr>
              </tbody>
            </table>
          </div>

          <h3>7.2 Finding Types</h3>
          <div className="s3-grid-2">
            <div className="s3-card">
              <h4>High Severity</h4>
              <p>
                Credential Access — suspicious credential harvesting<br />
                Impact — data destruction, crypto mining<br />
                Exfiltration — data leaving account
              </p>
            </div>
            <div className="s3-card orange">
              <h4>Medium Severity</h4>
              <p>
                Reconnaissance — port scanning, DNS tunneling<br />
                Pentration — compromised credentials used
              </p>
            </div>
          </div>

          <h3>7.3 GuardDuty Pricing</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Data Source</th><th>Free Tier</th><th>Price</th></tr></thead>
              <tbody>
                <tr><td>CloudTrail Events</td><td>30 days free</td><td>$0.000002 per event</td></tr>
                <tr><td>VPC Flow Logs</td><td>30 days free</td><td>$0.0015 per 1000 GB</td></tr>
                <tr><td>DNS Logs</td><td>30 days free</td><td>$0.000002 per event</td></tr>
                <tr><td>S3 Protection</td><td>30 days free</td><td>$0.000001 per object</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 8 */}
        <section id="s8" className="s3-section">
          <h2><span className="num">8</span> AWS Security Hub</h2>

          <h3>8.1 Security Hub vs GuardDuty</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Aspect</th><th>GuardDuty</th><th>Security Hub</th></tr></thead>
              <tbody>
                <tr><td><strong>Purpose</strong></td><td>Threat detection</td><td>Security posture</td></tr>
                <tr><td><strong>Output</strong></td><td>Findings (anomalies)</td><td>Findings + compliance</td></tr>
                <tr><td><strong>Data sources</strong></td><td>CloudTrail, Flow Logs, DNS</td><td>Aggregates GuardDuty + others</td></tr>
                <tr><td><strong>Custom rules</strong></td><td>No</td><td>Via Config Rules + EventBridge</td></tr>
              </tbody>
            </table>
          </div>

          <h3>8.2 Aggregated Services</h3>
          <p>Security Hub aggregates findings จาก:</p>
          <ul>
            <li>GuardDuty (threats)</li>
            <li>Macie (S3 data)</li>
            <li>Config (compliance)</li>
            <li>Inspector (vulnerabilities)</li>
            <li>IAM Access Analyzer</li>
            <li>Detective</li>
          </ul>

          <h3>8.3 Standards</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Standard</th><th>Description</th></tr></thead>
              <tbody>
                <tr><td><strong>CIS AWS Foundations</strong></td><td>Center for Internet Security benchmarks</td></tr>
                <tr><td><strong>PCI DSS</strong></td><td>Payment Card Industry Data Security Standard</td></tr>
                <tr><td><strong>AWS FSBP</strong></td><td>AWS Foundational Security Best Practices</td></tr>
                <tr><td><strong>NIST</strong></td><td>National Institute of Standards and Technology</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 9 */}
        <section id="s9" className="s3-section">
          <h2><span className="num">9</span> เปรียบเทียบ CloudWatch vs CloudTrail vs VPC Flow Logs</h2>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Aspect</th><th>CloudWatch Logs</th><th>CloudTrail</th><th>VPC Flow Logs</th></tr></thead>
              <tbody>
                <tr><td><strong>Purpose</strong></td><td>Application/System logs</td><td>API audit trail</td><td>Network traffic</td></tr>
                <tr><td><strong>Records</strong></td><td>Custom log events</td><td>API calls</td><td>Network flow metadata</td></tr>
                <tr><td><strong>Delivery</strong></td><td>Near real-time</td><td>~15 min delay</td><td>Near real-time</td></tr>
                <tr><td><strong>Scope</strong></td><td>Application + OS</td><td>All AWS API calls</td><td>VPC network</td></tr>
                <tr><td><strong>Storage</strong></td><td>CloudWatch Logs</td><td>S3 + CloudWatch</td><td>S3 / CloudWatch</td></tr>
                <tr><td><strong>Searchable</strong></td><td>Yes (Insights)</td><td>Via Athena / Lake</td><td>Via Athena</td></tr>
                <tr><td><strong>Agent required?</strong></td><td>Yes (for OS logs)</td><td>No</td><td>No</td></tr>
                <tr><td><strong>Default enabled?</strong></td><td>No</td><td>Yes (90-day)</td><td>No</td></tr>
              </tbody>
            </table>
          </div>

          <h3>Quick Reference — ถามตัวเองก่อนเลือก</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Question</th><th>Answer → Service</th></tr></thead>
              <tbody>
                <tr><td>"ใครลบ security group เมื่อเช้า?"</td><td>CloudTrail</td></tr>
                <tr><td>"Application error log มี error อะไรบ้าง?"</td><td>CloudWatch Logs</td></tr>
                <tr><td>"มี traffic ผิดปกติไหม? มีใครพยายามเข้าพอร์ต 22 ไหม?"</td><td>VPC Flow Logs</td></tr>
                <tr><td>"RDS instance config เปลี่ยนไปยังไงบ้าง?"</td><td>AWS Config</td></tr>
                <tr><td>"มี threat detection ไหม?"</td><td>GuardDuty</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 10 */}
        <section id="s10" className="s3-section">
          <h2><span className="num">10</span> Integration Patterns</h2>

          <h3>10.1 Centralized Logging Architecture</h3>
<pre><code>{`EC2 Instances (CloudWatch Agent)
    ↓
CloudWatch Logs (per account / per environment)
    ↓ (Subscription Filters)
Kinesis Data Firehose
    ↓
S3 (raw) + OpenSearch (searchable)
    ↓ (for analysis)
CloudWatch Insights / Athena`}</code></pre>

          <h3>10.2 Security Logging Architecture</h3>
<pre><code>{`CloudTrail (Management + Data Events)
    ↓
S3 (immutable with Object Lock)
    ↓
CloudWatch Logs (real-time alerts)
    ↓
EventBridge Rules → SNS → Lambda (automated response)
    ↓
GuardDuty (threat analysis)
    ↓
Security Hub (aggregated findings)`}</code></pre>

          <h3>10.3 Multi-Account Logging</h3>
<pre><code>{`Organization Root
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
│   └── CloudWatch Agent → CloudWatch Logs → Kinesis Firehose → Security S3`}</code></pre>
        </section>

        <hr />

        {/* SECTION 11 */}
        <section id="s11" className="s3-section">
          <h2><span className="num">11</span> WAF / ELB / CloudFront Logs</h2>

          <h3>11.1 AWS WAF Logging</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Destination</th><th>Use Case</th></tr></thead>
              <tbody>
                <tr><td><strong>S3</strong></td><td>Long-term storage, compliance</td></tr>
                <tr><td><strong>CloudWatch Logs</strong></td><td>Real-time logging (extra cost)</td></tr>
                <tr><td><strong>Kinesis Firehose</strong></td><td>S3 + OpenSearch / Splunk</td></tr>
              </tbody>
            </table>
          </div>
          <p><strong>Logged:</strong> timestamp, client IP, country, matched rule, action (ALLOW/BLOCK/COUNT), request headers</p>

          <h3>11.2 ELB Access Logs</h3>
          <ul>
            <li><strong>Storage:</strong> S3 (enable per ALB)</li>
            <li><strong>Interval:</strong> 5 minutes or 60 minutes (per request)</li>
            <li><strong>Format:</strong> gzip-compressed JSON</li>
            <li><strong>Path:</strong> <code>s3://bucket/prefix/AWSLogs/account-id/elasticloadbalancing/region/</code></li>
          </ul>

          <h3>11.3 CloudFront Access Logs</h3>
          <ul>
            <li><strong>Standard logs:</strong> delivered within 24 hours</li>
            <li><strong>Realtime logs:</strong> via Kinesis Data Streams</li>
            <li><strong>Fields:</strong> timestamp, IP, request, response code, referrer, user-agent</li>
          </ul>
        </section>

        <hr />

        {/* SECTION 12 */}
        <section id="s12" className="s3-section">
          <h2><span className="num">12</span> Detective & Macie</h2>

          <h3>12.1 Amazon Detective</h3>
          <p>
            <strong>Investigation service</strong> — automatically analyzes data from GuardDuty,
            CloudTrail, VPC Flow Logs and builds graph database showing relationships between entities.
            ใช้สำหรับหา root cause ของ security findings
          </p>
          <div className="s3-callout">
            <strong>ไม่ต้องติดตั้ง agents หรือ ingest logs เพิ่ม</strong> —
            ใช้ data ที่ GuardDuty และ CloudTrail มีอยู่แล้ว
          </div>

          <h3>12.2 Amazon Macie</h3>
          <p>
            <strong>Data security / DLP service</strong> — discovers และ classifies sensitive data ใน S3
            ใช้ ML ระบุ: PII, PHI, credentials, intellectual property
          </p>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Feature</th><th>รายละเอียด</th></tr></thead>
              <tbody>
                <tr><td><strong>Pricing</strong></td><td>$0.10 per 1000 objects analyzed</td></tr>
                <tr><td><strong>Integration</strong></td><td>GuardDuty, Security Hub</td></tr>
                <tr><td><strong>Supported</strong></td><td>S3 only</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 13 */}
        <section id="s13" className="s3-section">
          <h2><span className="num">13</span> Glossary</h2>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>คำศัพท์</th><th>ความหมาย</th></tr></thead>
              <tbody>
                <tr><td><strong>Log Event</strong></td><td>Single log record — timestamp + message</td></tr>
                <tr><td><strong>Log Stream</strong></td><td>Sequence of log events จาก single source</td></tr>
                <tr><td><strong>Log Group</strong></td><td>Container for log streams — set retention, encryption</td></tr>
                <tr><td><strong>Metric Filter</strong></td><td>Pattern to extract numeric metrics from log events</td></tr>
                <tr><td><strong>CloudWatch Insights</strong></td><td>SQL-like query language for CloudWatch Logs</td></tr>
                <tr><td><strong>Subscription Filter</strong></td><td>Real-time log streaming to Lambda/Kinesis/Firehose</td></tr>
                <tr><td><strong>CloudTrail</strong></td><td>API audit trail — WHO did WHAT, WHEN, WHERE</td></tr>
                <tr><td><strong>Management Events</strong></td><td>Control plane operations (create/delete/modify)</td></tr>
                <tr><td><strong>Data Events</strong></td><td>Data plane operations (GetObject, PutObject)</td></tr>
                <tr><td><strong>Insight Events</strong></td><td>Anomaly detection in API activity</td></tr>
                <tr><td><strong>VPC Flow Logs</strong></td><td>Network traffic metadata logging</td></tr>
                <tr><td><strong>AWS Config</strong></td><td>Resource configuration state tracking</td></tr>
                <tr><td><strong>Config Rules</strong></td><td>Compliance evaluation rules</td></tr>
                <tr><td><strong>Conformance Pack</strong></td><td>Bundle of Config Rules + remediations</td></tr>
                <tr><td><strong>GuardDuty</strong></td><td>ML-based threat detection</td></tr>
                <tr><td><strong>Security Hub</strong></td><td>Security posture aggregation</td></tr>
                <tr><td><strong>Finding</strong></td><td>Security anomaly detected by GuardDuty</td></tr>
                <tr><td><strong>Macie</strong></td><td>Data discovery and classification for S3</td></tr>
                <tr><td><strong>Detective</strong></td><td>Investigation and root cause analysis</td></tr>
                <tr><td><strong>EMF</strong></td><td>Embedded Metric Format — high-cardinality metrics</td></tr>
                <tr><td><strong>Firehose</strong></td><td>Kinesis Data Firehose — delivery stream to S3/OpenSearch</td></tr>
                <tr><td><strong>Object Lock</strong></td><td>S3 feature preventing log deletion (immutable)</td></tr>
                <tr><td><strong>FSBP</strong></td><td>Foundational Security Best Practices</td></tr>
                <tr><td><strong>CIS</strong></td><td>Center for Internet Security benchmarks</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 14 */}
        <section id="s14" className="s3-section">
          <h2><span className="num">14</span> ลิงค์อ้างอิง</h2>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>เนื้อหา</th><th>ลิงค์</th></tr></thead>
              <tbody>
                <tr><td>CloudWatch Logs</td><td><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/" target="_blank" rel="noopener noreferrer">docs.aws.amazon.com/AmazonCloudWatch/latest/logs</a></td></tr>
                <tr><td>CloudWatch Agent</td><td><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/download-cloudwatch-agent.html" target="_blank" rel="noopener noreferrer">download-cloudwatch-agent</a></td></tr>
                <tr><td>CloudWatch Insights</td><td><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/CWL_QuerySyntax.html" target="_blank" rel="noopener noreferrer">CWL_QuerySyntax</a></td></tr>
                <tr><td>CloudWatch Metrics</td><td><a href="https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html" target="_blank" rel="noopener noreferrer">working_with_metrics</a></td></tr>
                <tr><td>CloudTrail</td><td><a href="https://docs.aws.amazon.com/awscloudtrail/latest/userguide/" target="_blank" rel="noopener noreferrer">awscloudtrail/latest/userguide</a></td></tr>
                <tr><td>CloudTrail Lake</td><td><a href="https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-lake.html" target="_blank" rel="noopener noreferrer">cloudtrail-lake</a></td></tr>
                <tr><td>VPC Flow Logs</td><td><a href="https://docs.aws.amazon.com/vpc/latest/flowlogs/" target="_blank" rel="noopener noreferrer">vpc/latest/flowlogs</a></td></tr>
                <tr><td>VPC Flow Logs Athena</td><td><a href="https://docs.aws.amazon.com/athena/latest/ug/vpc-flow-logs.html" target="_blank" rel="noopener noreferrer">athena/latest/ug/vpc-flow-logs</a></td></tr>
                <tr><td>AWS Config</td><td><a href="https://docs.aws.amazon.com/config/latest/developerguide/" target="_blank" rel="noopener noreferrer">config/latest/developerguide</a></td></tr>
                <tr><td>Config Rules</td><td><a href="https://docs.aws.amazon.com/config/latest/developerguide/evaluate-config.html" target="_blank" rel="noopener noreferrer">evaluate-config</a></td></tr>
                <tr><td>GuardDuty</td><td><a href="https://docs.aws.amazon.com/guardduty/latest/ug/" target="_blank" rel="noopener noreferrer">guardduty/latest/ug</a></td></tr>
                <tr><td>Security Hub</td><td><a href="https://docs.aws.amazon.com/securityhub/latest/userguide/" target="_blank" rel="noopener noreferrer">securityhub/latest/userguide</a></td></tr>
                <tr><td>Detective</td><td><a href="https://docs.aws.amazon.com/detective/latest/userguide/" target="_blank" rel="noopener noreferrer">detective/latest/userguide</a></td></tr>
                <tr><td>Macie</td><td><a href="https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html" target="_blank" rel="noopener noreferrer">what-is-macie</a></td></tr>
                <tr><td>CloudWatch Pricing</td><td><a href="https://aws.amazon.com/cloudwatch/pricing/" target="_blank" rel="noopener noreferrer">cloudwatch/pricing</a></td></tr>
                <tr><td>CloudTrail Pricing</td><td><a href="https://aws.amazon.com/cloudtrail/pricing/" target="_blank" rel="noopener noreferrer">cloudtrail/pricing</a></td></tr>
                <tr><td>GuardDuty Pricing</td><td><a href="https://aws.amazon.com/guardduty/pricing/" target="_blank" rel="noopener noreferrer">guardduty/pricing</a></td></tr>
                <tr><td>Security Hub Pricing</td><td><a href="https://aws.amazon.com/security-hub/pricing/" target="_blank" rel="noopener noreferrer">security-hub/pricing</a></td></tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  )
}

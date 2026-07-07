import './S3Page.css'

export default function RDSPage() {
  return (
    <div className="s3-page">
      {/* HERO */}
      <div className="s3-hero">
        <div className="badge">Database Service</div>
        <h1>Amazon RDS — คู่มือฉบับสมบูรณ์</h1>
        <p>
          ครอบคลุมทุกเนื้อหาสำหรับเตรียมสอบ AWS Certification: Database Engines, Instance Classes,
          Storage, Multi-AZ, Read Replicas, Backup, Security, Monitoring, Pricing และ Migration
        </p>
        <div className="refs">
          แหล่งอ้างอิง:{' '}
          <a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/" target="_blank" rel="noopener noreferrer">
            RDS User Guide
          </a>{' '}
          ·{' '}
          <a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/" target="_blank" rel="noopener noreferrer">
            Aurora User Guide
          </a>{' '}
          ·{' '}
          <a href="https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/" target="_blank" rel="noopener noreferrer">
            API Reference
          </a>
        </div>
      </div>

      {/* TOC */}
      <div className="s3-toc-wrap">
        <div className="s3-toc">
          <span className="s3-toc-label">Sections</span>
          <a href="#s1">1. ภาพรวม</a>
          <a href="#s2">2. Database Engines</a>
          <a href="#s3">3. Instance Classes</a>
          <a href="#s4">4. Storage</a>
          <a href="#s5">5. High Availability</a>
          <a href="#s6">6. Backup & Recovery</a>
          <a href="#s7">7. Security</a>
          <a href="#s8">8. Monitoring</a>
          <a href="#s9">9. Maintenance</a>
          <a href="#s10">10. Parameter Groups</a>
          <a href="#s11">11. Pricing</a>
          <a href="#s12">12. Use Cases</a>
          <a href="#s13">13. Migration</a>
          <a href="#s14">14. Aurora Features</a>
          <a href="#s15">15. vs Other Services</a>
          <a href="#s16">16. Glossary</a>
          <a href="#s17">17. ลิงค์อ้างอิง</a>
        </div>
      </div>

      {/* MAIN */}
      <div className="s3-main">

        {/* SECTION 1 */}
        <section id="s1" className="s3-section">
          <h2><span className="num">1</span> ภาพรวม (Overview)</h2>

          <p>
            Amazon Relational Database Service (Amazon RDS) คือ <strong>managed relational database service</strong> ใน cloud
            ที่ช่วยให้ setup, operation, และ scale relational database ได้ง่ายขึ้น
          </p>

          <div className="s3-grid-3">
            <div className="s3-card">
              <h4>Launch</h4>
              <p>สร้าง database instances ได้ภายในไม่กี่นาที รองรับ 6 engines หลัก</p>
            </div>
            <div className="s3-card green">
              <h4>Scale</h4>
              <p>Scale compute และ storage ขึ้น/ลงตามความต้องการ ทั้งแบบ manual และ automatic</p>
            </div>
            <div className="s3-card orange">
              <h4>Automate</h4>
              <p>Backups, patching, monitoring, failover ทำอัตโนมัติ</p>
            </div>
          </div>

          <div className="s3-callout">
            <strong>RDS ไม่ใช่ database เอง</strong> — เป็น service ที่จัดการ infrastructure ให้
            ผู้ใช้ยังต้องจัดการ database internals, users, schema design, SQL queries
          </div>

          <h3>RDS จัดการให้ vs ไม่จัดการ</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>RDS จัดการให้ ✅</th><th>RDS ไม่ได้จัดการ ❌</th></tr></thead>
              <tbody>
                <tr><td>Server provisioning, OS patches</td><td>Query optimizer, buffer pool tuning</td></tr>
                <tr><td>Database software installation/upgrades</td><td>Database users และ permissions</td></tr>
                <tr><td>Automated backups และ snapshots</td><td>Application-level tuning</td></tr>
                <tr><td>Multi-AZ failover อัตโนมัติ</td><td>SQL queries และ schema design</td></tr>
                <tr><td>Storage provisioning และ replication</td><td>Index optimization, query tuning</td></tr>
                <tr><td>Monitoring, metrics, alerting</td><td>Data modeling decisions</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 2 */}
        <section id="s2" className="s3-section">
          <h2><span className="num">2</span> Database Engines ที่รองรับ</h2>

          <div className="s3-grid-3">
            <div className="s3-card">
              <h4>Aurora</h4>
              <p>MySQL และ PostgreSQL compatible — AWS custom engine, 6-way replication, auto-repair</p>
            </div>
            <div className="s3-card green">
              <h4>MySQL 8.0</h4>
              <p>Open source, popular web apps, LAMP/LEMP stack</p>
            </div>
            <div className="s3-card orange">
              <h4>PostgreSQL 16+</h4>
              <p>Enterprise-grade, PostGIS, JSONB, complex data types</p>
            </div>
          </div>

          <h3>2.1 Aurora vs Standard RDS</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Feature</th><th>Aurora</th><th>Standard RDS</th></tr></thead>
              <tbody>
                <tr><td><strong>Storage Replication</strong></td><td>6-way across 3 AZs</td><td>Single-AZ (default)</td></tr>
                <tr><td><strong>Read Replicas</strong></td><td>Up to 15 (MySQL), 5 (PG)</td><td>Up to 5</td></tr>
                <tr><td><strong>Failover Time</strong></td><td>&lt; 30 seconds</td><td>1-2 minutes</td></tr>
                <tr><td><strong>Backups</strong></td><td>Continuous to S3, instant restore</td><td>Daily + WAL</td></tr>
                <tr><td><strong>Performance</strong></td><td>5x MySQL, 3x PostgreSQL</td><td>Standard</td></tr>
                <tr><td><strong>Serverless</strong></td><td>Aurora Serverless v2</td><td>—</td></tr>
              </tbody>
            </table>
          </div>

          <h3>2.2 Other Engines</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Engine</th><th>Use Case</th><th>License</th></tr></thead>
              <tbody>
                <tr><td><strong>MariaDB 10.11</strong></td><td>MySQL replacement, fully open source</td><td>Open Source (GPL)</td></tr>
                <tr><td><strong>Oracle 19c</strong></td><td>Enterprise apps, Oracle-specific features</td><td>BYOL</td></tr>
                <tr><td><strong>SQL Server 2022</strong></td><td>.NET apps, Windows ecosystem</td><td>LI หรือ BYOL</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 3 */}
        <section id="s3" className="s3-section">
          <h2><span className="num">3</span> Instance Classes</h2>

          <h3>3.1 Instance Family Overview</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Family</th><th>Prefix</th><th>เหมาะสำหรับ</th></tr></thead>
              <tbody>
                <tr><td><strong>Standard</strong></td><td>db.m6i, db.m5</td><td>Balanced compute/memory — web apps, general</td></tr>
                <tr><td><strong>Memory Optimized</strong></td><td>db.r6i, db.r5, db.x2</td><td>Large buffers, in-memory DB, analytics</td></tr>
                <tr><td><strong>Burstable</strong></td><td>db.t4g, db.t3</td><td>Low-traffic, dev/test, burstable CPU</td></tr>
                <tr><td><strong>Compute Optimized</strong></td><td>db.c6i, db.c5</td><td>CPU-intensive, high-performance workloads</td></tr>
              </tbody>
            </table>
          </div>

          <h3>3.2 Instance Naming Convention</h3>
<pre><code>{`db.<family><generation>.<size>
ตัวอย่าง:  db.r6g.large   = RDS, r6g family, large size
           db.m6i.2xlarge  = RDS, m6i family, 2xlarge size`}</code></pre>

          <h3>3.3 Size Suffixes</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Size</th><th>vCPU</th><th>Memory (approx)</th></tr></thead>
              <tbody>
                <tr><td>micro</td><td>1</td><td>1 GB</td></tr>
                <tr><td>small</td><td>1</td><td>2 GB</td></tr>
                <tr><td>medium</td><td>1</td><td>4 GB</td></tr>
                <tr><td>large</td><td>2</td><td>8 GB</td></tr>
                <tr><td>xlarge</td><td>4</td><td>16 GB</td></tr>
                <tr><td>2xlarge</td><td>8</td><td>32 GB</td></tr>
                <tr><td>4xlarge</td><td>16</td><td>64 GB</td></tr>
                <tr><td>12xlarge</td><td>48</td><td>192 GB</td></tr>
              </tbody>
            </table>
          </div>

          <h3>3.4 Selection Guidelines</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Workload</th><th>Recommended</th></tr></thead>
              <tbody>
                <tr><td><strong>Development/Testing</strong></td><td>db.t3.micro, db.t4g.micro</td></tr>
                <tr><td><strong>Web Application</strong></td><td>db.m6i.large, db.m5.large</td></tr>
                <tr><td><strong>Enterprise OLTP</strong></td><td>db.r6i.xlarge ขึ้นไป</td></tr>
                <tr><td><strong>Data Analytics</strong></td><td>db.r5.4xlarge ขึ้นไป</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 4 */}
        <section id="s4" className="s3-section">
          <h2><span className="num">4</span> Storage</h2>

          <h3>4.1 Storage Types</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Type</th><th>Technology</th><th>Max Storage</th><th>Max IOPS</th><th>Use Case</th></tr></thead>
              <tbody>
                <tr><td><strong>gp3 (Default)</strong></td><td>SSD</td><td>64 TB</td><td>16,000</td><td>Most workloads, cost-effective</td></tr>
                <tr><td><strong>gp2</strong></td><td>SSD</td><td>64 TB</td><td>3,000 burst</td><td>Standard, legacy</td></tr>
                <tr><td><strong>io1</strong></td><td>Provisioned IOPS SSD</td><td>64 TB</td><td>256,000</td><td>Mission-critical OLTP</td></tr>
                <tr><td><strong>io2</strong></td><td>Provisioned IOPS SSD</td><td>64 TB</td><td>256,000</td><td>Highest performance</td></tr>
              </tbody>
            </table>
          </div>

          <h3>4.2 gp3 vs gp2</h3>
          <div className="s3-grid-2">
            <div className="s3-card">
              <h4>gp3</h4>
              <p>
                Baseline: 3,000 IOPS + 125 MB/s<br />
                Provision เพิ่ม IOPS ได้ถึง 16,000<br />
                ถูกกว่า gp2 สำหรับ high-IOPS workload
              </p>
            </div>
            <div className="s3-card yellow">
              <h4>gp2</h4>
              <p>
                Burst ถึง 3,000 IOPS<br />
                1 GB = 3 IOPS สะสม<br />
                ยิ่งใหญ่ยิ่งมี IOPS สูงขึ้น
              </p>
            </div>
          </div>

          <h3>4.3 Storage Scaling Rules</h3>
          <div className="s3-callout orange">
            <strong>Scale up:</strong> ได้โดยไม่มี downtime &nbsp;|&nbsp;
            <strong>Scale down:</strong> ไม่ได้ — cannot reduce allocated storage
          </div>
        </section>

        <hr />

        {/* SECTION 5 */}
        <section id="s5" className="s3-section">
          <h2><span className="num">5</span> High Availability (Multi-AZ)</h2>

          <h3>5.1 Multi-AZ Architecture</h3>
          <p>
            Multi-AZ สร้าง <strong>synchronous standby replica</strong> ใน AZ อื่นเพื่อ redundancy —
            เมื่อ primary down, RDS ทำ failover อัตโนมัติไปยัง standby
          </p>

          <div className="s3-callout green">
            <strong>Zero data loss</strong> — synchronous replication ทำให้ไม่มี data loss เมื่อ failover
            &nbsp;|&nbsp; <strong>Automatic failover</strong> — ไม่ต้อง manual intervention
          </div>

          <h3>5.2 Failover Timeline</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Engine</th><th>Failover Time</th></tr></thead>
              <tbody>
                <tr><td><strong>Aurora</strong></td><td>&lt; 30 seconds (typically)</td></tr>
                <tr><td><strong>MySQL/PostgreSQL/MariaDB (Multi-AZ)</strong></td><td>1-2 minutes</td></tr>
                <tr><td><strong>Oracle/SQL Server (Multi-AZ)</strong></td><td>1-2 minutes</td></tr>
              </tbody>
            </table>
          </div>

          <h3>5.3 Read Replicas</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Engine</th><th>Max Direct Replicas</th><th>Chain Depth</th><th>Replication</th></tr></thead>
              <tbody>
                <tr><td><strong>MySQL</strong></td><td>5</td><td>3 layers</td><td>Asynchronous</td></tr>
                <tr><td><strong>PostgreSQL</strong></td><td>5</td><td>3 layers</td><td>Asynchronous</td></tr>
                <tr><td><strong>MariaDB</strong></td><td>5</td><td>3 layers</td><td>Asynchronous</td></tr>
                <tr><td><strong>Aurora MySQL</strong></td><td>15</td><td>1 (same cluster)</td><td>Layered (writeset caching)</td></tr>
                <tr><td><strong>Aurora PostgreSQL</strong></td><td>5</td><td>1 (same cluster)</td><td>Layered</td></tr>
              </tbody>
            </table>
          </div>

          <h3>5.4 Aurora Endpoints</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Endpoint</th><th>Points To</th><th>Use For</th></tr></thead>
              <tbody>
                <tr><td><strong>Cluster Endpoint</strong></td><td>Primary writer</td><td>Write operations</td></tr>
                <tr><td><strong>Reader Endpoint</strong></td><td>Load-balanced across replicas</td><td>Read operations</td></tr>
                <tr><td><strong>Custom Endpoint</strong></td><td>Subset of instances</td><td>Special workloads</td></tr>
                <tr><td><strong>Instance Endpoint</strong></td><td>Specific instance only</td><td>Direct instance access</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 6 */}
        <section id="s6" className="s3-section">
          <h2><span className="num">6</span> Backup และ Recovery</h2>

          <h3>6.1 Automated Backups</h3>
          <div className="s3-callout">
            <strong>Daily backups</strong> during preferred maintenance window +
            <strong> Transaction logs (WAL)</strong> — PITR ได้ถึง any point in time
            &nbsp;|&nbsp; <strong>Retention:</strong> 1-35 days
          </div>

          <h3>6.2 Manual Snapshots vs Automated Backups</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Feature</th><th>Automated Backups</th><th>Manual Snapshots</th></tr></thead>
              <tbody>
                <tr><td><strong>Retention</strong></td><td>1-35 days, auto-delete</td><td>Until manually deleted</td></tr>
                <tr><td><strong>Point-in-time Recovery</strong></td><td>✅ Yes</td><td>From snapshot time only</td></tr>
                <tr><td><strong>Cross-region copy</strong></td><td>Via backup chain</td><td>✅ Yes, direct</td></tr>
                <tr><td><strong>Share with accounts</strong></td><td>❌ No</td><td>✅ Yes</td></tr>
              </tbody>
            </table>
          </div>

          <h3>6.3 Restore Process</h3>
          <div className="s3-grid-2">
            <div className="s3-card">
              <h4>Standard RDS Restore</h4>
              <p>
                1. เลือก backup/snapshot<br />
                2. RDS สร้าง new DB instance<br />
                3. Data restore ไปยัง new instance<br />
                4. Update connection strings
              </p>
            </div>
            <div className="s3-card green">
              <h4>Aurora Restore</h4>
              <p>
                1. เลือก point-in-time หรือ snapshot<br />
                2. Aurora clone storage volume ทันที<br />
                3. New cluster ready ใน minutes<br />
                4. Much faster than standard RDS
              </p>
            </div>
          </div>

          <h3>6.4 Aurora Backtrack</h3>
          <div className="s3-callout purple">
            <strong>Aurora MySQL only:</strong> ย้อนกลับ database ไปยัง specific point
            โดยไม่ต้อง restore — <strong>Instant</strong>, ไม่ต้อง provision new resources
          </div>
        </section>

        <hr />

        {/* SECTION 7 */}
        <section id="s7" className="s3-section">
          <h2><span className="num">7</span> Security</h2>

          <h3>7.1 Encryption at Rest</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Aspect</th><th>รายละเอียด</th></tr></thead>
              <tbody>
                <tr><td><strong>Key Management</strong></td><td>AWS KMS (AWS-managed หรือ CMK)</td></tr>
                <tr><td><strong>Enable timing</strong></td><td>At creation only — <strong>cannot enable หลังสร้างแล้ว</strong></td></tr>
                <tr><td><strong>Encrypted</strong></td><td>Data files, logs, snapshots, backups, read replicas</td></tr>
                <tr><td><strong>Aurora</strong></td><td>ฟรี (included)</td></tr>
                <tr><td><strong>MySQL/PG/MariaDB</strong></td><td>$0.20/GB-month (KMS)</td></tr>
              </tbody>
            </table>
          </div>

          <h3>7.2 Encryption in Transit</h3>
          <ul>
            <li><strong>SSL/TLS</strong> — enforce ได้ทุก engine</li>
            <li>Aurora: TLS ถูก enforce โดย default</li>
            <li>MySQL/PostgreSQL: <code>requireSSL</code> parameter</li>
            <li>SQL Server: Force SSL on server</li>
          </ul>

          <h3>7.3 IAM Database Authentication</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Supported</th><th>Not Supported</th></tr></thead>
              <tbody>
                <tr><td>MySQL, PostgreSQL, Aurora</td><td>MariaDB, Oracle, SQL Server</td></tr>
              </tbody>
            </table>
          </div>
          <div className="s3-callout green">
            <strong>Benefits:</strong> ไม่ต้อง manage database passwords · ใช้ IAM policies ควบคุมได้ง่าย ·
            Auth tokens expire หลัง 15 นาที
          </div>

          <h3>7.4 Security Groups</h3>
          <ul>
            <li><strong>Inbound:</strong> RDS port (3306 MySQL, 5432 PostgreSQL, 1433 SQL Server)</li>
            <li><strong>Source:</strong> EC2 security group หรือ CIDR</li>
            <li><strong>Stateful:</strong> outbound automatic</li>
          </ul>

          <h3>7.5 RDS Proxy</h3>
          <div className="s3-grid-2">
            <div className="s3-card">
              <h4>Benefits</h4>
              <p>
                • Connection pooling (hundreds → dozens)<br />
                • Automatic failover — app ไม่ต้อง handle<br />
                • IAM auth support<br />
                • TLS/SSL automatic
              </p>
            </div>
            <div className="s3-card orange">
              <h4>Use Cases</h4>
              <p>
                • Serverless (Lambda → RDS)<br />
                • Many short-lived connections<br />
                • Connection limit issues
              </p>
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 8 */}
        <section id="s8" className="s3-section">
          <h2><span className="num">8</span> Monitoring และ Logging</h2>

          <h3>8.1 CloudWatch Metrics (Free)</h3>
          <div className="s3-grid-2">
            <div className="s3-card">
              <h4>Performance Metrics</h4>
              <p>
                CPUUtilization · DatabaseConnections<br />
                FreeableMemory · FreeStorageSpace<br />
                ReadIOPS · WriteIOPS
              </p>
            </div>
            <div className="s3-card green">
              <h4>I/O Metrics</h4>
              <p>
                DiskQueueDepth · ReadLatency<br />
                WriteLatency · BurstBalance<br />
                NetworkReceive/TransmitThroughput
              </p>
            </div>
          </div>

          <h3>8.2 Enhanced Monitoring (มีค่า)</h3>
          <ul>
            <li>OS-level metrics — process list, memory breakdown</li>
            <li>Granularity: <strong>1 second</strong> (vs 60 seconds CloudWatch standard)</li>
            <li>Metrics from CloudWatch Agent ที่รันบน RDS instance</li>
          </ul>

          <h3>8.3 Performance Insights</h3>
          <div className="s3-callout">
            Visualize database performance · Top SQL statements · Wait events (bottleneck identification)
            &nbsp;|&nbsp; <strong>Free:</strong> 7 days, 1 CPU equivalent &nbsp;|&nbsp;
            <strong>Paid:</strong> longer retention, more dimensions
          </div>

          <h3>8.4 Log Export to CloudWatch</h3>
<pre><code>{`aws rds modify-db-instance \\
  --db-instance-identifier my-db \\
  --cloudwatch-logs-export-configuration \\
  '{"EnableLogTypes":["error","slowquery"]}'`}</code></pre>

          <h3>8.5 Available Log Types</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Log</th><th>Available For</th></tr></thead>
              <tbody>
                <tr><td><strong>Error log</strong></td><td>ทุก engine</td></tr>
                <tr><td><strong>Slow query log</strong></td><td>MySQL, PostgreSQL, MariaDB</td></tr>
                <tr><td><strong>General log</strong></td><td>MySQL</td></tr>
                <tr><td><strong>Audit log</strong></td><td>Aurora (advanced), SQL Server</td></tr>
                <tr><td><strong>PostgreSQL logs</strong></td><td>PostgreSQL</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 9 */}
        <section id="s9" className="s3-section">
          <h2><span className="num">9</span> Maintenance และ Patching</h2>

          <h3>9.1 Auto Minor Version Upgrade</h3>
          <div className="s3-callout">
            <strong>Minor versions:</strong> Auto upgrade if enabled — happens during maintenance window<br />
            <strong>Major versions:</strong> Never automatic — must be manually initiated
          </div>

          <h3>9.2 Preferred Maintenance Window</h3>
          <ul>
            <li>Weekly scheduled window — 30-minute duration</li>
            <li>ต้อง specify during creation หรือ modify later</li>
            <li>Maintenance events: OS patches, engine upgrades, instance class changes</li>
          </ul>

          <h3>9.3 Instance Class Changes</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Setup</th><th>Downtime</th><th>Process</th></tr></thead>
              <tbody>
                <tr><td><strong>Multi-AZ</strong></td><td>3-5 นาที</td><td>Standby → failover → primary</td></tr>
                <tr><td><strong>Single-AZ</strong></td><td>5-10 นาที</td><td>Reboot required</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 10 */}
        <section id="s10" className="s3-section">
          <h2><span className="num">10</span> Parameter Groups และ Options Groups</h2>

          <h3>10.1 DB Parameter Groups</h3>
          <p>Configuration สำหรับ database engine — มี 2 ประเภท:</p>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Type</th><th>Require Reboot</th><th>ตัวอย่าง</th></tr></thead>
              <tbody>
                <tr><td><strong>Static</strong></td><td>✅ Yes</td><td>max_connections, shared_buffers</td></tr>
                <tr><td><strong>Dynamic</strong></td><td>❌ No</td><td>query_cache_size, log_output</td></tr>
              </tbody>
            </table>
          </div>

          <h3>10.2 DB Option Groups</h3>
          <p>Enable database features/options เพิ่มเติม:</p>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Engine</th><th>Options</th></tr></thead>
              <tbody>
                <tr><td><strong>MySQL/MariaDB</strong></td><td>MEMCACHED, TDE</td></tr>
                <tr><td><strong>SQL Server</strong></td><td>SQLSERVER_BACKUP_RESTORE, TDE, SSIS</td></tr>
                <tr><td><strong>Oracle</strong></td><td>NATIVE_NETWORK_ENCRYPTION, Oracle EM, APEX</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 11 */}
        <section id="s11" className="s3-section">
          <h2><span className="num">11</span> Pricing</h2>

          <h3>11.1 Instance Pricing (On-Demand, us-east-1)</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Class</th><th>MySQL/PG</th><th>Oracle LI</th><th>SQL Server Web</th></tr></thead>
              <tbody>
                <tr><td>db.t3.micro</td><td>$0.017/hr</td><td>—</td><td>—</td></tr>
                <tr><td>db.m5.large</td><td>$0.115/hr</td><td>$0.38/hr</td><td>$0.20/hr</td></tr>
                <tr><td>db.r5.large</td><td>$0.19/hr</td><td>—</td><td>—</td></tr>
              </tbody>
            </table>
          </div>

          <h3>11.2 Storage Pricing (us-east-1)</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Type</th><th>ราคา</th></tr></thead>
              <tbody>
                <tr><td>gp3</td><td>$0.12/GB-month</td></tr>
                <tr><td>gp2</td><td>$0.115/GB-month</td></tr>
                <tr><td>io1 / io2</td><td>$0.125/GB-month + $0.10/provisioned IOPS</td></tr>
              </tbody>
            </table>
          </div>

          <h3>11.3 Data Transfer</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Transfer</th><th>ค่าบริการ</th></tr></thead>
              <tbody>
                <tr><td><strong>Data IN</strong></td><td>ฟรี</td></tr>
                <tr><td><strong>Data OUT to Internet</strong></td><td>$0.09/GB (first 10 TB)</td></tr>
                <tr><td><strong>Same-Region EC2 ↔ RDS</strong></td><td>ฟรี</td></tr>
                <tr><td><strong>Cross-Region Replication</strong></td><td>$0.02-$0.09/GB</td></tr>
              </tbody>
            </table>
          </div>

          <h3>11.4 Cost Optimization</h3>
          <div className="s3-grid-2">
            <div className="s3-card green">
              <h4>Reserved Instances</h4>
              <p>Up to 69% savings vs On-Demand — สำหรับ production ที่ run ตลอดเวลา</p>
            </div>
            <div className="s3-card orange">
              <h4>Stop DB Instance</h4>
              <p>Test/dev instances — stop ได้ up to 7 days, คิดแค่ storage</p>
            </div>
          </div>
        </section>

        <hr />

        {/* SECTION 12 */}
        <section id="s12" className="s3-section">
          <h2><span className="num">12</span> Use Cases หลัก</h2>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Use Case</th><th>Config</th><th>Engine</th></tr></thead>
              <tbody>
                <tr><td><strong>Web Application</strong></td><td>db.m5.large + gp3, Multi-AZ</td><td>MySQL, PostgreSQL, Aurora</td></tr>
                <tr><td><strong>E-commerce OLTP</strong></td><td>db.r5.xlarge + io1, Multi-AZ</td><td>PostgreSQL, Aurora</td></tr>
                <tr><td><strong>SaaS</strong></td><td>Aurora, Multi-AZ</td><td>Aurora MySQL/PG</td></tr>
                <tr><td><strong>Development/Testing</strong></td><td>db.t3.micro, no Multi-AZ</td><td>Any</td></tr>
                <tr><td><strong>Enterprise ERP</strong></td><td>db.r5.2xlarge + Multi-AZ</td><td>Oracle, SQL Server</td></tr>
                <tr><td><strong>Mobile App Backend</strong></td><td>Aurora Serverless v2</td><td>Aurora</td></tr>
                <tr><td><strong>Geospatial (GIS)</strong></td><td>db.r5.xlarge</td><td>PostgreSQL (PostGIS)</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 13 */}
        <section id="s13" className="s3-section">
          <h2><span className="num">13</span> Migration</h2>

          <h3>13.1 AWS DMS (Database Migration Service)</h3>
          <div className="s3-grid-2">
            <div className="s3-card">
              <h4>Source Support</h4>
              <p>
                On-premises, other cloud providers,<br />
                EC2-based, other RDS instances
              </p>
            </div>
            <div className="s3-card green">
              <h4>Target Support</h4>
              <p>
                RDS, Aurora, EC2-based,<br />
                S3 (data lake migration)
              </p>
            </div>
          </div>

          <h3>13.2 Migration Types</h3>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Type</th><th>Downtime</th><th>Use Case</th></tr></thead>
              <tbody>
                <tr><td><strong>Full load</strong></td><td>High</td><td>One-time migration</td></tr>
                <tr><td><strong>Full load + CDC</strong></td><td>Minimal</td><td>Production migration</td></tr>
                <tr><td><strong>CDC only</strong></td><td>Near-zero</td><td>Ongoing replication</td></tr>
              </tbody>
            </table>
          </div>

          <h3>13.3 Migration Steps</h3>
          <ol>
            <li><strong>Assess</strong> — size, complexity, compatibility</li>
            <li><strong>Validate</strong> — test on staging environment</li>
            <li><strong>Plan</strong> — maintenance window, rollback plan</li>
            <li><strong>Migrate</strong> — full load + CDC for production</li>
            <li><strong>Validate</strong> — data integrity checks</li>
            <li><strong>Cutover</strong> — DNS/connection string update</li>
            <li><strong>Monitor</strong> — post-migration monitoring</li>
          </ol>
        </section>

        <hr />

        {/* SECTION 14 */}
        <section id="s14" className="s3-section">
          <h2><span className="num">14</span> Aurora Specific Features</h2>

          <div className="s3-grid-2">
            <div className="s3-card">
              <h4>Aurora Serverless v2</h4>
              <p>
                Auto-scaling based on workload · Zero compute when idle<br />
                1 ACU ≈ 2 GB memory · เหมาะสำหรับ intermittent workloads
              </p>
            </div>
            <div className="s3-card green">
              <h4>Aurora Global Database</h4>
              <p>
                Up to 5 secondary regions · &lt; 1 second replication lag<br />
                Automatic failover ไปยัง secondary region
              </p>
            </div>
          </div>

          <h3>14.1 Aurora Backtrack</h3>
          <div className="s3-callout purple">
            <strong>Aurora MySQL only:</strong> Rewind database ภายใน configured window (ถึง 72 hours) —
            Instant, ไม่ต้อง restore — เหมาะสำหรับ "oops" moments
          </div>

          <h3>14.2 Aurora Parallel Query</h3>
          <p>
            Push compute to storage layer — <strong>10x faster</strong> สำหรับ analytical queries
            บน large tables — ลด movement ของ data จาก storage ไป compute layer
          </p>

          <h3>14.3 Aurora ML</h3>
          <p>
            Run ML inference from database — SageMaker, Comprehend integration —
            SQL-like interface — ใช้สำหรับ fraud detection, sentiment analysis, recommendations
          </p>
        </section>

        <hr />

        {/* SECTION 15 */}
        <section id="s15" className="s3-section">
          <h2><span className="num">15</span> RDS vs Other AWS Databases</h2>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>Service</th><th>Type</th><th>Best For</th></tr></thead>
              <tbody>
                <tr><td><strong>RDS / Aurora</strong></td><td>Relational</td><td>Transactional, ACID, SQL</td></tr>
                <tr><td><strong>Redshift</strong></td><td>Analytical (OLAP)</td><td>Data warehouse, analytics</td></tr>
                <tr><td><strong>DynamoDB</strong></td><td>NoSQL (Key-Value + Doc)</td><td>Serverless, massive scale, millisecond</td></tr>
                <tr><td><strong>DocumentDB</strong></td><td>Document (MongoDB)</td><td>JSON documents, flexible schema</td></tr>
                <tr><td><strong>ElastiCache</strong></td><td>In-memory</td><td>Caching, sessions, real-time</td></tr>
                <tr><td><strong>Neptune</strong></td><td>Graph</td><td>Social networks, fraud detection</td></tr>
                <tr><td><strong>Timestream</strong></td><td>Time-series</td><td>IoT, monitoring</td></tr>
                <tr><td><strong>QLDB</strong></td><td>Ledger</td><td>Immutable, auditable records</td></tr>
                <tr><td><strong>Keyspaces</strong></td><td>Wide-column (Cassandra)</td><td>Cassandra workloads, massive write scale</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 16 */}
        <section id="s16" className="s3-section">
          <h2><span className="num">16</span> Glossary</h2>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>คำศัพท์</th><th>ความหมาย</th></tr></thead>
              <tbody>
                <tr><td><strong>DB Instance</strong></td><td>Virtual database server</td></tr>
                <tr><td><strong>Multi-AZ</strong></td><td>High availability — synchronous standby in another AZ</td></tr>
                <tr><td><strong>Read Replica</strong></td><td>Read-only copy — asynchronous replica for read scaling</td></tr>
                <tr><td><strong>Automated Backup</strong></td><td>Daily backups + transaction logs for PITR</td></tr>
                <tr><td><strong>DB Snapshot</strong></td><td>Manual, user-initiated backup — retained until deleted</td></tr>
                <tr><td><strong>Parameter Group</strong></td><td>Database engine configuration parameters</td></tr>
                <tr><td><strong>Option Group</strong></td><td>Database features/options (TDE, MEMCACHED, etc.)</td></tr>
                <tr><td><strong>Subnet Group</strong></td><td>VPC subnets ที่ RDS จะ placed</td></tr>
                <tr><td><strong>RDS Proxy</strong></td><td>Fully managed proxy — connection pooling + failover</td></tr>
                <tr><td><strong>Enhanced Monitoring</strong></td><td>OS-level metrics at 1-second granularity</td></tr>
                <tr><td><strong>Performance Insights</strong></td><td>DB performance visualization — top SQL, wait events</td></tr>
                <tr><td><strong>Backtrack</strong></td><td>Aurora MySQL — rewind without restore</td></tr>
                <tr><td><strong>Global Database</strong></td><td>Aurora cross-region replication</td></tr>
                <tr><td><strong>DMS</strong></td><td>Database Migration Service</td></tr>
                <tr><td><strong>CDC</strong></td><td>Change Data Capture — track ongoing changes</td></tr>
                <tr><td><strong>PITR</strong></td><td>Point-in-Time Recovery — restore to any point</td></tr>
                <tr><td><strong>WAL</strong></td><td>Write-Ahead Log — PostgreSQL transaction log</td></tr>
                <tr><td><strong>Binary Log</strong></td><td>MySQL transaction log — replication + PITR</td></tr>
                <tr><td><strong>ACU</strong></td><td>Aurora Capacity Unit — 1 ACU ≈ 2 GB memory</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <hr />

        {/* SECTION 17 */}
        <section id="s17" className="s3-section">
          <h2><span className="num">17</span> ลิงค์อ้างอิง</h2>
          <div className="s3-table-wrap">
            <table className="s3-table">
              <thead><tr><th>เนื้อหา</th><th>ลิงค์</th></tr></thead>
              <tbody>
                <tr><td>RDS User Guide</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/" target="_blank" rel="noopener noreferrer">docs.aws.amazon.com/AmazonRDS</a></td></tr>
                <tr><td>RDS Instance Classes</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.html" target="_blank" rel="noopener noreferrer">DBInstanceClass</a></td></tr>
                <tr><td>RDS Storage</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Storage.html" target="_blank" rel="noopener noreferrer">CHAP_Storage</a></td></tr>
                <tr><td>RDS Multi-AZ</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html" target="_blank" rel="noopener noreferrer">MultiAZ</a></td></tr>
                <tr><td>RDS Read Replicas</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html" target="_blank" rel="noopener noreferrer">ReadRepl</a></td></tr>
                <tr><td>RDS Backup & Restore</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html" target="_blank" rel="noopener noreferrer">AutomatedBackups</a></td></tr>
                <tr><td>RDS Security</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.html" target="_blank" rel="noopener noreferrer">UsingWithRDS</a></td></tr>
                <tr><td>RDS Encryption</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Encryption.html" target="_blank" rel="noopener noreferrer">Encryption</a></td></tr>
                <tr><td>RDS IAM Auth</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAM.html" target="_blank" rel="noopener noreferrer">IAM Auth</a></td></tr>
                <tr><td>RDS Proxy</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html" target="_blank" rel="noopener noreferrer">RDS Proxy</a></td></tr>
                <tr><td>Monitoring</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/MonitoringOverview.html" target="_blank" rel="noopener noreferrer">MonitoringOverview</a></td></tr>
                <tr><td>Performance Insights</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/PerformanceInsights.html" target="_blank" rel="noopener noreferrer">PerformanceInsights</a></td></tr>
                <tr><td>Aurora User Guide</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/" target="_blank" rel="noopener noreferrer">AuroraUserGuide</a></td></tr>
                <tr><td>Aurora Global Database</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html" target="_blank" rel="noopener noreferrer">GlobalDatabase</a></td></tr>
                <tr><td>Aurora Serverless</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless.html" target="_blank" rel="noopener noreferrer">Serverless</a></td></tr>
                <tr><td>RDS Pricing</td><td><a href="https://aws.amazon.com/rds/pricing/" target="_blank" rel="noopener noreferrer">aws.amazon.com/rds/pricing</a></td></tr>
                <tr><td>AWS DMS</td><td><a href="https://docs.aws.amazon.com/dms/latest/UserGuide/Welcome.html" target="_blank" rel="noopener noreferrer">DMS User Guide</a></td></tr>
                <tr><td>RDS API Reference</td><td><a href="https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/" target="_blank" rel="noopener noreferrer">API Reference</a></td></tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  )
}

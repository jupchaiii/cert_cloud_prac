# Amazon CloudFront — คู่มือฉบับสมบูรณ์

> แหล่งอ้างอิง: [Amazon CloudFront Developer Guide](https://docs.aws.amazon.com/cloudfront/)
> แหล่งอ้างอิง: [CloudFront Caching](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ConfiguringCaching.html)
> แหล่งอ้างอิง: [CloudFront Pricing](https://aws.amazon.com/cloudfront/pricing/)

---

## 1. ภาพรวม (Overview)

Amazon CloudFront คือ Content Delivery Network (CDN) ที่ deliver content ให้ผู้ใช้ทั่วโลกอย่างรวดเร็ว — โดย cache content ไว้ที่ edge locations (PoPs — Points of Presence) ทั่วโลก

**CloudFront ทำงานอย่างไร:**
1. ผู้ใช้ request content (เช่น รูปภาพ, video, HTML)
2. CloudFront ดูว่า content นั้น cache อยู่ edge location ใกล้ผู้ใช้หรือยัง
3. ถ้า cache hit → ส่งจาก edge location ใกล้ที่สุด (low latency)
4. ถ้า cache miss → ดึงจาก origin server (S3, EC2, ELB, หรือ HTTP backend) แล้ว cache ไว้

**Key characteristics:**
- **Global network** — 200+ edge locations และ 13 regional edge caches ทั่วโลก
- **Low latency** — content ส่งจาก edge ใกล้ผู้ใช้ที่สุด
- **High availability** — distributed architecture, ไม่มี single point of failure
- **Secure** — DDoS protection, SSL/TLS, signed URLs, signed cookies, Geo-blocking
- **Integrated with AWS** — ทำงานร่วมกับ S3, EC2, ELB, Lambda@Edge, WAF, Shield
- **Pay-as-you-go** — จ่ายตามการใช้งานจริง

---

## 2. Core Concepts

### 2.1 Origin

Origin คือ origin server ที่ CloudFront ดึง content มาเมื่อไม่มีใน cache:

| Origin Type | Description |
|-------------|-------------|
| **S3 bucket** | ใช้เป็น origin สำหรับ static content (images, videos, files) |
| **Custom origin (HTTP server)** | EC2, ELB, ALB, API Gateway, or any HTTP server |
| **MediaPackage channel** | ใช้สำหรับ live streaming (DASH, HLS, Microsoft Smooth) |
| **MediaStore container** | ใช้สำหรับ live/VOD video workflows |
| **AppSync HTTP endpoint** | GraphQL APIs |

**Origin settings:**
```
Origin Domain Name:  my-bucket.s3.us-east-1.amazonaws.com
Origin Path:        /static        (optional — serve from subdirectory)
Origin Protocol:    HTTP only / HTTPS only / Match Viewer
Origin Port:        80, 443, or custom
Origin Timeout:     30 seconds default
```

### 2.2 Distribution

Distribution คือการตั้งค่าหลักของ CloudFront — บอกว่า:
- Content มาจาก origin ไหน
- Cache behavior อย่างไร
- กฎเกณฑ์การ routing requests
- Security settings

**Distribution URL format:**
```
https://dxxxxxxx.cloudfront.net/path/to/file
```

**Types of distributions:**

| Type | Description |
|------|-------------|
| **Web Distribution** | ใช้สำหรับ websites, static content, HTTP/HTTPS |
| **RTMP Distribution** | ใช้สำหรับ Adobe Flash media streaming (deprecated) |

### 2.3 Edge Location (PoP)

Edge location คือ data center ที่ CloudFront เก็บ cache:

- **200+ edge locations** ทั่วโลก
- **13 regional edge caches** — cache layer ระหว่าง edge locations กับ origin
- เมื่อ cache miss ที่ edge → ดึงจาก regional edge cache → ถ้าไม่มี → ดึงจาก origin

```
[User in Bangkok] → [Edge Location: Singapore] → [Regional Edge Cache]
                                                       → [Origin: S3 US-East]
```

### 2.4 Regional Edge Cache

Regional edge cache คือ cache layer ที่ใหญ่กว่า edge location:

- **ใหญ่กว่า edge cache** — เก็บ content ที่เข้าถึงบ่อยแต่ไม่ถึงขั้น popular ในแต่ละ edge
- **อยู่ระหว่าง edge กับ origin** — ลด load บน origin
- **Cache objects ขนาดใหญ่** — video segments, software downloads
- **Persist ข้าม edge locations** — content ถูก cached แค่ครั้งเดียวต่อ region

---

## 3. How CloudFront Delivers Content

### 3.1 Cache Hit Flow

```
1. User requests: GET /images/photo.jpg
2. DNS routes to nearest edge location (Singapore)
3. Edge checks cache for /images/photo.jpg
4. CACHE HIT → Returns content to user
5. Content cached at edge location
```

### 3.2 Cache Miss Flow

```
1. User requests: GET /images/photo.jpg
2. DNS routes to nearest edge location (Singapore)
3. Edge checks cache → CACHE MISS
4. Edge requests from regional edge cache
5. Regional edge checks cache → CACHE MISS
6. Regional edge requests from origin (S3)
7. Origin returns content
8. Content cached at regional edge
9. Content cached at edge location
10. Returns content to user
```

### 3.3 Time to First Byte (TTFB)

CloudFront ลด TTFB ด้วย:
- **Cache** — hit ได้ response ทันที
- **Persistent connections** — ต่อ connection กับ origin ไว้ล่วงหน้า
- **HTTP/2 and HTTP/3 (QUIC)** — multiplexed requests
- **Origin Shield** — centralized cache layer ลด origin requests

---

## 4. Cache Behaviors

Cache behavior กำหนดวิธีที่ CloudFront cache content เฉพาะ path patterns:

### 4.1 Path Pattern Matching

```
/api/*      → Cache behavior A (no caching)
/images/*   → Cache behavior B (cache 1 day)
/*.html     → Cache behavior C (no caching)
/video/*    → Cache behavior D (cache 1 week)
```

**Priority order:** Specific path ก่อน wildcard path

### 4.1 Cache Key

Cache key คือ identifier ที่ CloudFront ใช้ uniquely identify ว่า object ใน cache:

**Default cache key:**
```
https://dxxxxx.cloudfront.net/images/photo.jpg
→ Cache key: /images/photo.jpg (ไม่รวม query strings โดย default)
```

**Cache key with query strings:**
```
?version=1.0&size=large
→ Cache key: /images/photo.jpg?size=large (whitelist mode)
→ Cache key: /images/photo.jpg?* (include all)
→ Cache key: /images/photo.jpg (ignore all — default)
```

### 4.2 TTL (Time to Live)

**Cache expiration settings:**

| Setting | Description |
|---------|-------------|
| **Minimum TTL** | Minimum seconds ที่ object ถูกเก็บใน cache |
| **Maximum TTL** | Maximum seconds ที่ object ถูกเก็บใน cache |
| **Default TTL** | TTL เมื่อ origin ไม่ได้ cache headers |

**Origin headers that control TTL:**

| Header | Description |
|--------|-------------|
| **Cache-Control: max-age** | Browser/CDN cache duration |
| **Cache-Control: s-maxage** | Shared cache (CDN) duration only |
| **Cache-Control: no-cache** | Always revalidate with origin |
| **Cache-Control: no-store** | Never cache |
| **Expires** | Absolute expiration date |

### 4.3 Caching Optimized

**Best practices:**
- แยก static และ dynamic content
- ใช้ `Cache-Control` headers จาก origin
- ใช้ query string whitelist สำหรับ parameterized content
- ใช้ consistent object names (ไม่เปลี่ยน content แต่เปลี่ยน URL)

---

## 5. Origin Groups

Origin Groups ช่วยให้ใช้ fallback origin เมื่อ primary origin fail:

### 5.1 Failover Configuration

```
Origin Group:
├── Primary:   S3 bucket (us-east-1)
└── Secondary: S3 bucket (us-west-2) or ELB
```

**Use case:**
- Primary origin down → CloudFront 自动 switch ไป secondary
- เหมาะสำหรับ high availability

### 5.2 Origin Group with Weighted Round-Robin

```
Origin Group:
├── Origin A (weight: 70)
├── Origin B (weight: 20)
└── Origin C (weight: 10)
```

**Use case:**
- A/B testing
- Blue-green deployment
- Migration between origins

---

## 6. CloudFront Functions และ Lambda@Edge

### 6.1 CloudFront Functions

CloudFront Functions คือ lightweight JavaScript functions ที่ run เร็วมาก at edge locations:

**Use cases:**
- HTTP request/response manipulation
- URL redirects and rewrites
- Header manipulation
- Access control (IP blocking, etc.)
- Generate signed URLs

**Characteristics:**
- **Native to CloudFront** — built-in, no extra cost
- **Lightweight** — simple JavaScript (ECMAScript 5.1)
- **Sub-millisecond execution** — extremely low latency
- **Millions of requests/second** — highly scalable
- **Free tier** — 2 million invocations/month

**Event types:**
- `viewer-request` — before CloudFront checks cache
- `viewer-response` — before returning to viewer

### 6.2 Lambda@Edge

Lambda@Edge คือ Lambda functions ที่ run ได้ที่ edge locations:

**Use cases:**
- A/B testing
- Personalized content
- Prime geolocation
- Real-time image transformation
- Access monitoring and logging

**Characteristics:**
- **Full Lambda features** — Node.js or Python
- **Higher execution time** — up to 30 seconds (vs 5ms for CloudFront Functions)
- **Larger payload** — up to 1 MB (vs 100 KB)
- **More memory** — up to 10 MB (vs 2 MB)
- **Cost** — คิดตาม invocations + duration

**Event types:**
| Event | When |
|-------|------|
| **Viewer Request** | After CloudFront receives request from viewer |
| **Origin Request** | Before CloudFront forwards request to origin |
| **Origin Response** | After CloudFront receives response from origin |
| **Viewer Response** | Before CloudFront returns response to viewer |

### 6.3 CloudFront Functions vs Lambda@Edge

| Feature | CloudFront Functions | Lambda@Edge |
|---------|---------------------|------------|
| **Language** | JavaScript | Node.js, Python |
| **Execution time** | < 5 ms | Up to 30 seconds |
| **Memory** | 2 MB | 128 MB – 10 GB |
| **Max payload** | 100 KB | 1 MB (request/response) |
| **Pricing** | Free tier 2M/month | Paid (invocations + duration) |
| **ECMAScript version** | 5.1 | ES2017+ (Node.js) |
| **npm packages** | No | Yes |
| **Network access** | No | Yes |
| **AWS services access** | No | Yes |
| **Price** | Free tier included | Charged |

---

## 7. Security

### 7.1 SSL/TLS Encryption

CloudFront รองรับ HTTPS สำหรับ both viewer connections และ origin connections:

**Viewer connections (viewer → CloudFront):**

| Option | Description |
|--------|-------------|
| **HTTPS only** | Redirect HTTP → HTTPS |
| **HTTP and HTTPS** | Accept both |
| **Match viewer** | Use whichever protocol viewer used |

**Origin connections (CloudFront → origin):**

| Option | Description |
|--------|-------------|
| **HTTPS only** | CloudFront ต้อง connect ผ่าน HTTPS |
| **HTTP and HTTPS** | Match viewer protocol |
| **Origin Protocol Policy: Match Viewer** | Use same protocol as viewer |

**SSL/TLS Certificates:**
- **AWS Certificate Manager (ACM)** — free TLS certificates
- **Custom certificates** — upload your own (via ACM or IAM)
- **Default CloudFront certificate** — `*.cloudfront.net` (free)

### 7.2 Field-Level Encryption

Encrypt sensitive data ที่ edge location ก่อนส่งต่อไปยัง origin:

```
User Credit Card → Edge Location (encrypt field) → Origin (sees only encrypted)
```

**Use case:** Protect credit card numbers, SSN, passwords — only origin can decrypt

### 7.3 Signed URLs และ Signed Cookies

ป้องกัน unauthorized access ด้วย signed URLs:

**Signed URL flow:**
```
1. App generates signed URL (with expiration)
2. User accesses: https://dxxxxx.cloudfront.net/video.mp4?Policy=xxx&Signature=yyy
3. CloudFront validates signature
4. If valid → serve content
5. If expired or invalid → 403 Forbidden
```

**Use cases:**
- Paid content (Netflix-style)
- Time-limited access
- Restrict access by IP
- Geo-restricted content

**Key differences:**

| Feature | Signed URL | Signed Cookie |
|---------|-----------|---------------|
| **Method** | URL includes signature | Cookie set on domain |
| **Multiple files** | Generate per URL | Single cookie for many files |
| **Existing URLs** | Can't add to existing | Can add to existing content |
| **Cache** | Works with CDN cache | Works with CDN cache |

**Trusted key groups:**
```
Trusted Key Group 1:
├── Public Key 1
├── Public Key 2
└── Public Key 3
```

### 7.4 Geo-Restrictions (Geo-Blocking)

ป้องกัน users จากบางประเทศเข้าถึง content:

**Methods:**
- **CloudFront Geo-Restriction** — block/allow specific countries
- **CloudFront Functions** — custom logic based on `viewer.location`
- **Third-party services** — integrate with MaxMind, etc.

**Use cases:**
- Content licensing (ละเมิดลิขสิทธิ์ในบางประเทศ)
- Legal compliance
- Government restrictions

### 7.5 AWS WAF Integration

CloudFront ทำงานร่วมกับ AWS WAF (Web Application Firewall):

**WAF features:**
- **IP blocking** — block malicious IPs
- **Rate limiting** — prevent DDoS/brute force
- **SQL injection protection**
- **XSS protection**
- **Rule-based filtering**
- **AWS Managed Rules** — pre-configured rule sets

### 7.6 AWS Shield

**AWS Shield Standard (free):**
- DDoS protection สำหรับ all AWS customers
- Automatic protection for CloudFront
- Mitigates common DDoS attacks (SYN/UDP floods, reflection attacks)

**AWS Shield Advanced ($3,000/month):**
- Enhanced DDoS protection
- 24/7 DDoS Response Team (DRT)
- Cost protection (if usage spikes from attack)
- Real-time visibility into attacks

---

## 8. CloudFront with S3

### 8.1 S3 as CloudFront Origin

**ตั้งค่า S3 bucket เป็น origin:**
```
Origin Domain: my-bucket.s3.us-east-1.amazonaws.com
Origin Protocol: HTTPS only
Origin Path: (optional)
```

### 8.2 OAI (Origin Access Identity)

OAI ช่วยให้เฉพาะ CloudFront เข้าถึง S3 bucket ได้:

```
Without OAI:
CloudFront → Public S3 bucket → Everyone can access!

With OAI:
CloudFront (with OAI) → S3 bucket (block public) → Only CloudFront can access
```

**Bucket policy with OAI:**
```json
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "CloudFront Access",
      "Effect": "Allow",
      "Principal": {"CanonicalUser": "cloudfront-origin-identity-id"},
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

### 8.3 CloudFront vs S3 Transfer Acceleration

| Feature | CloudFront | S3 Transfer Acceleration |
|---------|-----------|--------------------------|
| **Type** | CDN + caching | Accelerated uploads |
| **Caching** | Yes (edge caching) | No (direct to S3) |
| **Global edge network** | 200+ locations | 200+ edge locations |
| **HTTP methods** | GET, POST, etc. | Upload only (PUT, POST) |
| **Cost** | Request + data transfer | Per GB uploaded |
| **Use case** | Content delivery | Faster uploads from remote locations |

---

## 9. CloudFront with EC2 / ELB

### 9.1 Custom Origin (EC2/ELB)

```
[User] → [CloudFront Edge] → [ELB] → [EC2 Instances]
```

**Configuration:**
```
Origin Domain: my-elb.elb.amazonaws.com
Origin Protocol: HTTPS
Origin SSL Protocol: TLSv1.2
Origin Timeout: 30 seconds
```

### 9.2 Benefits

- **Cache static content** — reduce load on EC2
- **DDoS protection** — Shield + WAF
- **SSL termination** — CloudFront handles HTTPS
- **Geo-routing** — direct users to closest region
- **Reduce origin load** — only uncached requests hit origin

---

## 10. CloudFront Streaming

### 10.1 Video Streaming

CloudFront supports streaming สำหรับ video on demand (VOD) และ live streaming:

**Supported formats:**
| Format | Description |
|--------|-------------|
| **HLS** | HTTP Live Streaming (Apple) |
| **DASH** | Dynamic Adaptive Streaming over HTTP |
| **Microsoft Smooth Streaming** | (Legacy) |
| **HDS** | HTTP Dynamic Streaming (Adobe, deprecated) |

### 10.2 CloudFront Streaming with MediaPackage

```
[Encoder] → [MediaPackage Channel] → [CloudFront] → [Player]
```

**MediaPackage:**
- Takes live stream input
- Packages to multiple formats (HLS, DASH, etc.)
- Adds DRM (if needed)
- Outputs to CloudFront

### 10.3 Signed URLs for Streaming

Protect streaming content ด้วย signed URLs:
- Expire after certain time
- Restrict by IP
- Valid for specific content

---

## 11. Monitoring และ Logging

### 11.1 CloudFront Analytics

**CloudFront console provides:**
- **Requests** — total requests, by region, by HTTP status
- **Data transferred** — bytes transferred, by region
- **Cache hit ratio** — % of requests served from cache
- **Top URLs** — most requested content
- **Top origins** — origin with most requests

### 11.2 CloudWatch Metrics

| Metric | Description |
|--------|-------------|
| **Requests** | Total requests |
| **BytesDownloaded** | Data from CloudFront to viewers |
| **BytesUploaded** | Data from viewers to CloudFront |
| **CacheHitRate** | % of requests served from cache |
| **4xxErrorRate** | Percentage of 4xx errors |
| **5xxErrorRate** | Percentage of 5xx errors |
| **TotalErrorRate** | All errors |
| **OriginLatency** | Time from CloudFront to origin |

### 11.3 CloudFront Logs (Real-Time Logs)

**Standard logs (CloudFront Access Logs):**
- Stored in S3
- Detailed request logs
- Includes: timestamp, IP, URL, status, referrer, etc.
- **Can take 20 min – 24 hours** to deliver

**Real-time logs:**
- Stream to Kinesis Data Firehose (near real-time)
- Choose fields to include
- Choose % of requests to sample
- **Deliver within seconds**

### 11.4 CloudWatch Alarms

```bash
# Example: Alarm on 5xx error rate > 5%
aws cloudwatch put-metric-alarm \
  --alarm-name cloudfront-5xx-high \
  --metric-name 5xxErrorRate \
  --namespace AWS/CloudFront \
  --statistic Average \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=DistributionId,Value=EXXXXX
```

---

## 12. Cache Invalidation

### 12.1 Cache Invalidation

Invalidation คือการลบ objects ออกจาก cache ก่อนหมด TTL:

**Invalidation patterns:**
```
/images/photo.jpg           → invalidate specific file
/images/*                   → invalidate all in path
/images/*                  → invalidate all (wildcard)
/*                          → invalidate everything (expensive!)
```

**CLI invalidation:**
```bash
aws cloudfront create-invalidation \
  --distribution-id EXXXXX \
  --paths "/images/*" "/videos/*"
```

### 12.2 Versioned URLs

แทนที่จะ invalidate cache ใช้ versioned URLs:

```
/v1/images/photo.jpg   (old version)
/v2/images/photo.jpg   (new version)
```

**Benefits:**
- No invalidation needed
- Instant switch to new content
- Trackable version history

---

## 13. Price Classes

CloudFront pricing แตกต่างกันตาม region:

### 13.1 Price Classes

| Class | Regions | Description |
|-------|---------|-------------|
| **All** | All 200+ edge locations | Most expensive, global coverage |
| **200** | Most regions (excludes most expensive) | Good balance |
| **100** | Only cheapest regions | Lowest cost, limited locations |

### 13.2 Data Transfer Out

**CloudFront Data Transfer Out (to internet):**
- First 10 TB/month: ~$0.085/GB (US)
- Decreases at higher tiers
- Price varies by region (cheapest: US/EU, most expensive: Asia Pacific/India)

**Origin Data Transfer:**
- Data transfer from CloudFront to origin: free

---

## 14. AWS Global Accelerator vs CloudFront

| Feature | CloudFront | Global Accelerator |
|---------|-----------|-------------------|
| **Type** | Content Delivery Network (CDN) | Anycast network |
| **Caching** | Yes (HTTP content) | No |
| **Protocols** | HTTP/HTTPS | TCP/UDP (any port) |
| **Use case** | Web content, video, static files | Gaming, VoIP, SSH, non-HTTP |
| **Performance** | Cached content very fast | Optimized routing |
| **Static IP** | No | Yes (2 anycast IPs) |
| **Health checks** | Yes | Yes |
| **DDoS protection** | Shield Standard | Shield Standard |

---

## 15. Limits

| Limit | Value |
|-------|-------|
| **Distributions per account** | 200 (soft limit) |
| **CNAMEs per distribution** | 100 |
| **Cache behaviors per distribution** | 25 |
| **Invalidation paths per request** | 3,000 |
| **Concurrent invalidations** | 3 per distribution |
| **Files per invalidation** | Unlimited (using wildcard) |
| **Whitelist query strings** | Up to 10 |
| **Trusted key groups per distribution** | 4 |
| **Alternate domain names (CNAMEs)** | 100 per distribution |
| **Geographic restrictions** | Block/allow by country |
| **Max object size** | 20 GB (for both cache and upload) |

---

## 16. Architecture Patterns

### 16.1 Static Website Hosting

```
[S3 (origin)] ← [CloudFront] ← [Users worldwide]

- S3 bucket: static website hosting enabled
- CloudFront: cache all content at edge
- OAI: restrict S3 to CloudFront only
- HTTPS: enforced
```

### 16.2 Dynamic Content + Static Assets

```
                    ┌─ [S3 /images] ── [CloudFront: /images/*]
[Users] → [CloudFront] ── [EC2 /api] ── [CloudFront: /api/*]
                    └─ [MediaConvert] ── [CloudFront: /videos/*]
```

### 16.3 Multi-Region High Availability

```
[Users] → [Route 53 (latency routing)] 
              ├→ [CloudFront + S3 US] → [S3 Replication] → [S3 EU]
              └→ [CloudFront + S3 EU]
```

### 16.4 Protected Content (Signed URLs)

```
[App Server] 
  → Generate signed URL (expires, IP restriction)
  → Return to user
  → User accesses: https://dxxx.cloudfront.net/video.mp4?Policy=...&Signature=...
  → CloudFront validates → Serve content
```

### 16.5 CloudFront + WAF + Shield

```
[Internet] → [Shield Standard] → [WAF Rules] → [CloudFront] → [Origin]
                                    ↑
                            IP blocking, rate limit,
                            SQL/XSS protection
```

---

## 17. Best Practices

1. **แยก static และ dynamic content** — static ไป cache ที่ edge, dynamic ผ่าน CloudFront ต่อ origin
2. **ใช้ HTTPS** — CloudFront free certificate จาก ACM
3. **ใช้ Origin Shield** — ลด origin load สำหรับ high-traffic origins
4. **Set appropriate TTLs** — ไม่ควร cache ข้อมูลที่เปลี่ยนบ่อย
5. **ใช้ versioned URLs** — แทน invalidation เมื่อ deploy content ใหม่
6. **Monitor cache hit ratio** — target > 90% สำหรับ static content
7. **Enable access logs** — ช่วย debug และ analyze
8. **ใช้ OAI กับ S3** — ป้องกัน direct bucket access
9. **Compress content** — เปิด Brotli/Gzip compression
10. **ใช้ HTTP/2 or HTTP/3** — ประสิทธิภาพดีกว่า HTTP/1.1
11. **Restrict origin access** — ให้ CloudFront เข้าถึง origin ได้อย่างเดียว
12. **ใช้ Lambda@Edge สำหรับ complex logic** — CloudFront Functions สำหรับ simple tasks
13. **Geo-restriction** — ถ้าต้อง block บางประเทศ
14. **Price class** — เลือก price class ที่เหมาะกับ audience
15. **กระจาย objects ข้าม multiple edge locations** — ใช้ random filenames หรือ sequential numbering กับ cache

---

## 18. Common Use Cases

### 18.1 Static Website / SPA
- React, Vue, Angular apps
- S3 origin + CloudFront
- Caching for JS, CSS, images

### 18.2 Video Streaming
- VOD: CloudFront + MediaPackage
- Live: CloudFront + MediaLive + MediaPackage
- HLS/DASH adaptive bitrate streaming

### 18.3 API Acceleration
- CloudFront + API Gateway / ELB
- Cache GET responses
- Reduce API calls

### 18.4 Software / Game Distribution
- Large file downloads
- Software updates
- Game patches

### 18.5 Mobile App Backend
- API responses cached
- Assets (images, configs) cached
- Reduced latency for mobile users

---

## 19. ลิงค์อ้างอิง

- [CloudFront Developer Guide](https://docs.aws.amazon.com/cloudfront/)
- [CloudFront API Reference](https://docs.aws.amazon.com/cloudfront/latest/APIReference/)
- [CloudFront Pricing](https://aws.amazon.com/cloudfront/pricing/)
- [CloudFront FAQ](https://aws.amazon.com/cloudfront/faqs/)
- [CloudFront Functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-functions.html)
- [Lambda@Edge](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-the-edge.html)
- [AWS WAF and CloudFront](https://docs.aws.amazon.com/waf/latest/developerguide/cloudfront-features.html)

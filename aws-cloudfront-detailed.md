# Amazon CloudFront — คู่มือฉบับสมบูรณ์ (Service Edge)

> แหล่งอ้างอิง: [Amazon CloudFront Developer Guide](https://docs.aws.amazon.com/cloudfront/)
> แหล่งอ้างอิง: [CloudFront Caching](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ConfiguringCaching.html)
> แหล่งอ้างอิง: [CloudFront Pricing](https://aws.amazon.com/cloudfront/pricing/)
> แหล่งอ้างอิง: [CloudFront Distributions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web.html)
> แหล่งอ้างอิง: [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/)
> แหล่งอ้างอิง: [AWS Shield Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html)

---

## 1. ภาพรวม (Overview)

Amazon CloudFront คือ Content Delivery Network (CDN) และ **Service Edge** platform ที่ deliver content และ run logic ให้ผู้ใช้ทั่วโลกอย่างรวดเร็ว โดย cache content ไว้ที่ edge locations (PoPs — Points of Presence) และ execute functions ที่ edge เพื่อประมวลผล request/response ก่อนถึง origin

**Service Edge vs Traditional CDN:**
- **Traditional CDN:** แค่ cache และ deliver static content
- **Service Edge:** Cache + compute + security + routing — ทำทุกอย่างที่ edge ได้ ไม่ต้องผ่าน origin

**CloudFront ทำงานอย่างไร:**
```
1. User requests content จาก https://dxxxxx.cloudfront.net/images/photo.jpg
2. DNS (Route 53) จัด routing ไป edge location ใกล้ที่สุด
3. Edge location ตรวจสอบ cache
   ├── Cache HIT  → Return ทันที (< 10 ms)
   └── Cache MISS → ดึงจาก origin → cache → return
4. ขณะเดียวกัน CloudFront Functions / Lambda@Edge สามารถ intercept
   request/response เพื่อ modify, redirect, authenticate, หรือ block
```

**Key characteristics:**
- **Global network** — 200+ edge locations และ 13 regional edge caches ทั่วโลก
- **Low latency** — content ส่งจาก edge ใกล้ผู้ใช้ที่สุด (typical < 50 ms worldwide)
- **High availability** — distributed architecture, ไม่มี single point of failure
- **Service Edge** — CloudFront Functions + Lambda@Edge ทำ compute ที่ edge
- **Secure** — DDoS protection, WAF, SSL/TLS, signed URLs, field-level encryption, Geo-blocking
- **Integrated with AWS** — ทำงานร่วมกับ S3, EC2, ELB, Lambda@Edge, WAF, Shield, ACM, Route 53
- **Pay-as-you-go** — จ่ายตามการใช้งานจริง

---

## 2. Network Architecture — ทำไม CloudFront เร็ว

### 2.1 Anycast และ IP Anycast

CloudFront ใช้ **IP Anycast** สำหรับ routing:

**Traditional Unicast:**
```
Client (Bangkok) → DNS → Server IP (Singapore) → Route to Singapore server
```

**IP Anycast (CloudFront):**
```
Client (Bangkok) → DNS → Same IP for all edge locations
                 → BGP routing เลือก edge ที่ใกล้ที่สุด (hop-by-hop)
                 → Bangkok edge ถ้ามี หรือ Singapore edge
```

**Benefits:**
- **Single IP** — `dxxxxx.cloudfront.net` คือ IP เดียวกันทั่วโลก
- **BGP routing** — network-level routing เลือก path ที่สั้นที่สุด
- **Automatic failover** — ถ้า edge ตาย BGP จะ route ไป edge ถัดไปโดยอัตโนมัติ
- **DDoS mitigation** — attack traffic กระจายไปหลาย edge locations

### 2.2 BGP Routing และ Latency

CloudFront edge locations รายงาน latency ผ่าน BGP:

```
[Client] → [Local ISP Router]
         → [Internet Exchange Point]
         → [AWS Backbone — ultra-low latency private network]
         → [Nearest CloudFront Edge]
```

**AWS Global Network:**
- AWS backbone เชื่อมต่อ edge locations ผ่าน private fiber
- เร็วกว่า public internet 30-50%
- ใช้ร่วมกับ AWS Direct Connect สำหรับ hybrid cloud

### 2.3 Regional Edge Cache vs Edge Location

CloudFront มี 2-tier caching architecture:

```
TIER 1: Edge Locations (200+) — ใกล้ user, เล็ก, numerous
TIER 2: Regional Edge Caches (13) — ใหญ่กว่า, อยู่ระหว่าง edge กับ origin
```

| Aspect | Edge Location | Regional Edge Cache |
|--------|-------------|-------------------|
| **Count** | 200+ | 13 |
| **Size** | เล็ก | ใหญ่กว่ามาก |
| **Scope** | เฉพาะ location | ทั้ง region |
| **Persists** | Local to that PoP | Shared across all PoPs in region |
| **Content type** | Popular content | Less popular but recent content |
| **Cost** | Data transfer แพงกว่า | ถูกกว่า edge |

**Cache miss flow ฉบับละเอียด:**
```
1. User GET /video/lecture.mp4
2. Edge Location (Singapore) — cache MISS
3. → Regional Edge Cache (Asia Pacific) — cache MISS
4. → Origin (S3 US-East-1)
5. Origin returns content
6. Regional Edge Cache caches it
7. Edge Location caches it
8. Returns to user
```

### 2.4 HTTP/2 and HTTP/3 (QUIC)

CloudFront รองรับ modern protocols:

**HTTP/1.1 limitations:**
- 1 connection ต่อ 1 request (head-of-line blocking)
- ต้อง handshaking ใหม่ทุก connection
- No multiplexing

**HTTP/2 improvements:**
- **Multiplexing** — หลาย requests บน connection เดียว
- **Header compression** (HPACK)
- **Server push** — server push resources ให้ client
- **Single TCP connection** — ลด latency

**HTTP/3 (QUIC) — CloudFront advantages:**
- **UDP-based** — ไม่มี head-of-line blocking
- **0-RTT** — resumption ไม่ต้อง handshake ใหม่
- **Connection migration** — switch networks ไม่หลุด (mobile)
- **Better packet loss handling** — ส่ง packet หลาย streams พร้อม

```
CloudFront รองรับ HTTP/3 อัตโนมัติ:
Viewer → HTTP/3 capable? → Yes: QUIC / No: HTTP/2 fallback
```

### 2.5 Persistent Connections และ Connection Reuse

CloudFront ต่อ connection กับ origin ไว้ล่วงหน้า:

**Without persistent connection:**
```
Request 1: TCP handshake → TLS handshake → Request → Response → Close
Request 2: TCP handshake → TLS handshake → Request → Response → Close
Request 3: TCP handshake → TLS handshake → Request → Response → Close
```

**With persistent connection (CloudFront → Origin):**
```
Connection opened: TCP handshake → TLS handshake
Request 1: Request → Response
Request 2: Request → Response
Request 3: Request → Response
Connection closed (after timeout)
```

**Benefits:**
- ลด latency สำหรับ cache miss (ไม่ต้อง handshake ใหม่)
- Connection pool สำหรับหลาย concurrent requests
- Keep-alive ลด origin load

### 2.6 Origin Shield

Origin Shield คือ centralized cache layer อยู่หน้า origin:

```
Without Origin Shield:
[Edge 1] ─┐
[Edge 2] ─┼──→ [Origin] (same request: /api/data มาหลาย edge พร้อมกัน)
[Edge 3] ─┘

With Origin Shield:
[Edge 1] ─┐
[Edge 2] ─┼──→ [Origin Shield] ─→ [Origin] (deduplicated: แค่ 1 request)
[Edge 3] ─┘
```

**Benefits:**
- ลด origin load อย่างมาก (especially สำหรับ uncacheable content)
- ใช้ 1 origin IP แม้หลาย edge กระจายอยู่
- Consistent performance จากทุก edge
- **Use case:** high-traffic APIs, personalized content

**Origin Shield architecture:**
- เป็น single global endpoint: `shield-origin.cloudfront.net`
- Origin Shield ต่อไป origin ด้วย optimized routing
- เหมาะกับ: S3 origin (ที่ไม่มี multi-AZ caching), custom origins

---

## 3. Core Concepts

### 3.1 Origin

Origin คือ origin server ที่ CloudFront ดึง content มาเมื่อไม่มีใน cache:

| Origin Type | Description | Use Case |
|-------------|-------------|----------|
| **S3 bucket** | ใช้เป็น origin สำหรับ static content | Images, videos, files |
| **S3 website endpoint** | S3 configured as website endpoint | Static website hosting |
| **Custom origin (HTTP server)** | EC2, ELB, ALB, API Gateway | Dynamic content, APIs |
| **MediaPackage channel** | AWS MediaPackage for streaming | Live/VOD streaming |
| **MediaStore container** | AWS Elemental MediaStore | Video workflows |
| **AppSync HTTP endpoint** | GraphQL APIs | Real-time APIs |
| **Endpoint with Origin Shield** | S3 + Origin Shield | High-traffic origins |

**Origin settings (ฉบับละเอียด):**
```
Origin Domain Name:  my-bucket.s3.us-east-1.amazonaws.com
Origin Path:        /static        (optional — serve from subdirectory)
Origin Protocol:    HTTP only / HTTPS only / Match Viewer
Origin Port:        80 (HTTP), 443 (HTTPS), or custom (e.g., 8080)
Origin Timeout:     30 seconds default (can increase to 60, 100, 180 sec)
Origin Keepalive Timeout: 5 seconds (keep connection open for reuse)
Origin SSL Protocols: TLSv1.2, TLSv1.3 (drop older insecure versions)
Origin HTTP Methods: GET, HEAD (default) / GET, HEAD, OPTIONS / GET, HEAD, OPTIONS, PUT, POST, DELETE, PATCH
```

### 3.2 Distribution

Distribution คือการตั้งค่าหลักของ CloudFront — กำหนดว่า content มาจากไหน และถูก deliver อย่างไร:

**Distribution URL format:**
```
https://dxxxxxxx.cloudfront.net/path/to/file
```

**Aliases (CNAMEs):**
```
https://cdn.example.com/images/photo.jpg
→ CloudFront: dxxxxxxx.cloudfront.net
→ CNAME record in Route 53: cdn.example.com → dxxxxxxx.cloudfront.net
```

**Types of distributions:**

| Type | Description | Protocols | Use Case |
|------|-------------|-----------|----------|
| **Web Distribution** | Standard web delivery | HTTP, HTTPS, HTTP/2, HTTP/3 | Websites, static content, APIs |
| **RTMP Distribution** | Adobe Flash streaming | RTMP | (Deprecated — ไม่ควรใช้) |

### 3.3 Cache Behaviors

Cache behavior กำหนดวิธีที่ CloudFront cache content สำหรับ specific path patterns:

**Path pattern priority (เรียงจาก specific → general):**
```
1. /api/users/*     — most specific
2. /api/*          — less specific
3. /images/*.jpg    — pattern
4. /*              — default (catch-all)
```

**Cache behavior options:**

| Setting | Description |
|---------|-------------|
| **Path Pattern** | URL pattern ที่ใช้ match |
| **Origin or Origin Group** | Origin ที่จะ forward ไป |
| **Viewer Protocol Policy** | HTTP only, HTTPS only, or Match Viewer |
| **Allowed HTTP Methods** | GET/HEAD, GET/HEAD/OPTIONS, or all |
| **Cached HTTP Methods** | Whether to cache responses to OPTIONS requests |
| **Whitelist Query Strings** | Query strings ที่รวมใน cache key |
| **Compress Objects Automatically** | Brotli/Gzip compression |
| **Cache Policy** | Managed or custom cache policy |
| **Origin Request Policy** | Managed or custom origin request policy |
| **Response Headers Policy** | Add/modify response headers |
| **Function Associations** | CloudFront Functions ที่ trigger |
| **Lambda@Edge Associations** | Lambda functions ที่ trigger |
| **Smooth Streaming** | For IIS Smooth Streaming (legacy) |
| **Restrict Viewer Access** | Require signed URLs/Cookies |

### 3.4 Cache Key

Cache key คือ unique identifier ที่ CloudFront ใช้ตรวจสอบว่า object นี้มีอยู่ใน cache หรือไม่:

**Default cache key:**
```
https://dxxxxx.cloudfront.net/images/photo.jpg
→ Cache key: /images/photo.jpg (default — ไม่รวม query strings)
```

**Query string cache key modes:**

| Mode | Cache Key | Example |
|------|-----------|---------|
| **None (default)** | `/path/file` | `?version=1&size=large` → ไม่มีผล |
| **Include specified** | `/path/file?size` | Whitelist specific query params |
| **Include all** | `/path/file?*` | รวมทุก query string |

**Query string whitelist example:**
```
Request: /api/data?token=abc&lang=en&format=json
Whitelist: token, lang
Cache key: /api/data?token&lang
→ Different lang=en vs lang=th = separate cache entries
→ format ignored = same cache for both
```

### 3.5 TTL (Time to Live)

**Cache expiration:**

| Setting | Description | Default |
|---------|-------------|---------|
| **Minimum TTL** | Minimum seconds ที่ object ต้องอยู่ใน cache | 0 seconds |
| **Maximum TTL** | Maximum seconds ที่ object จะอยู่ใน cache | 31536000 (1 year) |
| **Default TTL** | TTL เมื่อ origin ไม่ส่ง Cache-Control | 86400 (24 hours) |

**Origin headers that control TTL:**

| Header | Priority | Description |
|--------|----------|-------------|
| **Cache-Control: max-age=seconds** | 1 | Browser + CDN cache duration |
| **Cache-Control: s-maxage=seconds** | 2 | CDN cache duration (ignore max-age) |
| **Cache-Control: no-cache** | 3 | Revalidate ทุกครั้ง แต่ still cache |
| **Cache-Control: no-store** | 4 | Never cache |
| **Cache-Control: private** | 5 | ไม่ cache ที่ shared CDN cache |
| **Expires: HTTP-date** | 6 | Absolute expiration date |

**TTL calculation logic:**
```
If Cache-Control: max-age:
  TTL = min(max-age, Maximum TTL)
Else if Cache-Control: s-maxage:
  TTL = min(s-maxage, Maximum TTL)
Else if Expires header:
  TTL = (Expires - now)
Else:
  TTL = Default TTL
Then:
  TTL = max(TLT, Minimum TTL)  ← enforce minimum
  TTL = min(TTL, Maximum TTL)  ← enforce maximum
```

### 3.6 Stale-While-Revalidate

ช่วยให้ CloudFront serve stale content ขณะ revalidating กับ origin:

```
Cache-Control: max-age=3600; stale-while-revalidate=600
```

**Flow:**
```
1. User requests /api/data (TTL = 1 hour)
2. After 1 hour: content expires but...
3. CloudFront serves stale content (max 600 seconds)
4. Simultaneously: CloudFront revalidates with origin
5. If origin returns new content → cache updated + serve new
6. If stale-while-revalidate exceeded → block until origin responds
```

**Benefits:**
- User ได้ content เร็ว (ไม่ต้องรอ origin)
- Origin ไม่โดน thundering herd
- ลด perceived latency

### 3.7 Stale-If-Error

Serve stale content เมื่อ origin error:

```
Cache-Control: max-age=3600; stale-if-error=86400
```

**Flow:**
```
1. Content cached with TTL = 1 hour, stale-if-error = 1 day
2. Origin becomes unavailable after 1 hour
3. CloudFront serves stale content for up to 1 day
4. After 1 day: returns error to user
```

---

## 4. Distribution Configuration Deep Dive

### 4.1 Distribution Settings

**General:**

| Setting | Description |
|---------|-------------|
| **Price Class** | All, 200 (most regions), 100 (cheapest) |
| **AWS WAF Web ACL** | Associate WAF ACL |
| **Alternate Domain Names (CNAMEs)** | Up to 100 aliases |
| **SSL Certificate** | Default *.cloudfront.net or custom (ACM) |
| **Supported HTTP Versions** | HTTP/1.1, HTTP/2, HTTP/3 |
| **IPv6** | Enable/disable |
| **Default Root Object** | Object ที่ return เมื่อ root URL requested (e.g., index.html) |
| **Standard Logging** | S3 bucket สำหรับ access logs |
| **Logging Includes Cookies** | Include cookie data in logs |
| **Enable IPv6** | Dual-stack support |

### 4.2 Cache Policy

Cache Policy คือ managed policy ที่กำหนดว่าอะไรอยู่ใน cache key และ TTL:

**AWS Managed Cache Policies:**

| Policy Name | Use Case |
|-------------|----------|
| **CachingOptimized** | Static content — ลด header, long TTL |
| **CachingOptimizedForUncompressedObjects** | Uncompressed content (gzip/Brotli ที่ edge) |
| **Elemental-MediaPackage** | Video packaging |
| **Amplify** | AWS Amplify hosting |
| **MediaPackage-Live** | Live streaming |
| **CachingDisabled** | Don't cache (APIs, personalized content) |

**Custom Cache Policy:**
```json
{
  "Name": "MyAPICachePolicy",
  "CacheSecurityPolicy": "TLSv1.2_2021",
  "ParametersInCacheKeyAndForwardedToOrigin": {
    "QueryStringConfig": {
      "QueryStringBehavior": "WHITELIST",
      "QueryStrings": {"Items": ["lang", "version"]}
    },
    "HeaderConfig": {"HeaderBehavior": "none"},
    "CookiesConfig": {"CookieBehavior": "none"},
    "EnableAcceptEncodingGzip": true,
    "EnableAcceptEncodingBrotli": true
  }
}
```

### 4.3 Origin Request Policy

Origin Request Policy คือการกำหนดว่าอะไรถูกส่งไป origin (ไม่ใช่ cache key):

**AWS Managed Origin Request Policies:**

| Policy | Forward to Origin |
|--------|------------------|
| **AllViewer** | All headers, query strings, cookies |
| **AllViewerAndWhitelistCloudFrontHeaders** | All + specific CloudFront headers |
| **AllExceptHostHeader** | Everything except Host header |
| **CORS-CustomOrigin** | CORS headers for custom origins |
| **CORS-S3Origin** | CORS headers for S3 origins |
| **ElementalMediaTail** | MediaTailor specific |
| **None** | Nothing extra (bare request) |

### 4.4 Response Headers Policy

Response Headers Policy ช่วยเพิ่ม/modify headers โดยไม่ต้องแก้ origin:

**Use cases:**
- Add security headers (X-Frame-Options, CSP, etc.)
- Add CORS headers
- Add custom headers
- Remove sensitive headers

**Managed Response Headers Policies:**

| Policy | Headers Added |
|--------|--------------|
| **SecurityHeadersPolicy** | X-Frame-Options, X-XSS-Protection, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security |
| **CORSHeadersAndOptions** | Access-Control-Allow-* headers |
| **SimpleCORS** | Basic CORS support |

---

## 5. Origin Groups

Origin Groups ช่วยให้ใช้ fallback origin เมื่อ primary fail:

### 5.1 Failover (Primary-Secondary)

```
Origin Group:
├── Primary:   S3 bucket (us-east-1) — bucket with Multi-AZ enabled
└── Secondary: S3 bucket (us-west-2) — backup bucket
```

**How it works:**
- CloudFront health check primary origin
- ถ้า primary เป็น 5xx error หรือ timeout → failover ไป secondary
- Health check: TCP connection ทุก 30 seconds
- Failover threshold: 3 consecutive failures

**Requirements:**
- ต้องมี 2 origins ใน origin group
- ต้อง enable health checks
- Origin ต้อง return 200-299 หรือ 400-499 (for S3)

### 5.2 Weighted Round-Robin

```
Origin Group:
├── Origin A (weight: 70) — production
├── Origin B (weight: 20) — staging/test
└── Origin C (weight: 10) — new version
```

**Use cases:**
- A/B testing (70% users → A, 30% → B)
- Blue-green deployment (slowly shift traffic)
- Feature flags (small % → new feature)

### 5.3 Latency-Based Routing

Origin Group can route to the origin with lowest latency:

```
Origin Group with Latency Routing:
├── Origin US-East (for US users)
├── Origin EU-West (for EU users)
└── Origin AP-Southeast (for APAC users)
```

---

## 6. Security Deep Dive

### 6.1 SSL/TLS Encryption

CloudFront รองรับ HTTPS สำหรับ both viewer connections และ origin connections:

**Viewer connections (viewer → CloudFront):**

| Option | Description |
|--------|-------------|
| **HTTPS only** | Redirect HTTP → HTTPS อัตโนมัติ |
| **HTTP and HTTPS** | Accept both protocols |
| **Match viewer** | Use whatever protocol viewer uses |

**Origin connections (CloudFront → origin):**

| Option | Description |
|--------|-------------|
| **HTTPS only** | CloudFront ต้องใช้ HTTPS ต่อ origin |
| **Match Viewer Protocol** | ใช้ protocol เดียวกับ viewer |

**SSL/TLS Certificates:**
- **ACM (AWS Certificate Manager)** — สร้าง free TLS certificate (recommended)
- **IAM** — upload certificates (legacy)
- **Default CloudFront certificate** — `*.cloudfront.net` (free, auto-managed)

**Certificate requirements:**
- ต้อง be RSA 2048-bit หรือ stronger
- SHA-2 hash algorithm (256-bit ขึ้นไป)
- ใช้ได้ทั้ง RSA และ ECDSA
- Certificate chain ต้อง complete และ trusted

**TLS versions:**

| Version | CloudFront Support | Security |
|---------|-------------------|----------|
| **TLSv1.0** | Deprecated (will be removed) | Weak — ไม่ควรใช้ |
| **TLSv1.1** | Deprecated | Weak |
| **TLSv1.2** | ✅ Supported | Secure |
| **TLSv1.3** | ✅ Supported | Most Secure |

### 6.2 Field-Level Encryption

Encrypt sensitive fields ใน request payload ที่ edge — แม้แต่ CloudFront ก็ไม่เห็น plaintext:

```
Request with sensitive data:
{
  "cardNumber": "4111111111111111",
  "expiry": "12/26",
  "cvv": "123",
  "amount": 99.99
}

Field-Level Encryption Config:
- cardNumber: Encrypt with CloudFront public key
- cvv: Encrypt with CloudFront public key
- Other fields: Pass through as-is
```

**Flow:**
```
1. User POST /checkout with card details
2. CloudFront edge encrypts cardNumber + cvv fields
3. CloudFront forwards encrypted fields to origin
4. Origin has private key, decrypts cardNumber + cvv
5. Origin processes payment
```

**Requirements:**
- RSA 2048-bit key pair
- Public key upload to CloudFront
- Private key อยู่ที่ origin server
- Supported fields: up to 10 field patterns

**Use cases:**
- Payment processing (credit card numbers)
- Healthcare data (PHI)
- SSN / government IDs
- Passwords

### 6.3 Signed URLs — Deep Dive

Signed URLs ป้องกัน unauthorized access โดยการ encode policy และ signature ใน URL:

**Components of a signed URL:**
```
https://dxxxxx.cloudfront.net/private/video.mp4?
  Policy=eyJTdGF0ZW1lbnQiOiBbeyJOYW1lIjoi...      ← JSON policy (Base64)
  &Signature=mBBXt6t...                         ← HMAC signature
  &Key-Pair-Id=K2...                             ← CloudFront key pair ID
```

**Policy options:**

| Policy Type | Description |
|-------------|-------------|
| ** canned policy** | Simple, fixed expiration — น้อย options |
| **Custom policy** | Full control — IP restriction, path restriction, expiration, start time |

**Canned policy (simplified):**
```python
# ใช้ CloudFront key pair
url = cloudfront_sign.generate_presigned_url(
    f"https://dxxxxx.cloudfront.net/private/video.mp4",
    key_pair_id="K2XXXXXXXXX",
    private_key_string=private_key,
    date_less_than=datetime(2024, 12, 31)
)
```

**Custom policy (full control):**
```json
{
  "Statement": [
    {
      "Resource": "https://dxxxxx.cloudfront.net/private/*",
      "Condition": {
        "DateLessThan": {"AWS:EpochTime": 1735689600},
        "DateGreaterThan": {"AWS:EpochTime": 1693526400},
        "IpAddress": {"AWS:SourceIp": "203.0.113.0/24"}
      }
    }
  ]
}
```

**Key pairs:**
- สร้าง key pair ใน AWS console (IAM)
- Private key อยู่ที่ application
- Public key upload ไป CloudFront (สร้าง Trusted Key Group)
- สามารถมีหลาย key pairs สำหรับ rotation

### 6.4 Signed Cookies

ใช้ signed cookies แทน signed URLs สำหรับ protect หลาย files:

**Cookie names:**
```
CloudFront-Expires=1735689600
CloudFront-Signature=abc123...
CloudFront-Key-Pair-Id=K2XXXXXXXXX
```

**Use cases:**
- ให้ user access หลาย files ด้วย 1 signature
- ไม่ต้อง embed signature ใน URL
- ซ่อน URL ของ premium content

### 6.5 Geo-Restrictions (Geo-Blocking)

**Method 1: CloudFront Geo-Restriction (Built-in)**
```
Enable Geo-Restriction:
├── Type: Blacklist หรือ Whitelist
└── Countries: [CN, RU, KP, ...] หรือ [US, TH, SG, ...]
```

**Countries ที่ block ได้:** ทุก country code ตาม ISO 3166-1 alpha-2

**Method 2: CloudFront Functions (Custom Logic)**
```javascript
function handler(event) {
    var request = event.request;
    var country = request.headers['cloudfront-viewer-country'];
    
    if (country.value === 'XX') {
        return {
            statusCode: 403,
            statusDescription: 'Forbidden',
            body: 'Content not available in your region'
        };
    }
    return request;
}
```

**Method 3: Route 53 + CloudFront**
```
Route 53 Geolocation → Different CloudFront distributions
                      → Geo-restricted origins
```

**CloudFront Viewer Country Header:**
```
cloudfront-viewer-country: TH    (2-letter ISO code)
cloudfront-viewer-country-region: Asia    (continent)
cloudfront-viewer-is-beta-gk: true    (beta group)
```

### 6.6 AWS WAF Integration — Deep Dive

AWS WAF คือ Web Application Firewall ที่ integrate กับ CloudFront:

**How it works:**
```
[Request] → [CloudFront] → [AWS WAF Rules] → [Origin]
                    ↓
            If rule matches → Block / CAPTCHA / Allow
```

**Rule Types:**

| Rule Type | Description |
|-----------|-------------|
| **IP Set** | Block/allow specific IP addresses or ranges |
| **Geographic Match** | Block/allow countries |
| **Rate-based Rule** | Block IP ที่ exceed request rate |
| **Regex Pattern Set** | Match URI/path patterns |
| **AWS Managed Rules** | Pre-configured rule sets (OWASP, etc.) |
| **Byte Match** | Match specific bytes in request |

**AWS Managed Rule Groups:**

| Rule Group | Description |
|------------|-------------|
| **AWSManagedRulesCommonRuleSet** | Basic threats: SQLi, XSS,_local file inclusion |
| **AWSManagedRulesAdminProtectionRuleSet** | Protect admin pages |
| **AWSManagedRulesKnownBadInputsRuleSet** | Known bad patterns |
| **AWSManagedRulesAnonymousIpList** | Block bots, VPNs, TOR |
| **AWSManagedRulesAmazonIpReputationList** | AWS threat intelligence |
| **AWSManagedRulesBotControlRuleSet** | Detect and block bots |
| **AWSManagedRulesSQLiRuleSet** | SQL injection protection |

**WAF Rule Action:**

| Action | Behavior |
|--------|----------|
| **Allow** | Pass ผ่านไป origin |
| **Block** | Return 403 Forbidden |
| **Count** | Log but don't block (for testing) |
| **CAPTCHA** | Show CAPTCHA challenge |
| **Challenge** | Silent JavaScript challenge |

**Rate-Based Rules:**
```
Rate limit: 100 requests per 5 minutes per IP
Above threshold → Block for 5 minutes
```

**Bot Control:**
- Detect crawlers, scrapers, scanners
- Categorize: AI bots, search engine bots, social media bots
- Challenge or block non-verified bots

### 6.7 AWS Shield — Deep Dive

**AWS Shield Standard (free with CloudFront):**

| Protection | Description |
|------------|-------------|
| **DDoS mitigation** | Automatic detection and mitigation |
| **Network layer** | SYN/UDP floods, reflection attacks |
| **Application layer** | HTTP floods, DNS floods |
| **AWS backbone** | Attack traffic ถูก absorb โดย AWS global network |

**AWS Shield Advanced ($3,000/month):**

| Feature | Description |
|---------|-------------|
| **Enhanced DDoS protection** | Higher capacity, more sophisticated attacks |
| **24/7 DDoS Response Team (DRT)** | AWS engineers ช่วย mitigate |
| **Cost protection** | Reimburse for scaled resources during attack |
| **Real-time attack visualization** | CloudWatch metrics + attack dashboard |
| **Attack diagnostics** | Detailed reports |
| **AWS WAF rules** | Shield Advanced ได้ WAF rules ฟรี (normally pay per rule) |
| **Proactive engagement** | AWS ติดต่อเมื่อ detect volumetric attack |

**Shield Advanced Attack Flow:**
```
1. Volumetric attack detected (> 100 Gbps or > 100 Mpps)
2. AWS DRT notified automatically
3. DRT implements mitigation (scrubbing, route changes)
4. Customer notified via AWS Support
5. Post-attack report provided
```

### 6.8 Private Content Architecture

**Complete private content flow:**
```
1. App server authenticates user
2. App generates signed URL with:
   - Resource path: /premium/video.mp4
   - Expiration: 1 hour
   - IP restriction (optional): user's IP
3. User accesses: https://dxxx.cloudfront.net/premium/video.mp4?Policy=...&Signature=...&Key-Pair-Id=...
4. CloudFront validates signature:
   ├── Valid + not expired → Serve content
   ├── Expired              → 403 Forbidden
   ├── Wrong IP             → 403 Forbidden
   └── Invalid signature    → 403 Forbidden
5. CloudFront checks cache
6. Origin returns content
7. Content returned to user
```

---

## 7. CloudFront Functions และ Lambda@Edge — Edge Computing

### 7.1 CloudFront Functions — Edge Logic at Lightweight Scale

CloudFront Functions ใช้ JavaScript (ES 5.1) และ run เร็วมาก (< 5ms):

**Event Flow with CloudFront Functions:**
```
Viewer Request
    ↓
[viewer-request] CloudFront Function
    ↓
Cache Lookup
    ↓
Origin Request (if cache miss)
    ↓
Origin Response
    ↓
Cache Store
    ↓
[viewer-response] CloudFront Function
    ↓
Viewer Response
```

### 7.2 CloudFront Functions — Common Use Cases

**1. URL Redirects and Rewrites**
```javascript
function handler(event) {
    var request = event.request;
    
    // Redirect /old-path/* to /new-path/*
    if (request.uri.startsWith('/old-path/')) {
        var newUri = request.uri.replace('/old-path/', '/new-path/');
        return {
            statusCode: 302,
            statusDescription: 'Found',
            headers: {
                location: { value: newUri }
            }
        };
    }
    
    return request;
}
```

**2. Header Manipulation**
```javascript
function handler(event) {
    var request = event.request;
    
    // Add custom header
    request.headers['x-custom-header'] = { value: 'my-value' };
    
    // Override origin header
    request.headers['x-forwarded-for'] = { value: '1.2.3.4' };
    
    // Remove sensitive header
    delete request.headers['x-api-key'];
    
    return request;
}
```

**3. Token Validation (JWT)**
```javascript
function handler(event) {
    var request = event.request;
    var token = request.headers['authorization'];
    
    if (!token) {
        return {
            statusCode: 401,
            statusDescription: 'Unauthorized'
        };
    }
    
    // Validate JWT, extract user ID
    var userId = validateJWT(token.value);
    
    // Add to request for origin
    request.headers['x-user-id'] = { value: userId };
    
    return request;
}
```

**4. A/B Testing**
```javascript
function handler(event) {
    var request = event.request;
    
    // Check if user has variant cookie
    var cookie = request.headers['cookie'];
    var variant = extractCookie(cookie, 'ab_variant');
    
    if (!variant) {
        // New user: random assignment
        variant = Math.random() < 0.5 ? 'A' : 'B';
        
        // Add Set-Cookie header in response function
        request.headers['x-assigned-variant'] = { value: variant };
    }
    
    // Rewrite URL based on variant
    request.uri = request.uri.replace('/checkout', '/checkout-' + variant.toLowerCase());
    
    return request;
}
```

**5. Generate Signed URLs**
```javascript
function handler(event) {
    var request = event.request;
    
    // Check if path requires signed URL
    if (request.uri.startsWith('/premium/')) {
        // Redirect to app server for signed URL generation
        return {
            statusCode: 302,
            headers: {
                location: { value: `https://app.example.com/auth?redirect=${encodeURIComponent(request.uri)}` }
            }
        };
    }
    
    return request;
}
```

### 7.3 Lambda@Edge — Full Compute at Edge

Lambda@Edge run ด้วย Node.js หรือ Python ที่ edge locations:

**Event Flow with Lambda@Edge:**
```
Viewer Request
    ↓
[viewer-request] Lambda@Edge
    ↓
Cache Lookup
    ↓
Origin Request
    ↓
[origin-request] Lambda@Edge
    ↓
Origin Response
    ↓
[origin-response] Lambda@Edge
    ↓
Cache Store
    ↓
[viewer-response] Lambda@Edge
    ↓
Viewer Response
```

### 7.4 Lambda@Edge — Common Use Cases

**1. Personalization (Geolocation-based)**
```javascript
const countries = {
    'US': { currency: 'USD', lang: 'en-US' },
    'TH': { currency: 'THB', lang: 'th-TH' },
    'JP': { currency: 'JPY', lang: 'ja-JP' }
};

exports.handler = async (event) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    
    const country = headers['cloudfront-viewer-country']?.[0]?.value || 'US';
    const config = countries[country] || countries['US'];
    
    // Modify request to origin
    request.headers['x-currency'] = [{ key: 'X-Currency', value: config.currency }];
    request.headers['x-lang'] = [{ key: 'X-Lang', value: config.lang }];
    
    // Or modify response from origin
    // (use origin-response trigger)
    
    return request;
};
```

**2. Dynamic Origin Selection**
```javascript
exports.handler = async (event) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const country = headers['cloudfront-viewer-country']?.[0]?.value;
    
    // Route to different origins based on country
    if (country === 'EU') {
        request.origin = {
            custom: {
                domainName: 'eu-backend.example.com',
                port: 443,
                protocol: 'https',
                path: '',
                sslProtocols: ['TLSv1.2'],
                certTypes: 'RSA'
            }
        };
        request.headers['host'] = [{ key: 'Host', value: 'eu-backend.example.com' }];
    }
    
    return request;
};
```

**3. Real-Time Image Transformation**
```javascript
// Sharp library for image processing
const Sharp = require('sharp');

exports.handler = async (event) => {
    const request = event.Records[0].cf.request;
    const params = new URLSearchParams(request.querystring);
    
    const width = params.get('w') || 800;
    const format = params.get('f') || 'webp';
    
    // This would need to fetch original from origin first
    // and then transform - requires origin-response or custom origin
    
    return request;
};
```

**4. Request Filtering and Validation**
```javascript
exports.handler = async (event) => {
    const request = event.Records[0].cf.request;
    
    // Block requests with suspicious patterns
    const uri = request.uri;
    const suspicious = ['.env', '.git', 'wp-admin', 'config.php'];
    
    for (const pattern of suspicious) {
        if (uri.includes(pattern)) {
            return {
                statusCode: 403,
                statusDescription: 'Forbidden',
                body: 'Access denied'
            };
        }
    }
    
    return request;
};
```

**5. CloudFront Access Log Aggregation**
```javascript
// Process and forward logs to Kinesis
const AWS = require('aws-sdk');

exports.handler = async (event) => {
    const record = event.Records[0];
    
    // Parse log data
    const logEntry = {
        timestamp: new Date().toISOString(),
        uri: record.cf.request.uri,
        status: record.cf.response.status,
        latency: record.latency
    };
    
    // Send to Kinesis
    const kinesis = new AWS.KinesisFirehose();
    await kinesis.putRecord({
        DeliveryStreamName: 'my-stream',
        Record: { Data: JSON.stringify(logEntry) }
    }).promise();
    
    return record.cf.response;
};
```

### 7.5 CloudFront Functions vs Lambda@Edge — Detailed Comparison

| Feature | CloudFront Functions | Lambda@Edge |
|---------|---------------------|------------|
| **Language** | JavaScript (ES 5.1) | Node.js 18.x, Python 3.11 |
| **Execution time** | < 5 ms | Up to 30 seconds |
| **Memory** | 2 MB | 128 MB – 10 GB |
| **Max request/response** | 100 KB | 1 MB |
| **Pricing** | Free: 2M invocations/month, then $0.50/million | Charged: invocations + duration + requests |
| **npm packages** | ❌ No | ✅ Yes (limited set) |
| **Network access** | ❌ No | ✅ Yes (outbound calls) |
| **AWS SDK** | ❌ No | ✅ Yes (IAM, DynamoDB, S3, etc.) |
| **Reading local files** | ❌ No | ❌ No |
| **Async operations** | ❌ No (sync only) | ✅ Async/Promises |
| **Trigger events** | viewer-request, viewer-response | All 4 triggers |
| **Edge-specific runtime** | ✅ Native at edge | ✅ Native at edge |
| **Cold start** | ~5 ms | ~100-200 ms |
| **Concurrent executions** | Millions/second | 1000s/second per region |
| **ECMAScript** | 5.1 | 2017+ (Node.js) |

### 7.6 Trigger Event Types — Full Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        REQUEST PATH                                  │
│                                                                      │
│  [Viewer]                                                            │
│      │                                                               │
│      ▼ viewer-request                                               │
│  [CloudFront Functions / Lambda@Edge]  ← First chance to modify     │
│      │                                                               │
│      ▼ Cache Lookup                                                  │
│  [Cache HIT? ──No──→ Origin Request]                                │
│      │Yes                                                            │
│      ▼                                                               │
│  [Cache Return]                                                      │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                       RESPONSE PATH                                  │
│                                                                      │
│  [Origin Response]  ← [Lambda@Edge: origin-response]               │
│      │                                                               │
│      ▼ Cache Store (if cacheable)                                    │
│                                                                      │
│  [viewer-response] ← [CloudFront Functions / Lambda@Edge]           │
│      │               ← Last chance to modify                          │
│      ▼                                                               │
│  [Viewer]                                                            │
└─────────────────────────────────────────────────────────────────────┘
```

**viewer-request:** ใช้สำหรับ authenticate, redirect, modify URL, add headers
**origin-request:** ใช้สำหรับ modify request ก่อนส่งไป origin (หลัง cache miss)
**origin-response:** ใช้สำหรับ modify response จาก origin ก่อน cache
**viewer-response:** ใช้สำหรับ add/set cookies, modify headers ก่อน return ให้ viewer

---

## 8. Route 53 Integration

### 8.1 DNS Routing with CloudFront

Route 53 จัดการ DNS สำหรับ CloudFront:

**CNAME setup:**
```
cdn.example.com → CNAME → dxxxxxxx.cloudfront.net
```

**Route 53 Routing Policies ที่ใช้กับ CloudFront:**

| Policy | Description | Use Case |
|--------|-------------|----------|
| **Latency** | Route ไป edge ที่มี latency ต่ำสุด | Global apps |
| **Geolocation** | Route ตาม geography | Region-specific content |
| **Geo-Proximity** | Route ตาม location + bias | Traffic steering |
| **IP-based** | Route ตาม IP ranges | Custom routing |
| **Simple** | Single value | Simple setups |

### 8.2 Latency-Based Routing

```
User (Tokyo) → Route 53 Latency check
             → Tokyo edge (lowest latency) available?
             → Yes: Route to Tokyo edge
             → No: Route to nearest healthy edge
```

### 8.3 Multi-Region with CloudFront

```
[Route 53 Latency] 
    ├── User in US → CloudFront US edge → S3 US-East
    ├── User in EU → CloudFront EU edge → S3 EU-West
    └── User in AP → CloudFront AP edge → S3 AP-Southeast-1
```

### 8.4 Route 53 Health Checks + CloudFront

```
[Route 53 Health Check] 
    ├── Origin healthy → CloudFront uses origin
    └── Origin unhealthy → Failover to backup
```

---

## 9. CloudFront with S3 — ฉบับละเอียด

### 9.1 Two Ways to Use S3 as Origin

**Method 1: S3 REST API Endpoint (Recommended for CloudFront)**
```
Origin: my-bucket.s3.us-east-1.amazonaws.com
→ CloudFront connects to S3 REST API
→ S3 validates via bucket policy or ACL
→ OAI หรือ bucket policy ใช้ restrict access
```

**Method 2: S3 Website Endpoint (for static website hosting)**
```
Origin: my-bucket.s3-website.us-east-1.amazonaws.com
→ S3 website endpoint (no SSL to origin)
→ Only supports HTTP
→ No OAI support
→ Use when S3 website redirect rules needed
```

### 9.2 OAI (Origin Access Identity)

OAI ทำให้เฉพาะ CloudFront เข้าถึง S3 ได้:

**Without OAI (Public bucket):**
```
CloudFront → S3 bucket → Everyone on internet can access!
```

**With OAI (Private bucket):**
```
CloudFront (with OAI) → S3 bucket (block all public)
                       → Only CloudFront can access via OAI
```

**Steps to configure OAI:**
```
1. Create OAI in CloudFront
2. Update S3 bucket policy to allow OAI
3. Remove public access block (if needed)
4. CloudFront always uses OAI to access S3
```

**OAI Bucket Policy:**
```json
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "CloudFront OAI",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity EXAMPLE"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-bucket/*"
    }
  ]
}
```

### 9.3 S3 Access Points with CloudFront

S3 Access Points ช่วยจัดการหลาย teams/applications:

```
CloudFront → Access Point: team-a-access
           → Access Point: team-b-access
           → Access Point: analytics-access
```

**Access Point policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity EXAMPLE"},
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:us-east-1:account:accesspoint/team-a-access/object/*"
    }
  ]
}
```

### 9.4 S3 + CloudFront + Origin Shield

**For high-traffic S3 origins:**
```
[Edge Locations] → [Origin Shield: single global endpoint]
                → [S3 bucket] (with Cross-Region Replication)
```

**Benefits:**
- S3 รองรับ 50,000 TPS per prefix
- Origin Shield เพิ่ม cache efficiency
- ลด S3 request costs (Origin Shield → S3 ถูกกว่า Edge → S3)

---

## 10. CloudFront with EC2 / ELB / ALB

### 10.1 Custom Origin Architecture

```
[Users] → [CloudFront Edge] → [ELB/ALB] → [EC2 Instances]
                                    ↓
                              [Auto Scaling Group]
                                    ↓
                              [Private subnets]
```

### 10.2 Origin Configuration

```
Origin Domain: my-alb.elb.us-east-1.amazonaws.com
Origin Protocol: HTTPS only (recommended)
Origin SSL Protocols: TLSv1.2, TLSv1.3 (drop TLSv1.0, 1.1)
Origin HTTP Port: 80
Origin HTTPS Port: 443
Origin Timeout: 30 seconds (or 60, 100, 180)
Origin Keep-alive Timeout: 5 seconds (for connection reuse)
```

### 10.3 Security Groups for Origin

**ELB Security Group (inbound):**
```
Allow from: CloudFront IP ranges (18.164.0.0/15 and others)
           OR CloudFront OAI principal
```

**EC2 Security Group (inbound from ELB):**
```
Allow from: ELB security group
```

### 10.4 CloudFront + ELB Benefits

| Benefit | Description |
|---------|-------------|
| **SSL termination** | CloudFront handles HTTPS, ELB receives HTTP |
| **DDoS protection** | Shield + WAF + CloudFront front |
| **Cache static** | Static content cached, dynamic goes to ELB |
| **Geo-routing** | Route 53 + CloudFront for global users |
| **Reduced origin load** | Only uncached requests hit ELB |
| **Connection reuse** | CloudFront keeps connections to ELB alive |

---

## 11. CloudFront Streaming — Deep Dive

### 11.1 Video Streaming Protocols

**HLS (HTTP Live Streaming) — Apple:**
```
Playlist (.m3u8):  #EXTM3U
Segment (.ts):     10-second segments

#EXT-X-PLAYLIST-TYPE:EVENT
#EXT-X-TARGETDURATION:10
#EXTINF:10.0,
segment1.ts
#EXTINF:10.0,
segment2.ts
```

**DASH (Dynamic Adaptive Streaming over HTTP):**
```
Manifest (.mpd):
<MPD>
  <Period>
    <AdaptationSet>
      <Representation id="720p" bandwidth="4000000">
        <BaseURL>segment_720p_000.m4s</BaseURL>
      </Representation>
    </AdaptationSet>
  </Period>
</MPD>
```

**Adaptive Bitrate (ABR):**
```
Quality Level 1: 1080p, 8 Mbps
Quality Level 2: 720p, 4 Mbps
Quality Level 3: 480p, 2 Mbps
Quality Level 4: 360p, 1 Mbps
Quality Level 5: 240p, 500 Kbps

Player automatically selects based on:
- Available bandwidth
- Device capability
- Player buffer level
```

### 11.2 CloudFront + MediaPackage

**Architecture:**
```
[Encoder/Live] → [MediaPackage Channel] 
              → [HLS, DASH, CMAF] → [CloudFront] → [Players]
```

**MediaPackage features:**
- Just-in-time packaging
- DVR (sliding window)
- Ad insertion (SSAI)
- DRM (Digital Rights Management)
- Origin shielding (built-in)

### 11.3 Signed URLs for Streaming

**Streaming URL with expiration:**
```
https://dxxxxx.cloudfront.net/live/stream.m3u8?
  Policy=eyJTdGF0ZW1lbnQiOiBb...&
  Signature=abc123...&
  Key-Pair-Id=K2...
```

**Time-restricted streaming:**
```python
# Generate signed URL valid for 1 hour
expiration = datetime.now() + timedelta(hours=1)
signed_url = generate_signed_url(
    f"https://dxxxxx.cloudfront.net/live/{stream_id}/index.m3u8",
    key_pair_id=KEY_PAIR_ID,
    private_key=PRIVATE_KEY,
    date_less_than=expiration
)
```

### 11.4 CloudFront for VOD (Video on Demand)

**Architecture:**
```
[Source Videos in S3] 
    ↓ (ingest)
[MediaConvert / MediaPackage]
    ↓ (transcode to multiple qualities)
[S3 Output Bucket] 
    ↓
[CloudFront] → [Web Players]
```

**Cache optimization for VOD:**
```
Cache Policy: CachingOptimized
TTL:
- Manifest files (.m3u8): 5 seconds (changes frequently)
- Video segments (.ts, .m4s): 1 hour (don't change)
- Thumbnails: 24 hours
```

---

## 12. Monitoring และ Observability

### 12.1 CloudFront Monitoring Tools

| Tool | Description | Latency |
|------|-------------|---------|
| **CloudFront Console** | Real-time graphs | Minutes |
| **CloudWatch Metrics** | Numeric data points | Minutes |
| **CloudWatch Alarms** | Alert on thresholds | Minutes |
| **CloudFront Real-Time Logs** | Stream to Kinesis | Seconds |
| **CloudFront Standard Logs** | S3 access logs | 20 min - 24 hr |
| **AWS CloudTrail** | API call logs | Hours |

### 12.2 CloudWatch Metrics — Full List

**Request Metrics:**

| Metric | Description |
|--------|-------------|
| **Requests** | Total requests (all methods) |
| **BytesDownloaded** | Data from CloudFront to viewers |
| **BytesUploaded** | Data from viewers to CloudFront |
| **TotalErrorRate** | % of all requests with 4xx or 5xx |
| **4xxErrorRate** | % of requests returning 4xx |
| **5xxErrorRate** | % of requests returning 5xx |

**Cache Metrics:**

| Metric | Description |
|--------|-------------|
| **CacheHitRate** | % of viewer requests served from cache |
| **Requests** by CacheStatus | `Hit`, `Miss`, `RefreshHit`, `Error` |
| **OriginLatency** | Time from CloudFront to origin |
| **OriginRequestCount** | Requests to origin (cache misses) |

**Lambda@Edge Metrics:**

| Metric | Description |
|--------|-------------|
| **LambdaInvocationRate** | Invocations per second |
| **LambdaExecutionErrorRate** | % of invocations with errors |
| **LambdaValidatorErrorCount** | Invalid function responses |

**Detailed Metrics by Status Code:**
- `4xxDocumentLatency` — Latency for 4xx responses
- `5xxDocumentLatency` — Latency for 5xx responses
- Per status code: `RequestsByStatusCode 200`, `RequestsByStatusCode 304`, etc.

### 12.3 CloudFront Real-Time Logs

**Real-time log fields (choose which to include):**
```
timestamp, request_ip, request_method, request_uri, 
request_query, response_code, referrer, 
cloudfront_viewer_country, cloudfront_viewer_region,
cloudfront_viewer_city, cloudfront_viewer_postal_code,
cloudfront_viewer_time_zone, cloudfront_viewer_latitude,
cloudfront_viewer_longitude, cloudfront_viewer_asn,
x-edge-location, x-edge-request-id, 
sc-status, sc-content-type, sc-content-len,
sc-range-start, sc-range-end, cs-protocol, 
cs-method, cs-host, cs-uri-stem
```

**Kinesis Data Firehose destinations:**
- Amazon S3
- Amazon Redshift
- Amazon OpenSearch Service
- Splunk
- Custom HTTP endpoint

### 12.4 CloudWatch Alarms — Best Practices

**Critical alarms:**
```bash
# 5xx error rate too high
aws cloudwatch put-metric-alarm \
  --alarm-name "CloudFront-5xx-High" \
  --metric-name 5xxErrorRate \
  --namespace AWS/CloudFront \
  --statistic Average \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --dimensions Name=DistributionId,Value=EXXXXX

# Cache hit rate too low
aws cloudwatch put-metric-alarm \
  --alarm-name "CloudFront-CacheHitRate-Low" \
  --metric-name CacheHitRate \
  --namespace AWS/CloudFront \
  --statistic Average \
  --period 3600 \
  --threshold 70 \
  --comparison-operator LessThanThreshold \
  --dimensions Name=DistributionId,Value=EXXXXX

# Origin latency too high
aws cloudwatch put-metric-alarm \
  --alarm-name "CloudFront-OriginLatency-High" \
  --metric-name OriginLatency \
  --namespace AWS/CloudFront \
  --statistic Average \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold \
  --dimensions Name=DistributionId,Value=EXXXXX
```

### 12.5 CloudFront Dashboard — Key Metrics to Watch

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| **Cache Hit Rate** | > 90% | 70-90% | < 70% |
| **5xx Error Rate** | < 0.1% | 0.1-1% | > 1% |
| **4xx Error Rate** | < 1% | 1-5% | > 5% |
| **Origin Latency** | < 100ms | 100ms-1s | > 1s |
| **Requests** | Baseline | 2x baseline | 10x baseline |

---

## 13. Cache Invalidation — Deep Dive

### 13.1 Invalidation Patterns

| Pattern | Invalidate |
|---------|-----------|
| `/images/photo.jpg` | Single file |
| `/images/*` | All under /images/ |
| `/*` | Everything |
| `/videos/*.mp4` | All mp4 files |
| `/api/data/*` | Everything under /api/data/ |

### 13.2 Invalidation vs Versioned URLs

**Versioned URLs (Recommended):**
```
# Old version
/images/v1/photo.jpg

# New version
/images/v2/photo.jpg
```

**Why versioned URLs are better:**
- Instant propagation
- No CloudFront charges for invalidation
- Users can access both versions
- Rollback ได้ง่าย
- Browser cache ทำงานถูกต้อง

**When to use invalidation:**
- Security vulnerability (need to remove NOW)
- Incorrect content deployed
- Can't change URLs (embedded in external sites)
- Emergency response

### 13.3 Invalidation Batch

**CLI:**
```bash
# Invalidate specific files
aws cloudfront create-invalidation \
  --distribution-id EXXXXX \
  --paths "/images/photo1.jpg" "/images/photo2.jpg" "/videos/*"

# Invalidate everything (use sparingly)
aws cloudfront create-invalidation \
  --distribution-id EXXXXX \
  --paths "/*"
```

**Limits:**
- 3 concurrent invalidations per distribution
- 3,000 paths per invalidation request
- Unlimited files when using wildcards

### 13.4 Cache Tags

Cache tags ช่วย organize และ track CloudFront resources:
```
Tag: Environment=Production
Tag: Team=Frontend
Tag: CostCenter=Marketing
```

**Use for:**
- Cost allocation
- Team ownership
- Environment separation

---

## 14. Performance Optimization

### 14.1 Cache Hit Rate Optimization

**Target:**
- Static content: > 95%
- Dynamic content: depends on use case

**Strategies:**
```
1. Separate static and dynamic paths
   /static/*   → Cache 1 week
   /api/*      → No cache or short TTL

2. Use appropriate query strings
   Whitelist: version, locale
   Ignore: session, tracking

3. Consistent URLs
   Use: /images/logo.png?v=123
   Not: /images/logo.png (ถ้า content เปลี่ยนแล้ว URL เหมือนเดิม)

4. Cache OPTIONS requests
   Enable: Cache OPTIONS requests
   Or: Origin custom headers

5. Compress content
   Enable: Auto compress (Brotli + Gzip)
   Benefit: Smaller files = faster delivery + higher cache efficiency
```

### 14.2 HTTP/2 and HTTP/3 Optimization

**HTTP/2 benefits for CloudFront:**
```bash
Enable HTTP/2 and HTTP/3 in distribution settings
→ Multiplexing: หลาย requests บน 1 connection
→ Header compression: ลด overhead
→ Server push: push resources ที่ browser ยังไม่ request
```

**HTTP/3 (QUIC) benefits:**
```
→ 0-RTT resumption: connect เร็วขึ้น for returning users
→ No head-of-line blocking: stream หนึ่ง blocked ไม่ block อื่น
→ Better on lossy networks: เหมาะกับ mobile
```

### 14.3 Brotli Compression

CloudFront compresses with both Gzip and Brotli:
```
Brotli: Better compression ratio than Gzip (20-30% smaller)
Gzip:  Fallback for older clients

CloudFront auto-selects:
Viewer supports Brotli? → Brotli
Viewer supports only Gzip? → Gzip
Otherwise → Uncompressed
```

### 14.4 Prefetching and Preloading

**Link prefetch:**
```html
<!-- Browser hints -->
<link rel="prefetch" href="/images/next-page.jpg">
<link rel="preload" href="/critical/font.woff2">
```

**CloudFront functions for prefetch:**
```javascript
// On current page response, inject prefetch headers
function handler(event) {
    var response = event.response;
    
    // Add prefetch for likely next page
    response.headers['x-prefetch-url'] = {
        value: 'https://dxxxxx.cloudfront.net/images/next-page.jpg'
    };
    
    return response;
}
```

### 14.5 Connection Pooling and Keep-Alive

**CloudFront → Origin:**
```
Connection Pooling:
- Maintains persistent connections to origin
- Reuses connections across requests
- Reduces origin load (no TCP/TLS handshake per request)

Keep-alive timeout: 5 seconds (default)
Max connections per origin: unlimited
```

---

## 15. Price Classes — Cost Optimization

### 15.1 Price Class Details

| Class | Edge Locations | Monthly Cost Estimate (per GB) |
|-------|---------------|--------------------------------|
| **All** | 200+ global | $0.085 (first 10 TB, US) |
| **200** | Most excluding most expensive | ~15-30% cheaper |
| **100** | Only cheapest (US, EU) | ~50% cheaper |

**Most expensive regions (excluded in 200):**
- South America (Brazil)
- Asia Pacific (India, Japan, Australia)
- Africa

### 15.2 Data Transfer Costs

**CloudFront Data Transfer Out (to internet):**
| Tier | Price (US) |
|------|-----------|
| First 10 TB/month | $0.085/GB |
| 10-50 TB | $0.080/GB |
| 50-150 TB | $0.070/GB |
| 150+ TB | Contact AWS |

**CloudFront Data Transfer Out (to origin):**
- Free (AWS origin)
- Same as EC2 rates (non-AWS origin)

### 15.3 Request Costs

| Request Type | Price (per 10,000) |
|-------------|-------------------|
| HTTP | $0.0075 |
| HTTPS | $0.01 |
| Invalidation | Free (first 1,000 paths), then $0.005/path |

### 15.4 Cost Optimization Strategies

1. **Choose correct Price Class** — ถ้า audience อยู่แค่ US/EU ใช้ 200
2. **Maximize cache hit rate** — ลด origin requests = ลด cost
3. **Enable compression** — ลด data transfer
4. **Use Origin Shield** — ลด S3/origin request costs
5. **Delete unused distributions** — avoid idle charges
6. **Monitor with Cost Explorer** — track CloudFront costs by distribution
7. **Use free tier wisely** — CloudFront Functions free tier 2M/month

---

## 16. Limits

| Limit | Value | Can Increase? |
|-------|-------|--------------|
| **Distributions per account** | 200 | ✅ Yes (soft limit) |
| **CNAMEs per distribution** | 100 | ❌ No |
| **Cache behaviors per distribution** | 25 | ❌ No |
| **Origin groups per distribution** | 10 | ❌ No |
| **Alternate domain certificates** | 1 | ❌ No |
| **Invalidation paths per request** | 3,000 | ❌ No |
| **Concurrent invalidations** | 3 per distribution | ❌ No |
| **Whitelist query strings** | 10 | ❌ No |
| **Trusted key groups** | 4 | ❌ No |
| **Key groups per distribution** | 4 | ❌ No |
| **Public keys per key group** | 5 | ❌ No |
| **Max object size** | 20 GB | ❌ No |
| **Lambda@Edge functions per region** | 100 | ✅ Yes |
| **Lambda@Edge concurrent executions** | 1,000 per region | ✅ Yes |
| **CloudFront Functions invocations** | 2M/month free | N/A |

---

## 17. AWS Global Accelerator vs CloudFront

| Feature | CloudFront | Global Accelerator |
|---------|-----------|-------------------|
| **Type** | CDN + Service Edge | Anycast network |
| **Caching** | ✅ Yes (HTTP/S content) | ❌ No (direct proxy) |
| **HTTP features** | HTTP/S, HTTP/2, HTTP/3 | TCP/UDP (any protocol) |
| **Protocols** | HTTP, HTTPS only | Any protocol (SSH, RDP, gaming, VoIP) |
| **Use case** | Web content, video, APIs | Gaming servers, IoT, non-HTTP |
| **Performance** | Fast for cached content | Fastest for any traffic |
| **Static IP** | ❌ No | ✅ Yes (2 anycast IPs) |
| **DDoS protection** | Shield Standard | Shield Standard |
| **Health checks** | Basic | Advanced (TCP, HTTP, HTTPS) |
| **Edge logic** | ✅ Functions/Lambda@Edge | ❌ No |
| **Cost** | Request + transfer | Hourly + transfer |

**When to use Global Accelerator:**
- Non-HTTP workloads (SSH, database)
- Gaming servers
- VoIP applications
- IoT devices
- Static IPs required
- Traffic to non-HTTP backends

**When to use CloudFront:**
- Web content
- Video streaming
- REST APIs
- Need edge computing
- Security features (WAF, signed URLs)

---

## 18. Architecture Patterns

### 18.1 Static Website with Full Security

```
[Route 53] → [CloudFront Distribution]
                    ↓
              [S3 Bucket (OAI only)]
                    ↓
         [CloudFront Functions (redirects, headers)]
                    ↓
         [AWS WAF (IP block, rate limit, SQL/XSS)]
                    ↓
         [AWS Shield Standard (DDoS protection)]
```

### 18.2 Multi-Tier Web Application

```
                    ┌─ [/static/*] → [S3 Origin] → Cache 1 week
[Users] → [CloudFront] ── [/images/*] → [S3 Origin] → Cache 1 day
                    ├─ [/api/*] → [ALB] → [EC2] → [RDS] (no cache)
                    └─ [/admin/*] → [ALB] → [EC2] → Signed URLs only
                              ↓
                      [CloudFront Functions: Auth]
```

### 18.3 Protected Content Distribution

```
[App Server]
  ↓ (authenticated user)
  ├→ Generate signed URL (expire 1 hour, IP restricted)
  ↓
[User] → [CloudFront: /premium/*]
              ↓ (validate signature)
              ├─ Valid: Origin (S3) → Stream
              └─ Invalid: 403 Forbidden
```

### 18.4 Multi-Region Active-Active

```
[Route 53 Latency Routing]
    ├→ [CloudFront US] → [S3 US] ←── S3 Replication ──→ [S3 EU]
    └→ [CloudFront EU] → [S3 EU]
    
[Origin Shield] for each S3:
    CloudFront → Origin Shield US → S3 US
    CloudFront → Origin Shield EU → S3 EU
```

### 18.5 CI/CD with CloudFront

```
[CodePipeline] 
    → [S3 Bucket: /builds/v1.2.3/*]
    → [CloudFront invalidation: /static/*]
    → [Users automatically get new version)

Versioned URLs approach (preferred):
[CodePipeline]
    → [S3 Bucket: /builds/v2.0.0/*]
    → [CloudFront caches v2.0.0 automatically]
    → [No invalidation needed)
```

### 18.6 WAF + Shield + CloudFront Security Stack

```
[Internet Traffic]
    ↓
[AWS Shield Standard] ← Automatic DDoS mitigation
    ↓
[CloudFront Distribution] ← Global edge network
    ↓
[AWS WAF] ← Application layer protection
    ├→ IP reputation list (block bad IPs)
    ├→ AWSManagedRulesCommonRuleSet (SQLi, XSS)
    ├→ Rate-based rule (100 req/min per IP)
    ├→ Geographic restriction (if needed)
    └→ Bot Control (detect scrapers)
    ↓
[CloudFront Functions] ← Edge auth/redirect
    ↓
[Origin (S3/EC2/ALB)] ← Backend
```

---

## 19. Troubleshooting

### 19.1 Common Issues

**Issue: Cache not updating after deploy**
```
Symptoms: Users see old content
Causes:
  - TTL hasn't expired
  - Browser caching
Solutions:
  1. Use versioned URLs (recommended)
  2. Create invalidation for affected paths
  3. Set Cache-Control: no-cache (temporary)
```

**Issue: 403 Forbidden**
```
Causes:
  - S3 bucket not accessible (OAI misconfigured)
  - Signed URL expired
  - Geo-restriction blocking country
  - WAF rule blocking
Solutions:
  1. Check CloudFront error code details
  2. Verify S3 bucket policy allows OAI
  3. Check signed URL expiration
  4. Test with WAF in count mode
```

**Issue: High Origin Latency**
```
Causes:
  - Origin slow to respond
  - No connection pooling
  - Geographic distance
Solutions:
  1. Enable Origin Shield
  2. Increase connection pool
  3. Use regional origins
  4. Scale origin (ELB, ASG)
```

**Issue: SSL/TLS Errors**
```
Causes:
  - Certificate expired
  - Certificate chain incomplete
  - TLS version mismatch
Solutions:
  1. Verify certificate in ACM
  2. Ensure TLSv1.2 minimum
  3. Check origin SSL certificates
```

**Issue: CORS Errors**
```
Causes:
  - Missing CORS headers
  - Origin not returning proper headers
Solutions:
  1. Use Response Headers Policy with CORS headers
  2. Or configure origin to return CORS headers
  3. Check Access-Control-Allow-Origin matches exactly
```

### 19.2 CloudFront Error Codes

| Code | Meaning | Common Cause |
|------|---------|-------------|
| **400** | Bad Request | Malformed request |
| **403** | Forbidden | OAI/S3 denied, geo-block, WAF, signed URL invalid |
| **404** | Not Found | Origin 404, wrong path |
| **502** | Bad Gateway | Origin timeout, origin unreachable |
| **503** | Service Unavailable | Origin overloaded |
| **504** | Gateway Timeout | Origin timeout (longer than 30s) |

### 19.3 Debugging Tools

**CloudFront Dev Tools:**
```bash
# Check cache behavior
curl -I https://dxxxxx.cloudfront.net/path

# Check response headers
X-Cache: Hit from cloudfront
X-Cache: Miss from cloudfront
X-Cache-Redirect: Miss from cloudfront (origin-group failover)
Server: CloudFront
X-Amz-Cf-Id: unique-request-id
```

**CloudWatch Contributor Insights:**
```
# Analyze top clients, URIs, user agents
CloudFront > Contributor Insights > Create rule
```

---

## 20. Best Practices Summary

### Security
1. **ใช้ HTTPS always** — viewer → CloudFront และ CloudFront → origin
2. **ใช้ OAI กับ S3** — ป้องกัน direct bucket access
3. **ใช้ Signed URLs หรือ Signed Cookies** — สำหรับ private content
4. **ใช้ Field-Level Encryption** — สำหรับ sensitive data (credit cards)
5. **ใช้ WAF** — SQL/XSS protection, rate limiting
6. **ใช้ AWS Shield Advanced** — ถ้าเป็น high-profile target
7. **Restrict origin access** — ให้ CloudFront เข้าถึง origin ได้อย่างเดียว
8. **ใช้ Geo-restriction** — ถ้าต้อง block บางประเทศ
9. **Enable DDoS protection** — Shield Standard is free

### Performance
10. **แยก static/dynamic content** — static cache long, dynamic don't cache
11. **Maximize cache hit rate** — target > 90%
12. **ใช้ query string whitelist** — cache efficiently
13. **Enable compression** — Brotli + Gzip
14. **Enable HTTP/2 and HTTP/3** — modern protocols
15. **ใช้ Origin Shield** — สำหรับ high-traffic origins
16. **ใช้ versioned URLs** — แทน invalidation
17. **กระจาย objects** — random prefix ช่วย parallelize
18. **Monitor cache hit ratio** — set CloudWatch alarms
19. **ใช้ Lambda@Edge / CloudFront Functions** — ลด origin work

### Cost
20. **Choose appropriate Price Class** — ถ้า audience อยู่แค่บาง region
21. **Monitor data transfer** — use Cost Explorer
22. **ใช้ Origin Shield** — ลด origin request costs
23. **Enable CloudFront Functions** — แทน Lambda@Edge ถ้า possible (ถูกกว่า)
24. **Delete unused distributions** — avoid idle costs

### Operations
25. **Enable logging** — ทั้ง standard และ real-time
26. **Set CloudWatch alarms** — for errors, latency, cache hit rate
27. **Use AWS SAM/CloudFormation** — infrastructure as code
28. **Separate distributions** — dev vs prod
29. **Monitor Lambda@Edge errors** — track execution errors
30. **Test with CloudFront Functions dev tools** — before deploying

---

## 21. Common Use Cases

### 21.1 Static Website / SPA (React, Vue, Angular)
```
Origin: S3 bucket (website endpoint)
Cache:
  /*.{js,css,png,jpg,woff2} → Cache 1 year (immutable)
  /*.{html,htm}             → Cache 1 minute (frequently changing)
Security: HTTPS only, OAI, WAF basic rules
```

### 21.2 Video Streaming Platform
```
Origins: S3 (video files) + MediaPackage (live)
Cache:
  /manifest/*.m3u8          → 5 seconds
  /segment/*.ts            → 1 hour
  /thumbnail/*.jpg          → 24 hours
Security: Signed URLs, Geo-restriction, DRM (if needed)
Monitoring: Cache hit rate, 5xx errors, origin latency
```

### 21.3 API Gateway with Caching
```
Origins: API Gateway / ALB
Cache:
  GET /api/data/*           → Cache 5 minutes
  POST /api/data/*          → No cache
  /api/admin/*              → No cache, require signed URL
Security: WAF rate limiting, IP whitelist, HMAC auth
Edge: CloudFront Functions validate JWT
```

### 21.4 Software / Game Distribution
```
Origin: S3 bucket (large files)
Cache:
  /*.{exe,msi,dmg,zip}      → Cache 1 week
  /updates/*                → Cache 1 hour, versioned URLs
Security: Signed URLs with IP restriction
Performance: Origin Shield, multi-part download
```

### 21.5 Mobile App Backend
```
Origins: API Gateway + S3 (assets)
Cache:
  /assets/icons/*           → Cache 1 month (immutable)
  /config/app-config.json   → Cache 1 hour, revalidate
Edge: Lambda@Edge add user context headers
Security: HMAC-signed URLs for premium content
Performance: HTTP/2 multiplexing, Brotli compression
```

---

## 22. CloudFront APIs และ Automation

### 22.1 AWS CLI Commands

```bash
# Create distribution
aws cloudfront create-distribution \
  --origin-domain-name my-bucket.s3.us-east-1.amazonaws.com \
  --default-root-object index.html

# Update distribution
aws cloudfront update-distribution \
  --id EXXXXX \
  --distribution-config ...

# Create invalidation
aws cloudfront create-invalidation \
  --distribution-id EXXXXX \
  --paths "/*"

# Get distribution config
aws cloudfront get-distribution --id EXXXXX

# List distributions
aws cloudfront list-distributions

# Create CloudFront Function
aws cloudfront create-function \
  --name my-function \
  --function-code file://function.js \
  --runtime cloudfront-js-1.0

# Associate function with distribution
aws cloudfront update-distribution \
  --id EXXXXX \
  --if-match ETAG \
  --default-cache-behavior ... \
  --addons FunctionAssociations={ViewerRequest=arn:aws:cloudfront::ACCOUNT:function:NAMES}
```

### 22.2 CloudFormation Example

```yaml
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Enabled: true
        DefaultRootObject: index.html
        Origins:
          - Id: S3Origin
            DomainName: !GetAtt S3Bucket.DomainName
            S3OriginConfig:
              OriginAccessIdentity: !Ref OAI
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          AllowedMethods: [GET, HEAD, OPTIONS]
          CachedMethods: [GET, HEAD, OPTIONS]
          Compress: true
          CachePolicyId: 658327ea-f89d-4fab-a63e-ac4d4647a0e3  # CachingOptimized
          FunctionAssociations:
            - FunctionARN: !GetAtt EdgeFunction.FunctionMetadata.FunctionARN
              EventType: viewer-request
        PriceClass: PriceClass_200
        ViewerCertificate:
          CloudFrontDefaultCertificate: true
        HttpVersion: http2and3
```

---

## 23. Related AWS Services

| Service | ความสัมพันธ์กับ CloudFront |
|---------|--------------------------|
| **Route 53** | DNS routing ไป CloudFront, latency/geolocation routing |
| **S3** | Origin สำหรับ static content, log storage |
| **EC2 / ELB / ALB** | Origin สำหรับ dynamic content |
| **AWS WAF** | Web application firewall, integrate กับ CloudFront |
| **AWS Shield** | DDoS protection, Shield Advanced ให้ extra protection |
| **AWS Certificate Manager** | Free TLS certificates สำหรับ CloudFront |
| **Lambda@Edge** | Edge computing functions |
| **CloudFront Functions** | Lightweight edge functions (ถูกกว่า Lambda@Edge) |
| **CloudWatch** | Metrics, alarms, logs |
| **AWS CloudTrail** | API call audit logging |
| **MediaPackage** | Video packaging for streaming |
| **MediaLive** | Live video encoding |
| **MediaConvert** | Video transcoding |
| **S3 Transfer Acceleration** | Fast uploads (different from CloudFront) |
| **Global Accelerator** | Anycast network for non-HTTP workloads |
| **Amazon S3 Multi-Region Access Points** | Multi-region S3 with CloudFront |
| **AWS KMS** | Encryption keys for CloudFront field-level encryption |
| **AWS Config** | Compliance tracking for CloudFront resources |

---

## 24. ลิงค์อ้างอิง

- [CloudFront Developer Guide](https://docs.aws.amazon.com/cloudfront/)
- [CloudFront API Reference](https://docs.aws.amazon.com/cloudfront/latest/APIReference/)
- [CloudFront Pricing](https://aws.amazon.com/cloudfront/pricing/)
- [CloudFront FAQ](https://aws.amazon.com/cloudfront/faqs/)
- [CloudFront Distributions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/distribution-web.html)
- [CloudFront Caching](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/ConfiguringCaching.html)
- [CloudFront Functions](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-functions.html)
- [Lambda@Edge](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-at-the-edge.html)
- [CloudFront Response Headers Policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/response-headers-policies.html)
- [AWS WAF Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/)
- [AWS Shield Developer Guide](https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html)
- [AWS CloudFront Network Topology](https://aws.amazon.com/cloudfront/network-topology/)
- [CloudFront Limits](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/cloudfront-limits.html)

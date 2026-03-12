# PRD: SiteKeur Web Version

**Version:** 1.0
**Date:** 2026-02-05
**Author:** Bollenstreek Digitaal
**Status:** Draft
**URL:** audit.bollenstreekdigitaal.nl

---

## 1. Overview

### 1.1 Vision
Transform SiteKeur from CLI tool to self-service web application. Visitors check their own site, see problems, and become leads.

### 1.2 Business Model

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   VISITOR                LEAD                  CLIENT       │
│   (free scan)      (email captured)         (paying)        │
│       │                   │                    │            │
│       ▼                   ▼                    ▼            │
│   Quick Score  →    Full Report    →    Ongoing Service     │
│   (5 seconds)       (PDF + fixes)       (monitoring + fix)  │
│                                                             │
│   Value: See       Value: Know         Value: We handle     │
│   the problem      how to fix          it all               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Success Metrics

| Metric | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Unique visitors | 100 | 500 | 2,000 |
| Scans completed | 50 | 300 | 1,500 |
| Leads captured | 10 | 60 | 300 |
| Clients from leads | 1 | 6 | 30 |

---

## 2. User Flows

### 2.1 Free Scan Flow

```
1. Land on audit.bollenstreekdigitaal.nl
2. Enter URL
3. See loading animation (builds anticipation)
4. View quick results:
   - Overall score (0-100)
   - Pass/fail for 5 key areas
   - "X problems found"
5. CTA: "Get detailed report with fixes"
```

### 2.2 Lead Capture Flow

```
1. Click "Get detailed report"
2. Enter email (+ optional phone)
3. Receive PDF report in inbox
4. Report includes:
   - All issues with explanations
   - Priority order for fixes
   - Exact steps to fix each issue
   - BD contact info
5. Follow-up email sequence (automated)
```

### 2.3 Client Conversion Flow

```
1. Receive report
2. Reply or call BD
3. Discovery call (Pele handles)
4. Quote for fixes
5. Contract signed
6. Become client with monitoring
```

---

## 3. Features

### 3.1 Public Scan (Free)

| Check | Display |
|-------|---------|
| Performance (LCP, FCP) | Score + pass/fail |
| SEO (title, meta, H1) | Score + pass/fail |
| Security (HTTPS, headers) | Score + pass/fail |
| Mobile (responsive, viewport) | Score + pass/fail |
| Mail (SPF, DKIM, DMARC) | Score + pass/fail |

**Shown:**
- Overall score (big number)
- 5 category scores
- Number of issues
- Teaser of top 3 issues

**Hidden (requires email):**
- Detailed issue descriptions
- How to fix each issue
- Technical details
- Full audit history

### 3.2 Full Report (Email-Gated)

**PDF Report Contents:**
1. Executive Summary (1 page)
   - Overall health score
   - Critical issues count
   - Comparison to competitors

2. Detailed Findings (3-5 pages)
   - Each category with all checks
   - Issue description in plain Dutch
   - Screenshot evidence where relevant

3. Fix Recommendations (2-3 pages)
   - Priority-ordered action list
   - Estimated difficulty (easy/medium/hard)
   - DIY instructions vs "call us"

4. About Bollenstreek Digitaal (1 page)
   - Services we offer
   - Contact information
   - Special offer for report recipients

### 3.3 Client Dashboard (Paid)

- Weekly/monthly automated scans
- Historical trend graphs
- Alert when score drops
- Priority support
- White-label reports for their clients (if they're an agency)

---

## 4. Technical Architecture

### 4.1 Stack

| Component | Technology | Why |
|-----------|------------|-----|
| Frontend | Astro + React | Same as BD main site |
| Backend | Cloudflare Workers | Serverless, EU edge, API-first |
| Database | Turso (SQLite) | EU-hosted, simple, cheap |
| Queue | Cloudflare Queues | Handle scan jobs |
| PDF Generation | @react-pdf/renderer | Generate reports |
| Email | Mailgun EU | Transactional email |
| Scanning | Existing SiteKeur logic | Reuse CLI code |

### 4.2 Architecture Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  audit.bd.nl    │────▶│  CF Worker API  │────▶│   Turso DB      │
│  (Astro/React)  │     │  (scan queue)   │     │   (results)     │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │  Scan Worker    │
                        │  (Puppeteer)    │
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
       ┌──────────┐      ┌──────────┐      ┌──────────┐
       │Lighthouse│      │ DNS Check│      │ Security │
       │ (perf)   │      │ (mail)   │      │ (headers)│
       └──────────┘      └──────────┘      └──────────┘
```

### 4.3 API Endpoints

```typescript
// Submit scan request
POST /api/scan
Body: { url: string }
Response: { scanId: string, status: 'queued' }

// Get scan results
GET /api/scan/:scanId
Response: { status: 'pending' | 'complete', results?: ScanResults }

// Submit email for full report
POST /api/report
Body: { scanId: string, email: string, phone?: string }
Response: { success: boolean }

// Get lead's reports (authenticated)
GET /api/reports
Response: { reports: Report[] }
```

### 4.4 Database Schema

```sql
CREATE TABLE scans (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  results JSON,
  score INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME
);

CREATE TABLE leads (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lead_scans (
  lead_id TEXT REFERENCES leads(id),
  scan_id TEXT REFERENCES scans(id),
  report_sent_at DATETIME,
  PRIMARY KEY (lead_id, scan_id)
);
```

---

## 5. UI Design

### 5.1 Homepage

```
┌─────────────────────────────────────────────────────────────────┐
│  [BD Logo]                              [Over ons] [Contact]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│           Hoe gezond is jouw website?                          │
│                                                                 │
│           Gratis check in 30 seconden                          │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐     │
│    │  https://jouwbedrijf.nl                    [Check]  │     │
│    └─────────────────────────────────────────────────────┘     │
│                                                                 │
│           ✓ Snelheid  ✓ SEO  ✓ Beveiliging  ✓ E-mail          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Wat wij checken:                                             │
│                                                                 │
│   [⚡]              [🔍]              [🔒]              [📧]   │
│   Snelheid          Vindbaarheid     Beveiliging       E-mail  │
│   Laadtijd &        SEO & Google     HTTPS &           SPF &   │
│   performance       ranking          headers           DKIM    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Vertrouwd door lokale ondernemers in de Bollenstreek         │
│                                                                 │
│   [Logo] [Logo] [Logo] [Logo]                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Results Page (Free Tier)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   jouwbedrijf.nl                                               │
│                                                                 │
│            ┌─────────┐                                         │
│            │   58    │  ← Overall score (big, colored)         │
│            │  /100   │                                         │
│            └─────────┘                                         │
│                                                                 │
│   ⚠️ 7 problemen gevonden                                      │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ⚡ Snelheid      ████████░░  78/100   ✓ Goed                │
│   🔍 SEO          ██████░░░░  60/100   ⚠️ Verbeterbaar        │
│   🔒 Beveiliging  ████░░░░░░  40/100   ❌ Actie nodig         │
│   📱 Mobiel       ██████████  95/100   ✓ Uitstekend           │
│   📧 E-mail       ███░░░░░░░  30/100   ❌ Actie nodig         │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   Top problemen:                                               │
│                                                                 │
│   ❌ Geen SPF record - e-mails kunnen in spam belanden        │
│   ❌ Ontbrekende beveiligingsheaders                          │
│   ⚠️ Pagina laadt langzaam op mobiel (4.2s)                   │
│   [🔒 5 meer problemen - vraag volledig rapport]              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   📋 Ontvang volledig rapport met oplossingen                 │
│                                                                 │
│   ┌───────────────────────────────────────────────────────┐   │
│   │  E-mail: ____________________________   [Verstuur]    │   │
│   └───────────────────────────────────────────────────────┘   │
│                                                                 │
│   ✓ Gratis  ✓ Binnen 1 minuut  ✓ Inclusief stappenplan       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Development Phases

### Phase 1: MVP (Week 1-2)
- [ ] Set up Astro project at audit.bollenstreekdigitaal.nl
- [ ] Create homepage with URL input
- [ ] Port SiteKeur logic to Cloudflare Worker
- [ ] Implement basic scan (Lighthouse only)
- [ ] Display results page (scores only)
- [ ] Email capture form (Mailgun integration)

### Phase 2: Full Scan (Week 3-4)
- [ ] Add mail audit checks
- [ ] Add security header checks
- [ ] PDF report generation
- [ ] Automated email with report
- [ ] Rate limiting (prevent abuse)

### Phase 3: Polish (Week 5-6)
- [ ] Dutch localization
- [ ] Mobile responsive design
- [ ] Loading animations
- [ ] Error handling
- [ ] SEO for the tool itself

### Phase 4: Lead Nurture (Month 2)
- [ ] Email sequence automation
- [ ] Dashboard for team to see leads
- [ ] Integration with CRM (Pipedrive/HubSpot)
- [ ] Follow-up reminders

---

## 7. Marketing Integration

### 7.1 How This Drives Leads

| Channel | Action | Expected Leads |
|---------|--------|----------------|
| LinkedIn | Post audit examples | 5/week |
| Local PR | "Free tool for local businesses" | 20/month |
| Google Ads | "Website check [town name]" | 30/month |
| Referral | Happy clients share | 10/month |

### 7.2 Content from Audits

Each audit can become:
- LinkedIn post: "We checked [business type] websites..."
- Blog post: "5 common mistakes [industry] websites make"
- Press release: "[X]% of local websites have email issues"

---

## 8. Competitive Differentiation

| Feature | SiteKeur | GTmetrix | PageSpeed | MXToolbox |
|---------|----------|----------|-----------|-----------|
| Website audit | ✅ | ✅ | ✅ | ❌ |
| Mail audit | ✅ | ❌ | ❌ | ✅ |
| Combined score | ✅ | ❌ | ❌ | ❌ |
| Dutch language | ✅ | ❌ | ❌ | ❌ |
| Local service | ✅ | ❌ | ❌ | ❌ |
| Lead capture | ✅ | ❌ | ❌ | ❌ |

**Our unique value:** "Check everything + we can fix it for you + we speak Dutch + we're local"

---

## 9. Open Questions

1. Subdomain (audit.bollenstreekdigitaal.nl) or path (/audit)?
2. How many free scans per IP/day?
3. Should we show competitor comparison?
4. Do we cache results (how long)?
5. What's the follow-up email sequence?

---

## 10. Success Criteria

**MVP Success (Month 1):**
- [ ] 50+ scans completed
- [ ] 10+ email captures
- [ ] 1 client from tool

**Product-Market Fit (Month 3):**
- [ ] 300+ scans/month
- [ ] 20% email capture rate
- [ ] 5+ clients from tool
- [ ] Positive feedback from users

---

*Next: Technical implementation, starting with Astro project setup*

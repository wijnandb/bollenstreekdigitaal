# PRD: Mail Audit Feature for SiteKeur

**Version:** 1.0
**Date:** 2026-02-05
**Author:** Bollenstreek Digitaal
**Status:** Draft

---

## 1. Overview

### 1.1 Problem Statement
Most local businesses don't know their email configuration is broken. Missing SPF, DKIM, and DMARC records cause:
- Emails going to spam
- Domain spoofing vulnerability
- Lost business opportunities
- Professional reputation damage

### 1.2 Solution
Extend SiteKeur to audit email configuration, showing businesses their mail health alongside their website health.

### 1.3 Business Value
- **Lead Generation:** Email issues are concrete, urgent problems businesses want fixed
- **Upsell Path:** Website audit → Mail audit → Full digital health service
- **Differentiation:** Most website checkers don't check email

---

## 2. Target Users

| User | Need | Access Level |
|------|------|--------------|
| **Prospects** | Quick check, see if there's a problem | Free tier (basic) |
| **Leads** | Detailed report, understand what's wrong | Email-gated |
| **Clients** | Full monitoring, ongoing health checks | Client dashboard |

---

## 3. Features

### 3.1 Core Mail Checks

| Check | Description | Severity |
|-------|-------------|----------|
| **MX Records** | Mail servers configured | Critical |
| **SPF Record** | Sender verification present | High |
| **SPF Validity** | SPF syntax correct, not too many lookups | High |
| **DKIM Record** | Email signing configured | High |
| **DMARC Record** | Policy defined for failures | Medium |
| **DMARC Policy** | Strength of policy (none/quarantine/reject) | Medium |
| **BIMI Record** | Brand logo in email clients (advanced) | Low |
| **MTA-STS** | Encrypted mail transport policy | Low |

### 3.2 Tiered Access

#### Free Tier (Public)
- Pass/Fail for each check
- Overall mail health score (0-100)
- "Problems found" count
- CTA: "Get full report with fixes"

#### Email-Gated (Lead Capture)
- Detailed explanation of each issue
- Specific DNS records needed
- Priority order for fixes
- Estimated impact on deliverability

#### Client Tier
- Scheduled monitoring (weekly/monthly)
- Historical trends
- Alerts when records change/break
- White-label reports

---

## 4. Technical Specification

### 4.1 DNS Checks (via dig/dns library)

```typescript
interface MailAuditResult {
  domain: string;
  timestamp: Date;
  score: number; // 0-100

  checks: {
    mx: {
      exists: boolean;
      records: string[];
      issues: string[];
    };
    spf: {
      exists: boolean;
      record: string | null;
      valid: boolean;
      lookupCount: number; // max 10
      issues: string[];
    };
    dkim: {
      checked: boolean; // Can only check common selectors
      selectors: DkimSelector[];
      issues: string[];
    };
    dmarc: {
      exists: boolean;
      record: string | null;
      policy: 'none' | 'quarantine' | 'reject' | null;
      rua: string | null; // reporting address
      issues: string[];
    };
    bimi: {
      exists: boolean;
      logoUrl: string | null;
    };
    mtaSts: {
      exists: boolean;
      policy: string | null;
    };
  };

  recommendations: Recommendation[];
}

interface Recommendation {
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  dnsRecord?: {
    type: string;
    name: string;
    value: string;
  };
}
```

### 4.2 Common DKIM Selectors to Check

```typescript
const COMMON_SELECTORS = [
  'google',           // Google Workspace
  'selector1',        // Microsoft 365
  'selector2',        // Microsoft 365
  'default',          // Various
  's1',               // Various
  'k1',               // Mailchimp
  'mandrill',         // Mandrill
  'smtpapi',          // SendGrid
  'mail',             // Generic
];
```

### 4.3 Scoring Algorithm

```typescript
const SCORE_WEIGHTS = {
  mx: 25,           // Critical - no MX = no email
  spf: 25,          // High - major spam factor
  spfValid: 10,     // SPF syntax correct
  dkim: 20,         // High - authentication
  dmarc: 15,        // Medium - policy enforcement
  dmarcPolicy: 5,   // Strength of policy
};

function calculateScore(result: MailAuditResult): number {
  let score = 0;

  if (result.checks.mx.exists) score += SCORE_WEIGHTS.mx;
  if (result.checks.spf.exists) score += SCORE_WEIGHTS.spf;
  if (result.checks.spf.valid) score += SCORE_WEIGHTS.spfValid;
  if (result.checks.dkim.selectors.some(s => s.valid)) score += SCORE_WEIGHTS.dkim;
  if (result.checks.dmarc.exists) score += SCORE_WEIGHTS.dmarc;
  if (result.checks.dmarc.policy === 'reject') score += SCORE_WEIGHTS.dmarcPolicy;
  else if (result.checks.dmarc.policy === 'quarantine') score += SCORE_WEIGHTS.dmarcPolicy * 0.5;

  return score;
}
```

---

## 5. User Interface

### 5.1 Public Widget (Free Tier)

```
┌─────────────────────────────────────────────┐
│  Mail Health Check                          │
│  [example.nl                    ] [Check]   │
├─────────────────────────────────────────────┤
│                                             │
│  Score: 45/100  ⚠️ Issues Found             │
│                                             │
│  ✅ MX Records      Configured              │
│  ❌ SPF Record      Missing                 │
│  ❌ DKIM            Not detected            │
│  ⚠️ DMARC           No policy               │
│                                             │
│  Your emails may be going to spam!          │
│                                             │
│  [Get Full Report + Fixes →]                │
│                                             │
└─────────────────────────────────────────────┘
```

### 5.2 Report (Email-Gated)

Full PDF/HTML report with:
- Executive summary (for business owner)
- Technical details (for IT person)
- Copy-paste DNS records to fix each issue
- BD contact info for help

---

## 6. Integration with SiteKeur

### 6.1 CLI Extension

```bash
# Current
sitekeur https://example.nl

# Extended
sitekeur https://example.nl --include-mail
sitekeur --mail-only example.nl
```

### 6.2 Combined Report

```
┌─────────────────────────────────────────────┐
│  DIGITAL HEALTH REPORT                      │
│  example.nl                                 │
├─────────────────────────────────────────────┤
│                                             │
│  Website Health:  72/100  ⚠️                │
│  Mail Health:     45/100  ❌                │
│  Overall:         58/100                    │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 7. Development Phases

### Phase 1: CLI Tool (Week 1-2)
- [ ] Add DNS checking library (dns/dig wrapper)
- [ ] Implement all mail checks
- [ ] Add `--mail-only` and `--include-mail` flags
- [ ] JSON output for mail audit
- [ ] Combined HTML report

### Phase 2: Web Integration (Week 3-4)
- [ ] Add mail check API endpoint
- [ ] Free tier widget on audit.bollenstreekdigitaal.nl
- [ ] Email capture form
- [ ] Full report PDF generation

### Phase 3: Client Dashboard (Month 2)
- [ ] Scheduled monitoring
- [ ] Historical data storage
- [ ] Alert system
- [ ] White-label report templates

---

## 8. Success Metrics

| Metric | Target |
|--------|--------|
| Free checks/month | 500+ |
| Email capture rate | 20%+ |
| Lead → Client conversion | 5%+ |
| Client retention (monitoring) | 80%+ |

---

## 9. Competitive Landscape

| Tool | Website Audit | Mail Audit | Free Tier | Lead Capture |
|------|---------------|------------|-----------|--------------|
| MXToolbox | ❌ | ✅ | ✅ | ❌ |
| GTmetrix | ✅ | ❌ | ✅ | ❌ |
| Google Lighthouse | ✅ | ❌ | ✅ | ❌ |
| **SiteKeur** | ✅ | ✅ | ✅ | ✅ |

**Our advantage:** Combined website + mail health in one tool, with local (Dutch) service to fix issues.

---

## 10. Open Questions

1. Should we check for common email provider issues (Google, Microsoft)?
2. Do we want to test actual mail delivery (send test email)?
3. Should mail monitoring be separate subscription from website monitoring?
4. What's the pricing for mail-only audit service?

---

*Next: Technical implementation in SiteKeur codebase*

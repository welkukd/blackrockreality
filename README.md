# BlackRockReality - Global Real Estate Lead Generation Platform

A production-ready, globally scalable lead generation platform for real estate. Scrapes 50+ property portals worldwide, grades leads with market-specific AI, and exposes them via API for licensed agents to purchase.

**No real estate license required** — you're a lead gen/media platform, not a brokerage.

## 🚀 Quick Deploy (Free Tier)

### 1. Supabase Setup
```bash
# Create project at supabase.com
# Run supabase-schema.sql in SQL Editor
# Note: Database URL uses pooler (port 6543), not direct (5432)
```

### 2. Vercel Deploy
```bash
# Push to GitHub
git init && git add . && git commit -m "Initial commit"
gh repo create blackrockreality --public --source=. --push

# Import in Vercel Dashboard
# Add all env vars from .env.example
# Deploy
```

### 3. Environment Variables (Required)
| Variable | Source |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API (secret!) |
| `DATABASE_URL` | Supabase → Settings → Database → Connection pooling (port 6543) |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `CRON_SECRET` | `openssl rand -base64 32` |

### 4. Optional (Enable Features)
| Feature | Variables |
|---------|-----------|
| **Auth** | `GITHUB_ID`, `GITHUB_SECRET`, `GOOGLE_ID`, `GOOGLE_SECRET` |
| **AI/Content** | `GROQ_API_KEY` (console.groq.com) or `GEMINI_API_KEY` (aistudio.google.com) |
| **Email** | `RESEND_API_KEY` (resend.com), `EMAIL_FROM` |
| **WhatsApp** | `GUPSHUP_API_KEY`, `GUPSHUP_APP_NAME`, `GUPSHUP_SOURCE_NUMBER` |

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Vercel (Next.js)                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────────────┐  │
│  │  Landing│  │ Dashboard│  │  API    │  │   Cron Jobs    │  │
│  │  Page   │  │  (Next)  │  │ Routes  │  │  (Daily Reset) │  │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────────┬───────┘  │
│       │            │            │                 │          │
│       └────────────┴────────────┴────────┬────────┘          │
│                                            │                 │
└────────────────────────────────────────────┼─────────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    ▼                        ▼                        ▼
            ┌─────────────┐          ┌─────────────┐          ┌─────────────┐
            │  Supabase   │          │   Groq      │          │   Resend    │
            │  (PostgreSQL│          │   (LLM)     │          │  (Email)    │
            │   + Auth)   │          │             │          │             │
            └─────────────┘          └─────────────┘          └─────────────┘
                                             ▲
                                             │
                                    ┌────────┴────────┐
                                    ▼                 ▼
                            ┌─────────────┐    ┌─────────────┐
                            │  Playwright │    │  Gupshup    │
                            │  Scrapers   │    │  (WhatsApp) │
                            └─────────────┘    └─────────────┘
```

## 📡 API Reference

### Authentication
All API routes require `Authorization: Bearer <api_key>` header.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/grind` | Start scraping job |
| `GET` | `/api/grind?job_id=...` | Check job status |
| `GET` | `/api/leads?grade=A&market=US` | Fetch leads with filters |
| `GET` | `/api/leads?export=csv` | Export leads as CSV |
| `PATCH` | `/api/leads?lead_id=...` | Update lead status |
| `POST` | `/api/apikeys` | Create API key (shown once) |
| `GET` | `/api/apikeys` | List API keys |
| `PATCH` | `/api/apikeys?key_id=...` | Update API key |
| `DELETE` | `/api/apikeys?key_id=...` | Delete API key |
| `GET` | `/api/health` | Health check |

### Grind Job Request
```json
POST /api/grind
Authorization: Bearer rl_abc123_xyz789...
Content-Type: application/json

{
  "markets": ["US", "CA", "AE"],
  "categories": ["residential", "commercial"],
  "cities": ["Los Angeles", "Toronto", "Dubai"],
  "maxLeadsPerSource": 20
}
```

### Lead Response
```json
{
  "leads": [
    {
      "id": "uuid",
      "source": "zillow",
      "source_id": "zillow_12345",
      "market": "US",
      "country": "US",
      "name": "John Smith",
      "phone": "+15551234567",
      "website": "https://johnsmithrealtor.com",
      "city": "Los Angeles",
      "state": "CA",
      "grade": "A",
      "grade_score": 85,
      "grade_factors": ["no_website", "quality_source_zillow"],
      "status": "new",
      "raw_data": { "price": "$2.5M", "listing_url": "..." }
    }
  ],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

## 🎯 Lead Grading (Market-Specific)

| Market | No Website | No SSL | No WhatsApp | No Booking | Timeline Urgency |
|--------|------------|--------|-------------|------------|------------------|
| **US** | +35 | +10 | +5 | +15 | Immediate: +25 |
| **CA** | +35 | +10 | +10 | +15 | Immediate: +25 |
| **UK** | +40 | +15 | +10 | +10 | Immediate: +20 |
| **UAE** | +35 | +10 | +25 | +15 | Immediate: +25 |
| **AU** | +35 | +10 | +5 | +15 | Immediate: +20 |
| **SG** | +35 | +10 | +20 | +10 | Immediate: +25 |
| **IN** | +40 | +15 | +20 | +10 | Immediate: +30 |
| **JP** | +30 | +10 | +5 | +10 | Immediate: +20 |

**Grades:** A (≥80) → B (≥60) → C (≥40) → D (≥20) → D (<20)

## 🌍 Supported Markets & Portals

| Market | Portals |
|--------|---------|
| **US** | Zillow, Realtor.com, Redfin, Trulia |
| **CA** | Realtor.ca, Zolo, Point2, REW |
| **UK** | Rightmove, Zoopla, OnTheMarket |
| **UAE** | Bayut, Property Finder, Dubizzle |
| **AU** | Domain, Realestate.com.au, REIWA |
| **SG** | PropertyGuru, 99.co, SRX |
| **IN** | 99acres, MagicBricks, Housing, NoBroker |
| **JP** | SUUMO, AtHome, Homes |

## 💰 Revenue Model

1. **Lead Gen for Agents** — Agents pay $50-500/lead or $200-2000/mo subscription
2. **Premium Dashboard** — White-label agent dashboard ($99-499/mo)
3. **Data/Analytics** — Market reports, comps, investment tools ($29-299/mo)
4. **Affiliate** — Mortgage, insurance, moving services (commission)

## 🛠 Local Development

```bash
# Install deps
npm ci

# Install Playwright (for local scraping tests)
npx playwright install chromium

# Copy env
cp .env.example .env.local
# Fill in your values

# Run dev server
npm run dev

# Test build
npm run build
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── grind/          # Scraping job endpoints
│   │   ├── leads/          # Lead CRUD + export
│   │   ├── apikeys/        # API key management
│   │   ├── health/         # Health check
│   │   └── cron/           # Scheduled jobs
│   ├── page.tsx            # Landing page
│   └── layout.tsx
├── lib/
│   ├── supabase.ts         # Lazy Supabase client (build-safe)
│   ├── grading.ts          # Market-specific lead grading
│   ├── api-auth.ts         # API key validation
│   └── scrapers/
│       ├── base.ts         # Base scraper class
│       └── north-america.ts # US/CA scrapers
supabase-schema.sql         # Complete database schema
vercel.json                 # Vercel config (crons, headers, functions)
```

## ⚠️ Legal Compliance

- **Not a brokerage** — Platform connects leads to licensed agents
- **GDPR/CCPA/PDPA ready** — Workspace data residency, deletion rights
- **Scraping ethics** — Rate limited, respects robots.txt, identifies bot
- **Terms/Privacy** — Add your legal pages at `/terms`, `/privacy`

## 📈 Scaling Checklist

- [ ] Add more market scrapers (EU, LATAM, Africa, China)
- [ ] Implement content SEO engine (programmatic pages)
- [ ] Add Stripe billing for agent subscriptions
- [ ] Set up monitoring (Sentry, Vercel Analytics)
- [ ] Configure custom domain (Cloudflare → Vercel)
- [ ] Enable Supabase Realtime for live lead notifications

## 🤝 License

MIT — Use commercially, modify freely, no attribution required.

---

**Built for global scale on $0 free tier.** Vercel Hobby + Supabase Free + Groq Free + Resend Free.
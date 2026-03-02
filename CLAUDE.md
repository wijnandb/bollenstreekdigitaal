# Bollenstreek Digitaal — Project Context

## About
Website for Bollenstreek Digitaal, a digital consultancy helping SMEs (MKB) in the Duin- en Bollenstreek region (Noordwijk, Katwijk, Lisse, Hillegom, Teylingen). Built with Astro 5, Tailwind CSS 4, deployed on Vercel.

**Team:** Wijnand + Pele (son)
**Target:** Local SMEs — painters, florists, carpenters, restaurant owners, etc.

## Tech Stack
- **Framework:** Astro 5.7 with MDX
- **Styling:** Tailwind CSS 4 with `@theme` custom properties
- **Deployment:** Vercel (serverless for API routes)
- **Email:** EmailOctopus (mailing list) + SendGrid (form notifications)
- **Tests:** Playwright (39 tests covering all pages)
- **Content:** MDX blog posts via Astro content collections

## Environment Variables (Vercel + .env)
- `EMAILOCTOPUS_API_KEY` — mailing list (configured)
- `SENDGRID_API_KEY` — form email notifications (**needs to be added**)

## Key Directories
- `src/pages/` — all pages (diensten/, tarieven/, blog/, api/)
- `src/content/blog/` — MDX blog posts
- `src/components/` — shared components (CTA, Hero, Breadcrumb, etc.)
- `src/layouts/` — Base layout
- `tests/` — Playwright e2e tests
- `docs/` — internal documentation (workflow, research, scripts)

## Blog Workflow
Twice weekly (Tuesday & Friday). Process documented in `docs/blog-workflow.md`.
1. Wijnand provides a topic
2. Blog post generated in Dutch MDX (500-800 words)
3. Wijnand reviews and approves
4. Commit and deploy

Trigger: "Laten we een blogpost schrijven" or just give a topic.

## Completed Items
- [x] Contact form with email notification (SendGrid) + EmailOctopus
- [x] Blog workflow documented, 5 existing posts
- [x] MKB tools research (`docs/mkb-tools-onderzoek.md` — 12 categories, 630 lines)
- [x] Separate tarieven pages per dienst (index + websites/workshops/advies/strategie)
- [x] Video script for Over Ons (`docs/video-script-over-ons.md`)
- [x] Breadcrumbs on every page (visual + JSON-LD structured data)
- [x] CTA section — light background, visually distinct from dark footer
- [x] Testimonials section removed (no real testimonials yet)
- [x] Typewriter effect on homepage (cycles through local professions)
- [x] Playwright test suite (39 tests, all passing)

## Open / Future Items

### Needs Wijnand's Action
- [x] Add `SENDGRID_API_KEY` to `.env` and Vercel environment variables
- [ ] Verify `bollenstreekdigitaal.nl` as sender domain in SendGrid
- [ ] Set up LinkedIn company page, then add link to website footer
- [ ] Set up Google Business Profile (Google Places)
- [ ] Record the Over Ons video (script ready in `docs/video-script-over-ons.md`)

### Website Improvements
- [ ] Add real testimonials when available (section is ready, just hidden)
- [ ] Add LinkedIn link to footer once page exists
- [ ] Consider adding a "Blog" link to the main navigation
- [ ] Explore adding an RSS feed for the blog
- [ ] Mobile menu — verify all new tarieven links appear correctly
- [ ] Consider analytics (Plausible or similar, privacy-friendly)

### Content
- [ ] Continue twice-weekly blog posts (next: ask Wijnand for a topic)
- [ ] Use MKB tools research to create blog series or service page content
- [ ] Write case studies as real client work comes in

### Technical
- [ ] Set up git repo and branch strategy (feature branches recommended)
- [ ] Add CI pipeline to run Playwright tests on PRs
- [ ] Consider adding image optimization (Astro Image component)
- [ ] Review and potentially update FAQ page pricing to match tarieven pages

## Writing Style (Dutch)
- Informal but professional ("je" not "u")
- No jargon unless explained
- Short sentences, active voice
- No over-the-top sales language
- Real, useful information — not filler
- Local context: mention Noordwijk, Katwijk, Lisse, etc.

## Pricing Structure
| Dienst | Tiers |
|--------|-------|
| Websites | Starter €29/mo, Groei €59/mo, Premium €99/mo |
| Workshops | AI Introductie €950, Hands-on €1.750, Meerdaags €2.950 |
| Advies | Quickscan €1.500, Adviestraject €3.500, Begeleid vanaf €750/mo |
| Strategie | Digitale Scan €2.500, Strategietraject €4.950, Begeleiding €995/mo |

---

Uitbreidingen:


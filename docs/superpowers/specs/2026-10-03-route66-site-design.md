# Route 66 Driving School — site design (draft v1)

Date: 2026-10-03. Background research: `docs/research-brief.md`.

## Goal

A fast, simple website for Route 66 Driving School (Hadlow, Kent) that turns visitors into WhatsApp/phone enquiries and ranks for local searches ("driving lessons Tonbridge", "automatic driving instructor Tonbridge", "female driving instructor").

v1 is a **review draft** for Michael. It contains placeholder data (names, ADI numbers, address, reviews, car photos). It must not be mistaken for the live site:

- Deployed to a Cloudflare `*.workers.dev` preview URL, not to route66drivingschool.co.uk.
- `DRAFT` flag on: a top banner says "Draft – sample content for review", placeholder values are highlighted, and every page sends `noindex` (meta tag plus `X-Robots-Tag` header).
- Going live means: replace the placeholders with real data, delete the sample reviews, set `DRAFT=false`, attach the domain.

## Stack

- Astro (latest stable), static output, zero client JS except one small script (WhatsApp chooser, sticky bar, FAQ uses native `<details>`).
- Plain CSS with design tokens (no Tailwind). Fonts: Barlow Condensed (headings) and Barlow (body), self-hosted via @fontsource.
- `@astrojs/sitemap`. JSON-LD as `LocalBusiness` + `EducationalOrganization` (not the non-existent `DrivingSchool` type). No review or rating markup.
- Hosting: Cloudflare Workers static assets (`wrangler.jsonc`), on the owner's Cloudflare account. The domain stays at GoDaddy; DNS moves to Cloudflare at launch.
- Tests: Playwright (mobile 390px and desktop 1280px) with axe accessibility checks.

## Content source

All business data lives in one file, `src/data/site.ts`: business, instructors, contact numbers, areas, test centres, services, FAQs, reviews, and the address. Placeholder values are wrapped so the draft can highlight them. Michael's corrections only touch this file.

Draft data (from Abdullah, 2026-10-03):

| Field | Value |
|---|---|
| Michael Doe | manual, ADI, +44 7592 137400 (phone and WhatsApp) |
| Wife ("Sarah Doe", placeholder) | automatic, female instructor, ADI, 01234 566789 (placeholder) |
| ADI number | 01234567 (placeholder) |
| Prices, car models, hours | "Message us on WhatsApp" (no figures shown) |
| Services | Pass Plus, motorway lessons, theory help, refresher and foreign licence, plus beginners, nervous drivers, intensive courses, test-day car hire |
| Availability | 7 days a week, times on request |
| Business type | sole trader. Address is a placeholder (Hadlow, TN11). |
| Cancellation | common 48-hour policy |
| Reviews, car photos | samples, clearly labelled in the draft |

## Pages

1. **`/`**, sections in this order:
   1. Header: logo, WhatsApp and Call buttons.
   2. Hero:
      - H1 "Driving lessons in Hadlow, Tonbridge & Tunbridge Wells"
      - chips: Manual & Automatic, Female instructor
      - WhatsApp CTA (opens the chooser) and a Call button
      - car image
   3. Trust strip: both DVSA ADIs, husband and wife team, based in Hadlow, 7 days.
   4. Instructors: two cards, each with its own WhatsApp link and prefilled text.
   5. Lessons: service grid.
   6. How it works: 3 steps.
   7. Reviews (samples).
   8. Areas and test centres: Tunbridge Wells, Sevenoaks, Maidstone. Tonbridge has no test centre.
   9. FAQ.
   10. Contact: WhatsApp, call, email.
   11. Footer: legal identity (trading name, owner, address, email, phone).
2. **`/lessons`**:
   - Each service in detail.
   - Test-day car hire for experienced and foreign-licence drivers.
   - Intensive courses (test date subject to DVSA availability).
   - The "how pricing works" note: prices on WhatsApp, the price quoted is the full price.
   - Booking steps and a summary of the cancellation policy.
3. **`/privacy`** and **`/terms`**: plain-language UK GDPR privacy notice (cookieless analytics, WhatsApp) and lesson terms (48-hour cancellation, payment in advance, test-car conditions, complaints route).
4. **404**.

## WhatsApp and contact

- Built in-house `wa.me` links, no third-party widget.
- The main CTA opens a small chooser:
  - "Michael · Manual"
  - "Sarah · Automatic · female instructor"
- Each chooser row opens a WhatsApp chat with the message already filled in: "Hi! I found you on route66drivingschool.co.uk. I'd like [manual/automatic] driving lessons. My area is: …".
- If JavaScript is unavailable, the CTA is a plain link to Michael's number.
- Mobile: a sticky bottom bar (WhatsApp green and Call) that appears after the hero, at least 48px tall and safe-area aware.
- Desktop: buttons in the header plus a small floating WhatsApp button.
- No contact form in v1.

## Design

- Tokens:
  - bg `#FAF8F4`, surface `#FFFFFF`, ink `#14213D`, navy `#0B2545`, blue `#1D4E89`
  - red `#C8102E`, used as the accent only and never as text on blue
  - muted `#5B6475`, border `#E4E1DA`, WhatsApp `#25D366`
- The retro feel stays in the logo and a thin checkered divider. Calm layout, generous whitespace, 8–12px radius, near-flat shadows. Motion is minimal and respects `prefers-reduced-motion`.
- Logo: hand-built SVG recreation of the shield logo from the flyer, used until the original artwork arrives. Favicon and OG image are derived from it.
- Car images: royalty-free stock (licence noted in `docs/assets.md`) or an SVG illustration, to be replaced with Michael's real car.

## SEO

- Home title: "Driving Lessons Tonbridge & Hadlow | Manual & Automatic | Route 66".
- One H1 per page, canonical tags, OG tags, sitemap, robots.
- Robots blocks everything while `DRAFT` is on.
- JSON-LD:
  - `areaServed`: the 14 towns
  - `founder` and `employee`: the two instructors
  - no `aggregateRating`
- Visible FAQ, no FAQPage markup.

## Compliance in the copy

- No "high first-time pass rate", "best", or "guaranteed".
- Intensive courses carry "test date subject to DVSA availability".
- No DVSA or GOV.UK logos.
- Footer shows the legal identity.
- Privacy notice covers analytics and WhatsApp.

## Testing

Playwright checks, run against the built site:

- every WhatsApp link has a valid `wa.me/44…` number and prefilled text
- `tel:` links work
- no horizontal scroll at 390px
- the JSON-LD parses
- the sitemap exists
- no serious or critical axe violations
- the draft banner and `noindex` are present while `DRAFT` is on

Before the preview deploy, review against Vercel's Web Interface Guidelines and run a Sepia pass on the copy.

## Out of scope (v1)

Contact form, analytics, per-town pages, blog, the son's handyman site, and the DNS/domain cutover (done at launch, with steps given to Abdullah).

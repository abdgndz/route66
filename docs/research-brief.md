# Route 66 Driving School: Build Brief

Prepared 3 Oct 2026 from six research reports (tools, SEO, competitors, compliance, conversion, stack). This brief does not settle anything legal. It sets out the decisions to make.

## 0. Summary

1. **Build:** Astro 7 static site, about 2 pages plus legal pages. Use a plain WhatsApp link button (no third-party widget) and a sticky "WhatsApp / Call" bar on mobile. Self-hosted fonts, no cookie banner needed.
2. **Hosting:** Vercel Hobby **cannot be used**, because its terms ban commercial use. Pick one:
   - **Cloudflare Workers, free.** This is the recommendation, and it also gives free email forwarding.
   - **Vercel Pro at $20/month.**
3. **Copy, two claims that must change before launch:**
   - "DVSA approved instructors": allowed only if **both** hold green ADI badges.
   - "High first-time pass rate": **remove it.** A new school has no data to back it, and the ASA has upheld complaints against driving schools for this kind of claim.
4. **Possible legal problem with the flyer number:** if the wife is a trainee (pink badge), her personal number on the flyer breaks DVSA trainee rules.
5. **SEO:** most local leads will come from **Google Business Profile, not the site**. Do not build 14 town pages; Google treats that as spam.
6. **Biggest gaps against local competitors:**
   - No local competitor has a WhatsApp button, and most hide their prices.
   - No local independent offers a male manual instructor plus a female automatic instructor as a couple.
   - Nobody local is actually *based* in Hadlow.

---

## 1. Tools and skills

### USE

| Tool | Why | Install |
|---|---|---|
| **Playwright** + axe | Smoke tests at 375px and 1440px: wa.me and `tel:` links, no horizontal scroll, JSON-LD parses, sitemap returns 200, accessibility checks | `npm i -D @playwright/test @axe-core/playwright && npx playwright install chromium` (or the MCP: `/plugin install playwright@claude-plugins-official`). Chromium 1243 is already cached. |
| **Vercel web-design-guidelines** (audit skill) | Final pre-launch review against 100+ accessibility, UX and performance rules. It does not touch the stack. | `npx skills add vercel-labs/agent-skills --skill web-design-guidelines --agent claude-code -g` (the repo shows no SPDX licence, so read it before installing) |
| **One design skill.** Default: `frontend-design` (already in the official marketplace). Alternative: Taste `minimalist-ui`. | Avoids generic "AI-looking" layout. If using Taste, set motion low and do not let it pull in GSAP. | `/plugin install frontend-design@claude-plugins-official`, or `npx skills add https://github.com/Leonxlnx/taste-skill --skill "minimalist-ui"` |
| **Our own DESIGN.md** in the awesome-design-md format | Fixes tokens and type in one place. Borrow only the format; none of the listed brands fits a driving school. | No install. Copy one entry's structure from https://github.com/VoltAgent/awesome-design-md |
| **Sepia** (copy review pass only) | Makes the copy read like a local instructor wrote it, not AI | `npx skills add Nanako0129/sepia -g` |
| **Astro tooling** | Sitemap, self-hosted fonts | `npm i @astrojs/sitemap @fontsource/barlow-condensed @fontsource/barlow` |
| **Lighthouse CI** | Gate of 95+ for performance, SEO and accessibility on preview URLs | `npm i -D @lhci/cli` or `treosh/lighthouse-ci-action` (last release June 2025; still works) |
| *Only if on Vercel Pro:* `@vercel/analytics`, `@vercel/speed-insights`, the deploy-to-vercel skill | Cookieless analytics. Custom click events need Pro. | `npm i @vercel/analytics @vercel/speed-insights` |

### SKIP

- **Scroll Craft:** heavy scroll animation hurts phone speed, INP and accessibility, and visitors here are on phones.
- **Webstudio:** a different workflow, AGPL licence, overkill for 2 pages.
- **Plasmic:** a visual builder with an account and runtime dependency. A JSON or Markdown content file is simpler if Mick ever edits.
- **Image to Code** (abi/screenshot-to-code etc.): there is no mockup to copy, and Claude already reads images.
- **Open SEO skills:** they need a paid DataForSEO setup. The `local-seo` skill may be worth it 4–8 weeks after the Google Business Profile is live.
- **Vercel react-native-skills, composition-patterns, vercel-cli-with-tokens:** not relevant.
- **`next/og`, react-best-practices:** only relevant on Next.js, and we recommend Astro.

---

## 2. Stack and hosting

**Framework: Astro 7** (7.3.5, static output) with Tailwind.
- It ships zero JavaScript by default and resizes images to AVIF/WebP at build time.
- Its official sitemap plugin is `@astrojs/sitemap` 3.7.4.
- The only JavaScript is a small script for the WhatsApp chooser and the sticky bar.
- Why not Next.js: a static Next export loses image optimisation, redirects and headers, and still sends a React runtime to the browser for two static pages. Sources: https://astro.build/blog/astro-7/ and https://nextjs.org/docs/app/guides/static-exports

**Hosting: Vercel Hobby is not allowed.**
- Vercel's fair-use page says: "Hobby teams are restricted to non-commercial personal use only."
- Its examples of commercial use include "Advertising the sale of a product or service" and "a paid employee or consultant writing the code".
- Source: https://vercel.com/docs/limits/fair-use-guidelines

| Option | Cost | Pros | Cons |
|---|---|---|---|
| **A. Cloudflare Workers Static Assets (recommended)** | £0 | Commercial use allowed. Unlimited static requests. Free Email Routing and free cookieless Web Analytics. Turnstile available. Cloudflare's own recommendation over Pages. ([CF docs](https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/)) | Nameservers move from GoDaddy to Cloudflare. Builds come from the private GitHub repo via Workers Builds. |
| B. Vercel Pro | $20/month (about £15; about £180/year), $20 usage credit included | Familiar workflow. Analytics custom events. ([pricing](https://vercel.com/pricing)) | A recurring cost someone has to pay. Click-event tracking is available only on Pro. |
| C. Netlify Free | £0 | Commercial use allowed | Hard cap of 300 credits a month: a deploy costs 15, each GB costs 20. Fine for this site but less headroom. |

Do **not** put Cloudflare's proxy in front of Vercel; Vercel advises against it (https://vercel.com/kb/guide/cloudflare-with-vercel).

**DNS and canonical address**
- **On Cloudflare:** the bare domain `https://route66drivingschool.co.uk/` is canonical, with a redirect from www.
- **On Vercel:** `www` is primary, with a 308 redirect from the bare domain. Use the A/CNAME values shown on the project's domain card (not the old generic `cname.vercel-dns.com`), and remove any AAAA and parked records at GoDaddy.
- Either way, the canonical tag, sitemap, Google Business Profile URL and schema `url` must match exactly.

**Email on the domain** (for the legally required contact details and the privacy policy's data controller; not a personal Gmail):
- On Cloudflare: Cloudflare Email Routing, free, forwarding `lessons@` to Mick's inbox.
- If DNS stays on GoDaddy: ImprovMX Free.
- Upgrade to Google Workspace (£5.90 per user per month excl. VAT; £4.72 intro price from 17 Oct 2026) only if mail sent from Gmail's "Send as" starts landing in spam.
- Add DMARC `p=none` at the start and keep exactly one SPF record.

**Analytics**
- Cloudflare Web Analytics on option A, or Vercel Web Analytics on B. Both are cookieless.
- No GA4: it would need a consent banner.
- Track WhatsApp and Call clicks. Put UTM tags (tracking labels) on the Google Business Profile website link.

**Contact form (optional, secondary)**
- Default: Web3Forms free tier (250 submissions/month) with a honeypot field.
- Alternative on Cloudflare: a small Worker that checks Turnstile and sends through Resend (3,000 emails/month free).
- No reCAPTCHA, because it sets third-party cookies.

**CI:** GitHub Actions runs Playwright (end-to-end, screenshots, axe) and Lighthouse against the preview on every PR.

---

## 3. Site structure and SEO plan (in priority order)

### Pages

**`/` Home** (H1: "Driving lessons in Hadlow, Tonbridge & Tunbridge Wells"), sections in this order:
1. **Hero**
   - Chips: "Manual & Automatic" and "Female instructor available".
   - Primary button: WhatsApp. Secondary: Call.
   - A real photo of both instructors with the car.
   - One trust line, with wording that depends on badge status (see section 4).
2. **Trust strip:** badge status, years of experience, "husband & wife team", "Based in Hadlow". Add a Google rating only once reviews exist.
3. **Meet your instructors:** two cards, each with photo, name, car model and gearbox, a short bio and **its own WhatsApp button**.
4. **Lessons:** one line each for beginners, nervous drivers, intensive or semi-intensive, refresher or foreign licence, motorway (ADI only), and Pass Plus (only if registered).
5. **Price teaser:** "£80 per 2-hour lesson", linking to the prices page.
6. **How it works:** Message us → free chat and first lesson booked → pick-up from home, school or work.
7. **Areas and test centres:**
   - The 14 towns as plain text.
   - Test centres: Tunbridge Wells, Sevenoaks and Maidstone. **Tonbridge has no test centre.**
   - Optional static map image. No embedded Google Map, which would need cookie consent.
8. **FAQ:** how many hours, manual or automatic, test waiting times, test-day car hire, cancellation, foreign licences, payment, pick-up, female instructor, "Does Pass Plus still exist?"
9. **Contact:** WhatsApp, phone, optional short form.
10. **Footer:** legal identity (section 4), links to privacy, terms and the GOV.UK listing.

**No testimonials block at launch.** Add one only once real reviews exist.

**`/lessons-prices`** (H1: "Driving lesson prices in Tonbridge & Hadlow"):
- Full price card for manual and automatic.
- Block discounts shown as real amounts.
- Intensive and semi-intensive packages, "subject to DVSA test availability".
- Test-day package with exactly what is included.
- Early-morning test surcharge as a **figure**.
- Pass Plus, refresher and motorway lessons.
- Booking steps and the cancellation policy.
- The line "Prices are the full amount you pay".

**Legal pages** (these don't count toward the "2 pages"): `/privacy` (includes the cookie and analytics notice plus the WhatsApp notice) and `/terms`. The ADI Code of Practice requires written terms on or before the first lesson.

**Phase 2** (after 3–6 months, only if Search Console data and real unique content support it):
- `/automatic-driving-lessons`
- `/intensive-driving-courses-kent`
- At most 1–2 test-centre guides

**Never** build per-town doorway pages. Google's spam policy targets them: https://developers.google.com/search/docs/essentials/spam-policies

### SEO priorities

1. **Google Business Profile** ([guidelines](https://support.google.com/business/answer/3038177))
   - Set it up as a service-area business with the home address hidden. Name exactly "Route 66 Driving School", with no keywords added.
   - Primary category: Driving school. Add a second category only if "Driving instructor" appears in the dropdown.
   - Service areas: the 14 towns.
   - Services with prices, hours, 10+ real photos, then 1–2 photos a week and a post every month.
   - **Verification is likely by video.** It needs to be one continuous take of about 1–2 minutes showing a local street sign, the **branded car with roof sign and dual controls**, the ADI badge, keys and paperwork. **Finish the car branding before attempting it.** Review can take about 5 business days. ([verification methods](https://support.google.com/business/answer/7107242))
   - **The profile must be owned by Mick**, because he has to do the verification.
2. **Reviews**
   - Use the GBP review short link and a QR card in the car. Send the link by WhatsApp after passes and lessons.
   - Ask **every** pupil, not only happy ones; selective asking (review gating) is banned by Google ([policy](https://support.google.com/contributionpolicy/answer/7400114)).
   - No incentives, and no reviews from friends or family (DMCC Act 2024, in force since 6 Apr 2025, fines up to 10% of turnover: https://www.gov.uk/cma-cases/online-consumer-reviews).
   - Reply to every review within 48 hours.
   - Target about 10 reviews in 90 days.
   - Former pupils from Mick's earlier teaching may honestly review the new profile.
3. **Keywords** (Google UK autocomplete, 3 Oct 2026)
   - Strong: "driving lessons tonbridge" (+automatic/manual/intensive), "driving instructor tonbridge" (+automatic/**female**), "driving lessons tunbridge wells" (+automatic/prices), "driving lessons maidstone", "driving instructor sevenoaks" (+female).
   - Medium: "intensive driving course kent", "driving lessons west malling" and "driving lessons kings hill".
   - "Hadlow" has almost no search demand. Use it for relevance and identity, not as a page target.
   - **Automatic** and **female instructor** are the two differentiators; put both above the fold.
4. **Titles and meta descriptions**
   - Home title: "Driving Lessons Tonbridge & Hadlow | Manual & Automatic | Route 66"
   - Home meta description: "Husband-and-wife driving school based in Hadlow. Manual & automatic lessons, female automatic instructor. Tonbridge, Tunbridge Wells, Kings Hill & West Malling. WhatsApp to book." Say "ADI" here only if both are green-badge ADIs.
   - Prices page title: "Driving Lesson Prices Tonbridge | Intensive Courses Kent | Route 66"
   - One H1 per page.
5. **JSON-LD** (structured data on the home page)
   - **`DrivingSchool` is not a schema.org type** (https://schema.org/DrivingSchool returns 404), and the stack report's suggestion of it is wrong. Use `"@type": ["LocalBusiness","EducationalOrganization"]`.
   - Include `name`, `url`, `telephone`, `logo`, `image`, `priceRange`, `openingHoursSpecification`, `areaServed` (one City entry per town), `makesOffer` (lessons with prices), `employee`/`founder` Person entries for both instructors, and `sameAs` (GBP, Facebook, Yell).
   - Address: only locality "Hadlow", region "Kent", postcode "TN11", country "GB". This will not earn Google's LocalBusiness rich result, which is acceptable.
   - **No `aggregateRating` or `review` markup.** Self-served review stars never show ([Google docs](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)).
   - FAQPage markup is optional. FAQ rich results were reportedly discontinued on 7 May 2026 ([updates](https://developers.google.com/search/updates)), so the visible FAQ text is what counts.
6. **Citations** (business listings), with name, phone and URL identical everywhere:
   1. **GOV.UK "Find driving schools, lessons and instructors"**: the official, free DVSA listing, with a website link per ADI. https://www.gov.uk/find-driving-schools-and-lessons
   2. Bing Places (import from GBP)
   3. Apple Business Connect
   4. Facebook
   5. Yell
   6. Nextdoor
   7. Theory Test Pro instructor directory (if he subscribes)

   Skip paid directories. Lead-broker sites like PassMeFast don't help SEO.
7. **Backlinks:** the GOV.UK listing, Hadlow parish newsletter and village Facebook groups, sixth-form or college careers pages, a local club sponsorship, Kent Online or Times of Tonbridge if there is a real story. Never buy links.
8. **Search Console and Bing Webmaster Tools:**
   - Search Console as a Domain property verified by a DNS TXT record. Submit the sitemap, request indexing, and review the Queries report at 4–6 weeks.
   - Import into Bing from Search Console. Optionally turn on IndexNow.
   - Add `robots.txt`.
9. **Core Web Vitals:** LCP ≤2.5 s (aim for <1.8 s), INP ≤200 ms, CLS ≤0.1. One hero image in AVIF/WebP with explicit size and preload, self-hosted fonts, no third-party scripts, no sliders or video. Lighthouse mobile 95+.

**90-day order of work**
- **Week 0:** car branding, confirm badge status, choose the phone and WhatsApp model, final prices.
- **Week 1:** launch, Search Console and Bing, create and verify the GBP.
- **Weeks 1–2:** GOV.UK listings and the other citations.
- **Ongoing:** reviews and photos.
- **Month 3:** decide phase-2 pages from the data.

---

## 4. Compliance: must-dos and claims to change

### Must-do

1. **Instructor wording per person.** Depends on badge colour.
   - Pink-badge trainees must be called "trainee driving instructor", must name their training establishment, and **may only give the establishment's contact details**, not their own.
   - Source: https://www.gov.uk/trainee-driving-instructor-licence-the-rules/rules-for-using-your-trainee-licence
2. **No DVSA or GOV.UK logos or crown without permission.**
   - Only ADIs can apply (https://www.gov.uk/get-permission-to-use-dvsa-logos).
   - Use plain text and badge photos instead.
3. **Prices**
   - Show the full price including compulsory charges (CAP rule 3.18; the DMCC Act bans drip pricing).
   - Any "from" price must be a price people can actually get.
   - Give the early-test surcharge as a figure.
4. **Legal identity on the site** (E-Commerce Regulations 2002, reg. 6, and Companies Act s.1201–1202):
   - Trading name and legal name.
   - A **geographic address**. Showing only the town does not meet reg. 6. This conflicts with hiding the home address (see question B5).
   - Email and phone.
   - Company number and registered office if a Ltd company; VAT number if registered.
5. **Privacy policy** (UK GDPR Articles 13–14).
   - Controller: Mick.
   - Data processors: hosting (Cloudflare or Vercel), the email provider, WhatsApp/Meta.
   - Retention, e.g. "enquiries deleted after 12 months if no lessons booked".
   - People's rights and the right to complain to the ICO.
6. **Analytics:** cookieless analytics is fine without a banner under the ICO "statistical purposes" exception (final ICO guidance 29 Apr 2026). It must be disclosed, with a **simple and free way to opt out**; a toggle on the site is the most solid option.
7. **WhatsApp:** a plain `wa.me` link only, with no Meta widget script. Mention it in the privacy policy.
8. **Contact form:** only the fields needed, no pre-ticked marketing box, a privacy note next to the form.
9. **ICO data protection fee:** probably due once he keeps pupil records. Tier 1 is £52 a year. Confirm with the ICO self-assessment: https://ico.org.uk/for-organisations/data-protection-fee/self-assessment/
10. **Accessibility:** WCAG 2.2 AA (contrast 4.5:1, focus states, labels, tap targets ≥44px). Never use the logo red on blue for text.
11. **Terms page** (ADI Code of Practice): price and lesson length, test-car conditions, cancellation on both sides, refunds, complaints route (instructor → Citizens Advice → instructorconduct@dvsa.gov.uk).
12. **No pupil photos or test footage** without written consent.

### Michael's copy: exact replacements

| Michael's claim | Problem | Replace with |
|---|---|---|
| "DVSA approved instructors" | True only if both hold green badges | **If both are ADIs:** "Michael and [Name] are both DVSA Approved Driving Instructors (ADIs)." **If she is a trainee:** "Michael [Surname] – DVSA Approved Driving Instructor (ADI no. XXXXXX). [Name] – Trainee Driving Instructor (automatic), training with [establishment]. Book all lessons through Route 66 Driving School on [school number]." |
| "High first-time pass rate" | No data; ASA rulings (Trailer Training, Bradleys, HGV Learning) | "Lessons planned around the Tunbridge Wells, Sevenoaks and Maidstone test routes." Later, only with real records: "Of our pupils who took their first test between [date] and [date], X of Y (Z%) passed. DVSA national average for the same period: N% (source)." |
| "£40/hour" | Lessons are sold only as 2 hours; the full price must be shown | "Lessons are 2 hours: £80 (£40 per hour)." |
| "£210 test day, early tests extra" | The surcharge needs a figure | "Test day: £210 – use of the car for your test, plus a 1-hour warm-up lesson [and pick-up/drop-off]. Tests starting before [time]: £[X] extra. Prices are the full amount you pay – no VAT or hidden fees." (Use the VAT wording only if he is not VAT-registered.) |
| "Block booking discounts" | Vague; any was/now price must be genuine | "10 hours: £[X] (save £[Y] compared with £40/hr)." |
| "Intensive & semi-intensive" | Implies a test date | "Intensive and semi-intensive courses – test date subject to DVSA availability." Never say "guaranteed pass" or "fastest pass". |
| "Pass Plus" | Needs ADI registration (£37) | Keep only if registered: "Pass Plus (registered instructor)". Otherwise: "Post-test motorway and confidence lessons". |
| "Motorway lessons" | Learners only with an ADI in a dual-control car | "Motorway lessons with [ADI name] in a dual-controlled car." Do not attach this to a trainee. |
| "Automatic female instructor 07592137400" (flyer) | If she is a trainee, her personal number cannot be published | Use the school number. If she is a green-badge ADI, her number is fine. |
| Any "best", "No.1", "guaranteed" | CAP Code section 3 | Remove. |

---

## 5. WhatsApp, conversion and design

**WhatsApp and contact (decided)**
- Build our own `<a href="https://wa.me/44…?text=…">` button with the official icon in #25D366, about 1KB.
- No Elfsight or GetButton: they slow the page, can set cookies and cost money.
- **Mobile:** a sticky bottom bar with "WhatsApp" (green) and "Call" that appears after the hero scrolls away. Buttons at least 48px tall, with room for the iPhone home bar (`safe-area-inset-bottom`) and matching footer padding.
- **Desktop:** WhatsApp and Call in the header, plus a small floating WhatsApp button at the bottom right.
- **Two instructors:** the main WhatsApp button opens a small chooser built by us with two rows: "Michael · Manual" and "[Name] · Automatic · female instructor". Each row links to its own number with its own prefilled text. Each instructor card links straight to that person.
  - Prefilled text: "Hi! I found you on route66drivingschool.co.uk. I'd like [manual/automatic] lessons in [area]. My name is…"
  - This depends on question B4. If she is a trainee, both rows must go to the school number.
- **Secondary form:** name, phone, manual or automatic, area, message, with a honeypot field. No booking calendar.
- **WhatsApp Business setup (Mick's side):**
  - Business profile with logo, category, hours and website.
  - Greeting message asking for name, manual or auto, area, provisional licence and preferred days.
  - Away message during lessons.
  - Quick replies: /prices, /testday, /areas, /cancel, /foreign.
  - Catalog of packages, chat labels, a QR code for the flyer and car.
- Track clicks on WhatsApp, Call and the form.

**Design direction**
- The logo carries the retro feel; the rest stays calm and clean. Off-white background, navy text, a single red accent.
- Checkered pattern only as a thin divider or a "Passed!" motif. No diner kitsch, no US desert-road stock photos.
- **Fonts** (self-hosted with `@fontsource`): Barlow Condensed 600–800 for headings (based on US highway-sign lettering; https://github.com/jpt/barlow) and Barlow 400/500 for body text.
- **Colours** (adjust to the real logo):
  - red `#C8102E`, navy `#0B2545`, blue `#1D4E89`
  - background `#FAF8F4`, surface `#FFF`, text `#14213D`, muted `#5B6475`, border `#E4E1DA`
  - WhatsApp `#25D366` (on WhatsApp buttons only)
  - optional sign yellow `#F2B705` for chips
- Only real photos:
  - both instructors with the branded car
  - the dual controls (reassures parents)
  - an L-plate
  - a Hadlow Tower or Tonbridge backdrop
- The logo needs to be **vectorised to SVG** and turned into favicons (svg, ico, 180px apple-touch-icon, webmanifest) and a 1200×630 social preview image.
- Reference site: https://sevenoaksdrivinglessons.co.uk (instructor in the hero, exact prices, "the price you see is the price you pay", a WhatsApp CTA, a section for parents).

---

## 6. Competitor price benchmark and positioning

**Verified local prices** (3 Oct 2026):

| School | Manual | Automatic | Blocks / packages | Test day |
|---|---|---|---|---|
| Gavin's (indep.) | £42/hr | – | 10 hr £400 | – |
| Road Rules (indep.) | £40/hr | – | 10 hr £400 + 1 free; intensives £156–£780 | **£145** (1 hr + car) |
| Carr's (8 instructors) | £45/hr | £47.50/hr | – | on request |
| Kinetic (regional) | about £32–37/hr | yes | 10 hr £320 | – |
| Topclass (regional) | from £36/hr | – | 10 hr £300 intro | – |
| Bill Plant / My Four Wheels (national) | 2 hr £70 / £66 intro | – | – | – |
| Sevenoaks Driving Lessons | **from £60/hr** (an outlier) | about £63/hr | – | – |
| Emergency test-car hire (Gumtree, Maidstone) | – | – | – | from £180 |

**Reading the market**
- **£40/hr (£80 per 2 hours) is in line** with verified Tonbridge-area independents (£40–45).
- The conversion report's view that "£40 is well below market" rests on one premium Sevenoaks outlier, so do not follow it blindly.
- Automatic usually costs **£2–5/hr more** than manual.
- **£210 test-day hire is above the visible market** (£145–£180+). Options:
  - keep £210 for non-pupils or short notice, and charge less for own pupils; or
  - keep it and list everything included (pick-up, about 3 hours of car time, dual controls, insurance).

**Positioning:** "Hadlow's own husband-and-wife driving school: manual with Michael, automatic with [Name] (female instructor). Clear prices, real faces, quick WhatsApp replies."

**Gaps to exploit**
- Nobody local has a WhatsApp widget; only Tonbridge DS even has a wa.me link.
- Most independents hide prices.
- There is no male-manual plus female-automatic couple locally.
- Nobody is *based* in Hadlow.
- A clear test-day package for experienced and foreign-licence drivers.
- A short test-centre guide.

**Closest rivals**
- **Lisa's Automatic Learners:** female automatic instructor, Tonbridge.
- **Paul's (pjrdriving):** automatic, covers Hadlow.
- **Driving School Tonbridge (Michaela):** female instructor, the same patch, a strong FAQ and testimonials, but no prices.

**Name clash**
- Other users of the name: Route66 Driving School in Dundee (553 reviews), Route66 Driving Lessons in Blackpool, and **ROUTE 66 DRIVING SCHOOL LTD (SC846448, Scotland)**.
- None are in Kent, so the local risk is low.
- Always pair the name with a place, e.g. "Route 66 Driving School – Hadlow & Tonbridge".
- A UK limited company cannot use the exact name; "Route 66 Driving School (Kent) Ltd" would work.

---

## 7. Open questions for Michael

| # | Question | Priority |
|---|---|---|
| B1 | Badge colour (green ADI or pink trainee) and ADI number for **Michael** | **BLOCKER** |
| B2 | Badge colour and ADI number for **his wife**. If she is a trainee: her training establishment and sponsoring ADI. | **BLOCKER** |
| B3 | Wife's name as it should appear, and surnames for both | **BLOCKER** |
| B4 | Phone and WhatsApp model: one shared school WhatsApp Business number, or one number per instructor? Which number is the **primary** one used everywhere (site, GBP, flyer)? Is 07592137400 hers? | **BLOCKER** |
| B5 | Business entity (sole trader or Ltd; if Ltd, company number and registered office), VAT registered (yes/no), and a **geographic address that can be published** for the legal footer (home or another business address) | **BLOCKER** |
| B6 | Final prices: manual 2-hour lesson, automatic 2-hour lesson, block deals (exact amounts), intensive and semi-intensive packages, test-day hire (own pupils vs others), early-test surcharge amount and cut-off time | **BLOCKER** |
| B7 | Cars: make, model and gearbox for each instructor; dual controls confirmed | **BLOCKER** |
| B8 | Services each person actually offers: Pass Plus registered (yes/no)? Motorway lessons (ADI only)? Theory support? Foreign-licence or refresher lessons? | **BLOCKER** |
| B9 | Business email he will use (e.g. lessons@route66drivingschool.co.uk forwarding to his own inbox), and who owns that inbox | **BLOCKER** |
| B10 | Real photos: both instructors with the car, the car with branding, dual controls. If none exist, a one-afternoon phone shoot. | **BLOCKER** (could launch on the logo alone, with weaker conversion) |
| B11 | Logo source file (vector or high-res PNG), and whether car branding and a roof sign exist or are planned (needed for GBP verification) | **BLOCKER** for GBP; NICE-TO-HAVE for the site |
| B12 | Cancellation and refund policy (notice period, both sides) and accepted payment methods | **BLOCKER** (needed for the terms page) |
| B13 | Working hours and days per instructor (evenings and weekends?) | **BLOCKER** for GBP and schema; NICE-TO-HAVE for the site |
| B14 | Final list of areas he will actually cover (all 14?), and which test centres they use (Tunbridge Wells, Sevenoaks, Maidstone?) | NICE-TO-HAVE (the current list is usable) |
| B15 | Years of experience and short personal bios (with his previous teaching history) | NICE-TO-HAVE |
| B16 | Existing reviews, or an old GBP or Facebook page from earlier teaching? A previous trading name? | NICE-TO-HAVE |
| B17 | Standards check grade (A or B) for each ADI, if he wants to show it | NICE-TO-HAVE |
| B18 | Will they opt in to the GOV.UK "Find driving schools" listing? | NICE-TO-HAVE (strongly recommended) |
| B19 | ICO data protection fee paid? | NICE-TO-HAVE for launch; a legal must for the business |
| B20 | Social accounts (Facebook, Instagram) to link | NICE-TO-HAVE |
| B21 | Has the flyer already been printed with the wife's number? (If she is a trainee, it must be reprinted.) | NICE-TO-HAVE (but legal) |

---

## 8. Open decisions for Abdullah

| Decision | Options | Recommended default |
|---|---|---|
| **Hosting** | Cloudflare Workers (free) / Vercel Pro ($20/month) / Netlify free | **Cloudflare Workers.** Vercel only if Mick agrees to pay the $20/month. Never Vercel Hobby. |
| **DNS** | Keep on GoDaddy / move nameservers to Cloudflare | **Move to Cloudflare** (needed for Email Routing; simpler redirects) |
| **Framework** | Astro 7 / Next.js | **Astro 7 static** |
| **Canonical host** | bare domain / www | Cloudflare: **bare domain**. Vercel: www. |
| **Who owns the accounts** (GitHub repo, hosting, domain, GBP, email) | Abdullah keeps them / transfer to Mick | **Mick owns the domain, GBP, email inbox and hosting account; Abdullah gets admin access.** The domain is currently on Abdullah's GoDaddy account (abdgndz34@gmail.com, confirmed). Plan a transfer or at least a written agreement. |
| **GitHub account for `abdgndz/route66`** | Keep on abdgndz / move to a neutral account or org | The repo exists under `abdgndz`. Under CLAUDE.md, abdgndz34@gmail.com sessions run in TradersX mode, where `abdgndz` **must not** be used. **Default: keep the repo on abdgndz and only work on it from Threecolts-mode sessions**, or transfer it to a neutral account or org (or Mick's) to remove the conflict. Abdullah confirms. |
| **Pages** | 1-page landing / Home + Prices | **Home + Lessons & Prices**, plus `/privacy` and `/terms` |
| **WhatsApp model** | Chooser between two numbers / one shared number | **Chooser** if both are ADIs. Shared school number if the wife is a trainee. |
| **Contact form** | None / Web3Forms / Worker + Resend + Turnstile | **Web3Forms with a honeypot** (moving to a Worker later is easy) |
| **Analytics** | Cloudflare Web Analytics / Vercel Analytics / GA4 | **Cloudflare Web Analytics** (cookieless) plus click events. **No GA4.** Add an opt-out toggle on the privacy page. |
| **Testimonials at launch** | Placeholder / none | **None.** Add once real Google reviews arrive (DMCC Act). |
| **FAQ schema** | Add / skip | Visible FAQ section; **skip FAQPage markup** (no search display in 2026, adds noise) |
| **Map** | Embedded Google Map / static image / none | **Static image or plain text area list** (no consent needed) |
| **Design skill** | frontend-design / Taste minimalist-ui | **frontend-design** (already in the marketplace), with our own DESIGN.md |
| **Content editing by Mick later** | CMS / JSON content file | **One `content.json`/`.md` file** for prices, hours and areas |
| **Test-centre pass rates on site** | Show / skip | **Skip at launch.** Sources conflict. Add later from official DVSA data with the period stated. |
| **Business email** | Cloudflare Email Routing / ImprovMX / Workspace | **Cloudflare Email Routing** → Mick's inbox. Workspace only if sending deliverability becomes a problem. |

---

## Completeness check: still unverified or missing

| Item | Status | Matters? |
|---|---|---|
| Badge status of both instructors on the GOV.UK register | **Not checked.** Could be searched by postcode on gov.uk/find-driving-schools-and-lessons, but they may not be listed. | **High.** Drives all instructor wording, the flyer and the WhatsApp model. Ask Mick (B1/B2). |
| How to publish an address under reg. 6 while GBP hides the home address | Not resolved. Unclear whether a mail-forwarding or registered-office address counts as "geographic address where established" for a sole trader. | **Medium-high.** Needs Mick's choice; the compliance report says a business or service address is acceptable. |
| FAQ rich results "discontinued 7 May 2026" | From one report citing the Google changelog; not re-checked | Low. The decision (skip FAQ markup) holds either way. |
| "Driving instructor" as a GBP category | Not confirmed in Google's list | Low. Check the dropdown during setup. |
| Test-centre pass rates (Tunbridge Wells 51% / 58.9% / 60.1% / 64.5%) | Sources conflict; 64.5% unconfirmed | Low for launch (not shown). Use official DVSA data later. |
| Local price ceiling (the £60/hr Sevenoaks claim vs £40–45 elsewhere) | One source for £60 | Medium for Mick's pricing decision. Benchmark from the verified independents. |
| £210 test-day price competitiveness | Only 2 visible comparators (£145, £180+) | Medium. Mick's call. |
| UK IPO trademark search for "Route 66" in class 41 | Not done | Low-medium. Do a 10-minute search before printing car branding or flyers. |
| Existing Ltd name SC846448 | Verified via a third-party mirror (ltds.uk), not Companies House directly | Low. Matters only if forming a Ltd. |
| ICO fixed penalty (about £4,350) | Not confirmed on the ICO site | Low. Paying the fee (£52) makes it irrelevant. |
| Cloudflare Web Analytics current terms; Web3Forms pricing | Not re-checked; Web3Forms pricing from third-party pages (its own site blocked the fetch) | Low. Check at setup. |
| Vercel Pro being required for analytics custom events | Verified from Vercel docs | Matters only if Vercel is chosen. |
| Sticky-bar conversion uplift (25–40%) | Vendor or anecdotal figures | Low. The pattern is still standard best practice. |
| Domain history (2013 capture, lapsed) | Content not retrievable; no sign of a penalty | Low. Confirm in Search Console after launch. |
| Whether Mick previously traded under another name, or has an old GBP or reviews | Unknown | Medium. Affects review strategy and NAP consistency (B16). |
| Mick's insurance (business car insurance covering tuition) | Not researched | Low for the site; worth mentioning on the parents section if confirmed. |
| Whether Mick wants to own and pay for the accounts (hosting, email, ICO fee) | Unknown | **Medium-high.** Ownership and handover need agreeing before go-live. |
| Hadlow College as a backlink target (it has had mergers) | Not verified | Low. |
| The son's handyman site | Out of scope | None now. If built on the same Cloudflare account later, it is free. |
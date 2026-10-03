# Launch checklist

## A. Draft preview (now)

1. Log in to Cloudflare once from the terminal: `npx wrangler login`. Use the Cloudflare account that already holds abdgndz.com.
2. Deploy from this folder: `npm run deploy`.
3. You get a preview URL like `route66-driving-school.<subdomain>.workers.dev`. Send it to Michael.

While `DRAFT = true`, the preview is not indexed by search engines.

## B. Going live (after Michael's corrections)

### 1. Content

- Replace every highlighted value in `src/data/site.ts`: names, ADI numbers, phone numbers, address, email, bios and cars.
- Delete the sample reviews.
- Set `DRAFT = false`.
- Run `npm test`, then `npm run deploy`.

### 2. Move DNS to Cloudflare (GoDaddy stays the registrar)

1. In Cloudflare, go to **Add a domain**, enter `route66drivingschool.co.uk` and choose the Free plan.
2. Cloudflare shows two nameservers.
3. In GoDaddy, go to **My Products → route66drivingschool.co.uk → DNS → Nameservers → Change → "I'll use my own nameservers"** and paste the two Cloudflare nameservers.
4. Wait until Cloudflare says the domain is **Active**. This usually takes minutes, occasionally up to 24 hours.

### 3. Attach the domain to the site

1. In Cloudflare, go to **Workers & Pages → route66-driving-school → Settings → Domains & Routes → Add → Custom domain**.
2. Add `route66drivingschool.co.uk`, then add `www.route66drivingschool.co.uk`.
3. Redirect www to the bare domain: **Rules → Redirect Rules**, choose the template "Redirect from WWW to root", status 301.

### 4. Email: lessons@route66drivingschool.co.uk forwarding to Michael

1. Go to **Cloudflare → Email → Email Routing → Enable**. Cloudflare adds the MX and SPF records automatically.
2. Create the address `lessons@`, forwarding to Michael's personal email. Michael clicks the verification link sent to him.
3. Add a DMARC TXT record: name `_dmarc`, value `v=DMARC1; p=none; rua=mailto:lessons@route66drivingschool.co.uk`.

### 5. Google

1. In **Search Console**, add a Domain property and verify it with the TXT record that Cloudflare adds automatically. Then submit `sitemap-index.xml`.
2. In **Bing Webmaster Tools**, import from Search Console.
3. **Google Business Profile** must be created by **Michael, in his own Google account**. Set it up as a service-area business with the home address hidden, primary category "Driving school", and the 14 service areas. Verification is usually by video, and the branded car must be in the video.
4. Optional: in Cloudflare, go to **Analytics → Web Analytics** and enable it for the site. It is cookieless, so no banner is needed. It is already described on the privacy page.

### 6. Michael's to-do list (not website work)

- **WhatsApp Business app:** set up the profile, greeting message, away message and quick replies.
- Pay the ICO data protection fee (about £52 a year) if it applies to him.
- Opt in to the GOV.UK "Find driving schools" listing.
- Brand the car, needed for Google Business Profile verification.

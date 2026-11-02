# WEDE-POE-PART-
WEDE5020 POE. Part 1: proposal. Part 2: CSS and responsive design. Part 3: functionality and SEO.

Live site: https://forbesrsa.github.io/WEDE-POE-PART-/
## Site structure

| File | Purpose |
|------|---------|
| `index.html` | Home page |
| `about.html` | Who we are, opening hours, team |
| `services.html` | Services with search, category filter and sort (loaded from `data.js`), plus FAQ accordion |
| `gallery.html` | Photo gallery with lightbox |
| `enquiry.html` | Enquiry form: returns an estimated price and availability |
| `contact.html` | Contact form (builds an email), contact details, interactive map |
| `404.html` | Custom "page not found" page |
| `styles.css` / `script.js` / `data.js` | Styling, behaviour, service data |
| `robots.txt` / `sitemap.xml` / `_headers` | SEO and security files |

## Part 3 features

**Interactive elements**
- FAQ accordion (animated open and close, one answer open at a time, keyboard and screen reader friendly).
- Gallery lightbox using the `<dialog>` element (modal).
- Interactive map with Leaflet and OpenStreetMap on the contact page.
- CSS and JavaScript animations: sections fade in as you scroll (IntersectionObserver), accordion height transition, hover and focus transitions. Animations are switched off for users who prefer reduced motion.

**Dynamic content**
- The services list is built with JavaScript from `data.js` using DOM methods (`createElement`, `replaceChildren`). Visitors can search, filter by category and sort by price, name or duration. Without JavaScript the same services are shown as plain HTML.
- The enquiry form fills its service list and prices from the same data, and `?service=` links pre-select a service.

**Forms and validation**
- Enquiry form (`enquiry.html`): name, South African phone number, email, service, extras, date, time and notes. After validation the page shows an estimated total, estimated duration and whether the date and time fit the opening hours (closed Sundays, 09:00 to 19:00, appointment must finish by 19:00).
- Contact form (`contact.html`): name, email, optional phone, message type, subject and message. After validation the details are compiled into an email to the recipient set in the code (`SHOP.email` in `script.js`) and the visitor sends it with the "Send email" button.
- HTML5 validation attributes (`required`, `type`, `minlength`, `maxlength`, `pattern`, `min`, `max`, `step`) plus JavaScript validation using the Constraint Validation API. Errors appear next to each field, with an error summary, `aria-invalid` and `aria-describedby`.
- AJAX: the enquiry form submits in the background with `fetch` (no page reload). On Netlify the copy reaches the owner through Netlify Forms. Elsewhere it fails safely and the visitor still sees their response.
- Spam protection with a hidden honeypot field. All user text is displayed with `textContent`, never `innerHTML`.

## SEO

**On-page**
- Keywords researched around how people search: "barber Johannesburg", "barbershop Bezuidenhout Valley", "haircut prices Johannesburg", "kids haircut", "book a barber WhatsApp". They appear naturally in titles, descriptions, headings and body text.
- A unique `<title>`, meta description, canonical link and Open Graph tags on every page.
- One `<h1>` per page and a logical `h2` and `h3` structure.
- Images: descriptive file names (for example `braids-skin-fade-line-design-800.jpg`), descriptive alt text, width and height set, lazy loading, `srcset` and `<picture>`.
- Clean, flat URLs (`/services.html`, `/enquiry.html`) and internal links between related pages (navigation, footer, and in-content links).
- Mobile-friendly, responsive design.

**Local SEO**
- `BarberShop` structured data (JSON-LD) with address, phone, opening hours and geo coordinates on the home page.
- Address, phone and hours match the Fresha listing format on every page.

**Off-page plan** (done outside the code)
- Backlinks: ask Fresha, local business directories (for example Cybo and Africa Biz Info), community pages and local blogs to link to the site.
- Social media: link from the Instagram profile (@erickayzbarbershop) bio and posts to the website. The footer links back to Instagram.
- Claim and complete a Google Business Profile with the same name, address, phone and hours, and ask happy customers for reviews.

**Additional**
- `robots.txt` allows crawling and points to `sitemap.xml`, which lists all six public pages. `404.html` is marked `noindex`.
- Page speed: scripts use `defer`, fonts are preconnected, images are lazy loaded and sized, the Leaflet library loads only on the contact page, and cache headers are set in `_headers`.
- Security: HTTPS (free on GitHub Pages and Netlify), `rel="noopener"` on external links, referrer policy, and `_headers` (Netlify) sets `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`. Input is validated and never written into the page as HTML.

## Deployment

**GitHub Pages:** push to GitHub, then Settings > Pages > Deploy from branch `main` / root. The site appears at `https://USERNAME.github.io/REPO/`.
**Netlify (recommended, forms work):** log in to Netlify, "Add new site" > "Import from Git" (or drag the project folder in). No build command is needed. After the first deploy, open Forms in the Netlify dashboard to see enquiries.

After deploying, replace `https://YOUR-SITE-URL` in all files (VS Code: Ctrl+Shift+H) with your real address, and set the recipient email in `script.js` and `contact.html`.

## Changelog

> Update the dates to match your commits. Paste your Part 2 feedback comments into the first table.

### Feedback edits from Part 2

| Date | File | What was changed | Feedback point addressed |

| 01/11/2026 | (file name) | Describe the exact edit | Paste the feedback comment here |

### New entries (Part 3)

| Date | File | What was changed | Reason |

| 01/11/2026 | enquiry.html | Created the enquiry form with validation, a price and availability response and AJAX submission | Part 3 requirement 4.1 (enquiry.html) |
| 01/11/2026 | contact.html | Added the contact form that compiles a validated email to the recipient in the code | Part 3 requirement 4.1 (contact.html) |
| 01/11/2026 | contact.html | Added a Leaflet and OpenStreetMap interactive map | Requirement 2.1 (interactive maps) |
| 01/11/2026 | services.html, data.js | Services are now built from `data.js` with search, category filter and sort | Requirement 2.2 (dynamic content, filter and sort) |
| 01/11/2026 | services.html, enquiry.html | Added an FAQ accordion | Requirement 2.1 (accordions) |
| 01/11/2026 | script.js | Added shared validation, form handlers, accordion, scroll-reveal animation, map and services code | Requirements 2.1, 2.2 and 4 |
| 01/11/2026 | styles.css | Added form, error, result, accordion, search tools, map and reveal styles. Removed the CSS `@import` for fonts | Part 3 features and page speed |
| 01/11/2026 | All pages | Added Enquiry to the navigation and footer. Added canonical links, Open Graph and Twitter tags, referrer policy, Instagram footer link and font preconnect | SEO and navigation |
| 01/11/2026 | index.html | Extended the structured data with url, image, geo and area served. Added an enquiry link | Local SEO and internal linking |
| 01/11/2026 | about.html | Added internal links to services, gallery and enquiry | Internal linking |
| 01/11/2026 | images/ | Renamed image files to descriptive names  and updated all refereces | Image optimisation |
| 01/11/2026 | robots.txt, sitemap.xml | Created both files | Requirement 3.3 |
| 01/11/2026 | _headers | Added security and caching headers for Netlify | Security and page speed |
| 01/11/2026 | 404.html | Created a custom not-found page | Usability and SEO |

### Earlier entries (Part 2)

| Date | File | What was changed | Reason |

| 29 October 2026 | index.html, about.html, services.html, gallery.html, contact.html, styles.css, script.js | Built the five-page site with an external stylesheet, dark gold theme, Grid and Flexbox layouts, three breakpoints, responsive images, mobile menu and gallery lightbox | Part 2 requirements |

## References

- Eric Kayz Barbershop. n.d. Eric Kayz Barbershop. Available at: https://erickayz.com (Accessed: 15 August 2026).
- Fresha. n.d. Eric Kayz Barbershop. Available at: https://www.fresha.com/a/eric-kayz-barbershop-johannesburg-15-8th-street-qdzk8bu2 (Accessed: 24 October 2026).
- Leaflet. n.d. Leaflet, an open-source JavaScript library for interactive maps. Available at: https://leafletjs.com (Accessed: 24 October 2026).
- OpenStreetMap contributors. n.d. OpenStreetMap. Available at: https://www.openstreetmap.org (Accessed: DD Month 2026).
- MDN Web Docs. n.d. Client-side form validation. Available at: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation (Accessed: 24 October 2026).
- MDN Web Docs. n.d. Using the Fetch API. Available at: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch (Accessed: 24 October 2026).
- Google. n.d. Search Central: SEO starter guide. Available at: https://developers.google.com/search/docs/fundamentals/seo-starter-guide (Accessed: 24 October 2026).
- Google Fonts. n.d. Barlow Condensed and Source Sans 3. Available at: https://fonts.google.com (Accessed: 22 October  2026).

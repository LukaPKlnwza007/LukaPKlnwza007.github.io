# Denpoom Lothaisong - portfolio

A five-page portfolio site with a dark control-room theme. Hand-written HTML,
CSS and JavaScript, one Three.js scene, and a Java/Spring Boot service behind
the contact form.

No framework, no build step, no dependencies in the browser except Three.js,
which is pulled from a CDN at runtime and degrades gracefully if it fails.

Palette: deep navy `#0a0e17`, amber `#ffb454`, mint `#5eead4`.

---

## Running it

### The site

It has to be served over HTTP. **Opening the files directly with `file://` will
not work properly** - Three.js is loaded via dynamic import, which that protocol
blocks. The page still renders; the hero just falls back to a 2D radar scene.

```bash
npx serve .
```

```bash
python -m http.server 8000
```

Or use the VS Code **Live Server** extension and open `index.html`.

### The API

Needs **JDK 17+** and **Maven**.

```bash
cd backend
mvn spring-boot:run
```

It comes up on `http://localhost:8080`. Check it with
`http://localhost:8080/api/contact/health`.

By default it uses file-backed H2 (`backend/data/`), so there is nothing to
install, and email is switched off - messages are stored and logged only.

```bash
cd backend
mvn test
```

---

## Making it yours

Everything personal lives in **`assets/js/data.js`**, and nowhere else. Change
it there and all five pages follow. Look for the `« EDIT »` markers.

| What | Key in data.js | Notes |
|---|---|---|
| Name, role, callsign | `identity` | `callsign` is the label in the nav and boot screen |
| Email and GitHub | `identity.email`, `socials` | reused by every mailto and the footer |
| Contact API URL | `identity.contactEndpoint` | point at your real domain before deploying |
| Projects | `projects` | `featured: true` puts one on the home page; keep it to three |
| Home-only project label | `projects[].homeName` | optional: the home page reads "Activity 1" where the work index reads "Project 1" |
| Photography | `projects[].cover`, `projects[].coverAlt`, `identity.photo` | files in `assets/img/`, plus a description of what is in each one |
| Extra photos on a detail page | `projects[].gallery` | optional `{ src, alt, caption }` list; the Photos block only appears when there are some |
| What a project taught you | `projects[].learned` | plain sentences. This used to be a row of big numbers, which on school work meant inventing statistics |
| History and skills | `timeline`, `skills` | `skills` is a plain list of names, no levels |

The prose on the home and about pages lives in the HTML rather than data.js, so
it is still there for search engines and for anyone with JavaScript disabled.

---

## Structure

```
portfolio/
├── index.html              hero and name card, three featured projects,
│                           the full work index, working notes
├── about.html              biography, timeline, skills
├── projects.html           all work, filterable, deep-linkable (#work-<id>)
├── project-detail.html     one template for every project (?id=...)
├── contact.html            form plus direct contact routes
├── favicon.svg
├── assets/
│   ├── css/
│   ├── js/
│   └── img/                portrait and project photography
└── backend/                Spring Boot API
```

### CSS - split by job, not by page

| File | Contents |
|---|---|
| `base.css` | reset, design tokens, typography, page backdrop, CRT overlay, focus ring, reduced-motion |
| `components.css` | anything reused: buttons, chips, cards, HUD panels, nav, forms, timeline, skills, footer |
| `animations.css` | every keyframe, plus scroll reveal, page transition and filter states |
| `pages.css` | layout belonging to a single page |

All four load on every page, in that order. `base.css` has to be first: the
others read its custom properties.

### JavaScript

| File | Job | Loaded on |
|---|---|---|
| `data.js` | **all content.** Must load first. | every page |
| `cards.js` | DOM helper plus the project card template | every page |
| `main.js` | nav, mobile menu, scroll-reveal fallback, boot screen, `data-bind` | every page |
| `page-transitions.js` | the veil between pages | every page |
| `card-tilt.js` | 3D tilt and pointer spotlight | index, work |
| `interactions.js` | magnetic primary action, title scramble | every page |
| `hero-3d.js` | the Three.js scene, and its 2D fallback | index |
| `home.js` | featured projects, the work index, ticker | index |
| `about-page.js` | scroll-driven timeline, skills list | about |
| `projects-filter.js` | builds the grid, handles filtering | work |
| `project-detail.js` | fills the template from `?id=` | detail |
| `contact-page.js` | contact links, availability badge | contact |
| `contact-form.js` | validation, the POST, inline status | contact |

Everything is `defer`, so scripts run in order once the DOM is parsed, without
blocking the first paint.

### Backend

| File | Job |
|---|---|
| `PortfolioApiApplication.java` | entry point |
| `ContactController.java` | `POST /api/contact`, `GET /api/contact/health` |
| `ContactService.java` | rate limit, store, notify |
| `ContactRequest.java` | DTO and Bean Validation, matching the client rules |
| `ContactMessage.java` | JPA entity for `contact_message` |
| `ContactRepository.java` | Spring Data repository |
| `ContactProperties.java` | immutable config under the `contact` prefix |
| `ApiExceptionHandler.java` | one JSON error shape for everything |
| `WebConfig.java` | CORS |
| `application.properties` | database, SMTP, CORS, rate limits - all env-overridable |

---

## Interaction

Motion is timed by scroll position using native CSS scroll-driven animations.
**There is no scroll event listener anywhere in this project** - listeners run
per frame on the main thread and are the usual reason a page feels heavy on a
phone. Where `animation-timeline` is unsupported, each piece degrades to a
sensible static state rather than to a JavaScript fallback.

| Effect | What it is for | How |
|---|---|---|
| Pinned project stack | Three featured projects in a grid get skimmed. One at a time gets read. | `position: sticky` plus `animation-timeline: view()`, desktop only |
| Reading position bar | On a long case study it is the only cue about length | `animation-timeline: scroll(root block)` |
| Timeline rail and markers | Turns a list of jobs into a direction of travel | `animation-timeline: view()` per item |
| Section entrances | Sequence, so the page arrives in an order | `animation-timeline: view()`, IntersectionObserver fallback |
| Magnetic primary action | Makes the main target feel larger than its box | pointer physics in `interactions.js`, rAF, no state |
| Title scramble on hover | The one place the instrument theme gets to be literal | `interactions.js`, pointer and focus |
| Card tilt and spotlight | Depth cue, and a reason for the card to react | `card-tilt.js`, measured once per hover |
| Duotone photography | Unrelated photos read as one system, then relax to colour on hover | CSS filter plus a blend layer |

Everything above is pointer-only where it should be, and every piece stands
down under `prefers-reduced-motion`.

Project photography lives in `assets/img/`, nothing is fetched from a photo
service, so the site renders the same offline as online. Each entry carries
`cover` (the file) and `coverAlt` (what is in the photograph, for screen
readers and for the case where the image does not load). `identity.photo` is
the portrait on the home page. Replace the files or repoint `projects[].cover`
in `data.js` to change them.

## The boot screen

On every page, so someone who lands on a shared project link gets the same
entrance. It plays **once per session** (`sessionStorage`, key `boot-seen`) -
clicking around should not mean waiting over and over.

The name is split into graphemes with `Intl.Segmenter` rather than `split('')`,
so scripts with combining marks survive it. Thai is the case that motivated it:
`split('')` turns `วงศ์` into four floating pieces, `Intl.Segmenter` gives you
`ว` `ง` `ศ์`.

It lifts when all three are true:

| Condition | Value | Why |
|---|---|---|
| Minimum on screen | 1150ms | shorter and the name animation gets cut off mid-word |
| `load` has fired | - | so the progress bar is not pure theatre |
| Hard ceiling | 2000ms | a slow CDN is not the visitor's problem |

Skipped entirely under `prefers-reduced-motion`. If JavaScript never runs,
`html:not(.js) .boot { display: none }` hides it, so it cannot strand anyone
behind a screen with nothing to dismiss it.

Timings are `MIN_MS` and `MAX_MS` in `initBoot()` in `assets/js/main.js`.

---

## Contact API

**`POST /api/contact`**

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "subject": "Dispatch board",
  "message": "At least 10 characters, at most 2,000."
}
```

| Status | Meaning | Body |
|---|---|---|
| `201` | stored | `{ "message": "...", "id": 1 }` |
| `400` | validation failed | `{ "message": "...", "errors": { "email": "..." } }` |
| `429` | over the rate limit | `{ "message": "..." }` |
| `500` | our fault | `{ "message": "..." }` |

The page reads `errors` and marks the matching inputs automatically.

**Three layers of spam defence:** a honeypot field (`website`), a per-IP limit
held in memory, and the same limit counted from the table - the third still
works immediately after a restart, which is exactly when the in-memory one is
empty.

### Deploying

Configure through environment variables; no file needs editing:

```bash
CORS_ORIGINS=https://your-domain.com     # never "*"
DB_URL=jdbc:postgresql://localhost:5432/portfolio
DB_USER=portfolio
DB_PASSWORD=...
DB_DRIVER=org.postgresql.Driver
DDL_MODE=validate
H2_CONSOLE=false
MAIL_ENABLED=true
MAIL_USERNAME=...
MAIL_PASSWORD=...
```

Then point `identity.contactEndpoint` in `data.js` at the deployed URL.

---

## Accessibility and performance

**Accessibility**
- a skip link is the first tab stop on every page
- amber focus rings, clearly visible on the dark ground; no outline is removed
  without a replacement
- the mobile menu uses `aria-expanded` and `aria-controls`, closes on Escape,
  and returns focus to the button
- skill meters are real buttons, so keyboard users get the same detail
- form status uses `aria-live="polite"`. **`alert()` appears nowhere.**
- every animation stops under `prefers-reduced-motion`, in CSS and in JS - the
  Three.js scene is never constructed at all in that mode
- if JavaScript is blocked, nothing is hidden: the reveal states hang off a
  `.js` class set by a one-line script in each page head

**Performance**
- low-poly geometry (icosahedron at detail 1) and 320 particles
- device pixel ratio capped at 1.5
- the 3D scene stops rendering when the tab is hidden or the hero scrolls away
- geometry, materials and the renderer are disposed on exit, and the WebGL
  context is handed back rather than left to the GC
- if Three.js will not load, a 2D radar scene takes over
- images below the fold are lazy loaded
- scroll work goes through IntersectionObserver or a rAF throttle
- the CRT grain layer is dropped entirely on coarse-pointer devices, where it
  costs a full-screen composite for something nobody can see

---

## Test status

**Verified in a real browser**

- all five pages render, no console errors
- zero horizontal overflow at 375, 768, 1024, 1280 and 1440px
- the Three.js scene runs, backing store matching its CSS box
- filtering: 6 down to 2 correctly, `aria-pressed` moves, syncs to `?cat=` and
  restores from it
- detail pages fill every field, prev/next wraps, `<title>` and meta description
  change per project, an unknown `?id=` shows the not-found state
- contact form: client validation, the success path, and the server-unreachable
  path that offers an email address instead
- mobile menu opens and closes, Escape restores focus, skip link is first
- every text colour clears WCAG AA against its own background: form labels 5.3,
  placeholder 5.37, muted text 5.3, nav links 5.72, buttons 10.9 and up
- no CTA label wraps at desktop
- scroll-driven animations attach with real `ScrollTimeline` and `ViewTimeline`
  objects, and all six keyframe sets interpolate correctly when driven manually
- the scramble sequence resolves fully in 840ms and never strands mid-word

**Not verified**

- **the backend has never been compiled or run here.** The machine this was
  built on has a JRE 8 and no Maven. The frontend was tested against a mocked
  endpoint. Run `mvn test` before trusting it.
- The browser used for testing would not paint (`requestAnimationFrame` never
  fired), so the motion was checked by inspecting the attached timelines and
  driving the keyframes by hand rather than by watching it move. Open the page
  in a normal browser to confirm the feel.
- no Lighthouse run yet
- not tested with a real screen reader

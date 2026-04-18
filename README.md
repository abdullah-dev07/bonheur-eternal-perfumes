# Bonheur Eternal

A single-page branding & lead-generation website for the luxury fragrance house **Bonheur Eternal**. Built with plain HTML, CSS, and a minimal dusting of vanilla JS. Zero build step. Zero dependencies.

---

## Why plain HTML/CSS (not React/Vite)

This is a static, single-page brand site with:

- No dynamic data, no auth, no routing
- No server-side state
- A single form that can be wired to any email handler

React/Vite would add a build pipeline, a runtime, and a deploy target for no real benefit. Plain HTML ships instantly, loads faster, and deploys to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, nginx) by simply uploading the folder.

---

## File structure

```
bon-eternal/
├── index.html      # Markup & content (all sections)
├── styles.css      # Design system + all component styles
├── script.js       # Nav toggle, smooth scroll, form handler
├── assets/         # Drop real product + hero images here later
└── README.md
```

---

## Running locally

### Option 1 — Open directly

Double-click `index.html`. Works fully; uses Google Fonts CDN.

### Option 2 — Local web server (recommended)

Any of:

```bash
# Python (built-in on macOS/Linux)
python3 -m http.server 5173

# Node
npx serve .

# PHP
php -S localhost:5173
```

Then visit `http://localhost:5173`.

---

## Swapping in real images later

Everything is authored so real images drop in without layout shift.

### Hero background image

In `index.html`, replace:

```html
<div class="hero__placeholder hero__placeholder--sand"></div>
```

with:

```html
<img class="hero__img" src="assets/hero.jpg" alt="..." />
```

And in `styles.css`, add:

```css
.hero__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}
```

The hero reserves the correct aspect + height (`min-height: 92vh`) either way.

### Product card images

Each card's image container (`.card__media`) maintains an `aspect-ratio: 4/3`. To use a real image, replace the inner `.card__placeholder` with:

```html
<img src="assets/velvet-mist.jpg" alt="Velvet Mist bottle" style="width:100%;height:100%;object-fit:cover" />
```

No other change needed — spacing and alignment stay identical.

### About section image

Same pattern: replace `.about__placeholder` with an `<img>` inside `.about__media`. The `aspect-ratio: 4/5` frame is already defined.

---

## Configuration points

### WhatsApp number

All "Order via WhatsApp" CTAs use the placeholder number `+1 (555) 123-4567`. Find and replace `15551234567` throughout `index.html` and `script.js` with your real number (no `+`, no spaces).

### Contact form

The form currently uses a `mailto:` fallback — on submit, it opens the visitor's email client with the inquiry pre-filled (no backend required).

To upgrade to a real endpoint, open `script.js` and replace the `window.location.href = mailto` block with a `fetch()` call to your service of choice:

- **Formspree** — `fetch("https://formspree.io/f/YOUR_ID", { method: "POST", body: data })`
- **Resend / SendGrid** — call your own serverless function
- **Netlify Forms** — just add `data-netlify="true"` to the `<form>` tag

---

## Design system

All tokens live at the top of `styles.css` in `:root`:

- **Colors** — warm sand, deep espresso, amber accents
- **Typography** — Cormorant Garamond (display) + Inter (body)
- **Spacing** — consistent scale `--s-1` through `--s-12`
- **Radii, shadows, transitions** — named tokens for reuse

To rebrand, edit only the `:root` block.

---

## Responsiveness

Fully responsive, with breakpoints at `1080px`, `860px`, `820px`, `640px`, `540px`, `520px`. Mobile nav included.

---

## Accessibility

- Semantic landmarks (`<header>`, `<main>`, `<section>`, `<footer>`)
- Visible focus rings on interactive elements
- `aria-label`, `aria-expanded`, `aria-live` on dynamic regions
- Respects `prefers-reduced-motion`

---

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge). Uses `clamp()`, `aspect-ratio`, CSS variables, and `backdrop-filter` — all widely supported.

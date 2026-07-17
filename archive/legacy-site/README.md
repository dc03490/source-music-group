# Source Music Group — Website

A fast, dependency-free static site for the Source Music Group label. Pure HTML/CSS/JS — no build step, deployable anywhere.

## Structure
```
index.html          All sections (hero, label/services, Duka, contact, footer)
css/styles.css      Theme + layout. Colors live in :root custom properties at the top.
js/main.js          Mobile nav, footer year, async contact-form submit.
assets/
  logo.svg              Brand logo placeholder (replace with your real logo — see below)
  duka-placeholder.svg  Duka photo placeholder (replace with a real photo)
```

## Run locally
The Spotify embed needs to be served over http (not opened as a `file://`):
```bash
cd "Source  Music Group"
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Things to finish before launch

### 1. Drop in the real logo
Replace `assets/logo.svg` with your actual logo. Two options:
- **Keep SVG:** save your logo as `assets/logo.svg` (overwrites the placeholder — no other changes needed).
- **Use PNG:** save it as `assets/logo.png`, then in `index.html` change every `assets/logo.svg` to `assets/logo.png` (6 spots: favicon, og:image, nav, hero, footer). A PNG is recommended for the `og:image` social preview.

### 2. Add Duka's real photo + bio
- Replace `assets/duka-placeholder.svg` with a real photo (square works best). If you use a different filename/extension, update the `<img>` `src` in the Artists section of `index.html`.
- Update the placeholder bio text (marked with a comment) in the same section.

### 3. Connect the contact form
The form uses [Formspree](https://formspree.io) (free tier):
1. Create a free Formspree account and a new form pointed at your email.
2. Copy your form ID and replace `YOUR_FORM_ID` in `index.html`'s `<form action="...">`.
Until that's done, submitting shows a friendly "form isn't connected yet" message instead of failing silently.

### 4. Domain / SEO (when you have a domain)
In `index.html`, update `og:url`, `canonical`, and the email address (`hello@sourcemusicgroup.com`) to your real values.

## Deploy
Any static host works. Easiest free options:
- **Netlify / Vercel:** drag-and-drop the folder, or connect a Git repo. (Netlify also offers built-in form handling as an alternative to Formspree.)
- **GitHub Pages:** push to a repo and enable Pages on the root.

## Editing the look
All brand colors are CSS variables at the top of `css/styles.css` under `:root` (gold, magenta, teal, blue, purple, backgrounds, text). Change them in one place to retheme the whole site.

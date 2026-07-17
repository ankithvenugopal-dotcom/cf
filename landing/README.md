# Scroll-Driven Landing Page

Full-screen, scroll-snapping landing page built with **React + Vite**, **GSAP ScrollTrigger** (section snapping, headline/tagline reveals, background crossfade triggering) and **Framer Motion** (staggered, "dealt-in" card entrances).

## Run it

```bash
cd landing
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Editing content — one file only

**Every** headline, tagline, nav link, background, card, and scroll-prompt label lives in
[`src/config/sections.js`](src/config/sections.js). The components never hardcode content.

To add a 4th themed section:

1. Drop a background file into `public/backgrounds/` (image, or video + poster image).
2. Copy any section block in `sections.js`, give it a new `id`, and point `background.src` at your file.

That's it — snapping, crossfade, reveals, and card animations pick it up automatically.

### Card types (`type` field)

| type | fields | look |
|---|---|---|
| `video-thumb` | `label`, `image` | thumbnail + play button |
| `stat` | `label`, `value` | big number callout |
| `note` | `label`, `body`, `color` | tinted glass sticky note |

### Backgrounds

- `type: "image"` — rendered full-bleed with `object-fit: cover`.
- `type: "video"` — autoplaying, muted, looping; **paused automatically when its section is off-screen**, and replaced by its `poster` image on mobile (≤768px) to save bandwidth.
- Section-to-section transitions crossfade over 0.6s.

## File structure

```
src/
  config/sections.js       <-- ALL editable content
  components/Nav.jsx       <-- fixed nav bar, reads globalConfig.navLinks
  components/Section.jsx   <-- one scroll section: background + headline + cards
  components/Card.jsx      <-- renders video-thumb / stat / note variants
  components/ScrollRig.jsx <-- GSAP ScrollTrigger wiring shared by all sections
```

The current backgrounds/thumbnails are placeholder SVGs so the site runs with zero setup — swap the paths in `sections.js` to your own `.jpg` / `.mp4` files whenever you like.

## Important Rules

Read existing files before writing. Don't re-read unless changed.
Thorough in reasoning, concise in output.
Skip files over 100KB unless required.
No sycophantic openers or closing fluff.
No emojis or em-dashes.
Do not guess APIs, versions, flags, commit SHAs, or package names. Verify by reading code or docs before asserting.

## Project

Single-page static site built with Tailwind CSS v3.
`index.html` is the only page. Styles are authored in `src/input.css` and compiled to
`dist/styles.css` via `npm run build` (or `npm run watch`); `dist/` and `node_modules/`
are gitignored and rebuilt on deploy. Design tokens live in `tailwind.config.js`.

Scripts in `assets/js/`:
- `motion.js` — reveal/parallax/count-up engine driven by `data-reveal`, `data-parallax`,
  `data-split`, `data-count` attributes. Ported unmodified from the advanced-modern POC;
  keep it generic.
- `nav.js` — mobile overlay menu.
- `site.js` — Projects tabs, copy-email button, nav scroll-spy.

Design ported from `UnitedBearing/Simple-Modern/advanced-modern`: white base, deep-navy
(`ink`) contrast bands, accent `#1c4f9c`, Archivo headings, CSS-drawn blueprint/dot
patterns. Archivo and JetBrains Mono load from Google Fonts.
Deployed on Render as a static site (`render.yaml`).
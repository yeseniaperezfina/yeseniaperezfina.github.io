# yeseniaperezfina.github.io

Public portfolio for **Yesenia Pérez**: program strategy, field building, science education, public engagement, higher education research, and writing.

Live site: https://yeseniaperezfina.github.io

## Current portfolio

The primary portfolio is a lightweight multi-page static site built with HTML, CSS, and vanilla JavaScript. The public navigation centers Home, Work, About, Research, and The Echo Jar, with dedicated case studies for Hawaiʻi, the Informal Learning Network, STORIMap, Roman Community Engagement, and Webb Community Events.

The current design is intentionally one visual ecosystem with distinct project rooms: Hawaiʻi uses land and volcanic warmth; ILN uses civic/network blues and lived program imagery; Webb and STORIMap use infrared darkness, copper, magenta, and luminous structure; Roman uses deep indigo and cool spacecraft imagery; Research uses oxblood, paper, and garden green; About uses a quieter personal archive.

## Front-end structure

- `assets/css/site.css` contains the established core layout and case-study system.
- `assets/css/quiet.css` contains the quieter editorial layer used by Home, Work, About, Hawaiʻi, ILN, and Writing.
- `assets/css/partnerships.css` contains documentary partnership layouts.
- `assets/css/visual-story.css` contains page-specific color stories and image rhythm.
- `assets/css/portfolio-cleanup.css` is the final QA layer for contrast, focus, mobile behavior, documentary image handling, and visual cleanup.
- `assets/js/site.js` handles shared navigation, page identity classes, sticky-header state, reveal behavior, and reduced-motion fallbacks.

No framework or build step is required.

## Primary pages

- `index.html`
- `work.html`
- `about.html`
- `research.html`
- `writing.html`
- `case-study-hawaii.html`
- `case-study-iln.html`
- `case-study-storimap.html`
- `case-study-roman.html`
- `case-study-webb-community-events.html`

Earlier immersive experiments remain in the repository for continuity, including `library.html`, `work-timeline.html`, `research-archive.html`, and `public-systems.html`, but they are not part of the primary navigation.

## Image and attribution policy

Original photography remains © Yesenia Pérez unless another credit is stated. NASA, partner, and institutional imagery retains its source attribution and applicable usage terms. Mission imagery should be selected for narrative relevance rather than generic decoration, and credits should remain visible on the relevant page.

## Accessibility and QA

The public site should preserve one clear `h1` per page, semantic landmarks, descriptive alternative text, visible keyboard focus, a 44px mobile menu target, reduced-motion behavior, responsive layouts without horizontal scrolling, and readable contrast across dark project sections.

## Deployment

GitHub Pages deploys from `main`. A merge to `main` updates the live site automatically.

## Local review

```bash
git clone https://github.com/yeseniaperezfina/yeseniaperezfina.github.io.git
cd yeseniaperezfina.github.io
python3 -m http.server 8000
```

Then open `http://localhost:8000` and review desktop and narrow mobile widths.

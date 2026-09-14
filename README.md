# yeseniaperezfina.github.io

Public portfolio for **Yesenia Pérez**: education strategy, learning ecosystems, public engagement, higher education research, field building, and writing.

Live site: https://yeseniaperezfina.github.io

## Living Atlas

The primary portfolio is a lightweight multi-page static site built with HTML, CSS, and vanilla JavaScript. Its organizing idea is a **Living Atlas**: projects are connected coordinates in one evolving practice rather than isolated sector buckets or portfolio cards.

The core practice moves through recurring questions about people, institutions, networks, interpretation, evidence, participation, and possibility. Work can be viewed through overlapping lenses so one project can demonstrate several forms of practice at once.

## Primary pages

- `index.html` — Home / practice thesis
- `work.html` — full Work Atlas
- `about.html` — personal / editorial strand
- `research.html` — analytical strand
- `writing.html` — reflective strand / The Echo Jar
- `case-study-hawaii.html`
- `case-study-iln.html`
- `case-study-storimap.html`
- `case-study-roman.html`
- `case-study-webb-community-events.html`

The flagship case studies share a common reading grammar:

1. Context
2. My role
3. System
4. Evidence
5. What changed
6. What travels forward

The grammar is shared; the evidence is not. Hawaiʻi remains documentary and place-based, ILN foregrounds network infrastructure, STORIMap emphasizes interface and evaluation evidence, Roman emphasizes field readiness, and Webb emphasizes activation infrastructure.

## Active front-end architecture

The public site intentionally has one small active design stack:

- `assets/css/atlas.css` — global tokens, typography, navigation, Home, shared responsive behavior
- `assets/css/atlas-pages.css` — Work Atlas and shared case-study grammar
- `assets/css/atlas-strands.css` — About, Research, and Echo Jar registers
- `assets/js/atlas.js` — responsive navigation, progressive reveal, practice lenses, tracked chapter navigation, reduced-motion handling, and fragment/deep-link behavior

No framework or build step is required.

## Retired routes

Earlier immersive “study / library” experiments are no longer active application surfaces. Their old URLs remain as lightweight compatibility redirects so previously shared links do not become 404s:

- `library.html` → Home
- `work-timeline.html` → Work
- `research-archive.html` → Research
- `public-systems.html` → Work

The CSS, JavaScript, and generated backdrop assets used only by those experiments have been removed from the active repository tree.

## Image and attribution policy

Original photography remains © Yesenia Pérez unless another credit is stated. NASA, partner, and institutional imagery retains its source attribution and applicable usage terms. Mission imagery should document, explain, or create meaningful scale rather than serve as generic decoration.

Unused documentary/project assets may remain in `assets/images/` when they have plausible future editorial value. Generated visual-system assets should not be retained once the system that used them is retired.

## Accessibility and QA

The primary portfolio preserves semantic landmarks, one clear `h1` per page, descriptive alternative text, visible keyboard focus, reduced-motion behavior, responsive layouts, and deliberate mobile reading order.

A branch-level GitHub Actions workflow, `.github/workflows/living-atlas-qa.yml`, verifies the primary pages by:

- checking local references, duplicate IDs, image `alt` attributes, and active dependencies;
- inventorying code/assets for pruning decisions;
- serving the site locally in CI;
- rendering representative desktop, tablet, and mobile screenshots in headless Chrome.

The verification/pruning pass confirmed that the primary site depends only on the three Atlas stylesheets and `atlas.js`. Browser-level visual review is still required before a redesign branch is merged to `main`.

## Deployment

GitHub Pages deploys from `main`. A merge to `main` updates the live site automatically.

## Local review

```bash
git clone https://github.com/yeseniaperezfina/yeseniaperezfina.github.io.git
cd yeseniaperezfina.github.io
python3 -m http.server 8000
```

Then open `http://localhost:8000` and review desktop, tablet, and narrow mobile widths.

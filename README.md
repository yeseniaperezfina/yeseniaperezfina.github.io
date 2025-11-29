# yeseniaperezfina.github.io

Personal portfolio site for **Yesenia (Yessi) Perez** — higher education & learning strategist working across NASA, higher education, museums, and community partners.

The site is intentionally lightweight: **hand-coded HTML, CSS, and vanilla JavaScript**, deployed via **GitHub Pages**.

---

## Design & Experience Strategy

### Visual language — “Midnight Studio”

The palette is built around a **twilight studio** feel:

- Deep navy backgrounds (`--bg`, `--panel`) mirror the night sky and GitHub’s dark UI.
- Aurora **teal** (`--accent-primary`) anchors links and active navigation.
- Candlelight **amber** (`--accent-secondary`) highlights metrics and key phrases.
- Soft **plum / indigo** (`--accent-quaternary`) adds depth in borders and glows.
- Typography pairs a bookish serif for headings with a system sans for body copy — think _“researcher in a planetarium library.”_

Color roles are explicitly scoped:

- `--accent-primary` → links, active nav, key CTAs  
- `--accent-secondary` → metrics, subtle highlights  
- `--accent-tertiary` → chips and soft emphasis  
- `--accent-quaternary` → borders, glows, and subtle gradients  

### Information architecture

The single-page layout follows a narrative arc:

1. **About** – who I am, where I sit in the ecosystem, and immediate proof points  
2. **Trajectory** – career and education timeline + four practice modes  
3. **Work** – selected projects across NASA, higher ed, and museums  
4. **How I Work** – principles and working agreements  
5. **Capabilities** – what I actually do on teams  
6. **Writing** – reflective and public-facing work  
7. **Contact** – “next orbit” roles and ways to connect  

The hero includes **metric pills** (years of experience, network reach, educational arc) to support quick skimming by hiring managers.

### Interaction & motion

- **Sticky nav with scroll spy** using `IntersectionObserver`
- Hero **constellation canvas** that reacts gently in the background
- **Scroll-reveal** for sections (also via `IntersectionObserver`)
- Focus states and hover effects are tuned for clarity, not spectacle

All motion respects user preferences:

- `prefers-reduced-motion: reduce` disables CSS animations and transitions.
- The canvas animation early-exits if reduced motion is requested, and pauses when the tab is hidden.

### Accessibility

- Semantic structure: single `<h1>`, sectioned `<h2>`, `<nav>` with labels.
- **Skip link** to jump directly to main content.
- Explicit `:focus-visible` outlines for navigation and interactive pills.
- `aria-current="page"` applied to the active nav item via scroll spy.

---

## Tech stack

- HTML5
- CSS3 (custom properties, modern layout)
- Vanilla JavaScript (no frameworks)
- Hosted on **GitHub Pages**

Folder structure:

```text
/
├── index.html
├── assets/
│   ├── css/
│   │   └── main.css
│   └── js/
│       └── main.js
└── README.md

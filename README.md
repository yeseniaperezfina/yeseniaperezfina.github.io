Absolutely — here’s the cleaned, updated README with **only “Yesenia Perez”** throughout.

---

# yeseniaperezfina.github.io

Portfolio site for **Yesenia Perez** — higher education & learning strategist working across NASA, higher education, museums, and public engagement.

This repo powers the GitHub Pages site:

> **[https://yeseniaperezfina.github.io](https://yeseniaperezfina.github.io)**

---

## Concept & Experience Design

### Narrative & Visual Intent

This site is a **single-page, editorial-style portfolio** — part botanical field journal, part systems-design dossier. It’s crafted for:

* **Hiring managers and recruiters** who need fast, clear signals about scope, competencies, and leadership orientation.
* **Strategy, systems, and learning design roles** that value coherent reasoning, evidence-awareness, and cross-sector fluency.
* **Yesenia’s creative practice**: a blend of *Soft Physics*, science storytelling, and mythic/poetic undertones.

The visual system merges:

* **Midnight Forest Atmosphere** — moss, bark, sand, and twilight gradients.
* **Editorial serif-forward typography** — a quiet New Yorker / book-jacket influence.
* **Organic motion** — pollen, fireflies, mycelium threads, canopy parallax.
* **Calm Mode** — a simplified, reduced-motion palette for accessibility and contemplative reading.

---

## Information Architecture

The portfolio is intentionally **single-page**, divided into anchored sections optimized for scanning:

1. **About (Hero)**
   Role identity, practice positions (Strategist, Scholar, Creator, Navigator), and ecosystem placement.

2. **Trajectory**
   Career timeline across museums, NASA, and higher education; signals of scale, complexity, and “what this demonstrates.”

3. **Signature Work**
   Four case studies showing portfolio strategy, evaluation, research synthesis, storytelling, and multi-stakeholder coordination.

4. **How I Work**
   Leadership stance, decision-making principles, and how teams tend to experience Yesenia.

5. **Capabilities & Tools**
   “Constellation of practice” across strategy, research, communication, and domains — with an interactive mycelium/constellation network.

6. **Writing & Story Work**
   Highlights across *Soft Physics*, reflective practice at Harvard, and internal strategy briefs.

7. **Contact / Next Orbit**
   Future-facing roles and sectors Yesenia is exploring; clear CTAs.

---

## Front-End Architecture

This site is a **lightweight static SPA** built with **HTML + CSS + vanilla JS**, designed to be:

* Audit-friendly
* Dependency-free
* Accessible
* Easy to maintain on GitHub Pages

### Directory Structure

```text
.
├── index.html
├── assets
│   ├── css
│   │   └── main.css
│   ├── js
│   │   └── main.js
│   └── audio
│       └── forest.mp3
└── README.md
```

### `index.html`

Semantic markup with:

* `data-section` attributes for scroll-spy
* Accessible navigation (`aria-current`)
* Forest/Calm mode toggles with `aria-pressed`
* Audio toggle for ambient forest sound
* Section ornaments (leaves, botanical gradients, orbs)

### `assets/css/main.css`

A fully custom design system including:

* **Design tokens** for color, spacing, typography, radii, shadow, and layout scale
* **Editorial serif-forward headings** + clean system sans body copy
* **Botanical gradients** and soft card treatments
* **Forest/Calm mode styles**, with reduced-motion and quieter visuals in calm mode
* **Grid + Stack layout primitives**
* **Component styles**:

  * `.card`, `.chip`, `.pill-link`, `.button`, `.tag-row`, `.metric-row`
  * Header shell, navigation, forest overlays
* **Accessible focus and reduced-motion support**

### `assets/js/main.js`

A refactored JS architecture with:

* **Single `init()` orchestration** via `DOMContentLoaded`
* Named `initX` modules:

  * `initYearStamp()`
  * `initModeToggle()` — Forest / Calm mode with persistence
  * `initRoleChips()` — swaps out practice descriptions
  * `initScrollSpy()` — updates nav & `aria-current="page"`
  * `initRootProgress()` — scroll progress for the root-column
  * `initForestParallax()` — canopy layers (auto-disabled in Calm mode)
  * `initPollenAndFireflies()` — atmospheric particles (auto-disabled in Calm mode)
  * `initForestNetwork()` — constellation/mycelium network
  * `initForestAudioToggle()` — sound toggle with `aria-pressed`

All animations gracefully quiet themselves in **Calm Mode** and/or when system `prefers-reduced-motion` is detected.

---

## Interaction Design

### 1. Forest / Calm Mode Toggle

A top-right toggle that:

* Switches between **immersive Midnight Forest** and **Quiet Editorial Calm**
* Persists preference in `localStorage`
* Reduces/eliminates motion in Calm mode
* Simplifies gradients and lowers atmospheric density

### 2. Scroll Spy + Section Reveal

* Uses `IntersectionObserver` to:

  * Highlight the active nav link
  * Add `.section-visible` for soft fade-ins
* Uses tuned thresholds for natural reading flow

### 3. Role Chips

* Four practice modes (Strategist, Scholar, Creator, Navigator)
* Each click updates a compact narrative of that facet

### 4. Atmospheric Layers

* **Pollen + dust + fireflies** (canvas)
* **Constellation / mycelium** network (canvas)
* **Canopy parallax** layers

All of these automatically quiet in **Calm Mode**.

### 5. Accessible Audio Toggle

* Ambient forest sound for atmospheric browsing
* Fully keyboard-accessible
* `aria-pressed` state + readable label updates (“Forest on/off”)

---

## Performance & Accessibility Notes

* Zero network dependencies → reliable on GitHub Pages
* Dark-on-dark color testing for contrast
* Reduced-motion support baked in
* Semantic HTML with labeled navigation, landmarks, and ARIA states
* All imagery/ornaments marked `aria-hidden="true"`

---

## Running & Editing Locally

Clone the repo:

```bash
git clone https://github.com/yeseniaperezfina/yeseniaperezfina.github.io.git
cd yeseniaperezfina.github.io
```

You can open `index.html` directly in your browser, or run a local server:

```bash
python3 -m http.server
```

Then visit:

```text
http://localhost:8000
```

---

## Deployment

GitHub Pages is enabled on the `main` branch.
Any commit to `main` automatically updates the live site.

---

## License

All content © **Yesenia Perez**.
Codebase is shared for transparency and review; please request permission for reuse.

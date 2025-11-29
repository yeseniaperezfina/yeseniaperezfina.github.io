# yeseniaperezfina.github.io

Portfolio site for **Yesenia “Yessi” Perez** — higher education & learning strategist working across NASA, higher education, museums, and public engagement.

This repo powers the GitHub Pages site at:

> `https://yeseniaperezfina.github.io`  
> (or `https://yeseniaperezfina.github.io/` in a browser)

---

## Concept & Design

### Design Intent

This site is built as a **single-page, editorial-style portfolio** optimized for:

- **Recruiters and hiring managers**: fast scanning, clear signals of scope, metrics, and “what this demonstrates.”
- **Strategy & systems roles**: emphasis on portfolio architecture, mixed-method research, and cross-sector leadership.
- **Yessi’s creative practice**: “Soft Physics” + botanical editorial — science, systems, and mythic/poetic undertones.

Visually, the site is a blend of:

- **Botanical Editorial**: cream paper, sage and berry accents, subtle gold highlights.
- **Book-cover framing**: a soft “dust jacket” frame around the viewport and chapter-style section headings.
- **Quiet motion**: small card lifts, gentle gradients, and section fade-ins instead of aggressive animations.

### Information Architecture

The portfolio is intentionally **single-page** with anchored sections:

1. **About (Hero)**  
   - Who Yessi is and where she sits in the ecosystem.  
   - Mode chips (Strategist, Scholar, Creator, Navigator) update a short description.  
   - High-level metrics (years at NASA, size of network, education arc).  

2. **Trajectory**  
   - Career and education timeline from museums to NASA and Harvard.  
   - Each timeline entry includes a short body, a **metric row**, and **“Demonstrates” tags** to signal capabilities.

3. **Signature Work**  
   - Four case cards across NASA, higher ed, and museums.  
   - Each card includes:
     - One-line blurb under the title for quick scanning.  
     - A **metrics row** (scale, duration, complexity).  
     - Bulleted responsibilities.  
     - **“Demonstrates” tags** that translate into competencies.

4. **How I Work (Practice)**  
   - Core principles, leadership stance, and how teams tend to experience Yessi.  
   - Mix of quote card, bullet lists, and subtle metrics to show process and presence.

5. **Capabilities & Tools**  
   - “Constellation of practice” — where to plug Yessi into a team or portfolio.  
   - Split into strategy, research, communication/leadership, tools, domains, and ways of working.

6. **Writing & Story Work**  
   - Highlights selected writing threads (Soft Physics, Echoes of Now, Reflection as Resistance, internal strategy briefs).  
   - Shows voice and sense-making, with a link out to Substack.

7. **Contact / Next Orbit**  
   - Future-facing orientation: what roles and sectors Yessi is exploring.  
   - Clear contact calls to action (email, LinkedIn, The Echo Jar).

---

## Front-End Architecture

The site is built as a **lightweight static SPA**: plain HTML/CSS/JS with zero dependencies, designed to work cleanly on GitHub Pages.

### Files

- `index.html`  
  Single-page markup with semantic sections and `data-section` attributes for scroll-spy and reveal.

- `assets/css/main.css`  
  Custom design system and layout primitives:
  - CSS variables (colors, radii, shadows, max-width).
  - Layout primitives: `.shell`, `.section`, `.grid`, `.stack`.
  - Components: `.card`, `.chip`, `.button`, `.pill-link`, `.tag-row`, `.metric-row`.
  - Page-level treatments: header, hero, botanical accent, “book cover” frame.

- `assets/js/main.js`  
  Small vanilla JS bundle:
  - Sets current year in the footer.
  - Handles **role chips** → updates hero role note.
  - Implements **scroll-spy**: watches sections and toggles `.is-active` on `.nav-link`.
  - Implements **section reveal**: IntersectionObserver adds `.section-visible` for soft fade/slide.

No build step, no bundler, no external frameworks. This keeps it legible as “handcrafted” but still intentional and systematic.

---

## Interaction Design

### Scroll Spy

- Each primary section (`About`, `Trajectory`, `Work`, etc.) has `data-section` and an `id`.
- `main.js` uses `IntersectionObserver` to:
  - Detect which section is in view.
  - Add `.is-active` to the corresponding `.nav-link`.
- Threshold is tuned (`0.45`) for realistic reading rather than edge-trigger hopping.

### Section Reveal

- All `.section` elements start slightly translated down with reduced opacity.
- A second `IntersectionObserver` adds `.section-visible` when a section enters the viewport.
- This creates a **gentle page-turn effect** that fits the editorial/book metaphor.

### Role Chips

- Hero “mode chips” (`Strategist`, `Scholar`, `Creator`, `Navigator`) are `<button>` elements with `data-role-chip`.
- On click, the script:
  - Toggles `.chip--active`.
  - Swaps in a short, mode-specific blurb that foregrounds a different facet of Yessi’s practice.

### Cards & Hover States

- All `.card` elements:
  - Lift slightly on hover.
  - Increase shadow depth.
  - Subtly shift border color and reveal a soft radial highlight.
- Cards remain accessible:
  - No necessary information is only available on hover.
  - Hover is purely an affordance and a bit of “magic,” not a requirement.

---

## Running & Editing Locally

1. **Clone the repo**

   ```bash
   git clone https://github.com/yeseniaperezfina/yeseniaperezfina.github.io.git
   cd yeseniaperezfina.github.io

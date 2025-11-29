# yeseniaperezfina.github.io

Personal portfolio site for **Yesenia Pérez** — higher education & learning strategist working across NASA, higher education, museums, and public engagement.

This repository powers my public portfolio on **GitHub Pages**, designed and coded in plain **HTML, CSS, and JavaScript**. The goal is not to showcase a heavy framework, but to show **clarity of structure, intentional interaction, and a point of view about how experiences are designed.**

---

## Experience & Design Principles

This site is built around a few core beliefs:

1. **Identity should be stable; stories should scroll.**  
   The layout uses a **left spine / right narrative** pattern:
   - The left column anchors my identity, roles, and navigation.
   - The right column is a scrolling “studio scroll” of my work, practice, and writing.
   This separation mirrors how I work: a stable core, with evolving stories.

2. **Motion should feel like breathing, not a light show.**  
   Interaction is subtle and deliberate:
   - A **canvas-based particle field** in the hero creates ambient “cosmic” motion.
   - Sections **fade and lift in** as they enter the viewport, using the `IntersectionObserver` API.
   - Hover states on cards and links are restrained, signaling interactivity without shouting.
   All animations respect `prefers-reduced-motion` so users can opt out.

3. **Content comes first, then components.**  
   Content was written and structured first. Components (`.section`, `.card`, `.stack`, `.grid-*`, `.pill`, `.chip`) were then abstracted from the real narrative, not the other way around.  
   The result: a tiny design system that fits this portfolio but can scale to more pages and use-cases.

4. **Demonstrate systems-thinking in the code itself.**  
   The repo intentionally avoids heavy tooling and frameworks. Instead it shows:
   - Clean separation of concerns (HTML / CSS / JS).
   - Minimal but modern browser APIs (IntersectionObserver, canvas, `prefers-reduced-motion`).
   - A **token-based design** in CSS (`:root` variables) for colors, radii, and shadows.

---

## Information Architecture

The site is a **single-page portfolio** with distinct, scannable chapters:

- **Left Spine (Persistent)**
  - Name, role, and a short “what I do” line.
  - Four identity “modes” as chips: Strategist, Scholar, Creator, Navigator.
  - Section navigation (scroll-spy driven).
  - Quick contact links (Email, LinkedIn, The Echo Jar).

- **Right Column (Scrolling Narrative)**
  - `#about` — Hero / overview, current roles, and working terrain.
  - `#trajectory` — Career & education timeline + modes of practice.
  - `#work` — Signature work across NASA, higher ed, and public engagement.
  - `#practice` — How I work: principles, equity lens, and process.
  - `#skills` — Capabilities, tools, and domains.
  - `#writing` — Writing & thought practice (Substack, Harvard, NASA).
  - `#contact` — “Next orbit” roles and ways to connect.

Each major area is a `.section` with a consistent visual shell and internal layout.

---

## Technical Architecture

The site uses a simple three-file structure:

```text
.
├── index.html
└── assets
    ├── css
    │   └── main.css
    └── js
        └── main.js

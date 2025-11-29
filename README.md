# Yesenia Perez · Higher Education & Learning Strategist

A single-page portfolio site that sits at the intersection of learning design, systems thinking, and modern front-end craft. Built as a lightweight, hand-tuned experience on top of GitHub Pages using only HTML, CSS, and a small amount of JavaScript.

---

## Overview

This site has two jobs:

1. **Professional** – Clearly communicate how I operate as a higher education and learning strategist across NASA, higher ed, museums, and community partners.
2. **Technical** – Demonstrate that I can think like a design systems / front-end engineer: intentional layout, accessible motion, clean architecture, and a small but expressive interaction layer.

The stack is intentionally minimal:

- No framework
- No build tools
- Just `index.html`, `assets/css/main.css`, and `assets/js/main.js`

That choice mirrors my work in learning environments: start with the essentials, design the system, and only add complexity when it serves the people using it.

---

## Design System

The visual language is built around a small, coherent token set defined in CSS custom properties:

- **Color palette**  
  - Twilight background (`--bg`, `--panel`, `--panel-soft`) for a deep, observatory-like feel.
  - Accent trinity: `--accent-teal`, `--accent-coral`, `--accent-indigo` representing research, care, and imagination.
  - Muted neutrals (`--muted`, `--muted-soft`) to keep body text calm and legible.

- **Shape & depth**  
  - Radii tokens (`--radius-md`, `--radius-lg`, `--radius-xxl`) to keep cards, panels, and pills consistent.
  - A single soft shadow token (`--shadow-soft`) used for the hero and key calls-to-action.

- **Type & hierarchy**  
  - System UI stack for fast rendering and platform alignment.
  - “Eyebrow” labels (uppercase, tracked-out) used to signal structure: section intros, constellations of practice, and “Next Orbit” in the contact section.

By centralizing these tokens, the site reads as one coherent artifact instead of a collage of individually styled pieces.

---

## Layout & Information Architecture

The page is structured as a set of “orbits”:

1. **Hero** – Who I am and where I sit in the ecosystem.
2. **Trajectory & Modes of Practice** – How I got here and the lenses I bring (Strategist, Scholar, Creator, Navigator).
3. **Signature Work** – Concrete examples at NASA, museums, and networks.
4. **How I Work** – My operating system: systems design, evidence use, equity as a design constraint.
5. **Capabilities & Tools** – How I show up on teams and what I’m fluent in.
6. **Writing & Thought Practice** – Where my reflective work lives.
7. **What I’m Looking Toward** – The roles and collaborations I’m seeking next.

Implementation details:

- Layout is done with CSS Grid and `minmax(0, 1fr)` patterns for resilient columns.
- Cards share a common structural vocabulary (radius, padding, subtle radial highlights) but vary accents and gradients by section.
- Breakpoints are content-driven:
  - ~900–980px: shift two-column grids into stacked layouts.
  - ~640px: optimize padding and grid behavior for small screens.

---

## Interaction & Motion

Motion in this site is intentionally subtle and tied to meaning:

- **Hero “orbit” gradient**  
  A slow conic gradient rotation suggests orbital motion without overwhelming the content.

- **Canvas constellation**  
  A lightweight particle network animates behind the hero content. It’s a nod to my work in astrophysics and learning ecosystems: individual nodes, connected by invisible lines of relationship.

- **Scroll-based interactions**
  - **Scroll spy**: Nav highlights the section currently in view using `IntersectionObserver`.
  - **Scroll reveal**: Sections fade and slide in once, gently suggesting progression through the story.

### Performance considerations

The canvas animation is tuned to feel alive but remain efficient:

- Particle connections are computed with a small cap on particle count, adjusted based on viewport area.
- Canvas is sized with device pixel ratio and updated on debounced resize events.

### Accessibility & motion

Not everyone enjoys motion. The site respects `prefers-reduced-motion`:

- Disables the hero rotation animation.
- Hides the animated canvas constellation.
- Neutralizes reveal transitions.
- Resets `scroll-behavior` to `auto`.

This keeps the experience visually rich for those who want it, and stable for those who don’t.

---

## Accessibility

Some key decisions:

- **Semantic structure**
  - `header`, `main`, `section`, `aside`, and `footer` used intentionally.
  - Each section has a unique `id` and a corresponding `aria-labelledby` heading.
  - The primary nav is a `<nav>` with an explicit `aria-label`.

- **Keyboard & screen reader support**
  - A “Skip to main content” link is available and becomes visible on focus.
  - Interactive elements (links, nav, contact actions) use natural semantics with no custom roles.
  - Hover effects always have a safe default state and are never the only way to access information.

- **Color & contrast**
  - Text and UI elements are tested against dark backgrounds to maintain strong contrast.
  - Accent colors are used primarily for emphasis, not as the only carrier of meaning.

---

## JavaScript Architecture

JavaScript is intentionally small and scoped:

- **No global namespace pollution**
  - All behavior lives inside IIFEs in `assets/js/main.js`.
  - Constants and internal helpers are encapsulated.

- **Features implemented**
  1. **Dynamic year** in the footer.
  2. **Canvas constellation** with an adaptive particle count and debounced resize.
  3. **Scroll spy** using `IntersectionObserver` to keep the nav aligned with scroll position.
  4. **Scroll reveal** that adds a `.visible` class to sections as they enter the viewport.

- **Progressive enhancement**
  - If `IntersectionObserver` isn’t supported, sections simply render visible and links still work.
  - If `canvas.getContext` isn’t available, the hero gracefully falls back to a static gradient background.

---

## Project Structure

```text
.
├── index.html
├── assets
│   ├── css
│   │   └── main.css
│   └── js
│       └── main.js
└── README.md


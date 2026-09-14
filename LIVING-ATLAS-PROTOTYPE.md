# Living Atlas prototype

This branch tests a new portfolio system before any redesign is applied to the live site.

## Design thesis

The portfolio should demonstrate systems thinking through its own behavior. Projects are not isolated cards or sector buckets. They are coordinates in one evolving practice, connected by recurring questions about people, institutions, networks, evidence, interpretation, participation, and possibility.

## What this prototype changes

- Rebuilds `index.html` as a continuous editorial narrative rather than a stack of portfolio departments.
- Introduces `assets/css/atlas.css` as a clean visual system independent of the existing cascade.
- Introduces `assets/js/atlas.js` for navigation, progressive reveal, reduced-motion support, and the work-lens interaction.
- Uses one restrained palette across the page: warm paper, near-black ink, observatory green, rust signal color, and limited project accents.
- Replaces repeated project cards with editorial project nodes that share a common grammar but allow different evidence types: documentary photography, diagrams, astronomy imagery, and text systems.
- Adds a “View through” lens. Selecting Networks, Institutions, Interpretation, Evidence, or Participation changes emphasis across the same projects instead of hiding them. This is the key systems-behavior experiment.
- Adds a “Now” register so the portfolio can surface questions and work that are still developing.

## Principles to preserve

1. **Connections before categories.** A project can demonstrate several capabilities at once.
2. **Evidence before decoration.** Images should document, explain, or create meaningful scale.
3. **Variation inside a shared grammar.** Case studies may feel different without becoming separate microsites.
4. **Progressive disclosure.** Home establishes the practice; case studies hold the depth.
5. **Accessible motion.** Interaction is supplemental, keyboard-visible, and disabled when reduced motion is preferred.
6. **Mobile is a narrative, not a collapsed desktop.** Wide-screen relationships become a deliberate reading sequence on narrow screens.
7. **One active design system.** If this direction is adopted, legacy visual overrides should be consolidated rather than layered underneath it.

## Prototype scope

Only Home is redesigned in this branch. Existing Work, About, Research, Writing, and case-study pages remain unchanged so the prototype can be evaluated before the system is propagated.

## If approved

The next implementation sequence should be:

1. Convert Work into the full atlas/index using the same node and lens logic.
2. Establish one modular case-study backbone with project-specific evidence modules.
3. Recast About as a long-form editorial narrative using the same grid and annotation system.
4. Bring Research and The Echo Jar into the shared visual grammar while preserving their distinct registers.
5. Consolidate the active CSS architecture and retire superseded override layers.
6. Run accessibility, performance, responsive, and content-attribution QA before merge to `main`.

# Living Atlas prototype

This branch tests a new portfolio system before any redesign is applied to the live site.

## Design thesis

The portfolio should demonstrate systems thinking through its own behavior. Projects are not isolated cards or sector buckets. They are coordinates in one evolving practice, connected by recurring questions about people, institutions, networks, evidence, interpretation, participation, and possibility.

## What this prototype now changes

- Rebuilds `index.html` as a continuous editorial narrative rather than a stack of portfolio departments.
- Rebuilds `work.html` as the full atlas: project coordinates, overlapping lenses, transfer relationships, and a practice matrix.
- Rebuilds the five flagship case studies with one shared reading grammar:
  - Context
  - My role
  - System
  - Evidence
  - What changed
  - What travels forward
- Introduces `assets/css/atlas.css` as the base visual system and `assets/css/atlas-pages.css` for Work and the shared case-study grammar.
- Uses `assets/js/atlas.js` for navigation, progressive reveal, reduced-motion support, the work-lens interaction, and active case-study chapter navigation.
- Uses one restrained portfolio palette: warm paper, near-black ink, observatory green, rust signal color, and limited project accents.
- Replaces repeated project cards with editorial project nodes that allow different evidence types: documentary photography, diagrams, astronomy imagery, mission hardware, maps, and text systems.
- Keeps project identity in evidence and a small accent variable rather than giving every case study a separate mini-brand.

## Systems behavior being tested

### Work lenses
Selecting Networks, Institutions, Interpretation, Evidence, or Participation changes emphasis across the same projects instead of filtering projects away. The interaction demonstrates that one project can belong to several forms of practice at once.

### Transfers
Work explicitly shows what travels from one context into another: Webb participation infrastructure informs Roman field readiness; STORIMap evaluation informs future interpretive process; Hawaiʻi field learning informs partnership practice; higher-ed research sharpens institutional design.

### Shared case grammar
Every flagship case uses the same navigational backbone while preserving project-specific evidence and pacing. The common grammar should make the portfolio feel like one practice without turning each project into the same story.

## Principles to preserve

1. **Connections before categories.** A project can demonstrate several capabilities at once.
2. **Evidence before decoration.** Images should document, explain, or create meaningful scale.
3. **Variation inside a shared grammar.** Case studies may feel different without becoming separate microsites.
4. **Progressive disclosure.** Home establishes the practice; Work shows the system; case studies hold the depth.
5. **Accessible motion.** Interaction is supplemental, keyboard-visible, and disabled when reduced motion is preferred.
6. **Mobile is a narrative, not a collapsed desktop.** Wide-screen relationships become a deliberate reading sequence on narrow screens.
7. **One active design system.** If this direction is adopted, legacy visual overrides should be consolidated rather than layered underneath it.

## Current prototype scope

Redesigned in this branch:

- Home
- Work
- Informal Learning Network case study
- Hawaiʻi / ʻImiloa case study
- STORIMap case study
- Roman Community Engagement case study
- Webb Community Events case study

Still on the previous visual system:

- About
- Research
- The Echo Jar / Writing
- archive / experimental pages

## Next implementation sequence

1. Recast About as a long-form editorial narrative using the atlas grid, annotations, and documentary image rhythm.
2. Bring Research into the atlas while preserving its diagnostic and conceptual strengths.
3. Bring The Echo Jar into the shared visual grammar while preserving its quieter, exploratory register.
4. Consolidate legacy CSS and JavaScript once all primary pages have migrated.
5. Run responsive, accessibility, performance, image-attribution, and content-consistency QA before any merge to `main`.

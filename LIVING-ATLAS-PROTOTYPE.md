# Living Atlas prototype

This branch tests a new portfolio system before any redesign is applied to the live site.

## Design thesis

The portfolio should demonstrate systems thinking through its own behavior. Projects are not isolated cards or sector buckets. They are coordinates in one evolving practice, connected by recurring questions about people, institutions, networks, evidence, interpretation, participation, and possibility.

The same logic now extends beyond project work. The primary portfolio has three additional content strands:

- **About = personal / editorial.** A lived route through learning, institutions, public practice, values, and voice.
- **Research = analytical.** A working instrument that moves from question to thesis to diagnostic to institutional intervention.
- **The Echo Jar = reflective.** A quieter register for attention, uncertainty, memory, science, and writing that does not need to become a framework.

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
- Recasts `about.html` as the personal/editorial strand of the atlas, using route, field-note, values, and public-voice modules.
- Recasts `research.html` as the analytical strand, preserving the recognition pathway, comparison cases, Applied-Credit Reliability Diagnostic, scholarship register, career map, and practice commitments.
- Recasts `writing.html` / The Echo Jar as the reflective strand, replacing portfolio-card treatment with slower typographic vessels and an essay register.
- Introduces `assets/css/atlas.css` as the base visual system, `assets/css/atlas-pages.css` for Work and case-study grammar, and `assets/css/atlas-strands.css` for the three content strands.
- Uses `assets/js/atlas.js` for navigation, progressive reveal, reduced-motion support, work lenses, active case-study chapter navigation, and active strand chapter navigation.
- Uses one restrained portfolio palette: warm paper, near-black ink, observatory green, rust signal color, and limited contextual accents.
- Keeps identity in evidence, structure, and pacing rather than giving every page a separate mini-brand.

## Systems behavior being tested

### Work lenses
Selecting Networks, Institutions, Interpretation, Evidence, or Participation changes emphasis across the same projects instead of filtering projects away. The interaction demonstrates that one project can belong to several forms of practice at once.

### Transfers
Work explicitly shows what travels from one context into another: Webb participation infrastructure informs Roman field readiness; STORIMap evaluation informs future interpretive process; Hawaiʻi field learning informs partnership practice; higher-ed research sharpens institutional design.

### Shared case grammar
Every flagship case uses the same navigational backbone while preserving project-specific evidence and pacing. The common grammar should make the portfolio feel like one practice without turning each project into the same story.

### Content strands
About, Research, and Echo Jar share the same underlying typography, grid, header, footer, chapter tracking, and annotation language. Their content behavior differs intentionally:

- About advances through lived route and editorial reflection.
- Research advances through analytical sequence and reusable tools.
- Echo Jar advances through reflective forms and selected writing.

This tests whether the site can feel coherent without forcing every kind of thinking into the same component pattern.

## Principles to preserve

1. **Connections before categories.** A project can demonstrate several capabilities at once.
2. **Evidence before decoration.** Images should document, explain, or create meaningful scale.
3. **Variation inside a shared grammar.** Pages may feel different without becoming separate microsites.
4. **Progressive disclosure.** Home establishes the practice; Work shows the system; case studies hold project depth; strands show personal, analytical, and reflective depth.
5. **Accessible motion.** Interaction is supplemental, keyboard-visible, and disabled when reduced motion is preferred.
6. **Mobile is a narrative, not a collapsed desktop.** Wide-screen relationships become a deliberate reading sequence on narrow screens.
7. **One active design system.** Legacy visual overrides should be retired after migration rather than layered underneath the atlas.

## Current prototype scope

Primary pages redesigned in this branch:

- Home
- Work
- About
- Research
- The Echo Jar / Writing
- Informal Learning Network case study
- Hawaiʻi / ʻImiloa case study
- STORIMap case study
- Roman Community Engagement case study
- Webb Community Events case study

Still outside the atlas system:

- archive / experimental pages such as the wider research archive, timeline, library, and earlier immersive experiments

Those pages are not part of the primary navigation and should be treated as secondary migration or archival decisions rather than blockers for evaluating the core system.

## QA boundary

This branch has been source-reviewed for structural consistency, semantic hierarchy, reduced-motion support, keyboard-visible controls, shared navigation, content provenance, and isolation from `main`. The primary migrated pages no longer depend on the previous `site.css`, `quiet.css`, `partnerships.css`, or `visual-story.css` stack.

It has not yet received a pixel-level browser QA pass at multiple viewport sizes. That visual QA should happen before this draft is considered merge-ready. External imagery and embedded third-party content should also receive a final availability, attribution, and performance check.

The draft branch remains intentionally separate from `main`; review and iteration should continue in PR #9 until browser QA and legacy cleanup decisions are complete.

## Next implementation sequence

1. Review the now-complete primary-page system as one narrative, with particular attention to Home → Work → case study and Home → About / Research / Writing transitions.
2. Run responsive and browser QA at desktop, tablet, and mobile widths; fix typography, overflow, sticky navigation, focus, and image-crop issues.
3. Audit external images, embeds, attribution, loading behavior, and performance; self-host optimized assets where appropriate and permitted.
4. Decide which archive / experimental pages should be migrated, redirected, or retired.
5. Consolidate or remove legacy CSS and JavaScript only after confirming no retained secondary page still depends on it.
6. Run final accessibility, content-consistency, link, and performance QA before any merge to `main`.

# Living Atlas prototype

This branch tests a new portfolio system before the redesign is applied to the live site.

## Design thesis

The portfolio should demonstrate systems thinking through its own behavior. Projects are not isolated cards or sector buckets. They are coordinates in one evolving practice, connected by recurring questions about people, institutions, networks, evidence, interpretation, participation, and possibility.

The same logic extends beyond project work through three additional content strands:

- **About = personal / editorial.** A lived route through learning, institutions, public practice, values, and voice.
- **Research = analytical.** A working instrument that moves from question to thesis to diagnostic to institutional intervention.
- **The Echo Jar = reflective.** A quieter register for attention, uncertainty, memory, science, and writing that does not need to become a framework.

## Current primary system

- `index.html` is a continuous editorial narrative rather than a stack of portfolio departments.
- `work.html` is the full atlas: project coordinates, overlapping lenses, transfer relationships, and a practice matrix.
- The five flagship case studies use one shared reading grammar:
  1. Context
  2. My role
  3. System
  4. Evidence
  5. What changed
  6. What travels forward
- `about.html` is the personal/editorial strand, using route, field-note, values, and public-voice modules.
- `research.html` is the analytical strand, preserving the recognition pathway, comparison cases, Applied-Credit Reliability Diagnostic, scholarship register, career map, and practice commitments.
- `writing.html` / The Echo Jar is the reflective strand, using slower typographic vessels and an essay register.

## Active architecture

The migrated site now has one intentionally small active front-end stack:

- `assets/css/atlas.css` — base visual system
- `assets/css/atlas-pages.css` — Work and case-study grammar
- `assets/css/atlas-strands.css` — About, Research, and Echo Jar
- `assets/js/atlas.js` — responsive navigation, progressive reveal, work lenses, tracked chapter navigation, reduced-motion support, and fragment/deep-link handling

Project/page identity comes from evidence, structure, pacing, and restrained contextual accents rather than separate mini-brands.

## Systems behavior

### Work lenses
Selecting Networks, Institutions, Interpretation, Evidence, or Participation changes emphasis across the same projects instead of filtering projects away. One project can visibly belong to several forms of practice at once.

### Transfers
Work makes knowledge transfer explicit: Webb participation infrastructure informs Roman field readiness; STORIMap evaluation informs future interpretive process; Hawaiʻi field learning informs partnership practice; higher-ed research sharpens institutional design.

### Shared case grammar
Every flagship case uses the same navigational backbone while preserving project-specific evidence and pacing. The common grammar makes the portfolio feel like one practice without making every case tell the same story.

### Content strands
About, Research, and Echo Jar share typography, grid, header, footer, chapter tracking, and annotation language while moving differently:

- About advances through lived route and editorial reflection.
- Research advances through analytical sequence and reusable tools.
- Echo Jar advances through reflective forms and selected writing.

## Principles to preserve

1. **Connections before categories.** A project can demonstrate several capabilities at once.
2. **Evidence before decoration.** Images should document, explain, or create meaningful scale.
3. **Variation inside a shared grammar.** Pages may feel different without becoming separate microsites.
4. **Progressive disclosure.** Home establishes the practice; Work shows the system; case studies hold project depth; strands show personal, analytical, and reflective depth.
5. **Accessible motion.** Interaction is supplemental, keyboard-visible, and reduced or removed when requested by the user’s system settings.
6. **Mobile is a narrative, not a collapsed desktop.** Wide-screen relationships become a deliberate reading sequence on narrow screens.
7. **One active design system.** Superseded visual systems are removed rather than left underneath the Atlas as dormant sediment.

## Verification completed

The branch now includes `.github/workflows/living-atlas-qa.yml`, which performs repeatable source and browser checks on the ten primary pages.

The verification pass has confirmed:

- primary local references resolve;
- primary pages have no duplicate IDs;
- all primary-page images carry `alt` attributes;
- migrated pages do not load the superseded CSS/JS stack;
- the site serves successfully in CI;
- representative desktop, tablet, and mobile views render successfully in headless Chrome;
- Home, Work, About, Research, Writing, and the flagship case-study system retain their responsive hierarchy after pruning;
- the active `assets/css/` directory now contains only the three Atlas stylesheets;
- the active `assets/js/` directory now contains only `atlas.js`;
- the post-prune dependency inventory reports no unreferenced CSS or JavaScript candidates.

The browser pass also prompted a hardening change for fragment/deep-link behavior so chapter URLs account for the fixed global header and secondary chapter navigation.

## Pruning completed

The earlier immersive “study / library” experiment has been retired as an application system. Its old URLs are preserved as lightweight `noindex` compatibility redirects:

- `library.html` → `index.html`
- `work-timeline.html` → `work.html`
- `research-archive.html` → `research.html`
- `public-systems.html` → `work.html`

Their dedicated CSS, JavaScript, and generated multi-aspect-ratio backdrop image sets have been deleted. The new Research page no longer routes readers into the retired research spread.

Seven currently unused files remain in `assets/images/`: documentary/project images with plausible future editorial value. They are intentionally preserved and are not legacy design-system dependencies.

## Remaining pre-merge checks

The architecture and pruning stage is complete. Before merging to `main`, the remaining work is a final editorial/release pass rather than another redesign:

1. Review the complete primary-page system in a normal interactive browser, especially sticky navigation, deep links, image crops, and menu behavior.
2. Verify external NASA/ESA/partner imagery and third-party embeds for availability, attribution, and acceptable loading behavior.
3. Run a final content-consistency and link check after any last copy edits.
4. Decide whether the branch-only QA workflow should be retained, generalized for `main`/pull requests, or removed before release.
5. Keep PR #9 draft until the release decision is explicit; do not merge automatically.

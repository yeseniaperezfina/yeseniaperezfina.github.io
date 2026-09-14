# Living Atlas release review

Final release review is complete on the prototype branch.

Release-candidate verification:

- Mobile navigation opens, closes with Escape, and restores keyboard focus.
- Work lenses change emphasis without hiding projects.
- Direct deep links reveal their target chapter and account for the fixed site header plus sticky chapter navigation.
- Sticky chapter navigation holds the explicitly selected chapter during programmatic scrolling and updates `aria-current` correctly.
- All ten primary pages pass hierarchy, alt-text, local-link, and internal-fragment checks.
- Every page image decodes successfully during a full visitor scroll in Chrome.
- The ILN Google My Maps embed establishes a live child frame in Chrome.
- Thirty-nine visitor-realistic screenshots were captured across desktop, tablet, and mobile views, including deep-link chapters, the Work transfers section, and the About field note.

Corrections made during release review:

- Replaced the brittle hotlinked ILN photograph with a local network-system visual; the official live map remains the geographic evidence.
- Replaced and removed the invalid `about-scotland.webp` asset; the About field note now uses an authentic local Maunakea photograph.
- Updated Roman language to reflect the successful August 30, 2026 launch and position First Look as the next public milestone.
- Checked NASA Roman, ESA/Webb, and Universe of Learning project imagery and provenance against official sources; details are recorded in `IMAGE-CREDITS.md`.
- Removed one-time repair scripts and workflows after the fixes were applied.

The clean release-candidate browser run completed successfully on commit `3e1834cc7e4d5ae948aff69d5e4cffb313271f86`. The only change after that run is this documentation update; the same QA workflow runs automatically on this commit as the final gate.

`main` remains unchanged. PR #9 remains draft until an explicit release decision.
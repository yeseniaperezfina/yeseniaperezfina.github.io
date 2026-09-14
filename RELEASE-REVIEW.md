# Living Atlas release review

Final release review is in progress on the prototype branch.

Verified or corrected so far:

- Mobile navigation opens, closes with Escape, and restores keyboard focus.
- Work lenses change emphasis without hiding projects.
- Direct deep links reveal their target chapter and account for the fixed site header plus sticky chapter navigation.
- Sticky chapter navigation now holds the explicitly selected chapter during programmatic scrolling.
- The ILN Google My Maps embed establishes a live child frame in Chrome.
- The brittle hotlinked ILN photograph has been replaced with a local network-system visual; the live map remains the geographic evidence.
- The invalid `about-scotland.webp` asset has been replaced in the About narrative with an existing authentic Maunakea wide photograph.
- Roman copy now reflects the successful August 30, 2026 launch and positions First Look as the next public milestone.
- NASA Roman and ESA/Webb imagery sources and credits have been checked against official mission pages.

The next successful release-QA run should be treated as the final browser gate before merge consideration. `main` remains unchanged.
from pathlib import Path


def replace(path, old, new, expected=1):
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    count = text.count(old)
    if count != expected:
        raise SystemExit(f"{path}: expected {expected} occurrence(s), found {count}: {old[:90]!r}")
    p.write_text(text.replace(old, new), encoding="utf-8")
    print(f"updated {path}: {old[:55]!r}")


# Replace the brittle ILN hotlink with a local system visual. The live map remains
# the geographic/documentary evidence in the case study.
remote_iln = "https://universe-of-learning.org/files/live/sites/uol/files/home/resources/projects/informal-learning-network/_images/UoL-ILN-IntroAstronomy-Pinhead-1-2400x1200.jpg?t=tn370"
local_iln = "assets/images/iln-network-system.svg"
for path in ("index.html", "work.html", "case-study-iln.html"):
    replace(path, remote_iln, local_iln)
    replace(
        path,
        'alt="A hands-on astronomy activity from an Informal Learning Network program"',
        'alt="Abstract diagram of the Informal Learning Network connecting local expertise, shared infrastructure, local adaptation, and learning"',
    )

replace(
    "case-study-iln.html",
    "ILN is visible in local practice: educators adapting astronomy experiences for the people and places they know. Image: NASA’s Universe of Learning.",
    "The network operates as a feedback system: local expertise meets shared infrastructure, local adaptation, and learning that returns to the portfolio.",
)

# The Scotland asset in the original repository is not a valid WebP. Preserve the
# field-note rhythm using an authentic, already-local wide Maunakea photograph.
replace("about.html", 'aria-label="Field note from Scotland"', 'aria-label="Field note from Maunakea"')
replace(
    "about.html",
    '<img src="assets/images/about-scotland.webp" alt="A person standing with arms raised before a mountain in Scotland" width="1600" height="1000" loading="lazy">',
    '<img src="assets/images/maunakea-wide.webp" alt="A wide view across Maunakea and its observatories beneath an open sky" loading="lazy">',
)
replace("about.html", '<span class="section-code">Field note / Scotland</span>', '<span class="section-code">Field note / Maunakea</span>')

# Roman launched August 30, 2026. Keep the field-readiness thesis, but make the
# public copy accurate for the post-launch / pre-First-Look moment.
replace(
    "index.html",
    "I’m applying lessons from Webb to build clearer resource pathways, facilitator support, host participation, and durable local capacity ahead of Roman mission milestones.",
    "I’m applying lessons from Webb to build clearer resource pathways, facilitator support, host participation, and durable local capacity through launch and toward First Look.",
)
replace(
    "work.html",
    '<p class="work-meta"><span>04</span> Nancy Grace Roman Space Telescope · current initiative</p>',
    '<p class="work-meta"><span>04</span> Nancy Grace Roman Space Telescope · launch-era field readiness</p>',
)
replace(
    "work.html",
    "I’m applying lessons from Webb to expand the host network, strengthen facilitator pathways, connect partners with scientists, and build a more usable support system ahead of launch and First Look milestones.",
    "Roman launched August 30, 2026. I’m applying lessons from Webb to strengthen the host network, facilitator pathways, scientist connections, and support system as the work moves from launch toward First Look.",
)
replace(
    "case-study-roman.html",
    'content="How Yesenia Pérez is applying lessons from Webb to help build Roman’s launch-era community engagement system."',
    'content="How Yesenia Pérez applied lessons from Webb to build Roman’s launch-era community engagement system and support the field from launch toward First Look."',
)
replace("case-study-roman.html", '<dt>Status</dt><dd>Current initiative</dd>', '<dt>Status</dt><dd>Launched Aug. 30, 2026</dd>')
replace("case-study-roman.html", '<dt>Milestones</dt><dd>Launch + First Look</dd>', '<dt>Milestones</dt><dd>Launch complete · First Look ahead</dd>')
replace(
    "case-study-roman.html",
    "Roman’s launch gives audiences a real-time reason to connect with dark energy, exoplanets, galaxies, stars, and cosmic history.",
    "Roman’s August 30, 2026 launch gave audiences a real-time reason to connect with dark energy, exoplanets, galaxies, stars, and cosmic history.",
)
replace("case-study-roman.html", "The work begins before launch: organize the resources", "The work began before launch: organize the resources")
replace(
    "case-study-roman.html",
    "Presented launch-season supports to facilitator and professional audiences, gathering questions and resource gaps before events accelerate.",
    "Presented launch-season supports to facilitator and professional audiences, gathering questions and resource gaps before events accelerated and carrying those questions forward after launch.",
)
replace(
    "case-study-roman.html",
    "A Roman event can be a small addition to an existing program, a focused activity station, or a multi-part launch celebration.",
    "A Roman event can be a small addition to an existing program, a focused activity station, or a multi-part launch or post-launch celebration.",
)
replace(
    "case-study-roman.html",
    "Roman Community Events is a current collaborative initiative.",
    "Roman Community Events is a launch-era collaborative initiative.",
)

print("All release replacements applied successfully.")

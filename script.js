// Set current year in footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Mode chips (hero practice modes)
const modeDescription = document.getElementById("mode-description");
const modeChips = document.querySelectorAll(".chip--mode");

const modeCopy = {
  strategist:
    "I architect multi-year initiatives that align partners, evidence, and strategy — so complex missions move from ambitious vision to lived experience.",
  designer:
    "I treat programs as ecosystems: interlocking portfolios, networks, and infrastructures that make learning durable, equitable, and scalable.",
  communicator:
    "I translate astrophysics and evaluation findings into stories, toolkits, and experiences that communities can see themselves in.",
  navigator:
    "I help teams navigate uncertainty, building reflection and learning loops into the way we plan, decide, and steward public knowledge."
};

modeChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const mode = chip.dataset.mode;
    modeChips.forEach((c) => c.classList.remove("chip--active"));
    chip.classList.add("chip--active");
    if (mode && modeCopy[mode] && modeDescription) {
      modeDescription.textContent = modeCopy[mode];
    }
  });
});

// IntersectionObserver for section reveal
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  // Fallback: just show everything
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Scroll-spy for nav links
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const href = link.getAttribute("href");
            if (href === `#${id}`) {
              link.classList.add("is-active");
            } else {
              link.classList.remove("is-active");
            }
          });
        }
      });
    },
    {
      rootMargin: "-55% 0px -40% 0px",
      threshold: 0.1
    }
  );

  sections.forEach((section) => navObserver.observe(section));
}

// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const navList = document.querySelector(".nav-list");

if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    navList.classList.toggle("is-open");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("is-open");
    });
  });
}

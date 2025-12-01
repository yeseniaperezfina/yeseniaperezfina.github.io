// Utility: get year
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Mode chips
const modeDescription = document.getElementById("mode-description");
const modeChips = document.querySelectorAll(".chip--mode");

const modeCopy = {
  strategy:
    "I design multi-year initiatives that connect missions, partners, and evidence into clear, navigable plans.",
  ecosystems:
    "I think in systems: networks, portfolios, and workflows that make learning durable, equitable, and coherent.",
  communication:
    "I turn complex science and evaluation into stories, toolkits, and experiences people can actually use.",
  reflection:
    "I build reflection and writing into the work, so teams can learn in real time and not only at the end."
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

// Section reveal
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
    { threshold: 0.2 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Scroll spy
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
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
      rootMargin: "-50% 0px -40% 0px",
      threshold: 0.1
    }
  );

  sections.forEach((section) => navObserver.observe(section));
}

// Mobile nav
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

// Simple parallax for hero / Highland images
const parallaxEls = document.querySelectorAll("[data-parallax]");
let lastScrollY = window.scrollY || 0;

const handleParallax = () => {
  const currentY = window.scrollY || 0;
  const scrollDelta = currentY - lastScrollY;
  lastScrollY = currentY;

  parallaxEls.forEach((el) => {
    const factor = parseFloat(el.dataset.parallax || "0");
    const offset = currentY * factor;
    el.style.transform = `translate3d(0, ${offset}px, 0)`;
    el.style.willChange = "transform";
  });
};

window.addEventListener("scroll", handleParallax, { passive: true });
handleParallax();

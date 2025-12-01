// Year in footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Practice lenses
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
    "I build in reflection and writing as part of the work, so teams can learn from what they are doing in real time."
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

// Section reveal on scroll
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
    { threshold: 0.25 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Scroll-spy for nav
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

// Soft parallax sky on scroll
const cosmosBack = document.querySelector(".cosmos--back");
const cosmosMid = document.querySelector(".cosmos--mid");
const cosmosFront = document.querySelector(".cosmos--front");

const handleScroll = () => {
  const y = window.scrollY || window.pageYOffset;
  if (cosmosBack) cosmosBack.style.transform = `translateY(${y * 0.03}px)`;
  if (cosmosMid) cosmosMid.style.transform = `translateY(${y * 0.06}px)`;
  if (cosmosFront) cosmosFront.style.transform = `translateY(${y * 0.01}px)`;
};

window.addEventListener("scroll", handleScroll, { passive: true });

// Pointer parallax for hero orbit
const heroOrbit = document.querySelector(".hero-orbit");

if (heroOrbit) {
  const motionScale = 10; // adjust for more/less motion

  const handlePointerMove = (event) => {
    const { innerWidth, innerHeight } = window;
    const xNorm = (event.clientX / innerWidth) - 0.5;
    const yNorm = (event.clientY / innerHeight) - 0.5;

    const xOffset = -xNorm * motionScale;
    const yOffset = -yNorm * motionScale;

    heroOrbit.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
  };

  document.addEventListener("pointermove", handlePointerMove);
}

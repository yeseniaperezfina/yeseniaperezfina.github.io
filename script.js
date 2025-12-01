// Year in footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Practice lenses copy
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
    "I build reflection and writing into the work, so teams can learn in real time and not just at the end."
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

// Gentle tilt on hero panel
const tiltTarget = document.querySelector(".tilt-target");

if (tiltTarget) {
  const maxTilt = 6; // degrees

  const handlePointerMove = (event) => {
    const rect = tiltTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const xPercent = (x / rect.width - 0.5) * 2;
    const yPercent = (y / rect.height - 0.5) * 2;

    const rotateX = -yPercent * maxTilt;
    const rotateY = xPercent * maxTilt;

    tiltTarget.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
  };

  const resetTilt = () => {
    tiltTarget.style.transform = "rotateX(0deg) rotateY(0deg) translateZ(0)";
  };

  tiltTarget.addEventListener("pointermove", handlePointerMove);
  tiltTarget.addEventListener("pointerleave", resetTilt);
}

// Soft Physics skyfield – spores & stars
const canvas = document.getElementById("skyfield");
const ctx = canvas ? canvas.getContext("2d") : null;

if (canvas && ctx) {
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = [];
  const STAR_COUNT = 80;
  const SPORE_COUNT = 70;

  const createStar = () => ({
    type: "star",
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.2 + 0.4,
    baseAlpha: 0.4 + Math.random() * 0.4,
    twinkleSpeed: 0.01 + Math.random() * 0.02,
    phase: Math.random() * Math.PI * 2
  });

  const createSpore = () => ({
    type: "spore",
    x: Math.random() * width,
    y: height + Math.random() * height * 0.4,
    radius: Math.random() * 2.3 + 1,
    speed: 0.2 + Math.random() * 0.4,
    drift: (Math.random() - 0.5) * 0.15
  });

  for (let i = 0; i < STAR_COUNT; i++) particles.push(createStar());
  for (let i = 0; i < SPORE_COUNT; i++) particles.push(createSpore());

  let lastScrollY = window.scrollY || 0;
  let scrollVelocity = 0;

  const handleScroll = () => {
    const currentY = window.scrollY || 0;
    scrollVelocity = currentY - lastScrollY;
    lastScrollY = currentY;
  };

  window.addEventListener("scroll", handleScroll, { passive: true });

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      if (p.type === "star") {
        p.phase += p.twinkleSpeed;
        const alpha = p.baseAlpha + Math.sin(p.phase) * 0.2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.6);
        gradient.addColorStop(0, `rgba(244, 213, 141, ${alpha})`);
        gradient.addColorStop(1, "rgba(244, 213, 141, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();
      } else if (p.type === "spore") {
        const scrollLift = scrollVelocity * 0.01;
        p.y -= p.speed + scrollLift;
        p.x += p.drift;

        if (p.y + p.radius < -20) {
          Object.assign(p, createSpore(), { y: height + 20 });
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2.5);
        gradient.addColorStop(0, "rgba(124, 195, 159, 0.8)");
        gradient.addColorStop(1, "rgba(124, 195, 159, 0)");
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    });

    requestAnimationFrame(draw);
  };

  draw();

  // Resize handler
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });
}

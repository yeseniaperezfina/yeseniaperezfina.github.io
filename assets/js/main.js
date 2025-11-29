// assets/js/main.js

// ==========
// Year stamp
// ==========
(function setYear() {
  const yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
})();

// ===============================
// Canvas constellation background
// ===============================
(function initCanvasConstellation() {
  const canvas = document.getElementById("orbitCanvas");
  if (!canvas || !canvas.getContext) return;

  const prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];
  const PARTICLE_COUNT = 60;
  const MAX_DISTANCE = 130;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;

    if (width === 0 || height === 0) return;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    // If user prefers reduced motion, draw a static field once
    if (prefersReducedMotion) {
      drawFrame();
    }
  }

  function step() {
    if (prefersReducedMotion) return; // animation skipped; static frame already drawn

    drawFrame();
    requestAnimationFrame(step);
  }

  function drawFrame() {
    if (!width || !height) return;

    ctx.clearRect(0, 0, width, height);

    // update positions only if motion allowed
    if (!prefersReducedMotion) {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
    }

    // draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DISTANCE) {
          const alpha = 1 - dist / MAX_DISTANCE;
          ctx.strokeStyle = `rgba(148, 163, 184, ${alpha * 0.45})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // draw particles
    for (const p of particles) {
      ctx.fillStyle = "rgba(248, 250, 252, 0.9)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  window.addEventListener("resize", resize);
  resize();
  if (!prefersReducedMotion) {
    requestAnimationFrame(step);
  }
})();

// ===================
// Scroll spy for nav
// ===================
(function initScrollSpy() {
  const sections = document.querySelectorAll("[data-section]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  // Map section id -> nav-link
  const linkMap = {};
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const id = href.slice(1);
    linkMap[id] = link;
  });

  // Helper: set active class
  function setActive(id) {
    if (!id || !linkMap[id]) return;
    navLinks.forEach((link) => link.classList.remove("is-active"));
    linkMap[id].classList.add("is-active");
  }

  // Feature-detect IntersectionObserver
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        threshold: 0.45,
      }
    );

    sections.forEach((section) => observer.observe(section));
  } else {
    // Fallback: simple scroll event
    window.addEventListener("scroll", () => {
      let bestId = null;
      let bestOffset = Infinity;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const offset = Math.abs(rect.top - 120); // 120px-ish from top
        if (offset < bestOffset) {
          bestOffset = offset;
          bestId = section.id;
        }
      });
      setActive(bestId);
    });
  }

  // Smooth-scroll on click (respect reduced motion)
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();

      if (prefersReducedMotion) {
        target.scrollIntoView();
      } else {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
})();

// ========================
// Scroll reveal for .section
// ========================
(function initScrollReveal() {
  const sections = document.querySelectorAll(".section");
  if (!sections.length) return;

  // If IntersectionObserver is missing, just show everything
  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => {
      section.classList.add("section-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.25,
    }
  );

  sections.forEach((section) => observer.observe(section));
})();

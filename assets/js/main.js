// ======================
// Year in footer
// ======================
(function setYear() {
  const yearEl = document.getElementById("year");
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
})();

// ===================================
// Canvas constellation — soft backdrop
// ===================================
(function initCanvasConstellation() {
  const canvas = document.getElementById("orbitCanvas");
  if (!canvas || !canvas.getContext) return;

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];
  const PARTICLE_COUNT = 55;
  const MAX_DISTANCE = 120;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    if (!width || !height) return;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      });
    }

    if (prefersReducedMotion) {
      drawFrame(true);
    }
  }

  function drawFrame(staticOnly) {
    if (!width || !height) return;

    ctx.clearRect(0, 0, width, height);

    if (!staticOnly) {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
    }

    // connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DISTANCE) {
          const alpha = 1 - dist / MAX_DISTANCE;
          ctx.strokeStyle = `rgba(110, 96, 84, ${alpha * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // particles
    for (const p of particles) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function step() {
    if (prefersReducedMotion) return;
    drawFrame(false);
    requestAnimationFrame(step);
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

  const linkMap = {};
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const id = href.slice(1);
    linkMap[id] = link;
  });

  function setActive(id) {
    if (!id || !linkMap[id]) return;
    navLinks.forEach((link) => link.classList.remove("is-active"));
    linkMap[id].classList.add("is-active");
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActive(id);
          }
        });
      },
      {
        threshold: 0.4,
      }
    );

    sections.forEach((section) => observer.observe(section));
  } else {
    window.addEventListener("scroll", () => {
      let bestId = null;
      let bestOffset = Infinity;
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const offset = Math.abs(rect.top - 120);
        if (offset < bestOffset) {
          bestOffset = offset;
          bestId = section.id;
        }
      });
      setActive(bestId);
    });
  }

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

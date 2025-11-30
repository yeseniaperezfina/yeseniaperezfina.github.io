// assets/js/main.js

// =============================
// UTILITIES
// =============================

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

// =============================
// ROLE CHIP COPY
// =============================

const ROLE_COPY = {
  Strategist:
    "As a Strategist, I design portfolios, initiatives, and learning environments that connect mission, data, and lived experience—helping teams see the system, not just the project.",
  Scholar:
    "As a Scholar, I draw from higher education research, learning sciences, and organizational leadership to inform how we structure programs, roles, and systems for long-term health.",
  Creator:
    "As a Creator, I use visual storytelling, writing, and experience design—including The Echo Jar—to translate complex science and systems work into narratives that feel accessible and worth caring about.",
  Navigator:
    "As a Navigator, I help teams move through ambiguity with clarity and care—holding timelines, people, and purpose so that change work is brave but not reckless."
};

// =============================
// MAIN BOOTSTRAP
// =============================

document.addEventListener("DOMContentLoaded", () => {
  const state = {
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  initYearStamp();
  initNav(state);
  initScrollSpy(state);
  initRoleChips();
  initCursorLantern(state);
  initSkillsDiagram(state);
});

// =============================
// YEAR STAMP
// =============================

function initYearStamp() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// =============================
// NAV TOGGLE + SCROLL SPY
// =============================

function initNav(state) {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll("[data-nav-link='true']");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // Close nav on mobile when a link is clicked
        if (nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }
}

function initScrollSpy(state) {
  const sections = document.querySelectorAll("section[data-section]");
  const navLinks = document.querySelectorAll("[data-nav-link='true']");
  if (!sections.length || !navLinks.length) return;

  const linkMap = new Map();
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const id = href.slice(1);
    linkMap.set(id, link);
  });

  const observerOptions = {
    root: null,
    threshold: 0.25,
    rootMargin: "0px 0px -20% 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      if (!id) return;

      // Section reveal
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }

      // Scroll spy
      if (entry.intersectionRatio > 0.25) {
        navLinks.forEach((link) => link.classList.remove("is-active"));
        const activeLink = linkMap.get(id);
        if (activeLink) {
          activeLink.classList.add("is-active");
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));

  // Also ensure hero section is visible without lag
  const hero = document.querySelector("#about.section");
  if (hero) hero.classList.add("is-visible");
}

// =============================
// ROLE CHIPS
// =============================

function initRoleChips() {
  const chips = document.querySelectorAll("[data-role-chip]");
  const roleNote = document.getElementById("role-note");

  if (!chips.length || !roleNote) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const role = chip.getAttribute("data-role-chip");
      if (!role) return;

      // Update active state
      chips.forEach((c) => c.classList.remove("chip-active"));
      chip.classList.add("chip-active");

      // Update copy
      const text = ROLE_COPY[role] || ROLE_COPY.Strategist;
      roleNote.textContent = text;
    });
  });
}

// =============================
// CURSOR LANTERN
// =============================

function initCursorLantern(state) {
  const glow = document.querySelector(".cursor-glow");
  if (!glow) return;

  if (state.prefersReducedMotion) {
    glow.style.display = "none";
    return;
  }

  let rafId = null;
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  function onMouseMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;
    if (rafId === null) {
      rafId = requestAnimationFrame(animate);
    }
  }

  function animate() {
    const lerpFactor = 0.18;
    currentX += (targetX - currentX) * lerpFactor;
    currentY += (targetY - currentY) * lerpFactor;

    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

    if (Math.abs(currentX - targetX) > 0.5 || Math.abs(currentY - targetY) > 0.5) {
      rafId = requestAnimationFrame(animate);
    } else {
      rafId = null;
    }
  }

  window.addEventListener("mousemove", onMouseMove);
}

// =============================
// NIGHT-SKY DIAGRAM
// =============================

function initSkillsDiagram(state) {
  const canvas = document.getElementById("skills-canvas");
  const tooltip = document.getElementById("orbit-tooltip");
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  // Skill nodes in "orbits"
  const nodes = [
    {
      label: "Portfolio strategy",
      orbitRadius: 80,
      baseAngle: 0.1,
      size: 5,
      speed: 0.00018
    },
    {
      label: "Research synthesis",
      orbitRadius: 110,
      baseAngle: 1.4,
      size: 5,
      speed: -0.00014
    },
    {
      label: "Facilitation",
      orbitRadius: 140,
      baseAngle: 2.6,
      size: 5,
      speed: 0.0002
    },
    {
      label: "Organizational storytelling",
      orbitRadius: 170,
      baseAngle: 3.8,
      size: 5,
      speed: -0.00016
    },
    {
      label: "Ecosystem design",
      orbitRadius: 200,
      baseAngle: 5.1,
      size: 6,
      speed: 0.00012
    },
    {
      label: "Equity-centered leadership",
      orbitRadius: 225,
      baseAngle: 0.9,
      size: 6,
      speed: -0.0001
    }
  ];

  let width = 0;
  let height = 0;
  let cx = 0;
  let cy = 0;
  let lastTime = performance.now();
  let animationFrameId = null;
  let mouse = { x: null, y: null, active: false };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = Math.max(rect.height, 260);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cx = width / 2;
    cy = height / 2;
  }

  resize();
  window.addEventListener("resize", resize);

  // Mouse handling for tooltip
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  canvas.addEventListener("mouseleave", () => {
    mouse.active = false;
    if (tooltip) {
      tooltip.hidden = true;
    }
  });

  function drawFrame(timestamp) {
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, width, height);

    // Background gradient (library night-sky)
    const bgGradient = ctx.createRadialGradient(
      cx,
      cy * 0.2,
      10,
      cx,
      cy,
      Math.max(width, height)
    );
    bgGradient.addColorStop(0, "#020617");
    bgGradient.addColorStop(1, "#020617");
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Soft vignette
    const vignette = ctx.createRadialGradient(
      cx,
      cy,
      Math.min(width, height) * 0.1,
      cx,
      cy,
      Math.max(width, height)
    );
    vignette.addColorStop(0, "rgba(15,23,42,0)");
    vignette.addColorStop(1, "rgba(15,23,42,0.9)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    // Subtle orbits
    ctx.save();
    ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
    ctx.lineWidth = 1;
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(cx, cy, node.orbitRadius, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();

    // Static starfield
    drawStaticStars(ctx, width, height);

    // Nodes with motion
    let highlightedNode = null;
    let highlightedPosition = null;

    ctx.save();
    ctx.lineWidth = 1.2;
    nodes.forEach((node, index) => {
      const angle = state.prefersReducedMotion
        ? node.baseAngle
        : node.baseAngle + node.speed * (timestamp - 0);

      const x = cx + Math.cos(angle) * node.orbitRadius;
      const y = cy + Math.sin(angle) * node.orbitRadius;

      // Connect inner "constellation" lines casually
      if (index > 0) {
        const prev = nodes[index - 1];
        const prevAngle = state.prefersReducedMotion
          ? prev.baseAngle
          : prev.baseAngle + prev.speed * (timestamp - 0);
        const px = cx + Math.cos(prevAngle) * prev.orbitRadius;
        const py = cy + Math.sin(prevAngle) * prev.orbitRadius;

        ctx.strokeStyle = "rgba(148, 163, 184, 0.4)";
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // Node itself
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, node.size * 3);
      gradient.addColorStop(0, "rgba(190, 242, 100, 1)");
      gradient.addColorStop(0.5, "rgba(52, 211, 153, 0.8)");
      gradient.addColorStop(1, "rgba(15, 23, 42, 0)");

      // Halo
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, node.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = "#E5F9C9";
      ctx.beginPath();
      ctx.arc(x, y, node.size, 0, Math.PI * 2);
      ctx.fill();

      // Hover detection
      if (mouse.active && mouse.x != null && mouse.y != null) {
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < node.size * 3.2) {
          highlightedNode = node;
          highlightedPosition = { x, y };
        }
      }
    });
    ctx.restore();

    // Tooltip
    if (tooltip) {
      if (highlightedNode && highlightedPosition) {
        tooltip.hidden = false;
        tooltip.textContent = highlightedNode.label;
        // Position tooltip near mouse, clamped within diagram frame
        const rect = canvas.getBoundingClientRect();
        const tooltipX = clamp01(mouse.x / width) * (width - 120);
        const tooltipY = clamp01(mouse.y / height) * (height - 40);

        tooltip.style.left = `${tooltipX + rect.left}px`;
        tooltip.style.top = `${tooltipY + rect.top}px`;
      } else {
        tooltip.hidden = true;
      }
    }

    if (!state.prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(drawFrame);
    } else {
      // If reduced motion, draw once and stop.
      animationFrameId = null;
    }
  }

  function drawStaticStars(ctx, w, h) {
    ctx.save();
    ctx.fillStyle = "rgba(148, 163, 184, 0.55)";
    const starCount = 28;
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 1.2;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Start drawing
  if (state.prefersReducedMotion) {
    // Draw once for reduced motion
    drawFrame(performance.now());
  } else {
    animationFrameId = requestAnimationFrame(drawFrame);
  }
}

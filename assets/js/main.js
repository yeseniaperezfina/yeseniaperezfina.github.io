// assets/js/main.js

document.addEventListener("DOMContentLoaded", () => {
  const state = {
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  initYear();
  initNav();
  initScrollSpy();
  initRoleChips();
  initCursorLantern(state);
  initSkillsDiagram(state);
});

// =============================
// YEAR STAMP
// =============================

function initYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// =============================
// NAV + SCROLL SPY
// =============================

function initNav() {
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  const links = document.querySelectorAll(".nav-link");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  links.forEach((link) => {
    link.addEventListener("click", () => {
      links.forEach((l) => l.classList.remove("is-active"));
      link.classList.add("is-active");

      if (nav && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
      }
    });
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll("section[data-section]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const linkMap = new Map();
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    linkMap.set(href.slice(1), link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.target.id) return;

        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }

        if (entry.intersectionRatio > 0.35) {
          navLinks.forEach((l) => l.classList.remove("is-active"));
          const active = linkMap.get(entry.target.id);
          if (active) active.classList.add("is-active");
        }
      });
    },
    {
      root: null,
      threshold: 0.35,
      rootMargin: "0px 0px -20% 0px"
    }
  );

  sections.forEach((section) => observer.observe(section));

  const hero = document.getElementById("about");
  if (hero) hero.classList.add("is-visible");
}

// =============================
// ROLE CHIPS
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

function initRoleChips() {
  const chips = document.querySelectorAll("[data-role-chip]");
  const roleNote = document.getElementById("role-note");
  if (!chips.length || !roleNote) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const role = chip.getAttribute("data-role-chip");
      if (!role) return;

      chips.forEach((c) => c.classList.remove("chip-active"));
      chip.classList.add("chip-active");

      chip.setAttribute("aria-pressed", "true");
      chips.forEach((c) => {
        if (c !== chip) c.removeAttribute("aria-pressed");
      });

      const text = ROLE_COPY[role] || ROLE_COPY.Strategist;
      roleNote.textContent = text;
    });
  });
}

// =============================
// CURSOR LANTERN
// =============================

function initCursorLantern(state) {
  const glow = document.querySelector(".cursor-lantern");
  if (!glow) return;

  const prefersCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  if (state.prefersReducedMotion || prefersCoarsePointer) {
    glow.style.display = "none";
    return;
  }

  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;
  let rafId = null;

  function onMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;
    if (rafId === null) {
      rafId = requestAnimationFrame(update);
    }
  }

  function update() {
    const alpha = 0.16;
    currentX += (targetX - currentX) * alpha;
    currentY += (targetY - currentY) * alpha;

    glow.style.transform = `translate3d(${currentX - 110}px, ${currentY - 110}px, 0)`;

    if (Math.abs(currentX - targetX) > 0.5 || Math.abs(currentY - targetY) > 0.5) {
      rafId = requestAnimationFrame(update);
    } else {
      rafId = null;
    }
  }

  window.addEventListener("mousemove", onMove);
}

// =============================
// NIGHT-SKY DIAGRAM
// =============================

function initSkillsDiagram(state) {
  const canvas = document.getElementById("skillsCanvas");
  const tooltip = document.getElementById("skillsTooltip");
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;

  const nodes = [
    {
      label: "Learning ecosystem design",
      orbitRadius: 80,
      baseAngle: 0.2,
      size: 6,
      speed: 0.00018
    },
    {
      label: "Portfolio & program strategy",
      orbitRadius: 110,
      baseAngle: 1.5,
      size: 5,
      speed: -0.00016
    },
    {
      label: "Mixed-method research",
      orbitRadius: 135,
      baseAngle: 2.7,
      size: 5,
      speed: 0.0002
    },
    {
      label: "Evidence into decisions",
      orbitRadius: 160,
      baseAngle: 3.9,
      size: 5,
      speed: -0.00014
    },
    {
      label: "Cross-sector facilitation",
      orbitRadius: 185,
      baseAngle: 5.0,
      size: 5,
      speed: 0.00012
    },
    {
      label: "Organizational storytelling",
      orbitRadius: 205,
      baseAngle: 0.9,
      size: 5,
      speed: -0.0001
    },
    {
      label: "Equity-centered leadership",
      orbitRadius: 230,
      baseAngle: 2.1,
      size: 6,
      speed: 0.00009
    }
  ];

  let width = 0;
  let height = 0;
  let cx = 0;
  let cy = 0;

  // static stars
  const stars = [];
  function seedStars() {
    stars.length = 0;
    const count = 26;
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random(),
        y: Math.random(),
        r: 0.5 + Math.random() * 1.1
      });
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = Math.max(rect.height || 280, 260);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    cx = width / 2;
    cy = height / 2;
  }

  seedStars();
  resize();
  window.addEventListener("resize", resize);

  const mouse = { x: null, y: null, active: false };

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  canvas.addEventListener("mouseleave", () => {
    mouse.active = false;
    if (tooltip) tooltip.hidden = true;
  });

  let lastTime = performance.now();

  function draw(timestamp) {
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, width, height);

    // background gradient
    const bgGrad = ctx.createRadialGradient(cx, cy * 0.2, 8, cx, cy, Math.max(width, height));
    bgGrad.addColorStop(0, "#020617");
    bgGrad.addColorStop(1, "#000000");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // static stars
    ctx.save();
    ctx.fillStyle = "rgba(148,163,184,0.55)";
    stars.forEach((s) => {
      ctx.beginPath();
      ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // orbit rings
    ctx.save();
    ctx.strokeStyle = "rgba(148,163,184,0.25)";
    ctx.lineWidth = 1;
    nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(cx, cy, node.orbitRadius, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();

    let highlightedNode = null;
    let highlightedPosition = null;

    ctx.save();
    nodes.forEach((node, index) => {
      const t = state.prefersReducedMotion ? 0 : timestamp - 0;
      const angle = node.baseAngle + (state.prefersReducedMotion ? 0 : node.speed * t);
      const x = cx + Math.cos(angle) * node.orbitRadius;
      const y = cy + Math.sin(angle) * node.orbitRadius;

      // connect to previous node
      if (index > 0) {
        const prev = nodes[index - 1];
        const prevAngle = prev.baseAngle + (state.prefersReducedMotion ? 0 : prev.speed * t);
        const px = cx + Math.cos(prevAngle) * prev.orbitRadius;
        const py = cy + Math.sin(prevAngle) * prev.orbitRadius;

        ctx.strokeStyle = "rgba(148,163,184,0.45)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // halo
      const halo = ctx.createRadialGradient(x, y, 0, x, y, node.size * 3.5);
      halo.addColorStop(0, "rgba(190,242,100,0.9)");
      halo.addColorStop(0.5, "rgba(34,197,94,0.7)");
      halo.addColorStop(1, "rgba(15,23,42,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(x, y, node.size * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // core
      ctx.fillStyle = "#e5f9c9";
      ctx.beginPath();
      ctx.arc(x, y, node.size, 0, Math.PI * 2);
      ctx.fill();

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

    if (tooltip) {
      if (highlightedNode && highlightedPosition) {
        tooltip.hidden = false;
        tooltip.textContent = highlightedNode.label;

        const rect = canvas.getBoundingClientRect();
        const clamp01 = (v) => Math.min(1, Math.max(0, v));
        const tx = clamp01(mouse.x / width) * (width - 160);
        const ty = clamp01(mouse.y / height) * (height - 40);

        tooltip.style.left = `${rect.left + tx}px`;
        tooltip.style.top = `${rect.top + ty}px`;
      } else {
        tooltip.hidden = true;
      }
    }

    if (!state.prefersReducedMotion) {
      requestAnimationFrame(draw);
    }
  }

  if (state.prefersReducedMotion) {
    draw(performance.now());
  } else {
    requestAnimationFrame(draw);
  }
}

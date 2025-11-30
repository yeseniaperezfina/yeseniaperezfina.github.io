// ========================================
// MAIN SCRIPT – Midnight Library
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ======================
  // YEAR STAMP
  // ======================
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  // ======================
  // NAV TOGGLE (MOBILE)
  // ======================
  const navToggle = document.querySelector(".nav-toggle");
  const navList = document.getElementById("nav-list");
  const navLinks = document.querySelectorAll("[data-nav-link]");

  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      const isOpen = navList.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navList.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ======================
  // SCROLL SPY (ACTIVE NAV LINK + SCENE TINT)
  // ======================
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  if (sections.length && navLinks.length) {
    const navMap = new Map();
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      navMap.set(href.slice(1), link);
    });

    const htmlEl = document.documentElement;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const id = entry.target.id;
          const link = navMap.get(id);
          if (!link) return;

          navLinks.forEach((l) => l.setAttribute("data-active", "false"));
          link.setAttribute("data-active", "true");

          if (htmlEl) {
            if (id === "about" || id === "trajectory") {
              htmlEl.setAttribute("data-scene", "study");
            } else if (id === "practice" || id === "writing") {
              htmlEl.setAttribute("data-scene", "nook");
            } else if (id === "capabilities" || id === "contact") {
              htmlEl.setAttribute("data-scene", "observatory");
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.36,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // ======================
  // ROLE CHIPS → ROLE NOTE
  // ======================
  const chips = document.querySelectorAll("[data-role-chip]");
  const roleNote = document.getElementById("role-note");

  if (chips.length && roleNote) {
    const roleCopy = {
      Strategist:
        "As a Strategist, I design portfolios, initiatives, and learning environments that connect mission, data, and lived experience—helping teams see the system, not just the project.",
      Scholar:
        "As a Scholar, I draw from higher education research, learning sciences, and organizational theory to make design and governance decisions that are rigorous, humane, and context-aware.",
      Creator:
        "As a Creator, I build stories, tools, and experiences—writing, visuals, and facilitation—that make complex ideas feel graspable, invitational, and worth caring about.",
      Navigator:
        "As a Navigator, I help teams move through ambiguity and transition—holding both strategy and feelings as we chart a course that people can actually survive and sustain.",
    };

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const role = chip.getAttribute("data-role-chip") || "";

        chips.forEach((c) => c.classList.remove("chip-active"));
        chip.classList.add("chip-active");

        if (roleCopy[role]) {
          roleNote.textContent = roleCopy[role];
        }
      });
    });
  }

  // ======================
  // CURSOR LANTERN GLOW
  // ======================
  const cursorGlow = document.querySelector(".cursor-glow");

  if (cursorGlow) {
    if (prefersReducedMotion) {
      cursorGlow.style.display = "none";
    } else {
      const moveGlow = (event) => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
      };

      document.addEventListener("pointermove", moveGlow);

      document.addEventListener("pointerenter", () => {
        cursorGlow.style.opacity = "0.5";
      });

      document.addEventListener("pointerleave", () => {
        cursorGlow.style.opacity = "0";
      });
    }
  }

  // ======================
  // NIGHT-SKY DIAGRAM (CANVAS)
  // ======================
  const canvas = document.getElementById("skills-canvas");
  const tooltip = document.getElementById("orbit-tooltip");

  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Nodes in normalized coords (0–1)
    const nodes = [
      { x: 0.24, y: 0.32, r: 9, label: "Strategy & Portfolio" },
      { x: 0.66, y: 0.28, r: 9, label: "Research & Evaluation" },
      { x: 0.32, y: 0.7, r: 9, label: "Facilitation & Convening" },
      { x: 0.76, y: 0.64, r: 9, label: "Science Communication" },
      { x: 0.49, y: 0.5, r: 7, label: "Equity & Justice Lens" },
      { x: 0.17, y: 0.54, r: 6, label: "Network Design" },
      { x: 0.84, y: 0.42, r: 6, label: "Product & UX Thinking" },
    ];

    const edges = [
      [0, 1],
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
      [0, 2],
      [1, 3],
      [2, 5],
      [3, 6],
    ];

    let stars = [];
    let hoveredIndex = null;

    function generateStars(width, height, count) {
      const list = [];
      for (let i = 0; i < count; i++) {
        list.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.2,
          alpha: 0.4 + Math.random() * 0.6,
        });
      }
      return list;
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = generateStars(rect.width, rect.height, 80);
      drawSky();
    }

    function drawSky(highlightIndex) {
      const rect = canvas.getBoundingClientRect();

      // Background gradient
      const gradient = ctx.createRadialGradient(
        rect.width * 0.5,
        rect.height * 0.3,
        10,
        rect.width * 0.5,
        rect.height * 0.5,
        rect.width * 0.7
      );
      gradient.addColorStop(0, "#0b1120");
      gradient.addColorStop(1, "#020617");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Stars (stable positions)
      stars.forEach((star) => {
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = "#e5e7eb";
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Edges
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(148, 163, 184, 0.55)";
      edges.forEach(([from, to]) => {
        const a = nodes[from];
        const b = nodes[to];
        ctx.beginPath();
        ctx.moveTo(a.x * rect.width, a.y * rect.height);
        ctx.lineTo(b.x * rect.width, b.y * rect.height);
        ctx.stroke();
      });

      // Nodes
      nodes.forEach((node, index) => {
        const x = node.x * rect.width;
        const y = node.y * rect.height;
        const radius = node.r;

        // Halo
        const haloGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.4);
        haloGradient.addColorStop(0, "rgba(254, 243, 199, 0.7)");
        haloGradient.addColorStop(1, "rgba(250, 204, 21, 0)");
        ctx.fillStyle = haloGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * 2.4, 0, Math.PI * 2);
        ctx.fill();

        // Core
        const coreGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        coreGradient.addColorStop(0, "#fef3c7");
        coreGradient.addColorStop(1, "#22c55e");
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Highlight ring
        if (highlightIndex === index) {
          ctx.save();
          ctx.lineWidth = 2;
          ctx.strokeStyle = "rgba(248, 250, 252, 0.95)";
          ctx.beginPath();
          ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      });
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Hover / tooltip
    function handlePointerMove(event) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      let foundIndex = null;

      nodes.forEach((node, index) => {
        const nx = node.x * rect.width;
        const ny = node.y * rect.height;
        const distance = Math.hypot(x - nx, y - ny);
        if (distance <= node.r + 8) {
          foundIndex = index;
        }
      });

      if (foundIndex !== hoveredIndex) {
        hoveredIndex = foundIndex;
        drawSky(hoveredIndex);

        if (hoveredIndex != null && tooltip) {
          const node = nodes[hoveredIndex];
          tooltip.textContent = node.label;
          tooltip.hidden = false;

          // Tooltip is absolutely positioned within .diagram-frame
          // so we use local coordinates relative to the canvas.
          tooltip.style.left = `${x}px`;
          tooltip.style.top = `${y}px`;

          // Give screen readers a chance to hear updates
          tooltip.setAttribute("aria-live", "polite");
        } else if (tooltip) {
          tooltip.hidden = true;
        }
      }
    }

    function handlePointerLeave() {
      hoveredIndex = null;
      if (tooltip) tooltip.hidden = true;
      drawSky(null);
    }

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    drawSky(null);
  }

  // ======================
  // SMALL INTERACTIONS – PARALLAX
  // ======================
  if (!prefersReducedMotion) {
    const heroFrame = document.querySelector(".hero-illustration-frame");
    if (heroFrame) {
      const maxTranslate = 8; // px

      const handleParallax = (event) => {
        const rect = heroFrame.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;

        heroFrame.style.transform = `translate(${relX * maxTranslate}px, ${
          relY * maxTranslate
        }px)`;
      };

      heroFrame.addEventListener("pointermove", handleParallax);
      heroFrame.addEventListener("pointerleave", () => {
        heroFrame.style.transform = "translate(0, 0)";
      });
    }
  }
});

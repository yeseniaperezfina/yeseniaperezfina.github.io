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
    yearSpan.textContent = new Date().getFullYear();
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

    // Close nav when a link is clicked (helpful on mobile)
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navList.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ======================
  // SCROLL SPY (ACTIVE NAV LINK)
  // ======================
  const sections = Array.from(
    document.querySelectorAll("main section[id]")
  ) as HTMLElement[];

  if (sections.length && navLinks.length) {
    const navMap = new Map<string, HTMLAnchorElement>();
    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      navMap.set(href.slice(1), link as HTMLAnchorElement);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          const link = navMap.get(id);
          if (!link) return;

          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.setAttribute("data-active", "false"));
            link.setAttribute("data-active", "true");

            // Optional: update data-scene based on section
            const htmlEl = document.documentElement;
            if (htmlEl) {
              if (id === "about" || id === "trajectory") {
                htmlEl.setAttribute("data-scene", "study");
              } else if (id === "practice" || id === "writing") {
                htmlEl.setAttribute("data-scene", "nook");
              } else if (id === "capabilities" || id === "contact") {
                htmlEl.setAttribute("data-scene", "observatory");
              }
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
  const chips = document.querySelectorAll<HTMLButtonElement>("[data-role-chip]");
  const roleNote = document.getElementById("role-note");

  if (chips.length && roleNote) {
    const roleCopy: Record<string, string> = {
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
  const cursorGlow = document.querySelector<HTMLDivElement>(".cursor-glow");

  if (cursorGlow) {
    if (prefersReducedMotion) {
      // Respect reduced motion preference
      cursorGlow.style.display = "none";
    } else {
      const moveGlow = (event: PointerEvent) => {
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
  const canvas = document.getElementById("skills-canvas") as HTMLCanvasElement | null;
  const tooltip = document.getElementById("orbit-tooltip") as HTMLDivElement | null;

  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Nodes positioned in normalized coordinates (0–1)
    type Node = {
      x: number;
      y: number;
      r: number;
      label: string;
    };

    const nodes: Node[] = [
      { x: 0.24, y: 0.32, r: 9, label: "Strategy & Portfolio" },
      { x: 0.66, y: 0.28, r: 9, label: "Research & Evaluation" },
      { x: 0.32, y: 0.7, r: 9, label: "Facilitation & Convening" },
      { x: 0.76, y: 0.64, r: 9, label: "Science Communication" },
      { x: 0.49, y: 0.5, r: 7, label: "Equity & Justice Lens" },
      { x: 0.17, y: 0.54, r: 6, label: "Network Design" },
      { x: 0.84, y: 0.42, r: 6, label: "Product & UX Thinking" },
    ];

    const edges: [number, number][] = [
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

    let animationFrameId: number | null = null;
    let devicePixelRatioCached = window.devicePixelRatio || 1;

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      devicePixelRatioCached = dpr;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawStaticSky();
    }

    function drawStaticSky() {
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

      // Stars (simple sprinkled points)
      const starCount = 80;
      ctx.fillStyle = "#e5e7eb";
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        const size = Math.random() * 1.2;
        ctx.globalAlpha = 0.4 + Math.random() * 0.6;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Draw edges (constellation lines)
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

      // Draw nodes
      nodes.forEach((node) => {
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
      });
    }

    function scheduleRedraw() {
      if (animationFrameId != null) {
        cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = requestAnimationFrame(drawStaticSky);
    }

    resizeCanvas();
    window.addEventListener("resize", () => {
      // Throttle via requestAnimationFrame
      resizeCanvas();
      if (!prefersReducedMotion) {
        scheduleRedraw();
      }
    });

    // Hover / tooltip
    let hoveredIndex: number | null = null;

    function handlePointerMove(event: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      let foundIndex: number | null = null;

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
        drawStaticSky(); // refresh to clear any subtle highlight

        if (hoveredIndex != null && tooltip) {
          const node = nodes[hoveredIndex];

          // Light highlight ring
          ctx.save();
          ctx.lineWidth = 2;
          ctx.strokeStyle = "rgba(248, 250, 252, 0.9)";
          ctx.beginPath();
          ctx.arc(node.x * rect.width, node.y * rect.height, node.r + 3, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          tooltip.textContent = node.label;
          tooltip.hidden = false;
          tooltip.style.left = `${rect.left + x}px`;
          tooltip.style.top = `${rect.top + y}px`;
        } else if (tooltip) {
          tooltip.hidden = true;
        }
      }
    }

    function handlePointerLeave() {
      hoveredIndex = null;
      tooltip && (tooltip.hidden = true);
      drawStaticSky();
    }

    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);

    if (prefersReducedMotion) {
      // No extra animation; just redraw once
      drawStaticSky();
    } else {
      drawStaticSky();
    }
  }

  // ======================
  // SMALL INTERACTIONS (OPTIONAL)
  // ======================

  if (!prefersReducedMotion) {
    // Slight parallax on the framed hero illustration
    const heroFrame = document.querySelector<HTMLDivElement>(
      ".hero-illustration-frame"
    );
    if (heroFrame) {
      const handleParallax = (event: MouseEvent) => {
        const rect = heroFrame.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;
        const maxTranslate = 8; // px

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

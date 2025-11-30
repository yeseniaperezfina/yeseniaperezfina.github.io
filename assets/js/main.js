// ======================
// UTILITIES
// ======================
function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

// ======================
// YEAR STAMP
// ======================
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// ======================
// ROLE CHIPS → ROLE NOTE (bookshelf)
// ======================
document.addEventListener("DOMContentLoaded", () => {
  const chips = document.querySelectorAll("[data-role-chip]");
  const roleNote = document.getElementById("role-note");

  if (!chips.length || !roleNote) return;

  const copy = {
    Strategist:
      "As a Strategist, I design portfolios, initiatives, and learning environments that connect mission, data, and lived experience—helping teams see the system, not just the project.",
    Scholar:
      "As a Scholar, I draw from higher education research, learning sciences, and organizational theory to make design choices that are both rigorous and humane.",
    Creator:
      "As a Creator, I translate complex science and systems work into visuals and narratives—including The Echo Jar—that feel accessible, grounded, and worth caring about.",
    Navigator:
      "As a Navigator, I help teams move through ambiguity with clarity and care, holding timelines and people so that change work is brave but not reckless."
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("chip--active"));
      chip.classList.add("chip--active");

      const role = chip.getAttribute("data-role-chip");
      if (role && copy[role]) {
        roleNote.innerHTML = copy[role].replace(
          /^As a /,
          () => `As a <strong>${role}</strong>, `
        );
      }
    });
  });
});

// ======================
// SCROLL SPY + SECTION REVEAL + SCENE THEMING
// ======================
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("[data-section]");
  const navLinks = document.querySelectorAll(".nav-link");

  const linkMap = {};
  navLinks.forEach((link) => {
    const id = link.getAttribute("href").replace("#", "");
    linkMap[id] = link;
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;

        if (entry.isIntersecting && id && linkMap[id]) {
          navLinks.forEach((l) => l.classList.remove("is-active"));
          linkMap[id].classList.add("is-active");
        }

        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");

          const scene = entry.target.getAttribute("data-scene");
          if (scene) {
            document.documentElement.setAttribute("data-scene", scene);
          }
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => sectionObserver.observe(section));
});

// ======================
// ROOT COLUMN PROGRESSION
// ======================
document.addEventListener("DOMContentLoaded", () => {
  const rootEl = document.documentElement;

  function updateRootProgress() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? clamp01(scrollTop / docHeight) : 0;
    rootEl.style.setProperty("--root-progress", progress.toString());
  }

  updateRootProgress();
  window.addEventListener("scroll", updateRootProgress);
  window.addEventListener("resize", updateRootProgress);
});

// ======================
// WALL PARALLAX (back & front layers)
// ======================
document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const back = document.querySelector(".forest-canopy-layer--back");
  const front = document.querySelector(".forest-canopy-layer--front");

  if (!back || !front) return;

  function handleScroll() {
    const scrollTop = window.scrollY || window.pageYOffset;

    const maxOffset = 80;
    const offsetBack = scrollTop * 0.02;
    const offsetFront = scrollTop * 0.05;

    back.style.transform = `translateY(${Math.min(offsetBack, maxOffset)}px)`;
    front.style.transform = `translateY(${Math.min(offsetFront, maxOffset)}px)`;
  }

  handleScroll();
  if (!prefersReduced) {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
  }
});

// ======================
// DUST MOTES / FIREFLIES (library dust + glows)
// ======================
(function pollenAndFireflies() {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canvas = document.getElementById("particleCanvas");
  if (!canvas || !canvas.getContext || prefersReduced) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;

  const pollen = [];
  const fireflies = [];
  const POLLEN_COUNT = 80;
  const FIREFLY_COUNT = 12;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function init() {
    pollen.length = 0;
    fireflies.length = 0;

    for (let i = 0; i < POLLEN_COUNT; i++) {
      pollen.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: 0.02 + Math.random() * 0.08,
        vx: (Math.random() - 0.5) * 0.04,
        size: 0.6 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2
      });
    }

    for (let i = 0; i < FIREFLY_COUNT; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.7,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        phase: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.01
      });
    }
  }

  function step(ts) {
    ctx.clearRect(0, 0, width, height);

    // Dust motes
    ctx.save();
    for (const p of pollen) {
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.phase + ts * 0.00008) * 0.06;

      if (p.y > height) p.y = -10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const alpha = 0.05 + Math.abs(Math.sin(p.phase + ts * 0.0002)) * 0.06;
      ctx.fillStyle = `rgba(248, 236, 218, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Firefly glows (lamp echoes)
    ctx.save();
    for (const f of fireflies) {
      f.x += f.vx;
      f.y += f.vy;
      f.phase += f.speed;

      if (f.x < -20) f.x = width + 20;
      if (f.x > width + 20) f.x = -20;
      if (f.y < 0) f.y = height * 0.3;
      if (f.y > height) f.y = 0;

      const alpha = 0.04 + Math.abs(Math.sin(f.phase)) * 0.45;

      const radius = 2.4;
      const gradient = ctx.createRadialGradient(
        f.x,
        f.y,
        0,
        f.x,
        f.y,
        radius * 5
      );
      gradient.addColorStop(0, `rgba(243, 201, 139, ${alpha})`);
      gradient.addColorStop(0.4, `rgba(54, 168, 109, ${alpha * 0.7})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(f.x, f.y, radius * 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 248, 230, ${alpha})`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    requestAnimationFrame(step);
  }

  resize();
  init();
  window.addEventListener("resize", () => {
    resize();
    init();
  });
  requestAnimationFrame(step);
})();

// ======================
// CONSTELLATION / MYCELIUM NETWORK + ORBIT TOOLTIP
// ======================
(function forestNetwork() {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canvas = document.getElementById("forestNetwork");
  if (!canvas || !canvas.getContext || prefersReduced) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;

  let nodes = [];
  const NODE_COUNT = 70;
  const BASE_MAX_DIST = 130;

  const ORBIT_POINT_COUNT = 8;
  let orbitPoints = [];
  let orbitCenter = { x: 0, y: 0 };
  let orbitRadius = 0;

  // Tooltip DOM element
  const tooltipEl = document.createElement("div");
  tooltipEl.className = "orbit-tooltip";
  tooltipEl.setAttribute("role", "status");
  tooltipEl.style.opacity = "0";

  const parent = canvas.parentElement || document.body;
  if (parent && getComputedStyle(parent).position === "static") {
    parent.style.position = "relative";
  }
  parent.appendChild(tooltipEl);

  // Labels for orbit points
  const ORBIT_LABELS = [
    "Research",
    "Practice",
    "Partnerships",
    "Systems",
    "Story",
    "Equity",
    "Community",
    "Leadership"
  ];

  let scrollFactor = 0;
  let focusFactor = 0;
  let mouseX = null;
  let mouseY = null;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width || 400;
    height = rect.height || 260;
    const ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    orbitCenter.x = width * 0.5;
    orbitCenter.y = height * 0.4;
    orbitRadius = Math.min(width, height) * 0.32;

    initNodes();
    initOrbitPoints();
  }

  function initNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        size: 0.9 + Math.random() * 1.4
      });
    }
  }

  function initOrbitPoints() {
    orbitPoints = [];
    for (let i = 0; i < ORBIT_POINT_COUNT; i++) {
      orbitPoints.push({
        angle: (Math.PI * 2 * i) / ORBIT_POINT_COUNT,
        radius: orbitRadius * (0.8 + Math.random() * 0.15),
        speed:
          (0.0006 + Math.random() * 0.0008) *
          (Math.random() < 0.5 ? 1 : -1),
        label: ORBIT_LABELS[i] || `Node ${i + 1}`
      });
    }
  }

  function updateScrollFactors() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    scrollFactor = docHeight > 0 ? clamp01(scrollTop / docHeight) : 0;

    const rect = canvas.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    const visible =
      Math.min(rect.bottom, viewHeight) - Math.max(rect.top, 0);
    const ratio = clamp01(visible / rect.height);
    focusFactor = ratio;
  }

  window.addEventListener("scroll", updateScrollFactors);
  window.addEventListener("resize", () => {
    resize();
    updateScrollFactors();
  });

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;

    // Tooltip logic: find nearest orbit point
    let nearest = null;
    let nearestDist = Infinity;
    orbitPoints.forEach((op) => {
      const px = orbitCenter.x + Math.cos(op.angle) * op.radius;
      const py = orbitCenter.y + Math.sin(op.angle) * op.radius;
      const dx = mouseX - px;
      const dy = mouseY - py;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = { op, px, py };
      }
    });

    const HOVER_RADIUS = 26;
    if (nearest && nearestDist < HOVER_RADIUS) {
      tooltipEl.textContent = nearest.op.label;
      const parentRect = parent.getBoundingClientRect();
      const tooltipX = event.clientX - parentRect.left + 10;
      const tooltipY = event.clientY - parentRect.top - 12;
      tooltipEl.style.left = `${tooltipX}px`;
      tooltipEl.style.top = `${tooltipY}px`;
      tooltipEl.style.opacity = focusFactor > 0.1 ? "1" : "0";
      tooltipEl.style.transform = "translate3d(0, 0, 0)";
    } else {
      tooltipEl.style.opacity = "0";
    }
  });

  canvas.addEventListener("pointerleave", () => {
    mouseX = null;
    mouseY = null;
    tooltipEl.style.opacity = "0";
  });

  function step() {
    ctx.clearRect(0, 0, width, height);

    // Background gradient: star chart
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, "rgba(12, 19, 38, 1)");
    skyGrad.addColorStop(0.5, "rgba(11, 18, 35, 1)");
    skyGrad.addColorStop(1, "rgba(7, 9, 20, 1)");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Constellation stars at top
    const starAlpha = 0.6 * (1 - scrollFactor);
    if (starAlpha > 0.02) {
      ctx.save();
      const starCount = 28;
      ctx.fillStyle = `rgba(253, 244, 230, ${0.5 * starAlpha})`;
      for (let i = 0; i < starCount; i++) {
        const x = (i * 71) % width;
        const y = (i * 23) % (height * 0.35);
        ctx.beginPath();
        ctx.arc(x, y, 0.8 + (i % 3) * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Underlay lines hinting at mycelium
    ctx.save();
    ctx.strokeStyle = "rgba(45, 64, 95, 0.9)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const x = (width / 6) * i + (i % 2 === 0 ? 10 : -5);
      ctx.beginPath();
      ctx.moveTo(x, height * 0.45);
      ctx.lineTo(x + (Math.random() - 0.5) * 20, height);
      ctx.stroke();
    }
    ctx.restore();

    // ---- ORBITING POINTS LAYER (behind mycelium) ----
    ctx.save();
    const orbitAlpha = 0.18 + 0.25 * focusFactor;

    ctx.strokeStyle = `rgba(177, 170, 232, ${orbitAlpha * 0.5})`;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.arc(orbitCenter.x, orbitCenter.y, orbitRadius, 0, Math.PI * 2);
    ctx.stroke();

    orbitPoints.forEach((op) => {
      op.angle += op.speed;

      const px = orbitCenter.x + Math.cos(op.angle) * op.radius;
      const py = orbitCenter.y + Math.sin(op.angle) * op.radius;

      const pulse =
        0.4 + 0.6 * Math.abs(Math.sin(op.angle * 1.5 + scrollFactor * 4));

      const grad = ctx.createRadialGradient(px, py, 0, px, py, 8);
      grad.addColorStop(0, `rgba(246,212,147,${orbitAlpha * pulse})`);
      grad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 244, 230, ${orbitAlpha * (0.6 + pulse * 0.3)})`;
      ctx.beginPath();
      ctx.arc(px, py, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
    // ---- end orbit layer ----

    // Node dynamics
    const ROOT_PULL = 0.02 + focusFactor * 0.05;
    const maxDist = BASE_MAX_DIST + focusFactor * 40;

    nodes.forEach((n) => {
      const cx = width * 0.5;
      const cy = height * (0.45 + focusFactor * 0.15);

      n.vx += (cx - n.x) * ROOT_PULL * 0.0006;
      n.vy += (cy - n.y) * ROOT_PULL * 0.0006;

      if (mouseX != null && mouseY != null) {
        const dx = mouseX - n.x;
        const dy = mouseY - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = 0.03 * focusFactor;
        n.vx += (dx / dist) * force * 0.02;
        n.vy += (dy / dist) * force * 0.02;
      }

      n.x += n.vx;
      n.y += n.vy;

      if (n.x < -30) n.x = width + 30;
      if (n.x > width + 30) n.x = -30;
      if (n.y < -30) n.y = height + 30;
      if (n.y > height + 30) n.y = -30;
    });

    // Mycelium connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * (0.6 + focusFactor * 0.4);
          ctx.strokeStyle = `rgba(191, 173, 144, ${alpha * 0.6})`;
          ctx.lineWidth = 0.6 + focusFactor * 0.6;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    nodes.forEach((n) => {
      const grad = ctx.createRadialGradient(
        n.x,
        n.y,
        0,
        n.x,
        n.y,
        n.size * 3.5
      );
      grad.addColorStop(0, "rgba(253, 216, 167, 0.9)");
      grad.addColorStop(0.45, "rgba(126, 155, 140, 0.6)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size * 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 244, 230, 0.9)";
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(step);
  }

  resize();
  updateScrollFactors();
  requestAnimationFrame(step);
})();

// ======================
// WRITING SECTION — CAT CAMEO
// ======================
document.addEventListener("DOMContentLoaded", () => {
  const writingSection = document.getElementById("writing");
  if (!writingSection) return;

  const cat = document.createElement("div");
  cat.className = "cat-cameo";
  cat.setAttribute("aria-hidden", "true");

  const inner = document.createElement("div");
  inner.className = "cat-cameo__inner";
  cat.appendChild(inner);

  document.body.appendChild(cat);

  // Occasional automatic peek if in viewport
  let lastPeek = 0;
  function maybePeek() {
    const now = Date.now();
    if (now - lastPeek < 20000) return;

    const rect = writingSection.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;

    lastPeek = now;
    cat.classList.add("cat-cameo--peek");
    setTimeout(() => {
      cat.classList.remove("cat-cameo--peek");
    }, 3800);
  }

  window.addEventListener("scroll", () => {
    window.requestAnimationFrame(maybePeek);
  });
});

// ======================
// CURSOR LANTERN GLOW
// ======================
document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) return;

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  glow.setAttribute("aria-hidden", "true");
  document.body.appendChild(glow);

  let visible = false;

  window.addEventListener("pointermove", (event) => {
    const x = event.clientX;
    const y = event.clientY;

    glow.style.transform = `translate3d(${x - 80}px, ${y - 80}px, 0)`;

    if (!visible) {
      visible = true;
      glow.style.opacity = "0.65";
    }
  });

  window.addEventListener("pointerleave", () => {
    visible = false;
    glow.style.opacity = "0";
  });
});

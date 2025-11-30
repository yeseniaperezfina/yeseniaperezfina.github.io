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
// ROLE CHIPS → ROLE NOTE
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
          (match) => `As a <strong>${role}</strong>, `
        );
      }
    });
  });
});

// ======================
// SCROLL SPY (.nav-link) + SECTION REVEAL (.section-visible)
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
        }
      });
    },
    {
      threshold: 0.4
    }
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
// FOREST CANOPY PARALLAX + LIGHT BEAM SHIFT
// ======================
document.addEventListener("DOMContentLoaded", () => {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const back = document.querySelector(".forest-canopy-layer--back");
  const front = document.querySelector(".forest-canopy-layer--front");
  const rootEl = document.documentElement;

  if (!back || !front) return;

  function handleScroll() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? clamp01(scrollTop / docHeight) : 0;

    // parallax offsets
    const maxOffset = 120;
    const offsetBack = scrollTop * 0.04;
    const offsetFront = scrollTop * 0.08;

    back.style.transform = `translateY(${Math.min(offsetBack, maxOffset)}px)`;
    front.style.transform = `translateY(${Math.min(offsetFront, maxOffset)}px)`;

    // light beams shift + angle (softly changing with scroll)
    const beamShift = (Math.sin(progress * Math.PI * 1.3) * 40).toFixed(2) + "px";
    const beamAngle = 120 + progress * 40; // 120deg → 160deg
    rootEl.style.setProperty("--beam-shift", beamShift);
    rootEl.style.setProperty("--beam-angle", `${beamAngle}deg`);
  }

  handleScroll();
  if (!prefersReduced) {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
  }
});

// ======================
// POLLEN / DUST + FIREFLIES
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
  const POLLEN_COUNT = 90;
  const FIREFLY_COUNT = 18;

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
        vy: 0.05 + Math.random() * 0.12,
        vx: (Math.random() - 0.5) * 0.05,
        size: 0.8 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2
      });
    }

    for (let i = 0; i < FIREFLY_COUNT; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.6,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        phase: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.01
      });
    }
  }

  function step(ts) {
    ctx.clearRect(0, 0, width, height);

    // Pollen / dust motes
    ctx.save();
    for (const p of pollen) {
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.phase + ts * 0.00008) * 0.08;

      if (p.y > height) p.y = -10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const alpha = 0.08 + Math.abs(Math.sin(p.phase + ts * 0.0002)) * 0.07;
      ctx.fillStyle = `rgba(253, 216, 167, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Fireflies (soft pulse)
    ctx.save();
    for (const f of fireflies) {
      f.x += f.vx;
      f.y += f.vy;
      f.phase += f.speed;

      if (f.x < -20) f.x = width + 20;
      if (f.x > width + 20) f.x = -20;
      if (f.y < 0) f.y = height * 0.4;
      if (f.y > height * 0.7) f.y = 20;

      const alpha = 0.05 + Math.abs(Math.sin(f.phase)) * 0.45;

      const radius = 2.5;
      const gradient = ctx.createRadialGradient(
        f.x,
        f.y,
        0,
        f.x,
        f.y,
        radius * 5
      );
      // mossy + moonlit mix
      gradient.addColorStop(0, `rgba(253, 216, 167, ${alpha})`);
      gradient.addColorStop(0.4, `rgba(126, 155, 140, ${alpha * 0.7})`);
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(f.x, f.y, radius * 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 244, 230, ${alpha})`;
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
// FOREST MYCELIUM / CONSTELLATION NETWORK
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

  let scrollFactor = 0; // 0 = top of page, 1 = bottom
  let focusFactor = 0;  // 0 = section off-screen, 1 = fully visible
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

    initNodes();
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
  });
  canvas.addEventListener("pointerleave", () => {
    mouseX = null;
    mouseY = null;
  });

  function step() {
    ctx.clearRect(0, 0, width, height);

    // Background: top sky (constellation) fades → lower forest (mycelium)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, "rgba(8,14,24,1)");
    skyGrad.addColorStop(0.45, "rgba(5,10,16,1)");
    skyGrad.addColorStop(1, "rgba(6,13,11,1)");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Constellation stars fade as scrollFactor increases (cosmos → roots)
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

    // Subtle downward root hints at bottom
    ctx.save();
    ctx.strokeStyle = "rgba(33, 61, 50, 0.8)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const x = (width / 6) * i + (i % 2 === 0 ? 10 : -5);
      ctx.beginPath();
      ctx.moveTo(x, height * 0.45);
      ctx.lineTo(x + (Math.random() - 0.5) * 20, height);
      ctx.stroke();
    }
    ctx.restore();

    // Node dynamics
    const ROOT_PULL = 0.02 + focusFactor * 0.05; // stronger clustering in view
    const maxDist = BASE_MAX_DIST + focusFactor * 40;

    for (const n of nodes) {
      const cx = width * 0.5;
      const cy = height * (0.45 + focusFactor * 0.15);

      // gentle pull toward center (mycelium center)
      n.vx += (cx - n.x) * ROOT_PULL * 0.0006;
      n.vy += (cy - n.y) * ROOT_PULL * 0.0006;

      // pointer attraction (brain synapse / mycelium responsiveness)
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

      // wrap
      if (n.x < -30) n.x = width + 30;
      if (n.x > width + 30) n.x = -30;
      if (n.y < -30) n.y = height + 30;
      if (n.y > height + 30) n.y = -30;
    }

    // Connections (mycelium threads), thicker/more luminous as section is focused
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * (0.6 + focusFactor * 0.4);
          // blend of mossy + moonlit
          ctx.strokeStyle = `rgba(191, 173, 144, ${alpha * 0.6})`;
          ctx.lineWidth = 0.6 + focusFactor * 0.6;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }
    }

    // Nodes (soft pulses)
    for (const n of nodes) {
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
    }

    requestAnimationFrame(step);
  }

  resize();
  updateScrollFactors();
  requestAnimationFrame(step);
})();

// ======================
// FOREST AUDIO TOGGLE
// ======================
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("forestAudio");
  const toggle = document.getElementById("forestSoundToggle");
  if (!audio || !toggle) return;

  let playing = false;
  const label = toggle.querySelector(".sound-toggle__label");

  toggle.addEventListener("click", () => {
    if (!playing) {
      audio
        .play()
        .then(() => {
          playing = true;
          if (label) label.textContent = "Forest on";
        })
        .catch(() => {
          // autoplay block; do nothing
        });
    } else {
      audio.pause();
      playing = false;
      if (label) label.textContent = "Forest off";
    }
  });
});

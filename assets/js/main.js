// ======================
// UTILITIES
// ======================
function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function prefersReducedMotion() {
  return (
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function isCalmMode() {
  return document.body?.dataset?.mode === 'calm';
}

function dispatchModeChange(mode) {
  window.dispatchEvent(new CustomEvent('modechange', { detail: { mode } }));
}

// ======================
// INIT ORCHESTRATION
// ======================
document.addEventListener('DOMContentLoaded', init);

function init() {
  initYearStamp();
  initModeToggle();
  initRoleChips();
  initScrollSpy();
  initSectionReveal();
  initRootProgress();
  initForestParallax();
  initPollenAndFireflies();
  initForestNetwork();
}

// ======================
// YEAR STAMP
// ======================
function initYearStamp() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

// ======================
// MODE TOGGLE (FOREST / CALM)
// ======================
function initModeToggle() {
  const body = document.body;
  const toggle = document.getElementById('modeToggle');
  if (!body || !toggle) return;

  const label = toggle.querySelector('.mode-toggle__label');
  const storageKey = 'yesenia-site-mode';

  function applyMode(mode) {
    const safeMode = mode === 'calm' ? 'calm' : 'forest';
    body.dataset.mode = safeMode;

    const isCalm = safeMode === 'calm';
    toggle.setAttribute('aria-pressed', String(isCalm));
    if (label) label.textContent = isCalm ? 'Calm mode' : 'Forest mode';

    try {
      window.localStorage.setItem(storageKey, safeMode);
    } catch (_) {}

    dispatchModeChange(safeMode);
  }

  // initialize from storage
  let stored = null;
  try {
    stored = window.localStorage.getItem(storageKey);
  } catch (_) {}
  applyMode(stored === 'calm' ? 'calm' : 'forest');

  toggle.addEventListener('click', () => {
    applyMode(body.dataset.mode === 'calm' ? 'forest' : 'calm');
  });
}

// ======================
// ROLE CHIPS → ROLE NOTE
// ======================
function initRoleChips() {
  const chips = document.querySelectorAll('[data-role-chip]');
  const roleNote = document.getElementById('role-note');
  if (!chips.length || !roleNote) return;

  const copy = {
    Strategist:
      'As a Strategist, I design portfolios, initiatives, and learning environments that connect mission, data, and lived experience—helping teams see the system, not just the project.',
    Scholar:
      'As a Scholar, I draw from higher education research, learning sciences, and organizational theory to make design choices that are both rigorous and humane.',
    Creator:
      'As a Creator, I translate complex science and systems work into visuals and narratives—including The Echo Jar—that feel accessible, grounded, and worth caring about.',
    Navigator:
      'As a Navigator, I help teams move through ambiguity with clarity and care, holding timelines and people so that change work is brave but not reckless.'
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('chip--active'));
      chip.classList.add('chip--active');

      const role = chip.getAttribute('data-role-chip');
      if (role && copy[role]) {
        roleNote.innerHTML = copy[role].replace(
          /^As a /,
          () => `As a <strong>${role}</strong>, `
        );
      }
    });
  });
}

// ======================
// SCROLL SPY (.nav-link) + ARIA CURRENT
// ======================
function initScrollSpy() {
  const sections = document.querySelectorAll('[data-section]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const linkMap = {};
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('#')) linkMap[href.slice(1)] = link;
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        if (!id || !linkMap[id]) return;

        navLinks.forEach(l => {
          l.classList.remove('is-active');
          l.removeAttribute('aria-current');
        });

        const active = linkMap[id];
        active.classList.add('is-active');
        active.setAttribute('aria-current', 'page');
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach(section => observer.observe(section));
}

// ======================
// SECTION REVEAL (.section-visible)
// ======================
function initSectionReveal() {
  const sections = document.querySelectorAll('.section[data-section]');
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('section-visible');
      });
    },
    { threshold: 0.18 }
  );

  sections.forEach(s => observer.observe(s));
}

// ======================
// ROOT COLUMN PROGRESSION
// ======================
function initRootProgress() {
  const rootEl = document.documentElement;

  function update() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? clamp01(scrollTop / docHeight) : 0;
    rootEl.style.setProperty('--root-progress', progress.toString());
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

// ======================
// FOREST CANOPY PARALLAX (Forest only)
// ======================
function initForestParallax() {
  if (prefersReducedMotion()) return;

  const back = document.querySelector('.forest-canopy-layer--back');
  const front = document.querySelector('.forest-canopy-layer--front');
  if (!back || !front) return;

  function applyTransforms(scrollTop) {
    const maxOffset = 120;
    const offsetBack = Math.min(scrollTop * 0.04, maxOffset);
    const offsetFront = Math.min(scrollTop * 0.08, maxOffset);
    back.style.transform = `translateY(${offsetBack}px)`;
    front.style.transform = `translateY(${offsetFront}px)`;
  }

  function resetTransforms() {
    back.style.transform = 'translateY(0px)';
    front.style.transform = 'translateY(0px)';
  }

  function onScroll() {
    if (isCalmMode()) return resetTransforms();
    const scrollTop = window.scrollY || window.pageYOffset;
    applyTransforms(scrollTop);
  }

  // initial
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  window.addEventListener('modechange', () => {
    if (isCalmMode()) resetTransforms();
    else onScroll();
  });
}

// ======================
// POLLEN / DUST + FIREFLIES (Forest only; stops in Calm)
// ======================
function initPollenAndFireflies() {
  if (prefersReducedMotion()) return;

  const canvas = document.getElementById('particleCanvas');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let rafId = null;

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

  function initParticles() {
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

  function clear() {
    ctx.clearRect(0, 0, width, height);
  }

  function stop() {
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
    clear();
  }

  function step(ts) {
    // Safety: if mode switched to calm, stop
    if (isCalmMode()) {
      stop();
      return;
    }

    clear();

    // pollen (warm amber)
    ctx.save();
    for (const p of pollen) {
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.phase + ts * 0.00008) * 0.08;

      if (p.y > height) p.y = -10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const alpha = 0.06 + Math.abs(Math.sin(p.phase + ts * 0.0002)) * 0.06;
      ctx.fillStyle = `rgba(243, 195, 132, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // fireflies (pale core + teal halo)
    ctx.save();
    for (const f of fireflies) {
      f.x += f.vx;
      f.y += f.vy;
      f.phase += f.speed;

      if (f.x < -20) f.x = width + 20;
      if (f.x > width + 20) f.x = -20;
      if (f.y < 0) f.y = height * 0.4;
      if (f.y > height * 0.72) f.y = 20;

      const alpha = 0.05 + Math.abs(Math.sin(f.phase)) * 0.45;
      const radius = 2.5;

      const gradient = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, radius * 6);
      gradient.addColorStop(0, `rgba(255, 243, 210, ${alpha})`);
      gradient.addColorStop(0.35, `rgba(90, 175, 190, ${alpha * 0.55})`);
      gradient.addColorStop(1, 'rgba(10, 71, 99, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(f.x, f.y, radius * 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 252, 244, ${alpha})`;
      ctx.beginPath();
      ctx.arc(f.x, f.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    rafId = requestAnimationFrame(step);
  }

  function start() {
    if (prefersReducedMotion()) return;
    if (isCalmMode()) return;
    if (rafId != null) return;
    rafId = requestAnimationFrame(step);
  }

  resize();
  initParticles();
  start();

  window.addEventListener('resize', () => {
    resize();
    initParticles();
    if (!isCalmMode()) start();
  });

  window.addEventListener('modechange', () => {
    if (isCalmMode()) stop();
    else {
      initParticles();
      start();
    }
  });
}

// ======================
// FOREST MYCELIUM / CONSTELLATION NETWORK (PNW mycelium version)
// ======================
function initForestNetwork() {
  if (prefersReducedMotion()) return;

  const canvas = document.getElementById('forestNetwork');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let nodes = [];
  let rafId = null;

  const NODE_COUNT = 70;
  const BASE_MAX_DIST = 140;

  let scrollFactor = 0; // 0 = top of page, 1 = bottom
  let focusFactor = 0;  // 0 = section off-screen, 1 = fully in view
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
      const yMin = height * 0.3;
      const yMax = height * 1.05;
      nodes.push({
        x: Math.random() * width,
        y: yMin + Math.random() * (yMax - yMin),
        vx: (Math.random() - 0.5) * 0.14,
        vy: (Math.random() - 0.5) * 0.14,
        size: 0.9 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function updateScrollFactors() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    scrollFactor = docHeight > 0 ? clamp01(scrollTop / docHeight) : 0;

    const rect = canvas.getBoundingClientRect();
    const viewHeight = window.innerHeight;
    const visible = Math.min(rect.bottom, viewHeight) - Math.max(rect.top, 0);
    const ratio = rect.height > 0 ? clamp01(visible / rect.height) : 0;
    focusFactor = ratio;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clear() {
    ctx.clearRect(0, 0, width, height);
  }

  function stop() {
    if (rafId != null) cancelAnimationFrame(rafId);
    rafId = null;
    clear();
  }

  function step(ts) {
    if (isCalmMode()) {
      stop();
      return;
    }

    updateScrollFactors();
    clear();

    const time = ts || performance.now();

    // Background: PNW ocean → kelp floor
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, 'rgba(2,17,29,1)');    // ocean-deep
    skyGrad.addColorStop(0.42, 'rgba(6,50,74,1)'); // ocean-mid
    skyGrad.addColorStop(1, 'rgba(38,58,47,1)');   // deep-kelp
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // faint “surface shimmer”
    const shimmer = 0.18 + 0.12 * Math.sin(time * 0.00035);
    ctx.fillStyle = `rgba(10, 71, 99, ${shimmer})`;
    ctx.fillRect(0, 0, width, height * 0.22);

    // Node dynamics (medium motion, tied to focus)
    const ROOT_PULL = 0.02 + focusFactor * 0.035;
    const maxDist = BASE_MAX_DIST + focusFactor * 30;

    for (const n of nodes) {
      const cx = width * 0.5;
      const cy = height * (0.72 + focusFactor * 0.10);

      // pull toward lower-center “mat”
      n.vx += (cx - n.x) * ROOT_PULL * 0.0007;
      n.vy += (cy - n.y) * ROOT_PULL * 0.0009;

      // pointer attraction
      if (mouseX != null && mouseY != null) {
        const dx = mouseX - n.x;
        const dy = mouseY - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = 0.025 * focusFactor;
        n.vx += (dx / dist) * force * 0.04;
        n.vy += (dy / dist) * force * 0.04;
      }

      // damping
      n.vx *= 0.982;
      n.vy *= 0.982;

      n.x += n.vx;
      n.y += n.vy;

      // wrap
      if (n.x < -30) n.x = width + 30;
      if (n.x > width + 30) n.x = -30;
      if (n.y < -40) n.y = height * 0.4;
      if (n.y > height + 40) n.y = height * 0.4;
    }

    // Connections (mycelium threads)
    ctx.lineWidth = 0.9;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > maxDist) continue;

        // vertical bias → rooty branches
        const verticalBias = Math.abs(dy) / (Math.abs(dx) + 1);
        if (verticalBias < 0.4 && n1.y > height * 0.45 && n2.y > height * 0.45) {
          continue;
        }

        const midY = (n1.y + n2.y) * 0.5;
        const midX = (n1.x + n2.x) * 0.5;
        const tHeight = height > 0 ? clamp01(midY / height) : 0;

        // nutrient pulse
        const pulse = 0.55 + 0.45 * Math.sin(time * 0.00045 + midY * 0.01);

        let alpha = (1 - dist / maxDist) * (0.42 + focusFactor * 0.46);
        alpha *= pulse;

        // hover boost
        if (mouseX != null && mouseY != null) {
          const dmx = midX - mouseX;
          const dmy = midY - mouseY;
          const dMouse = Math.sqrt(dmx * dmx + dmy * dmy);
          const hoverRadius = Math.min(width, height) * 0.38;
          const hoverBoost = clamp01(1 - dMouse / hoverRadius);
          alpha *= 1 + hoverBoost * 0.55;
        }

        if (alpha < 0.02) continue;

        // Color blend: teal → amber by depth
        const r = lerp(70, 243, tHeight);
        const g = lerp(168, 195, tHeight);
        const b = lerp(200, 132, tHeight);
        ctx.strokeStyle = `rgba(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(0)}, ${alpha})`;

        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
      }
    }

    // Nodes (tips + glow)
    for (const n of nodes) {
      const nodePulse = 0.6 + 0.4 * Math.sin(time * 0.001 + n.phase);
      const outerRadius = n.size * 4;

      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, outerRadius);
      grad.addColorStop(0, `rgba(255, 243, 210, ${0.95 * nodePulse})`);
      grad.addColorStop(0.45, `rgba(90, 175, 190, ${0.55 * nodePulse})`);
      grad.addColorStop(1, `rgba(243, 195, 132, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, outerRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 252, 244, 0.9)`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
      ctx.fill();
    }

    rafId = requestAnimationFrame(step);
  }

  function start() {
    if (prefersReducedMotion()) return;
    if (isCalmMode()) return;
    if (rafId != null) return;
    rafId = requestAnimationFrame(step);
  }

  // events
  canvas.addEventListener('pointermove', event => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
  });

  canvas.addEventListener('pointerleave', () => {
    mouseX = null;
    mouseY = null;
  });

  window.addEventListener('resize', () => {
    resize();
    if (!isCalmMode()) start();
  });

  window.addEventListener('modechange', () => {
    if (isCalmMode()) stop();
    else {
      resize();
      start();
    }
  });

  // init
  resize();
  updateScrollFactors();
  start();
}

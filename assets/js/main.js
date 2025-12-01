// ======================
// UTILITIES
// ======================
function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

// ======================
// INIT ORCHESTRATION
// ======================
document.addEventListener('DOMContentLoaded', () => {
  initYearStamp();
  initModeToggle();
  initRoleChips();
  initScrollSpy();
  initRootProgress();
  initForestParallax();
  initPollenAndFireflies();
  initForestNetwork();
});

// Helper to know if we should keep things visually calm
function isCalmMode() {
  return document.body.dataset.mode === 'calm';
}

// ======================
// YEAR STAMP
// ======================
function initYearStamp() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// ======================
// MODE TOGGLE (FOREST / CALM)
// ======================
function initModeToggle() {
  const body = document.body;
  const toggle = document.getElementById('modeToggle');
  if (!body || !toggle) return;

  const label = toggle.querySelector('.mode-toggle__label');

  function applyMode(mode) {
    const isCalm = mode === 'calm';
    body.dataset.mode = isCalm ? 'calm' : 'forest';
    toggle.setAttribute('aria-pressed', String(isCalm));
    if (label) {
      label.textContent = isCalm ? 'Calm mode' : 'Forest mode';
    }
  }

  // Initialize from localStorage or default to "forest"
  const storedMode = window.localStorage
    ? window.localStorage.getItem('yesi-site-mode')
    : null;
  const initialMode = storedMode === 'calm' ? 'calm' : 'forest';
  applyMode(initialMode);

  toggle.addEventListener('click', () => {
    const nextMode = body.dataset.mode === 'calm' ? 'forest' : 'calm';
    applyMode(nextMode);
    if (window.localStorage) {
      window.localStorage.setItem('yesi-site-mode', nextMode);
    }
  });
}

// ======================
// ROLE CHIPS → ROLE NOTE (DRY / dynamic)
// ======================
function initRoleChips() {
  const container = document.getElementById('roleChips');
  const roleNote = document.getElementById('role-note');
  if (!container || !roleNote) return;

  const ROLES = [
    {
      key: 'Strategist',
      text: 'I design portfolios, initiatives, and learning environments that connect mission, data, and lived experience—helping teams see systems, not just projects.'
    },
    {
      key: 'Scholar',
      text: 'I draw from higher education research, learning sciences, and organizational theory to help teams make choices that are both rigorous and humane.'
    },
    {
      key: 'Creator',
      text: 'I translate complex science and systems work into visuals and narratives—including The Echo Jar—that feel accessible, grounded, and worth caring about.'
    },
    {
      key: 'Navigator',
      text: 'I guide teams through ambiguity with clarity and care, holding timelines and relationships so that change work is brave but not reckless.'
    }
  ];

  // Build chips
  ROLES.forEach((role, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip' + (index === 0 ? ' chip--active' : '');
    btn.setAttribute('data-role-chip', role.key);
    btn.textContent = role.key;

    btn.addEventListener('click', () => {
      container.querySelectorAll('.chip').forEach(c => c.classList.remove('chip--active'));
      btn.classList.add('chip--active');
      roleNote.innerHTML = `As a <strong>${role.key}</strong>, ${role.text}`;
    });

    container.appendChild(btn);
  });

  // Initialize the first one
  roleNote.innerHTML = `As a <strong>${ROLES[0].key}</strong>, ${ROLES[0].text}`;
}

// ======================
// SCROLL SPY (.nav-link) + SECTION REVEAL (.section-visible)
// ======================
function initScrollSpy() {
  const sections = document.querySelectorAll('[data-section]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const linkMap = {};
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('#')) {
      const id = href.slice(1);
      linkMap[id] = link;
    }
  });

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const id = entry.target.id;

        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
        }

        if (entry.isIntersecting && id && linkMap[id]) {
          navLinks.forEach(l => {
            l.classList.remove('is-active');
            l.removeAttribute('aria-current');
          });
          const activeLink = linkMap[id];
          activeLink.classList.add('is-active');
          activeLink.setAttribute('aria-current', 'page');
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(section => sectionObserver.observe(section));
}

// ======================
// ROOT COLUMN PROGRESSION
// ======================
function initRootProgress() {
  const rootEl = document.documentElement;

  function updateRootProgress() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? clamp01(scrollTop / docHeight) : 0;
    rootEl.style.setProperty('--root-progress', progress.toString());
  }

  updateRootProgress();
  window.addEventListener('scroll', updateRootProgress);
  window.addEventListener('resize', updateRootProgress);
}

// ======================
// FOREST CANOPY PARALLAX
// ======================
function initForestParallax() {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const back = document.querySelector('.forest-canopy-layer--back');
  const front = document.querySelector('.forest-canopy-layer--front');

  if (!back || !front || prefersReduced) return;

  function handleScroll() {
    if (isCalmMode()) return; // keep canopy from drifting in calm mode

    const maxOffset = 120;
    const scrollTop = window.scrollY || window.pageYOffset;
    const offsetBack = scrollTop * 0.04;
    const offsetFront = scrollTop * 0.08;

    back.style.transform = `translateY(${Math.min(offsetBack, maxOffset)}px)`;
    front.style.transform = `translateY(${Math.min(offsetFront, maxOffset)}px)`;
  }

  handleScroll();
  window.addEventListener('scroll', handleScroll);
}

// ======================
// POLLEN / DUST + FIREFLIES
// ======================
function initPollenAndFireflies() {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.getElementById('particleCanvas');
  if (!canvas || !canvas.getContext || prefersReduced) return;

  const ctx = canvas.getContext('2d');
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

  function step(ts) {
    if (isCalmMode()) {
      ctx.clearRect(0, 0, width, height);
      requestAnimationFrame(step);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // pollen
    ctx.save();
    for (const p of pollen) {
      p.y += p.vy;
      p.x += p.vx + Math.sin(p.phase + ts * 0.00008) * 0.08;

      if (p.y > height) p.y = -10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      const alpha = 0.08 + Math.abs(Math.sin(p.phase + ts * 0.0002)) * 0.07;
      ctx.fillStyle = `rgba(245, 212, 161, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // fireflies
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
      gradient.addColorStop(0, `rgba(245, 212, 161, ${alpha})`);
      gradient.addColorStop(0.4, `rgba(245, 212, 161, ${alpha * 0.7})`);
      gradient.addColorStop(1, 'rgba(245, 212, 161, 0)');

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
  initParticles();
  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
  requestAnimationFrame(step);
}

// ======================
// FOREST MYCELIUM / OCEAN NETWORK
// ======================
function initForestNetwork() {
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.getElementById('forestNetwork');
  if (!canvas || !canvas.getContext || prefersReduced) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let nodes = [];
  const NODE_COUNT = 72;
  const BASE_MAX_DIST = 130;

  let scrollFactor = 0;  // 0 = top of page, 1 = bottom
  let focusFactor = 0;   // 0 = section off-screen, 1 = fully in view
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
      const isOcean = Math.random() < 0.5;
      nodes.push({
        x: Math.random() * width,
        y: isOcean
          ? height * (0.55 + Math.random() * 0.4)  // ocean band
          : height * (0.15 + Math.random() * 0.35), // forest band
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        size: 0.8 + Math.random() * 1.5,
        kind: isOcean ? 'ocean' : 'forest',
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
    const visible =
      Math.min(rect.bottom, viewHeight) - Math.max(rect.top, 0);
    const ratio = clamp01(visible / rect.height);
    focusFactor = ratio;
  }

  window.addEventListener('scroll', updateScrollFactors);
  window.addEventListener('resize', () => {
    resize();
    updateScrollFactors();
  });

  canvas.addEventListener('pointermove', event => {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
  });
  canvas.addEventListener('pointerleave', () => {
    mouseX = null;
    mouseY = null;
  });

  function step() {
    if (isCalmMode()) {
      // In calm mode, keep a very subtle static hint
      ctx.clearRect(0, 0, width, height);
      drawBackground(0.18);
      requestAnimationFrame(step);
      return;
    }

    ctx.clearRect(0, 0, width, height);
    drawBackground(0.3 + focusFactor * 0.2);
    updateNodes();
    drawConnections();
    drawNodes();
    requestAnimationFrame(step);
  }

  function drawBackground(alphaBase) {
    // Top: forest canopy haze, bottom: deep PNW ocean
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, `rgba(10, 35, 34, 1)`);
    grad.addColorStop(0.4, `rgba(7, 27, 33, 1)`);
    grad.addColorStop(0.7, `rgba(3, 28, 43, 1)`);
    grad.addColorStop(1, `rgba(2, 19, 33, 1)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Soft underwater caustics near bottom
    ctx.save();
    ctx.globalAlpha = alphaBase;
    ctx.fillStyle = ctx.createRadialGradient(
      width * 0.5,
      height * 1.1,
      height * 0.1,
      width * 0.5,
      height * 0.9,
      height * 0.65
    );
    ctx.fillStyle.addColorStop?.call(ctx.fillStyle, 0, 'rgba(42, 128, 140, 0.7)');
    ctx.fillStyle.addColorStop?.call(ctx.fillStyle, 1, 'rgba(5, 18, 28, 0)');
    ctx.fillRect(0, height * 0.45, width, height * 0.55);
    ctx.restore();

    // Horizon glow between ocean and forest
    ctx.save();
    ctx.globalAlpha = 0.4 + focusFactor * 0.25;
    const horizonY = height * 0.52;
    const horizonGrad = ctx.createLinearGradient(0, horizonY - 4, 0, horizonY + 16);
    horizonGrad.addColorStop(0, 'rgba(153, 194, 201, 0)');
    horizonGrad.addColorStop(0.4, 'rgba(212, 200, 176, 0.45)');
    horizonGrad.addColorStop(1, 'rgba(86, 145, 138, 0)');
    ctx.fillStyle = horizonGrad;
    ctx.fillRect(0, horizonY - 8, width, 32);
    ctx.restore();
  }

  function updateNodes() {
    const ROOT_PULL = 0.02 + focusFactor * 0.05;
    const maxOceanLift = 0.08 + 0.12 * scrollFactor;

    for (const n of nodes) {
      const isOcean = n.kind === 'ocean';

      // Center of pull: slight forestwards bias
      const cx = width * 0.5;
      const cy = isOcean
        ? height * (0.5 + maxOceanLift) // ocean nodes gently drawn up
        : height * 0.3;

      // gentle pull toward center / horizon
      n.vx += (cx - n.x) * ROOT_PULL * 0.0006;
      n.vy += (cy - n.y) * ROOT_PULL * 0.0006;

      // pointer attraction
      if (mouseX != null && mouseY != null) {
        const dx = mouseX - n.x;
        const dy = mouseY - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = 0.04 * focusFactor;
        n.vx += (dx / dist) * force * 0.02;
        n.vy += (dy / dist) * force * 0.02;
      }

      // gentle oscillation
      n.phase += 0.003 + Math.random() * 0.002;
      n.vx += Math.sin(n.phase) * 0.002;
      n.vy += Math.cos(n.phase) * 0.002;

      n.x += n.vx;
      n.y += n.vy;

      // wrap around
      const margin = 30;
      if (n.x < -margin) n.x = width + margin;
      if (n.x > width + margin) n.x = -margin;
      if (n.y < -margin) n.y = height + margin;
      if (n.y > height + margin) n.y = -margin;

      // damp velocities a bit
      n.vx *= 0.985;
      n.vy *= 0.985;
    }
  }

  function drawConnections() {
    const maxDist = BASE_MAX_DIST + focusFactor * 40;
    const oceanColor = '191, 214, 214';  // light aqua
    const forestColor = '191, 173, 144'; // warm fungal
    const crossColor = '152, 196, 186';

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const t = 1 - dist / maxDist;
          const baseAlpha = (0.4 + focusFactor * 0.5) * t;

          let rgb = forestColor;
          if (n1.kind === 'ocean' && n2.kind === 'ocean') {
            rgb = oceanColor;
          } else if (n1.kind !== n2.kind) {
            rgb = crossColor;
          }

          ctx.strokeStyle = `rgba(${rgb}, ${baseAlpha * 0.7})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }
    }
  }

  function drawNodes() {
    for (const n of nodes) {
      const isOcean = n.kind === 'ocean';
      const baseSize = n.size;
      const pulse = 1 + Math.sin(n.phase * 1.3) * 0.18 * focusFactor;
      const outerRadius = baseSize * (3.6 + 1.4 * focusFactor) * pulse;
      const innerRadius = baseSize * (1 + 0.5 * focusFactor);

      const centerColor = isOcean
        ? 'rgba(146, 210, 213, 1)'
        : 'rgba(245, 212, 161, 1)';
      const haloInner = isOcean
        ? 'rgba(146, 210, 213, 0.7)'
        : 'rgba(245, 212, 161, 0.65)';
      const haloOuter = isOcean
        ? 'rgba(40, 123, 139, 0)'
        : 'rgba(94, 126, 104, 0)';

      const grad = ctx.createRadialGradient(
        n.x,
        n.y,
        0,
        n.x,
        n.y,
        outerRadius
      );
      grad.addColorStop(0, centerColor);
      grad.addColorStop(0.35, haloInner);
      grad.addColorStop(1, haloOuter);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, outerRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = centerColor;
      ctx.beginPath();
      ctx.arc(n.x, n.y, innerRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  resize();
  updateScrollFactors();
  requestAnimationFrame(step);
}

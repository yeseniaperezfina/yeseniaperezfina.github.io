// ======================
// UTILITIES
// ======================
function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function isCalmMode() {
  return document.body.dataset.mode === 'calm';
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
    const maxOffset = 120;
    const scrollTop = window.scrollY || window.pageYOffset;

    if (isCalmMode()) {
      back.style.transform = 'translateY(0)';
      front.style.transform = 'translateY(0)';
      return;
    }

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
    ctx.clearRect(0, 0, width, height);

    if (isCalmMode()) {
      requestAnimationFrame(step);
      return;
    }

    // pollen
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
      gradient.addColorStop(0, `rgba(253, 216, 167, ${alpha})`);
      gradient.addColorStop(0.4, `rgba(253, 216, 167, ${alpha * 0.7})`);
      gradient.addColorStop(1, 'rgba(253, 216, 167, 0)');

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
// OCEAN / FOREST MYCELIUM NETWORK
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
  const NODE_COUNT = 70;
  const BASE_MAX_DIST = 130;

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
      nodes.push({
        x: Math.random() * width,
        // bias nodes toward the "shelf" in the lower half
        y: height * 0.4 + Math.random() * height * 0.6,
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
    ctx.clearRect(0, 0, width, height);

    if (isCalmMode()) {
      // In calm mode, keep a faint ocean/forest gradient but no moving nodes
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(3, 19, 33, 1)');
      grad.addColorStop(0.45, 'rgba(4, 35, 55, 1)');
      grad.addColorStop(1, 'rgba(7, 29, 26, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
      requestAnimationFrame(step);
      return;
    }

    // Background: bottom = ocean shelf, top = forest roots
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, 'rgba(7, 23, 28, 1)');          // canopy/forest
    bgGrad.addColorStop(0.45, 'rgba(6, 27, 38, 1)');       // transition
    bgGrad.addColorStop(1, 'rgba(2, 25, 45, 1)');          // deep ocean
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Gentle ocean surface shimmer near top
    ctx.save();
    const shimmerAlpha = 0.09 + 0.05 * (1 - scrollFactor);
    ctx.fillStyle = `rgba(157, 206, 230, ${shimmerAlpha})`;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.22);
    ctx.bezierCurveTo(
      width * 0.25,
      height * 0.18,
      width * 0.45,
      height * 0.26,
      width * 0.7,
      height * 0.21
    );
    ctx.bezierCurveTo(
      width * 0.85,
      height * 0.18,
      width * 0.95,
      height * 0.24,
      width,
      height * 0.22
    );
    ctx.lineTo(width, height * 0.25);
    ctx.lineTo(0, height * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Vertical "kelp → roots" hints
    ctx.save();
    ctx.strokeStyle = 'rgba(40, 88, 77, 0.7)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      const x = (width / 6) * i + (i % 2 === 0 ? 10 : -5);
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.quadraticCurveTo(
        x + (Math.random() - 0.5) * 30,
        height * 0.7,
        x + (Math.random() - 0.5) * 20,
        height * 0.45
      );
      ctx.stroke();
    }
    ctx.restore();

    // Node dynamics: pulled from ocean shelf upward into forest
    const ROOT_PULL = 0.02 + focusFactor * 0.05;
    const maxDist = BASE_MAX_DIST + focusFactor * 40;

    for (const n of nodes) {
      const cx = width * 0.5;
      const cy = height * (0.42 - scrollFactor * 0.07); // pull slightly upward as user scrolls

      // gentle pull toward mid/root zone
      n.vx += (cx - n.x) * ROOT_PULL * 0.0006;
      n.vy += (cy - n.y) * ROOT_PULL * 0.0006;

      // pointer attraction
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

      // wrap around
      if (n.x < -30) n.x = width + 30;
      if (n.x > width + 30) n.x = -30;
      if (n.y < -30) n.y = height + 30;
      if (n.y > height + 30) n.y = -30;
    }

    // Connections (mycelium threads)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const verticalMix = (n1.y + n2.y) / (2 * height); // 0 top → 1 bottom
          const oceanBlend = verticalMix;
          const forestBlend = 1 - verticalMix;

          const r = 253 * forestBlend + 157 * oceanBlend;
          const g = 216 * forestBlend + 206 * oceanBlend;
          const b = 167 * forestBlend + 230 * oceanBlend;

          const alpha = (1 - dist / maxDist) * (0.55 + focusFactor * 0.35);
          ctx.strokeStyle = `rgba(${r.toFixed(0)}, ${g.toFixed(0)}, ${b.toFixed(
            0
          )}, ${alpha * 0.6})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }
    }

    // Nodes themselves (bioluminescent tips)
    for (const n of nodes) {
      const verticalMix = n.y / height;
      const oceanBlend = verticalMix;
      const forestBlend = 1 - verticalMix;

      const r = 253 * forestBlend + 157 * oceanBlend;
      const g = 216 * forestBlend + 206 * oceanBlend;
      const b = 167 * forestBlend + 230 * oceanBlend;

      const outerGrad = ctx.createRadialGradient(
        n.x,
        n.y,
        0,
        n.x,
        n.y,
        n.size * 3.8
      );
      outerGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.9)`);
      outerGrad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, 0.45)`);
      outerGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size * 3.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255, 244, 230, 0.95)`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  resize();
  updateScrollFactors();
  requestAnimationFrame(step);
}

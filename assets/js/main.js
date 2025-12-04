// ======================
// UTILITIES
// ======================
function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

// Respect user motion preferences
const PREFERS_REDUCED_MOTION =
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Helper to know current mode ("forest" | "calm")
// Aligned with CSS, which keys off body[data-mode]
function getCurrentMode() {
  const bodyMode = document.body && document.body.getAttribute('data-mode');
  const htmlMode = document.documentElement.getAttribute('data-mode');
  const mode = bodyMode || htmlMode;
  return mode === 'calm' ? 'calm' : 'forest';
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
  initShorelineNetwork();

  // Background world
  initSkyScene();
  initForestCanopy();
  initFireflies();

  // Optional audio hook
  initWaveSound();
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
// MODE TOGGLE (FOREST / CALM) + MIDNIGHT EASTER EGG
// ======================
function initModeToggle() {
  const html = document.documentElement;
  const body = document.body;
  const toggle = document.getElementById('modeToggle');
  if (!toggle || !body) return;

  const label = toggle.querySelector('.mode-toggle__label');

  let calmToggleCount = 0;
  let midnightTriggered = false;

  function showMidnightBadge() {
    if (document.querySelector('.midnight-badge')) return;

    const badge = document.createElement('div');
    badge.className = 'midnight-badge';
    badge.innerHTML = `
      <span class="midnight-badge__dot" aria-hidden="true"></span>
      <span>Midnight shoreline unlocked</span>
      <button class="midnight-badge__close" type="button" aria-label="Dismiss midnight badge">×</button>
    `;

    const closeBtn = badge.querySelector('.midnight-badge__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        badge.remove();
      });
    }

    document.body.appendChild(badge);

    // Auto-fade after ~8 seconds
    setTimeout(() => {
      badge.style.opacity = '0';
      badge.style.transition = 'opacity 0.5s ease-out';
      setTimeout(() => badge.remove(), 500);
    }, 8000);
  }

  function triggerMidnightMode() {
    if (midnightTriggered) return;
    midnightTriggered = true;
    body.classList.add('is-midnight');
    showMidnightBadge();
  }

  function applyMode(mode) {
    const isCalm = mode === 'calm';
    const value = isCalm ? 'calm' : 'forest';

    // Keep CSS + JS in sync
    body.setAttribute('data-mode', value);
    html.setAttribute('data-mode', value);

    toggle.setAttribute('aria-pressed', String(isCalm));
    if (label) {
      label.textContent = isCalm ? 'Calm mode' : 'Forest mode';
    }

    // Track Calm toggles for the Easter egg
    if (isCalm) {
      calmToggleCount += 1;
      if (calmToggleCount >= 3 && !midnightTriggered) {
        triggerMidnightMode();
      }
    }
  }

  const storedMode = window.localStorage
    ? window.localStorage.getItem('yesi-site-mode')
    : null;
  const initialMode = storedMode === 'calm' ? 'calm' : 'forest';
  applyMode(initialMode);

  toggle.addEventListener('click', () => {
    const current = getCurrentMode();
    const next = current === 'calm' ? 'forest' : 'calm';
    applyMode(next);
    if (window.localStorage) {
      window.localStorage.setItem('yesi-site-mode', next);
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
      'I map portfolios, initiatives, and learning environments so teams can see the system, not just the project.',
    Scholar:
      'I pull from higher education research, learning sciences, and organizational theory to make design choices that are both rigorous and humane.',
    Creator:
      'I translate complex science and systems into visuals and narratives—including The Echo Jar—that feel accessible, grounded, and worth caring about.',
    Navigator:
      'I help teams move through ambiguity with clarity and care, tending to timelines, relationships, and the emotional texture of change.'
  };

  function updateRole(role) {
    const text = copy[role];
    if (!text) return;
    roleNote.innerHTML = `As a <strong>${role}</strong>, ${text}`;
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('chip--active'));
      chip.classList.add('chip--active');

      const role = chip.getAttribute('data-role-chip');
      if (role && copy[role]) {
        updateRole(role);
      }
    });
  });
}

// ======================
// SCROLL SPY (.nav-link) + SECTION REVEAL (.section-visible)
// ======================
function initScrollSpy() {
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

  // Fallback: if IntersectionObserver isn't supported, just show all sections
  if (!('IntersectionObserver' in window)) {
    sections.forEach(section => {
      section.classList.add('section-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
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
    {
      threshold: 0.25,
      rootMargin: '0px 0px -10% 0px'
    }
  );

  sections.forEach(section => observer.observe(section));
}

// ======================
// ROOT COLUMN PROGRESSION + SCENE OPACITY
// ======================
function initRootProgress() {
  const rootEl = document.documentElement;

  function updateRootProgress() {
    const scrollTop = window.scrollY || window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? clamp01(scrollTop / docHeight) : 0;

    // Root line (drives the warm/teal gradient in CSS)
    rootEl.style.setProperty('--root-progress', progress.toString());

    // Scene transparencies (used by .scene-layer--* via CSS vars)
    const mode = getCurrentMode();
    const isCalm = mode === 'calm';

    // Sky fades out over first half of page
    const baseSkyOpacity = clamp01(1 - progress * 1.1);
    const skyOpacity = baseSkyOpacity;

    // Forest canopy: arrives a bit later, fills more gradually
    const baseForestOpacity = clamp01((progress - 0.12) / 0.6);
    const forestOpacity = isCalm
      ? Math.min(baseForestOpacity, 0.5)
      : baseForestOpacity;

    // Fireflies: show up further down the page
    const baseFireflyOpacity = clamp01((progress - 0.45) / 0.45);
    const fireflyOpacity = isCalm
      ? Math.min(baseFireflyOpacity, 0.55)
      : baseFireflyOpacity;

    rootEl.style.setProperty('--sky-opacity', skyOpacity.toString());
    rootEl.style.setProperty('--forest-opacity', forestOpacity.toString());
    rootEl.style.setProperty('--firefly-opacity', fireflyOpacity.toString());
  }

  updateRootProgress();
  window.addEventListener('scroll', updateRootProgress);
  window.addEventListener('resize', updateRootProgress);
}

// ======================
// SKY SCENE — STARS + PLANES
// ======================
function initSkyScene() {
  const canvas = document.getElementById('skyCanvas');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let stars = [];
  let planes = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width || window.innerWidth;
    height = rect.height || window.innerHeight;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    initStars();
    initPlanes();
  }

  function initStars() {
    stars = [];
    const count = 80; // slightly sparser
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.55, // upper half
        radius: 0.6 + Math.random() * 1.4,
        baseAlpha: 0.22 + Math.random() * 0.45,
        baseTwinkleAmp: 0.16 + Math.random() * 0.18,   // gentler twinkle
        baseTwinkleSpeed: 0.25 + Math.random() * 0.3,  // slower overall
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function initPlanes() {
    planes = [];
    const count = 3;
    for (let i = 0; i < count; i++) {
      planes.push({
        baseX: Math.random() * width,
        y: height * (0.18 + Math.random() * 0.1), // quiet flight path
        speed: 28 + Math.random() * 34,
        blinkOffset: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    const mode = getCurrentMode();
    const isCalm = mode === 'calm';

    // Parallax drift only in Forest mode (very slow side-to-side sway)
    const parallaxOffset = !isCalm ? Math.sin(time * 0.025) * 16 : 0;

    // Stars
    for (const s of stars) {
      const twinkleSpeed = isCalm
        ? s.baseTwinkleSpeed * 0.45 // slower in Calm
        : s.baseTwinkleSpeed;
      const twinkleAmp = isCalm
        ? s.baseTwinkleAmp * 0.55 // lower amplitude in Calm
        : s.baseTwinkleAmp;

      const twinkle = Math.sin(time * twinkleSpeed + s.phase);
      const alpha = s.baseAlpha + twinkle * twinkleAmp;

      const x = s.x + parallaxOffset;

      ctx.beginPath();
      ctx.arc(x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(249, 235, 213, ${clamp01(alpha)})`;
      ctx.fill();
    }

    // Planes — only in Forest mode, and only if motion is allowed
    if (!PREFERS_REDUCED_MOTION && !isCalm) {
      for (const p of planes) {
        const x = ((p.baseX + time * p.speed) % (width + 60)) - 30;
        const blink = 0.3 + 0.7 * Math.abs(Math.sin(time * 4 + p.blinkOffset));

        // tiny trail
        ctx.strokeStyle = `rgba(210, 220, 230, ${blink * 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - 18, p.y);
        ctx.lineTo(x + 3, p.y);
        ctx.stroke();

        // nose light
        ctx.beginPath();
        ctx.arc(x + 4, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(243, 195, 122, ${blink})`;
        ctx.fill();
      }
    }

    // Calm mode overlays: soft blue desaturation + starlight refraction
    if (isCalm) {
      ctx.save();

      // Subtle blue wash
      ctx.globalCompositeOperation = 'soft-light';
      ctx.fillStyle = 'rgba(20, 40, 70, 0.26)';
      ctx.fillRect(0, 0, width, height);

      // Soft starlight refraction near zenith
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.12,
        0,
        width * 0.5,
        height * 0.12,
        width * 0.5
      );
      grad.addColorStop(0, 'rgba(210, 225, 255, 0.16)');
      grad.addColorStop(0.4, 'rgba(150, 185, 230, 0.08)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();
    }
  }

  function frame(timestamp) {
    const t = timestamp / 1000;
    draw(t);
    if (!PREFERS_REDUCED_MOTION) {
      requestAnimationFrame(frame);
    }
  }

  window.addEventListener('resize', resize);
  resize();

  // Initial draw
  draw(performance.now() / 1000);
  if (!PREFERS_REDUCED_MOTION) {
    requestAnimationFrame(frame);
  }
}

// ======================
// FOREST CANOPY — TREE PROFILES
// ======================
function initForestCanopy() {
  const canvas = document.getElementById('forestCanvas');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let trees = [];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width || window.innerWidth;
    height = rect.height || window.innerHeight;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    initTrees();
  }

  function initTrees() {
    trees = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const baseX = (width / count) * i + (Math.random() - 0.5) * 40;
      const baseHeight = height * (0.25 + Math.random() * 0.28);
      trees.push({
        baseX,
        baseHeight,
        width: 32 + Math.random() * 24,
        swayAmp: 4 + Math.random() * 5,
        swaySpeed: 0.3 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);

    const mode = getCurrentMode();
    const isCalm = mode === 'calm';

    // subtle vertical gradient for moonlit forest
    const grad = ctx.createLinearGradient(0, height * 0.3, 0, height);
    grad.addColorStop(0, 'rgba(4, 10, 20, 0)');
    grad.addColorStop(0.4, 'rgba(5, 20, 28, 0.7)');
    grad.addColorStop(1, 'rgba(3, 14, 16, 1)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, height * 0.25, width, height * 0.75);

    // tree silhouettes
    ctx.fillStyle = 'rgba(3, 26, 27, 0.96)';
    ctx.strokeStyle = 'rgba(47, 87, 86, 0.45)';

    const baseY = height * 0.85;

    for (const tree of trees) {
      const swayFactor = isCalm ? 0.4 : 1; // gentler in Calm
      const sway = Math.sin(time * tree.swaySpeed + tree.phase) * tree.swayAmp * swayFactor;
      const x = tree.baseX + sway;
      const h = tree.baseHeight;
      const w = tree.width;

      // simple evergreen shape
      ctx.beginPath();
      ctx.moveTo(x, baseY - h);
      ctx.lineTo(x - w * 0.55, baseY - h * 0.55);
      ctx.lineTo(x - w * 0.3, baseY - h * 0.45);
      ctx.lineTo(x - w * 0.7, baseY - h * 0.2);
      ctx.lineTo(x - w * 0.2, baseY - h * 0.2);
      ctx.lineTo(x - w * 0.9, baseY);
      ctx.lineTo(x + w * 0.9, baseY);
      ctx.lineTo(x + w * 0.2, baseY - h * 0.2);
      ctx.lineTo(x + w * 0.7, baseY - h * 0.2);
      ctx.lineTo(x + w * 0.3, baseY - h * 0.45);
      ctx.lineTo(x + w * 0.55, baseY - h * 0.55);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
  }

  function frame(timestamp) {
    const t = timestamp / 1000;
    draw(t);
    if (!PREFERS_REDUCED_MOTION) {
      requestAnimationFrame(frame);
    }
  }

  window.addEventListener('resize', resize);
  resize();

  // Initial draw
  draw(performance.now() / 1000);
  if (!PREFERS_REDUCED_MOTION) {
    requestAnimationFrame(frame);
  }
}

// ======================
// FIREFLIES — NEAR FOREST FLOOR (with proximity glow)
// ======================
function initFireflies() {
  const container = document.querySelector('.scene-layer--fireflies');
  if (!container) return;

  const COUNT = 22; // a few more points of light
  const fireflies = [];

  for (let i = 0; i < COUNT; i++) {
    const firefly = document.createElement('div');
    firefly.className = 'firefly';

    // Random placement biased toward bottom half
    const fx = Math.random();              // 0–1 horizontally
    const fy = 0.45 + Math.random() * 0.5; // 0.45–0.95 vertically

    firefly.style.setProperty('--fx', fx.toString());
    firefly.style.setProperty('--fy', fy.toString());

    const delay = (Math.random() * 10).toFixed(2);

    if (!PREFERS_REDUCED_MOTION) {
      firefly.style.animation =
        `fireflyMove 20s ease-in-out infinite alternate, ` +  // slower drift
        `fireflyBlink 3.2s ease-in-out infinite alternate`;    // slower blink
      firefly.style.animationDelay = `${delay}s, ${delay}s`;
    } else {
      // Reduced motion: keep them softly glowing
      firefly.style.opacity = '0.6';
    }

    container.appendChild(firefly);
    fireflies.push({ el: firefly, fx, fy });
  }

  // Cursor-based proximity glow (halo)
  function handlePointerMove(event) {
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;

    const cursorX = event.clientX;
    const cursorY = event.clientY;
    const THRESHOLD = 160; // px radius for "near"

    fireflies.forEach(ff => {
      const x = ff.fx * vw;
      const y = ff.fy * vh;
      const dx = cursorX - x;
      const dy = cursorY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < THRESHOLD) {
        ff.el.classList.add('firefly--near');
      } else {
        ff.el.classList.remove('firefly--near');
      }
    });
  }

  function handlePointerLeave() {
    fireflies.forEach(ff => ff.el.classList.remove('firefly--near'));
  }

  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerleave', handlePointerLeave);
}

// ======================
// SHORELINE MYCELIUM NETWORK
// (Canvas-based, hover-responsive + idle shimmer)
// ======================
function initShorelineNetwork() {
  const canvas = document.getElementById('forestNetwork');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let nodes = [];
  const NODE_COUNT = 70;
  const MAX_DIST = 130;

  let hoverX = null;
  let hoverY = null;

  // Idle shimmer state
  let idlePulse = 0;
  let lastIdleTime = 0;
  let shimmerPhase = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width || 400;
    height = rect.height || 260;
    const ratio = window.devicePixelRatio || 1;

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    initNodes();
    draw();
  }

  function initNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: height * 0.35 + Math.random() * height * 0.45, // mostly between ocean + forest floor
        size: 0.9 + Math.random() * 1.4
      });
    }
  }

  function drawBackground() {
    // Ocean → shoreline → forest floor gradient
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(5, 13, 30, 1)');          // deep sky
    grad.addColorStop(0.3, 'rgba(10, 32, 54, 1)');      // horizon mist
    grad.addColorStop(0.55, 'rgba(8, 38, 55, 1)');      // ocean surface
    grad.addColorStop(0.7, 'rgba(7, 30, 34, 1)');       // near-shore
    grad.addColorStop(1, 'rgba(5, 22, 21, 1)');         // forest floor
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Very subtle shoreline glow band
    ctx.fillStyle = 'rgba(243, 195, 122, 0.12)';
    const bandY = height * 0.55;
    ctx.fillRect(0, bandY - 3, width, 6);

    // Subtle moving ocean shimmer (only if motion allowed)
    if (!PREFERS_REDUCED_MOTION) {
      const centerX = (Math.sin(shimmerPhase) * 0.5 + 0.5) * width;
      const shimmerGrad = ctx.createRadialGradient(
        centerX,
        bandY,
        0,
        centerX,
        bandY,
        width * 0.45
      );
      shimmerGrad.addColorStop(0, 'rgba(249, 235, 213, 0.10)');
      shimmerGrad.addColorStop(0.35, 'rgba(249, 235, 213, 0.06)');
      shimmerGrad.addColorStop(1, 'rgba(249, 235, 213, 0)');
      ctx.fillStyle = shimmerGrad;
      ctx.fillRect(0, bandY - height * 0.2, width, height * 0.4);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawBackground();

    if (!nodes.length) return;

    const hasHover = hoverX != null && hoverY != null;

    // Connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          // Base alpha from proximity
          let alpha = (1 - dist / MAX_DIST) * 0.6;

          if (hasHover) {
            // If hovering near this segment, brighten it
            const midX = (n1.x + n2.x) / 2;
            const midY = (n1.y + n2.y) / 2;
            const hdx = hoverX - midX;
            const hdy = hoverY - midY;
            const hdist = Math.sqrt(hdx * hdx + hdy * hdy);
            const hoverInfluence = Math.max(0, 1 - hdist / 120);
            alpha += hoverInfluence * 0.4;
          } else {
            // Idle shimmer: gentle breathing of the network
            alpha *= 0.85 + idlePulse;
          }

          alpha = Math.min(alpha, 0.9);

          ctx.strokeStyle = `rgba(214, 189, 149, ${alpha * 0.6})`;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    for (const n of nodes) {
      let baseRadius = n.size * 3;
      let innerRadius = n.size;

      let glowAlpha = hasHover ? 0.5 : 0.42 + idlePulse;
      let coreAlpha = hasHover ? 0.9 : 0.88 + idlePulse * 0.45;

      if (hasHover) {
        const dx = hoverX - n.x;
        const dy = hoverY - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 100);
        baseRadius += influence * 4;
        innerRadius += influence * 1.2;
        glowAlpha += influence * 0.4;
        coreAlpha += influence * 0.1;
      }

      const grad = ctx.createRadialGradient(
        n.x,
        n.y,
        0,
        n.x,
        n.y,
        baseRadius
      );
      grad.addColorStop(0, `rgba(243, 195, 122, ${glowAlpha})`);
      grad.addColorStop(0.4, `rgba(243, 195, 122, ${glowAlpha * 0.6})`);
      grad.addColorStop(1, 'rgba(243, 195, 122, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, baseRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(249, 235, 213, ${coreAlpha})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, innerRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function handlePointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    hoverX = event.clientX - rect.left;
    hoverY = event.clientY - rect.top;
    draw();
  }

  function handlePointerLeave() {
    hoverX = null;
    hoverY = null;
    draw();
  }

  function animateIdle(timestamp) {
    if (PREFERS_REDUCED_MOTION) return;
    const t = (timestamp || performance.now()) / 1000;

    // Slow shimmer phase for ocean band
    shimmerPhase = t * 0.16;

    // Only shimmer when there's no hover activity
    if (hoverX == null && hoverY == null) {
      if (timestamp - lastIdleTime > 180) {
        idlePulse = 0.08 + 0.05 * Math.sin(t / 2.2); // slow, subtle pulse
        lastIdleTime = timestamp;
        draw();
      }
    }

    requestAnimationFrame(animateIdle);
  }

  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerleave', handlePointerLeave);
  window.addEventListener('resize', resize);

  resize();
  if (!PREFERS_REDUCED_MOTION) {
    requestAnimationFrame(animateIdle);
  }
}

// ======================
// WAVE SOUND HOOK
// (Optional: wire to <audio id="waveAudio"> and a button)
// ======================
function initWaveSound() {
  const audio = document.getElementById('waveAudio');
  const toggle = document.getElementById('waveSoundToggle');
  if (!audio || !toggle) return;

  // Ensure it loops gently in the background
  audio.loop = true;

  function updateToggle(isPlaying) {
    toggle.setAttribute('aria-pressed', String(isPlaying));
    toggle.textContent = isPlaying ? 'Waves: On' : 'Waves: Off';
  }

  toggle.addEventListener('click', () => {
    if (audio.paused) {
      audio
        .play()
        .then(() => updateToggle(true))
        .catch(() => {
          // If autoplay is blocked, just keep the UI in "off" state
          updateToggle(false);
        });
    } else {
      audio.pause();
      updateToggle(false);
    }
  });

  // Initial label
  updateToggle(!audio.paused);
}

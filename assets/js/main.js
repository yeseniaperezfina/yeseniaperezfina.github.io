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
  initShorelineNetwork();
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
  const html = document.documentElement;
  const body = document.body;
  const toggle = document.getElementById('modeToggle');
  if (!toggle || !body) return;

  const label = toggle.querySelector('.mode-toggle__label');

  function applyMode(mode) {
    const isCalm = mode === 'calm';
    body.setAttribute('data-mode', isCalm ? 'calm' : 'forest');
    html.setAttribute('data-mode', isCalm ? 'calm' : 'forest');
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
    const current = body.getAttribute('data-mode') === 'calm' ? 'calm' : 'forest';
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
    { threshold: 0.4 }
  );

  sections.forEach(section => observer.observe(section));
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
// SHORELINE MYCELIUM NETWORK
// (Canvas-based, moves only on hover)
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
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawBackground();

    if (!nodes.length) return;

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

          // If hovering near this segment, brighten it
          if (hoverX != null && hoverY != null) {
            const midX = (n1.x + n2.x) / 2;
            const midY = (n1.y + n2.y) / 2;
            const hdx = hoverX - midX;
            const hdy = hoverY - midY;
            const hdist = Math.sqrt(hdx * hdx + hdy * hdy);
            const hoverInfluence = Math.max(0, 1 - hdist / 120);
            alpha += hoverInfluence * 0.4;
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
      let glowAlpha = 0.5;
      let coreAlpha = 0.9;

      if (hoverX != null && hoverY != null) {
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

  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerleave', handlePointerLeave);
  window.addEventListener('resize', resize);

  resize();
}

// ======================
// UTILITIES
// ======================
function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

// ======================
// YEAR STAMP
// ======================
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// ======================
// ROLE CHIPS → ROLE NOTE
// ======================
document.addEventListener('DOMContentLoaded', () => {
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
          match => `As a <strong>${role}</strong>, `
        );
      }
    });
  });
});

// ======================
// SCROLL SPY (.nav-link) + SECTION REVEAL (.section-visible)
// ======================
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('[data-section]');
  const navLinks = document.querySelectorAll('.nav-link');

  const linkMap = {};
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const id = href.slice(1);
    linkMap[id] = link;
  });

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const id = entry.target.id;
        if (entry.isIntersecting && id && linkMap[id]) {
          navLinks.forEach(l => l.classList.remove('is-active'));
          linkMap[id].classList.add('is-active');
        }
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
        }
      });
    },
    {
      threshold: 0.4
    }
  );

  sections.forEach(section => sectionObserver.observe(section));
});

// ======================
// ROOT PROGRESSION (for potential future use)
// ======================
document.addEventListener('DOMContentLoaded', () => {
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
});

// ======================
// SCENE TINTING (study / nook / observatory)
// ======================
document.addEventListener('DOMContentLoaded', () => {
  const rootEl = document.documentElement;
  const sceneSections = document.querySelectorAll('[data-scene-name]');
  if (!sceneSections.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const scene = entry.target.getAttribute('data-scene-name');
        if (scene) {
          rootEl.setAttribute('data-scene', scene);
        }
      });
    },
    { threshold: 0.5 }
  );

  sceneSections.forEach(section => observer.observe(section));
});

// ======================
// CURSOR LANTERN GLOW
// ======================
document.addEventListener('DOMContentLoaded', () => {
  const glow = document.querySelector('.cursor-glow');
  if (!glow) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    glow.style.display = 'none';
    return;
  }

  let targetX = -999;
  let targetY = -999;
  let currentX = -999;
  let currentY = -999;
  let rafId = null;

  function animate() {
    const dx = targetX - currentX;
    const dy = targetY - currentY;
    currentX += dx * 0.16;
    currentY += dy * 0.16;
    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    rafId = requestAnimationFrame(animate);
  }

  window.addEventListener('pointermove', event => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (rafId === null) {
      rafId = requestAnimationFrame(animate);
    }
  });
});

// ======================
// DUST MOTES IN LAMPLIGHT
// ======================
(function dustMotes() {
  const canvas = document.getElementById('dustCanvas');
  if (!canvas || !canvas.getContext) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;

  const motes = [];
  const MOTE_COUNT = 80;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function init() {
    motes.length = 0;

    for (let i = 0; i < MOTE_COUNT; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: 0.02 + Math.random() * 0.06,
        vx: (Math.random() - 0.5) * 0.03,
        size: 0.6 + Math.random() * 1.4,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function step(ts) {
    ctx.clearRect(0, 0, width, height);

    ctx.save();
    for (const m of motes) {
      m.y += m.vy;
      m.x += m.vx + Math.sin(m.phase + ts * 0.00005) * 0.04;

      if (m.y > height + 10) m.y = -10;
      if (m.x < -10) m.x = width + 10;
      if (m.x > width + 10) m.x = -10;

      const alpha = 0.05 + Math.abs(Math.sin(m.phase + ts * 0.00025)) * 0.12;
      ctx.fillStyle = `rgba(254, 243, 199, ${alpha})`;
      ctx.beginPath();
      ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    requestAnimationFrame(step);
  }

  resize();
  init();
  window.addEventListener('resize', () => {
    resize();
    init();
  });
  requestAnimationFrame(step);
})();

// ======================
// LIBRARY NIGHT-SKY NETWORK
// ======================
(function libraryNetwork() {
  const canvas = document.getElementById('libraryNetwork');
  if (!canvas || !canvas.getContext) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let nodes = [];
  const NODE_COUNT = 70;
  const BASE_MAX_DIST = 130;

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

    initNodes();
  }

  function initNodes() {
    nodes = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
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
    const visible = Math.min(rect.bottom, viewHeight) - Math.max(rect.top, 0);
    const ratio = clamp01(visible / Math.max(rect.height, 1));
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

    // Background: night sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, 'rgba(10,16,35,1)');
    skyGrad.addColorStop(0.4, 'rgba(6,10,24,1)');
    skyGrad.addColorStop(1, 'rgba(5,8,18,1)');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Faint star field
    const starAlpha = 0.5 + 0.3 * focusFactor;
    if (starAlpha > 0.02) {
      ctx.save();
      ctx.fillStyle = `rgba(238, 242, 255, ${0.35 * starAlpha})`;
      const starCount = 32;
      for (let i = 0; i < starCount; i++) {
        const x = (i * 73) % width;
        const y = (i * 29) % (height * 0.4);
        ctx.beginPath();
        ctx.arc(x, y, 0.8 + (i % 3) * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Node dynamics
    const CENTER_PULL = 0.02 + focusFactor * 0.05;
    const maxDist = BASE_MAX_DIST + focusFactor * 40;

    for (const n of nodes) {
      const cx = width * 0.5;
      const cy = height * (0.5 + focusFactor * 0.1);

      n.vx += (cx - n.x) * CENTER_PULL * 0.0006;
      n.vy += (cy - n.y) * CENTER_PULL * 0.0006;

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

    // Connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * (0.6 + focusFactor * 0.4);
          ctx.strokeStyle = `rgba(191, 219, 254, ${alpha * 0.6})`;
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
      const grad = ctx.createRadialGradient(
        n.x,
        n.y,
        0,
        n.x,
        n.y,
        n.size * 3.5
      );
      grad.addColorStop(0, 'rgba(254, 243, 199, 0.95)');
      grad.addColorStop(0.45, 'rgba(254, 243, 199, 0.5)');
      grad.addColorStop(1, 'rgba(254, 243, 199, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size * 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
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
// CAT CAMEO: awake when writing section in view
// ======================
document.addEventListener('DOMContentLoaded', () => {
  const writingSection = document.getElementById('writing');
  const cat = document.querySelector('.cat-cameo');
  if (!writingSection || !cat) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cat.classList.add('cat-cameo--awake');
        } else {
          cat.classList.remove('cat-cameo--awake');
        }
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(writingSection);
});

const HERO_LENS_COPY = {
  strategist:
    'As a <strong>Strategist</strong>, I shape learning systems, partnership structures, and decision pathways that help complex work scale without losing clarity or purpose.',
  scholar:
    'As a <strong>Scholar</strong>, I draw on research in leadership, learning, and institutions to sharpen judgment and make design choices that are both rigorous and useful.',
  builder:
    'As a <strong>Builder</strong>, I prototype and construct directly — in digital environments, program systems, and front-end interfaces — so ideas move from concept to form with less ambiguity.',
  translator:
    'As a <strong>Translator</strong>, I turn complexity into language, structure, and experience so science, strategy, and public meaning can travel together.'
};

const MATRIX_COPY = {
  learning: {
    kicker: 'Learning systems',
    title: 'I design structures that help complex educational work hold across contexts.',
    body:
      'My strongest work sits at the level of system design: aligning mission goals, audience realities, institutional constraints, and implementation pathways so programs and resources remain usable beyond a single launch.',
    bullets: [
      'Learning design strategy across distributed contexts',
      'Scalable models for public engagement and professional learning',
      'Program architecture built for both rigor and local adaptation'
    ]
  },
  partnerships: {
    kicker: 'Partnerships',
    title: 'I build working relationships that make distributed systems more coherent.',
    body:
      'Much of my work depends on trust across institutions, disciplines, and timelines. I design structures that help partners understand their role, adapt locally, and stay aligned without feeling overmanaged.',
    bullets: [
      'Cross-institution coordination across museums, libraries, scientists, and public-facing teams',
      'Partner enablement models that support clarity and local ownership',
      'Communication structures that reduce friction in complex ecosystems'
    ]
  },
  evaluation: {
    kicker: 'Evaluation',
    title: 'I use evidence to improve systems, not just to document them.',
    body:
      'Evaluation matters most when it changes the next decision. I work with qualitative and quantitative inputs to identify what is holding, what is failing, and what needs to be redesigned.',
    bullets: [
      'Evaluation-informed program refinement',
      'Translation of findings into strategic recommendations',
      'Evidence use across portfolio planning and continuous improvement'
    ]
  },
  translation: {
    kicker: 'Translation',
    title: 'I make difficult material legible without flattening its meaning.',
    body:
      'A core part of my role is interpretive: moving between scientists, educators, leadership, partners, and public audiences with enough precision that each group can act without losing the complexity of the original work.',
    bullets: [
      'Executive briefs, decks, and synthesis documents',
      'Audience-centered framing across science and public learning',
      'Strategic communication across technical and nontechnical contexts'
    ]
  },
  digital: {
    kicker: 'Digital design',
    title: 'I treat front-end architecture as a form of strategic clarity.',
    body:
      'I build in HTML, CSS, and JavaScript not only to make things look good, but to structure meaning, interaction, and proof. The medium itself sharpens how I think about hierarchy, usability, and decision flow.',
    bullets: [
      'Semantic front-end development and responsive layout',
      'Information architecture and component thinking',
      'Design systems that balance elegance, access, and legibility'
    ]
  }
};

function initYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

function initThemeToggle() {
  const body = document.body;
  const html = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const label = toggle.querySelector('.theme-toggle__label');
  const storageKey = 'yessi-portfolio-theme';

  function applyTheme(theme) {
    const value = theme === 'daybreak' ? 'daybreak' : 'obsidian';
    body.setAttribute('data-theme', value);
    html.setAttribute('data-theme', value);
    toggle.setAttribute('aria-pressed', String(value === 'daybreak'));
    if (label) {
      label.textContent = value === 'daybreak' ? 'Daybreak mode' : 'Obsidian mode';
    }
  }

  let initialTheme = 'obsidian';
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === 'daybreak') initialTheme = 'daybreak';
  } catch {
    // ignore storage errors
  }

  applyTheme(initialTheme);

  toggle.addEventListener('click', () => {
    const current = body.getAttribute('data-theme') === 'daybreak' ? 'daybreak' : 'obsidian';
    const next = current === 'obsidian' ? 'daybreak' : 'obsidian';
    applyTheme(next);

    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      // ignore storage errors
    }
  });
}

function initHeroLensSwitcher() {
  const chips = document.querySelectorAll('.hero-chip');
  const note = document.getElementById('lensNote');

  if (!chips.length || !note) return;

  function updateLens(lensKey) {
    const copy = HERO_LENS_COPY[lensKey];
    if (!copy) return;
    note.innerHTML = copy;
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const lens = chip.getAttribute('data-lens');
      if (!lens) return;

      chips.forEach((item) => {
        item.classList.remove('is-active');
        item.setAttribute('aria-selected', 'false');
      });

      chip.classList.add('is-active');
      chip.setAttribute('aria-selected', 'true');
      updateLens(lens);
    });
  });

  updateLens('strategist');
}

function initCapabilityMatrix() {
  const tabs = document.querySelectorAll('.matrix-tab');
  const panel = document.getElementById('matrixPanel');

  if (!tabs.length || !panel) return;

  function renderMatrix(key) {
    const data = MATRIX_COPY[key];
    if (!data) return;

    panel.innerHTML = `
      <div class="matrix-detail">
        <span class="matrix-detail__kicker">${data.kicker}</span>
        <h3 class="matrix-detail__title">${data.title}</h3>
        <p class="matrix-detail__body">${data.body}</p>
        <ul class="matrix-detail__list">
          ${data.bullets.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.getAttribute('data-matrix');
      if (!key) return;

      tabs.forEach((item) => {
        item.classList.remove('is-active');
        item.setAttribute('aria-selected', 'false');
      });

      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      renderMatrix(key);
    });
  });

  renderMatrix('learning');
}

function initScrollSpyAndReveal() {
  const sections = document.querySelectorAll('[data-section], .hero');
  const navLinks = document.querySelectorAll('.site-nav__link');

  if (!sections.length || !navLinks.length) return;

  const linkMap = {};
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      linkMap[href.slice(1)] = link;
    }
  });

  if (!('IntersectionObserver' in window)) {
    sections.forEach((section) => section.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;

        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }

        if (entry.isIntersecting && id && linkMap[id]) {
          navLinks.forEach((link) => {
            link.classList.remove('is-active');
            link.removeAttribute('aria-current');
          });

          const activeLink = linkMap[id];
          activeLink.classList.add('is-active');
          activeLink.setAttribute('aria-current', 'page');
        }
      });
    },
    {
      threshold: 0.24,
      rootMargin: '0px 0px -18% 0px'
    }
  );

  sections.forEach((section) => observer.observe(section));
}

document.addEventListener('DOMContentLoaded', () => {
  initYear();
  initThemeToggle();
  initHeroLensSwitcher();
  initCapabilityMatrix();
  initScrollSpyAndReveal();
});

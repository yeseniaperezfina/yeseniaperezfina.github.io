const HERO_LENS_COPY = {
  strategist:
    'As a <strong>Strategist</strong>, I design the conditions that allow ambitious work to hold: clear systems, usable structures, and enough coherence that complexity does not collapse into noise.',
  scholar:
    'As a <strong>Scholar</strong>, I work from inquiry. I draw on research, reflection, and close reading to sharpen judgment, test assumptions, and make stronger decisions about what a system is really doing.',
  builder:
    'As a <strong>Builder</strong>, I care about form as much as intention. I prototype, structure, and build directly so ideas can move from concept to something usable, legible, and alive in the medium.',
  translator:
    'As a <strong>Translator</strong>, I make complexity usable. I move between expert language, audience reality, institutional context, and public meaning without flattening what matters.'
};

const MATRIX_COPY = {
  learning: {
    kicker: 'Learning systems',
    title: 'I design structures that help complex work hold across contexts.',
    body:
      'My strongest work sits at the level of architecture: building the supports, rhythms, and pathways that allow knowledge to move across institutions and audiences without losing rigor or usability.',
    bullets: [
      'Learning design strategy across distributed settings',
      'Scalable models for educators, partners, and public audiences',
      'Programs built for both coherence and local adaptation'
    ]
  },
  partnerships: {
    kicker: 'Partnerships',
    title: 'I build the relational infrastructure that lets ambitious work travel.',
    body:
      'Partnerships are not side work. They are part of the system itself. I design for clarity, trust, communication, and local ownership so collaboration can function across institutions without becoming fragile or vague.',
    bullets: [
      'Cross-institution coordination across museums, libraries, scientists, and public-facing teams',
      'Partner enablement structures that support implementation rather than just participation',
      'Shared pathways for alignment, communication, and sustainable delivery'
    ]
  },
  evaluation: {
    kicker: 'Evaluation',
    title: 'I use evidence to improve the next version of the work.',
    body:
      'Evaluation matters most when it changes design, not just reporting. I use reach, adoption, qualitative feedback, and implementation patterns to understand what is holding, what is not, and what needs to be redesigned.',
    bullets: [
      'Evaluation-informed improvement across programs and networks',
      'Translation of findings into actionable strategic recommendations',
      'Use of evidence to strengthen usability, sustainability, and relevance'
    ]
  },
  translation: {
    kicker: 'Translation',
    title: 'I make specialized knowledge legible without making it flat.',
    body:
      'A core part of my work is interpretive. I move between experts, educators, leadership, partners, and public audiences with enough precision that each group can act while the original meaning stays intact.',
    bullets: [
      'Leadership briefs, framing documents, and synthesis decks',
      'Audience-centered translation across science, strategy, and public learning',
      'Narrative structures that preserve both rigor and accessibility'
    ]
  },
  digital: {
    kicker: 'Digital design',
    title: 'I treat interface and front-end structure as forms of strategic clarity.',
    body:
      'I build in HTML, CSS, and JavaScript not only to present work, but to think through hierarchy, usability, interaction, and proof. Working in the medium sharpens how I design for attention, understanding, and flow.',
    bullets: [
      'Semantic front-end development and responsive layout',
      'Information architecture and interaction design',
      'Design systems that balance elegance, usability, and legibility'
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
    const nextTheme = theme === 'daybreak' ? 'daybreak' : 'obsidian';
    body.setAttribute('data-theme', nextTheme);
    html.setAttribute('data-theme', nextTheme);
    toggle.setAttribute('aria-pressed', String(nextTheme === 'daybreak'));

    if (label) {
      label.textContent = nextTheme === 'daybreak' ? 'Daybreak mode' : 'Obsidian mode';
    }
  }

  let initialTheme = 'obsidian';
  try {
    const savedTheme = window.localStorage.getItem(storageKey);
    if (savedTheme === 'daybreak') {
      initialTheme = 'daybreak';
    }
  } catch {
    // Ignore storage failures
  }

  applyTheme(initialTheme);

  toggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme') === 'daybreak' ? 'daybreak' : 'obsidian';
    const nextTheme = currentTheme === 'obsidian' ? 'daybreak' : 'obsidian';
    applyTheme(nextTheme);

    try {
      window.localStorage.setItem(storageKey, nextTheme);
    } catch {
      // Ignore storage failures
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
      const lensKey = chip.getAttribute('data-lens');
      if (!lensKey || !HERO_LENS_COPY[lensKey]) return;

      chips.forEach((item) => {
        item.classList.remove('is-active');
        item.setAttribute('aria-selected', 'false');
      });

      chip.classList.add('is-active');
      chip.setAttribute('aria-selected', 'true');
      updateLens(lensKey);
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
      if (!key || !MATRIX_COPY[key]) return;

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

function initHeaderIntensity() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 24) {
      header.classList.add('is-condensed');
    } else {
      header.classList.remove('is-condensed');
    }
  }

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

function initScrollSpyAndReveal() {
  const sections = document.querySelectorAll('[data-section]');
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
      threshold: 0.28,
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
  initHeaderIntensity();
  initScrollSpyAndReveal();

  document.body.classList.add('is-loaded');
});

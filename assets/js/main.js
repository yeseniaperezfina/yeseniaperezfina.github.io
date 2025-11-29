// Main script for Yesenia's portfolio

document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initScrollSpy();
  initSectionReveal();
  initRoleChips();
});

/**
 * Set footer year
 */
function setYear() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/**
 * Scroll spy: highlight nav-link based on section in view
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('[data-section]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

  const linkMap = {};
  navLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('#')) {
      const id = href.slice(1);
      linkMap[id] = link;
    }
  });

  let currentId = null;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        if (!id || !linkMap[id]) return;
        if (currentId === id) return;

        currentId = id;
        navLinks.forEach(link => link.classList.remove('is-active'));
        linkMap[id].classList.add('is-active');
      });
    },
    {
      threshold: 0.4
    }
  );

  sections.forEach(section => observer.observe(section));
}

/**
 * Section reveal: add .section-visible when sections intersect
 */
function initSectionReveal() {
  const sections = document.querySelectorAll('.section');
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('section-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.25
    }
  );

  sections.forEach(section => observer.observe(section));
}

/**
 * Role chips: update note text and active state
 */
function initRoleChips() {
  const chips = document.querySelectorAll('[data-role-chip]');
  const note = document.getElementById('role-note');
  if (!chips.length || !note) return;

  const copy = {
    Strategist:
      'As a <strong>Strategist</strong>, I design portfolios, initiatives, and learning environments that connect mission, data, and lived experience—helping teams see the system, not just the project.',
    Scholar:
      'As a <strong>Scholar</strong>, I draw from higher education research, learning sciences, and organizational theory to shape systems that are rigorous, humane, and sustainable.',
    Creator:
      'As a <strong>Creator</strong>, I use visual storytelling and writing—including <em>The Echo Jar</em>—to translate complex science and systems into narratives that feel accessible and worth caring about.',
    Navigator:
      'As a <strong>Navigator</strong>, I help teams move through ambiguity with clarity and care, tending to timelines, relationships, and the emotional texture of change.'
  };

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const role = chip.getAttribute('data-role-chip');
      chips.forEach(c => c.classList.remove('chip--active'));
      chip.classList.add('chip--active');

      if (role && copy[role]) {
        note.innerHTML = copy[role];
      }
    });
  });
}

(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('.atlas-nav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateHeader = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const closeMenu = (restoreFocus = false) => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    if (restoreFocus) menuButton.focus();
  };

  menuButton?.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    nav?.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
      closeMenu(true);
    }
  });

  document.addEventListener('click', (event) => {
    if (menuButton?.getAttribute('aria-expanded') !== 'true' || !nav || !menuButton) return;
    if (!(event.target instanceof Node)) return;
    if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });

  const reveals = [...document.querySelectorAll('.reveal')];
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

    reveals.forEach((element) => revealObserver.observe(element));
  }

  const lensButtons = [...document.querySelectorAll('[data-lens]')];
  const workNodes = [...document.querySelectorAll('.work-node[data-tags]')];
  const workSystem = document.querySelector('[data-work-system]');

  const applyLens = (lens) => {
    lensButtons.forEach((button) => {
      const active = button.dataset.lens === lens;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    workNodes.forEach((node) => {
      const tags = (node.dataset.tags || '').split(/\s+/);
      const matches = lens === 'all' || tags.includes(lens);
      node.classList.toggle('is-muted', !matches);
      node.classList.toggle('is-focused', matches && lens !== 'all');
    });

    if (workSystem) workSystem.dataset.activeLens = lens;
  };

  lensButtons.forEach((button) => {
    button.addEventListener('click', () => applyLens(button.dataset.lens || 'all'));
  });

  const grammar = document.querySelector('.case-grammar');
  const grammarLinks = grammar ? [...grammar.querySelectorAll('a[href^="#"]')] : [];
  const grammarSections = grammarLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActiveChapter = (id) => {
    grammarLinks.forEach((link) => {
      const active = link.getAttribute('href') === `#${id}`;
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  if (grammarSections.length && 'IntersectionObserver' in window) {
    const chapterObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActiveChapter(visible.target.id);
    }, { rootMargin: '-24% 0px -58% 0px', threshold: [0, 0.05, 0.2, 0.5] });

    grammarSections.forEach((section) => chapterObserver.observe(section));
  }

  const anchorLinks = [...document.querySelectorAll('a[href^="#"]')];
  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const selector = link.getAttribute('href');
      if (!selector || selector === '#') return;
      const target = document.querySelector(selector);
      if (!target) return;
      if (grammar?.contains(link) && target.id) setActiveChapter(target.id);
      if (reduceMotion) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', selector);
    });
  });
})();

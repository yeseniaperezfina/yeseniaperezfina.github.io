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

  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') closeMenu(true);
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

  lensButtons.forEach((button) => button.addEventListener('click', () => applyLens(button.dataset.lens || 'all')));

  const setupTrackedNav = (selector, options = {}) => {
    const trackedNav = document.querySelector(selector);
    if (!trackedNav) return { nav: null, setActive: () => {} };

    const links = [...trackedNav.querySelectorAll('a[href^="#"]')];
    const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);

    const setActive = (id) => {
      links.forEach((link) => {
        const active = link.getAttribute('href') === `#${id}`;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
        if (options.inlineColor) link.style.color = active ? options.inlineColor : '';
      });
    };

    if (sections.length && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      }, { rootMargin: '-24% 0px -58% 0px', threshold: [0, 0.05, 0.2, 0.5] });
      sections.forEach((section) => observer.observe(section));
    }

    return { nav: trackedNav, setActive };
  };

  const caseTracker = setupTrackedNav('.case-grammar', { inlineColor: 'var(--case-accent)' });
  const strandTracker = setupTrackedNav('.strand-nav');

  const activeSecondaryNav = () => document.querySelector('.case-grammar, .strand-nav');

  const revealTarget = (target) => {
    if (target.classList.contains('reveal')) target.classList.add('is-visible');
    target.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
  };

  const scrollToTarget = (target, behavior = 'auto') => {
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const secondaryHeight = activeSecondaryNav()?.getBoundingClientRect().height || 0;
    const offset = headerHeight + secondaryHeight + 16;
    const top = window.scrollY + target.getBoundingClientRect().top - offset;
    window.scrollTo({ top: Math.max(0, top), behavior });
  };

  const syncTrackedNav = (target) => {
    if (!target?.id) return;
    caseTracker.setActive(target.id);
    strandTracker.setActive(target.id);
  };

  document.querySelectorAll('.case-map-frame iframe').forEach((frame) => {
    frame.style.width = '100%';
    frame.style.height = 'min(62vw, 560px)';
    frame.style.minHeight = '360px';
    frame.style.border = '0';
    frame.style.display = 'block';
  });

  document.querySelectorAll('.case-system-grid h3 span').forEach((span) => {
    span.style.font = 'inherit';
    span.style.color = 'inherit';
  });

  const anchorLinks = [...document.querySelectorAll('a[href^="#"]')];
  anchorLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const selector = link.getAttribute('href');
      if (!selector || selector === '#') return;
      const target = document.querySelector(selector);
      if (!target) return;
      event.preventDefault();
      revealTarget(target);
      syncTrackedNav(target);
      scrollToTarget(target, reduceMotion ? 'auto' : 'smooth');
      history.pushState(null, '', selector);
    });
  });

  const restoreDeepLink = () => {
    if (!window.location.hash || window.location.hash === '#') return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    revealTarget(target);
    syncTrackedNav(target);
    requestAnimationFrame(() => requestAnimationFrame(() => scrollToTarget(target, 'auto')));
  };

  if (document.readyState === 'complete') restoreDeepLink();
  else window.addEventListener('load', restoreDeepLink, { once: true });
})();

(() => {
  /* Shared visual layers. The cleanup layer loads last so QA fixes win the cascade. */
  ['assets/css/visual-story.css','assets/css/portfolio-cleanup.css'].forEach((href) => {
    const file = href.split('/').pop();
    const loaded = [...document.querySelectorAll('link[rel="stylesheet"]')]
      .some((link) => link.getAttribute('href')?.split('?')[0].endsWith(file));
    if (loaded) return;
    const layer = document.createElement('link');
    layer.rel = 'stylesheet';
    layer.href = href;
    layer.dataset.portfolioLayer = 'true';
    document.head.appendChild(layer);
  });

  const page = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const pageStoryClasses = {
    'index.html':['home-story'],
    'work.html':['work-story'],
    'about.html':['about-story'],
    'research.html':['research-story'],
    'writing.html':['echo-story'],
    'case-study-hawaii.html':['hawaii-story'],
    'case-study-iln.html':['iln-story'],
    'case-study-storimap.html':['storimap-story'],
    'case-study-roman.html':['roman-story'],
    'case-study-webb-community-events.html':['webb-story']
  };
  document.body?.classList.add('visual-story-ready');
  pageStoryClasses[page]?.forEach((name) => document.body?.classList.add(name));

  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('.menu-button');
  const nav = document.querySelector('.site-nav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let ticking = false;
  const updateHeader = () => { header?.classList.toggle('is-scrolled', window.scrollY > 24); ticking = false; };
  const scheduleHeader = () => { if (ticking) return; ticking = true; window.requestAnimationFrame(updateHeader); };
  updateHeader();
  window.addEventListener('scroll', scheduleHeader, {passive:true});

  const closeMenu = (restoreFocus = false) => {
    if (!menu || !nav) return;
    menu.setAttribute('aria-expanded','false');
    nav.classList.remove('is-open');
    if (restoreFocus) menu.focus();
  };
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('is-open', !open);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', (event) => {
    if (menu?.getAttribute('aria-expanded') !== 'true' || !nav || !menu) return;
    if (!(event.target instanceof Node)) return;
    if (!nav.contains(event.target) && !menu.contains(event.target)) closeMenu();
  });

  const reveals = [...document.querySelectorAll('.reveal')];
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {threshold:.12, rootMargin:'0px 0px -4% 0px'});
  reveals.forEach((el) => observer.observe(el));
})();

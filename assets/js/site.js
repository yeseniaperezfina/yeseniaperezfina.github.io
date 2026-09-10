(() => {
  /* Load the shared visual-story layer on every modern portfolio page. */
  const visualStoryHref = 'assets/css/visual-story.css';
  const hasVisualStory = [...document.querySelectorAll('link[rel="stylesheet"]')]
    .some((link) => link.getAttribute('href')?.endsWith('visual-story.css'));

  if (!hasVisualStory) {
    const visualStory = document.createElement('link');
    visualStory.rel = 'stylesheet';
    visualStory.href = visualStoryHref;
    visualStory.dataset.visualStory = 'true';
    document.head.appendChild(visualStory);
  }

  const page = window.location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const pageStoryClasses = {
    'index.html': ['home-story'],
    'work.html': ['work-story'],
    'about.html': ['about-story'],
    'research.html': ['research-story'],
    'research-archive.html': ['research-story'],
    'writing.html': ['echo-story'],
    'case-study-hawaii.html': ['hawaii-story'],
    'case-study-iln.html': ['iln-story'],
    'case-study-storimap.html': ['storimap-story'],
    'case-study-roman.html': ['roman-story'],
    'case-study-webb-community-events.html': ['webb-story']
  };

  document.body?.classList.add('visual-story-ready');
  pageStoryClasses[page]?.forEach((className) => document.body?.classList.add(className));

  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('.menu-button');
  const nav = document.querySelector('.site-nav');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('is-open', !open);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menu?.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  }));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
})();

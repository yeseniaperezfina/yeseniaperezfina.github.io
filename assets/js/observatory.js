(() => {
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  body.classList.add('js-ready');

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  if (!reduceMotion) {
    let ticking = false;
    window.addEventListener('pointermove', (event) => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const x = clamp((event.clientX / window.innerWidth) * 100, 0, 100);
        const y = clamp((event.clientY / window.innerHeight) * 100, 0, 100);
        root.style.setProperty('--mouse-x', `${x}%`);
        root.style.setProperty('--mouse-y', `${y}%`);
        ticking = false;
      });
    }, { passive: true });
  }

  const revealTargets = document.querySelectorAll([
    '.hero-thesis',
    '.systems-index',
    '.telemetry-band',
    '.systems-map-section',
    '.section-heading',
    '.archive-relief',
    '.case-study',
    '.theory-content',
    '.research-themes article',
    '.burden-list',
    '.principle-grid article',
    '.writing-layout',
    '.contact-layout'
  ].join(','));

  revealTargets.forEach((element) => element.classList.add('observatory-reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach((element) => revealObserver.observe(element));

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    const id = visible.target.getAttribute('id');
    body.dataset.section = id;
    navLinks.forEach((link) => {
      link.dataset.active = link.getAttribute('href') === `#${id}` ? 'true' : 'false';
    });
  }, { threshold: [0.2, 0.4, 0.6], rootMargin: '-18% 0px -48% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));

  const mapNodes = document.querySelectorAll('.map-node');
  mapNodes.forEach((node) => {
    node.addEventListener('mouseenter', () => node.dataset.active = 'true');
    node.addEventListener('mouseleave', () => node.dataset.active = 'false');
    node.addEventListener('focus', () => node.dataset.active = 'true');
    node.addEventListener('blur', () => node.dataset.active = 'false');
  });
})();

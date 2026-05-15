(() => {
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  body.classList.add('js-ready');

  const room = document.createElement('div');
  room.className = 'observatory-room';
  room.setAttribute('aria-hidden', 'true');

  const lamp = document.createElement('div');
  lamp.className = 'observatory-lamp';
  lamp.setAttribute('aria-hidden', 'true');

  const lens = document.createElement('div');
  lens.className = 'observatory-lens';
  lens.setAttribute('aria-hidden', 'true');

  const gauge = document.createElement('div');
  gauge.className = 'scroll-gauge';
  gauge.setAttribute('aria-hidden', 'true');

  body.prepend(room, lamp, lens, gauge);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const updateProgress = () => {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = clamp(window.scrollY / maxScroll, 0, 1);
    root.style.setProperty('--scroll-progress', progress.toFixed(4));
  };

  updateProgress();
  window.addEventListener('scroll', () => window.requestAnimationFrame(updateProgress), { passive: true });
  window.addEventListener('resize', () => window.requestAnimationFrame(updateProgress), { passive: true });

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

  const enterButton = document.querySelector('[data-enter-archive]');
  if (enterButton) {
    enterButton.addEventListener('click', () => {
      body.classList.add('archive-entered');
      const target = document.querySelector('#about');
      if (target) {
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  }

  const revealTargets = document.querySelectorAll([
    '.threshold-section',
    '.threshold-panel',
    '.threshold-aperture',
    '.hero-thesis',
    '.systems-index',
    '.telemetry-band',
    '.systems-map-section',
    '.section-heading',
    '.archive-relief',
    '.case-study',
    '.case-node',
    '.case-reveal',
    '.theory-content',
    '.research-themes article',
    '.burden-list',
    '.principle-grid article',
    '.writing-layout',
    '.contact-layout',
    '.archive-record'
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
  const navLinks = document.querySelectorAll('.site-nav a[href^="#"], .site-nav a[href^="index.html#"]');
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    const id = visible.target.getAttribute('id');
    body.dataset.section = id;
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const target = href.includes('#') ? href.split('#').pop() : '';
      link.dataset.active = target === id ? 'true' : 'false';
    });
  }, { threshold: [0.18, 0.36, 0.58], rootMargin: '-18% 0px -48% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));

  const mapNodes = document.querySelectorAll('.map-node');
  mapNodes.forEach((node) => {
    node.addEventListener('mouseenter', () => node.dataset.active = 'true');
    node.addEventListener('mouseleave', () => node.dataset.active = 'false');
    node.addEventListener('focus', () => node.dataset.active = 'true');
    node.addEventListener('blur', () => node.dataset.active = 'false');
  });

  const caseStudies = document.querySelectorAll('.case-study');
  caseStudies.forEach((study) => {
    study.addEventListener('pointerenter', () => {
      if (study.id) body.dataset.case = study.id;
    });
    study.addEventListener('focusin', () => {
      if (study.id) body.dataset.case = study.id;
    });
  });
})();

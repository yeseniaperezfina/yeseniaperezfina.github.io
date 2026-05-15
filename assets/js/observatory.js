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

  const thresholdTitle = document.querySelector('#entry-title');
  const thresholdSubtitle = document.querySelector('.threshold-subtitle');
  const thresholdPrimary = document.querySelector('[data-enter-archive]');
  const thresholdSecondary = document.querySelector('.threshold-actions .button-secondary');
  const thresholdNote = document.querySelector('.threshold-note');

  if (thresholdTitle) thresholdTitle.textContent = 'The glass observatory.';
  if (thresholdSubtitle) {
    thresholdSubtitle.textContent = 'A quiet instrument for reading science, governance, learning systems, and public meaning-making.';
  }
  if (thresholdPrimary) thresholdPrimary.textContent = 'Begin Orientation';
  if (thresholdSecondary) thresholdSecondary.textContent = 'Trace the Systems Map';
  if (thresholdNote) {
    thresholdNote.textContent = 'Scroll, move, or follow the signal. The homepage begins as the instrument comes into focus.';
  }

  const clampProgress = () => {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = clamp(window.scrollY / maxScroll, 0, 1);
    root.style.setProperty('--scroll-progress', progress.toFixed(4));
  };

  clampProgress();
  window.addEventListener('scroll', () => window.requestAnimationFrame(clampProgress), { passive: true });
  window.addEventListener('resize', () => window.requestAnimationFrame(clampProgress), { passive: true });

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

  const moveToHomepage = () => {
    body.classList.add('archive-entered');
    const target = document.querySelector('#about');
    if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  };

  if (thresholdPrimary) {
    thresholdPrimary.addEventListener('click', moveToHomepage);
  }

  let thresholdScrollArmed = true;
  const threshold = document.querySelector('#entry');
  window.addEventListener('wheel', (event) => {
    if (!threshold || !thresholdScrollArmed || event.deltaY <= 18) return;
    const thresholdRect = threshold.getBoundingClientRect();
    const mostlyAtThreshold = thresholdRect.top > -80 && thresholdRect.bottom > window.innerHeight * 0.52;
    if (!mostlyAtThreshold) return;
    thresholdScrollArmed = false;
    moveToHomepage();
    window.setTimeout(() => { thresholdScrollArmed = true; }, 1400);
  }, { passive: true });

  window.addEventListener('keydown', (event) => {
    if (!thresholdScrollArmed || !['ArrowDown', 'PageDown', ' '].includes(event.key)) return;
    const thresholdRect = threshold?.getBoundingClientRect();
    if (!thresholdRect || thresholdRect.top < -80) return;
    thresholdScrollArmed = false;
    moveToHomepage();
    window.setTimeout(() => { thresholdScrollArmed = true; }, 1400);
  });

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

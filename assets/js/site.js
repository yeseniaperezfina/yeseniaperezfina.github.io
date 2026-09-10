(() => {
  /* Shared visual-story layer. Kept here so every page using the site shell
     receives the same image/color system without duplicating stylesheet tags. */
  if (!document.querySelector('link[href$="visual-story.css"]')) {
    const visualStyles = document.createElement('link');
    visualStyles.rel = 'stylesheet';
    visualStyles.href = 'assets/css/visual-story.css';
    document.head.appendChild(visualStyles);
  }

  const body = document.body;
  if (document.querySelector('#film')) body?.classList.add('hawaii-story');
  if (document.querySelector('.partnership-result')) body?.classList.add('iln-story');
  if (document.querySelector('.quiet-about-hero')) body?.classList.add('about-story');
  if (document.querySelector('.quiet-hero')) body?.classList.add('home-story');

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

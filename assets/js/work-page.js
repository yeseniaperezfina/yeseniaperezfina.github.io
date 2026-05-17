(() => {
  const body = document.body;
  const navLinks = [...document.querySelectorAll('.page-controls a')];
  const hotspots = [...document.querySelectorAll('.work-hotspot')];
  const workCopy = document.querySelector('[data-work-copy]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const safely = (fn) => {
    try { return fn(); } catch { return null; }
  };

  if (safely(() => sessionStorage.getItem('entered-from-library-work')) === 'true' && !reduceMotion) {
    body.classList.add('is-opening-book');
    safely(() => sessionStorage.removeItem('entered-from-library-work'));
    window.setTimeout(() => body.classList.remove('is-opening-book'), 980);
  }

  hotspots.forEach((hotspot) => {
    hotspot.addEventListener('click', () => {
      hotspots.forEach((item) => item.classList.toggle('is-active', item === hotspot));
      if (workCopy) workCopy.textContent = hotspot.dataset.copy || '';
    });
  });

  navLinks.forEach((link) => {
    if (reduceMotion) return;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      body.classList.add('is-closing-book');
      window.setTimeout(() => { window.location.href = link.href; }, 520);
    });
  });
})();

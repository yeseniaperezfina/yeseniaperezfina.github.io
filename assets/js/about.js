(() => {
  const body = document.body;
  const scene = document.querySelector('.about-scene');
  const navLinks = [...document.querySelectorAll('.page-controls a')];
  const hotspots = [...document.querySelectorAll('.about-hotspot')];
  const aboutCopy = document.querySelector('[data-about-copy]');
  const core = window.StudyCore;
  const reduceMotion = core ? core.reduceMotion : window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!scene) return;

  const hotspotClasses = [
    'is-hotspot-volume',
    'is-hotspot-do',
    'is-hotspot-think',
    'is-hotspot-care'
  ];

  const safely = (fn) => {
    try { return fn(); } catch { return null; }
  };

  const setHotspotAtmosphere = (hotspot) => {
    if (reduceMotion || !hotspot) return;
    body.classList.remove(...hotspotClasses);
    scene.classList.remove(...hotspotClasses);

    const key = hotspot.dataset.hotspot || hotspot.className.match(/hotspot-([\w-]+)/)?.[1] || 'volume';
    body.classList.add('is-about-hovering', `is-hotspot-${key}`);
    scene.classList.add('is-about-hovering', `is-hotspot-${key}`);
  };

  const clearHotspotAtmosphere = () => {
    if (reduceMotion) return;
    body.classList.remove('is-about-hovering', ...hotspotClasses);
    scene.classList.remove('is-about-hovering', ...hotspotClasses);
  };

  const storage = core?.storage;
  if ((storage ? storage.has('entered-from-library-about') : safely(() => sessionStorage.getItem('entered-from-library-about')) === 'true') && !reduceMotion) {
    body.classList.add('is-opening-book');
    storage ? storage.clear('entered-from-library-about') : safely(() => sessionStorage.removeItem('entered-from-library-about'));
    window.setTimeout(() => body.classList.remove('is-opening-book'), 980);
  }

  hotspots.forEach((hotspot) => {
    const match = hotspot.className.match(/hotspot-([\w-]+)/);
    if (match && !hotspot.dataset.hotspot) hotspot.dataset.hotspot = match[1];

    hotspot.addEventListener('pointerenter', () => setHotspotAtmosphere(hotspot));
    hotspot.addEventListener('pointerleave', clearHotspotAtmosphere);
    hotspot.addEventListener('focus', () => setHotspotAtmosphere(hotspot));
    hotspot.addEventListener('blur', clearHotspotAtmosphere);

    hotspot.addEventListener('click', () => {
      hotspots.forEach((item) => item.classList.toggle('is-active', item === hotspot));
      setHotspotAtmosphere(hotspot);
      if (aboutCopy) aboutCopy.textContent = hotspot.dataset.copy || '';
    });
  });

  navLinks.forEach((link) => {
    if (reduceMotion) return;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      body.classList.add('is-closing-book');

      if (link.classList.contains('next-link')) {
        safely(() => sessionStorage.setItem('entered-from-library-work', 'true'));
      } else if (link.classList.contains('library-link')) {
        if (storage) storage.set('returned-from-about', 'true');
        else safely(() => sessionStorage.setItem('returned-from-about', 'true'));
      }

      window.setTimeout(() => { window.location.href = link.href; }, 520);
    });
  });
})();

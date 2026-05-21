(() => {
  const body = document.body;
  const navLinks = [...document.querySelectorAll('.page-controls a')];
  const hotspots = [...document.querySelectorAll('.research-hotspot')];
  const researchCopy = document.querySelector('[data-research-copy]');
  const backdropImage = document.querySelector('.research-backdrop img');
  const core = window.StudyCore;
  const reduceMotion = core ? core.reduceMotion : window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hotspotClasses = [
    'is-hotspot-thesis',
    'is-hotspot-chain',
    'is-hotspot-credit',
    'is-hotspot-inquiry',
    'is-hotspot-method'
  ];

  const safely = (fn) => {
    try { return fn(); } catch { return null; }
  };

  const markAssetLoaded = () => {
    body.classList.remove('has-missing-research-asset');
    body.classList.add('has-loaded-research-asset');
  };

  const markAssetMissing = () => {
    body.classList.remove('has-loaded-research-asset');
    body.classList.add('has-missing-research-asset');
  };

  if (backdropImage) {
    body.classList.add('is-checking-research-asset');
    if (backdropImage.complete) {
      backdropImage.naturalWidth > 0 ? markAssetLoaded() : markAssetMissing();
    }
    backdropImage.addEventListener('load', markAssetLoaded, { once: true });
    backdropImage.addEventListener('error', markAssetMissing, { once: true });
  }

  const setHotspotAtmosphere = (hotspot) => {
    if (reduceMotion || !hotspot) return;
    body.classList.remove(...hotspotClasses);
    body.classList.add('is-research-hovering', `is-hotspot-${hotspot.dataset.hotspot || hotspot.className.match(/hotspot-([\w-]+)/)?.[1] || 'thesis'}`);
  };

  const clearHotspotAtmosphere = () => {
    if (reduceMotion) return;
    body.classList.remove('is-research-hovering', ...hotspotClasses);
  };

  if (safely(() => sessionStorage.getItem('entered-from-library-research')) === 'true' && !reduceMotion) {
    body.classList.add('is-opening-book');
    safely(() => sessionStorage.removeItem('entered-from-library-research'));
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
      if (researchCopy) researchCopy.textContent = hotspot.dataset.copy || '';
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
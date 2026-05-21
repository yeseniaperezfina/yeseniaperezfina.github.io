(() => {
  const body = document.body;
  const navLinks = [...document.querySelectorAll('.page-controls a')];
  const hotspots = [...document.querySelectorAll('.systems-hotspot')];
  const systemsCopy = document.querySelector('[data-systems-copy]');
  const backdropImage = document.querySelector('.systems-backdrop img');
  const core = window.StudyCore;
  const reduceMotion = core ? core.reduceMotion : window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hotspotClasses = [
    'is-hotspot-architecture',
    'is-hotspot-mission',
    'is-hotspot-interpretive',
    'is-hotspot-network',
    'is-hotspot-public',
    'is-hotspot-trust'
  ];

  const safely = (fn) => {
    try { return fn(); } catch { return null; }
  };

  const markAssetLoaded = () => {
    body.classList.remove('has-missing-systems-asset');
    body.classList.add('has-loaded-systems-asset');
  };

  const markAssetMissing = () => {
    body.classList.remove('has-loaded-systems-asset');
    body.classList.add('has-missing-systems-asset');
  };

  if (backdropImage) {
    body.classList.add('is-checking-systems-asset');
    if (backdropImage.complete) {
      backdropImage.naturalWidth > 0 ? markAssetLoaded() : markAssetMissing();
    }
    backdropImage.addEventListener('load', markAssetLoaded, { once: true });
    backdropImage.addEventListener('error', markAssetMissing, { once: true });
  }

  const setHotspotAtmosphere = (hotspot) => {
    if (reduceMotion || !hotspot) return;
    const hotspotName = hotspot.dataset.hotspot || hotspot.className.match(/hotspot-([\w-]+)/)?.[1] || 'architecture';
    body.classList.remove(...hotspotClasses);
    body.classList.add('is-systems-hovering', `is-hotspot-${hotspotName}`);
  };

  const clearHotspotAtmosphere = () => {
    if (reduceMotion) return;
    body.classList.remove('is-systems-hovering', ...hotspotClasses);
  };

  if (safely(() => sessionStorage.getItem('entered-from-library-systems')) === 'true' && !reduceMotion) {
    body.classList.add('is-opening-book');
    safely(() => sessionStorage.removeItem('entered-from-library-systems'));
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
      if (systemsCopy) systemsCopy.textContent = hotspot.dataset.copy || '';
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
(() => {
  const root = document.documentElement;
  const body = document.body;
  const scene = document.querySelector('.about-scene');
  const navLinks = [...document.querySelectorAll('.page-controls a')];
  const hotspots = [...document.querySelectorAll('.about-hotspot')];
  const roadmapPanel = document.querySelector('.roadmap-panel');
  const roadmapCopy = document.querySelector('[data-roadmap-copy]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const safely = (fn) => {
    try { return fn(); } catch { return null; }
  };

  const hotspotClasses = [
    'is-hotspot-spread',
    'is-hotspot-do',
    'is-hotspot-think',
    'is-hotspot-care'
  ];

  const clearHotspotState = () => {
    if (!scene) return;
    scene.classList.remove('is-spread-hovering', ...hotspotClasses);
  };

  const setHotspotState = (hotspot) => {
    if (!scene || reduceMotion || !hotspot) return;
    const key = hotspot.dataset.hotspot || 'spread';
    scene.classList.remove(...hotspotClasses);
    scene.classList.add('is-spread-hovering', `is-hotspot-${key}`);
  };

  if (safely(() => sessionStorage.getItem('entered-from-library-about')) === 'true' && !reduceMotion) {
    body.classList.add('is-opening-book');
    safely(() => sessionStorage.removeItem('entered-from-library-about'));
    window.setTimeout(() => body.classList.remove('is-opening-book'), 1160);
  }

  if (!reduceMotion) {
    let frameRequested = false;
    window.addEventListener('pointermove', (event) => {
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(() => {
        const width = Math.max(document.documentElement.clientWidth, 1);
        const height = Math.max(document.documentElement.clientHeight, 1);
        root.style.setProperty('--light-x', `${(event.clientX / width) * 100}%`);
        root.style.setProperty('--light-y', `${(event.clientY / height) * 100}%`);
        frameRequested = false;
      });
    }, { passive: true });
  }

  hotspots.forEach((hotspot) => {
    hotspot.addEventListener('pointerenter', () => setHotspotState(hotspot));
    hotspot.addEventListener('pointerleave', () => {
      const active = hotspots.find((item) => item.classList.contains('is-active'));
      if (active) setHotspotState(active);
      else clearHotspotState();
    });
    hotspot.addEventListener('focus', () => setHotspotState(hotspot));
    hotspot.addEventListener('blur', () => {
      const active = hotspots.find((item) => item.classList.contains('is-active'));
      if (active) setHotspotState(active);
      else clearHotspotState();
    });
    hotspot.addEventListener('click', () => {
      hotspots.forEach((item) => item.classList.toggle('is-active', item === hotspot));
      setHotspotState(hotspot);

      if (roadmapCopy) {
        const nextCopy = hotspot.dataset.copy || '';
        if (reduceMotion || !roadmapPanel) {
          roadmapCopy.textContent = nextCopy;
        } else {
          roadmapPanel.classList.add('is-changing');
          window.setTimeout(() => {
            roadmapCopy.textContent = nextCopy;
            roadmapPanel.classList.remove('is-changing');
          }, 120);
        }
      }
    });
  });

  const initialActive = hotspots.find((item) => item.classList.contains('is-active'));
  if (initialActive && !reduceMotion) setHotspotState(initialActive);

  navLinks.forEach((link) => {
    if (reduceMotion) return;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      body.classList.add('is-closing-book');
      window.setTimeout(() => { window.location.href = link.href; }, 560);
    });
  });
})();

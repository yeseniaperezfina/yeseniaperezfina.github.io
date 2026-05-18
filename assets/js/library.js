(() => {
  const root = document.documentElement;
  const body = document.body;
  const hub = document.querySelector('.library-hub');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const volumeClasses = [
    'is-volume-about',
    'is-volume-work',
    'is-volume-research',
    'is-volume-systems',
    'is-volume-voice'
  ];

  const safely = (fn) => {
    try { return fn(); } catch { return null; }
  };

  if (safely(() => sessionStorage.getItem('entered-from-study')) === 'true' && !reduceMotion) {
    body.classList.add('is-arriving');
    safely(() => sessionStorage.removeItem('entered-from-study'));
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => body.classList.remove('is-arriving'));
    });
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

  const clearVolumeState = () => {
    if (!hub) return;
    hub.classList.remove('is-volume-hovering', ...volumeClasses);
  };

  const setVolumeState = (volume) => {
    if (!hub || reduceMotion || !volume) return;
    hub.classList.remove(...volumeClasses);
    hub.classList.add('is-volume-hovering', `is-volume-${volume}`);
  };

  document.querySelectorAll('[data-volume]').forEach((link) => {
    const volume = link.getAttribute('data-volume');
    link.addEventListener('pointerenter', () => setVolumeState(volume));
    link.addEventListener('pointerleave', clearVolumeState);
    link.addEventListener('focus', () => setVolumeState(volume));
    link.addEventListener('blur', clearVolumeState);
  });

  const markVolumeEntry = (mode) => {
    if (mode === 'about') safely(() => sessionStorage.setItem('entered-from-library-about', 'true'));
    if (mode === 'work') safely(() => sessionStorage.setItem('entered-from-library-work', 'true'));
  };

  const getModeFromHref = (href = '') => {
    if (href.endsWith('about.html')) return 'about';
    if (href.endsWith('work-timeline.html')) return 'work';
    return 'default';
  };

  const turnPage = (targetHref, delay = 520, mode = 'default') => {
    if (reduceMotion || !targetHref) return true;
    markVolumeEntry(mode);
    body.classList.add(mode === 'about' ? 'is-turning-about' : mode === 'work' ? 'is-turning-work' : 'is-turning');
    window.setTimeout(() => { window.location.href = targetHref; }, delay);
    return false;
  };

  document.querySelectorAll('.volume-zone, .mobile-volume-list a').forEach((link) => {
    link.addEventListener('click', (event) => {
      const mode = getModeFromHref(link.getAttribute('href') || '');
      const delay = mode === 'about' ? 620 : mode === 'work' ? 600 : 500;
      if (!turnPage(link.href, delay, mode)) event.preventDefault();
    });
  });

  document.querySelectorAll('.threshold-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!turnPage(link.href, 420)) event.preventDefault();
    });
  });
})();

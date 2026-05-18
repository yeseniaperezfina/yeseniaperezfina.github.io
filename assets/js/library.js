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

  const clearStorageFlag = (key) => safely(() => sessionStorage.removeItem(key));
  const hasStorageFlag = (key) => safely(() => sessionStorage.getItem(key)) === 'true';

  if (!reduceMotion && hasStorageFlag('entered-from-study')) {
    body.classList.add('is-arriving');
    clearStorageFlag('entered-from-study');
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => body.classList.remove('is-arriving'));
    });
  }

  if (!reduceMotion && hasStorageFlag('returned-from-about')) {
    body.classList.add('is-returning-from-about');
    clearStorageFlag('returned-from-about');
    window.setTimeout(() => body.classList.remove('is-returning-from-about'), 720);
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

  const transitionClassForMode = (mode) => {
    if (mode === 'about') return 'is-turning-about';
    if (mode === 'work') return 'is-turning-work';
    return 'is-turning';
  };

  const turnPage = (targetHref, delay = 520, mode = 'default') => {
    if (reduceMotion || !targetHref) return true;
    markVolumeEntry(mode);
    body.classList.add(transitionClassForMode(mode));
    if (mode === 'about') setVolumeState('about');
    window.setTimeout(() => { window.location.href = targetHref; }, delay);
    return false;
  };

  document.querySelectorAll('.volume-zone, .mobile-volume-list a').forEach((link) => {
    link.addEventListener('click', (event) => {
      const mode = getModeFromHref(link.getAttribute('href') || '');
      const delay = mode === 'about' ? 780 : mode === 'work' ? 600 : 500;
      if (!turnPage(link.href, delay, mode)) event.preventDefault();
    });
  });

  document.querySelectorAll('.threshold-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!turnPage(link.href, 420)) event.preventDefault();
    });
  });
})();

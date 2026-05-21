(() => {
  const root = document.documentElement;
  const body = document.body;
  const hub = document.querySelector('.library-hub');
  const core = window.StudyCore;

  if (!hub || !core) return;

  const volumeClasses = [
    'is-volume-about',
    'is-volume-work',
    'is-volume-research',
    'is-volume-systems',
    'is-volume-voice'
  ];

  if (!core.reduceMotion && core.storage.has('entered-from-study')) {
    body.classList.add('is-arriving');
    core.storage.clear('entered-from-study');
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => body.classList.remove('is-arriving'));
    });
  }

  if (!core.reduceMotion && core.storage.has('returned-from-about')) {
    body.classList.add('is-returning-from-about');
    core.storage.clear('returned-from-about');
    window.setTimeout(() => body.classList.remove('is-returning-from-about'), 720);
  }

  if (!core.reduceMotion) {
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
    hub.classList.remove('is-volume-hovering', ...volumeClasses);
  };

  const setVolumeState = (volume) => {
    if (core.reduceMotion || !volume) return;
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

  const modeFromHref = (href = '') => {
    if (href.endsWith('about.html')) return 'about';
    if (href.endsWith('work-timeline.html')) return 'work';
    if (href.endsWith('research-archive.html')) return 'research';
    return 'default';
  };

  const transitionForMode = (mode) => {
    if (mode === 'about') return 'is-turning-about';
    if (mode === 'work') return 'is-turning-work';
    if (mode === 'research') return 'is-turning-research';
    return 'is-turning';
  };

  const delayForMode = (mode) => {
    if (mode === 'about' || mode === 'work' || mode === 'research') return 600;
    return 500;
  };

  const storageForMode = (mode) => {
    if (mode === 'about') return 'entered-from-library-about';
    if (mode === 'work') return 'entered-from-library-work';
    if (mode === 'research') return 'entered-from-library-research';
    return null;
  };

  document.querySelectorAll('.volume-zone, .mobile-volume-list a').forEach((link) => {
    link.addEventListener('click', (event) => {
      const mode = modeFromHref(link.getAttribute('href') || '');
      if (mode !== 'default') setVolumeState(mode);

      core.navigateWithClass({
        event,
        href: link.href,
        host: body,
        className: transitionForMode(mode),
        delay: delayForMode(mode),
        storageKey: storageForMode(mode)
      });
    });
  });

  document.querySelectorAll('.threshold-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      core.navigateWithClass({
        event,
        href: link.href,
        host: body,
        className: 'is-turning',
        delay: 420
      });
    });
  });
})();
(() => {
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const arrivedFromStudy = (() => {
    try {
      return sessionStorage.getItem('entered-from-study') === 'true';
    } catch {
      return false;
    }
  })();

  if (arrivedFromStudy && !reduceMotion) {
    body.classList.add('is-arriving');

    try {
      sessionStorage.removeItem('entered-from-study');
    } catch {
      /* Storage may be unavailable in some private browsing contexts. */
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        body.classList.remove('is-arriving');
      });
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

  const markVolumeEntry = (mode) => {
    if (mode === 'about') {
      try {
        sessionStorage.setItem('entered-from-library-about', 'true');
      } catch {
        /* Storage may be unavailable in some private browsing contexts. */
      }
    }

    if (mode === 'work') {
      try {
        sessionStorage.setItem('entered-from-library-work', 'true');
      } catch {
        /* Storage may be unavailable in some private browsing contexts. */
      }
    }
  };

  const turnPage = (targetHref, delay = 520, mode = 'default') => {
    if (reduceMotion || !targetHref) return true;

    markVolumeEntry(mode);

    if (mode === 'about') {
      body.classList.add('is-turning-about');
    } else if (mode === 'work') {
      body.classList.add('is-turning-work');
    } else {
      body.classList.add('is-turning');
    }

    window.setTimeout(() => {
      window.location.href = targetHref;
    }, delay);

    return false;
  };

  document.querySelectorAll('.volume-zone').forEach((zone) => {
    zone.addEventListener('click', (event) => {
      const isAbout = zone.classList.contains('zone-about');
      const isWork = zone.classList.contains('zone-work');
      const mode = isAbout ? 'about' : isWork ? 'work' : 'default';
      const delay = isAbout ? 640 : isWork ? 620 : 520;

      if (!turnPage(zone.href, delay, mode)) {
        event.preventDefault();
      }
    });
  });

  document.querySelectorAll('.mobile-volume-list a').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      const isAbout = href === 'about.html';
      const isWork = href === 'work-timeline.html';
      const mode = isAbout ? 'about' : isWork ? 'work' : 'default';
      const delay = isAbout ? 520 : isWork ? 500 : 380;

      if (!turnPage(link.href, delay, mode)) {
        event.preventDefault();
      }
    });
  });

  document.querySelectorAll('.threshold-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!turnPage(link.href, 420)) event.preventDefault();
    });
  });
})();

(() => {
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const arrivedFromLibrary = (() => {
    try {
      return sessionStorage.getItem('entered-from-library-work') === 'true';
    } catch {
      return false;
    }
  })();

  if (arrivedFromLibrary && !reduceMotion) {
    body.classList.add('is-arriving-from-library');

    try {
      sessionStorage.removeItem('entered-from-library-work');
    } catch {
      /* Storage may be unavailable in some private browsing contexts. */
    }

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        body.classList.remove('is-arriving-from-library');
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
        const x = event.clientX / width;
        const y = event.clientY / height;

        root.style.setProperty('--reader-x', `${x * 100}%`);
        root.style.setProperty('--reader-y', `${y * 100}%`);
        root.style.setProperty('--tilt-x', `${(x - 0.5).toFixed(3)}`);
        root.style.setProperty('--tilt-y', `${(0.5 - y).toFixed(3)}`);

        frameRequested = false;
      });
    }, { passive: true });
  }

  const revealTargets = document.querySelectorAll('.ledger-card, .project-grid article, .work-method');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

    revealTargets.forEach((target, index) => {
      target.style.transitionDelay = `${Math.min(index * 55, 260)}ms`;
      observer.observe(target);
    });
  } else {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  }

  document.querySelectorAll('.library-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (reduceMotion) return;
      event.preventDefault();
      body.classList.add('is-leaving');

      window.setTimeout(() => {
        window.location.href = link.href;
      }, 420);
    });
  });
})();

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

  const updateScrollProgress = () => {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / scrollable, 0), 1);
    root.style.setProperty('--scroll-progress', progress.toFixed(4));
  };

  updateScrollProgress();
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  window.addEventListener('resize', updateScrollProgress, { passive: true });

  if (!reduceMotion) {
    let pointerFrameRequested = false;

    window.addEventListener('pointermove', (event) => {
      if (pointerFrameRequested) return;
      pointerFrameRequested = true;

      window.requestAnimationFrame(() => {
        const width = Math.max(document.documentElement.clientWidth, 1);
        const height = Math.max(document.documentElement.clientHeight, 1);
        const x = event.clientX / width;
        const y = event.clientY / height;

        root.style.setProperty('--reader-x', `${x * 100}%`);
        root.style.setProperty('--reader-y', `${y * 100}%`);
        root.style.setProperty('--tilt-x', `${(x - 0.5).toFixed(3)}`);
        root.style.setProperty('--tilt-y', `${(0.5 - y).toFixed(3)}`);

        pointerFrameRequested = false;
      });
    }, { passive: true });
  }

  const revealTargets = document.querySelectorAll('.reveal-section, .proof-object, .chapter-card, .method-grid li');

  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    revealTargets.forEach((target, index) => {
      target.style.transitionDelay = `${Math.min(index * 35, 260)}ms`;
      revealObserver.observe(target);
    });
  } else {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  }

  const railLinks = Array.from(document.querySelectorAll('[data-rail-link]'));
  const railSections = railLinks
    .map((link) => document.getElementById(link.dataset.railLink))
    .filter(Boolean);

  if ('IntersectionObserver' in window && railLinks.length && railSections.length) {
    const setActiveRail = (id) => {
      railLinks.forEach((link) => {
        const isActive = link.dataset.railLink === id;
        link.classList.toggle('is-active', isActive);
        if (isActive) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });

      document.querySelectorAll('.chapter-card').forEach((card) => {
        card.classList.toggle('is-current', card.id === id);
      });
    };

    const activeObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) setActiveRail(visible.target.id);
    }, { threshold: [0.2, 0.35, 0.5], rootMargin: '-22% 0px -48% 0px' });

    railSections.forEach((section) => activeObserver.observe(section));
  }

  const tabs = Array.from(document.querySelectorAll('[data-dossier-tab]'));
  const panels = Array.from(document.querySelectorAll('[data-dossier-panel]'));

  const activateDossier = (key, focusTab = false) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.dossierTab === key;
      tab.setAttribute('aria-selected', String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
      if (isActive && focusTab) tab.focus();
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.dossierPanel === key;
      panel.classList.toggle('is-active', isActive);
      panel.hidden = !isActive;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateDossier(tab.dataset.dossierTab));
    tab.addEventListener('keydown', (event) => {
      const key = event.key;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;

      event.preventDefault();
      let nextIndex = index;
      if (key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
      if (key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (key === 'Home') nextIndex = 0;
      if (key === 'End') nextIndex = tabs.length - 1;

      activateDossier(tabs[nextIndex].dataset.dossierTab, true);
    });
  });

  if (tabs.length) {
    const activeTab = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
    activateDossier(activeTab.dataset.dossierTab);
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

(() => {
  const body = document.body;
  const backLink = document.querySelector('.library-link');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mapLinks = [...document.querySelectorAll('[data-map-target]')];
  const compassLinks = [...document.querySelectorAll('[data-compass-target]')];
  const annotations = [...document.querySelectorAll('[data-annotation]')];
  const territorySections = [...document.querySelectorAll('[data-section]')];

  const safely = (fn) => {
    try {
      return fn();
    } catch {
      return null;
    }
  };

  const setActiveTerritory = (key) => {
    if (!key) return;

    mapLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.mapTarget === key);
    });

    compassLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.compassTarget === key);
    });

    territorySections.forEach((section) => {
      section.classList.toggle('is-active', section.dataset.section === key);
    });
  };

  const showAnnotation = (key) => {
    annotations.forEach((annotation) => {
      const isCurrent = annotation.dataset.annotation === key;
      annotation.classList.toggle('is-visible', isCurrent);
      annotation.setAttribute('aria-hidden', isCurrent ? 'false' : 'true');
    });
  };

  const clearAnnotations = () => {
    annotations.forEach((annotation) => {
      annotation.classList.remove('is-visible');
      annotation.setAttribute('aria-hidden', 'true');
    });
  };

  if (safely(() => sessionStorage.getItem('entered-from-library-work')) === 'true' && !reduceMotion) {
    body.classList.add('is-arriving-from-library');
    safely(() => sessionStorage.removeItem('entered-from-library-work'));
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => body.classList.remove('is-arriving-from-library'));
    });
  }

  mapLinks.forEach((link) => {
    const key = link.dataset.mapTarget;

    link.addEventListener('mouseenter', () => showAnnotation(key));
    link.addEventListener('mouseleave', clearAnnotations);
    link.addEventListener('focus', () => showAnnotation(key));
    link.addEventListener('blur', clearAnnotations);
    link.addEventListener('click', () => setActiveTerritory(key));
  });

  compassLinks.forEach((link) => {
    link.addEventListener('click', () => setActiveTerritory(link.dataset.compassTarget));
  });

  if ('IntersectionObserver' in window && territorySections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.dataset?.section) {
        setActiveTerritory(visible.target.dataset.section);
      }
    }, {
      root: null,
      threshold: [0.2, 0.35, 0.5, 0.65],
      rootMargin: '-18% 0px -42% 0px',
    });

    territorySections.forEach((section) => observer.observe(section));
  }

  if (backLink && !reduceMotion) {
    backLink.addEventListener('click', (event) => {
      event.preventDefault();
      body.classList.add('is-leaving');
      window.setTimeout(() => {
        window.location.href = backLink.href;
      }, 380);
    });
  }
})();

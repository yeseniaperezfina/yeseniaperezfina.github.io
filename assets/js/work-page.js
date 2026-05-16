(() => {
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

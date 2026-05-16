(() => {
  const body = document.body;
  const backLink = document.querySelector('.library-link');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const safely = (fn) => {
    try {
      return fn();
    } catch {
      return null;
    }
  };

  if (safely(() => sessionStorage.getItem('entered-from-library-work')) === 'true' && !reduceMotion) {
    body.classList.add('is-arriving-from-library');
    safely(() => sessionStorage.removeItem('entered-from-library-work'));
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => body.classList.remove('is-arriving-from-library'));
    });
  }

  if (backLink && !reduceMotion) {
    backLink.addEventListener('click', (event) => {
      event.preventDefault();
      body.classList.add('is-leaving');
      window.setTimeout(() => {
        window.location.href = backLink.href;
      }, 360);
    });
  }
})();

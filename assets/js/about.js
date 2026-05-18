(() => {
  const body = document.body;
  const scene = document.querySelector('.about-scene');
  const libraryLink = document.querySelector('.library-link');
  const pageZones = [...document.querySelectorAll('.about-page-zone')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!scene || !libraryLink) return;

  const safely = (fn) => {
    try { return fn(); } catch { return null; }
  };

  if (safely(() => sessionStorage.getItem('entered-from-library-about')) === 'true' && !reduceMotion) {
    body.classList.add('is-opening-book');
    safely(() => sessionStorage.removeItem('entered-from-library-about'));
    window.setTimeout(() => body.classList.remove('is-opening-book'), 760);
  }

  const clearPageState = () => {
    if (reduceMotion) return;
    scene.classList.remove('is-left-page-hovering', 'is-right-page-hovering');
  };

  const setPageState = (zone) => {
    if (reduceMotion || !zone) return;
    const isLeft = zone.classList.contains('page-zone-left');
    scene.classList.toggle('is-left-page-hovering', isLeft);
    scene.classList.toggle('is-right-page-hovering', !isLeft);
  };

  const setLibraryHoverState = (isHovering) => {
    if (reduceMotion) return;
    scene.classList.toggle('is-library-hovering', isHovering);
  };

  pageZones.forEach((zone) => {
    zone.addEventListener('pointerenter', () => setPageState(zone));
    zone.addEventListener('pointerleave', clearPageState);
    zone.addEventListener('focus', () => setPageState(zone));
    zone.addEventListener('blur', clearPageState);
    zone.addEventListener('click', () => setPageState(zone));
  });

  libraryLink.addEventListener('pointerenter', () => setLibraryHoverState(true));
  libraryLink.addEventListener('pointerleave', () => setLibraryHoverState(false));
  libraryLink.addEventListener('focus', () => setLibraryHoverState(true));
  libraryLink.addEventListener('blur', () => setLibraryHoverState(false));

  libraryLink.addEventListener('click', (event) => {
    if (reduceMotion) return;

    event.preventDefault();
    safely(() => sessionStorage.setItem('returned-from-about', 'true'));
    body.classList.add('is-closing-book');

    window.setTimeout(() => {
      window.location.href = libraryLink.href;
    }, 600);
  });
})();

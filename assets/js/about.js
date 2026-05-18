(() => {
  const body = document.body;
  const scene = document.querySelector('.about-scene');
  const libraryLink = document.querySelector('.library-link');
  const mapPoints = [...document.querySelectorAll('.map-point')];
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

  const clearMapState = () => {
    if (reduceMotion) return;
    scene.classList.remove('is-map-left', 'is-map-right');
  };

  const setMapState = (point) => {
    if (reduceMotion || !point) return;
    const side = point.dataset.mapPoint;
    scene.classList.toggle('is-map-left', side === 'left');
    scene.classList.toggle('is-map-right', side === 'right');
  };

  const setLibraryHoverState = (isHovering) => {
    if (reduceMotion) return;
    scene.classList.toggle('is-library-hovering', isHovering);
  };

  mapPoints.forEach((point) => {
    point.addEventListener('pointerenter', () => setMapState(point));
    point.addEventListener('pointerleave', clearMapState);
    point.addEventListener('focus', () => setMapState(point));
    point.addEventListener('blur', clearMapState);
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

(() => {
  const body = document.body;
  const scene = document.querySelector('.about-scene');
  const libraryLink = document.querySelector('.library-link');
  const calloutNodes = [...document.querySelectorAll('.callout-node')];
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

  const clearCalloutState = () => {
    if (reduceMotion) return;
    scene.classList.remove('is-callout-left', 'is-callout-right');
  };

  const setCalloutState = (node) => {
    if (reduceMotion || !node) return;
    const side = node.dataset.callout;
    scene.classList.toggle('is-callout-left', side === 'left');
    scene.classList.toggle('is-callout-right', side === 'right');
  };

  const setLibraryHoverState = (isHovering) => {
    if (reduceMotion) return;
    scene.classList.toggle('is-library-hovering', isHovering);
  };

  calloutNodes.forEach((node) => {
    node.addEventListener('pointerenter', () => setCalloutState(node));
    node.addEventListener('pointerleave', clearCalloutState);
    node.addEventListener('focus', () => setCalloutState(node));
    node.addEventListener('blur', clearCalloutState);
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

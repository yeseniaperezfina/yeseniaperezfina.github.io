(() => {
  const body = document.body;
  const scene = document.querySelector('.about-scene');
  const libraryLink = document.querySelector('.library-link');
  const glowTargets = [...document.querySelectorAll('.glow-target')];
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

  const glowStateClasses = ['is-volume-glowing', 'is-icon-do-glowing', 'is-icon-think-glowing', 'is-icon-care-glowing'];

  const clearGlowState = () => {
    if (reduceMotion) return;
    scene.classList.remove(...glowStateClasses);
  };

  const setGlowState = (target) => {
    if (reduceMotion || !target) return;
    const key = target.dataset.glowTarget;
    scene.classList.remove(...glowStateClasses);
    if (key === 'volume') scene.classList.add('is-volume-glowing');
    if (key === 'do') scene.classList.add('is-icon-do-glowing');
    if (key === 'think') scene.classList.add('is-icon-think-glowing');
    if (key === 'care') scene.classList.add('is-icon-care-glowing');
  };

  const setLibraryHoverState = (isHovering) => {
    if (reduceMotion) return;
    scene.classList.toggle('is-library-hovering', isHovering);
  };

  glowTargets.forEach((target) => {
    target.addEventListener('pointerenter', () => setGlowState(target));
    target.addEventListener('pointerleave', clearGlowState);
    target.addEventListener('focus', () => setGlowState(target));
    target.addEventListener('blur', clearGlowState);
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

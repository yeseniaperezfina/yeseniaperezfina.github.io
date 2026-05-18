(() => {
  const body = document.body;
  const scene = document.querySelector('.about-scene');
  const libraryLink = document.querySelector('.library-link');
  const illuminationTargets = [...document.querySelectorAll('.illumination-target')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!scene || !libraryLink) return;

  const safely = (fn) => {
    try { return fn(); } catch { return null; }
  };

  if (safely(() => sessionStorage.getItem('entered-from-library-about')) === 'true' && !reduceMotion) {
    body.classList.add('is-opening-book');
    safely(() => sessionStorage.removeItem('entered-from-library-about'));
    window.setTimeout(() => body.classList.remove('is-opening-book'), 900);
  }

  const classByIllumination = {
    volume: 'is-volume-illuminated',
    do: 'is-icon-do-illuminated',
    think: 'is-icon-think-illuminated',
    care: 'is-icon-care-illuminated'
  };

  const illuminationClasses = Object.values(classByIllumination);

  const clearIllumination = () => {
    if (reduceMotion) return;
    scene.classList.remove(...illuminationClasses);
  };

  const setIllumination = (target) => {
    if (reduceMotion || !target) return;
    const stateClass = classByIllumination[target.dataset.illumination];
    scene.classList.remove(...illuminationClasses);
    if (stateClass) scene.classList.add(stateClass);
  };

  const setLibraryHoverState = (isHovering) => {
    if (reduceMotion) return;
    scene.classList.toggle('is-library-hovering', isHovering);
  };

  illuminationTargets.forEach((target) => {
    target.addEventListener('pointerenter', () => setIllumination(target));
    target.addEventListener('pointerleave', clearIllumination);
    target.addEventListener('focus', () => setIllumination(target));
    target.addEventListener('blur', clearIllumination);
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

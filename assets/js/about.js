(() => {
  const body = document.body;
  const scene = document.querySelector('.about-scene');
  const libraryLink = document.querySelector('.library-link');
  const illuminationTargets = [...document.querySelectorAll('.illumination-target')];
  const calloutCards = [...document.querySelectorAll('.callout-card')];
  const core = window.StudyCore;

  if (!scene || !libraryLink || !core) return;

  if (core.storage.has('entered-from-library-about') && !core.reduceMotion) {
    body.classList.add('is-opening-book');
    core.storage.clear('entered-from-library-about');
    window.setTimeout(() => body.classList.remove('is-opening-book'), 900);
  }

  const classByIllumination = {
    volume: 'is-volume-illuminated',
    do: 'is-icon-do-illuminated',
    think: 'is-icon-think-illuminated',
    care: 'is-icon-care-illuminated'
  };

  const illuminationClasses = Object.values(classByIllumination);
  let activeCardKey = null;
  let exitTimer = null;

  const setActiveCard = (key) => {
    if (!calloutCards.length || key === activeCardKey) return;

    window.clearTimeout(exitTimer);
    scene.classList.toggle('has-active-callout', Boolean(key));

    calloutCards.forEach((card) => {
      const wasActive = card.dataset.card === activeCardKey;
      const isActive = card.dataset.card === key;

      card.classList.toggle('is-active', isActive);
      card.classList.toggle('is-exiting', Boolean(key) && wasActive && !isActive);
    });

    activeCardKey = key;

    exitTimer = window.setTimeout(() => {
      calloutCards.forEach((card) => card.classList.remove('is-exiting'));
    }, 420);
  };

  const clearIllumination = () => {
    if (core.reduceMotion) return;
    scene.classList.remove(...illuminationClasses);
    setActiveCard(null);
  };

  const setIllumination = (target) => {
    if (core.reduceMotion || !target) return;
    const key = target.dataset.illumination;
    const stateClass = classByIllumination[key];
    scene.classList.remove(...illuminationClasses);
    if (stateClass) scene.classList.add(stateClass);
    setActiveCard(key);
  };

  illuminationTargets.forEach((target) => {
    target.addEventListener('pointerenter', () => setIllumination(target));
    target.addEventListener('pointerleave', clearIllumination);
    target.addEventListener('focus', () => setIllumination(target));
    target.addEventListener('blur', clearIllumination);
  });

  core.bindHoverClass(libraryLink, scene, 'is-library-hovering');

  libraryLink.addEventListener('click', (event) => {
    core.navigateWithClass({
      event,
      href: libraryLink.href,
      host: body,
      className: 'is-closing-book',
      delay: 600,
      storageKey: 'returned-from-about'
    });
  });
})();

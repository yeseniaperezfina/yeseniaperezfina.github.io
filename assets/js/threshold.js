(() => {
  const entry = document.querySelector('.entry');
  const enter = document.querySelector('.enter');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!entry || !enter) return;

  const setHoverState = (isHovering) => {
    if (reduceMotion) return;
    entry.classList.toggle('is-enter-hovering', isHovering);
  };

  enter.addEventListener('pointerenter', () => setHoverState(true));
  enter.addEventListener('pointerleave', () => setHoverState(false));
  enter.addEventListener('focus', () => setHoverState(true));
  enter.addEventListener('blur', () => setHoverState(false));

  enter.addEventListener('click', (event) => {
    if (reduceMotion) return;

    event.preventDefault();
    entry.classList.add('is-entering');

    try {
      sessionStorage.setItem('entered-from-study', 'true');
    } catch {}

    window.setTimeout(() => {
      window.location.href = enter.href;
    }, 640);
  });
})();

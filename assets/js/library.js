(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion) {
    let ticking = false;
    window.addEventListener('pointermove', (event) => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        root.style.setProperty('--mouse-x', `${(event.clientX / window.innerWidth) * 100}%`);
        root.style.setProperty('--mouse-y', `${(event.clientY / window.innerHeight) * 100}%`);
        ticking = false;
      });
    }, { passive: true });
  }

  document.querySelectorAll('[data-book]').forEach((book) => {
    book.addEventListener('mouseenter', () => document.body.dataset.activeBook = book.dataset.book || '');
    book.addEventListener('focus', () => document.body.dataset.activeBook = book.dataset.book || '');
    book.addEventListener('mouseleave', () => delete document.body.dataset.activeBook);
    book.addEventListener('blur', () => delete document.body.dataset.activeBook);
  });
})();

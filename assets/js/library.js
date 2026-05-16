(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const marginalia = document.querySelector('.volume-marginalia');

  if (!reduceMotion) {
    let ticking = false;
    window.addEventListener('pointermove', (event) => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const x = `${(event.clientX / window.innerWidth) * 100}%`;
        const y = `${(event.clientY / window.innerHeight) * 100}%`;
        root.style.setProperty('--mouse-x', x);
        root.style.setProperty('--mouse-y', y);
        root.style.setProperty('--light-x', x);
        root.style.setProperty('--light-y', y);
        ticking = false;
      });
    }, { passive: true });
  }

  const resetMarginalia = () => {
    if (!marginalia) return;
    marginalia.innerHTML = '<span>Selected volume</span><strong>Move through the archive.</strong><p>Hover or focus a spine to read the room note. Select a volume to enter.</p>';
  };

  document.querySelectorAll('[data-book]').forEach((book) => {
    const title = book.querySelector('span')?.textContent?.trim() || 'Selected volume';
    const room = book.querySelector('em')?.textContent?.trim() || 'Archive room';
    const note = book.querySelector('p')?.textContent?.trim() || 'Open this room.';

    const activate = () => {
      body.dataset.activeBook = book.dataset.book || '';
      if (marginalia) {
        marginalia.innerHTML = `<span>${room}</span><strong>${title}</strong><p>${note}</p>`;
      }
    };

    book.addEventListener('mouseenter', activate);
    book.addEventListener('focus', activate);
    book.addEventListener('mouseleave', () => {
      delete body.dataset.activeBook;
      resetMarginalia();
    });
    book.addEventListener('blur', () => {
      delete body.dataset.activeBook;
      resetMarginalia();
    });

    book.addEventListener('click', (event) => {
      if (reduceMotion) return;
      event.preventDefault();
      body.classList.add('is-turning');
      window.setTimeout(() => {
        window.location.href = book.href;
      }, 520);
    });
  });
})();
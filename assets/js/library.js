(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const card = document.querySelector('.archive-card');

  if (!reduceMotion) {
    let ticking = false;
    window.addEventListener('pointermove', (event) => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        root.style.setProperty('--light-x', `${(event.clientX / window.innerWidth) * 100}%`);
        root.style.setProperty('--light-y', `${(event.clientY / window.innerHeight) * 100}%`);
        ticking = false;
      });
    }, { passive: true });
  }

  const setCard = ({ room = 'Selected volume', volume = 'Move through the archive.', note = 'Hover, focus, or tap a volume to reveal its room note.' } = {}) => {
    if (!card) return;
    card.innerHTML = `<span class="archive-card-kicker">${room}</span><strong>${volume}</strong><p>${note}</p>`;
  };

  const resetCard = () => setCard();

  document.querySelectorAll('.volume-zone').forEach((zone) => {
    const activate = () => {
      setCard({
        room: zone.dataset.room,
        volume: zone.dataset.volume,
        note: zone.dataset.note
      });
    };

    zone.addEventListener('mouseenter', activate);
    zone.addEventListener('focus', activate);
    zone.addEventListener('touchstart', activate, { passive: true });
    zone.addEventListener('mouseleave', resetCard);
    zone.addEventListener('blur', resetCard);

    zone.addEventListener('click', (event) => {
      if (reduceMotion) return;
      event.preventDefault();
      activate();
      body.classList.add('is-turning');
      window.setTimeout(() => {
        window.location.href = zone.href;
      }, 560);
    });
  });

  document.querySelectorAll('.mobile-volume-list a').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (reduceMotion) return;
      event.preventDefault();
      body.classList.add('is-turning');
      window.setTimeout(() => {
        window.location.href = link.href;
      }, 420);
    });
  });
})();
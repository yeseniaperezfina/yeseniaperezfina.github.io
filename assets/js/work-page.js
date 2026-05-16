(() => {
  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let scrollFrame = null;
  const updateProgress = () => {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    root.style.setProperty('--progress', progress.toFixed(4));
    body.classList.toggle('has-scrolled', window.scrollY > 12);
    scrollFrame = null;
  };

  const requestProgress = () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateProgress);
  };

  updateProgress();
  window.addEventListener('scroll', requestProgress, { passive: true });
  window.addEventListener('resize', requestProgress, { passive: true });

  if (!reduceMotion) {
    let pointerFrame = null;
    window.addEventListener('pointermove', (event) => {
      if (pointerFrame) return;
      pointerFrame = window.requestAnimationFrame(() => {
        const width = Math.max(document.documentElement.clientWidth, 1);
        const height = Math.max(document.documentElement.clientHeight, 1);
        const x = event.clientX / width;
        const y = event.clientY / height;
        root.style.setProperty('--mx', `${x * 100}%`);
        root.style.setProperty('--my', `${y * 100}%`);
        root.style.setProperty('--tilt-x', `${(x - 0.5).toFixed(3)}`);
        root.style.setProperty('--tilt-y', `${(0.5 - y).toFixed(3)}`);
        pointerFrame = null;
      });
    }, { passive: true });
  }

  const panels = Array.from(document.querySelectorAll('[data-panel]'));
  const triggers = Array.from(document.querySelectorAll('[data-panel-trigger], [data-domain]'));

  const panelKeys = panels.map((panel) => panel.dataset.panel);

  const activateLayer = (key, shouldFocus = false) => {
    if (!panelKeys.includes(key)) return;

    panels.forEach((panel) => {
      const active = panel.dataset.panel === key;
      panel.hidden = !active;
      panel.classList.toggle('is-active', active);
    });

    triggers.forEach((trigger) => {
      const triggerKey = trigger.dataset.panelTrigger || trigger.dataset.domain;
      const active = triggerKey === key;
      trigger.classList.toggle('is-active', active);
      trigger.setAttribute('aria-pressed', String(active));
      if (active && shouldFocus) trigger.focus();
    });
  };

  triggers.forEach((trigger, index) => {
    const key = trigger.dataset.panelTrigger || trigger.dataset.domain;
    trigger.setAttribute('aria-pressed', String(trigger.classList.contains('is-active')));
    trigger.addEventListener('click', () => activateLayer(key));
    trigger.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const group = triggers.filter((candidate) => candidate.matches(trigger.matches('[data-domain]') ? '[data-domain]' : '[data-panel-trigger]'));
      const groupIndex = group.indexOf(trigger);
      let nextIndex = groupIndex;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (groupIndex + 1) % group.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (groupIndex - 1 + group.length) % group.length;
      if (event.key === 'Home') nextIndex = 0;
      if (event.key === 'End') nextIndex = group.length - 1;
      const next = group[nextIndex];
      const nextKey = next.dataset.panelTrigger || next.dataset.domain;
      activateLayer(nextKey, true);
    });
  });

  activateLayer('missions');

  const drawers = Array.from(document.querySelectorAll('.drawer-grid details'));
  drawers.forEach((drawer) => {
    drawer.addEventListener('toggle', () => {
      if (!drawer.open) return;
      drawers.forEach((other) => {
        if (other !== drawer) other.open = false;
      });
    });
  });

  document.querySelectorAll('.library-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (reduceMotion) return;
      event.preventDefault();
      body.classList.add('is-leaving');
      window.setTimeout(() => {
        window.location.href = link.href;
      }, 360);
    });
  });
})();

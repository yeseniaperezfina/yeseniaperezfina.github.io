(() => {
  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('[data-values]')];
  const emptyState = document.querySelector('.empty-state');
  filters.forEach((button) => button.addEventListener('click', () => {
    const value = button.dataset.filter;
    filters.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    let visible = 0;
    projects.forEach((project) => {
      const values = (project.dataset.values || '').split(' ');
      const matches = value === 'all' || values.includes(value);
      project.hidden = !matches;
      if (matches) visible += 1;
    });
    if (emptyState) emptyState.hidden = visible !== 0;
  }));
})();

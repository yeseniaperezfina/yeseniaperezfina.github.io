(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const safely = (fn) => {
    try { return fn(); } catch { return null; }
  };

  const storage = {
    has: (key) => safely(() => sessionStorage.getItem(key)) === 'true',
    set: (key) => safely(() => sessionStorage.setItem(key, 'true')),
    clear: (key) => safely(() => sessionStorage.removeItem(key))
  };

  const bindHoverClass = (target, host, className) => {
    if (!target || !host || reduceMotion) return;
    const set = (active) => host.classList.toggle(className, active);
    target.addEventListener('pointerenter', () => set(true));
    target.addEventListener('pointerleave', () => set(false));
    target.addEventListener('focus', () => set(true));
    target.addEventListener('blur', () => set(false));
  };

  const navigateWithClass = ({ event, href, host, className, delay = 600, storageKey }) => {
    if (reduceMotion || !href) return true;
    event?.preventDefault();
    if (storageKey) storage.set(storageKey);
    if (host && className) host.classList.add(className);
    window.setTimeout(() => { window.location.href = href; }, delay);
    return false;
  };

  window.StudyCore = {
    reduceMotion,
    storage,
    bindHoverClass,
    navigateWithClass,
    safely
  };
})();

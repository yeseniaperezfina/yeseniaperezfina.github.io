(() => {
  const entry = document.querySelector('.entry');
  const enter = document.querySelector('.enter');
  const core = window.StudyCore;

  if (!entry || !enter || !core) return;

  core.bindHoverClass(enter, entry, 'is-enter-hovering');

  enter.addEventListener('click', (event) => {
    core.navigateWithClass({
      event,
      href: enter.href,
      host: entry,
      className: 'is-entering',
      delay: 860,
      storageKey: 'entered-from-study'
    });
  });
})();

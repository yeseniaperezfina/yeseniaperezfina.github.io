(() => {
  const body = document.body;
  const dialog = document.getElementById('work-dialog');
  const dialogTitle = document.getElementById('dialog-title');
  const dialogKicker = document.getElementById('dialog-kicker');
  const dialogBody = document.getElementById('dialog-body');
  const triggers = [...document.querySelectorAll('[data-open-panel]')];
  const backLink = document.querySelector('.library-link');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const panelContent = {
    overview: {
      kicker: 'Volume II · Field Book',
      title: 'Work',
      body: `
        <p>I design public learning systems that help complex institutions become usable, participatory, and trusted.</p>
        <p>My work spans NASA astrophysics missions, national informal learning networks, public engagement initiatives, and audience-centered storytelling systems.</p>
      `,
    },
    missions: {
      kicker: 'Mission engagement',
      title: 'Designing public entry points into scientific futures',
      body: `
        <p>I support public engagement around NASA astrophysics missions by helping technical ambition become meaningful public orientation. With Roman, the challenge is not simply explaining the telescope. It is helping audiences, facilitators, ambassadors, educators, and host sites understand why Roman matters before the mission is already culturally legible.</p>
        <ul><li>Launch strategy</li><li>Facilitator onboarding</li><li>Host-site activation</li><li>Cross-network coordination</li></ul>
      `,
    },
    networks: {
      kicker: 'Learning networks',
      title: 'Building durable learning infrastructure across distributed systems',
      body: `
        <p>NASA’s Universe of Learning and the Informal Learning Network are where my work most clearly becomes ecosystem strategy. The network connects museums, libraries, science centers, children’s museums, community organizations, schools, universities, and informal educators who adapt NASA astrophysics resources for local communities.</p>
        <ul><li>Partner support</li><li>Professional learning</li><li>Evaluation-to-strategy synthesis</li><li>Resource usability</li></ul>
      `,
    },
    governance: {
      kicker: 'Recognition governance',
      title: 'Studying how systems decide what counts',
      body: `
        <p>My graduate research asks the same question in another system: once people have done the work, can they reliably move forward? The core insight is that learning is not the scarce resource. Reliable recognition is.</p>
        <p><strong>Recognition chain:</strong> Learning → Evidence → Validation → Translation → Recording → Application → Advancement.</p>
      `,
    },
  };

  const safely = (fn) => {
    try { return fn(); } catch { return null; }
  };

  if (safely(() => sessionStorage.getItem('entered-from-library-work')) === 'true' && !reduceMotion) {
    body.classList.add('is-arriving-from-library');
    safely(() => sessionStorage.removeItem('entered-from-library-work'));
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => body.classList.remove('is-arriving-from-library'));
    });
  }

  const openPanel = (key) => {
    const content = panelContent[key];
    if (!content || !dialog || !dialogTitle || !dialogKicker || !dialogBody) return;
    dialogKicker.textContent = content.kicker;
    dialogTitle.textContent = content.title;
    dialogBody.innerHTML = content.body;

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => openPanel(trigger.dataset.openPanel));
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && dialog?.open) dialog.close();
  });

  if (backLink && !reduceMotion) {
    backLink.addEventListener('click', (event) => {
      event.preventDefault();
      body.classList.add('is-leaving');
      window.setTimeout(() => {
        window.location.href = backLink.href;
      }, 460);
    });
  }
})();

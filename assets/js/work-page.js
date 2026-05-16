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
      title: 'Public learning systems',
      body: `
        <p>I design public learning systems that help complex institutions become usable, participatory, and trusted.</p>
        <p>At the Space Telescope Science Institute, my work spans NASA astrophysics missions, national informal learning networks, public engagement initiatives, and audience-centered storytelling systems. I translate technical ambition into learning infrastructure: the tools, partnerships, narratives, and implementation supports that help people enter complex science without needing insider fluency.</p>
        <div class="dialog-grid">
          <span class="dialog-chip">Science, systems, and public trust</span>
          <span class="dialog-chip">Translation without flattening</span>
          <span class="dialog-chip">Access as infrastructure</span>
          <span class="dialog-chip">Rigor, imagination, and care</span>
        </div>
      `,
    },
    missions: {
      kicker: 'Mission engagement',
      title: 'Designing public entry points into scientific futures',
      body: `
        <p>I support public engagement around NASA astrophysics missions by helping technical ambition become meaningful public orientation. With Roman, the challenge is not simply explaining the telescope. It is helping audiences, facilitators, ambassadors, educators, and host sites understand why Roman matters before the mission is already culturally legible.</p>
        <p>My work supports the engagement infrastructure around that question: webinar preparation, presenter coordination, stakeholder communication, facilitator-facing framing, host-site activation, and audience onboarding for launch-era engagement.</p>
        <div class="dialog-grid">
          <span class="dialog-chip">Launch strategy</span>
          <span class="dialog-chip">Facilitator onboarding</span>
          <span class="dialog-chip">Host-site activation</span>
          <span class="dialog-chip">Cross-network coordination</span>
        </div>
      `,
    },
    networks: {
      kicker: 'Learning networks',
      title: 'Building durable infrastructure across distributed systems',
      body: `
        <p>NASA’s Universe of Learning and the Informal Learning Network are where my work most clearly becomes ecosystem strategy. The network connects museums, libraries, science centers, children’s museums, community organizations, schools, universities, and informal educators who adapt NASA astrophysics resources for local communities.</p>
        <p>I use partner feedback, evaluation findings, adoption patterns, and reach data to identify what the network needs next: clearer resource navigation, stronger mini-networks, multi-format materials, and support that lets national science become locally meaningful.</p>
        <div class="dialog-grid">
          <span class="dialog-chip">142,000+ FY25 participants</span>
          <span class="dialog-chip">93% continuation intent</span>
          <span class="dialog-chip">Evaluation-to-strategy synthesis</span>
          <span class="dialog-chip">Community-centered implementation</span>
        </div>
      `,
    },
    governance: {
      kicker: 'Recognition governance',
      title: 'Studying how systems decide what counts',
      body: `
        <p>My graduate research asks the same question in another system: once people have done the work, can they reliably move forward? The core insight is that learning is not the scarce resource. Reliable recognition is.</p>
        <p>A learner can do the work, build the skill, get assessed, earn the credential, and still be told: we see it, but we do not apply it here. That is where the pathway breaks.</p>
        <p><strong>Recognition chain:</strong> Learning → Evidence → Validation → Translation → Recording → Application → Advancement.</p>
        <div class="dialog-grid">
          <span class="dialog-chip">Credit mobility</span>
          <span class="dialog-chip">Learning-to-credit reliability</span>
          <span class="dialog-chip">Institutional obligation</span>
          <span class="dialog-chip">Postsecondary value</span>
        </div>
      `,
    },
  };

  const safely = (fn) => {
    try {
      return fn();
    } catch {
      return null;
    }
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

  dialog?.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const clickedOutside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (clickedOutside) dialog.close();
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

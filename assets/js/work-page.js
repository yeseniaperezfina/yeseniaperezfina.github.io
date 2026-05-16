(() => {
  const body = document.body;
  const backLink = document.querySelector('.library-link');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mapLinks = [...document.querySelectorAll('[data-map-target]')];
  const compassLinks = [...document.querySelectorAll('[data-compass-target]')];
  const annotations = [...document.querySelectorAll('[data-annotation]')];
  const territorySections = [...document.querySelectorAll('[data-section]')];
  const routes = [...document.querySelectorAll('.route')];

  const safely = (fn) => {
    try {
      return fn();
    } catch {
      return null;
    }
  };

  const injectEnhancementStyles = () => {
    const style = document.createElement('style');
    style.dataset.workAtlasEnhancements = 'true';
    style.textContent = `
      .map-volume-page .route {
        stroke-dasharray: var(--route-length, 1);
        stroke-dashoffset: var(--route-length, 1);
      }

      .map-volume-page.routes-ready .route {
        animation: draw-atlas-route 1.8s cubic-bezier(.2,.8,.2,1) .24s forwards;
      }

      .map-volume-page.routes-ready .route-alt {
        animation-delay: .48s;
      }

      @keyframes draw-atlas-route {
        to { stroke-dashoffset: 0; }
      }

      .map-label.is-active,
      .atlas-compass a.is-active {
        color: #fff2dd;
        border-color: rgba(210,160,93,.78);
        background: rgba(210,160,93,.18);
        box-shadow: 0 0 0 1px rgba(210,160,93,.18), 0 14px 34px rgba(0,0,0,.28);
      }

      .map-label.is-active {
        color: rgba(35,24,15,.94);
        background: rgba(255,239,207,.92);
      }

      .ledger-card.is-active {
        border-color: rgba(247,234,216,.24);
        box-shadow: 0 0 0 1px rgba(210,160,93,.16), 0 30px 90px rgba(0,0,0,.34);
        transform: translateY(-2px);
      }

      .map-annotation {
        opacity: 0;
        transform: translateY(8px) scale(.98);
        transition: opacity .22s ease, transform .22s cubic-bezier(.2,.8,.2,1);
        pointer-events: none;
      }

      .map-annotation.is-visible {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      .atlas-compass {
        position: fixed;
        right: 1rem;
        top: 50%;
        z-index: 24;
        width: 10.5rem;
        transform: translateY(-50%);
        padding: .75rem;
        border: 1px solid rgba(247,234,216,.12);
        border-top-color: rgba(210,160,93,.44);
        background: linear-gradient(135deg, rgba(12,7,4,.76), rgba(12,7,4,.42));
        backdrop-filter: blur(12px) saturate(.86);
        box-shadow: 0 18px 46px rgba(0,0,0,.34);
      }

      .atlas-compass p {
        margin: 0 0 .55rem;
        color: rgba(210,160,93,.82);
        font-size: .54rem;
        font-weight: 800;
        letter-spacing: .18em;
        text-transform: uppercase;
      }

      .atlas-compass a {
        display: block;
        padding: .46rem .5rem;
        border: 1px solid transparent;
        color: rgba(247,234,216,.64);
        text-decoration: none;
        font-size: .72rem;
        line-height: 1.1;
        transition: background .22s ease, border-color .22s ease, color .22s ease;
      }

      .atlas-compass span {
        display: block;
        margin-bottom: .12rem;
        color: rgba(210,160,93,.74);
        font-family: Georgia, 'Times New Roman', serif;
        font-size: .95rem;
      }

      .field-toggle {
        margin-top: 1rem;
        border: 1px solid rgba(247,234,216,.14);
        border-bottom-color: rgba(210,160,93,.30);
        background: rgba(247,234,216,.035);
        color: rgba(247,234,216,.76);
        cursor: pointer;
        padding: .62rem .72rem;
        font-size: .62rem;
        font-weight: 800;
        letter-spacing: .14em;
        text-transform: uppercase;
        transition: background .22s ease, color .22s ease, border-color .22s ease, transform .22s ease;
      }

      .field-toggle:hover,
      .field-toggle:focus-visible {
        color: #fff7ec;
        border-color: rgba(210,160,93,.54);
        background: rgba(210,160,93,.10);
        transform: translateY(-1px);
        outline: none;
      }

      .book-page .field-toggle,
      .thesis-panel .field-toggle {
        color: rgba(36,23,14,.72);
        border-color: rgba(88,55,30,.18);
        background: rgba(255,248,230,.34);
      }

      .book-page .field-toggle:hover,
      .book-page .field-toggle:focus-visible,
      .thesis-panel .field-toggle:hover,
      .thesis-panel .field-toggle:focus-visible {
        color: rgba(36,23,14,.94);
        background: rgba(255,248,230,.58);
      }

      .expandable-content {
        overflow: hidden;
        max-height: 42rem;
        opacity: 1;
        transition: max-height .34s cubic-bezier(.2,.8,.2,1), opacity .24s ease, margin .34s ease;
      }

      .is-collapsed > .expandable-content,
      .is-collapsed .expandable-content {
        max-height: 0;
        opacity: 0;
        margin-top: 0 !important;
      }

      .field-note-extra {
        margin-top: .9rem;
        padding-top: .9rem;
        border-top: 1px solid rgba(247,234,216,.12);
        color: rgba(247,234,216,.68);
        font-size: .86rem;
        line-height: 1.62;
      }

      .book-page .field-note-extra,
      .thesis-panel .field-note-extra {
        border-top-color: rgba(88,55,30,.16);
        color: rgba(36,23,14,.68);
      }

      .proof-grid article,
      .dossier-grid article,
      .ledger-card,
      .thesis-panel,
      .closing-note,
      .method-list li,
      .book-page-right {
        transition: transform .24s cubic-bezier(.2,.8,.2,1), border-color .24s ease, box-shadow .24s ease, background .24s ease;
      }

      .proof-grid article:hover,
      .dossier-grid article:hover,
      .method-list li:hover {
        transform: translateY(-3px);
        box-shadow: 0 24px 70px rgba(0,0,0,.26);
      }

      .work-page.is-arriving-from-library .work-main {
        opacity: .12;
        filter: blur(2px);
        transform: translateY(12px) scale(.99);
      }

      .work-main {
        transition: opacity .72s ease, transform .72s cubic-bezier(.2,.8,.2,1), filter .72s ease;
      }

      @media (max-width: 1180px) {
        .atlas-compass { display: none; }
      }

      @media (prefers-reduced-motion: reduce) {
        .map-volume-page .route { stroke-dashoffset: 0 !important; animation: none !important; }
        .expandable-content, .map-annotation, .work-main, .field-toggle { transition: none !important; }
      }
    `;
    document.head.appendChild(style);
  };

  injectEnhancementStyles();

  const setActiveTerritory = (key) => {
    if (!key) return;

    mapLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.mapTarget === key);
    });

    compassLinks.forEach((link) => {
      link.classList.toggle('is-active', link.dataset.compassTarget === key);
    });

    territorySections.forEach((section) => {
      section.classList.toggle('is-active', section.dataset.section === key);
    });
  };

  const showAnnotation = (key) => {
    annotations.forEach((annotation) => {
      const isCurrent = annotation.dataset.annotation === key;
      annotation.classList.toggle('is-visible', isCurrent);
      annotation.setAttribute('aria-hidden', isCurrent ? 'false' : 'true');
    });
  };

  const clearAnnotations = () => {
    annotations.forEach((annotation) => {
      annotation.classList.remove('is-visible');
      annotation.setAttribute('aria-hidden', 'true');
    });
  };

  const initialiseRoutes = () => {
    routes.forEach((route) => {
      const length = typeof route.getTotalLength === 'function' ? route.getTotalLength() : 1;
      route.style.setProperty('--route-length', length);
    });

    if (!reduceMotion) {
      window.requestAnimationFrame(() => {
        body.classList.add('routes-ready');
      });
    }
  };

  const wrapExpandable = ({ root, nodes, labelOpen = 'open field file', labelClose = 'hide field file', startOpen = false }) => {
    if (!root || !nodes?.length) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'expandable-content';
    nodes[0].parentNode.insertBefore(wrapper, nodes[0]);
    nodes.forEach((node) => wrapper.appendChild(node));

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'field-toggle';
    button.setAttribute('aria-expanded', String(startOpen));
    button.textContent = startOpen ? labelClose : labelOpen;
    root.appendChild(button);

    root.classList.toggle('is-collapsed', !startOpen);

    button.addEventListener('click', () => {
      const willOpen = root.classList.contains('is-collapsed');
      root.classList.toggle('is-collapsed', !willOpen);
      button.setAttribute('aria-expanded', String(willOpen));
      button.textContent = willOpen ? labelClose : labelOpen;
    });
  };

  const addGeneratedExtra = (root, html) => {
    const extra = document.createElement('div');
    extra.className = 'field-note-extra';
    extra.innerHTML = html;
    root.appendChild(extra);
    return extra;
  };

  const initialiseExpandableSections = () => {
    const rightPage = document.querySelector('.book-page-right');
    if (rightPage) {
      const quote = rightPage.querySelector('.map-quote');
      const extra = addGeneratedExtra(rightPage, 'The map is a navigation argument: each route names a body of work, the scale markers show reach, and the territory cards below explain the system underneath the visible products.');
      wrapExpandable({ root: rightPage, nodes: [quote, extra].filter(Boolean), labelOpen: 'open map note', labelClose: 'hide map note', startOpen: true });
    }

    const thesisPanel = document.querySelector('.thesis-panel');
    if (thesisPanel) {
      const paragraphs = [...thesisPanel.querySelectorAll('p')];
      wrapExpandable({ root: thesisPanel, nodes: paragraphs.slice(1), labelOpen: 'open legend note', labelClose: 'hide legend note', startOpen: true });
    }

    document.querySelectorAll('.proof-grid article').forEach((card, index) => {
      const notes = [
        'A national activation signal: mission moments became locally hosted learning experiences, not only centralized announcements.',
        'A translation bridge: technical expertise was connected to public-facing spaces where audiences could ask better questions.',
        'A distributed infrastructure signal: public engagement traveled through host sites, educators, and community settings.',
        'A network reach signal: informal learning partners adapted NASA science through local programs, exhibitions, and events.',
        'A sustainability signal: partners saw enough local value to continue beyond the initial grant or activation period.',
        'An ecosystem signal: the work lives across museums, libraries, community organizations, and learning institutions.',
      ];
      const extra = addGeneratedExtra(card, notes[index] || 'A proof point for scale, translation, and field uptake.');
      wrapExpandable({ root: card, nodes: [extra], labelOpen: 'read note', labelClose: 'hide note' });
    });

    document.querySelectorAll('.ledger-card').forEach((card) => {
      const paragraphs = [...card.querySelectorAll('p')].filter((p) => !p.classList.contains('card-number') && !p.classList.contains('card-kicker'));
      const list = card.querySelector('.mode-list');
      const nodes = paragraphs.slice(1);
      if (list) nodes.push(list);
      wrapExpandable({ root: card, nodes, labelOpen: 'open territory file', labelClose: 'hide territory file' });
    });

    const dossierNotes = {
      'Roman Space Telescope': 'Current emphasis: launch-era audience onboarding, presenter coordination, host-site activation, and message consistency across networks.',
      'Webb / STORI': 'Current emphasis: interpretive sequence, visual noticing, POI selection, guided tour pacing, and clearer pathways through dense astronomical scenes.',
      'NASA’s Universe of Learning / ILN': 'Current emphasis: FY25 impact synthesis, partner capacity, resource discoverability, accessibility, bilingual programming, and evaluation-to-strategy translation.',
      'Postsecondary Value': 'Current emphasis: recognition chains, credit mobility, institutional obligation, and the conditions that make learning reliably count.',
    };

    document.querySelectorAll('.dossier-grid article').forEach((card) => {
      const label = card.querySelector('.dossier-label')?.textContent?.trim() || '';
      const extra = addGeneratedExtra(card, dossierNotes[label] || 'Current emphasis: strategy, implementation, and evidence that helps the work move.');
      wrapExpandable({ root: card, nodes: [extra], labelOpen: 'open coordinate', labelClose: 'hide coordinate' });
    });

    document.querySelectorAll('.method-list li').forEach((item) => {
      const strong = item.querySelector('strong')?.textContent || 'Method';
      const note = addGeneratedExtra(item, `Design commitment: ${strong.replace(/\.$/, '').toLowerCase()} becomes a practical decision rule when projects get complex.`);
      wrapExpandable({ root: item, nodes: [note], labelOpen: 'open method note', labelClose: 'hide method note' });
    });

    const closing = document.querySelector('.closing-note');
    if (closing) {
      const signoff = closing.querySelector('.closing-signoff');
      wrapExpandable({ root: closing, nodes: [signoff].filter(Boolean), labelOpen: 'open margin note', labelClose: 'hide margin note', startOpen: true });
    }
  };

  if (safely(() => sessionStorage.getItem('entered-from-library-work')) === 'true' && !reduceMotion) {
    body.classList.add('is-arriving-from-library');
    safely(() => sessionStorage.removeItem('entered-from-library-work'));
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => body.classList.remove('is-arriving-from-library'));
    });
  }

  mapLinks.forEach((link) => {
    const key = link.dataset.mapTarget;

    link.addEventListener('mouseenter', () => showAnnotation(key));
    link.addEventListener('mouseleave', clearAnnotations);
    link.addEventListener('focus', () => showAnnotation(key));
    link.addEventListener('blur', clearAnnotations);
    link.addEventListener('click', () => setActiveTerritory(key));
  });

  compassLinks.forEach((link) => {
    link.addEventListener('click', () => setActiveTerritory(link.dataset.compassTarget));
  });

  if ('IntersectionObserver' in window && territorySections.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.dataset?.section) {
        setActiveTerritory(visible.target.dataset.section);
      }
    }, {
      root: null,
      threshold: [0.2, 0.35, 0.5, 0.65],
      rootMargin: '-18% 0px -42% 0px',
    });

    territorySections.forEach((section) => observer.observe(section));
  }

  initialiseRoutes();
  initialiseExpandableSections();
  setActiveTerritory('missions');

  if (backLink && !reduceMotion) {
    backLink.addEventListener('click', (event) => {
      event.preventDefault();
      body.classList.add('is-leaving');
      window.setTimeout(() => {
        window.location.href = backLink.href;
      }, 380);
    });
  }
})();

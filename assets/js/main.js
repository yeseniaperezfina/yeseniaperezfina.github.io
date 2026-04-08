/* =========================================================
   CELESTIAL TIDELINES
   main.js
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     CONFIG
     ======================================================= */

  const CONFIG = {
    themeStorageKey: "celestial-tidelines-theme",
    defaultTheme: "daytide",
    altTheme: "midnight-current",
    headerScrolledClass: "is-scrolled",
    visibleClass: "is-visible",
    activeNavAttribute: "aria-current",
    parallaxEnabledClass: "has-parallax",
    themeTransitionClass: "theme-transitioning",
    mobileMenuOpenClass: "menu-is-open",
    reduceMotionQuery: "(prefers-reduced-motion: reduce)",
    revealThreshold: 0.16,
    revealRootMargin: "0px 0px -8% 0px",
    navSectionThreshold: 0.45,
    navSectionRootMargin: "-35% 0px -45% 0px",
    headerScrollThreshold: 18,
    parallaxIntensity: {
      stars: 10,
      orbits: 16,
      signals: 22,
      horizon: 8,
      tide: 14,
      depth: 18
    }
  };

  /* =======================================================
     DOM
     ======================================================= */

  const html = document.documentElement;
  const body = document.body;

  const header = document.querySelector(".site-header");
  const navLinks = Array.from(document.querySelectorAll(".site-nav__link, .site-footer__link"));
  const primaryNavLinks = Array.from(document.querySelectorAll(".site-nav__link"));
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeToggleLabel = document.querySelector(".theme-toggle__label");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const siteNav = document.querySelector(".site-nav");

  const revealTargets = Array.from(document.querySelectorAll("[data-reveal]"));
  const staggerTargets = Array.from(document.querySelectorAll("[data-stagger]"));

  const sections = Array.from(
    document.querySelectorAll(
      "#signal, #horizon, #estuary, #reach, #tidework-preview, #drift-notes, #future-currents, #shoreline"
    )
  );

  const atmosphere = {
    stars: document.querySelector(".atmosphere-layer--stars"),
    orbits: document.querySelector(".atmosphere-layer--orbits"),
    signals: document.querySelector(".atmosphere-layer--signals"),
    horizon: document.querySelector(".atmosphere-layer--horizon"),
    tide: document.querySelector(".atmosphere-layer--tide"),
    depth: document.querySelector(".atmosphere-layer--depth")
  };

  const heroParallaxBits = Array.from(
    document.querySelectorAll(".hero__sky, .hero__orbital-grid, .hero__signal-trace, .hero__horizon-line")
  );

  const prefersReducedMotion = window.matchMedia(CONFIG.reduceMotionQuery);

  /* =======================================================
     HELPERS
     ======================================================= */

  function isReducedMotion() {
    return prefersReducedMotion.matches;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function rafThrottle(callback) {
    let ticking = false;

    return (...args) => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        callback(...args);
        ticking = false;
      });
    };
  }

  function setActiveNav(sectionId) {
    if (!sectionId) return;

    navLinks.forEach((link) => {
      const href = link.getAttribute("href");
      const isMatch = href === `#${sectionId}`;

      if (isMatch) {
        link.setAttribute(CONFIG.activeNavAttribute, "true");
      } else {
        link.removeAttribute(CONFIG.activeNavAttribute);
      }
    });
  }

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      /* noop */
    }
  }

  function updateThemeToggleLabel(theme) {
    if (!themeToggleLabel) return;

    themeToggleLabel.textContent =
      theme === CONFIG.altTheme ? "Midnight Current / Daytide" : "Daytide / Midnight Current";
  }

  function applyTheme(theme, persist = true) {
    const normalizedTheme =
      theme === CONFIG.altTheme ? CONFIG.altTheme : CONFIG.defaultTheme;

    html.classList.add(CONFIG.themeTransitionClass);
    html.setAttribute("data-theme", normalizedTheme);

    updateThemeToggleLabel(normalizedTheme);

    if (persist) {
      safeStorageSet(CONFIG.themeStorageKey, normalizedTheme);
    }

    window.setTimeout(() => {
      html.classList.remove(CONFIG.themeTransitionClass);
    }, 350);
  }

  function getInitialTheme() {
    const storedTheme = safeStorageGet(CONFIG.themeStorageKey);
    if (storedTheme === CONFIG.defaultTheme || storedTheme === CONFIG.altTheme) {
      return storedTheme;
    }

    const systemPrefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    return systemPrefersDark ? CONFIG.altTheme : CONFIG.defaultTheme;
  }

  function toggleTheme() {
    const currentTheme = html.getAttribute("data-theme") || CONFIG.defaultTheme;
    const nextTheme =
      currentTheme === CONFIG.altTheme ? CONFIG.defaultTheme : CONFIG.altTheme;

    applyTheme(nextTheme, true);
  }

  function openMobileMenu() {
    if (!menuToggle || !siteNav) return;

    body.classList.add(CONFIG.mobileMenuOpenClass);
    siteNav.classList.add(CONFIG.mobileMenuOpenClass);
    menuToggle.setAttribute("aria-expanded", "true");
  }

  function closeMobileMenu() {
    if (!menuToggle || !siteNav) return;

    body.classList.remove(CONFIG.mobileMenuOpenClass);
    siteNav.classList.remove(CONFIG.mobileMenuOpenClass);
    menuToggle.setAttribute("aria-expanded", "false");
  }

  function toggleMobileMenu() {
    const isOpen = body.classList.contains(CONFIG.mobileMenuOpenClass);
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function shouldUseMobileMenu() {
    return window.innerWidth <= 980;
  }

  /* =======================================================
     HEADER STATE
     ======================================================= */

  const updateHeaderState = rafThrottle(() => {
    if (!header) return;

    const scrolled = window.scrollY > CONFIG.headerScrollThreshold;
    header.classList.toggle(CONFIG.headerScrolledClass, scrolled);
  });

  /* =======================================================
     REVEAL OBSERVER
     ======================================================= */

  function setupRevealObserver() {
    if (isReducedMotion()) {
      revealTargets.forEach((target) => target.classList.add(CONFIG.visibleClass));
      staggerTargets.forEach((target) => target.classList.add(CONFIG.visibleClass));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add(CONFIG.visibleClass);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: CONFIG.revealThreshold,
        rootMargin: CONFIG.revealRootMargin
      }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
    staggerTargets.forEach((target) => revealObserver.observe(target));
  }

  /* =======================================================
     ACTIVE SECTION TRACKING
     ======================================================= */

  function setupActiveSectionTracking() {
    if (!sections.length) return;

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleEntries.length) return;

        const activeSection = visibleEntries[0].target;
        if (!activeSection?.id) return;

        setActiveNav(activeSection.id);
      },
      {
        threshold: CONFIG.navSectionThreshold,
        rootMargin: CONFIG.navSectionRootMargin
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* =======================================================
     OPTIONAL PARALLAX
     ======================================================= */

  const updateParallax = rafThrottle(() => {
    if (isReducedMotion()) return;

    const scrollY = window.scrollY;
    const docHeight = Math.max(document.body.scrollHeight - window.innerHeight, 1);
    const progress = clamp(scrollY / docHeight, 0, 1);

    if (atmosphere.stars) {
      atmosphere.stars.style.transform = `translate3d(0, ${progress * CONFIG.parallaxIntensity.stars}px, 0)`;
    }

    if (atmosphere.orbits) {
      atmosphere.orbits.style.transform = `translate3d(0, ${progress * CONFIG.parallaxIntensity.orbits}px, 0)`;
    }

    if (atmosphere.signals) {
      atmosphere.signals.style.transform = `translate3d(0, ${progress * CONFIG.parallaxIntensity.signals}px, 0)`;
    }

    if (atmosphere.horizon) {
      atmosphere.horizon.style.transform = `translate3d(0, ${progress * CONFIG.parallaxIntensity.horizon}px, 0)`;
    }

    if (atmosphere.tide) {
      atmosphere.tide.style.transform = `translate3d(0, ${progress * CONFIG.parallaxIntensity.tide}px, 0)`;
    }

    if (atmosphere.depth) {
      atmosphere.depth.style.transform = `translate3d(0, ${progress * CONFIG.parallaxIntensity.depth}px, 0)`;
    }

    heroParallaxBits.forEach((node, index) => {
      const depth = (index + 1) * 3.5;
      node.style.transform = `translate3d(0, ${progress * depth}px, 0)`;
    });
  });

  /* =======================================================
     MOBILE NAV ENHANCEMENT
     ======================================================= */

  function injectMobileNavBehavior() {
    if (!siteNav || !menuToggle) return;

    primaryNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (shouldUseMobileMenu()) {
          closeMobileMenu();
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (!shouldUseMobileMenu()) return;
      if (!body.classList.contains(CONFIG.mobileMenuOpenClass)) return;

      const target = event.target;
      const clickedInsideNav = siteNav.contains(target);
      const clickedToggle = menuToggle.contains(target);

      if (!clickedInsideNav && !clickedToggle) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
      }
    });
  }

  function setupMobileMenu() {
    if (!menuToggle || !siteNav) return;

    menuToggle.addEventListener("click", toggleMobileMenu);

    injectMobileNavBehavior();

    window.addEventListener(
      "resize",
      rafThrottle(() => {
        if (!shouldUseMobileMenu()) {
          closeMobileMenu();
        }
      })
    );
  }

  /* =======================================================
     ACCESSIBILITY / INITIAL HOOKS
     ======================================================= */

  function seedRevealAttributes() {
    if (revealTargets.length || staggerTargets.length) return;

    const sectionHeadings = document.querySelectorAll(".section-heading");
    const introParagraphs = document.querySelectorAll(
      ".hero__content, .editorial__body, .editorial__aside, .estuary__intro-block, .metrics__intro, .studies__intro, .notes__intro, .future__copy, .contact__body"
    );
    const staggerGroups = document.querySelectorAll(
      ".estuary__nodes, .metrics__grid, .studies__list, .notes__grid, .future__directions, .contact__grid"
    );

    sectionHeadings.forEach((node) => node.setAttribute("data-reveal", ""));
    introParagraphs.forEach((node) => {
      if (!node.hasAttribute("data-reveal")) {
        node.setAttribute("data-reveal", "");
      }
    });
    staggerGroups.forEach((node) => node.setAttribute("data-stagger", ""));
  }

  function addParallaxHooks() {
    Object.values(atmosphere).forEach((layer) => {
      if (layer) layer.classList.add(CONFIG.parallaxEnabledClass);
    });

    heroParallaxBits.forEach((node) => node.classList.add(CONFIG.parallaxEnabledClass));
  }

  /* =======================================================
     INIT
     ======================================================= */

  function init() {
    applyTheme(getInitialTheme(), false);

    seedRevealAttributes();
    addParallaxHooks();

    setupRevealObserver();
    setupActiveSectionTracking();
    setupMobileMenu();

    updateHeaderState();
    updateParallax();

    if (themeToggle) {
      themeToggle.addEventListener("click", toggleTheme);
    }

    window.addEventListener("scroll", updateHeaderState, { passive: true });
    window.addEventListener("scroll", updateParallax, { passive: true });

    prefersReducedMotion.addEventListener?.("change", () => {
      if (isReducedMotion()) {
        Object.values(atmosphere).forEach((layer) => {
          if (layer) layer.style.transform = "";
        });
        heroParallaxBits.forEach((node) => {
          node.style.transform = "";
        });
      }
    });

    const initialHash = window.location.hash.replace("#", "");
    if (initialHash) {
      setActiveNav(initialHash);
    } else if (sections[0]?.id) {
      setActiveNav(sections[0].id);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function initThemeToggle() {
  const body = document.body;
  const html = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;

  const label = toggle.querySelector(".theme-toggle__text");
  const storageKey = "yesi-portfolio-theme";

  const applyTheme = (theme) => {
    const value = theme === "daybreak" ? "daybreak" : "midnight";
    body.setAttribute("data-theme", value);
    html.setAttribute("data-theme", value);
    toggle.setAttribute("aria-pressed", String(value === "daybreak"));
    if (label) {
      label.textContent = value === "daybreak" ? "Daybreak mode" : "Midnight mode";
    }
  };

  let initialTheme = "midnight";
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === "daybreak") initialTheme = "daybreak";
  } catch {}

  applyTheme(initialTheme);

  toggle.addEventListener("click", () => {
    const current = body.getAttribute("data-theme") === "daybreak" ? "daybreak" : "midnight";
    const next = current === "midnight" ? "daybreak" : "midnight";
    applyTheme(next);
    try {
      window.localStorage.setItem(storageKey, next);
    } catch {}
  });
}

function initRoleChips() {
  const chips = document.querySelectorAll(".role-chip");
  const note = document.getElementById("heroRoleNote");
  if (!chips.length || !note) return;

  const copy = {
    strategist:
      "As a <strong>Strategist</strong>, I shape learning systems, partnership structures, and decision pathways that help ambitious work scale without losing clarity or purpose.",
    scholar:
      "As a <strong>Scholar</strong>, I draw on research in leadership, learning, and institutions to sharpen judgment and make design choices that are both rigorous and useful.",
    builder:
      "As a <strong>Builder</strong>, I prototype and construct directly — in programs, systems, and digital environments — so ideas move from concept to form with less ambiguity.",
    translator:
      "As a <strong>Translator</strong>, I turn complexity into language, structure, and experience so science, strategy, and public meaning can travel together."
  };

  const update = (key) => {
    if (!copy[key]) return;
    note.innerHTML = copy[key];
  };

  update("strategist");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      const key = chip.getAttribute("data-role");
      update(key);
    });
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll("[data-section], .hero");
  const links = document.querySelectorAll(".nav-link");
  if (!sections.length || !links.length) return;

  const linkMap = {};
  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      linkMap[href.slice(1)] = link;
    }
  });

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }

        if (entry.isIntersecting && id && linkMap[id]) {
          links.forEach((link) => {
            link.classList.remove("is-active");
            link.removeAttribute("aria-current");
          });
          linkMap[id].classList.add("is-active");
          linkMap[id].setAttribute("aria-current", "page");
        }
      });
    },
    {
      threshold: 0.24,
      rootMargin: "0px 0px -18% 0px"
    }
  );

  sections.forEach((section) => observer.observe(section));
}

document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initThemeToggle();
  initRoleChips();
  initScrollSpy();
});

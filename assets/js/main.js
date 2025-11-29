// =========
// Year stamp
// =========
document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // =========
  // Role chips → role note + accent tint
  // =========
  const chips = document.querySelectorAll("[data-role-chip]");
  const roleNote = document.getElementById("role-note");

  const roleCopy = {
    Strategist:
      "As a Strategist, I design portfolios, initiatives, and learning environments that connect mission, data, and lived experience—helping teams see the system, not just the project.",
    Scholar:
      "As a Scholar, I draw from higher education research, learning sciences, and organizational theory to make design choices that are both rigorous and humane.",
    Creator:
      "As a Creator, I use visual storytelling and writing—including The Echo Jar—to translate complex science and systems work into narratives that feel accessible and worth caring about.",
    Navigator:
      "As a Navigator, I help teams move through ambiguity with clarity and care, tending to timelines, relationships, and the emotional texture of change."
  };

  // Optional: per-role accent colors (all from the forest palette family)
  const roleTheme = {
    Strategist: {
      "--accent-sage": "#2E4B47", // moss
      "--accent-berry": "#886B55", // earth
      "--accent-gold": "#FDD8A7"  // dawn
    },
    Scholar: {
      "--accent-sage": "#96806C", // canopy
      "--accent-berry": "#2E4B47",
      "--accent-gold": "#FDD8A7"
    },
    Creator: {
      "--accent-sage": "#886B55",
      "--accent-berry": "#FDD8A7",
      "--accent-gold": "#96806C"
    },
    Navigator: {
      "--accent-sage": "#2E4B47",
      "--accent-berry": "#96806C",
      "--accent-gold": "#FDD8A7"
    }
  };

  const rootStyle = document.documentElement.style;

  function applyRoleTheme(role) {
    const theme = roleTheme[role];
    if (!theme) return;
    Object.entries(theme).forEach(([varName, value]) => {
      rootStyle.setProperty(varName, value);
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const role = chip.getAttribute("data-role-chip");
      if (!role || !roleNote) return;

      chips.forEach((c) => c.classList.remove("chip--active"));
      chip.classList.add("chip--active");

      const text = roleCopy[role] || "";
      if (text) {
        roleNote.innerHTML = text.replace(
          role,
          `<strong>${role}</strong>`
        );
      }

      // optional palette morph
      applyRoleTheme(role);
    });
  });

  // =========
  // Scroll spy on sections → .nav-link
  // =========
  const sections = document.querySelectorAll("[data-section]");
  const navLinks = document.querySelectorAll(".nav-link");

  const linkMap = {};
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const id = href.slice(1);
    linkMap[id] = link;
  });

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        if (!id || !linkMap[id]) return;

        navLinks.forEach((link) => link.classList.remove("is-active"));
        linkMap[id].classList.add("is-active");
      });
    },
    {
      threshold: 0.45
    }
  );

  sections.forEach((section) => navObserver.observe(section));

  // =========
  // Section reveal (.section-visible)
  // =========
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.3
    }
  );

  sections.forEach((section) => revealObserver.observe(section));
});

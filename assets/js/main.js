// =========
// Forest Dawn Interactions
// =========
document.addEventListener("DOMContentLoaded", () => {
  // =========
  // Year stamp
  // =========
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const prefersReducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // =========
  // Role chips → role note
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

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const role = chip.getAttribute("data-role-chip");
      if (!role || !roleNote) return;

      chips.forEach((c) => c.classList.remove("chip--active"));
      chip.classList.add("chip--active");

      const text = roleCopy[role] || "";
      if (text) {
        roleNote.innerHTML = text.replace(role, `<strong>${role}</strong>`);
      }
    });
  });

  // =========
  // Utility: hex → rgba
  // =========
  function hexToRgba(hex, alpha) {
    const clean = hex.replace("#", "");
    if (clean.length !== 6) return `rgba(255,255,255,${alpha})`;
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // =========
  // Section glow overlays
  // =========
  const sections = document.querySelectorAll("[data-section]");
  const sectionArray = Array.from(sections);

  // Palette in the same order as your image
  const glowPalette = [
    "#FDD8A7", // dawn
    "#96806C", // canopy
    "#886B55", // earth
    "#2E4B47", // moss
    "#23322D"  // night
  ];

  // WeakMap: section → glow element
  const sectionGlows = new WeakMap();

  sectionArray.forEach((section, index) => {
    const glow = document.createElement("div");
    glow.className = "section-glow";
    glow.style.position = "absolute";
    glow.style.inset = "-12% 0 -10% 0";
    glow.style.pointerEvents = "none";
    glow.style.opacity = "0";
    glow.style.transition = "opacity 600ms ease-out";
    glow.style.zIndex = "-1";

    // Ensure section can host absolutely-positioned child
    section.style.position = section.style.position || "relative";

    section.insertBefore(glow, section.firstChild);
    sectionGlows.set(section, glow);

    // Initial background (subtle, all the same)
    const baseColor = glowPalette[index % glowPalette.length];
    glow.dataset.baseColor = baseColor;
    glow.style.background = `radial-gradient(circle at top center, ${hexToRgba(
      baseColor,
      0.22
    )}, transparent 65%)`;
  });

  function setActiveSectionGlow(activeSection) {
    sectionArray.forEach((section, index) => {
      const glow = sectionGlows.get(section);
      if (!glow) return;

      if (section === activeSection) {
        const color = glowPalette[index % glowPalette.length];
        glow.style.background = `radial-gradient(circle at top center, ${hexToRgba(
          color,
          0.35
        )}, transparent 70%)`;
        glow.style.opacity = "1";
      } else {
        const baseColor =
          glow.dataset.baseColor || glowPalette[index % glowPalette.length];
        glow.style.background = `radial-gradient(circle at top center, ${hexToRgba(
          baseColor,
          0.18
        )}, transparent 65%)`;
        glow.style.opacity = "0.25";
      }
    });
  }

  // =========
  // Firefly background orbs
  // =========
  const site = document.querySelector(".site") || document.body;
  const fireflies = [];
  const fireflyCount = prefersReducedMotion ? 1 : 3;

  for (let i = 0; i < fireflyCount; i++) {
    const orb = document.createElement("div");
    orb.className = "firefly-orb";
    orb.style.position = "fixed";
    orb.style.width = "220px";
    orb.style.height = "220px";
    orb.style.borderRadius = "999px";
    orb.style.pointerEvents = "none";
    orb.style.mixBlendMode = "screen";
    orb.style.opacity = "0.7";
    orb.style.zIndex = "-2";
    orb.style.transition = "background 320ms ease-out";

    const depth = 0.2 + Math.random() * 0.6;
    const baseX = Math.random() * window.innerWidth;
    const baseY = Math.random() * window.innerHeight;

    fireflies.push({ el: orb, depth, baseX, baseY });
    site.appendChild(orb);
  }

  function tintFireflies(color) {
    const soft = hexToRgba(color, 0.22);
    fireflies.forEach(({ el }) => {
      el.style.background = `radial-gradient(circle, ${soft}, transparent 60%)`;
    });
  }

  let pointerX = 0.5;
  let pointerY = 0.3;

  if (!prefersReducedMotion) {
    window.addEventListener("pointermove", (event) => {
      pointerX = event.clientX / window.innerWidth;
      pointerY = event.clientY / window.innerHeight;
    });

    const animateFireflies = () => {
      fireflies.forEach(({ el, depth, baseX, baseY }) => {

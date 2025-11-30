// assets/js/main.js

// =============================
// UTILITIES
// =============================

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

// =============================
// ROLE CHIP COPY
// =============================

const ROLE_COPY = {
  Strategist:
    "As a Strategist, I design portfolios, initiatives, and learning environments that connect mission, data, and lived experience—helping teams see the system, not just the project.",
  Scholar:
    "As a Scholar, I draw from higher education research, learning sciences, and organizational leadership to inform how we structure programs, roles, and systems for long-term health.",
  Creator:
    "As a Creator, I use visual storytelling, writing, and experience design—including The Echo Jar—to translate complex science and systems work into narratives that feel accessible and worth caring about.",
  Navigator:
    "As a Navigator, I help teams move through ambiguity with clarity and care—holding timelines, people, and purpose so that change work is brave but not reckless."
};

// =============================
// MAIN BOOTSTRAP
// =============================

document.addEventListener("DOMContentLoaded", () => {
  const state = {
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches
  };

  initYearStamp();
  initNav(state);
  initScrollSpy(state);
  initRoleChips();
  initCursorLantern(state);
  initSkillsDiagram(state);
});

// =============================
// YEAR STAMP
// =============================

function initYearStamp() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// =============================
// NAV TOGGLE + SCROLL SPY
// =============================

function initNav(state) {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const navLinks = document.querySelectorAll("[data-nav-link='true']");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        // Close nav on mobile when a link is clicked
        if (nav.classList.contains("is-open")) {
          nav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }
}

function initScrollSpy(state) {
  const sections = document.querySelectorAll("section[data-section]");
  const navLinks = document.querySelectorAll("[data-nav-link='true']");
  if (!sections.length || !navLinks.length) return;

  const linkMap = new Map();
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const id = href.slice(1);
    linkMap.set(id, link);
  });

  const observerOptions = {
    root: null,
    threshold: 0.25,
    rootMargin: "0px 0px -20% 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      if (!id) return;

      // Section reveal
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }

      // Scroll spy
      if (entry.intersectionRatio > 0.25) {
        navLinks.forEach((link) => link.classList.remove("is-active"));
        const activeLink = linkMap.get(id);
        if (activeLink) {
          activeLink.classList.add("is-active");

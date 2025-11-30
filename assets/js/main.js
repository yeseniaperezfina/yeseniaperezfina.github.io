// ======================
// UTILITIES
// ======================
function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

// ======================
// YEAR STAMP
// ======================
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
});

// ======================
// ROLE CHIPS → ROLE NOTE
// ======================
document.addEventListener('DOMContentLoaded', () => {
  const chips = document.querySelectorAll('[data-role-chip]');
  const roleNote = document.getElementById('role-note');

  if (!chips.length || !roleNote) return;

  const copy = {
    Strategist:
      'As a Strategist, I design portfolios, initiatives, and learning environments that connect mission, data, and lived experience—helping teams see the system, not just the project.',
    Scholar:
      'As a Scholar, I draw from higher education research, learning sciences, and organizational theory to make design choices that are both rigorous and humane.',
    Creator:
      'As a Creator, I translate complex science and systems work into visuals and narratives—including The Echo Jar—that feel accessible, grounded, and w

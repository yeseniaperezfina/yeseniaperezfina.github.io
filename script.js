// ========= Year =========
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ========= Canvas constellation (observatory ceiling) =========
(function () {
  const canvas = document.getElementById('orbitCanvas');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  let width, height, particles;
  const COUNT = 80;
  const MAX_DISTANCE = 130;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const ratio = window.devicePixelRatio || 1;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    initParticles();
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    // move particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
    }

    // draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DISTANCE) {
          const alpha = 1 - dist / MAX_DISTANCE;
          ctx.strokeStyle = `rgba(148, 163, 184, ${alpha * 0.45})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    // draw stars
    for (const p of particles) {
      ctx.fillStyle = 'rgba(248, 250, 252, 0.9)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(step);
})();

// ========= Scroll spy for nav =========
(function () {
  const sections = document.querySelectorAll('[data-section]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const linkMap = {};
  navLinks.forEach(link => {
    const id = link.getAttribute('href').replace('#', '');
    linkMap[id] = link;
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (!id || !linkMap[id]) return;
          navLinks.forEach(l => l.classList.remove('is-active'));
          linkMap[id].classList.add('is-active');
        }
      });
    },
    { threshold: 0.45 }
  );

  sections.forEach(section => observer.observe(section));
})();

// ========= Scroll reveal for sections =========
(function () {
  const blocks = document.querySelectorAll('.section-block, .hero');
  if (!blocks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  blocks.forEach(block => observer.observe(block));
})();

// ========= Parallax on hero canvas =========
(function () {
  const layer = document.querySelector('.hero-canvas-wrap');
  if (!layer) return;

  function update() {
    const scrollY = window.scrollY || window.pageYOffset;
    const offset = scrollY * 0.04;
    layer.style.transform = `translateY(${offset}px)`;
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
})();

// ========= Tilt interaction on mode cards =========
(function () {
  const cards = document.querySelectorAll('[data-tilt]');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
    });
  });
})();


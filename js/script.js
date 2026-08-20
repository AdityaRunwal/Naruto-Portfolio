/**
 * ADITYA RUNWAL | AI/ML ENGINEER PORTFOLIO
 * Background Canvas, Glassmorphic Scrollspy Navigation & Contact Form Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initNavigation();
  initContactForm();
});

/* ==========================================================================
   2. BACKGROUND PARTICLE / CHAKRA CANVAS
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor(width / 25), 45);
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2 + 1,
      color: Math.random() > 0.3 ? 'rgba(255, 123, 0, ' : 'rgba(0, 191, 255, '
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Draw particle dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '0.6)';
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(255, 123, 0, ${(1 - dist / 130) * 0.15})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. NAVIGATION & SCROLLSPY
   ========================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  // Scroll shadow effect
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Scrollspy active state for single page anchors
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        link.classList.remove('active');
        if (currentSectionId && href === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      }
    });
  });

  // Mobile menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    // Close menu when clicking link
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }
}

/* ==========================================================================
   4. CONTACT FORM & MODAL HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const emailCard = document.getElementById('email-card');
  const modal = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('modal-close');
  const backdrop = document.getElementById('modal-backdrop');

  function openModal() {
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      const nameInput = document.getElementById('contact-name');
      if (nameInput) setTimeout(() => nameInput.focus(), 150);
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  // Open modal on Email card click
  if (emailCard) {
    emailCard.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  // Open modal for any trigger element with data-open-modal
  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close modal handlers
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Form submission handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const message = document.getElementById('contact-message')?.value.trim();

      if (!name || !email || !message) {
        alert('Please fill out all fields before sending.');
        return;
      }

      const subject = `Portfolio Inquiry from ${name}`;
      const body = `Hi Aditya,\n\n${message}\n\nBest regards,\n${name}\nContact Email: ${email}`;

      const mailtoUrl = `mailto:adityarunwal22@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      // Open email client
      window.location.href = mailtoUrl;

      // Show user feedback & close modal
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> MESSAGE PREPARED!';
        submitBtn.style.background = '#2ecc71';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          form.reset();
          closeModal();
        }, 1800);
      }
    });
  }
}
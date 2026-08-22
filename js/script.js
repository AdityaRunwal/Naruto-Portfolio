/**
 * ADITYA RUNWAL | AI/ML ENGINEER PORTFOLIO
 * Background Canvas, Navigation, EmailJS Contact Form & Mouse Interaction Effects
 */

/**
 * EMAILJS CONFIGURATION
 * Replace the placeholder values below with your credentials from EmailJS (https://www.emailjs.com/):
 * - PUBLIC_KEY: Found in EmailJS Account -> API Keys
 * - SERVICE_ID: Found in EmailJS Email Services
 * - TEMPLATE_ID: Found in EmailJS Email Templates
 */
const EMAILJS_CONFIG = {
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY',   // Replace with your EmailJS Public Key
  SERVICE_ID: 'YOUR_SERVICE_ID',   // Replace with your EmailJS Service ID
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID'  // Replace with your EmailJS Template ID
};

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundCanvas();
  initNavigation();
  initContactForm();
  initMouseEffects();
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
  function checkScroll() {
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  // Active ScrollSpy using IntersectionObserver
  if (sections.length > 0 && links.length > 0) {
    function setActiveLink(sectionId) {
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href === `#${sectionId}` || href.endsWith(`#${sectionId}`))) {
          link.classList.add('active');
        } else if (href && href.startsWith('#')) {
          link.classList.remove('active');
        }
      });
    }

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.getAttribute('id'));
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Handle scroll to bottom edge case for contact link
    window.addEventListener('scroll', () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        const contactLink = document.querySelector('.nav-links a[href="#contact"]');
        if (contactLink) {
          links.forEach(l => l.classList.remove('active'));
          contactLink.classList.add('active');
        }
      }
    }, { passive: true });
  }

  // Helper to close mobile menu
  function closeMobileMenu() {
    if (!navLinks) return;
    navLinks.classList.remove('active');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', 'false');
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    }
  }

  // Mobile menu toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navLinks.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !isActive);
        icon.classList.toggle('fa-xmark', isActive);
      }
    });

    // Close menu when clicking any nav link
    links.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Close menu when clicking outside navbar
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && navbar && !navbar.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Close menu on screen resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }
}

/* ==========================================================================
   4. CONTACT FORM & DUAL EMAILJS / MAILTO SYSTEM
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const emailCard = document.getElementById('email-card');
  const modal = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('modal-close');
  const backdrop = document.getElementById('modal-backdrop');
  const statusBanner = document.getElementById('form-status');

  // Initialize EmailJS if public key is configured
  if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    try {
      emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    } catch (err) {
      console.warn('EmailJS initialization warning:', err);
    }
  }

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

  if (emailCard) {
    emailCard.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  function showStatus(type, message) {
    if (!statusBanner) return;
    statusBanner.className = `form-status-banner status-${type}`;
    let icon = '';
    if (type === 'success') icon = '<i class="fa-solid fa-circle-check"></i>';
    else if (type === 'error') icon = '<i class="fa-solid fa-circle-xmark"></i>';
    else icon = '<i class="fa-solid fa-spinner fa-spin"></i>';

    statusBanner.innerHTML = `${icon} <span>${message}</span>`;
    statusBanner.style.display = 'flex';
  }

  function clearStatus() {
    if (statusBanner) {
      statusBanner.style.display = 'none';
      statusBanner.innerHTML = '';
      statusBanner.className = 'form-status-banner';
    }
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function triggerMailtoFallback(name, email, subject, message) {
    const bodyText = `Hi Aditya,\n\n${message}\n\nBest regards,\n${name}\nContact Email: ${email}`;
    const mailtoUrl = `mailto:adityarunwal22@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    window.location.href = mailtoUrl;
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearStatus();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');
      const submitBtn = document.getElementById('contact-submit-btn') || form.querySelector('button[type="submit"]');

      const name = nameInput?.value.trim() || '';
      const email = emailInput?.value.trim() || '';
      const subject = subjectInput?.value.trim() || '';
      const message = messageInput?.value.trim() || '';

      // Reset error highlights
      [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        if (input) input.classList.remove('is-invalid');
      });

      // Form validation
      if (!name) {
        if (nameInput) nameInput.classList.add('is-invalid');
        showStatus('error', 'Please enter your name.');
        nameInput?.focus();
        return;
      }

      if (!email || !validateEmail(email)) {
        if (emailInput) emailInput.classList.add('is-invalid');
        showStatus('error', 'Please enter a valid email address.');
        emailInput?.focus();
        return;
      }

      if (!subject) {
        if (subjectInput) subjectInput.classList.add('is-invalid');
        showStatus('error', 'Please enter a subject.');
        subjectInput?.focus();
        return;
      }

      if (!message) {
        if (messageInput) messageInput.classList.add('is-invalid');
        showStatus('error', 'Please write your message.');
        messageInput?.focus();
        return;
      }

      // Check if credentials are set
      const isConfigured = EMAILJS_CONFIG.PUBLIC_KEY && 
                           EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' &&
                           EMAILJS_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
                           EMAILJS_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';

      const originalBtnContent = submitBtn ? submitBtn.innerHTML : '';

      if (isConfigured) {
        // Send via EmailJS API
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Sending Message...</span>';
        }
        showStatus('info', 'Sending message, please wait...');

        const templateParams = {
          from_name: name,
          from_email: email,
          reply_to: email,
          subject: subject,
          message: message,
          to_name: 'Aditya Runwal'
        };

        try {
          await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams);

          showStatus('success', 'Message delivered successfully! Thank you for reaching out.');
          form.reset();

          setTimeout(() => {
            closeModal();
            clearStatus();
          }, 2200);

        } catch (err) {
          console.error('EmailJS Error:', err);
          showStatus('info', 'Opening email client fallback...');
          triggerMailtoFallback(name, email, subject, message);
          setTimeout(() => {
            closeModal();
            clearStatus();
            form.reset();
          }, 2000);
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
          }
        }
      } else {
        // Fallback gracefully without blocking the user
        showStatus('info', 'Preparing email client with your message...');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane fa-bounce"></i> <span>Opening Email...</span>';
        }

        triggerMailtoFallback(name, email, subject, message);

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
          }
          form.reset();
          closeModal();
          clearStatus();
        }, 2000);
      }
    });
  }
}

/* ==========================================================================
   5. ADVANCED HIGH-PERFORMANCE MOUSE INTERACTION EFFECTS
   ========================================================================== */
function initMouseEffects() {
  const isMobileWidth = window.innerWidth <= 768;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isMobileWidth || prefersReducedMotion) {
    return;
  }

  // Create custom cursor elements dynamically
  let cursorDot = document.querySelector('.custom-cursor-dot');
  let cursorOuter = document.querySelector('.custom-cursor-outer');
  let mouseSpotlight = document.querySelector('.mouse-spotlight');

  if (!cursorDot) {
    cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    document.body.appendChild(cursorDot);
  }

  if (!cursorOuter) {
    cursorOuter = document.createElement('div');
    cursorOuter.className = 'custom-cursor-outer';
    document.body.appendChild(cursorOuter);
  }

  if (!mouseSpotlight) {
    mouseSpotlight = document.createElement('div');
    mouseSpotlight.className = 'mouse-spotlight';
    document.body.appendChild(mouseSpotlight);
  }

  document.body.classList.add('has-custom-cursor');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX, dotY = mouseY;
  let outerX = mouseX, outerY = mouseY;
  let spotX = mouseX, spotY = mouseY;
  let hasMoved = false;

  function updatePointerPosition(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!hasMoved) {
      hasMoved = true;
      dotX = outerX = spotX = mouseX;
      dotY = outerY = spotY = mouseY;
      cursorDot.style.opacity = '1';
      cursorOuter.style.opacity = '1';
      mouseSpotlight.style.opacity = '1';
    }
  }

  window.addEventListener('mousemove', updatePointerPosition, { passive: true });
  window.addEventListener('pointermove', updatePointerPosition, { passive: true });

  // Click Ripple Aura Effect
  window.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 500);
  });

  // High performance spring physics loop
  function renderCursor() {
    if (hasMoved) {
      // Immediate precision dot position
      dotX = mouseX;
      dotY = mouseY;
      cursorDot.style.left = `${dotX}px`;
      cursorDot.style.top = `${dotY}px`;

      // Smooth trailing ring lerp
      outerX += (mouseX - outerX) * 0.2;
      outerY += (mouseY - outerY) * 0.2;
      cursorOuter.style.left = `${outerX}px`;
      cursorOuter.style.top = `${outerY}px`;

      // Soft ambient background spotlight lerp
      spotX += (mouseX - spotX) * 0.06;
      spotY += (mouseY - spotY) * 0.06;
      mouseSpotlight.style.left = `${spotX}px`;
      mouseSpotlight.style.top = `${spotY}px`;
    }

    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hide cursor on window leave
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorOuter.style.opacity = '0';
    mouseSpotlight.style.opacity = '0';
    hasMoved = false;
  });

  // Interactive Hover Targets
  const hoverSelectors = 'a, button, input, textarea, label, .category-card, .skill-card, .project-card, .contact-channel-card, .highlight-box, .about-card';

  document.body.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.body.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Card 3D Perspective Tilt & Radial Mouse Spotlight Sheen
  const cards = document.querySelectorAll('.category-card, .skill-card, .project-card, .contact-channel-card, .highlight-box, .about-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`;
    }, { passive: true });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // Magnetic Hover Effect on Buttons & Logo
  const magneticElements = document.querySelectorAll('.btn-primary, .btn-outline, .btn-secondary, .logo, .modal-close-btn');

  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    }, { passive: true });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });
}
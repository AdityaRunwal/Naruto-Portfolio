/**
 * INTRO / LOADING ANIMATION — "ENTERING THE NINJA WORLD"
 * Plays once per browser session on the home page, then hands off to the
 * existing Hero entrance animations already defined in style.css.
 *
 * - No dependencies. Pure canvas + CSS.
 * - Skippable via click / keydown / the Skip button.
 * - Persists "seen" state in sessionStorage for the current tab session.
 * - Respects prefers-reduced-motion (shows a short static fade instead).
 */
(function () {
  var STORAGE_KEY = 'introPlayed';
  var DURATION_MS = 3200; // keep in sync with --intro-duration in intro.css

  var alreadyPlayed = false;
  try {
    alreadyPlayed = sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch (e) {
    // sessionStorage unavailable (privacy mode, etc.) — fail open, don't block the site
    alreadyPlayed = false;
  }

  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (alreadyPlayed) {
    // Nothing to build — remove the overlay markup entirely so it can't flash.
    document.addEventListener('DOMContentLoaded', function () {
      var overlay = document.getElementById('intro-overlay');
      if (overlay) overlay.remove();
      document.documentElement.classList.remove('intro-lock');
    });
    return;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var overlay = document.getElementById('intro-overlay');
    if (!overlay) return;

    document.documentElement.classList.add('intro-lock');

    var canvas = document.getElementById('intro-canvas');
    var ctx = canvas ? canvas.getContext('2d') : null;
    var rafId = null;
    var finished = false;

    function markSeen() {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch (e) { /* ignore */ }
    }

    function finish() {
      if (finished) return;
      finished = true;
      markSeen();

      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('keydown', onKeydown);
      overlay.removeEventListener('click', finish);

      overlay.classList.add('intro-hidden');
      document.documentElement.classList.remove('intro-lock');

      window.setTimeout(function () {
        if (overlay && overlay.parentNode) overlay.remove();
      }, 650);
    }

    function onKeydown(e) {
      // Any key skips, matching "click or press a key" requirement.
      finish();
    }

    overlay.addEventListener('click', finish);
    document.addEventListener('keydown', onKeydown);

    var skipBtn = document.getElementById('intro-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        finish();
      });
    }

    // Reduced motion: short static fade only, no canvas work, shorter hold.
    if (prefersReducedMotion) {
      window.setTimeout(finish, 900);
      return;
    }

    // Auto-finish once the full cinematic timeline has played.
    window.setTimeout(finish, DURATION_MS + 550);

    if (!canvas || !ctx) return;

    var width, height, dpr;

    function resizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // --- Chakra energy tendril system -------------------------------------
    // A handful of curved, glowing streaks orbit toward center, orange-led
    // with a few cool green/blue accents for contrast. Trails are produced
    // via a low-alpha fill instead of clearRect for a soft motion-blur feel.
    var cx = 0, cy = 0;
    var tendrilCount = Math.min(Math.max(Math.floor(width / 140), 5), 9);
    var tendrils = [];

    function seedTendrils() {
      cx = width / 2;
      cy = height / 2;
      tendrils = [];
      for (var i = 0; i < tendrilCount; i++) {
        var angle = (Math.PI * 2 * i) / tendrilCount + Math.random() * 0.6;
        var radius = Math.max(width, height) * (0.55 + Math.random() * 0.25);
        var isGreen = i % 4 === 0; // minority accent color
        tendrils.push({
          angle: angle,
          radius: radius,
          speed: 0.0016 + Math.random() * 0.0012,
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: 0.015 + Math.random() * 0.01,
          size: isGreen ? 1.6 : 2.4 + Math.random() * 1.6,
          color: isGreen ? '30, 160, 110' : '255, ' + (110 + Math.random() * 60 | 0) + ', 20',
          progress: Math.random() * 0.3
        });
      }
    }
    seedTendrils();
    window.addEventListener('resize', seedTendrils);

    var startTime = null;

    function draw(ts) {
      if (startTime === null) startTime = ts;
      var elapsed = ts - startTime;
      var t = Math.min(elapsed / DURATION_MS, 1);

      // Fading trail effect
      ctx.fillStyle = 'rgba(5, 5, 6, 0.16)';
      ctx.fillRect(0, 0, width, height);

      // Convergence eases in during the back half of the timeline
      var convergence = t < 0.45 ? 0 : Math.min((t - 0.45) / 0.4, 1);
      var easedConvergence = 1 - Math.pow(1 - convergence, 3);

      for (var i = 0; i < tendrils.length; i++) {
        var p = tendrils[i];
        p.progress += p.speed * 16;
        p.wobble += p.wobbleSpeed;

        var r = p.radius * (1 - easedConvergence * 0.92);
        var wob = Math.sin(p.wobble) * 18;
        var x = cx + Math.cos(p.angle + p.progress) * r + wob;
        var y = cy + Math.sin(p.angle + p.progress) * r * 0.7 + wob;

        ctx.save();
        ctx.shadowBlur = 18;
        ctx.shadowColor = 'rgba(' + p.color + ', 0.9)';
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ', 0.85)';
        ctx.fill();
        ctx.restore();
      }

      if (!finished) {
        rafId = requestAnimationFrame(draw);
      }
    }

    rafId = requestAnimationFrame(draw);
  });
})();

/* ========================================
   KULDIP PATEL PORTFOLIO - main.js
   Neural Interface Theme
======================================== */

(function () {
  'use strict';

  /* Shared canvas particle colour — updated by theme toggle */
  var particleColorValue = '0,212,255';

  /* ========================================
     NAVBAR - SHRINK ON SCROLL + ACTIVE LINKS
  ======================================== */
  var navbar = document.getElementById('navbar');
  var navLinks = document.querySelectorAll('.nav-link');
  var sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Shrink navbar
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active nav link tracking
    var scrollY = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* ========================================
     HAMBURGER MENU
  ======================================== */
  var hamburger = document.getElementById('hamburger');
  var navMenu = document.getElementById('navLinks');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ========================================
     SMOOTH SCROLL
  ======================================== */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var offset = 70;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ========================================
     TYPEWRITER EFFECT
  ======================================== */
  var typewriterEl = document.getElementById('typewriterText');
  if (typewriterEl) {
    var phrases = [
      'AI Specialist',
      'AI Educator',
      'Founder | AI School for Kids',
      'Technology Analyst',
      'Cloud Expert',
      'Product Manager'
    ];
    var phraseIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typingSpeed = 90;
    var deletingSpeed = 50;
    var pauseAfterType = 1800;
    var pauseAfterDelete = 400;

    function typeStep() {
      var current = phrases[phraseIndex];
      if (isDeleting) {
        charIndex--;
        typewriterEl.textContent = current.substring(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(typeStep, pauseAfterDelete);
          return;
        }
        setTimeout(typeStep, deletingSpeed);
      } else {
        charIndex++;
        typewriterEl.textContent = current.substring(0, charIndex);
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(typeStep, pauseAfterType);
          return;
        }
        setTimeout(typeStep, typingSpeed);
      }
    }

    setTimeout(typeStep, 800);
  }

  /* ========================================
     NEURAL NETWORK CANVAS ANIMATION
  ======================================== */
  var canvas = document.getElementById('neuralCanvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 65;
    var connectionDistance = 150;
    var mouseX = -9999;
    var mouseY = -9999;
    var mouseRadius = 160;
    var animFrame;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      };
    }

    function initParticles() {
      particles = [];
      for (var i = 0; i < particleCount; i++) {
        particles.push(createParticle());
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            var alpha = (1 - dist / connectionDistance) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(' + particleColorValue + ',' + alpha + ')';
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (var k = 0; k < particles.length; k++) {
        var p = particles[k];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.burst) {
          ctx.fillStyle = 'rgba(255,255,255,' + p.opacity + ')';
          ctx.fill();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 3, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(' + particleColorValue + ',' + (p.opacity * 0.6) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fillStyle = 'rgba(' + particleColorValue + ',' + p.opacity + ')';
          ctx.fill();
          if (p.radius > 2) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius + 2, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(' + particleColorValue + ',' + (p.opacity * 0.3) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function updateParticles() {
      for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];

        // Burst particle lifecycle
        if (p.burst) {
          p.life -= 0.022;
          p.opacity = Math.max(0, p.life * 0.9);
          if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
          }
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.x += p.vx;
          p.y += p.vy;
          continue;
        }

        // Mouse attraction
        var mdx = mouseX - p.x;
        var mdy = mouseY - p.y;
        var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < mouseRadius && mdist > 0) {
          var force = (mouseRadius - mdist) / mouseRadius * 0.015;
          p.vx += (mdx / mdist) * force;
          p.vy += (mdy / mdist) * force;
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Max speed cap
        var speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.2) {
          p.vx = (p.vx / speed) * 1.2;
          p.vy = (p.vy / speed) * 1.2;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Boundary wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
    }

    function animate() {
      updateParticles();
      drawParticles();
      animFrame = requestAnimationFrame(animate);
    }

    resizeCanvas();
    initParticles();
    animate();

    // Mouse interaction
    document.addEventListener('mousemove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    document.addEventListener('mouseleave', function () {
      mouseX = -9999;
      mouseY = -9999;
    });

    // Touch support
    canvas.addEventListener('touchmove', function (e) {
      if (e.touches.length > 0) {
        var rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
      }
    }, { passive: true });

    // Click to burst
    canvas.addEventListener('click', function (e) {
      var rect = canvas.getBoundingClientRect();
      var cx = e.clientX - rect.left;
      var cy = e.clientY - rect.top;
      var count = 12;
      for (var b = 0; b < count; b++) {
        var angle = (b / count) * Math.PI * 2 + Math.random() * 0.4;
        var speed = Math.random() * 4 + 1.5;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 2 + 1,
          opacity: 0.9,
          burst: true,
          life: 1.0
        });
      }
    });

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resizeCanvas();
        initParticles();
      }, 200);
    });
  }

  /* ========================================
     AOS - INTERSECTION OBSERVER ANIMATIONS
  ======================================== */
  function initAOS() {
    var elements = document.querySelectorAll('[data-aos]');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-aos-delay') || '0', 10);
          setTimeout(function () {
            el.classList.add('aos-animate');
          }, delay);
          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  initAOS();


  /* ========================================
     COUNTER ANIMATION FOR STATS
  ======================================== */
  function animateCounter(el, target, duration) {
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(step);
  }

  function initCounters() {
    var counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10);
          animateCounter(el, target, 1800);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  initCounters();

  /* ========================================
     CONTACT FORM HANDLER
  ======================================== */
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');
  var formSubmit = document.getElementById('formSubmit');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('formName');
      var email = document.getElementById('formEmail');
      var subject = document.getElementById('formSubject');
      var message = document.getElementById('formMessage');

      // Basic validation
      if (!name || !name.value.trim()) {
        showStatus('error', 'Please enter your name.');
        if (name) name.focus();
        return;
      }

      if (!email || !email.value.trim() || !isValidEmail(email.value)) {
        showStatus('error', 'Please enter a valid email address.');
        if (email) email.focus();
        return;
      }

      if (!message || !message.value.trim()) {
        showStatus('error', 'Please enter your message.');
        if (message) message.focus();
        return;
      }

      // Simulate sending
      if (formSubmit) {
        formSubmit.disabled = true;
        formSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';
      }

      // Build mailto link as fallback
      var mailtoBody = 'Name: ' + (name ? name.value : '') + '%0D%0A' +
                       'Email: ' + (email ? email.value : '') + '%0D%0A%0D%0A' +
                       (message ? message.value : '');
      var mailtoSubject = subject && subject.value ? subject.value : 'Portfolio Inquiry';
      var mailtoLink = 'mailto:lazyprogrammer9033@gmail.com' +
                       '?subject=' + encodeURIComponent(mailtoSubject) +
                       '&body=' + mailtoBody;

      setTimeout(function () {
        window.location.href = mailtoLink;

        if (formSubmit) {
          formSubmit.disabled = false;
          formSubmit.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Send Message</span>';
        }

        showStatus('success', 'Opening your email client...');
        contactForm.reset();

        setTimeout(function () {
          if (formStatus) formStatus.textContent = '';
        }, 4000);
      }, 900);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showStatus(type, msg) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className = 'form-status ' + type;
  }

  /* ========================================
     NAVBAR Z-INDEX FIX FOR MOBILE MENU
  ======================================== */
  if (hamburger && navMenu) {
    navMenu.style.zIndex = '999';
  }

  /* ========================================
     INITIAL SCROLL CHECK
     (in case page is loaded mid-scroll)
  ======================================== */
  onScroll();

  /* ========================================
     READING PROGRESS BAR
  ======================================== */
  var readingProgress = document.getElementById('readingProgress');
  if (readingProgress) {
    function updateProgress() {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? Math.min((window.scrollY / docHeight) * 100, 100) : 0;
      readingProgress.style.width = pct + '%';
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ========================================
     BACK TO TOP BUTTON
  ======================================== */
  var backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ========================================
     CURSOR GLOW (DESKTOP ONLY)
  ======================================== */
  if (!('ontouchstart' in window) && window.matchMedia('(pointer: fine)').matches) {
    var cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    var glowTargetX = -400, glowTargetY = -400;
    var glowCurrentX = -400, glowCurrentY = -400;

    document.addEventListener('mousemove', function (e) {
      glowTargetX = e.clientX;
      glowTargetY = e.clientY;
    });

    document.addEventListener('mouseleave', function () {
      glowTargetX = -400;
      glowTargetY = -400;
    });

    (function animateCursorGlow() {
      glowCurrentX += (glowTargetX - glowCurrentX) * 0.1;
      glowCurrentY += (glowTargetY - glowCurrentY) * 0.1;
      cursorGlow.style.transform = 'translate(' + (glowCurrentX - 200) + 'px, ' + (glowCurrentY - 200) + 'px)';
      requestAnimationFrame(animateCursorGlow);
    })();
  }

  /* ========================================
     3D CARD TILT ON HOVER
  ======================================== */
  if (!('ontouchstart' in window)) {
    var tiltCards = document.querySelectorAll(
      '.skill-card, .project-card, .cert-card, .edu-card, .timeline-card'
    );
    tiltCards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = (e.clientY - rect.top) / rect.height;
        var tiltX = (y - 0.5) * -10;
        var tiltY = (x - 0.5) * 10;
        card.style.transform = 'perspective(900px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg) translateY(-6px)';
        card.style.borderColor = 'rgba(0,212,255,0.55)';
        card.style.boxShadow = '0 18px 40px rgba(0,212,255,0.18), 0 0 18px rgba(0,212,255,0.12)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
        card.style.borderColor = '';
        card.style.boxShadow = '';
      });
    });
  }

  /* ========================================
     BUTTON RIPPLE EFFECT
  ======================================== */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 700);
    });
  });

  /* ========================================
     DAY / NIGHT THEME TOGGLE
  ======================================== */
  var themeToggleBtn = document.getElementById('themeToggle');
  var htmlEl = document.documentElement;

  function applyTheme(theme, animate) {
    if (animate) {
      document.body.classList.add('theme-transitioning');
      setTimeout(function () {
        document.body.classList.remove('theme-transitioning');
      }, 500);
    }
    if (theme === 'light') {
      htmlEl.setAttribute('data-theme', 'light');
      particleColorValue = '0,100,180';
    } else {
      htmlEl.removeAttribute('data-theme');
      particleColorValue = '0,212,255';
    }
    localStorage.setItem('theme', theme);
  }

  /* Apply saved preference on load */
  var savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme, false);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
      var current = htmlEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light', true);
    });
  }

})();

/* ========================================
   KULDIP PATEL PORTFOLIO - main.js
   Neural Interface Theme
======================================== */

(function () {
  'use strict';

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
      'Tech Support Team Lead',
      'AI Educator',
      'Founder | AI School for Kids',
      'Technology Analyst',
      'Networking Expert'
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
            ctx.strokeStyle = 'rgba(0,212,255,' + alpha + ')';
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
        ctx.fillStyle = 'rgba(0,212,255,' + p.opacity + ')';
        ctx.fill();

        // Glow ring for some particles
        if (p.radius > 2) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius + 2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(0,212,255,' + (p.opacity * 0.3) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    function updateParticles() {
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

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

        // Boundary bounce with wrap
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
     SKILL BAR ANIMATION ON SCROLL
  ======================================== */
  function initSkillBars() {
    var skillBars = document.querySelectorAll('.skill-bar-fill');
    if (!skillBars.length) return;

    var skillObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          var width = bar.getAttribute('data-width') || '0';
          setTimeout(function () {
            bar.style.width = width + '%';
          }, 200);
          skillObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.3 });

    skillBars.forEach(function (bar) {
      bar.style.width = '0%';
      skillObserver.observe(bar);
    });
  }

  initSkillBars();

  /* ========================================
     COUNTER ANIMATION FOR STATS
  ======================================== */
  function animateCounter(el, target, duration) {
    var start = 0;
    var startTime = null;
    var isFloat = target % 1 !== 0;

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

})();

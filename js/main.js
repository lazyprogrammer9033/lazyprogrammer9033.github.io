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

  function closeMenu() {
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('scroll', function () {
      if (navMenu.classList.contains('open')) {
        closeMenu();
      }
    }, { passive: true });
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

      if (formSubmit) {
        formSubmit.disabled = true;
        formSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';
      }

      var formData = {
        name:    name    ? name.value.trim()    : '',
        email:   email   ? email.value.trim()   : '',
        subject: subject ? subject.value.trim() : 'Portfolio Inquiry',
        message: message ? message.value.trim() : ''
      };

      fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(formData)
      })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (result) {
        if (result.ok) {
          showStatus('success', 'Message sent! I\'ll get back to you soon.');
          contactForm.reset();
          setTimeout(function () { if (formStatus) formStatus.textContent = ''; }, 5000);
        } else {
          var errMsg = (result.data.errors || []).map(function (e) { return e.message; }).join(', ');
          showStatus('error', errMsg || 'Something went wrong. Please try again.');
        }
      })
      .catch(function () {
        showStatus('error', 'Network error. Please email me directly at lazyprogrammer9033@gmail.com');
      })
      .finally(function () {
        if (formSubmit) {
          formSubmit.disabled = false;
          formSubmit.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Send Message</span>';
        }
      });
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
     AI CHAT WIDGET
  ======================================== */
  var chatToggle   = document.getElementById('chatToggle');
  var chatPanel    = document.getElementById('chatPanel');
  var chatClose    = document.getElementById('chatClose');
  var chatMessages = document.getElementById('chatMessages');
  var chatInput    = document.getElementById('chatInput');
  var chatSend     = document.getElementById('chatSend');
  var chatSuggs    = document.getElementById('chatSuggestions');
  var chatIsOpen   = false;

  var chatKB = [
    { k: ['hi ', 'hello', 'hey ', 'howdy', 'good morning', 'good evening', 'good afternoon', 'sup '],
      r: "Hey there! 👋 I'm Kuldip's AI assistant. Ask me about his experience, skills, education, projects, or how to get in touch!" },
    { k: ['who ', 'about kuldip', 'introduce', 'yourself', 'tell me about', 'bio', 'background'],
      r: "Kuldip Patel is an AI-Certified Technology Specialist based in Canada. He's the Founder of AI School for Kids and Technology Support II Team Lead at Walmart Canada. With 7+ years bridging enterprise IT and AI education — building intelligent systems while teaching kids to build them too." },
    { k: ['experience', 'work history', 'career', 'job', 'roles', 'positions', 'worked'],
      r: "Kuldip's career (7+ years):\n→ Founder, AI School for Kids (2026–Now)\n→ Tech Support II Team Lead, Walmart Canada (2023–Now)\n→ Senior Analyst, MUFG (2022–2023)\n→ Senior IT Specialist, Walmart Canada (2021–2022)\n→ System Administrator (2019–2021)" },
    { k: ['skill', 'tech stack', 'expertise', 'know', 'good at', 'proficien', 'capabilit', 'what can'],
      r: "Kuldip's skills span two worlds:\n\nTech: Azure Cloud, Python, AI/ML, IT Security, ServiceNow, MS Office 365\n\nLeadership: Team Leadership, Product Management, AI Curriculum Design, Executive Support" },
    { k: ['education', 'degree', 'study', 'university', 'college', 'academ', 'qualif', 'mcmaster', 'vishwakarma'],
      r: "🎓 B.Tech Computer Engineering — Vishwakarma Government College, Ahmedabad\n🎓 Degree in Data Analytics — McMaster University, Canada (2024–2026, in progress)" },
    { k: ['cert', 'certif', 'credential', 'badge', 'qualified', 'az-900', 'azure ai', 'google cert'],
      r: "Kuldip holds 5 certifications:\n✅ Machine Learning: AI For Everyone — Coursera\n✅ MS Azure AI — Microsoft\n✅ Generative AI — Google\n✅ Python — Google\n✅ Azure Fundamentals AZ-900 — Microsoft" },
    { k: ['ai school', 'school for kid', 'aischoolforkid', 'teach kid', 'children', 'kid', 'student', 'educat'],
      r: "AI School for Kids is Kuldip's flagship initiative — teaching AI to Canadian children ages 8–16. Curriculum covers Prompt Engineering, ML basics, and responsible AI use. 50+ students taught nationwide so far! 🤖\n\nVisit: www.aischoolforkids.ca" },
    { k: ['project', 'portfolio', 'built', 'created', 'made ', 'build', 'chatbot', 'gls', 'walmart project'],
      r: "Key projects:\n🤖 AI School for Kids — Canada's AI education platform for children (aischoolforkids.ca)\n🗄️ Walmart GLS Migration — Led enterprise legacy-to-modern platform migration\n💬 AI Chatbot — NLP chatbot that automated Level 1 IT support using Python + Gen AI" },
    { k: ['contact', 'hire', 'reach', 'email', 'connect', 'consult', 'work with', 'availab', 'open to'],
      r: "Kuldip is open to AI consulting & collaboration! 🚀\n\n📧 lazyprogrammer9033@gmail.com\n💼 linkedin.com/in/kuldip9033\n\nOr use the Contact form on this page!" },
    { k: ['azure', 'cloud', 'infrastructure', 'az900', 'microsoft azure'],
      r: "Kuldip is double Azure-certified (AZ-900 + MS Azure AI) with hands-on experience in Azure cloud administration, identity management, and AI services — used at both MUFG and Walmart Canada." },
    { k: ['python', 'programming', 'coding', 'script', 'automat', 'developer', 'code'],
      r: "Kuldip is Google-certified in Python and uses it for AI/ML prototyping, automation, and NLP. He built an enterprise AI chatbot entirely in Python, integrated with Generative AI models and ServiceNow ticketing." },
    { k: ['product', 'product management', ' pm ', 'roadmap', 'manage product'],
      r: "Beyond technical roles, Kuldip brings strong product management skills — leading cross-functional teams, defining requirements, and delivering enterprise IT projects. He applies this at AI School for Kids managing curriculum roadmap and platform growth." },
    { k: ['location', 'where ', 'based', 'country', 'canada', 'mississauga', 'ontario', 'remote'],
      r: "Kuldip is based in Mississauga, Ontario, Canada 🍁. He works hybrid at Walmart Canada and is open to remote consulting worldwide." },
    { k: ['ai ', 'machine learning', ' ml ', 'nlp', 'generat', 'llm', 'artificial'],
      r: "AI & ML is Kuldip's true passion. He's certified by Google, Microsoft, and Coursera in AI/ML, built an NLP enterprise chatbot, and founded a school to teach AI to kids. He's actively consulting, educating, and building in the AI space." }
  ];

  function chatMatch(input) {
    var lower = ' ' + input.toLowerCase() + ' ';
    for (var i = 0; i < chatKB.length; i++) {
      for (var j = 0; j < chatKB[i].k.length; j++) {
        if (lower.indexOf(chatKB[i].k[j]) !== -1) return chatKB[i].r;
      }
    }
    return "Great question! I'm best at answering about Kuldip's experience, skills, education, certifications, projects, or how to contact him. Try one of those! 😊";
  }

  function addChatMsg(text, sender) {
    var wrap = document.createElement('div');
    wrap.className = 'chat-msg chat-msg-' + sender;

    if (sender === 'bot') {
      var av = document.createElement('div');
      av.className = 'chat-msg-avatar';
      av.innerHTML = '<i class="fa-solid fa-robot"></i>';
      wrap.appendChild(av);
    }

    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    wrap.appendChild(bubble);
    chatMessages.appendChild(wrap);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (sender === 'bot') {
      var lines = text.split('\n');
      var li = 0, ci = 0;
      function typeNext() {
        if (li >= lines.length) { bubble.innerHTML = lines.join('<br>'); return; }
        var line = lines[li];
        if (ci < line.length) {
          bubble.innerHTML = lines.slice(0, li).join('<br>') +
            (li > 0 ? '<br>' : '') + line.slice(0, ci + 1) +
            '<span class="chat-cursor">|</span>';
          ci++;
          chatMessages.scrollTop = chatMessages.scrollHeight;
          setTimeout(typeNext, 16);
        } else {
          li++; ci = 0;
          setTimeout(typeNext, li < lines.length ? 40 : 0);
        }
      }
      setTimeout(typeNext, 350);
    } else {
      bubble.textContent = text;
    }
  }

  function sendChat(text) {
    if (!text || !text.trim()) return;
    if (chatSuggs) chatSuggs.style.display = 'none';
    addChatMsg(text, 'user');
    if (chatInput) chatInput.value = '';

    var typing = document.createElement('div');
    typing.className = 'chat-msg chat-msg-bot chat-typing';
    typing.innerHTML = '<div class="chat-msg-avatar"><i class="fa-solid fa-robot"></i></div>' +
      '<div class="chat-bubble"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    setTimeout(function () {
      if (chatMessages.contains(typing)) chatMessages.removeChild(typing);
      addChatMsg(chatMatch(text), 'bot');
    }, 850);
  }

  if (chatToggle && chatPanel) {
    chatToggle.addEventListener('click', function () {
      chatIsOpen = !chatIsOpen;
      chatPanel.classList.toggle('open', chatIsOpen);
      chatToggle.classList.toggle('active', chatIsOpen);
      if (chatIsOpen && chatInput) chatInput.focus();
    });

    if (chatClose) chatClose.addEventListener('click', function () {
      chatIsOpen = false;
      chatPanel.classList.remove('open');
      chatToggle.classList.remove('active');
    });

    if (chatSend) chatSend.addEventListener('click', function () { sendChat(chatInput ? chatInput.value : ''); });

    if (chatInput) chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') sendChat(chatInput.value);
    });

    document.querySelectorAll('.chat-chip').forEach(function (chip) {
      chip.addEventListener('click', function () { sendChat(chip.textContent.trim()); });
    });

    /* Initial greeting after 1.5s */
    setTimeout(function () {
      addChatMsg("Hi! 👋 I'm Kuldip's AI assistant. Ask me about his experience, skills, projects, or how to reach him!", 'bot');
    }, 1500);
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

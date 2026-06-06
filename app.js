document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // State flags
  let isSystemBooted = false;

  /* -------------------------------------------------------------
     THEME CONTROLLER (LIGHT/DARK MODE)
  ------------------------------------------------------------- */
  const themeBtn = document.getElementById('btn-theme-toggle');

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isLight = document.documentElement.classList.contains('light-theme');
      applyTheme(isLight ? 'dark' : 'light');
    });
  }

  // Add Alt+T keyboard shortcut to toggle theme
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 't') {
      e.preventDefault();
      const isLight = document.documentElement.classList.contains('light-theme');
      applyTheme(isLight ? 'dark' : 'light');
      speakText(isLight ? "Interface reverted to dark mode." : "Interface switched to light mode.");
    }
  });

  /* -------------------------------------------------------------
     AI VOICE ASSISTANT SYSTEM & CONTROLLERS
  ------------------------------------------------------------- */
  const voiceWidget = document.getElementById('ai-voice-core');
  const voiceStatus = document.getElementById('voice-status-text');
  const voiceAction = document.getElementById('voice-action-text');
  const micBtn = document.getElementById('btn-mic-toggle');

  let synth = window.speechSynthesis;
  let recognition = null;
  let isListening = false;

  // Setup browser Web Speech Recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListening = true;
      if (voiceWidget) voiceWidget.classList.add('listening');
      if (voiceStatus) voiceStatus.textContent = "AI CORE: LISTENING";
      if (voiceAction) voiceAction.textContent = "Listening for navigation commands...";
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      if (voiceAction) voiceAction.textContent = `Command: "${command}"`;
      handleVoiceCommand(command);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (voiceStatus) voiceStatus.textContent = "AI CORE: ONLINE";
      if (voiceAction) voiceAction.textContent = "Error listening. Press mic to retry.";
      stopListening();
    };

    recognition.onend = () => {
      stopListening();
    };
  } else {
    if (micBtn) micBtn.style.display = 'none';
    if (voiceAction) voiceAction.textContent = "Voice commands unsupported.";
  }

  function startListening() {
    if (recognition && !isListening) {
      if (synth) synth.cancel(); // Stop current speaking when user speaks
      try {
        recognition.start();
      } catch (err) {
        console.error("Failed to start speech recognition:", err);
      }
    }
  }

  function stopListening() {
    isListening = false;
    if (voiceWidget) voiceWidget.classList.remove('listening');
    if (voiceStatus) voiceStatus.textContent = "AI CORE: ONLINE";
    setTimeout(() => {
      if (voiceWidget && !voiceWidget.classList.contains('speaking')) {
        if (voiceAction) voiceAction.textContent = "Say 'Projects', 'About', 'Skills'...";
      }
    }, 2000);
  }

  if (micBtn) {
    micBtn.addEventListener('click', () => {
      if (isListening) {
        recognition.stop();
      } else {
        startListening();
      }
    });
  }

  // Speak welcome or status update
  function speakText(text) {
    if (!synth) return;
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synth.getVoices();
    const femaleVoice = voices.find(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Aria') || v.name.includes('Zira') || v.name.includes('Hazel') || v.name.includes('female') || v.name.includes('Google US English'))
    );
    
    if (femaleVoice) utterance.voice = femaleVoice;
    utterance.pitch = 1.0;
    utterance.rate = 0.95; // Calm and intelligent pace
    
    utterance.onstart = () => {
      if (voiceWidget) voiceWidget.classList.add('speaking');
      if (voiceStatus) voiceStatus.textContent = "AI CORE: TRANSMITTING";
      if (voiceAction) voiceAction.textContent = "AI Speaking...";
    };
    
    utterance.onend = () => {
      if (voiceWidget) voiceWidget.classList.remove('speaking');
      if (voiceStatus) voiceStatus.textContent = "AI CORE: ONLINE";
      if (voiceAction) voiceAction.textContent = "Say 'Projects', 'About', 'Skills'...";
    };

    synth.speak(utterance);
  }

  // Load voices asynchronously for browser compatibility
  if (synth && synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = () => {};
  }

  function handleVoiceCommand(cmd) {
    if (cmd.includes('projects') || cmd.includes('work')) {
      scrollToSection('projects');
      speakText("Accessing projects showcase portal.");
    } else if (cmd.includes('about') || cmd.includes('profile')) {
      scrollToSection('about');
      speakText("Opening identity profile core.");
    } else if (cmd.includes('skills') || cmd.includes('matrix')) {
      scrollToSection('skills');
      speakText("Initializing engineering skills matrix.");
    } else if (cmd.includes('contact') || cmd.includes('link') || cmd.includes('mail')) {
      scrollToSection('contact');
      speakText("Opening contact link node.");
    } else if (cmd.includes('resume') || cmd.includes('cv')) {
      speakText("Opening Rania's professional profile payload.");
      setTimeout(() => {
        window.open('https://github.com/ranx-kernel', '_blank');
      }, 1200);
    } else if (cmd.includes('light mode') || cmd.includes('light theme')) {
      applyTheme('light');
      speakText("Switching engine visual interface to light theme.");
    } else if (cmd.includes('dark mode') || cmd.includes('dark theme')) {
      applyTheme('dark');
      speakText("Switching engine visual interface to dark theme.");
    } else if (cmd.includes('toggle theme') || cmd.includes('change theme')) {
      const isLight = document.documentElement.classList.contains('light-theme');
      applyTheme(isLight ? 'dark' : 'light');
      speakText(isLight ? "Theme adjusted to dark mode." : "Theme adjusted to light mode.");
    } else if (cmd.includes('protocol') || cmd.includes('overdrive') || cmd.includes('activate') || cmd.includes('vania')) {
      speakText("Cognitive overdrive protocol verified. Initializing visual burst.");
      triggerVisualOverdrive();
    } else {
      speakText("Request not resolved. Say projects, about, skills, contact, or theme commands.");
    }
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      // Update nav link active states
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        if (link.getAttribute('data-target') === id) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
          // Update indicators
          const activePill = document.querySelector('.nav-dock-pill');
          if (activePill) {
            const activeRect = link.getBoundingClientRect();
            const parentRect = link.parentElement.getBoundingClientRect();
            activePill.style.left = `${activeRect.left - parentRect.left}px`;
            activePill.style.width = `${activeRect.width}px`;
          }
        }
      });
    }
  }

  function triggerVisualOverdrive() {
    const canvasEl = document.getElementById('bg-canvas');
    if (canvasEl) {
      canvasEl.style.transition = 'filter 0.5s ease-out';
      canvasEl.style.filter = 'hue-rotate(180deg) saturate(3.5) contrast(1.2)';
      setTimeout(() => {
        canvasEl.style.filter = 'none';
      }, 3000);
    }
    // Spawn color shockwaves in background
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        ripples.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: 0,
          maxRadius: 280,
          opacity: 0.9,
          speed: 5.5
        });
      }, i * 180);
    }
  }

  /* -------------------------------------------------------------
     CINEMA LOADER SEQUENCE (GESTURE BOOT CONTROL)
  ------------------------------------------------------------- */
  const cinemaLoader = document.getElementById('cinema-loader');
  const terminalLogs = document.getElementById('loader-terminal-logs');
  const progressFill = document.querySelector('.loader-progress-fill');
  const percentText = document.querySelector('.percent-text');
  const pageWrapper = document.querySelector('.page-wrapper');
  const navDock = document.getElementById('nav-dock');
  
  const bootBtn = document.getElementById('btn-boot-system');
  const startPanel = document.getElementById('loader-start-panel');
  const runningPanel = document.getElementById('loader-running-panel');

  const bootLogs = [
    { text: 'SYSTEM INITIALIZATION INITIATED...', delay: 100 },
    { text: 'ESTABLISHING SECURE PROTOCOLS...', delay: 200 },
    { text: 'LOADING ENGINE CORRESPONDENTS: OK', delay: 350 },
    { text: 'INJECTING ENVIRONMENT SYSTEM: CANVAS_BG_ACTIVE', delay: 500 },
    { text: 'RESOLVING TYPOGRAPHY MODEL: SATOSHI_OUTFIT', delay: 650 },
    { text: 'DEPLOYING NEURAL CONNECTOR GRAPHICS...', delay: 800 },
    { text: 'IDENTITY DATA PACK RECEIVED: RANIA R', delay: 1000 },
    { text: 'ESTABLISHING SECURE SHELL INTERFACES...', delay: 1150 },
    { text: 'STATUS: ALL CORES OPERATIONAL (100% READY)', delay: 1300 }
  ];

  if (bootBtn) {
    bootBtn.addEventListener('click', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(startPanel, {
          opacity: 0,
          scale: 0.95,
          duration: 0.4,
          onComplete: () => {
            startPanel.style.display = 'none';
            runningPanel.style.display = 'block';
            gsap.fromTo(runningPanel, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
            runBootSequence();
          }
        });
      } else {
        startPanel.style.display = 'none';
        runningPanel.style.display = 'block';
        runBootSequence();
      }
    });
  } else {
    // Fallback if button is missing
    setTimeout(runBootSequence, 500);
  }

  function runBootSequence() {
    let logIndex = 0;
    let progress = 0;
    
    // Simulate Progress Bar
    const progressInterval = setInterval(() => {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
      }
      progressFill.style.width = `${progress}%`;
      percentText.textContent = `${progress}%`;
    }, 60);

    // Print Terminal Logs
    function printNextLog() {
      if (logIndex < bootLogs.length) {
        const item = bootLogs[logIndex];
        setTimeout(() => {
          const logLine = document.createElement('div');
          logLine.className = 'terminal-log-line';
          logLine.style.marginBottom = '6px';
          logLine.style.opacity = '0';
          logLine.style.transform = 'translateY(5px)';
          logLine.style.transition = 'all 0.3s ease';
          logLine.innerHTML = `<span style="color: var(--accent-cyan)">[sys]</span> ${item.text}`;
          terminalLogs.appendChild(logLine);
          
          logLine.offsetHeight;
          logLine.style.opacity = '1';
          logLine.style.transform = 'translateY(0)';
          
          terminalLogs.scrollTop = terminalLogs.scrollHeight;
          logIndex++;
          printNextLog();
        }, item.delay);
      } else {
        // Complete Sequence
        setTimeout(terminateLoader, 800);
      }
    }

    printNextLog();
  }

  function terminateLoader() {
    isSystemBooted = true;
    
    // Play calm AI assistant intro announcement
    speakText("Welcome to the interactive digital portfolio of Rania R. Exploring innovation through software engineering, artificial intelligence, and futuristic technology systems. Initializing immersive environment.");

    // Fade out loader
    if (typeof gsap !== 'undefined') {
      gsap.to(cinemaLoader, {
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => {
          cinemaLoader.style.display = 'none';
          pageWrapper.classList.add('loaded');
          navDock.classList.add('dock-ready');
          
          // Trigger GSAP entry reveals
          initScrollReveals();
          initNavDockPill();
        }
      });
    } else {
      cinemaLoader.style.opacity = 0;
      setTimeout(() => {
        cinemaLoader.style.display = 'none';
        pageWrapper.classList.add('loaded');
        navDock.classList.add('dock-ready');
        initNavDockPill();
      }, 800);
    }
  }


  /* -------------------------------------------------------------
     INTERACTIVE BACKGROUND CANVAS (NEURAL NETWORK)
  ------------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let mouse = { x: null, y: null, radius: 150 };
  let ripples = [];

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Dynamically create a purple/cyan ripple ring on mousedown
  function createClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Dissolving trail particle class
  class TrailParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.radius = Math.random() * 2.5 + 1.2;
      this.opacity = 1;
      this.decay = Math.random() * 0.025 + 0.015;
      this.isCyan = Math.random() > 0.5;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.isCyan ? `rgba(0, 229, 255, ${this.opacity})` : `rgba(168, 85, 247, ${this.opacity})`;
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.opacity -= this.decay;
      if (this.radius > 0.1) this.radius -= 0.04;
    }
  }

  // Nebular Light Orbs for spatial depth
  class GlowOrb {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.15;
      this.vy = (Math.random() - 0.5) * 0.15;
      this.radius = Math.random() * 100 + 50;
      this.opacity = Math.random() * 0.06 + 0.02;
      this.color = Math.random() > 0.5 ? '123, 47, 247' : '0, 229, 255'; // Purple or Cyan
    }

    draw() {
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      gradient.addColorStop(0, `rgba(${this.color}, ${this.opacity})`);
      gradient.addColorStop(0.5, `rgba(${this.color}, ${this.opacity * 0.4})`);
      gradient.addColorStop(1, `rgba(${this.color}, 0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < -this.radius) this.x = width + this.radius;
      if (this.x > width + this.radius) this.x = -this.radius;
      if (this.y < -this.radius) this.y = height + this.radius;
      if (this.y > height + this.radius) this.y = -this.radius;
    }
  }

  // Shooting Cosmic Energy Streaks
  class EnergyStreak {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * (height * 0.4);
      this.length = Math.random() * 100 + 50;
      this.speed = Math.random() * 6 + 4;
      this.angle = Math.PI / 6 + Math.random() * (Math.PI / 12);
      this.opacity = 1;
      this.decay = Math.random() * 0.02 + 0.01;
      this.active = false;
      this.spawnDelay = Math.random() * 600 + 100;
    }

    update() {
      if (!this.active) {
        if (this.spawnDelay > 0) {
          this.spawnDelay--;
        } else {
          this.active = true;
        }
        return;
      }

      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity -= this.decay;

      if (this.opacity <= 0 || this.x > width || this.y > height) {
        this.reset();
      }
    }

    draw() {
      if (!this.active) return;
      ctx.beginPath();
      const endX = this.x - Math.cos(this.angle) * this.length;
      const endY = this.y - Math.sin(this.angle) * this.length;
      const grad = ctx.createLinearGradient(this.x, this.y, endX, endY);
      grad.addColorStop(0, `rgba(0, 229, 255, ${this.opacity * 0.85})`);
      grad.addColorStop(0.5, `rgba(168, 85, 247, ${this.opacity * 0.4})`);
      grad.addColorStop(1, 'rgba(123, 47, 247, 0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Generate cursor trails once startup loader is dismissed
    if (isSystemBooted) {
      for (let i = 0; i < 2; i++) {
        particles.push(new TrailParticle(e.clientX, e.clientY));
      }
    }
  });

  window.addEventListener('click', (e) => {
    if (isSystemBooted) {
      // Spawn mathematical physics shockwave
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 180,
        opacity: 0.8,
        speed: 4.5
      });
      
      // Spawn custom DOM visual ripples
      createClickRipple(e.clientX, e.clientY);
    }
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.baseRadius = Math.random() * 1.8 + 0.8;
      this.radius = this.baseRadius;
      this.opacity = Math.random() * 0.55 + 0.25;
      const r = Math.random();
      // 0 = Cyan, 1 = Purple, 2 = Violet, 3 = Neon Magenta, 4 = Soft Blue
      this.colorType = r > 0.8 ? 0 : (r > 0.6 ? 1 : (r > 0.4 ? 2 : (r > 0.2 ? 3 : 4)));
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      const isLight = document.documentElement.classList.contains('light-theme');
      if (this.colorType === 0) {
        ctx.fillStyle = isLight ? `rgba(8, 145, 178, ${this.opacity})` : `rgba(0, 229, 255, ${this.opacity})`;
      } else if (this.colorType === 1) {
        ctx.fillStyle = isLight ? `rgba(109, 40, 217, ${this.opacity})` : `rgba(123, 47, 247, ${this.opacity})`;
      } else if (this.colorType === 2) {
        ctx.fillStyle = isLight ? `rgba(147, 51, 234, ${this.opacity})` : `rgba(168, 85, 247, ${this.opacity})`;
      } else if (this.colorType === 3) {
        ctx.fillStyle = isLight ? `rgba(192, 38, 211, ${this.opacity})` : `rgba(217, 70, 239, ${this.opacity})`;
      } else {
        ctx.fillStyle = isLight ? `rgba(3, 105, 161, ${this.opacity})` : `rgba(14, 165, 233, ${this.opacity})`;
      }
      ctx.fill();
    }

    update() {
      // Basic movement
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Mouse interactive push/pull force
      if (mouse.x !== null && mouse.y !== null) {
        let dx = this.x - mouse.x;
        let dy = this.y - mouse.y;
        let dist = Math.hypot(dx, dy);
        
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          let angle = Math.atan2(dy, dx);
          
          // Repel force
          this.x += Math.cos(angle) * force * 1.5;
          this.y += Math.sin(angle) * force * 1.5;
          
          // Scale size slightly on mouse proximity
          this.radius = this.baseRadius + force * 1.2;
        } else {
          if (this.radius > this.baseRadius) {
            this.radius -= 0.05;
          }
        }
      }
    }
  }

  const particleCount = Math.min(Math.floor((width * height) / 13000), 100);
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Nebula Orbs
  const orbs = [];
  const orbCount = 5;
  for (let i = 0; i < orbCount; i++) {
    orbs.push(new GlowOrb());
  }

  // Shooting Energy Streaks
  const streaks = [];
  const streakCount = 3;
  for (let i = 0; i < streakCount; i++) {
    streaks.push(new EnergyStreak());
  }

  function connectParticles() {
    let maxDistance = 140;
    for (let i = 0; i < particles.length; i++) {
      if (particles[i] instanceof TrailParticle) continue;
      
      for (let j = i + 1; j < particles.length; j++) {
        if (particles[j] instanceof TrailParticle) continue;

        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.hypot(dx, dy);

        if (dist < maxDistance) {
          let alpha = (maxDistance - dist) / maxDistance * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          
          // Constellation styling based on node color type
          const isLightThemeActive = document.documentElement.classList.contains('light-theme');
          if (particles[i].colorType === 0 || particles[j].colorType === 0) {
            ctx.strokeStyle = isLightThemeActive ? `rgba(8, 145, 178, ${alpha * 0.9})` : `rgba(0, 229, 255, ${alpha * 0.7})`;
          } else if (particles[i].colorType === 3 || particles[j].colorType === 3) {
            ctx.strokeStyle = isLightThemeActive ? `rgba(192, 38, 211, ${alpha * 0.8})` : `rgba(217, 70, 239, ${alpha * 0.6})`;
          } else {
            ctx.strokeStyle = isLightThemeActive ? `rgba(109, 40, 217, ${alpha * 0.75})` : `rgba(168, 85, 247, ${alpha * 0.5})`;
          }
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);
    
    // Update and draw Nebula Orbs
    orbs.forEach(orb => {
      orb.update();
      orb.draw();
    });

    // Update and draw Shooting Streaks
    streaks.forEach(streak => {
      streak.update();
      streak.draw();
    });
    
    // Slight grid parallax overlay
    const isLightGrid = document.documentElement.classList.contains('light-theme');
    ctx.strokeStyle = isLightGrid ? 'rgba(0,0,0,0.015)' : 'rgba(255,255,255,0.005)';
    ctx.lineWidth = 1;
    let gridSize = 60;
    
    // Dynamic offsets based on scroll position
    let scrollOffset = window.scrollY * 0.1;
    
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = (scrollOffset % gridSize); y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Update and draw mathematical click shockwave ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += r.speed;
      r.opacity -= 0.02;
      
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = isLightGrid ? `rgba(8, 145, 178, ${r.opacity})` : `rgba(139, 231, 255, ${r.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Repel force pushing particles out as the ripple expands
      particles.forEach(p => {
        let dx = p.x - r.x;
        let dy = p.y - r.y;
        let dist = Math.hypot(dx, dy);
        if (Math.abs(dist - r.radius) < 25) {
          let angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * 6;
          p.y += Math.sin(angle) * 6;
        }
      });

      if (r.opacity <= 0 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
      }
    }

    // Render, update, and clean up faded particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      
      // Remove dead trails
      if (p instanceof TrailParticle && p.opacity <= 0) {
        particles.splice(i, 1);
      }
    }
    
    connectParticles();
    requestAnimationFrame(animateCanvas);
  }

  animateCanvas();


  /* -------------------------------------------------------------
     CUSTOM MOUSE CURSOR GLOW
  ------------------------------------------------------------- */
  const curPoint = document.getElementById('custom-cursor');
  const curRing = document.getElementById('custom-cursor-glow');

  let curX = 0, curY = 0; // Target coordinates
  let ringX = 0, ringY = 0; // Smooth ring coordinates

  window.addEventListener('mousemove', (e) => {
    curX = e.clientX;
    curY = e.clientY;
    curPoint.style.left = `${curX}px`;
    curPoint.style.top = `${curY}px`;
  });

  // Lerp factor for smooth ring tracking
  const lerp = (start, end, factor) => start + (end - start) * factor;

  function updateRingPosition() {
    ringX = lerp(ringX, curX, 0.15);
    ringY = lerp(ringY, curY, 0.15);
    curRing.style.left = `${ringX}px`;
    curRing.style.top = `${ringY}px`;
    requestAnimationFrame(updateRingPosition);
  }
  updateRingPosition();

  // Handle hover visual tags
  const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-group-card, .social-icon, .nav-link, .modal-close, .github-cell');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });

  // Handle active clicking visual morph
  window.addEventListener('mousedown', () => document.body.classList.add('clicking'));
  window.addEventListener('mouseup', () => document.body.classList.remove('clicking'));


  /* -------------------------------------------------------------
     TYPEWRITER IDENTITIES EFFECT
  ------------------------------------------------------------- */
  const typewriterText = document.getElementById('typewriter');
  const identities = [
    'Engineering intelligent digital experiences',
    'Designing modern technology systems',
    'Creating immersive digital solutions',
    'Building scalable future-focused applications',
    'Exploring AI-powered innovation',
    'Crafting intelligent interactive experiences'
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 60;

  function typeCycle() {
    const currentWord = identities[wordIndex];
    if (isDeleting) {
      // Remove characters
      typewriterText.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 30; // Faster delete speed
    } else {
      // Add characters
      typewriterText.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 80; // Normal typing speed
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // Finished typing word, wait before deleting
      typingSpeed = 2500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, load next word
      isDeleting = false;
      wordIndex = (wordIndex + 1) % identities.length;
      typingSpeed = 500;
    }

    setTimeout(typeCycle, typingSpeed);
  }

  setTimeout(typeCycle, 1500); // Trigger after system load


  /* -------------------------------------------------------------
     MAGNETIC ELEMENTS PHYSICS
  ------------------------------------------------------------- */
  const magneticItems = document.querySelectorAll('.magnetic');
  magneticItems.forEach(item => {
    item.addEventListener('mousemove', function(e) {
      const bounds = this.getBoundingClientRect();
      // Calculate mouse displacement relative to center
      const x = e.clientX - bounds.left - (bounds.width / 2);
      const y = e.clientY - bounds.top - (bounds.height / 2);
      
      // Pull element toward coordinates
      if (typeof gsap !== 'undefined') {
        gsap.to(this, {
          x: x * 0.35,
          y: y * 0.35,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });

    item.addEventListener('mouseleave', function() {
      // Reset position
      if (typeof gsap !== 'undefined') {
        gsap.to(this, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.4)'
        });
      }
    });
  });

  // Subtle magnetic movement for visual portrait panels
  const magneticLights = document.querySelectorAll('.magnetic-light');
  magneticLights.forEach(item => {
    const speed = parseFloat(item.getAttribute('data-speed')) || 0.05;
    window.addEventListener('mousemove', (e) => {
      const dx = e.clientX - (window.innerWidth / 2);
      const dy = e.clientY - (window.innerHeight / 2);
      if (typeof gsap !== 'undefined') {
        gsap.to(item, {
          x: dx * speed * 0.5,
          y: dy * speed * 0.5,
          duration: 0.5,
          ease: 'power1.out'
        });
      }
    });
  });


  /* -------------------------------------------------------------
     ADVANCED 3D PORTRAIT TILT EFFECT
  ------------------------------------------------------------- */
  const portrait3d = document.getElementById('portrait-3d-container');
  const card = portrait3d.querySelector('.portrait-card');
  const glow = portrait3d.querySelector('.portrait-glow');

  portrait3d.addEventListener('mousemove', (e) => {
    const rect = portrait3d.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate inside container
    const y = e.clientY - rect.top;  // y coordinate inside container
    
    // Tilt calculations (-15deg to +15deg)
    const rotateX = ((y / rect.height) - 0.5) * -20;
    const rotateY = ((x / rect.width) - 0.5) * 20;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    
    // Parallax glow effect backing
    glow.style.transform = `translate3d(${(x - rect.width/2) * 0.15}px, ${(y - rect.height/2) * 0.15}px, 0px)`;
  });

  portrait3d.addEventListener('mouseleave', () => {
    // Reset alignment
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    glow.style.transform = 'translate3d(0, 0, 0)';
    card.style.transition = 'transform 0.5s ease';
    glow.style.transition = 'transform 0.5s ease';
  });

  portrait3d.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
    glow.style.transition = 'none';
  });


  /* -------------------------------------------------------------
     SPOTLIGHT CARD SHINE EFFECT (SKILLS)
  ------------------------------------------------------------- */
  const spotlightCards = document.querySelectorAll('.skill-group-card');
  spotlightCards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.style.setProperty('--mouse-x', `${x}px`);
      this.style.setProperty('--mouse-y', `${y}px`);
    });
  });


  /* -------------------------------------------------------------
     FLOATING NAV DOCK METRIC POSITIONING & SCROLL SPY
  ------------------------------------------------------------- */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const activePill = document.querySelector('.nav-dock-pill');

  function initNavDockPill() {
    updateActiveIndicator();
  }

  function updateActiveIndicator() {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink && activePill) {
      const activeRect = activeLink.getBoundingClientRect();
      const parentRect = activeLink.parentElement.getBoundingClientRect();
      
      activePill.style.left = `${activeRect.left - parentRect.left}px`;
      activePill.style.width = `${activeRect.width}px`;
    }
  }

  // Section Observer Scrollspy
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px', // Trigger near screen mid-third
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('data-target') === id) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            updateActiveIndicator();
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Recalculate indicator position on resize
  window.addEventListener('resize', updateActiveIndicator);


  /* -------------------------------------------------------------
     MISSION STATS COUNTER ACTION
  ------------------------------------------------------------- */
  const counterCards = document.querySelectorAll('.metric-card');
  let countersAnimated = false;

  function startCounters() {
    counterCards.forEach(card => {
      const numElement = card.querySelector('.metric-number');
      const target = parseInt(card.getAttribute('data-target-num'));
      const duration = 2000; // Animation duration in ms
      const startTime = performance.now();
      
      const isHours = target === 1000;
      const isContributions = target === 50;

      function updateNumber(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing out quadratic
        const easeProgress = progress * (2 - progress);
        const currentVal = Math.floor(easeProgress * target);

        if (isHours) {
          numElement.textContent = `${currentVal}+`;
        } else if (isContributions) {
          numElement.textContent = `${currentVal}+`;
        } else {
          numElement.textContent = currentVal;
        }

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          if (isHours) {
            numElement.textContent = '1000+';
          } else if (isContributions) {
            numElement.textContent = '50+';
          } else {
            numElement.textContent = target;
          }
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  // Observe statistics section trigger
  const metricsSection = document.getElementById('mission');
  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        startCounters();
      }
    });
  }, { threshold: 0.15 });

  metricsObserver.observe(metricsSection);


  /* -------------------------------------------------------------
     PROJECT SHOWCASE CONTENT GENERATOR & EXPANSION
  ------------------------------------------------------------- */
  const projectData = {
    'cipher-fortress': {
      title: 'Cipher Fortress',
      category: 'Cybersecurity & Intelligent Monitoring Application',
      desc: 'Developed a cybersecurity monitoring application designed to detect suspicious activities and improve intelligent endpoint monitoring using Python and AI-assisted workflows.',
      tags: ['Python', 'Secure Shell', 'Threat Intelligence', 'AI-assisted Workflows'],
      features: [
        { title: 'Intelligent Threat Detection', desc: 'Identifies anomalous behaviors and tracking indicators.' },
        { title: 'Process Monitoring', desc: 'Observes system resources and network connections in real-time.' },
        { title: 'AI-assisted Workflows', desc: 'Accelerates threat analysis and vulnerability isolation.' },
        { title: 'Secure Monitoring Systems', desc: 'Protects monitoring logs using AES-256 local database layers.' }
      ],
      nodes: ['Source API', 'Threat Detector', 'Secure DB', 'Interface Console'],
      github: 'https://github.com/ranx-kernel/cipher-fortress'
    },
    'mediq': {
      title: 'MediQ',
      category: 'Healthcare Management Application',
      desc: 'Built a healthcare management application focused on efficient database handling, optimized workflows, and structured application performance.',
      tags: ['SQL', 'Java', 'Database Systems', 'Performance Optimization'],
      features: [
        { title: 'Database Integration', desc: 'Constructs complex querying logic and secure index mapping.' },
        { title: 'User Interaction Systems', desc: 'Engineers intuitive clinical workflows for patients and practitioners.' },
        { title: 'Structured Data Handling', desc: 'Manages structured records avoiding query latency bottlenecks.' },
        { title: 'Performance Optimization', desc: 'Optimizes query processing, reducing average load times by 40%.' }
      ],
      nodes: ['User Gateway', 'Flow Router', 'Optimized Queries', 'Clinical Records'],
      github: 'https://github.com/ranx-kernel/mediq'
    },
    'sentinelx': {
      title: 'SentinelX',
      category: 'PPE Detection & Safety Monitoring System',
      desc: 'Developed a real-time PPE detection system using computer vision techniques for workplace safety monitoring and intelligent compliance tracking.',
      tags: ['Computer Vision', 'Python', 'Real-time Video', 'Neural Networks'],
      features: [
        { title: 'Helmet Detection', desc: 'Identifies workplace compliance for protective hard hats.' },
        { title: 'Mask Detection', desc: 'Verifies safety mask guidelines dynamically in stream.' },
        { title: 'Real-time Monitoring', desc: 'Operates at 30 FPS stream processing with edge alerts.' },
        { title: 'AI-powered Vision System', desc: 'Runs on optimized neural weights for edge deployment.' }
      ],
      nodes: ['Video Stream', 'Frame Pipeline', 'Neural Weights', 'Compliance HUD'],
      github: 'https://github.com/ranx-kernel/sentinelx'
    },
    'morphed-detector': {
      title: 'ML-Morphed Photo Detector',
      category: 'Machine Learning & Image Analysis',
      desc: 'Developed a machine learning model to detect manipulated and morphed images using advanced image analysis techniques and pattern recognition algorithms.',
      tags: ['Machine Learning', 'Image Processing', 'Python', 'Pattern Recognition'],
      features: [
        { title: 'Image Morphing Detection', desc: 'Identifies subtle manipulations and face morphing attacks.' },
        { title: 'Pattern Analysis', desc: 'Analyzes pixel-level artifacts and feature inconsistencies.' },
        { title: 'Accuracy Validation', desc: 'Achieves high precision detection rates through deep learning models.' },
        { title: 'Batch Processing', desc: 'Processes large image datasets efficiently for verification systems.' }
      ],
      nodes: ['Input Images', 'Feature Extraction', 'ML Model', 'Detection Output'],
      github: '#'
    },
    'defendx': {
      title: 'DefendX',
      category: 'Cybersecurity & Defense',
      desc: 'Cybersecurity project aimed at identifying vulnerabilities and improving system defense mechanisms through advanced threat analysis and mitigation strategies.',
      tags: ['Cybersecurity', 'Vulnerability Assessment', 'Security Systems'],
      features: [
        { title: 'Vulnerability Scanning', desc: 'Identifies potential security weaknesses in system architecture.' },
        { title: 'Threat Analysis', desc: 'Analyzes attack vectors and potential exploitation methods.' },
        { title: 'Defense Mechanisms', desc: 'Recommends and implements security hardening strategies.' },
        { title: 'Security Monitoring', desc: 'Monitors system health and alert on suspicious activities.' }
      ],
      nodes: ['Vulnerability Scanner', 'Threat Analyzer', 'Defense System', 'Alert Hub'],
      github: '#'
    },
    'ml-projects': {
      title: 'ML Projects',
      category: 'Machine Learning & Prediction',
      desc: 'Worked on multiple machine learning models involving prediction systems and data analysis for intelligent decision-making across various domains.',
      tags: ['Machine Learning', 'Predictions', 'Data Analysis', 'Algorithms'],
      features: [
        { title: 'Prediction Models', desc: 'Builds ensemble models for accurate forecasting and predictions.' },
        { title: 'Data Analysis', desc: 'Performs statistical analysis and feature engineering on datasets.' },
        { title: 'Model Training', desc: 'Implements algorithms for supervised and unsupervised learning.' },
        { title: 'Performance Optimization', desc: 'Tunes hyperparameters to maximize model accuracy and efficiency.' }
      ],
      nodes: ['Dataset Input', 'Data Pipeline', 'ML Engine', 'Predictions Output'],
      github: '#'
    },
    'database-projects': {
      title: 'Database Projects',
      category: 'Database & Data Management',
      desc: 'Designed and managed structured database systems for efficient data storage, retrieval, and optimization across multiple applications and enterprise systems.',
      tags: ['SQL', 'Database Design', 'Data Management', 'Performance'],
      features: [
        { title: 'Schema Design', desc: 'Creates optimized database schemas for complex data relationships.' },
        { title: 'Query Optimization', desc: 'Implements efficient queries reducing latency and resource consumption.' },
        { title: 'Data Integrity', desc: 'Ensures data consistency through constraints and transaction management.' },
        { title: 'Scalability Planning', desc: 'Designs systems that scale efficiently with growing data volumes.' }
      ],
      nodes: ['Database Layer', 'Query Handler', 'Data Storage', 'Access Interface'],
      github: '#'
    }
  };

  const projectModal = document.getElementById('project-modal');
  const modalContentArea = document.getElementById('modal-content-area');
  const closeModalBtn = document.getElementById('btn-close-modal');

  // Attach click listener to project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const pKey = card.getAttribute('data-project');
      const data = projectData[pKey];
      if (data) {
        openProjectModal(data);
      }
    });
  });

  function openProjectModal(data) {
    // Generate inner Modal layout
    const tagsHTML = data.tags.map(t => `<span>${t}</span>`).join('');
    const featuresHTML = data.features.map(f => `
      <div class="feature-item-box">
        <div class="feature-icon-wrapper">
          <i data-lucide="check-circle-2"></i>
        </div>
        <div class="feature-details">
          <div class="feature-detail-label">${f.title}</div>
          <div class="feature-detail-desc">${f.desc}</div>
        </div>
      </div>
    `).join('');

    const nodesHTML = data.nodes.map((node, i) => `
      <div class="arch-node">
        <div class="arch-node-icon">
          <i data-lucide="${getIconForNodeIndex(i)}"></i>
        </div>
        <span class="arch-node-label">${node}</span>
      </div>
    `).join('');

    modalContentArea.innerHTML = `
      <div class="modal-detail-grid">
        <div class="modal-title-area">
          <span class="modal-cat">${data.category}</span>
          <h2 class="modal-title">${data.title}</h2>
        </div>
        
        <div class="modal-desc-area">
          <p>${data.desc}</p>
        </div>

        <div>
          <h3 class="modal-section-title">
            <i data-lucide="cpu"></i>
            <span>System Features</span>
          </h3>
          <div class="modal-features-list">
            ${featuresHTML}
          </div>
        </div>

        <div>
          <h3 class="modal-section-title">
            <i data-lucide="network"></i>
            <span>System Architecture Flow</span>
          </h3>
          <div class="modal-arch-box">
            <div class="arch-flow-nodes">
              ${nodesHTML}
              <div class="arch-flow-connector">
                <div class="arch-flow-progress" id="modal-arch-bar"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <a href="${data.github}" target="_blank" class="btn btn-primary magnetic">
            <span>View Repository</span>
            <i data-lucide="github"></i>
          </a>
          <button class="btn btn-secondary magnetic" id="btn-modal-close-action">
            <span>Close Analysis</span>
          </button>
        </div>
      </div>
    `;

    // Reinitialize Lucide Icons inside modal
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Bind Close Button in Action Area
    document.getElementById('btn-modal-close-action').addEventListener('click', closeProjectModal);

    // Reveal modal
    projectModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock scrolling
    
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(projectModal.querySelector('.modal-wrapper'), 
        { scale: 0.9, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
      );
      
      // Animate Architecture Bar Flow
      gsap.to('#modal-arch-bar', {
        width: '100%',
        duration: 1.5,
        delay: 0.3,
        ease: 'power2.inOut'
      });
    }

    // Attach magnetic to modal actions
    const modalMagnets = modalContentArea.querySelectorAll('.magnetic');
    modalMagnets.forEach(m => {
      m.addEventListener('mousemove', function(e) {
        const bounds = this.getBoundingClientRect();
        const x = e.clientX - bounds.left - (bounds.width / 2);
        const y = e.clientY - bounds.top - (bounds.height / 2);
        gsap.to(this, { x: x * 0.35, y: y * 0.35, duration: 0.3 });
      });
      m.addEventListener('mouseleave', function() {
        gsap.to(this, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out' });
      });
    });
  }

  function getIconForNodeIndex(i) {
    const icons = ['database', 'terminal', 'cpu', 'monitor'];
    return icons[i] || 'box';
  }

  function closeProjectModal() {
    if (typeof gsap !== 'undefined') {
      gsap.to(projectModal.querySelector('.modal-wrapper'), {
        scale: 0.9,
        opacity: 0,
        y: 30,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => {
          projectModal.style.display = 'none';
          document.body.style.overflow = ''; // Unlock scrolling
        }
      });
    } else {
      projectModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  closeModalBtn.addEventListener('click', closeProjectModal);
  projectModal.querySelector('.modal-backdrop').addEventListener('click', closeProjectModal);


  /* -------------------------------------------------------------
     GITHUB ENGINE SIMULATOR (TIMELINE EXTRA)
  ------------------------------------------------------------- */
  const gitGrid = document.getElementById('github-sim');
  if (gitGrid) {
    // Generate 84 grids representing commit patterns
    for (let i = 0; i < 84; i++) {
      const cell = document.createElement('div');
      
      // Weight probability toward middle levels to make it look realistic
      let level = 0;
      const prob = Math.random();
      
      if (prob > 0.9) level = 4;
      else if (prob > 0.75) level = 3;
      else if (prob > 0.5) level = 2;
      else if (prob > 0.25) level = 1;
      
      cell.className = `github-cell lvl-${level}`;
      
      // Delay animation for startup reveal
      cell.style.animation = `pulse-glow 2s infinite alternate`;
      cell.style.animationDelay = `${Math.random() * 2}s`;
      
      // Mouse interaction hover states
      cell.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      cell.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));

      gitGrid.appendChild(cell);
    }
  }


  /* -------------------------------------------------------------
     FUTURE ROADMAP PROGRESS ENGINE
  ------------------------------------------------------------- */
  const visionSection = document.getElementById('vision');
  const progressLine = document.querySelector('.roadmap-progress');
  const steps = document.querySelectorAll('.roadmap-step');

  function updateRoadmapProgress() {
    if (!visionSection) return;
    
    const rect = visionSection.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.7;
    const progressStart = rect.top;
    const progressEnd = rect.bottom - window.innerHeight * 0.4;
    const totalDist = progressEnd - progressStart;
    
    let percent = 0;
    
    if (rect.top < triggerPoint) {
      const currentPos = triggerPoint - rect.top;
      percent = Math.min((currentPos / totalDist) * 100, 100);
      percent = Math.max(percent, 0);
    }

    if (progressLine) {
      progressLine.style.width = `${percent}%`;
    }

    // Activate steps points
    steps.forEach((step, idx) => {
      // Each step triggers sequentially (0%, 25%, 50%, 75% scroll marks)
      const activationMark = idx * 28; // slightly scaled down to trigger earlier
      if (percent >= activationMark) {
        step.classList.add('active-step');
      } else {
        step.classList.remove('active-step');
      }
    });
  }

  window.addEventListener('scroll', updateRoadmapProgress);


  /* -------------------------------------------------------------
     CONTACT FORM TERMINAL LOGGER SIMULATOR
  ------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('btn-submit-form');
  const consoleOverlay = document.getElementById('form-console');
  const consoleLogsList = document.getElementById('console-logs-list');

  if (contactForm) {
    submitBtn.addEventListener('click', (e) => {
      // Validate HTML5 validation checks
      if (contactForm.checkValidity()) {
        e.preventDefault();
        runSubmitSimulation();
      } else {
        contactForm.reportValidity();
      }
    });
  }

  function runSubmitSimulation() {
    // Collect variables
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const msg = document.getElementById('form-message').value;
    const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
    const accessKey = accessKeyInput ? accessKeyInput.value : "YOUR_ACCESS_KEY_HERE";

    // Transition panels
    contactForm.style.opacity = '0';
    setTimeout(() => {
      contactForm.style.display = 'none';
      consoleOverlay.style.display = 'block';
      printConsoleLogs();
    }, 500);

    // Start Web3Forms API Post
    const formData = {
      access_key: accessKey,
      name: name,
      email: email,
      message: msg
    };

    let web3Result = null;
    let requestCompleted = false;

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      web3Result = data;
      requestCompleted = true;
    })
    .catch(err => {
      web3Result = { success: false, message: err.message };
      requestCompleted = true;
    });

    const simulationLogs = [
      { text: 'ESTABLISHING HANDSHAKE PROTOCOLS...', speed: 300 },
      { text: `IP ROUTING STACK RESOLVED: 192.168.1.98`, speed: 200 },
      { text: `IDENTITY HEADER PARSED: ${name.toUpperCase()} (SECURE_VERIFY: OK)`, speed: 400 },
      { text: `ESTABLISHING COM_PORT CONNECTION TO SMTP_RELAY: rania63800@gmail.com...`, speed: 500 },
      { text: `ENCRYPTING PAYLOAD SEGMENTS WITH RSA-2048 SYSTEM INTEGRITY...`, speed: 400 },
      { text: `TRANSMITTING PAYLOAD DATA TO WEB3FORMS GATEWAY...`, speed: 500 },
      { text: `AWAITING RESPONSE NODE FROM SERVER...`, speed: 300 }
    ];

    function printConsoleLogs() {
      let index = 0;
      
      function printNextLine() {
        if (index < simulationLogs.length) {
          const item = simulationLogs[index];
          setTimeout(() => {
            const line = document.createElement('div');
            line.className = `console-log-line ${item.colorClass || ''}`;
            line.innerHTML = `<span style="color: var(--text-muted)">[SMTP]</span> ${item.text}`;
            consoleLogsList.appendChild(line);
            
            consoleOverlay.scrollTop = consoleOverlay.scrollHeight;
            index++;
            printNextLine();
          }, item.speed);
        } else {
          // Wait for the actual Web3Forms API response
          waitForAPI();
        }
      }

      function waitForAPI() {
        if (requestCompleted) {
          const line = document.createElement('div');
          const statusLine = document.createElement('div');
          
          if (web3Result && web3Result.success) {
            line.className = 'console-log-line green';
            line.innerHTML = `<span style="color: var(--text-muted)">[SMTP]</span> WEB3FORMS API RESPONSE: 200 SUCCESS. Mail dispatched!`;
            statusLine.className = 'console-log-line yellow';
            statusLine.innerHTML = `<span style="color: var(--text-muted)">[SMTP]</span> PROTOCOL CLOSED. THANK YOU, ${name.toUpperCase()}.`;
          } else {
            line.className = 'console-log-line red';
            const errMsg = web3Result ? (web3Result.message || "Invalid Access Key") : "Network Error";
            line.innerHTML = `<span style="color: var(--text-muted)">[SMTP]</span> WEB3FORMS API ERROR: ${errMsg}`;
            statusLine.className = 'console-log-line red';
            statusLine.innerHTML = `<span style="color: var(--text-muted)">[SMTP]</span> TRANSMISSION ABORTED. PLEASE CHECK YOUR ACCESS_KEY.`;
          }
          
          consoleLogsList.appendChild(line);
          consoleLogsList.appendChild(statusLine);
          consoleOverlay.scrollTop = consoleOverlay.scrollHeight;
        } else {
          setTimeout(waitForAPI, 100);
        }
      }

      printNextLine();
    }
  }


  /* -------------------------------------------------------------
     GSAP & SCROLLTRIGGER CHOREOGRAPHED SHOWCASING
  ------------------------------------------------------------- */
  function initScrollReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      // Fallback: If libraries are blocked, make everything visible immediately
      document.querySelectorAll('.scroll-reveal').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Fade in reveals
    const reveals = document.querySelectorAll('.scroll-reveal');
    reveals.forEach(el => {
      gsap.fromTo(el, 
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Timeline nodes passed trigger
    const timelineNodes = document.querySelectorAll('.timeline-node');
    timelineNodes.forEach((node, index) => {
      ScrollTrigger.create({
        trigger: node,
        start: 'top 75%',
        onEnter: () => {
          node.classList.add('passed');
        },
        onLeaveBack: () => {
          node.classList.remove('passed');
        }
      });
    });

    // Parallax background shifts on sections
    const parallaxSections = document.querySelectorAll('.section');
    parallaxSections.forEach(sec => {
      gsap.to(sec, {
        backgroundPosition: '50% 60%',
        ease: 'none',
        scrollTrigger: {
          trigger: sec,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }
});

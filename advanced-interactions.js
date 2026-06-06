/**
 * ADVANCED CREATIVE INTERACTIONS MODULE
 * Transforms the portfolio into an immersive, cinematic digital experience
 * Adds: magnetic cursor, premium interactions, floating elements, easter eggs
 */

document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.getElementById('custom-cursor');
  const cursorGlow = document.getElementById('custom-cursor-glow');
  
  let mouseX = 0, mouseY = 0;
  let cursorTrailParticles = [];

  /* =========================================================
     PHASE 1: ENHANCED CURSOR WITH MAGNETIC ATTRACTION & TRAILS
     ========================================================= */
  
  let trailHue = 0;
  class CursorTrail {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      this.opacity = 0.8;
      this.size = Math.random() * 3.5 + 1.5;
      this.vx = (Math.random() - 0.5) * 1.8;
      this.vy = (Math.random() - 0.5) * 1.8;
      this.hue = hue;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.opacity -= 0.025;
      this.size *= 0.97;
      this.vx *= 0.96;
      this.vy *= 0.96;
    }

    draw(ctx) {
      if (this.opacity > 0) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
        ctx.fill();
      }
    }
  }

  // Create hidden canvas for cursor trail rendering
  const cursorCanvas = document.createElement('canvas');
  cursorCanvas.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 9998; pointer-events: none; mix-blend-mode: screen;';
  cursorCanvas.width = window.innerWidth;
  cursorCanvas.height = window.innerHeight;
  document.body.appendChild(cursorCanvas);
  const trailCtx = cursorCanvas.getContext('2d');

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Magnetic attraction to interactive elements
    const magneticElements = document.querySelectorAll('.magnetic, .magnetic-light, button, a');
    let closestDist = Infinity;
    let closestEl = null;

    magneticElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const elCenterX = rect.left + rect.width / 2;
      const elCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(mouseX - elCenterX, mouseY - elCenterY);
      
      if (dist < 100 && dist < closestDist) {
        closestDist = dist;
        closestEl = el;
      }
    });

    // Cursor glow color changes based on proximity to elements
    if (closestEl) {
      const intensity = (100 - closestDist) / 100;
      cursorGlow.style.boxShadow = `0 0 ${15 + intensity * 15}px rgba(0, 229, 255, ${0.3 + intensity * 0.5})`;
    } else {
      cursorGlow.style.boxShadow = '0 0 15px rgba(0, 229, 255, 0.3)';
    }

    // Generate cursor trail particles cycling colors
    if (Math.random() > 0.5) {
      cursorTrailParticles.push(new CursorTrail(mouseX, mouseY, trailHue));
      trailHue = (trailHue + 6) % 360;
    }
  });

  // Animate cursor trails
  function animateCursorTrails() {
    const isLight = document.documentElement.classList.contains('light-theme');
    cursorCanvas.style.mixBlendMode = isLight ? 'multiply' : 'screen';
    trailCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);

    for (let i = cursorTrailParticles.length - 1; i >= 0; i--) {
      const particle = cursorTrailParticles[i];
      particle.update();
      particle.draw(trailCtx);

      if (particle.opacity <= 0) {
        cursorTrailParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(animateCursorTrails);
  }
  animateCursorTrails();

  // Window resize handler for cursor canvas
  window.addEventListener('resize', () => {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
  });

  /* =========================================================
     PHASE 2: ENHANCED MAGNETIC BUTTON INTERACTIONS
     ========================================================= */

  const buttons = document.querySelectorAll('.btn, button');
  buttons.forEach(btn => {
    // Create ripple container
    const rippleContainer = document.createElement('div');
    rippleContainer.className = 'btn-ripple-container';
    rippleContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      overflow: hidden;
      pointer-events: none;
    `;
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';
    btn.insertBefore(rippleContainer, btn.firstChild);

    // Ripple on click
    btn.addEventListener('click', (e) => {
      const ripple = document.createElement('span');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        animation: btn-ripple 0.6s ease-out;
      `;
      rippleContainer.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });

    // Glow effect on hover
    btn.addEventListener('mouseenter', () => {
      btn.style.setProperty('--btn-glow-intensity', '1');
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('--btn-glow-intensity', '0');
    });
  });

  /* =========================================================
     PHASE 3: INTERACTIVE HERO ENVIRONMENT - CURSOR REACTIVE
     ========================================================= */

  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    const heroContent = document.querySelector('.hero-content');
    
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      // Subtle parallax movement on hero content
      if (typeof gsap !== 'undefined') {
        gsap.to(heroContent, {
          x: (x - 0.5) * 15,
          y: (y - 0.5) * 15,
          duration: 0.5,
          ease: 'power1.out',
          overwrite: 'auto'
        });
      }

      // Dynamic background glow position
      const glows = document.querySelectorAll('.glow-1, .glow-2, .glow-3');
      glows.forEach((glow, idx) => {
        const intensity = idx === 0 ? 0.3 : (idx === 1 ? 0.2 : 0.15);
        glow.style.transform = `translate(${(x - 0.5) * 20 * intensity}%, ${(y - 0.5) * 20 * intensity}%)`;
      });
    });
  }

  /* =========================================================
     PHASE 4: PORTRAIT HOLOGRAPHIC GLOW & SCANNING EFFECTS
     ========================================================= */

  const portraitContainer = document.getElementById('portrait-3d-container');
  if (portraitContainer) {
    const portraitCard = portraitContainer.querySelector('.portrait-card');
    const scanlines = portraitContainer.querySelector('.scanlines');

    // Add animated scanning effect on hover
    portraitContainer.addEventListener('mouseenter', () => {
      if (scanlines) {
        scanlines.style.animation = 'scan-lines 0.8s ease-in-out infinite';
      }
    });

    portraitContainer.addEventListener('mouseleave', () => {
      if (scanlines) {
        scanlines.style.animation = 'none';
      }
    });

    // Holographic glow intensity based on mouse proximity
    portraitContainer.addEventListener('mousemove', (e) => {
      const rect = portraitContainer.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dist = Math.hypot(x - rect.width / 2, y - rect.height / 2);
      const intensity = Math.max(0, 1 - dist / (rect.width / 2));

      portraitCard.style.setProperty('--glow-intensity', intensity);
      
      // Pulsing rings animation intensification
      const rings = portraitContainer.querySelectorAll('.neon-ring');
      rings.forEach(ring => {
        ring.style.animationPlayState = intensity > 0.5 ? 'running' : 'paused';
      });
    });
  }

  /* =========================================================
     PHASE 5: PROJECT CARD 3D TILT & IMMERSIVE EFFECTS
     ========================================================= */

  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate 3D tilt
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      card.style.boxShadow = `0 20px 50px rgba(0, 229, 255, 0.25)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
      card.style.boxShadow = 'inherit';
    });
  });

  /* =========================================================
     PHASE 6: FLOATING INTERFACE ELEMENTS & PARALLAX
     ========================================================= */

  const hudPanels = document.querySelectorAll('.hud-panel');
  window.addEventListener('scroll', () => {
    hudPanels.forEach(panel => {
      const speed = parseFloat(panel.getAttribute('data-speed')) || 0.05;
      const offset = window.scrollY * speed;
      panel.style.transform = `translateY(${offset}px)`;
    });
  });

  /* =========================================================
     PHASE 7: GLASSMORPHISM HOVER EFFECTS - LIQUID GLASS
     ========================================================= */

  const glassCards = document.querySelectorAll('.glass-card');
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Light streak effect
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Subtle shadow movement
      const shadowX = (x / rect.width - 0.5) * 10;
      const shadowY = (y / rect.height - 0.5) * 10;
      card.style.boxShadow = `
        ${shadowX}px ${shadowY}px 30px rgba(123, 47, 247, 0.15),
        inset 0 0 30px rgba(0, 229, 255, 0.05)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = 'inherit';
    });
  });

  /* =========================================================
     PHASE 8: SMOOTH SCROLL PARALLAX TRANSITIONS
     ========================================================= */

  let lastScrollY = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const delta = scrollY - lastScrollY;

    // Parallax movement for fixed background
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
      canvas.style.transform = `translateY(${scrollY * 0.3}px)`;
    }

    // Section transition animations
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;

      if (isInView) {
        const progress = 1 - (rect.top / window.innerHeight);
        section.style.opacity = Math.max(0.3, progress);
      }
    });

    lastScrollY = scrollY;
  });

  /* =========================================================
     PHASE 9: LIVE DIGITAL EFFECTS - WAVEFORMS & PULSES
     ========================================================= */

  const waveContainers = document.querySelectorAll('.live-wave');
  waveContainers.forEach(container => {
    const bars = container.querySelectorAll('.wave-bar');
    
    const animateWave = () => {
      bars.forEach((bar, idx) => {
        const delay = idx * 100;
        const height = 5 + Math.random() * 20;
        bar.style.height = `${height}px`;
      });
      requestAnimationFrame(animateWave);
    };

    animateWave();
  });

  /* =========================================================
     PHASE 10: EASTER EGGS & SECRET INTERACTIONS
     ========================================================= */

  let keySequence = '';
  const secretCode = 'rania';

  document.addEventListener('keydown', (e) => {
    keySequence += e.key.toLowerCase();
    if (keySequence.length > secretCode.length) {
      keySequence = keySequence.slice(-secretCode.length);
    }

    if (keySequence === secretCode) {
      activateEasterEgg();
      keySequence = '';
    }
  });

  function activateEasterEgg() {
    // Secret effect: Cursor becomes a glowing star
    cursor.style.borderRadius = '0%';
    cursor.style.width = '15px';
    cursor.style.height = '15px';
    cursor.style.background = 'radial-gradient(circle, #7a00ff, #0055ff)';

    // Add rotating animation
    cursor.style.animation = 'spin 1s linear infinite';

    setTimeout(() => {
      cursor.style.animation = 'none';
      cursor.style.borderRadius = '50%';
      cursor.style.width = '8px';
      cursor.style.height = '8px';
      cursor.style.background = '#ffffff';
    }, 3000);

    // Show hidden message
    showEasterEggMessage('🎯 EASTER EGG ACTIVATED!');
  }

  function showEasterEggMessage(msg) {
    const msgEl = document.createElement('div');
    msgEl.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.9);
      color: #8be7ff;
      padding: 2rem;
      border-radius: 10px;
      font-size: 1.5rem;
      z-index: 99999;
      border: 2px solid #8be7ff;
      font-family: 'Fira Code', monospace;
      animation: fadeInOut 2s ease-in-out;
    `;
    msgEl.textContent = msg;
    document.body.appendChild(msgEl);

    setTimeout(() => msgEl.remove(), 2000);
  }

  // Konami code for secret developer mode
  let konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiSequence[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        activateDeveloperMode();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateDeveloperMode() {
    showEasterEggMessage('🔧 DEVELOPER MODE ACTIVATED!');
    document.body.style.background = 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%238be7ff\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")';
  }

  /* =========================================================
     PHASE 11: SECTION TRANSITION EFFECTS
     ========================================================= */

  const sections = document.querySelectorAll('.section');
  sections.forEach((section, idx) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'section-slide-in 0.6s ease-out forwards';
        }
      });
    }, { threshold: 0.1 });

    observer.observe(section);
  });

  /* =========================================================
     PHASE 12: PREMIUM MICRO-INTERACTIONS
     ========================================================= */

  // Text reveal animations
  document.querySelectorAll('.section-title, .hero-name, h2, h3').forEach(el => {
    const text = el.textContent;
    if (text.length < 50) {
      el.style.position = 'relative';
      el.addEventListener('mouseenter', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(el, {
            textShadow: '0 0 20px rgba(0, 229, 255, 0.8)',
            duration: 0.3
          });
        }
      });
      el.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(el, {
            textShadow: 'none',
            duration: 0.3
          });
        }
      });
    }
  });

  /* =========================================================
     PHASE 13: FLOATING PARTICLES ENHANCED
     ========================================================= */

  // Create floating digital particles across the page
  function createFloatingParticles() {
    const particleCount = window.innerWidth > 1024 ? 8 : 4;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      particle.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: #00E5FF;
        border-radius: 50%;
        opacity: 0.3;
        pointer-events: none;
        z-index: 1;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
      `;
      
      particle.style.animation = `float-particle ${5 + Math.random() * 10}s linear infinite`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      
      document.body.appendChild(particle);
    }
  }

  createFloatingParticles();

  /* =========================================================
     INITIALIZATION COMPLETE
     ========================================================= */

  console.log('✨ Advanced Creative Interactions Module Loaded');
});

// Animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes btn-ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes scan-lines {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(10px);
    }
  }

  @keyframes section-slide-in {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fadeInOut {
    0%, 100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    50% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }

  @keyframes float-particle {
    0% {
      transform: translateY(100vh) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 0.3;
    }
    90% {
      opacity: 0.3;
    }
    100% {
      transform: translateY(-100vh) translateX(100px);
      opacity: 0;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Button Glow Enhancement */
  .btn, button {
    --btn-glow-intensity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .btn:hover, button:hover {
    text-shadow: 0 0 10px rgba(0, 229, 255, var(--btn-glow-intensity));
  }

  /* Glass Card Enhancements */
  .glass-card {
    --mouse-x: 0;
    --mouse-y: 0;
    position: relative;
    transition: all 0.3s ease;
  }

  .glass-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: var(--mouse-x);
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(0, 229, 255, 0.3) 0%, transparent 70%);
    filter: blur(40px);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .glass-card:hover::before {
    opacity: 1;
  }
`;
document.head.appendChild(style);

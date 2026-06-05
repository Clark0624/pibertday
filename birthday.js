/* ============================================================
   HAPPY BIRTHDAY WEBSITE — birthday.js  (enhanced edition)
   ============================================================ */
'use strict';

/* ============================================================
   CONFIG — Edit these to personalise
   ============================================================ */
const CONFIG = {
  /* ── IMPORTANT: Update these dates ── */
  metDate:      new Date(2024, 4, 29),   // When you first met: May 29, 2024
  birthdayDate: new Date(2026, 5, 6),    // Her birthday: June 6, 2026 (update year each year)

  herName: 'My Love',  // REPLACE with her actual name — shown on the ending screen

  /* ── Letter text ── */
  letterText: `Happy Birthday, my love.

Today is all about you — the most beautiful person who ever came into my life and made everything feel lighter, happier, and more meaningful. Before you, I never knew that one person could become my comfort, my peace, my favorite notification, and my safest home all at once. But then you came, and suddenly every ordinary day became something special.

I just want you to know how grateful I am for you. Thank you for staying, for understanding me even when I become difficult, for loving me in ways I never thought I deserved, and for making me feel important every single day. You don't even realize how much your smile fixes everything in me. One message from you can instantly make my whole day complete.

Baby, if I could give you one thing in this world, I would give you the ability to see yourself through my eyes — so you could understand how incredibly precious, beautiful, and lovable you truly are. You are not just my girlfriend; you are my favorite person, my answered prayer, my greatest blessing, and the most beautiful chapter of my life.

I promise to continue loving you in the softest, sweetest, and loudest ways possible. I'll celebrate your wins, comfort you on hard days, annoy you with endless lambing, and remind you every day how deeply loved you are. No matter how busy life gets or how many years pass, I will always choose you. Again and again.

And honestly? Every time I think about the future, ikaw agad ang naiisip ko. The late-night talks, random dates, endless laughter, forehead kisses, holding your hand while crossing the street, and someday building our dreams together. You make love feel so genuine and exciting at the same time.

So today, on your birthday, I hope you feel the same happiness you give to everyone around you — especially to me. I hope your heart feels loved, appreciated, and spoiled because you deserve nothing less.

I love you more than words can explain, more than songs can express, and more than distance or time could ever change.

Happy Birthday again, baby. Thank you for existing and for being mine. 💕✨🌸`,

  /* ── Music playlist ── ── */
  playlist: [
    { title: 'Perfect — Ed Sheeran',    src: 'music/Ed Sheeran - Perfect.mp3' },
    { title: 'Bruno Mars - Just The Way You Are', src: 'music/Bruno Mars - Just The Way You Are (Lyrics).mp3' },
    { title: 'Palagi - TJxKZ',       src: 'music/PALAGI - TJxKZ  LIVE SESSIONS.mp3' },
  ],

  loadDuration: 2800,   // How long the loading screen shows (ms)
  typeSpeed:    14,     // Milliseconds per character (lower = faster)
};


/* ============================================================
   HELPERS
   ============================================================ */
const $       = (sel, ctx = document) => ctx.querySelector(sel);
const $$      = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const rand    = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max));

function showSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('hidden-section');
  el.style.display = '';
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showToast(msg, duration = 3000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(showToast._timer);
  showToast._timer = setTimeout(() => t.classList.add('hidden'), duration);
}

function throttle(fn, ms) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms) { last = now; fn(...args); }
  };
}


/* ============================================================
   1. LOADING SCREEN
   ============================================================ */
function initLoading() {
  const screen = document.getElementById('loading-screen');
  const introSection = document.getElementById('intro-section');
  if (!screen) return;
  
  /* Show the loading screen */
  screen.classList.remove('hidden-section', 'fade-out');
  screen.style.display = '';
  
  setTimeout(() => {
    screen.classList.add('fade-out');
    setTimeout(() => {
      screen.style.display = 'none';
      /* Show intro section and initialize animations */
      if (introSection) {
        introSection.classList.remove('hidden-section');
        introSection.style.display = '';
      }
      initIntroAnimations();
    }, 800);
  }, CONFIG.loadDuration);
}


/* ============================================================
   2. CSS CURSOR TRAIL (DOM-based hearts, no canvas)
   ============================================================ */
function initCursorTrail() {
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    const cv = document.getElementById('cursor-canvas');
    if (cv) cv.style.display = 'none';
    return;
  }
  const cv = document.getElementById('cursor-canvas');
  if (cv) cv.style.display = 'none';

  const EMOJIS = ['💗','💖','💕','✨','🌸'];
  let pool = [];
  const MAX_POOL = 20;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes cursorHeartFade {
      0%   { opacity: 1; transform: translateY(0)    scale(1);   }
      100% { opacity: 0; transform: translateY(-38px) scale(0.4); }
    }
    .cursor-heart {
      position: fixed; pointer-events: none; z-index: 9990;
      font-size: 14px; will-change: transform, opacity;
      animation: cursorHeartFade 0.7s ease forwards;
    }
  `;
  document.head.appendChild(style);

  function getNode() {
    if (pool.length) return pool.pop();
    const s = document.createElement('span');
    s.className = 'cursor-heart';
    document.body.appendChild(s);
    return s;
  }

  function spawnHeart(x, y) {
    const node = getNode();
    node.textContent = EMOJIS[randInt(0, EMOJIS.length)];
    node.style.left  = (x + rand(-10, 10)) + 'px';
    node.style.top   = (y + rand(-10, 10)) + 'px';
    node.style.animation = 'none';
    node.offsetHeight;
    node.style.animation = 'cursorHeartFade 0.7s ease forwards';
    setTimeout(() => {
      if (pool.length < MAX_POOL) pool.push(node);
      else node.remove();
    }, 720);
  }

  document.addEventListener('mousemove', throttle(e => {
    spawnHeart(e.clientX, e.clientY);
  }, 80));
}


/* ============================================================
   3. AMBIENT PETALS (CSS-only, no canvas)
   ============================================================ */
function initParticles() {
  const cv = document.getElementById('particle-canvas');
  if (cv) cv.style.display = 'none';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes ambientDrift {
      0%   { transform: translateY(100vh) translateX(0)    rotate(0deg);   opacity: 0; }
      8%   { opacity: 0.45; }
      92%  { opacity: 0.35; }
      100% { transform: translateY(-60px)  translateX(30px) rotate(360deg); opacity: 0; }
    }
    .ambient-petal {
      position: fixed; pointer-events: none; z-index: 1;
      will-change: transform;
      animation: ambientDrift linear infinite;
    }
  `;
  document.head.appendChild(style);

  const ITEMS = ['🌸','🌺','💕','🌷','✨'];
  const COUNT = window.matchMedia('(max-width: 768px)').matches ? 6 : 12;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('span');
    el.className = 'ambient-petal';
    el.textContent = ITEMS[i % ITEMS.length];
    el.style.cssText = `
      font-size: ${rand(14, 24)}px;
      left: ${rand(0, 100)}vw;
      bottom: -30px;
      animation-duration: ${rand(12, 22)}s;
      animation-delay: ${rand(0, 14)}s;
      opacity: 0;
    `;
    document.body.appendChild(el);
  }

  if (window.matchMedia('(max-width: 768px)').matches) {
    const mobileStyle = document.createElement('style');
    mobileStyle.textContent = `.section { padding-bottom: 80px !important; }`;
    document.head.appendChild(mobileStyle);
  }
}


/* ============================================================
   4. INTRO ANIMATIONS
   ============================================================ */
function initIntroAnimations() {
  spawnIntroHearts();
  spawnIntroSparkles();
  buildBottomFlowers();
  placeEasterEggs();
}

function spawnIntroHearts() {
  const container = document.getElementById('intro-hearts');
  if (!container) return;
  const emojis = ['💗','💖','💕','❤️','🌸','✨'];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('span');
    el.textContent = emojis[randInt(0, emojis.length)];
    el.style.cssText = `
      position:absolute; font-size:${rand(14, 28)}px;
      left:${rand(0, 100)}%; top:${rand(0, 100)}%;
      animation:flowerDrift ${rand(8, 16)}s linear infinite;
      animation-delay:${rand(0, 8)}s;
      pointer-events:none; opacity:${rand(0.15, 0.4)};
      will-change:transform;
    `;
    container.appendChild(el);
  }
}

function spawnIntroSparkles() {
  const field = document.getElementById('intro-sparkles');
  if (!field) return;
  const items = ['✨','💫','🌟'];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.textContent = items[i % items.length];
    s.style.cssText = `
      position:absolute; font-size:${rand(12, 20)}px;
      left:${rand(0, 100)}%; top:${rand(0, 100)}%;
      animation:sparkleFade ${rand(2, 4)}s ease-in-out infinite;
      animation-delay:${rand(0, 4)}s;
      pointer-events:none; opacity:0;
    `;
    field.appendChild(s);
  }
}

function buildBottomFlowers() {
  const row = document.getElementById('bottom-flowers');
  if (!row) return;
  const flowers = ['🌸','🌺','🌷','🌼','💐','🌸','🌺','🌷'];
  flowers.forEach((f, i) => {
    const el = document.createElement('span');
    el.textContent = f;
    el.style.cssText = `
      display:inline-block;
      animation:bloomBounce ${rand(2, 4)}s ease-in-out infinite;
      animation-delay:${i * 0.18}s;
      font-size:${rand(22, 38)}px;
    `;
    row.appendChild(el);
  });
}


/* ============================================================
   5. EASTER EGGS
   ============================================================ */
function placeEasterEggs() {
  const msgs = [
    '🌸 Secret found! She loves you endlessly.',
    '💗 Hidden note: You are the most beautiful thing in his world.',
    '✨ Easter egg! His favourite memory: the first time you laughed together.',
    '💌 Secret: He falls for you a little more every single day.',
    '🦋 Butterfly kiss! Stay magical, always.',
  ];
  msgs.forEach((msg, i) => {
    const el = document.createElement('div');
    el.className = 'easter-egg';
    el.textContent = ['💗','🌸','✨','💫','🦋'][i];
    el.style.cssText = `top:${rand(10, 90)}vh; left:${rand(2, 95)}vw;`;
    el.addEventListener('click', () => {
      showToast(msg, 4000);
      const r = el.getBoundingClientRect();
      burstHearts(r.left, r.top);
    });
    document.body.appendChild(el);
  });
}


/* ============================================================
   6. NAVIGATION
   ============================================================ */
function initNavigation() {
  function go(fromId, toId, extra) {
    showSection(toId);
    const from = document.getElementById(fromId);
    if (from) {
      from.style.transition = 'opacity 0.5s ease';
      from.style.opacity = '0';
      setTimeout(() => { from.style.display = 'none'; from.style.opacity = ''; }, 500);
    }
    if (extra) extra();
  }

  document.getElementById('open-gift-btn').addEventListener('click', () => {
    go('intro-section', 'envelope-section');
    showMusicPlayer();
    showAutoplayPrompt();
  });
  document.getElementById('next-to-timeline').addEventListener('click', () => {
    go('envelope-section', 'timeline-section', initTimelineObserver);
  });
  document.getElementById('next-to-reasons').addEventListener('click', () => {
    go('timeline-section', 'reasons-section');
  });
  document.getElementById('next-to-countdown').addEventListener('click', () => {
    go('reasons-section', 'countdown-section', startClocks);
  });
  document.getElementById('next-to-surprise').addEventListener('click', () => {
    go('countdown-section', 'surprise-section');
  });
  document.getElementById('next-to-gallery').addEventListener('click', () => {
    go('surprise-section', 'gallery-section', initGallery);
  });
  document.getElementById('next-to-ending').addEventListener('click', () => {
    go('gallery-section', 'ending-section', initEnding);
  });
  document.getElementById('replay-btn').addEventListener('click', () => location.reload());
}


/* ============================================================
   7. AUTOPLAY PROMPT
   ============================================================ */
function showAutoplayPrompt() {
  const prompt = document.getElementById('autoplay-prompt');
  if (!prompt) return;
  prompt.classList.remove('hidden');

  const okBtn = document.getElementById('autoplay-ok');
  if (okBtn) {
    okBtn.addEventListener('click', () => {
      prompt.classList.add('hidden');
      /* Try to play music if a track is loaded */
      if (audioEl && audioEl.src && audioEl.src !== window.location.href) {
        audioEl.play().catch(() => {});
        isPlaying = true;
        const playBtn = document.getElementById('play-btn');
        if (playBtn) playBtn.textContent = '⏸';
        const player = document.getElementById('music-player');
        if (player) player.classList.add('playing');
      }
    }, { once: true });
  }

  /* Auto-hide after 8 seconds */
  setTimeout(() => prompt.classList.add('hidden'), 8000);
}


/* ============================================================
   8. ENVELOPE + LETTER TYPING
   ============================================================ */
function initEnvelope() {
  const envelope   = document.getElementById('envelope');
  const letterCard = document.getElementById('letter-card');
  const letterBody = document.getElementById('letter-body');
  const skipBtn    = document.getElementById('skip-typing-btn');
  const nextBtn    = document.getElementById('next-to-timeline');
  let opened  = false;
  let typing  = false;
  let typeIdx = 0;
  let typeTimer = null;

  envelope.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    envelope.classList.add('opened');
    envelope.querySelector('.env-hint').textContent = '💌 Opening…';
    setTimeout(() => {
      envelope.style.display = 'none';
      letterCard.classList.remove('hidden');

      /* Show skip button after a short delay */
      setTimeout(() => skipBtn.classList.remove('hidden'), 1500);

      startTyping();
    }, 800);
  });

  function startTyping() {
    typing = true;
    typeIdx = 0;
    letterBody.textContent = '';

    function tick() {
      if (!typing) return;
      if (typeIdx < CONFIG.letterText.length) {
        letterBody.textContent += CONFIG.letterText[typeIdx++];
        letterBody.scrollTop = letterBody.scrollHeight;
        typeTimer = setTimeout(tick, CONFIG.typeSpeed);
      } else {
        finishTyping();
      }
    }
    tick();
  }

  function finishTyping() {
    typing = false;
    clearTimeout(typeTimer);
    letterBody.textContent = CONFIG.letterText;
    skipBtn.classList.add('hidden');
    nextBtn.classList.remove('hidden');
  }

  /* Skip button — show full text instantly */
  skipBtn.addEventListener('click', () => {
    finishTyping();
  });
}


/* ============================================================
   9. TIMELINE SCROLL REVEAL
   ============================================================ */
function initTimelineObserver() {
  const items = $$('.reveal-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(item => observer.observe(item));

  $$('.heart-react').forEach(h => {
    h.addEventListener('click', e => {
      burstHearts(e.clientX, e.clientY, 5);
      h.style.transform = 'scale(1.8) rotate(-10deg)';
      setTimeout(() => { h.style.transform = ''; }, 400);
    });
  });
}


/* ============================================================
   10. REASONS I LOVE YOU
   ============================================================ */
function initReasons() {
  const cards  = $$('.reason-card');
  const modal  = document.getElementById('reason-modal');
  const text   = document.getElementById('reason-text');
  const closeBtn = document.getElementById('reason-modal-close');
  const overlay = document.getElementById('reason-modal-overlay');
  let typeTimer = null;

  /* Close modal when close button is clicked */
  closeBtn.addEventListener('click', () => {
    clearTimeout(typeTimer);
    modal.classList.add('hidden');
    cards.forEach(c => c.classList.remove('opened'));
  });

  /* Close modal when overlay is clicked */
  overlay.addEventListener('click', () => {
    clearTimeout(typeTimer);
    modal.classList.add('hidden');
    cards.forEach(c => c.classList.remove('opened'));
  });

  /* Close modal on Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      clearTimeout(typeTimer);
      modal.classList.add('hidden');
      cards.forEach(c => c.classList.remove('opened'));
    }
  });

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const reason = card.dataset.reason;
      cards.forEach(c => c.classList.remove('opened'));
      card.classList.add('opened');
      
      /* Clear any previous typewriter animation */
      clearTimeout(typeTimer);
      text.textContent = '';
      modal.classList.remove('hidden');

      /* Typewriter effect for reasons */
      let i = 0;
      function tick() {
        if (i < reason.length) {
          text.textContent += reason[i++];
          typeTimer = setTimeout(tick, 18);
        }
      }
      tick();

      const r = card.getBoundingClientRect();
      burstFlowers(r.left + 40, r.top + 40, 5);
    });
  });
}


/* ============================================================
   11. CLOCKS
   ============================================================ */
let clockInterval = null;

function startClocks() {
  if (clockInterval) return;
  updateClocks();
  clockInterval = setInterval(updateClocks, 1000);
}

function updateClocks() {
  const now = new Date();

  /* Live clock */
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('live-clock').textContent = `${hh}:${mm}:${ss}`;
  document.getElementById('live-date').textContent =
    now.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  /* Time together */
  const diff  = now - CONFIG.metDate;
  const days  = Math.floor(diff / 864e5);
  const hours = Math.floor((diff % 864e5) / 36e5);
  const mins  = Math.floor((diff % 36e5)  / 6e4);
  const secs  = Math.floor((diff % 6e4)   / 1e3);
  document.getElementById('time-together').textContent = `${days}d · ${hours}h · ${mins}m · ${secs}s`;

  /* Birthday */
  const bday = CONFIG.birthdayDate;
  const isBirthday = now.getMonth() === bday.getMonth() && now.getDate() === bday.getDate();
  const bdEl = document.getElementById('birthday-display');
  if (isBirthday) {
    bdEl.textContent = '🎉 TODAY IS YOUR DAY! 🎉';
  } else {
    const nextBday = new Date(bday);
    nextBday.setFullYear(now.getFullYear());
    if (nextBday < now) nextBday.setFullYear(now.getFullYear() + 1);
    const bd = nextBday - now;
    bdEl.textContent =
      `${Math.floor(bd/864e5)}d · ${Math.floor((bd%864e5)/36e5)}h · ${Math.floor((bd%36e5)/6e4)}m`;
  }
}


/* ============================================================
   12. GIFT CHALLENGE
   ============================================================ */
function initGiftChallenge() {
  const hearts   = $$('.ch-heart');
  const dots     = [1,2,3,4,5].map(i => document.getElementById(`cp${i}`));
  let expected   = 1;

  hearts.forEach(heart => {
    heart.addEventListener('click', () => {
      const order = parseInt(heart.dataset.order);
      if (order !== expected) {
        expected = 1;
        dots.forEach(d => { d.textContent = '○'; d.classList.remove('filled'); });
        hearts.forEach(h => h.classList.remove('active'));
        showToast('💗 Start from 1 again, my love!');
        return;
      }
      heart.classList.add('active');
      dots[expected - 1].textContent = '♥';
      dots[expected - 1].classList.add('filled');
      expected++;
      if (expected > 5) setTimeout(unlockGift, 500);
    });
  });
}

function unlockGift() {
  const challenge = document.getElementById('gift-challenge');
  const giftBox   = document.getElementById('gift-box');
  const reveal    = document.getElementById('surprise-reveal');
  const nav       = document.getElementById('surprise-nav');

  challenge.style.transition = 'opacity 0.4s ease';
  challenge.style.opacity    = '0';
  setTimeout(() => { challenge.style.display = 'none'; }, 400);

  giftBox.classList.add('unlocked');
  showToast('🎁 Your gift is unlocked! 💕', 3000);

  setTimeout(() => {
    giftBox.style.display = 'none';
    reveal.classList.remove('hidden');
    nav.classList.remove('hidden');
    triggerConfetti();
  }, 900);
}


/* ============================================================
   13. GALLERY + LIGHTBOX
   ============================================================ */
function initGallery() {
  const items     = $$('.gallery-item');
  const lightbox  = document.getElementById('lightbox');
  const lbImgWrap = document.getElementById('lb-img-wrap');
  const lbCaption = document.getElementById('lb-caption');
  const lbClose   = document.getElementById('lb-close');
  const lbOverlay = document.getElementById('lb-overlay');

  items.forEach(item => {
    if (!item.querySelector('.gallery-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'gallery-overlay';
      const cap = document.createElement('div');
      cap.className = 'gallery-caption';
      cap.textContent = item.dataset.caption || '';
      overlay.appendChild(cap);
      item.appendChild(overlay);
    }

    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const ph  = item.querySelector('.photo-placeholder');
      lbImgWrap.innerHTML = '';

      if (img) {
        const clone = img.cloneNode(true);
        clone.style.cssText = 'max-width:80vw;max-height:70vh;object-fit:contain;display:block;margin:auto;border-radius:12px;';
        lbImgWrap.appendChild(clone);
      } else if (ph) {
        const d = document.createElement('div');
        d.style.cssText = 'padding:60px 80px;font-size:1.1rem;color:#8c4a6e;font-style:italic;text-align:center;';
        d.textContent = ph.textContent;
        lbImgWrap.appendChild(d);
      }
      lbCaption.textContent = item.dataset.caption || '';
      lightbox.classList.remove('hidden');
    });
  });

  const close = () => lightbox.classList.add('hidden');
  lbClose.addEventListener('click', close);
  lbOverlay.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}


/* ============================================================
   14. ENDING SECTION
   ============================================================ */
function initEnding() {
  buildEndingFlowers();
  buildEndingStars();
  buildLanterns();
  spawnEndingHearts();
  startFireworks();
  triggerConfetti();

  /* Update ending name from config */
  const nameEl = document.querySelector('.ending-name');
  if (nameEl && CONFIG.herName && CONFIG.herName !== 'My Love') {
    nameEl.textContent = CONFIG.herName + ' ❤️';
  }
}

function buildEndingFlowers() {
  const el = document.getElementById('ending-flowers');
  if (el) ['🌸','🌺','🌷','🌼','💐','🌸','🌺'].forEach(f => {
    const s = document.createElement('span'); s.textContent = f; el.appendChild(s);
  });
  const bottom = document.getElementById('ending-bottom');
  if (bottom) ['🌸','🌺','🌷','🌼','💐','🌸','🌺','🌷'].forEach((f, i) => {
    const s = document.createElement('span');
    s.textContent = f;
    s.style.cssText = `animation:bloomBounce ${rand(2,4)}s ease-in-out infinite;animation-delay:${i*.2}s;font-size:${rand(22,42)}px;`;
    bottom.appendChild(s);
  });
}

function buildEndingStars() {
  const c = document.getElementById('ending-stars');
  if (!c) return;
  for (let i = 0; i < 40; i++) {
    const s = document.createElement('span');
    s.textContent = ['⭐','✨','💫','🌟'][randInt(0,4)];
    s.style.cssText = `
      position:absolute; font-size:${rand(10,20)}px;
      left:${rand(0,100)}%; top:${rand(0,100)}%;
      opacity:${rand(0.15,0.55)};
      animation:pulse ${rand(2,5)}s ease-in-out infinite;
      animation-delay:${rand(0,4)}s;
    `;
    c.appendChild(s);
  }
}

function buildLanterns() {
  const c = document.getElementById('ending-lanterns');
  if (!c) return;
  for (let i = 0; i < 7; i++) {
    const l = document.createElement('span');
    l.textContent = '🏮';
    l.style.cssText = `
      position:absolute; font-size:${rand(22,40)}px;
      left:${rand(5,90)}%; bottom:0;
      animation:flowerDrift ${rand(9,18)}s linear infinite;
      animation-delay:${rand(0,8)}s; opacity:0.65;
    `;
    c.appendChild(l);
  }
}

function spawnEndingHearts() {
  const c = document.getElementById('ending-hearts');
  if (!c) return;
  ['💗','💖','💕','❤️','💝','💗','💖','💕'].forEach((h, i) => {
    const el = document.createElement('span');
    el.textContent = h;
    el.style.cssText = `display:inline-block;font-size:${rand(18,32)}px;
      animation:float ${rand(2,5)}s ease-in-out infinite;
      animation-delay:${rand(0,3)}s;margin:0 4px;`;
    c.appendChild(el);
  });
}


/* ============================================================
   15. FIREWORKS (canvas — only on ending screen)
   ============================================================ */
let fireworksRunning = false;

function startFireworks() {
  if (fireworksRunning) return;
  fireworksRunning = true;

  const canvas = document.getElementById('fireworks-canvas');
  const ctx    = canvas.getContext('2d');

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#f472a0','#e8527a','#fba8c4','#ffd6e8','#c9748c','#ffffff','#ffe0f0'];
  const particles = [];

  function burst(x, y) {
    const count = randInt(35, 55);
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i;
      const speed = rand(1.5, 5);
      particles.push({
        x, y,
        vx:    Math.cos(angle) * speed,
        vy:    Math.sin(angle) * speed,
        life:  1,
        decay: rand(0.013, 0.026),
        color: COLORS[randInt(0, COLORS.length)],
        size:  rand(2, 4.5),
      });
    }
  }

  let lastBurst = 0;
  function loop(ts) {
    if (!fireworksRunning) return;
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = 'rgba(26,0,16,0.2)';
    ctx.fillRect(0, 0, W, H);

    if (ts - lastBurst > rand(800, 1800)) {
      burst(rand(W * 0.1, W * 0.9), rand(H * 0.1, H * 0.6));
      lastBurst = ts;
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.05; p.vx *= 0.98;
      p.life -= p.decay;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle   = p.color;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fill();

      if (p.life <= 0) particles.splice(i, 1);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}


/* ============================================================
   16. CONFETTI (CSS-based)
   ============================================================ */
function triggerConfetti() {
  const items = ['🌸','💗','✨','🌺','💖','💕','🦋','🌷'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.textContent = items[randInt(0, items.length)];
      el.style.cssText = `
        position:fixed; font-size:${rand(14,26)}px;
        left:${rand(0,100)}vw; top:-40px;
        z-index:9000; pointer-events:none;
        animation:flowerDrift ${rand(3,6)}s linear forwards;
        animation-delay:${rand(0,1.5)}s; opacity:1;
        will-change:transform;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 8000);
    }, i * 50);
  }
}


/* ============================================================
   17. BURST EFFECTS
   ============================================================ */
function burstHearts(x, y, count = 7) {
  const items = ['💗','💖','❤️','💕','✨'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.textContent = items[randInt(0, items.length)];
    const angle = (Math.PI * 2 / count) * i;
    const dist  = rand(40, 80);
    el.style.cssText = `
      position:fixed; font-size:${rand(14,24)}px;
      left:${x}px; top:${y}px;
      z-index:9001; pointer-events:none;
      transition:transform 0.75s ease-out,opacity 0.75s ease-out;
      will-change:transform,opacity;
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0.3)`;
      el.style.opacity   = '0';
    });
    setTimeout(() => el.remove(), 800);
  }
}

function burstFlowers(x, y, count = 6) {
  const items = ['🌸','🌺','🌷','💕','✨'];
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.textContent = items[randInt(0, items.length)];
    const angle = (Math.PI * 2 / count) * i;
    const dist  = rand(50, 90);
    el.style.cssText = `
      position:fixed; font-size:${rand(16,26)}px;
      left:${x}px; top:${y}px;
      z-index:9001; pointer-events:none;
      transition:transform 0.85s ease-out,opacity 0.85s ease-out;
      will-change:transform,opacity;
    `;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.style.transform = `translate(${Math.cos(angle)*dist}px,${Math.sin(angle)*dist}px) scale(0.3) rotate(${rand(-180,180)}deg)`;
      el.style.opacity   = '0';
    });
    setTimeout(() => el.remove(), 900);
  }
}


/* ============================================================
   18. MUSIC PLAYER
   ============================================================ */
let audioEl      = null;
let currentTrack = 0;
let isPlaying    = false;

function showMusicPlayer() {
  document.getElementById('music-player').classList.remove('hidden');
}

function initMusicPlayer() {
  audioEl        = new Audio();
  audioEl.volume = 0.5;

  const playBtn   = document.getElementById('play-btn');
  const prevBtn   = document.getElementById('prev-btn');
  const nextBtn   = document.getElementById('next-btn');
  const volSlider = document.getElementById('volume-slider');
  const titleEl   = document.getElementById('music-title');
  const player    = document.getElementById('music-player');

  function loadTrack(index) {
    const track = CONFIG.playlist[index];
    titleEl.textContent = track.title;
    if (track.src) {
      audioEl.src = track.src;
      if (isPlaying) audioEl.play().catch(() => {});
    } else {
      audioEl.src = '';
    }
  }

  function togglePlay() {
    if (audioEl.src && audioEl.src !== window.location.href) {
      isPlaying ? audioEl.pause() : audioEl.play().catch(() => {});
    }
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? '⏸' : '▶';
    player.classList.toggle('playing', isPlaying);
  }

  playBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', () => {
    currentTrack = (currentTrack - 1 + CONFIG.playlist.length) % CONFIG.playlist.length;
    loadTrack(currentTrack);
    showToast(`♪ ${CONFIG.playlist[currentTrack].title}`);
  });
  nextBtn.addEventListener('click', () => {
    currentTrack = (currentTrack + 1) % CONFIG.playlist.length;
    loadTrack(currentTrack);
    showToast(`♪ ${CONFIG.playlist[currentTrack].title}`);
  });
  volSlider.addEventListener('input', () => { audioEl.volume = +volSlider.value; });
  audioEl.addEventListener('ended', () => {
    currentTrack = (currentTrack + 1) % CONFIG.playlist.length;
    loadTrack(currentTrack);
  });

  loadTrack(0);
}


/* ============================================================
   19. KEYBOARD SECRETS
   ============================================================ */
function initKeyboardSecrets() {
  let buf = '';
  const KONAMI = 'arrowuparrowuparrowdownarrowdownarrowleftarrowrightarrowleftarrowrightba';
  document.addEventListener('keydown', e => {
    buf += e.key.toLowerCase();
    if (buf.length > KONAMI.length) buf = buf.slice(-KONAMI.length);
    if (buf === KONAMI) {
      showToast('🌸 Secret code found! Love you forever! 💗', 5000);
      triggerConfetti();
    }
    if (e.key.toLowerCase() === 'l') {
      burstHearts(window.innerWidth / 2, window.innerHeight / 2, 10);
    }
  });
}


/* ============================================================
   20. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const style = document.createElement('style');
  style.textContent = `
    [data-reveal] { opacity:0; transform:translateY(24px); transition:opacity 0.65s ease, transform 0.65s ease; }
    [data-reveal].in-view { opacity:1; transform:translateY(0); }
  `;
  document.head.appendChild(style);

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in-view'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });

  $$('[data-reveal]').forEach(el => obs.observe(el));
}


/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initCursorTrail();
  initParticles();
  initLoading();
  initNavigation();
  initEnvelope();
  initReasons();
  initGiftChallenge();
  initMusicPlayer();
  initKeyboardSecrets();
  initScrollReveal();

  setTimeout(() => showToast('💗 Press "L" anytime for a love surprise!', 4000), 4500);
});

/* ============================================================
   PASSCODE SCREEN
   ============================================================ */

const PASSCODE = "060605"; // Change to her birthday (MMDD)

let enteredCode = "";

function initPasscode() {
  const passcodeScreen = document.getElementById("passcode-screen");
  const keypad = document.getElementById("passcode-keypad");
  const errorMsg = document.getElementById("passcode-error");
  const icon = document.querySelector(".passcode-icon");

  if (!passcodeScreen || !keypad) return;

  createPasscodePetals();

  keypad.addEventListener("click", (e) => {
    const btn = e.target.closest(".pk-btn");
    if (!btn) return;

    const value = btn.dataset.val;

    if (value === "clear") {
      enteredCode = enteredCode.slice(0, -1);
      updateDots();
      return;
    }

    if (value === "enter") {
      checkPasscode();
      return;
    }

    if (enteredCode.length >= 6) return;

    enteredCode += value;
    updateDots();

    if (enteredCode.length === 6) {
      setTimeout(checkPasscode, 200);
    }
  });

  function updateDots() {
    for (let i = 0; i < 6; i++) {
      const dot = document.getElementById(`pdot-${i}`);

      if (!dot) continue;

      if (i < enteredCode.length) {
        dot.classList.add("filled");
      } else {
        dot.classList.remove("filled");
      }

      dot.classList.remove("error");
    }
  }

  function checkPasscode() {
    if (enteredCode !== PASSCODE) {
      errorMsg.classList.remove("hidden");
      keypad.classList.add("shake");

      document.querySelectorAll(".pdot").forEach(dot => {
        dot.classList.add("error");
      });

      navigator.vibrate?.(150);

      setTimeout(() => {
        keypad.classList.remove("shake");
        document.querySelectorAll(".pdot").forEach(dot => {
          dot.classList.remove("filled", "error");
        });

        enteredCode = "";
      }, 700);

      return;
    }

    errorMsg.classList.add("hidden");

    icon.textContent = "💖";
    icon.classList.add("success");

    navigator.vibrate?.([100, 50, 100]);

    setTimeout(() => {
      passcodeScreen.classList.add("fade-out");

      setTimeout(() => {
        passcodeScreen.style.display = "none";

        // Start loading screen after unlock
        initLoading();
      }, 800);
    }, 600);
  }
}

/* ============================================================
   FLOATING PETALS
   ============================================================ */

function createPasscodePetals() {
  const container = document.getElementById("passcode-petals");

  if (!container) return;

  const flowers = ["🌸", "🌺", "🌷", "💖", "✨"];

  const amount = window.innerWidth < 768 ? 12 : 20;

  for (let i = 0; i < amount; i++) {
    const petal = document.createElement("span");

    petal.textContent =
      flowers[Math.floor(Math.random() * flowers.length)];

    petal.style.position = "absolute";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.top = "-50px";
    petal.style.fontSize = `${16 + Math.random() * 16}px`;
    petal.style.opacity = "0.4";
    petal.style.pointerEvents = "none";

    petal.animate(
      [
        {
          transform: "translateY(-50px) rotate(0deg)"
        },
        {
          transform: `translateY(${window.innerHeight + 100}px)
                      translateX(${Math.random() * 120 - 60}px)
                      rotate(360deg)`
        }
      ],
      {
        duration: 8000 + Math.random() * 6000,
        iterations: Infinity,
        delay: Math.random() * 5000
      } 
    );

    container.appendChild(petal);
  }
}

/* ============================================================
   START
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initPasscode();
});

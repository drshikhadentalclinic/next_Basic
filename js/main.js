/* =====================================================
   TeethFix.in — 3D JavaScript Engine
   Three.js particles + CSS 3D tilt + GSAP-style anims
   ===================================================== */

// ─── LOADER ───────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    initAll();
  }, 2000);
});

function initAll() {
  initNavbar();
  initHeroCanvas();
  initWhyCanvas();
  initCtaCanvas();
  initTilt();
  initService3D();
  initScrollReveal();
  initCounters();
  initTestiSlider();
  initHamburger();
  initSmoothScroll();
  initFloatCards();
}

// ─── NAVBAR ───────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('navLinks');
  btn.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  document.addEventListener('click', e => { if (!document.getElementById('navbar').contains(e.target)) nav.classList.remove('open'); });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
}

// ─── THREE.JS HERO PARTICLE CANVAS ───────────────────
function initHeroCanvas() {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  // ── Floating particle field ──
  const particleCount = 280;
  const positions = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);
  const phases = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    scales[i]  = Math.random() * 2 + 0.5;
    phases[i]  = Math.random() * Math.PI * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

  const mat = new THREE.PointsMaterial({
    color: 0x0a6b6b, size: 0.06, transparent: true, opacity: 0.55,
    sizeAttenuation: true
  });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // ── Gold particles ──
  const goldPositions = new Float32Array(120 * 3);
  for (let i = 0; i < 120; i++) {
    goldPositions[i * 3]     = (Math.random() - 0.5) * 18;
    goldPositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    goldPositions[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  const goldGeo = new THREE.BufferGeometry();
  goldGeo.setAttribute('position', new THREE.BufferAttribute(goldPositions, 3));
  const goldMat = new THREE.PointsMaterial({ color: 0xc9952a, size: 0.05, transparent: true, opacity: 0.4, sizeAttenuation: true });
  const goldParticles = new THREE.Points(goldGeo, goldMat);
  scene.add(goldParticles);

  // ── Floating torus rings ──
  const rings = [];
  for (let i = 0; i < 4; i++) {
    const ringGeo = new THREE.TorusGeometry(1.2 + i * 0.6, 0.015, 8, 60);
    const ringMat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x0a6b6b : 0xc9952a,
      transparent: true, opacity: 0.15 - i * 0.025
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3 + i * 0.3;
    ring.rotation.y = i * 0.5;
    ring.position.set(2.5, 0, -1);
    scene.add(ring);
    rings.push(ring);
  }

  // ── Icosahedron wireframe ──
  const icoGeo = new THREE.IcosahedronGeometry(0.9, 1);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x1a8c8c, wireframe: true, transparent: true, opacity: 0.18 });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.set(-3, 1.5, -1);
  scene.add(ico);

  // ── Dodecahedron ──
  const dodGeo = new THREE.DodecahedronGeometry(0.6, 0);
  const dodMat = new THREE.MeshBasicMaterial({ color: 0xc9952a, wireframe: true, transparent: true, opacity: 0.15 });
  const dod = new THREE.Mesh(dodGeo, dodMat);
  dod.position.set(3.5, -1, -2);
  scene.add(dod);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;

    // Rotate particle cloud gently, follow mouse
    particles.rotation.y = t * 0.08 + mouseX * 0.05;
    particles.rotation.x = mouseY * 0.03;
    goldParticles.rotation.y = -t * 0.05 + mouseX * 0.04;

    // Animate positions slightly for living feel
    const pos = geo.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      pos.array[i * 3 + 1] += Math.sin(t + phases[i]) * 0.002;
    }
    pos.needsUpdate = true;

    // Rings
    rings.forEach((ring, i) => {
      ring.rotation.z += 0.003 * (i % 2 === 0 ? 1 : -1);
      ring.rotation.y += 0.002;
    });

    // Wireframes
    ico.rotation.x += 0.005;
    ico.rotation.y += 0.007;
    dod.rotation.x -= 0.004;
    dod.rotation.y += 0.009;

    renderer.render(scene, camera);
  }
  animate();
}

// ─── WHY-US BACKGROUND CANVAS (Three.js) ─────────────
function initWhyCanvas() {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('whyCanvas');
  if (!canvas) return;

  const section = canvas.parentElement;
  const w = section.offsetWidth, h = section.offsetHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(1);
  renderer.setSize(w, h);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
  camera.position.z = 4;

  // Floating octahedrons
  const meshes = [];
  for (let i = 0; i < 12; i++) {
    const g = new THREE.OctahedronGeometry(0.18 + Math.random() * 0.22, 0);
    const m = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.09 + Math.random() * 0.08 });
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 3);
    mesh.userData = { speedX: (Math.random() - 0.5) * 0.01, speedY: (Math.random() - 0.5) * 0.008 };
    scene.add(mesh);
    meshes.push(mesh);
  }

  // Particle field
  const pCount = 150;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) { pPos[i*3] = (Math.random()-0.5)*12; pPos[i*3+1] = (Math.random()-0.5)*8; pPos[i*3+2] = (Math.random()-0.5)*4; }
  const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, transparent: true, opacity: 0.3 });
  scene.add(new THREE.Points(pGeo, pMat));

  const resizeObs = new ResizeObserver(() => {
    const nw = section.offsetWidth, nh = section.offsetHeight;
    renderer.setSize(nw, nh);
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
  });
  resizeObs.observe(section);

  function animate() {
    requestAnimationFrame(animate);
    meshes.forEach(m => { m.rotation.x += m.userData.speedX; m.rotation.y += m.userData.speedY; });
    renderer.render(scene, camera);
  }
  animate();
}

// ─── CTA BANNER CANVAS ────────────────────────────────
function initCtaCanvas() {
  if (typeof THREE === 'undefined') return;
  const canvas = document.getElementById('ctaCanvas');
  if (!canvas) return;

  const section = canvas.parentElement;
  const w = section.offsetWidth, h = section.offsetHeight;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setPixelRatio(1);
  renderer.setSize(w, h);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
  camera.position.z = 3;

  const items = [];
  const shapes = [
    () => new THREE.TetrahedronGeometry(0.22, 0),
    () => new THREE.OctahedronGeometry(0.18, 0),
    () => new THREE.IcosahedronGeometry(0.16, 0)
  ];
  for (let i = 0; i < 8; i++) {
    const geo = shapes[i % 3]();
    const mat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xc9952a : 0xffffff, wireframe: true, transparent: true, opacity: 0.1 });
    const m = new THREE.Mesh(geo, mat);
    m.position.set((Math.random()-0.5)*8, (Math.random()-0.5)*4, (Math.random()-0.5)*2);
    m.userData = { rx: (Math.random()-0.5)*0.015, ry: (Math.random()-0.5)*0.012 };
    scene.add(m);
    items.push(m);
  }

  const resizeObs = new ResizeObserver(() => {
    const nw = section.offsetWidth, nh = section.offsetHeight;
    renderer.setSize(nw, nh); camera.aspect = nw / nh; camera.updateProjectionMatrix();
  });
  resizeObs.observe(section);

  function animate() { requestAnimationFrame(animate); items.forEach(m => { m.rotation.x += m.userData.rx; m.rotation.y += m.userData.ry; }); renderer.render(scene, camera); }
  animate();
}

// ─── 3D TILT on About card ────────────────────────────
function initTilt() {
  const card = document.querySelector('[data-tilt] .tilt-card');
  if (!card) return;

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / (rect.height / 2)) * -12;
    const ry = ((e.clientX - cx) / (rect.width / 2)) * 12;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.04)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
    card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
  });
}

// ─── SERVICE CARD 3D MOUSE ────────────────────────────
function initService3D() {
  document.querySelectorAll('.sc-3d').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) translateY(-10px) scale(1.02)`;
      card.style.boxShadow = `${-x * 20}px ${-y * 20}px 60px rgba(10,107,107,0.22)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });

  // Why cards too
  document.querySelectorAll('.wc-3d').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 7}deg) translateY(-8px) scale(1.03)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  // Testimonial 3D
  document.querySelectorAll('.tc-3d').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      card.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// ─── SCROLL REVEAL ────────────────────────────────────
function initScrollReveal() {
  const els = document.querySelectorAll(
    '.service-card, .why-card, .testi-card, .about-grid, .info-block, .stat, .highlight-item, .loc-map'
  );
  els.forEach(el => el.classList.add('reveal'));

  // Stagger grids
  document.querySelectorAll('.services-grid .service-card').forEach((el, i) => { el.style.transitionDelay = `${i * 0.07}s`; });
  document.querySelectorAll('.why-grid .why-card').forEach((el, i) => { el.style.transitionDelay = `${i * 0.07}s`; });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
    });
  }, { threshold: 0.1 });

  els.forEach(el => obs.observe(el));
}

// ─── COUNTER ANIMATION ────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1800;
        const start = performance.now();
        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target;
        }
        requestAnimationFrame(update);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}

// ─── TESTIMONIAL SLIDER ───────────────────────────────
function initTestiSlider() {
  const track = document.getElementById('testiTrack');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  const dotsContainer = document.getElementById('testiDots');
  if (!track || !prevBtn) return;

  const cards = track.querySelectorAll('.testi-card');
  const total = cards.length;
  let current = 0;
  let visibleCount = window.innerWidth <= 900 ? 1 : 3;
  let maxIndex = total - visibleCount;

  // Build dots
  const dots = [];
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('div');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
    dots.push(dot);
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, maxIndex));
    const cardWidth = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(${-current * cardWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Auto-play
  let auto = setInterval(() => goTo((current + 1) > maxIndex ? 0 : current + 1), 5000);
  track.addEventListener('mouseenter', () => clearInterval(auto));
  track.addEventListener('mouseleave', () => { auto = setInterval(() => goTo((current + 1) > maxIndex ? 0 : current + 1), 5000); });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  window.addEventListener('resize', () => {
    visibleCount = window.innerWidth <= 900 ? 1 : 3;
    maxIndex = Math.max(0, total - visibleCount);
    goTo(Math.min(current, maxIndex));
  });
}

// ─── FLOAT CARD STAGGER ───────────────────────────────
function initFloatCards() {
  // Cards already animate with CSS — just add mouse-follow on hero
  const heroVisual = document.getElementById('heroVisual');
  if (!heroVisual) return;
  heroVisual.addEventListener('mousemove', e => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    heroVisual.style.transform = `perspective(1200px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg)`;
    heroVisual.style.transition = 'transform 0.15s ease';
  });
  heroVisual.addEventListener('mouseleave', () => {
    heroVisual.style.transform = '';
    heroVisual.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
  });
}

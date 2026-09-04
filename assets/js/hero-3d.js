/* ============================================================================
   hero-3d.js - the Three.js scene behind the front page hero
   ----------------------------------------------------------------------------
   The idea: a wireframe object turning slowly, parallaxing against the pointer.
   Something being watched by an instrument, rather than decoration for its own
   sake.
   ----------------------------------------------------------------------------
   Performance rules this file sticks to:
     · low geometry (icosahedron at detail 1 is 42 vertices) and 320 particles
     · pixel ratio capped at 1.5 no matter what the display claims
     · rendering stops when the tab is hidden or the hero scrolls out of view
     · geometry, materials and the renderer are disposed on the way out, and the
       WebGL context is handed back rather than left for the GC
   Three.js arrives via dynamic import. If the CDN is unreachable, or the page
   was opened over file://, a 2D radar scene takes over so the hero is never
   just an empty rectangle.
   ========================================================================= */
(function () {
  'use strict';

  const THREE_URL = 'https://unpkg.com/three@0.169.0/build/three.module.js';
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  // Reduced motion: build nothing at all. An empty hero is the correct answer.
  if (window.__reduceMotion) return;

  /* ---------- Pointer tracking, shared by both scenes -------------------- */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  addEventListener('pointermove', (e) => {
    pointer.tx = (e.clientX / innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  /* ---------- Only draw while it is actually on screen -------------------- */
  function visibilityGate(onChange) {
    let inView = true;
    let tabVisible = !document.hidden;

    const emit = () => onChange(inView && tabVisible);

    new IntersectionObserver(([e]) => { inView = e.isIntersecting; emit(); })
      .observe(canvas);

    document.addEventListener('visibilitychange', () => {
      tabVisible = !document.hidden;
      emit();
    });
  }

  /* ========================================================================
     Fallback scene - 2D canvas
     Concentric rings with a sweep hand. Same mood, almost no CPU.
     ===================================================================== */
  function startFallback() {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0, w = 0, h = 0, t = 0, active = true;

    function resize() {
      // Measured from the hero box, for the same reason as the Three.js path.
      const box = (canvas.parentElement || canvas).getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 1.5);

      w = Math.max(1, Math.round(box.width  || canvas.clientWidth  || 1));
      h = Math.max(1, Math.round(box.height || canvas.clientHeight || 1));

      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function frame() {
      if (!active) return;
      t += 0.006;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      const cx = w * 0.66 + pointer.x * 26;
      const cy = h * 0.5  + pointer.y * 20;
      const R  = Math.min(w, h) * 0.32;

      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;

      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(94,234,212,' + (0.05 + i * 0.025) + ')';
        ctx.ellipse(cx, cy, R * (i / 4), R * (i / 4) * 0.42, t * 0.35, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,180,84,.42)';
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(t * 1.6) * R, cy + Math.sin(t * 1.6) * R * 0.42);
      ctx.stroke();

      for (let i = 0; i < 26; i++) {
        const a = (i / 26) * Math.PI * 2 + t * 0.4;
        const r = R * (0.35 + ((i * 37) % 60) / 100);
        ctx.fillStyle = i % 5 === 0 ? 'rgba(255,180,84,.75)' : 'rgba(94,234,212,.32)';
        ctx.fillRect(cx + Math.cos(a) * r - 1, cy + Math.sin(a) * r * 0.42 - 1, 2, 2);
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    addEventListener('resize', resize, { passive: true });
    frame();

    visibilityGate((visible) => {
      active = visible;
      if (visible) frame(); else cancelAnimationFrame(raf);
    });
  }

  /* ========================================================================
     Main scene - Three.js
     ===================================================================== */
  async function startThree() {
    const THREE = await import(/* webpackIgnore: true */ THREE_URL);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,           // let the CSS background show through
      powerPreference: 'low-power'
    });
    renderer.setClearAlpha(0);

    // Everything hangs off one group, so the whole rig turns as a unit.
    const rig = new THREE.Group();
    scene.add(rig);

    /* --- 1. Shell: wireframe icosahedron, detail 1, so 42 vertices ------- */
    const coreGeo  = new THREE.IcosahedronGeometry(2.35, 1);
    const coreWire = new THREE.WireframeGeometry(coreGeo);
    const coreMat  = new THREE.LineBasicMaterial({
      color: 0x5eead4, transparent: true, opacity: 0.42
    });
    const core = new THREE.LineSegments(coreWire, coreMat);
    rig.add(core);

    /* --- 2. Core: a smaller octahedron to give the middle some weight ---- */
    const innerGeo = new THREE.OctahedronGeometry(0.95, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xffb454, wireframe: true, transparent: true, opacity: 0.55
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    rig.add(inner);

    /* --- 3. Two thin orbits ---------------------------------------------- */
    const ringGeo = new THREE.RingGeometry(3.3, 3.32, 96);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x5eead4, side: THREE.DoubleSide, transparent: true, opacity: 0.22
    });
    const ringA = new THREE.Mesh(ringGeo, ringMat);
    ringA.rotation.set(Math.PI / 2.6, 0, 0);
    const ringB = new THREE.Mesh(ringGeo, ringMat);
    ringB.rotation.set(Math.PI / 2.6, Math.PI / 3, Math.PI / 5);
    ringB.scale.setScalar(1.22);
    rig.add(ringA, ringB);

    /* --- 4. Dust: 320 points in one BufferGeometry ----------------------- */
    const COUNT = 320;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      // Scattered through a shell from radius 4.2 to 7.2, so nothing sits on
      // top of the object in the middle.
      const r = 4.2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.62;
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffb454, size: 0.035, transparent: true, opacity: 0.7, sizeAttenuation: true
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    rig.add(dust);

    /* --- 5. Sizing --------------------------------------------------------
       Measured from the hero element, not from canvas.clientWidth. The canvas
       is sized in percentages and we set its backing store ourselves with
       setSize(..., false), so clientWidth reads 0 while layout settles and the
       scene ends up at the wrong resolution until something re-triggers it. */
    const host = canvas.parentElement || canvas;

    function resize() {
      const box = host.getBoundingClientRect();
      const w = Math.max(1, Math.round(box.width  || canvas.clientWidth  || 1));
      const h = Math.max(1, Math.round(box.height || canvas.clientHeight || 1));

      // 1.5 is the point past which nobody can tell but everything costs double.
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Pull back on narrow screens so the object does not crowd the edges.
      camera.position.z = w < 720 ? 10.5 : 8.4;
      camera.updateProjectionMatrix();
    }

    let ro;
    if ('ResizeObserver' in window) {
      ro = new ResizeObserver(resize);
      ro.observe(host);
    }
    addEventListener('resize', resize, { passive: true });

    resize();
    // Measure again once fonts and images have settled the hero's height.
    // Timeout and load rather than relying on ResizeObserver alone, since RO is
    // delivered as part of the rendering steps and never fires in a tab that is
    // not being painted.
    setTimeout(resize, 0);
    if (document.readyState !== 'complete') {
      addEventListener('load', resize, { once: true });
    }

    /* --- 6. Draw loop ----------------------------------------------------- */
    let raf = 0;
    let running = true;
    let last = performance.now();

    function frame(now) {
      if (!running) return;
      // Seconds, clamped: coming back to a backgrounded tab produces a huge
      // delta that would teleport everything.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      // Parallax eases towards the pointer instead of snapping to it.
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;

      rig.rotation.y += dt * 0.12 + pointer.x * dt * 0.55;
      rig.rotation.x = pointer.y * 0.28;

      inner.rotation.y -= dt * 0.5;
      inner.rotation.x += dt * 0.24;

      ringA.rotation.z += dt * 0.16;
      ringB.rotation.z -= dt * 0.1;

      dust.rotation.y += dt * 0.03;

      // Drifting the camera against the pointer buys depth without more geometry.
      camera.position.x = pointer.x * -0.55;
      camera.position.y = pointer.y * 0.4;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    visibilityGate((visible) => {
      if (visible === running) return;
      running = visible;
      if (visible) {
        last = performance.now();     // reset the clock so nothing jumps
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
      }
    });

    /* --- 7. Give the memory back -----------------------------------------
       Three.js does not free GPU resources for you. Without this, moving back
       and forth between pages grows VRAM until something gives. */
    function destroy() {
      running = false;
      cancelAnimationFrame(raf);
      if (ro) ro.disconnect();

      [coreGeo, coreWire, innerGeo, ringGeo, dustGeo].forEach(g => g.dispose());
      [coreMat, innerMat, ringMat, dustMat].forEach(m => m.dispose());

      scene.clear();
      renderer.dispose();
      const ext = renderer.getContext().getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }

    // pagehide covers closing the tab and navigating away, bfcache included.
    addEventListener('pagehide', destroy, { once: true });
    window.__heroDestroy = destroy;   // page-transitions.js calls this early
  }

  /* ---------- Try the real thing, fall back if it will not load ---------- */
  startThree().catch((err) => {
    console.warn('[hero-3d] Three.js did not load, using the 2D scene:', err && err.message);
    startFallback();
  });
})();

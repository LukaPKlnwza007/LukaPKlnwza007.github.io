/* ============================================================================
   interactions.js - pointer-driven behaviour
   ----------------------------------------------------------------------------
   Two effects, each with a job:

     Magnetic primary action - the main call to action leans toward the cursor
     as it gets close, so the target feels larger than its box. Feedback, not
     decoration.

     Title scramble - a project title resolves out of noise when you point at
     it. This is a portfolio for someone who works on realtime systems; the
     titles behaving like a decoding readout is the one place the theme gets to
     be literal.

   Both are pointer-only and both stand down under reduced motion. Neither
   touches scroll.
   ========================================================================= */
(function () {
  'use strict';

  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!finePointer || window.__reduceMotion) return;

  /* ======================================================================
     1. Magnetic action
     ==================================================================== */
  const MAGNET_RADIUS = 90;   // px beyond the button where the pull begins
  const MAGNET_PULL   = 0.28; // fraction of the offset the button travels

  const magnets = [].map.call(
    document.querySelectorAll('[data-magnet]'),
    el => ({ el, tx: 0, ty: 0, cx: 0, cy: 0 })
  );

  if (magnets.length) {
    let px = 0, py = 0;      // last known pointer position
    let raf = 0;

    // One listener for the whole page, and it only records coordinates. Every
    // layout read happens inside the animation frame below, so moving the mouse
    // can never trigger more than one measurement pass per frame.
    document.addEventListener('pointermove', e => {
      px = e.clientX;
      py = e.clientY;
      if (!raf) raf = requestAnimationFrame(frame);
    }, { passive: true });

    function frame() {
      let moving = false;

      for (const m of magnets) {
        const r = m.el.getBoundingClientRect();
        const dx = px - (r.left + r.width / 2);
        const dy = py - (r.top + r.height / 2);

        const near =
          Math.abs(dx) < r.width / 2 + MAGNET_RADIUS &&
          Math.abs(dy) < r.height / 2 + MAGNET_RADIUS;

        m.tx = near ? dx * MAGNET_PULL : 0;
        m.ty = near ? dy * MAGNET_PULL : 0;

        m.cx += (m.tx - m.cx) * 0.18;
        m.cy += (m.ty - m.cy) * 0.18;

        if (Math.abs(m.tx - m.cx) > 0.05 || Math.abs(m.ty - m.cy) > 0.05) {
          moving = true;
          m.el.style.transform =
            'translate3d(' + m.cx.toFixed(2) + 'px,' + m.cy.toFixed(2) + 'px,0)';
        } else if (m.tx === 0 && m.ty === 0) {
          m.el.style.transform = '';
        }
      }

      // Stop the loop once every magnet has come to rest. A stationary pointer
      // should cost nothing.
      if (moving) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
      }
    }
  }

  /* ======================================================================
     2. Title scramble
     ==================================================================== */
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>[]{}=+*#';
  const STEP_MS = 28;
  const SETTLE_FRAMES = 3;   // steps each character stays scrambled before locking

  function bindScramble(el) {
    const settled = el.textContent;
    let raf = 0;
    let startedAt = 0;

    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      el.textContent = settled;
    }

    // Driven by elapsed time inside requestAnimationFrame rather than by a
    // short setInterval: timers get clamped in background tabs, which would
    // strand a title mid-scramble, and rAF pauses cleanly when the tab is
    // hidden instead of burning ticks nobody sees.
    function tick(now) {
      if (!startedAt) startedAt = now;

      // Characters lock in from the left as time passes.
      const locked = Math.floor((now - startedAt) / (STEP_MS * SETTLE_FRAMES));
      let out = '';

      for (let i = 0; i < settled.length; i++) {
        if (i < locked || settled[i] === ' ') out += settled[i];
        else out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }

      el.textContent = out;

      if (locked >= settled.length) { raf = 0; return; }
      raf = requestAnimationFrame(tick);
    }

    function run() {
      if (raf) return;
      startedAt = 0;
      raf = requestAnimationFrame(tick);
    }

    // The card is the hover target, not the title, so the effect fires from
    // anywhere on the card.
    const host = el.closest('.card') || el;
    host.addEventListener('pointerenter', run);
    host.addEventListener('focusin', run);
    host.addEventListener('pointerleave', stop);
  }

  function scanScramble(root) {
    (root || document).querySelectorAll('.card__title a:not([data-scrambled])')
      .forEach(el => {
        el.setAttribute('data-scrambled', '');
        bindScramble(el);
      });
  }

  scanScramble();
  window.__rescanScramble = scanScramble;
})();

/* ============================================================================
   card-tilt.js - 3D tilt and a spotlight that follows the pointer
   ----------------------------------------------------------------------------
   Applies to anything carrying data-tilt (the project cards on the home page
   and the work index).

   How it stays cheap:
     · the box is measured once on pointerenter, not on every move, so there is
       no layout thrashing mid-gesture
     · the spotlight is a CSS radial-gradient driven by two custom properties;
       JS only writes numbers
     · off entirely on touch devices and when reduced motion is requested
   ========================================================================= */
(function () {
  'use strict';

  const MAX_DEG = 6.5;          // past this it stops reading as depth and starts
                                // reading as a toy
  const PERSPECTIVE = 900;      // px; smaller means a harder bend

  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover || window.__reduceMotion) return;

  /** Wire up one card. Returns a teardown function. */
  function bind(card) {
    let rect = null;
    let raf = 0;
    let nx = 0, ny = 0;         // pointer position normalised to -0.5..0.5

    function apply() {
      raf = 0;
      card.style.transform =
        'perspective(' + PERSPECTIVE + 'px) ' +
        'rotateX(' + (-ny * MAX_DEG).toFixed(2) + 'deg) ' +
        'rotateY(' + (nx * MAX_DEG).toFixed(2) + 'deg) ' +
        'translateZ(0)';
    }

    function onEnter() {
      // Measure once. The card does not move while the pointer is inside it.
      rect = card.getBoundingClientRect();
      card.style.willChange = 'transform';
    }

    function onMove(e) {
      if (!rect) rect = card.getBoundingClientRect();

      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;

      nx = px - 0.5;
      ny = py - 0.5;

      card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--my', (py * 100).toFixed(1) + '%');

      if (!raf) raf = requestAnimationFrame(apply);
    }

    function onLeave() {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      rect = null;
      card.style.transform = '';
      card.style.willChange = '';
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    }

    card.addEventListener('pointerenter', onEnter);
    card.addEventListener('pointermove', onMove, { passive: true });
    card.addEventListener('pointerleave', onLeave);

    // Keyboard users get the spotlight but no tilt, since there is no pointer
    // position to tilt towards.
    card.addEventListener('focusin', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '35%');
    });
    card.addEventListener('focusout', onLeave);

    return function unbind() {
      onLeave();
      card.removeEventListener('pointerenter', onEnter);
      card.removeEventListener('pointermove', onMove);
      card.removeEventListener('pointerleave', onLeave);
    };
  }

  const bound = new WeakSet();

  /** Bind any unbound cards. Safe to call again after rendering more. */
  function scan(root) {
    (root || document).querySelectorAll('[data-tilt]').forEach(card => {
      if (bound.has(card)) return;
      bound.add(card);
      bind(card);
    });
  }

  scan();

  // The work index builds its cards in JS, so it calls this once they exist.
  window.__rescanTilt = scan;
})();

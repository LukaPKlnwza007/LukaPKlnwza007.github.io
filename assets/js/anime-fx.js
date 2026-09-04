/* ============================================================================
   anime-fx.js - the motion that CSS could not do on its own
   ----------------------------------------------------------------------------
   Everything scroll-timed already runs on native scroll-driven CSS animations
   (see animations.css). This file is for the things that need real sequencing
   or a pointer: the hero assembling itself, the cursor, staggered entrances,
   and the photo lightbox.

   Rules it follows, same as the rest of the site:
     · reduced motion means this file does nothing at all
     · anime.js is fetched at runtime, and if that fetch fails the page is
       exactly as usable as before. Nothing here is load-bearing
     · one transform per element. Where two things need to move an element, it
       gets an inner wrapper, the same way the pinned stack and the card tilt
       stay out of each other's way
   ========================================================================= */
(function () {
  'use strict';

  // Pinned, like three in hero-3d.js. A minor version bump should not be able
  // to change how the site moves without me noticing.
  const ANIME_URL = 'https://cdn.jsdelivr.net/npm/animejs@4.5.0/+esm';

  if (window.__reduceMotion) return;

  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* The work index, the skills and the photo gallery are all built by other
     deferred scripts. On a cold cache the import below takes long enough that
     they are always there first; on a warm one it can resolve between two
     script tags, and then this file animates a set of elements that does not
     exist yet and quietly does nothing. Deferred scripts all run before
     DOMContentLoaded, so waiting for it removes the race entirely.

     Note the readyState check. While a deferred script is running the document
     is already "interactive", not "loading", so testing for "loading" here
     resolves straight away and gates nothing at all - which is exactly the bug
     this is here to fix. "complete" is the only state that means
     DOMContentLoaded has already been and gone. */
  const domReady = new Promise((resolve) => {
    if (document.readyState === 'complete') resolve();
    else document.addEventListener('DOMContentLoaded', resolve, { once: true });
  });

  Promise.all([import(/* webpackIgnore: true */ ANIME_URL), domReady])
    .then(([A]) => start(A))
    .catch(() => {
      /* Offline, blocked, or the CDN is having a day. The site does not need it. */
    });

  function start(A) {
    const { animate, createTimeline, stagger, utils, spring, steps } = A;

    // v4.5 wants easing functions passed in, not named in a string, and any of
    // these could move again. Fall back to a plain ease rather than throwing.
    const springy = (opts) => (typeof spring === 'function' ? spring(opts) : 'out(3)');
    const stepped = (n) => (typeof steps === 'function' ? steps(n) : 'linear');

    /**
     * Hold a group at its start values, then run it the first time any of them
     * comes into view.
     *
     * anime has its own scroll observer, and I started with it, but it did not
     * reliably fire for elements that were already on screen when the page
     * loaded - a heading would sit there clipped to nothing. These elements
     * begin invisible, so whatever makes them visible again has to be right
     * every single time. IntersectionObserver is, and the rest of the site
     * already leans on it.
     *
     * Creating the animation paused applies the start values on the spot, so
     * there is no frame where the finished state flashes first.
     */
    function reveal(selector, params) {
      const els = utils.$(selector);
      if (!els.length) return;

      const anim = animate(els, Object.assign({ autoplay: false }, params));

      const io = new IntersectionObserver((entries) => {
        if (!entries.some(e => e.isIntersecting)) return;
        io.disconnect();
        anim.play();
      }, { rootMargin: '0px 0px -6% 0px' });

      els.forEach(el => io.observe(el));
    }

    /* ====================================================================
       1. Hero. The name assembles, then the instrument panels arrive.
       ================================================================== */
    function hero() {
      const title = document.querySelector('.hero__title');
      if (!title) return;

      const glitch = title.querySelector('.glitch');
      const surname = title.querySelector('em');
      const chars = surname ? splitChars(surname) : [];

      const tl = createTimeline({
        defaults: { duration: 900, ease: 'out(3)' }
      });

      if (glitch) {
        tl.add(glitch, { opacity: [0, 1], y: [26, 0], filter: ['blur(10px)', 'blur(0px)'] }, 0);
      }

      if (chars.length) {
        tl.add(chars, {
          opacity: [0, 1],
          y: [34, 0],
          rotate: [-8, 0],
          duration: 720,
          delay: stagger(38)
        }, 180);
      }

      tl.add('.hero .lede', { opacity: [0, 1], y: [16, 0] }, 520)
        .add('.hero__actions .btn', { opacity: [0, 1], y: [14, 0], delay: stagger(90) }, 640)
        .add('.hero__hud .panel', { opacity: [0, 1], x: [34, 0], delay: stagger(120) }, 400)
        .add('.hero .eyebrow', { opacity: [0, 1] }, 120);

      tl.pause();

      // The boot screen owns the first second and a half of the page. Waiting
      // for it means the name is not already sitting there when the veil lifts.
      const boot = document.querySelector('[data-boot]');
      if (boot && !boot.classList.contains('is-done')) {
        document.addEventListener('boot:done', () => tl.play(), { once: true });
        setTimeout(() => tl.play(), 2600);        // in case the event never comes
      } else {
        tl.play();
      }
    }

    /** One span per character, with the whole word left intact for a reader. */
    function splitChars(el) {
      const value = el.textContent;
      el.textContent = '';

      const label = document.createElement('span');
      label.className = 'visually-hidden';
      label.textContent = value;
      el.appendChild(label);

      const shell = document.createElement('span');
      shell.setAttribute('aria-hidden', 'true');

      const out = [];
      for (const ch of value) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? ' ' : ch;
        shell.appendChild(span);
        out.push(span);
      }

      el.appendChild(shell);
      return out;
    }

    /* ====================================================================
       2. Entrances that need a stagger rather than a single fade
       ================================================================== */
    function entrances() {
      reveal('.work-index__item', {
        opacity: [0, 1],
        x: [-28, 0],
        duration: 620,
        ease: 'out(3)',
        delay: stagger(55)
      });

      reveal('.skill', {
        opacity: [0, 1],
        scale: [0.86, 1],
        duration: 560,
        ease: springy({ stiffness: 120, damping: 12 }),
        delay: stagger(45)
      });

      reveal('.photo', {
        opacity: [0, 1],
        y: [26, 0],
        duration: 700,
        ease: 'out(3)',
        delay: stagger(70)
      });

      // The mono command labels type themselves in, terminal style.
      reveal('.eyebrow--cmd', {
        clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
        duration: 700,
        ease: stepped(22)
      });
    }

    /* ====================================================================
       3. Cursor
       The outer element carries position, written by the rAF loop below.
       The inner element carries scale, written by anime. Two elements so the
       two transforms never overwrite each other.
       ================================================================== */
    function cursor() {
      if (!finePointer) return;

      const root = document.createElement('div');
      root.className = 'cursor';
      root.setAttribute('aria-hidden', 'true');
      root.innerHTML =
        '<span class="cursor__ring"><i class="cursor__sweep"></i></span>' +
        '<span class="cursor__dot"></span>';
      document.body.appendChild(root);

      const ring = root.querySelector('.cursor__ring');

      let tx = innerWidth / 2, ty = innerHeight / 2;   // where the pointer is
      let hot = false;                                 // over something clickable
      let cx = tx, cy = ty;                            // where the ring is
      let running = false;
      let awake = 0;

      function frame() {
        // Trailing, not glued to the pointer: the lag is what makes it read as
        // an instrument rather than a second mouse arrow.
        cx += (tx - cx) * 0.18;
        cy += (ty - cy) * 0.18;
        root.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';

        const settled = Math.abs(tx - cx) < 0.1 && Math.abs(ty - cy) < 0.1;
        if (settled && performance.now() > awake) { running = false; return; }
        requestAnimationFrame(frame);
      }

      function wake() {
        awake = performance.now() + 120;
        if (running) return;
        running = true;
        requestAnimationFrame(frame);
      }

      addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        tx = e.clientX;
        ty = e.clientY;
        if (!root.classList.contains('is-live')) {
          root.classList.add('is-live');
          animate(root, { opacity: [0, 1], duration: 300, ease: 'out(2)' });
        }
        wake();
      }, { passive: true });

      addEventListener('pointerdown', () => {
        animate(ring, { scale: 0.72, duration: 180, ease: 'out(3)' });
      }, { passive: true });

      addEventListener('pointerup', () => {
        animate(ring, { scale: hot ? 1.9 : 1, duration: 320, ease: 'out(3)' });
      }, { passive: true });

      // Over anything clickable the ring opens up and turns amber.
      const TARGETS = 'a, button, .card, [data-magnet], input, textarea, .photo';

      addEventListener('pointerover', (e) => {
        const over = !!(e.target.closest && e.target.closest(TARGETS));
        if (over === hot) return;
        hot = over;
        root.classList.toggle('is-hot', hot);
        animate(ring, {
          scale: hot ? 1.9 : 1,
          duration: 420,
          ease: springy({ stiffness: 140, damping: 14 })
        });
      }, { passive: true });

      // Leaving the window entirely: take the ring with it.
      addEventListener('pointerout', (e) => {
        if (e.relatedTarget) return;
        animate(root, { opacity: 0, duration: 200 });
        root.classList.remove('is-live');
      }, { passive: true });
    }

    /* ====================================================================
       4. Lightbox for the photos on a project page
       ================================================================== */
    function lightbox() {
      const photos = utils.$('.photo');
      if (!photos.length) return;

      const box = document.createElement('div');
      box.className = 'lightbox';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      box.setAttribute('aria-label', 'Photo');
      box.hidden = true;
      box.innerHTML =
        '<button class="lightbox__close" type="button" aria-label="Close photo">&times;</button>' +
        '<figure class="lightbox__figure">' +
          '<img alt="" decoding="async">' +
          '<figcaption></figcaption>' +
        '</figure>';
      document.body.appendChild(box);

      const figure = box.querySelector('.lightbox__figure');
      const img    = box.querySelector('img');
      const cap    = box.querySelector('figcaption');
      const close  = box.querySelector('.lightbox__close');
      let opener = null;
      let hideTimer = 0;

      photos.forEach(photo => {
        const thumb = photo.querySelector('img');
        if (!thumb) return;

        // A real button, so the photo is reachable by keyboard and announces
        // itself as something you can activate.
        photo.setAttribute('tabindex', '0');
        photo.setAttribute('role', 'button');
        photo.setAttribute('aria-label', 'Open photo: ' + (thumb.alt || 'photo'));

        const open = () => show(photo, thumb);
        photo.addEventListener('click', open);
        photo.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
        });
      });

      function show(photo, thumb) {
        clearTimeout(hideTimer);
        opener = photo;
        img.src = thumb.currentSrc || thumb.src;
        img.alt = thumb.alt || '';
        const caption = photo.querySelector('figcaption');
        cap.textContent = caption ? caption.textContent : '';

        box.hidden = false;
        document.body.style.overflow = 'hidden';
        close.focus();

        // Grow out of roughly where the thumbnail is, so the photo feels like
        // it was picked up rather than dropped in from nowhere.
        const from = thumb.getBoundingClientRect();
        const scale = Math.max(0.35, Math.min(from.width / innerWidth, 0.9));

        animate(box, { opacity: [0, 1], duration: 260, ease: 'out(2)' });
        animate(figure, {
          opacity: [0, 1],
          scale: [scale, 1],
          y: [from.top + from.height / 2 - innerHeight / 2, 0],
          duration: 620,
          ease: 'out(4)'
        });
      }

      function hide() {
        if (box.hidden) return;

        // Give the page back first. Scroll lock and focus are the two things
        // that make the page unusable if they are missed, so they do not get to
        // depend on an animation finishing - a backgrounded tab does not run
        // frames, and "you cannot scroll any more" is not an acceptable way for
        // a fade-out to fail.
        document.body.style.overflow = '';
        if (opener) opener.focus();

        animate(figure, { opacity: 0, scale: 0.94, duration: 220, ease: 'in(2)' });
        animate(box, { opacity: 0, duration: 260 });

        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => { box.hidden = true; }, 300);
      }

      close.addEventListener('click', hide);
      box.addEventListener('click', (e) => { if (e.target === box) hide(); });
      addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !box.hidden) hide();
        // Nothing behind the dialog should be tabbable while it is open, and
        // there is exactly one control in it, so Tab just stays put.
        if (e.key === 'Tab' && !box.hidden) { e.preventDefault(); close.focus(); }
      });
    }

    hero();
    entrances();
    cursor();
    lightbox();
  }
})();

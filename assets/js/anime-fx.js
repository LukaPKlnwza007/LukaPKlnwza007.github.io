/* ============================================================================
   anime-fx.js - the motion that CSS could not do on its own
   ----------------------------------------------------------------------------
   Scroll-scrubbed motion stays in animations.css, where native scroll-driven
   CSS animations do it on the compositor for free. This file is for the parts
   that need sequencing, depth or a pointer:

     · the hero building itself out of the screen, letter by letter
     · project cards dealt in on an angle
     · the cursor
     · photos that tilt under the pointer, and open in 3D

   Rules it follows, same as the rest of the site:
     · reduced motion means this file does nothing at all
     · anime.js is vendored, not fetched from a CDN, but it is still loaded as
       a module and the page is fully usable if that fails
     · one transform per element. Where two things want to move the same box,
       the inner one gets a wrapper - the same reason the pinned stack and the
       card tilt do not collide
   ========================================================================= */
(function () {
  'use strict';

  // In the repo, not on someone else's server: npm installs it, npm run vendor
  // copies it to assets/vendor/, and that copy is committed.
  //
  // Resolved against this file rather than the page. import() inside a classic
  // script uses the script's own URL as its base, not the document's, so a
  // plain './assets/vendor/...' here asks for assets/js/assets/vendor/... and
  // 404s. currentScript is only readable during synchronous execution, which
  // is where this runs.
  const HERE = document.currentScript ? document.currentScript.src : location.href;
  const ANIME_URL = new URL('../vendor/anime.esm.js', HERE).href;

  if (window.__reduceMotion) return;

  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* The work index, the skills, the project grid and the photo gallery are all
     built by other deferred scripts. On a cold cache the import below takes
     long enough that they are always there first; on a warm one it can resolve
     between two script tags, and then this file animates a set of elements
     that does not exist yet and quietly does nothing.

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
      /* Nothing here is load-bearing. Without it the page is just quieter. */
    });

  function start(A) {
    const { animate, createTimeline, stagger, utils, spring, steps, createAnimatable } = A;

    // v4.5 wants easing functions passed in rather than named in a string, and
    // these could move again. Fall back rather than throw.
    const springy = (o) => (typeof spring === 'function' ? spring(o) : 'out(3)');
    const stepped = (n) => (typeof steps === 'function' ? steps(n) : 'linear');

    // Lets CSS hand an effect over: anything the stylesheet does as a fallback
    // can switch itself off once this file is actually running.
    document.documentElement.classList.add('js-anime');

    /**
     * Hold a group at its start values, then run it the first time any of them
     * comes into view.
     *
     * anime has its own scroll observer, and I started with it, but it did not
     * reliably fire for elements already on screen at load - a heading sat
     * there clipped to nothing. These elements begin invisible, so whatever
     * makes them visible again has to be right every single time.
     *
     * Creating the animation paused applies the start values on the spot, so
     * there is no frame where the finished state flashes first.
     */
    function reveal(selector, params) {
      const els = utils.$(selector);
      if (!els.length) return;

      // Never let the CSS reveal and this own the same box. Whichever ran
      // second would win a fight over opacity and transform, and which one
      // that is would depend on load order.
      els.forEach(el => {
        el.removeAttribute('data-reveal');
        el.classList.remove('is-in');
      });

      const anim = animate(els, Object.assign({ autoplay: false }, params));

      const io = new IntersectionObserver((entries) => {
        if (!entries.some(e => e.isIntersecting)) return;
        io.disconnect();
        anim.play();
      }, { rootMargin: '0px 0px -6% 0px' });

      els.forEach(el => io.observe(el));
    }

    /* ====================================================================
       1. Hero
       The name is built out of the screen: every letter starts face-down and
       a long way back, then swings up into place. The panels arrive last, on
       an angle, like something being handed to you.
       ================================================================== */
    function hero() {
      const title = document.querySelector('.hero__title');
      if (!title) return;

      const groups = [];

      // The glitch copies are pseudo-elements filled from data-text, so while
      // the letters are still flying in they would sit there spelling the whole
      // word out. Empty the attribute for the duration, put it back after.
      const glitch = title.querySelector('.glitch');
      let glitchText = null;
      if (glitch) {
        glitchText = glitch.getAttribute('data-text');
        glitch.setAttribute('data-text', '');
        groups.push(splitChars(glitch));
      }

      const surname = title.querySelector('em');
      if (surname) groups.push(splitChars(surname));

      const tl = createTimeline({ defaults: { duration: 900, ease: 'out(3)' } });

      groups.forEach((chars, line) => {
        if (!chars.length) return;
        tl.add(chars, {
          opacity: [0, 1],
          rotateX: [-96, 0],
          z: [-320, 0],
          y: [46, 0],
          duration: 1100,
          ease: 'out(4)',
          delay: stagger(42)
        }, line * 260);
      });

      tl.add('.hero .eyebrow', { opacity: [0, 1], x: [-14, 0] }, 60)
        .add('.hero .lede', { opacity: [0, 1], y: [18, 0] }, 900)
        .add('.hero__actions .btn', {
          opacity: [0, 1],
          y: [18, 0],
          rotateX: [-40, 0],
          delay: stagger(110)
        }, 1040)
        .add('.hero__hud .panel', {
          opacity: [0, 1],
          x: [70, 0],
          rotateY: [-26, 0],
          z: [-140, 0],
          duration: 1100,
          ease: 'out(4)',
          delay: stagger(160)
        }, 620)
        .add('.nav__links > *', { opacity: [0, 1], y: [-10, 0], delay: stagger(60) }, 300);

      if (glitch && glitchText !== null) {
        const restore = () => glitch.setAttribute('data-text', glitchText);
        tl.call(restore);
        // Backstop. A timeline that never reaches its end - the tab was hidden
        // the whole time, say - would otherwise leave the glitch switched off
        // for good, and the attribute is not worth that risk.
        setTimeout(restore, 6000);
      }

      tl.pause();

      // The boot screen owns the first second and a half. Waiting for it means
      // the name is not already sitting there when the screen lifts.
      const boot = document.querySelector('[data-boot]');
      if (boot && !boot.classList.contains('is-done')) {
        document.addEventListener('boot:done', () => tl.play(), { once: true });
        setTimeout(() => tl.play(), 2600);      // if the event never comes
      } else {
        tl.play();
      }
    }

    /**
     * Split into what a reader would call letters, not into code points.
     *
     * Thai is the case that matters here: โลไธสงค์ has vowels and a tone mark
     * that live on top of the consonant before them. Iterating the string
     * with for..of hands those back as separate characters, and each one ends
     * up in its own span, floating on its own, spelling nothing. The boot
     * screen in main.js already had to solve this; same fix.
     */
    function graphemes(word) {
      if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const locale = document.documentElement.lang || 'en';
        return Array.from(
          new Intl.Segmenter(locale, { granularity: 'grapheme' }).segment(word),
          seg => seg.segment
        );
      }
      return Array.from(word);
    }

    /** One span per letter, with the word left whole for a screen reader. */
    function splitChars(el) {
      const value = el.textContent;
      el.textContent = '';

      const label = document.createElement('span');
      label.className = 'visually-hidden';
      label.textContent = value;
      el.appendChild(label);

      // Perspective has to sit on the direct parent of the things being
      // rotated, so the shell carries it rather than the heading.
      const shell = document.createElement('span');
      shell.className = 'char-shell';
      shell.setAttribute('aria-hidden', 'true');

      const out = [];
      for (const ch of graphemes(value)) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? ' ' : ch;
        shell.appendChild(span);
        out.push(span);
      }

      el.appendChild(shell);
      return out;
    }

    /* ====================================================================
       2. Entrances
       ================================================================== */
    function entrances() {
      // Project cards, dealt onto the table rather than faded in.
      reveal('.card-grid .filter-item', {
        opacity: [0, 1],
        rotateY: [-34, 0],
        rotateX: [12, 0],
        z: [-320, 0],
        y: [40, 0],
        duration: 1000,
        ease: 'out(4)',
        delay: stagger(110)
      });

      // The work index reads as a stack of cards being flipped face up.
      reveal('.work-index__item', {
        opacity: [0, 1],
        rotateX: [-72, 0],
        z: [-160, 0],
        duration: 720,
        ease: 'out(4)',
        delay: stagger(70)
      });

      reveal('.skill', {
        opacity: [0, 1],
        scale: [0.86, 1],
        rotateX: [-50, 0],
        duration: 560,
        ease: springy({ stiffness: 120, damping: 12 }),
        delay: stagger(45)
      });

      reveal('.photo', {
        opacity: [0, 1],
        y: [40, 0],
        rotateX: [16, 0],
        z: [-180, 0],
        duration: 820,
        ease: 'out(4)',
        delay: stagger(90)
      });

      reveal('.tl-item', {
        opacity: [0, 1],
        x: [-30, 0],
        rotateY: [14, 0],
        duration: 700,
        ease: 'out(3)',
        delay: stagger(80)
      });

      // The mono command labels type themselves in, terminal style.
      reveal('.eyebrow--cmd', {
        clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
        duration: 700,
        ease: stepped(22)
      });
    }

    /* ====================================================================
       3. Photos that lean toward the pointer
       createAnimatable keeps one live animation per property and lets the
       pointer push values into it, instead of starting a new animation on
       every mousemove.
       ================================================================== */
    function photoTilt() {
      if (!finePointer || typeof createAnimatable !== 'function') return;

      utils.$('.photo').forEach(photo => {
        const inner = photo.querySelector('img');
        if (!inner) return;

        const tilt = createAnimatable(inner, {
          rotateX: { duration: 420, ease: 'out(3)' },
          rotateY: { duration: 420, ease: 'out(3)' },
          scale:   { duration: 420, ease: 'out(3)' }
        });

        photo.addEventListener('pointermove', (e) => {
          const r = photo.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          tilt.rotateY(px * 16);
          tilt.rotateX(-py * 16);
          tilt.scale(1.04);
        });

        photo.addEventListener('pointerleave', () => {
          tilt.rotateX(0);
          tilt.rotateY(0);
          tilt.scale(1);
        });
      });
    }

    /* ====================================================================
       4. Cursor
       The outer element carries position, the inner one carries scale. Two
       elements, because one transform cannot be written by two things.
       ================================================================== */
    function cursor() {
      if (!finePointer || typeof createAnimatable !== 'function') return;

      const root = document.createElement('div');
      root.className = 'cursor';
      root.setAttribute('aria-hidden', 'true');
      root.innerHTML =
        '<span class="cursor__ring"><i class="cursor__sweep"></i></span>' +
        '<span class="cursor__dot"></span>';
      document.body.appendChild(root);

      const ring = root.querySelector('.cursor__ring');
      let hot = false;

      // Trailing, not glued to the pointer: the lag is what makes it read as
      // an instrument rather than a second mouse arrow.
      const pos = createAnimatable(root, {
        x: { duration: 380, ease: 'out(3)' },
        y: { duration: 380, ease: 'out(3)' }
      });

      addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        pos.x(e.clientX);
        pos.y(e.clientY);
        if (!root.classList.contains('is-live')) {
          root.classList.add('is-live');
          animate(root, { opacity: [0, 1], duration: 300, ease: 'out(2)' });
        }
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

      addEventListener('pointerout', (e) => {
        if (e.relatedTarget) return;              // left the window entirely
        animate(root, { opacity: 0, duration: 200 });
        root.classList.remove('is-live');
      }, { passive: true });
    }

    /* ====================================================================
       5. Lightbox for the photos on a project page
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

        // Swings up out of roughly where the thumbnail was, so the photo feels
        // picked up rather than dropped in from nowhere.
        const from = thumb.getBoundingClientRect();
        const scale = Math.max(0.35, Math.min(from.width / innerWidth, 0.9));

        animate(box, { opacity: [0, 1], duration: 260, ease: 'out(2)' });
        animate(figure, {
          opacity: [0, 1],
          scale: [scale, 1],
          rotateX: [22, 0],
          z: [-420, 0],
          y: [from.top + from.height / 2 - innerHeight / 2, 0],
          duration: 760,
          ease: 'out(4)'
        });
      }

      function hide() {
        if (box.hidden) return;

        // Give the page back first. Scroll lock and focus are the two things
        // that make the page unusable if they are missed, so they do not get
        // to depend on an animation finishing - a backgrounded tab does not
        // run frames, and "you cannot scroll any more" is not an acceptable
        // way for a fade-out to fail.
        document.body.style.overflow = '';
        if (opener) opener.focus();

        animate(figure, { opacity: 0, scale: 0.94, rotateX: 14, duration: 220, ease: 'in(2)' });
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
    photoTilt();
    cursor();
    lightbox();
  }
})();

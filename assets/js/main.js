/* ============================================================================
   main.js - the behaviour every page shares
     · mobile menu and the navbar's scrolled state
     · scroll reveal, via one IntersectionObserver
     · data-bind, data-mailto and data-year substitution
     · the boot screen
   Must load after data.js.
   ========================================================================= */
(function () {
  'use strict';

  const D = window.PORTFOLIO;

  /* Read the motion preference once and publish it, so the other scripts do not
     each have to run their own matchMedia. */
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  window.__reduceMotion = motionQuery.matches;
  motionQuery.addEventListener('change', e => { window.__reduceMotion = e.matches; });

  /* ------------------------------------------------------------------------
     1. Navbar
     --------------------------------------------------------------------- */
  function initNav() {
    const nav = document.querySelector('[data-nav]');
    if (!nav) return;

    const toggle = nav.querySelector('[data-nav-toggle]');
    const links  = nav.querySelector('[data-nav-links]');

    // Mark the current page with aria-current, not just a class.
    const here = location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('.nav__link').forEach(a => {
      const target = a.getAttribute('href');
      if (target === here || (here === '' && target === 'index.html')) {
        a.setAttribute('aria-current', 'page');
      }
    });

    if (toggle && links) {
      toggle.addEventListener('click', () => {
        const open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        links.classList.toggle('is-open', !open);
      });

      // Escape closes it and puts focus back on the button, which matters if you
      // are navigating by keyboard.
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
          toggle.setAttribute('aria-expanded', 'false');
          links.classList.remove('is-open');
          toggle.focus();
        }
      });

      // Close it automatically once the window is wide enough for the inline menu.
      window.matchMedia('(min-width: 861px)').addEventListener('change', e => {
        if (e.matches) {
          toggle.setAttribute('aria-expanded', 'false');
          links.classList.remove('is-open');
        }
      });
    }

    // A sentinel plus IntersectionObserver instead of a scroll listener, so
    // nothing runs on the main thread while scrolling.
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:24px;height:1px;width:1px;pointer-events:none;';
    document.body.prepend(sentinel);

    new IntersectionObserver(
      ([entry]) => nav.classList.toggle('is-stuck', !entry.isIntersecting)
    ).observe(sentinel);
  }

  /* ------------------------------------------------------------------------
     3. Scroll reveal
     One observer for everything, and each element is unobserved the moment it
     shows, so nothing accumulates.
     --------------------------------------------------------------------- */
  function initReveal() {
    const reduce = window.__reduceMotion;

    // Where the browser supports scroll-driven animations, animations.css owns
    // the reveal completely and an observer would be duplicated work. Expose
    // no-op hooks so the page scripts can keep calling them unconditionally.
    const cssDrivesReveal = window.CSS && CSS.supports &&
      CSS.supports('animation-timeline', 'view()');

    if (cssDrivesReveal) {
      window.__revealScan  = function () {};
      window.__revealSweep = function () {};
      return;
    }

    const io = reduce ? null : new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Reveal on entry, or if the element is already above the viewport.
        // The second case happens on a reload that restores scroll position, or
        // an #anchor link: those elements never intersect again, and without
        // this they would stay invisible for good.
        const passed = entry.boundingClientRect.bottom < 0;
        if (!entry.isIntersecting && !passed) return;

        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    const seen = new WeakSet();

    /**
     * Register [data-reveal] elements with the observer. Safe to call again
     * after rendering more: most of this site's content is built from data.js
     * after main.js has already run, and unregistered cards would sit at
     * opacity 0 forever.
     */
    function scan(root) {
      const items = (root || document).querySelectorAll('[data-reveal]');

      if (reduce) {
        items.forEach(el => el.classList.add('is-in'));
        return;
      }

      items.forEach((el, i) => {
        if (seen.has(el)) return;
        seen.add(el);

        // Stagger within a group, capped so it never feels sluggish.
        if (el.dataset.revealStagger !== undefined) {
          el.style.setProperty('--reveal-delay', Math.min(i * 70, 240) + 'ms');
        }
        io.observe(el);
      });
    }

    /**
     * Reveal everything from the top of the document down to the current
     * viewport bottom.
     *
     * IntersectionObserver only reports state *changes*. If the scroll position
     * jumps over an element (restored position on reload, or an #anchor), it is
     * "not intersecting" before and after, so no callback ever arrives and the
     * element stays hidden permanently.
     */
    function sweep() {
      if (reduce) return;
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(el => {
        if (el.getBoundingClientRect().top < innerHeight) {
          el.classList.add('is-in');
          io.unobserve(el);
        }
      });
    }

    scan();

    // Sweep after load, because scroll restoration happens after deferred scripts.
    if (document.readyState === 'complete') sweep();
    else addEventListener('load', sweep, { once: true });

    addEventListener('hashchange', sweep);

    window.__revealScan = scan;
    window.__revealSweep = sweep;
  }

  /* ------------------------------------------------------------------------
     5. Filling in values from data.js
     data-bind="path.to.value" saves repeating selectors on every page.
     --------------------------------------------------------------------- */
  function initBindings() {
    if (!D) return;

    document.querySelectorAll('[data-bind]').forEach(el => {
      const value = el.dataset.bind
        .split('.')
        .reduce((obj, key) => (obj == null ? obj : obj[key]), D);
      if (value == null) return;
      el.textContent = value;
      // The glitch effect draws its two coloured copies from data-text. If the
      // element's words just changed - a different language, say - the copies
      // have to change with them or they spell the old one.
      if (el.hasAttribute('data-text')) el.setAttribute('data-text', value);
    });

    document.querySelectorAll('[data-mailto]').forEach(a => {
      a.href = 'mailto:' + D.identity.email;
      if (!a.textContent.trim()) a.textContent = D.identity.email;
    });

    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ------------------------------------------------------------------------
     6. Boot screen
     On every page, so someone landing on a deep link gets the same entrance,
     but it plays once per session - clicking around should not mean waiting
     over and over.

     It lifts when all three are true:
       · MIN_MS has passed, or the name animation gets cut off mid-word
       · the load event has fired, so the progress is not purely theatre
       · MAX_MS as a hard stop, because a slow CDN is not the visitor's problem
     --------------------------------------------------------------------- */
  function initBoot() {
    const boot = document.querySelector('[data-boot]');
    if (!boot) return;

    const MIN_MS = 1150;
    const MAX_MS = 2000;

    let settled = false;

    function finish() {
      if (settled) return;
      settled = true;

      try { sessionStorage.setItem('boot-seen', '1'); } catch (_) {}

      // anime-fx.js holds the hero entrance until the screen starts lifting,
      // so the name is not already sitting there when it does.
      document.dispatchEvent(new CustomEvent('boot:done'));

      boot.classList.add('is-done');
      boot.addEventListener('transitionend', () => boot.remove(), { once: true });
      // In case transitionend never fires, e.g. the tab was hidden throughout.
      setTimeout(() => { if (boot.isConnected) boot.remove(); }, 900);
    }

    let seen = false;
    try { seen = sessionStorage.getItem('boot-seen') === '1'; } catch (_) { /* private mode */ }

    if (seen || window.__reduceMotion) { finish(); return; }

    // Nobody should be held on a splash screen. Any click or key lifts it, and
    // the hint below says so, because an escape hatch nobody can see is not one.
    boot.addEventListener('click', finish);
    addEventListener('keydown', finish, { once: true });

    const skipEl = document.createElement('p');
    skipEl.className = 'boot__skip';
    skipEl.textContent = 'click or press any key to skip';
    boot.appendChild(skipEl);

    const logEl  = boot.querySelector('[data-boot-log]');
    const barEl  = boot.querySelector('[data-boot-bar]');
    const pctEl  = boot.querySelector('[data-boot-pct]');
    const markEl = boot.querySelector('[data-boot-mark]');
    const subEl  = boot.querySelector('[data-boot-sub]');

    const lines = [
      'mount /dev/portfolio',
      'seed prng 0x4f2a',
      'link uplink :443',
      'warm shader cache',
      'ok'
    ];
    const started = performance.now();

    /* --- The name, one grapheme at a time -------------------------------
       Intl.Segmenter rather than split(''), so this still holds up if the name
       is written in a script with combining marks. Thai is the case I care
       about: split('') turns a syllable into loose floating pieces. */
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

    let lastDelay = 0;

    if (markEl && D) {
      const text  = String(D.identity.name || '').trim();
      const words = text.split(/\s+/).filter(Boolean);
      const total = words.reduce((n, w) => n + graphemes(w).length, 0) || 1;

      // Spread the stagger so the last letter starts within 45% of MIN_MS and
      // the whole run finishes before the screen lifts.
      const stagger = Math.min(46, (MIN_MS * 0.45) / total);

      let n = 0;
      words.forEach(word => {
        const wordEl = document.createElement('span');
        wordEl.className = 'boot__word';

        graphemes(word).forEach(ch => {
          const letter = document.createElement('span');
          letter.className = 'boot__letter';
          letter.textContent = ch;
          letter.style.setProperty('--d', Math.round(n * stagger) + 'ms');
          wordEl.appendChild(letter);
          n++;
        });

        markEl.appendChild(wordEl);
      });

      lastDelay = Math.round(n * stagger);
    }

    if (subEl && D) {
      subEl.textContent = D.identity.roleShort || D.identity.role || '';
      subEl.style.setProperty('--d', (lastDelay + 120) + 'ms');
    }

    /* --- Log lines and the bar, paced to land together at MIN_MS --------- */
    let i = 0;
    const timer = setInterval(() => {
      if (logEl) {
        const line = document.createElement('div');
        const mark = document.createElement('b');
        mark.textContent = '>';
        line.append(mark, ' ' + lines[i]);
        logEl.appendChild(line);
      }
      i++;

      const pct = Math.round((i / lines.length) * 100);
      if (barEl) barEl.style.right = (100 - pct) + '%';
      if (pctEl) pctEl.textContent = String(pct).padStart(3, '0') + '%';

      if (i >= lines.length) clearInterval(timer);
    }, MIN_MS / lines.length);

    function closeWhenReady() {
      const left = MIN_MS - (performance.now() - started);
      if (left > 0) setTimeout(finish, left);
      else finish();
    }

    if (document.readyState === 'complete') closeWhenReady();
    else addEventListener('load', closeWhenReady, { once: true });

    setTimeout(finish, MAX_MS);
  }

  /* ------------------------------------------------------------------------
     Go. Everything is deferred, so the DOM is already parsed.
     --------------------------------------------------------------------- */
  initBindings();
  initNav();
  initReveal();
  initBoot();
})();

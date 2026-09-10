/* ============================================================================
   projects-filter.js - builds the work grid and filters it without a reload
   ----------------------------------------------------------------------------
   Filter timing, which is most of what makes it feel smooth:
     1) cards that no longer match get .is-hidden and shrink away
     2) 240ms later they get the hidden attribute, so the transition finishes
        before they leave the layout
     3) coming back is the reverse: drop hidden, force one reflow, drop the class
   The active filter is mirrored into the query string so a filtered view can be
   linked to.
   ========================================================================= */
(function () {
  'use strict';

  const D  = window.PORTFOLIO;
  const UI = window.UI;
  const T  = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);
  if (!D || !UI) return;

  const grid    = document.querySelector('[data-project-grid]');
  const bar     = document.querySelector('[data-filter-bar]');
  const countEl = document.querySelector('[data-filter-count]');
  const emptyEl = document.querySelector('[data-filter-empty]');
  if (!grid) return;

  const EXIT_MS = 240;   // must match .filter-item's transition in animations.css

  /* ---------- 1. Build every card ---------------------------------------- */
  const items = D.projects.map((project, i) => {
    const card = UI.projectCard(project, i, { eager: i < 3 });

    // The wrapper handles reveal and filtering, the card inside handles tilt.
    // Separate elements, because transform does not stack.
    const wrap = UI.el('div', {
      class: 'filter-item',
      // Target for the home page's work index: projects.html#work-<id>
      id: 'work-' + project.id,
      dataset: {
        reveal: '',
        revealStagger: '',
        category: project.category,
        tags: project.tags.join('|').toLowerCase()
      }
    }, [card]);

    grid.appendChild(wrap);
    return wrap;
  });

  // The shared scripts scanned the document before this grid existed.
  if (typeof window.__rescanTilt === 'function') window.__rescanTilt(grid);
  if (typeof window.__revealScan === 'function') window.__revealScan(grid);
  if (typeof window.__rescanScramble === 'function') window.__rescanScramble(grid);

  /* ---------- 2. Buttons, but only for categories in use ----------------- */
  const used = new Set(D.projects.map(p => p.category));
  const filters = [{ key: 'all', label: D.categories.all }].concat(
    Object.keys(D.categories)
      .filter(key => key !== 'all' && used.has(key))
      .map(key => ({ key, label: D.categories[key] }))
  );

  const chips = filters.map(filter => {
    const chip = UI.el('button', {
      class: 'chip chip--btn',
      type: 'button',
      'aria-pressed': 'false',
      dataset: { key: filter.key },
      text: filter.label,
      onclick: () => setFilter(filter.key)
    });
    if (bar) bar.appendChild(chip);
    return chip;
  });

  /* ---------- 3. Filtering ------------------------------------------------ */
  function matches(wrap, key) {
    if (key === 'all') return true;
    if (wrap.dataset.category === key) return true;
    // Also allow a tag to be used as a filter key, for links from elsewhere.
    return wrap.dataset.tags.split('|').indexOf(key.toLowerCase()) !== -1;
  }

  function setFilter(key, options) {
    chips.forEach(chip => {
      chip.setAttribute('aria-pressed', String(chip.dataset.key === key));
    });

    let shown = 0;

    items.forEach(wrap => {
      const ok = matches(wrap, key);
      if (ok) shown++;

      if (ok) {
        // Drop hidden, force one reflow so the browser has a start state for the
        // transition, then drop the class. A reflow rather than rAF, because rAF
        // is paused in a background tab and the cards would stay faded out until
        // the visitor came back to it.
        wrap.hidden = false;
        void wrap.offsetWidth;
        wrap.classList.remove('is-hidden');
      } else {
        wrap.classList.add('is-hidden');
        setTimeout(() => {
          // Re-check: the visitor may have switched filters back while we waited.
          if (wrap.classList.contains('is-hidden')) wrap.hidden = true;
        }, EXIT_MS);
      }
    });

    if (countEl) {
      countEl.textContent = T('work.showing', { n: shown, total: items.length });
    }
    if (emptyEl) emptyEl.classList.toggle('is-shown', shown === 0);

    // Mirror into the URL without adding history entries.
    if (!options || !options.silent) {
      const url = new URL(location.href);
      if (key === 'all') url.searchParams.delete('cat');
      else url.searchParams.set('cat', key);
      // file:// throws SecurityError here, and the filter still has to work.
      try { history.replaceState(null, '', url); } catch (_) {}
    }
  }

  /* ---------- 4. Restore from the query string --------------------------- */
  const initial = new URLSearchParams(location.search).get('cat');
  setFilter(initial && filters.some(f => f.key === initial) ? initial : 'all', { silent: true });

  /* ---------- 5. Deep links from the home page ---------------------------
     The grid did not exist when the browser handled the hash, so the jump has
     to be repeated here. A filter that would hide the target is cleared first,
     otherwise the link looks broken. */
  function focusFromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id.indexOf('work-') !== 0) return;

    const target = document.getElementById(id);
    if (!target) return;

    if (target.hidden || target.classList.contains('is-hidden')) setFilter('all');

    // A tick of slack so the card is back in the layout before we measure it.
    setTimeout(() => {
      target.scrollIntoView({
        behavior: window.__reduceMotion ? 'auto' : 'smooth',
        block: 'center'
      });
      target.classList.add('is-linked');
      setTimeout(() => target.classList.remove('is-linked'), 2600);
    }, 60);
  }

  focusFromHash();
  window.addEventListener('hashchange', focusFromHash);
})();

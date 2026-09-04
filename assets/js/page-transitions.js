/* ============================================================================
   page-transitions.js - leaves a page without the white flash
   ----------------------------------------------------------------------------
   Deliberately simple, because navigation is the one thing that must never break:
     entering - CSS runs page-enter on .page-shell as soon as the page loads
     leaving  - intercept clicks on internal links, raise an opaque veil for
                380ms, then set location

   Cases already handled:
     · Ctrl/Cmd/Shift/Alt clicks and middle clicks (open in a new tab)
     · cross-origin links, mailto:, tel:, #anchors, [download], target=_blank
     · coming back via bfcache, where a stale is-leaving class would otherwise
       leave the visitor staring at a black screen
     · navigation that never happens: the veil drops itself after 1.2s
   ========================================================================= */
(function () {
  'use strict';

  if (window.__reduceMotion) return;      // reduced motion: navigate plainly

  const veil = document.querySelector('[data-veil]');
  if (!veil) return;

  const DURATION = 380;                   // must match animations.css
  let leaving = false;
  let failSafe = 0;

  function shouldIgnore(link, event) {
    if (event.defaultPrevented) return true;
    if (event.button !== 0) return true;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return true;
    if (link.hasAttribute('download')) return true;
    if (link.target && link.target !== '_self') return true;
    if (link.hasAttribute('data-no-transition')) return true;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return true;

    const url = new URL(href, location.href);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return true;
    if (url.origin !== location.origin) return true;

    // Same page, only the hash differs: no veil.
    if (url.pathname === location.pathname && url.search === location.search) return true;

    return false;
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link || leaving || shouldIgnore(link, event)) return;

    event.preventDefault();
    leaving = true;
    document.body.classList.add('is-leaving');

    // Hand back the WebGL context now rather than waiting for GC.
    if (typeof window.__heroDestroy === 'function') window.__heroDestroy();

    setTimeout(() => { location.href = link.href; }, DURATION);

    // If we are somehow still here after 1.2s, drop the veil so the page is
    // usable rather than a dead black rectangle.
    failSafe = setTimeout(() => {
      leaving = false;
      document.body.classList.remove('is-leaving');
    }, 1200);
  });

  // Back button: the page may be restored from bfcache with is-leaving still on.
  addEventListener('pageshow', () => {
    clearTimeout(failSafe);
    leaving = false;
    document.body.classList.remove('is-leaving');
  });
})();

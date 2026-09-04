/* ============================================================================
   about-page.js - the two lists on the about page
     · the timeline, whose line fills as you scroll past it
     · the skills list
   ========================================================================= */
(function () {
  'use strict';

  const D  = window.PORTFOLIO;
  const UI = window.UI;
  if (!D || !UI) return;

  /* ======================================================================
     1. Timeline
     ==================================================================== */
  function initTimeline() {
    const list = document.querySelector('[data-timeline]');
    if (!list) return;

    D.timeline.forEach(item => {
      // Vertical reveal, not horizontal: these rows span the full shell width,
      // so sliding them sideways would push past the viewport edge.
      list.appendChild(UI.el('article', { class: 'tl-item', dataset: { reveal: '' } }, [
        UI.el('div', { class: 'tl-item__year', text: item.year }),
        UI.el('h3',  { class: 'tl-item__role', text: item.role }),
        UI.el('div', { class: 'tl-item__org',  text: item.org }),
        UI.el('p',   { class: 'tl-item__desc', text: item.desc })
      ]));
    });

    if (typeof window.__revealScan === 'function') window.__revealScan(list);

    // The rail and the markers are timed by animations.css using scroll-driven
    // animation. Where that is unsupported, or motion is reduced, show the
    // finished state immediately rather than falling back to a scroll listener.
    const cssDrivesRail = window.CSS && CSS.supports &&
      CSS.supports('animation-timeline', 'view()');

    if (!cssDrivesRail || window.__reduceMotion) {
      list.style.setProperty('--progress', '1');
      list.querySelectorAll('.tl-item').forEach(item => item.classList.add('is-lit'));
    }
  }

  /* ======================================================================
     2. Skills - a plain list, in the order they are written in data.js
     ==================================================================== */
  function initSkills() {
    const list = document.querySelector('[data-skills]');
    if (!list) return;

    D.skills.forEach(name => {
      list.appendChild(UI.el('li', { class: 'skill', text: name }));
    });
  }

  initTimeline();
  initSkills();
})();

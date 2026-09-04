/* ============================================================================
   home.js - the parts of the front page that come out of data.js:
   three featured projects, the full work index, and the ticker.
   ========================================================================= */
(function () {
  'use strict';

  const D  = window.PORTFOLIO;
  const UI = window.UI;
  if (!D || !UI) return;

  /* ---------- Featured work, as a pinned stack ---------------------------
     Each project holds the viewport while you read it. The sticky wrapper owns
     the recede animation, the card inside owns the tilt: one transform each. */
  const stack = document.querySelector('[data-featured]');
  if (stack) {
    D.featured(3).forEach((project, i) => {
      // The home page calls these Activity 1-3; the work index calls the same
      // three Project 1-3. One entry in data.js, two labels. The card is
      // titled with the home label, and the link names the page it opens, so
      // clicking "Activity 1" and landing on "Project 1" is not a surprise.
      const alias = project.homeName && project.homeName !== project.name;
      const card = UI.projectCard(project, i, {
        eager: i === 0,
        displayName: project.homeName || project.name,
        ctaLabel: alias ? 'Open ' + project.name : 'Read it'
      });
      card.classList.add('card--wide');
      stack.appendChild(UI.el('div', { class: 'stack__item' }, [card]));
    });

    if (typeof window.__rescanTilt === 'function') window.__rescanTilt(stack);
    if (typeof window.__rescanScramble === 'function') window.__rescanScramble(stack);
  }

  /* ---------- Every project, linked into the work page -------------------
     Each row jumps to projects.html#work-<id>, which scrolls that card into
     view and highlights it. The whole list is one <ol>, so a screen reader
     announces it as an ordered index of the work. */
  const index = document.querySelector('[data-work-index]');
  if (index) {
    D.projects.forEach((project, i) => {
      const link = UI.el('a', {
        class: 'work-index__link',
        href: 'projects.html#work-' + encodeURIComponent(project.id)
      }, [
        UI.el('span', { class: 'work-index__num', text: String(i + 1).padStart(2, '0') }),
        UI.el('span', { class: 'work-index__body' }, [
          UI.el('b', { class: 'work-index__name', text: project.name }),
          UI.el('span', { class: 'work-index__desc', text: project.tagline })
        ]),
        UI.el('span', { class: 'work-index__meta', text: project.year }),
        UI.el('span', { class: 'work-index__go', 'aria-hidden': 'true', text: '→' })
      ]);

      index.appendChild(UI.el('li', { class: 'work-index__item' }, [link]));
    });
  }

  /* ---------- Ticker ------------------------------------------------------
     The list goes in twice and CSS translates the track by -50%. That is what
     makes the loop seamless. */
  const track = document.querySelector('[data-ticker]');
  if (track) {
    D.stack.concat(D.stack).forEach(name => {
      track.appendChild(UI.el('span', { class: 'ticker__item', text: name }));
    });
  }
})();

/* ============================================================================
   contact-page.js - fills the contact links and availability badge from data.js
   ========================================================================= */
(function () {
  'use strict';

  const D  = window.PORTFOLIO;
  const UI = window.UI;
  if (!D || !UI) return;

  const list = document.querySelector('[data-socials]');
  if (list) {
    D.socials.forEach(item => {
      const isMail = item.href.startsWith('mailto:');
      list.appendChild(UI.el('a', {
        class: 'social',
        href: item.href,
        // External links open away from the page; noopener stops the destination
        // from touching window.opener.
        target: isMail ? null : '_blank',
        rel: isMail ? null : 'noopener noreferrer'
      }, [
        UI.el('span', { class: 'text-amber', text: item.label }),
        UI.el('span', { class: 'text-mute', text: item.handle }),
        UI.el('span', { class: 'social__arrow', text: '↗', 'aria-hidden': 'true' })
      ]));
    });
  }

  const badge = document.querySelector('[data-availability]');
  if (badge) {
    badge.append(
      UI.el('span', { class: D.identity.available ? 'led' : 'led led--amber' }),
      D.identity.available ? D.identity.availableText : 'Booked up right now, but ask anyway'
    );
  }
})();

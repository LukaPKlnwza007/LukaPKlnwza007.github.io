/* ============================================================================
   cards.js - DOM helpers shared by the home page and the work index.
   ----------------------------------------------------------------------------
   Everything is built with createElement and textContent rather than string
   concatenation, so copy out of data.js is escaped for free and the result is
   inspectable in devtools.
   ========================================================================= */
window.UI = (function () {
  'use strict';

  /**
   * Terse element factory.
   * @param {string} tag
   * @param {object} [props]    attributes and shorthands (class, text, dataset, on*)
   * @param {Array}  [children] nodes or strings to append
   */
  function el(tag, props, children) {
    const node = document.createElement(tag);

    if (props) {
      for (const key in props) {
        const value = props[key];
        if (value == null || value === false) continue;

        if (key === 'class') node.className = value;
        else if (key === 'text') node.textContent = value;
        else if (key === 'html') node.innerHTML = value;      // only ever our own static markup
        else if (key === 'dataset') Object.assign(node.dataset, value);
        else if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
        else node.setAttribute(key, value === true ? '' : value);
      }
    }

    (children || []).forEach(child => {
      if (child == null) return;
      node.append(typeof child === 'string' ? document.createTextNode(child) : child);
    });

    return node;
  }

  /**
   * One project card.
   * @param {object} project  entry from PORTFOLIO.projects
   * @param {number} index    display index, zero based
   * @param {object} [opts]   { eager: true } skips lazy loading for above-fold cards
   *                          { displayName } overrides the title, for pages that
   *                          label the same project differently
   *                          { ctaLabel } overrides "Read it" on the same cards,
   *                          so the link can name where it actually lands
   */
  function projectCard(project, index, opts) {
    const eager = opts && opts.eager;
    const label = (opts && opts.displayName) || project.name;
    const D = window.PORTFOLIO;
    const categoryLabel = (D.categories && D.categories[project.category]) || project.category;

    const cover = el('img', {
      src: project.cover,
      // Describe the photograph, not the card. "Cover photo for Project 4"
      // tells a screen reader nothing it cannot already read in the heading.
      alt: project.coverAlt || ('Cover photo for ' + label),
      width: '640',
      height: '400',
      // Anything below the first screen waits its turn.
      loading: eager ? 'eager' : 'lazy',
      decoding: 'async'
    });

    const media = el('div', { class: 'card__media' }, [
      cover,
      el('span', { class: 'card__index', text: String(index + 1).padStart(2, '0') })
    ]);

    const meta = el('div', { class: 'card__meta' }, [
      el('span', { text: project.year }),
      el('span', { text: '/' }),
      el('span', { text: categoryLabel })
    ]);

    // The link sits inside the heading so screen readers announce the project
    // name as the link text; the ::after rule makes the whole card clickable.
    const title = el('h3', { class: 'card__title' }, [
      el('a', {
        class: 'card__link',
        href: 'project-detail.html?id=' + encodeURIComponent(project.id),
        text: label
      })
    ]);

    const tags = el('div', { class: 'chip-row' },
      project.tags.slice(0, 3).map(tag => el('span', { class: 'chip', text: tag }))
    );

    const cta = el('span', { class: 'card__cta' }, [
      (opts && opts.ctaLabel) || 'Read it',
      el('span', { text: '→', 'aria-hidden': 'true' })
    ]);

    const body = el('div', { class: 'card__body' }, [
      meta,
      title,
      el('p', { class: 'card__desc', text: project.summary }),
      tags,
      cta
    ]);

    return el('article', {
      class: 'card',
      dataset: { tilt: '', category: project.category, tags: project.tags.join('|') }
    }, [
      el('span', { class: 'card__glow', 'aria-hidden': 'true' }),
      media,
      body
    ]);
  }

  return { el, projectCard };
})();

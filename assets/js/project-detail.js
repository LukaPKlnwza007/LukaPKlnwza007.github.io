/* ============================================================================
   project-detail.js - fills the single-project template from data.js
   ----------------------------------------------------------------------------
   One template serves every project. It reads the id from the query string:
       project-detail.html?id=nightshift
   A missing or unknown id shows a short "not here" state with a way out, rather
   than an empty page.
   ========================================================================= */
(function () {
  'use strict';

  const D  = window.PORTFOLIO;
  const UI = window.UI;
  if (!D || !UI) return;

  const root    = document.querySelector('[data-detail]');
  const missing = document.querySelector('[data-detail-missing]');
  if (!root) return;

  const id = new URLSearchParams(location.search).get('id');
  const project = id ? D.byId(id) : null;

  if (!project) {
    root.hidden = true;
    if (missing) missing.hidden = false;
    document.title = 'Not found · ' + D.identity.name;
    return;
  }

  /* ---------- Document metadata ------------------------------------------ */
  document.title = project.name + ' · ' + D.identity.name;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', project.summary);

  /* ---------- Plain text fields ------------------------------------------ */
  const setText = (field, value) => {
    root.querySelectorAll('[data-field="' + field + '"]').forEach(el => {
      el.textContent = value;
    });
  };

  setText('name', project.name);
  setText('tagline', project.tagline);
  setText('summary', project.summary);
  setText('year', project.year);
  setText('role', project.role);
  setText('client', project.client);
  setText('duration', project.duration);
  setText('category', D.categories[project.category] || project.category);
  setText('problem', project.problem);

  /* ---------- Full-bleed cover ------------------------------------------- */
  const cover = root.querySelector('[data-field="cover"]');
  if (cover) {
    cover.src = project.cover;
    // A real photograph carries information the heading does not, so describe
    // it. Falls back to decorative if the entry has no description.
    cover.alt = project.coverAlt || '';
  }

  /* ---------- Process, outcomes, tech, links ------------------------------ */
  const steps = root.querySelector('[data-field="process"]');
  if (steps) {
    project.process.forEach(text => steps.appendChild(UI.el('li', { text })));
  }

  const learned = root.querySelector('[data-field="learned"]');
  if (learned) {
    (project.learned || []).forEach(text => learned.appendChild(UI.el('li', { text })));
  }

  /* ---------- Photos, only for the projects that have any --------------- */
  const gallery = root.querySelector('[data-field="gallery"]');
  const galleryBlock = root.querySelector('[data-gallery-block]');
  if (gallery && project.gallery && project.gallery.length) {
    project.gallery.forEach(photo => {
      gallery.appendChild(UI.el('figure', { class: 'photo' }, [
        UI.el('img', {
          src: photo.src,
          alt: photo.alt || '',
          loading: 'lazy',
          decoding: 'async',
          width: '1400',
          height: '875'
        }),
        photo.caption ? UI.el('figcaption', { text: photo.caption }) : null
      ]));
    });
    if (galleryBlock) galleryBlock.hidden = false;
  }

  const tech = root.querySelector('[data-field="tech"]');
  if (tech) {
    project.tech.forEach(name => {
      tech.appendChild(UI.el('span', { class: 'chip', text: name }));
    });
  }

  const links = root.querySelector('[data-field="links"]');
  if (links) {
    (project.links || []).forEach(link => {
      links.appendChild(UI.el('a', {
        class: 'btn btn--ghost',
        href: link.href,
        target: '_blank',
        rel: 'noopener noreferrer',
        text: link.label
      }));
    });
  }

  /* ---------- Prev / next, wrapping around ------------------------------- */
  const pager = root.querySelector('[data-field="pager"]');
  if (pager) {
    const { prev, next } = D.neighbours(project.id);

    const makeLink = (target, direction, label) => UI.el('a', {
      class: 'pager__item pager__item--' + direction,
      href: 'project-detail.html?id=' + encodeURIComponent(target.id)
    }, [
      UI.el('span', { class: 'pager__dir', text: label }),
      UI.el('span', { class: 'pager__name', text: target.name })
    ]);

    if (prev) pager.appendChild(makeLink(prev, 'prev', '← previous'));
    if (next) pager.appendChild(makeLink(next, 'next', 'next →'));
  }
})();

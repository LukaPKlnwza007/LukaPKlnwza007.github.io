/* ============================================================================
   contact-form.js - validates, posts to the Spring Boot endpoint, reports back
   ----------------------------------------------------------------------------
   Client validation exists to tell the visitor quickly, not to keep anyone out.
   The Java side re-checks all of it, because anyone can POST straight at the
   endpoint (see ContactRequest.java).

   Nothing here calls alert(). Status goes in an aria-live region so it reaches
   screen readers too, and there is a 12 second timeout: if the server is not
   answering, the visitor gets an email address rather than a spinner forever.
   ========================================================================= */
(function () {
  'use strict';

  const D = window.PORTFOLIO;
  const form = document.querySelector('[data-contact-form]');
  if (!form || !D) return;

  const statusEl    = form.querySelector('[data-form-status]');
  const submit      = form.querySelector('[data-submit]');
  const submitLabel = submit ? submit.querySelector('[data-submit-label]') : null;

  const TIMEOUT_MS  = 12000;
  const MAX_MESSAGE = 2000;

  /* ---------- Rules, kept in step with the Java annotations --------------- */
  const RULES = {
    name: {
      test: v => v.length >= 2 && v.length <= 80,
      message: 'Between 2 and 80 characters, please'
    },
    email: {
      // Loose on purpose. The only real test of an address is sending to it.
      test: v => v.length <= 160 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v),
      message: 'That does not look like an email address'
    },
    message: {
      test: v => v.length >= 10 && v.length <= MAX_MESSAGE,
      message: 'At least 10 characters, up to 2,000'
    }
  };

  function setFieldError(name, message) {
    const input = form.elements[name];
    if (!input) return;

    const wrap = input.closest('.field');
    const err  = wrap ? wrap.querySelector('.field__err') : null;

    if (wrap) wrap.classList.toggle('is-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (err) err.textContent = message || '';
  }

  function validateField(name) {
    const input = form.elements[name];
    const rule  = RULES[name];
    if (!input || !rule) return true;

    const ok = rule.test(input.value.trim());
    setFieldError(name, ok ? '' : rule.message);
    return ok;
  }

  // Check on blur. Checking from the first keystroke is just nagging.
  Object.keys(RULES).forEach(name => {
    const input = form.elements[name];
    if (!input) return;
    input.addEventListener('blur', () => validateField(name));
    // Once a field is already marked wrong, re-check as they type so they can
    // see it clear.
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') validateField(name);
    });
  });

  /* ---------- Character counter ------------------------------------------ */
  const message = form.elements.message;
  const counter = form.querySelector('[data-count]');
  const paintCount = () => {
    if (counter && message) counter.textContent = message.value.length + ' / ' + MAX_MESSAGE;
  };
  if (message && counter) {
    message.addEventListener('input', paintCount);
    paintCount();
  }

  /* ---------- Status line ------------------------------------------------- */
  function showStatus(state, text, extraNode) {
    if (!statusEl) return;
    statusEl.textContent = '';
    statusEl.dataset.state = state;
    statusEl.classList.add('is-shown');

    const led = document.createElement('span');
    led.className = state === 'error' ? 'led led--amber' : 'led';

    statusEl.append(led, document.createTextNode(text));
    if (extraNode) statusEl.append(' ', extraNode);
  }

  function setLoading(loading) {
    if (!submit) return;
    submit.disabled = loading;
    if (submitLabel) submitLabel.textContent = loading ? 'Sending…' : 'Send message';

    const spinner = submit.querySelector('.spinner');
    if (loading && !spinner) {
      const s = document.createElement('span');
      s.className = 'spinner';
      submit.prepend(s);
    }
    if (!loading && spinner) spinner.remove();
  }

  /* ---------- Submit ------------------------------------------------------ */
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Validate everything, then focus the first field that failed so a keyboard
    // user lands where the work is.
    const invalid = Object.keys(RULES).filter(name => !validateField(name));
    if (invalid.length) {
      showStatus('error', 'Some fields need another look');
      const first = form.elements[invalid[0]];
      if (first) first.focus();
      return;
    }

    // Honeypot: bots fill in every field they find. Report success so they do
    // not learn anything, and send nothing.
    if (form.elements.website && form.elements.website.value) {
      showStatus('ok', 'Message sent');
      form.reset();
      return;
    }

    const payload = {
      name:    form.elements.name.value.trim(),
      email:   form.elements.email.value.trim(),
      subject: form.elements.subject ? form.elements.subject.value.trim() : '',
      message: form.elements.message.value.trim()
    };

    setLoading(true);
    showStatus('busy', 'Sending…');

    // Stop waiting if the server goes quiet.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(D.identity.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      // A broken server may not return JSON at all, so do not let parsing throw.
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        showStatus('ok', data.message || 'Message sent. I will reply within a day or two.');
        form.reset();
        paintCount();
        Object.keys(RULES).forEach(name => setFieldError(name, ''));
        return;
      }

      if (res.status === 429) {
        showStatus('error', data.message || 'That is a lot of messages. Try again shortly.');
        return;
      }

      // 400 with per-field errors from Bean Validation on the Java side.
      if (data.errors && typeof data.errors === 'object') {
        Object.keys(data.errors).forEach(field => setFieldError(field, data.errors[field]));
        showStatus('error', 'The server rejected some of that');
        const firstServerField = form.elements[Object.keys(data.errors)[0]];
        if (firstServerField) firstServerField.focus();
        return;
      }

      showStatus('error', data.message || 'Send failed (status ' + res.status + ')');

    } catch (err) {
      // Unreachable or timed out. Give them something that works right now.
      const mail = document.createElement('a');
      mail.className = 'link-underline';
      mail.href = 'mailto:' + D.identity.email;
      mail.textContent = D.identity.email;

      showStatus(
        'error',
        err.name === 'AbortError'
          ? 'The server is not answering. Reach me directly at'
          : 'Could not reach the server. Reach me directly at',
        mail
      );
    } finally {
      clearTimeout(timer);
      setLoading(false);
    }
  });
})();

/* Eric Kayz Barbershop - script.js
   1. Mobile navigation menu (all pages)
   2. Gallery lightbox (gallery page only) */

'use strict';

/* ---------- 1. Mobile navigation ---------- */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Close' : 'Menu';
  }

  toggle.addEventListener('click', function () {
    setMenu(!nav.classList.contains('open'));
  });

  // Close the menu when a link is chosen
  nav.addEventListener('click', function (event) {
    if (event.target.closest('a')) setMenu(false);
  });

  // Close with the Escape key and return focus to the button
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      setMenu(false);
      toggle.focus();
    }
  });

  // Reset the menu state if the window is resized to a wider screen
  window.matchMedia('(min-width: 40.0625rem)').addEventListener('change', function (event) {
    if (event.matches) setMenu(false);
  });
})();

/* ---------- 2. Gallery lightbox ---------- */
(function () {
  const lightbox = document.getElementById('lightbox');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!lightbox || items.length === 0 || typeof lightbox.showModal !== 'function') return;

  const image = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  let current = 0;

  function show(index) {
    // Wrap around at either end of the gallery
    current = (index + items.length) % items.length;
    const item = items[current];
    image.src = item.dataset.full;
    image.alt = item.querySelector('img').alt;
    caption.textContent = item.dataset.caption || '';
  }

  items.forEach(function (item, index) {
    item.addEventListener('click', function () {
      show(index);
      lightbox.showModal();
    });
  });

  lightbox.querySelector('.lb-close').addEventListener('click', function () {
    lightbox.close();
  });
  lightbox.querySelector('.lb-prev').addEventListener('click', function () {
    show(current - 1);
  });
  lightbox.querySelector('.lb-next').addEventListener('click', function () {
    show(current + 1);
  });

  // Click on the dark backdrop closes the viewer
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) lightbox.close();
  });

  // Arrow keys move between photos (Escape is handled by the dialog itself)
  lightbox.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });
})();

/* ==========================================================
   PART 3 ADDITIONS
   3 Helpers | 4 Scroll reveal | 5 FAQ accordion | 6 Services search, filter, sort
   7 Form validation | 8 Enquiry form | 9 Contact form | 10 Map
   ========================================================== */

/* ---------- 3. Helpers ---------- */
// IMPORTANT: change the email to the address that should receive contact messages
const SHOP = { email: 'your-email@example.com', whatsapp: '27713004435', open: 9 * 60, close: 19 * 60 };
const FRESHA_URL = 'https://www.fresha.com/a/eric-kayz-barbershop-johannesburg-15-8th-street-qdzk8bu2';

// Builds a DOM element. Text is added with textContent, so user input can never inject HTML.
function el(tag, attrs, kids) {
  const node = document.createElement(tag);
  Object.keys(attrs || {}).forEach(function (key) {
    if (key === 'text') node.textContent = attrs[key];
    else node.setAttribute(key, attrs[key]);
  });
  [].concat(kids || []).forEach(function (kid) { node.append(kid); });
  return node;
}
const pad = function (n) { return String(n).padStart(2, '0'); };
const isoDate = function (d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); };
const hhmm = function (mins) { return pad(Math.floor(mins / 60)) + ':' + pad(mins % 60); };
const duration = function (mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  return (h ? h + ' hr' : '') + (h && m ? ' ' : '') + (m ? m + ' min' : '');
};

/* ---------- 4. Scroll reveal animation ---------- */
(function () {
  if (!('IntersectionObserver' in window)) return;
  const sections = document.querySelectorAll('main > section:not(.hero):not(.page-hero)');
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  sections.forEach(function (section) {
    section.classList.add('reveal');
    observer.observe(section);
  });
})();

/* ---------- 5. FAQ accordion ---------- */
(function () {
  document.querySelectorAll('.faq-q').forEach(function (button) {
    button.addEventListener('click', function () {
      const wasOpen = button.getAttribute('aria-expanded') === 'true';
      // Only one answer is open at a time
      button.closest('.faq').querySelectorAll('.faq-q').forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        document.getElementById(other.getAttribute('aria-controls')).classList.remove('open');
      });
      if (!wasOpen) {
        button.setAttribute('aria-expanded', 'true');
        document.getElementById(button.getAttribute('aria-controls')).classList.add('open');
      }
    });
  });
})();

/* ---------- 6. Services: dynamic cards with search, filter and sort ---------- */
(function () {
  const list = document.getElementById('service-list');
  if (!list || typeof SERVICES === 'undefined') return;
  const search = document.getElementById('service-search');
  const category = document.getElementById('service-category');
  const sort = document.getElementById('service-sort');
  const count = document.getElementById('service-count');
  const empty = document.getElementById('service-empty');

  const sorters = {
    order: function (a, b) { return a.order - b.order; },
    'price-asc': function (a, b) { return a.price - b.price; },
    'price-desc': function (a, b) { return b.price - a.price; },
    name: function (a, b) { return a.name.localeCompare(b.name); },
    duration: function (a, b) { return a.minutes - b.minutes || a.price - b.price; }
  };

  function card(s) {
    return el('li', { class: 'card' }, [
      el('h3', { text: s.name }),
      el('p', { text: s.desc }),
      el('p', { class: 'meta' }, [el('span', { text: duration(s.minutes) }), el('span', { class: 'price', text: 'R' + s.price })]),
      el('a', { class: 'card-link', href: 'enquiry.html?service=' + s.id, text: 'Enquire about this' })
    ]);
  }

  function render() {
    const query = search.value.trim().toLowerCase();
    const shown = SERVICES.filter(function (s) {
      const matchesCategory = category.value === 'all' || s.category === category.value;
      const matchesText = !query || (s.name + ' ' + s.desc + ' ' + s.category).toLowerCase().indexOf(query) !== -1;
      return matchesCategory && matchesText;
    }).sort(sorters[sort.value]);
    list.replaceChildren.apply(list, shown.map(card));
    count.textContent = 'Showing ' + shown.length + ' of ' + SERVICES.length + ' services';
    empty.hidden = shown.length > 0;
  }

  [search, category, sort].forEach(function (control) {
    control.addEventListener('input', render);
  });
  render();
})();

/* ---------- 7. Form validation (shared by both forms) ---------- */
function fieldsOf(form) {
  return Array.from(form.elements).filter(function (f) {
    return f.name && f.type !== 'hidden' && f.type !== 'submit' && f.type !== 'checkbox' && !f.closest('.hp');
  });
}

function showError(field, message) {
  const out = document.getElementById(field.id + '-error');
  if (out) out.textContent = message;
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
}

// Checks one field with the browser's Constraint Validation API plus our own rules.
// Returns true when the field is valid.
function checkField(field) {
  const value = field.value.trim();
  field.setCustomValidity('');
  if (field.name === 'name' && value && !/^\p{L}[\p{L}' .-]{1,59}$/u.test(value)) {
    field.setCustomValidity('Use letters only for your name (2 to 60 characters).');
  }
  if (field.name === 'phone' && value && !/^(?:\+27|0)[1-9]\d{8}$/.test(value.replace(/[\s-]/g, ''))) {
    field.setCustomValidity('Enter a South African number such as 071 300 4435 or +27 71 300 4435.');
  }
  if (field.name === 'date' && value && new Date(value + 'T00:00').getDay() === 0) {
    field.setCustomValidity('We are closed on Sundays. Please choose Monday to Saturday.');
  }
  const v = field.validity;
  let message = '';
  if (v.valueMissing) message = field.dataset.required || 'This field is required.';
  else if (v.typeMismatch) message = 'Enter a valid email address, for example name@example.com.';
  else if (v.tooShort) message = 'Please enter at least ' + field.minLength + ' characters (you have ' + field.value.length + ').';
  else if (v.patternMismatch) message = field.title || 'Please use the requested format.';
  else if (v.rangeUnderflow || v.rangeOverflow || v.stepMismatch) {
    if (field.type === 'date') message = v.rangeUnderflow ? 'Please choose today or a later date.' : 'We take enquiries up to 90 days ahead.';
    else if (field.type === 'time') message = 'Please choose a quarter-hour time between 09:00 and 18:45.';
    else message = 'That value is not allowed.';
  } else if (v.customError) message = field.validationMessage;
  showError(field, message);
  return !message;
}

function wireCounter(textarea) {
  const out = document.getElementById(textarea.id + '-count');
  if (!out) return;
  const update = function () { out.textContent = textarea.value.length + ' / ' + textarea.maxLength; };
  textarea.addEventListener('input', update);
  update();
}

// Validates on blur, re-checks while typing once a field has an error, and validates everything on submit.
function wireForm(form, onValid) {
  const fields = fieldsOf(form);
  const summary = form.querySelector('.form-summary');
  fields.forEach(function (field) {
    field.addEventListener('blur', function () { checkField(field); });
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true') checkField(field);
    });
  });
  form.querySelectorAll('textarea[maxlength]').forEach(wireCounter);
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (form.elements['bot-field'] && form.elements['bot-field'].value) return; // spam trap
    const invalid = fields.filter(function (field) { return !checkField(field); });
    if (invalid.length) {
      summary.textContent = 'Please fix ' + invalid.length + (invalid.length === 1 ? ' field' : ' fields') + ' before sending.';
      summary.hidden = false;
      invalid[0].focus();
      return;
    }
    summary.hidden = true;
    onValid();
  });
}

/* ---------- 8. Enquiry form: validation, price and availability response, AJAX copy ---------- */
(function () {
  const form = document.getElementById('enquiry-form');
  if (!form || typeof SERVICES === 'undefined') return;
  const f = form.elements;

  // Date limits: today up to 90 days ahead
  const today = new Date(), last = new Date();
  last.setDate(today.getDate() + 90);
  f.date.min = isoDate(today);
  f.date.max = isoDate(last);

  // Links such as enquiry.html?service=shave pre-select the service
  const wanted = new URLSearchParams(location.search).get('service');
  if (wanted && SERVICES.some(function (s) { return s.id === wanted; })) f.service.value = wanted;

  function checkAvailability(dateValue, timeValue, minutes) {
    const day = new Date(dateValue + 'T00:00');
    const parts = timeValue.split(':');
    const start = Number(parts[0]) * 60 + Number(parts[1]);
    const label = day.toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long' });
    const now = new Date();
    if (day.getDay() === 0) {
      return { ok: false, text: 'We are closed on Sundays (' + label + '). Please choose Monday to Saturday, 09:00 to 19:00.' };
    }
    if (dateValue === isoDate(now) && start < now.getHours() * 60 + now.getMinutes()) {
      return { ok: false, text: hhmm(start) + ' has already passed today. Please choose a later time.' };
    }
    if (start < SHOP.open || start + minutes > SHOP.close) {
      return { ok: false, text: 'A ' + duration(minutes) + ' appointment starting at ' + hhmm(start) + ' does not fit our hours (09:00 to 19:00). The latest start that day is ' + hhmm(SHOP.close - minutes) + '.' };
    }
    return { ok: true, text: label + ' at ' + hhmm(start) + ' is within our opening hours. We will confirm your slot when you book.' };
  }

  function handleEnquiry() {
    const main = SERVICES.find(function (s) { return s.id === f.service.value; });
    const extras = Array.from(form.querySelectorAll('input[name="extras"]:checked'))
      .map(function (box) { return SERVICES.find(function (s) { return s.id === box.value; }); })
      .filter(function (s) { return s && s.id !== main.id; });
    const items = [main].concat(extras);
    const total = items.reduce(function (sum, s) { return sum + s.price; }, 0);
    const minutes = items.reduce(function (sum, s) { return sum + s.minutes; }, 0);
    const avail = checkAvailability(f.date.value, f.time.value, minutes);
    const name = f.name.value.trim();

    const rows = items.map(function (s) {
      return el('tr', {}, [el('td', { text: s.name }), el('td', { text: 'R' + s.price })]);
    });
    rows.push(el('tr', { class: 'total' }, [el('td', { text: 'Estimated total (' + duration(minutes) + ')' }), el('td', { text: 'R' + total })]));

    const whatsapp = 'Hi Eric Kayz, I would like to book ' + items.map(function (s) { return s.name; }).join(' + ') +
      ' on ' + f.date.value + ' at ' + f.time.value + '. My name is ' + name + '.';
    const note = el('p', { class: 'note', text: 'Sending a copy of your enquiry to the barbershop...' });
    const box = document.getElementById('enquiry-result');
    box.replaceChildren(
      el('h2', { text: 'Thanks ' + name.split(' ')[0] + ', here is your response' }),
      el('p', { class: 'status' + (avail.ok ? '' : ' bad'), text: avail.text }),
      el('table', { class: 'quote' }, [el('tbody', {}, rows)]),
      el('p', { class: 'note', text: 'Prices are a guide. We confirm the final price and your slot when you book.' }),
      el('div', { class: 'btn-row' }, [
        el('a', { class: 'btn', href: 'https://wa.me/' + SHOP.whatsapp + '?text=' + encodeURIComponent(whatsapp), target: '_blank', rel: 'noopener', text: 'Confirm on WhatsApp' }),
        el('a', { class: 'btn btn-outline', href: FRESHA_URL, target: '_blank', rel: 'noopener', text: 'Book online on Fresha' })
      ]),
      note
    );
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    box.focus({ preventScroll: true });
    sendCopy(note);
  }

  // AJAX: posts the form in the background so the page does not reload.
  // Works on Netlify (Netlify Forms). Elsewhere it fails safely and the user still sees their response.
  async function sendCopy(note) {
    const fallback = 'We could not send a copy to the shop from here, so please confirm on WhatsApp.';
    try {
      const response = await fetch(form.getAttribute('action') || '/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      note.textContent = response.ok ? 'A copy of your enquiry has been sent to the barbershop.' : fallback;
    } catch (error) {
      note.textContent = fallback;
    }
  }

  wireForm(form, handleEnquiry);
})();

/* ---------- 9. Contact form: validation, then a ready-to-send email ---------- */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const f = form.elements;
  const box = document.getElementById('contact-result');

  function handleContact() {
    const topic = f.topic.value;
    const subject = '[' + topic + '] ' + f.subject.value.trim();
    const body = [
      'Name: ' + f.name.value.trim(),
      'Email: ' + f.email.value.trim(),
      'Phone: ' + (f.phone.value.trim() || 'not given'),
      'Message type: ' + topic,
      '',
      f.message.value.trim()
    ].join('\r\n');
    const href = 'mailto:' + SHOP.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);

    const edit = el('button', { type: 'button', class: 'btn btn-outline', text: 'Edit my message' });
    edit.addEventListener('click', function () { box.hidden = true; f.name.focus(); });
    box.replaceChildren(
      el('h2', { text: 'Your email is ready' }),
      el('p', { text: 'To: ' + SHOP.email }),
      el('p', { text: 'Subject: ' + subject }),
      el('p', { class: 'preview', text: body }),
      el('div', { class: 'btn-row' }, [el('a', { class: 'btn', href: href, text: 'Send email' }), edit]),
      el('p', { class: 'note', text: 'This opens your email app with the message filled in. No email app? Message us on WhatsApp instead.' })
    );
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    box.focus({ preventScroll: true });
  }

  wireForm(form, handleContact);
})();

/* ---------- 10. Interactive map (Leaflet + OpenStreetMap) ---------- */
window.addEventListener('load', function () {
  const node = document.getElementById('map');
  if (!node) return;
  if (typeof L === 'undefined') {
    node.append(el('p', { class: 'note', text: 'The map could not load. Use the Google Maps link above.' }));
    return;
  }
  // Approximate centre of Bezuidenhout Valley. Replace with the exact shop coordinates if you have them.
  const position = [-26.1873, 28.0761];
  const map = L.map(node, { scrollWheelZoom: false }).setView(position, 15);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  L.circleMarker(position, { radius: 11, color: '#14120f', weight: 2, fillColor: '#c9a24b', fillOpacity: 0.9 })
    .addTo(map)
    .bindPopup(el('div', {}, [el('strong', { text: 'Eric Kayz Barbershop' }), el('br'), '17 8th St, Bezuidenhout Valley']))
    .openPopup();
});

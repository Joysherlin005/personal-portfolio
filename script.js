// Full Stack Development Assignment — interactive portfolio
'use strict';

const themeToggle = document.querySelector('#themeToggle');
const body = document.body;

function setTheme(theme) {
  const isLight = theme === 'light';
  body.classList.toggle('light-theme', isLight);
  themeToggle.textContent = isLight ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  themeToggle.setAttribute('aria-pressed', String(isLight));
}

themeToggle.addEventListener('click', () => {
  const nextTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
  setTheme(nextTheme);
});

// Project filtering uses data attributes and DOM manipulation.
const filterButtons = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedFilter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });

    projectItems.forEach((project) => {
      const shouldShow = selectedFilter === 'all' || project.dataset.category === selectedFilter;
      project.hidden = !shouldShow;
    });
  });
});

// Client-side validation with dynamic feedback. No data is stored or sent to a server.
const contactForm = document.querySelector('#contactForm');
const formFeedback = document.querySelector('#formFeedback');
const fields = [...contactForm.querySelectorAll('input, textarea')];

function validateField(field) {
  const value = field.value.trim();
  let valid = field.checkValidity();

  if (field.type === 'email' && value) {
    valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  field.classList.toggle('is-invalid', !valid);
  field.setAttribute('aria-invalid', String(!valid));
  return valid;
}

fields.forEach((field) => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.classList.contains('is-invalid')) validateField(field);
    formFeedback.className = 'form-feedback';
    formFeedback.textContent = '';
  });
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const allValid = fields.map(validateField).every(Boolean);

  if (!allValid) {
    formFeedback.className = 'form-feedback show error';
    formFeedback.textContent = 'Please review the highlighted fields and correct the errors.';
    const firstInvalid = contactForm.querySelector('.is-invalid');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const data = Object.fromEntries(new FormData(contactForm).entries());
  const subject = encodeURIComponent(`Portfolio enquiry: ${data.subject}`);
  const bodyText = encodeURIComponent(
    `Hi Joy,\n\n${data.message}\n\nFrom: ${data.name}\nReply to: ${data.email}`
  );

  formFeedback.className = 'form-feedback show success';
  formFeedback.textContent = 'Your details look good. Your email app will open with the message prepared.';
  // Replace this placeholder with the real portfolio email before publishing.
  window.location.href = `mailto:hello@example.com?subject=${subject}&body=${bodyText}`;
});

document.querySelector('#year').textContent = new Date().getFullYear();

// Close the mobile navigation after a section link is selected.
document.querySelectorAll('#mainNav .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    const nav = document.querySelector('#mainNav');
    if (nav.classList.contains('show') && window.bootstrap) {
      window.bootstrap.Collapse.getOrCreateInstance(nav).hide();
    }
  });
});

// Highlight the active navigation item as sections enter view.
const observedSections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.nav-link').forEach((link) => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', active);
        });
      }
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  observedSections.forEach((section) => observer.observe(section));
}

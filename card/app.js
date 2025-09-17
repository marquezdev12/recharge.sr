// Shared client-side interactions and validation
(() => {
  const byId = (id) => document.getElementById(id);
  const qs = (s, el = document) => el.querySelector(s);

  function setActiveNav() {
    const path = location.pathname.split('/').pop();
    document.querySelectorAll('.nav a').forEach((a) => {
      if (a.getAttribute('href') === path) {
        a.setAttribute('aria-current', 'page');
        a.style.fontWeight = '700';
        a.style.background = '#eef2ff';
      }
    });
  }

  function showError(input, message) {
    input.classList.add('input-error');
    let hint = input.parentElement.querySelector('.error-text');
    if (!hint) {
      hint = document.createElement('div');
      hint.className = 'error-text';
      input.parentElement.appendChild(hint);
    }
    hint.textContent = message;
  }

  function clearError(input) {
    input.classList.remove('input-error');
    const hint = input.parentElement.querySelector('.error-text');
    if (hint) hint.textContent = '';
  }

  function validateEmail(value) {
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function attachPurchaseValidation() {
    const form = byId('purchaseForm');
    if (!form) return;
    const type = byId('type');
    const value = byId('value');
    const qty = byId('quantity');
    const email = byId('email');
    const live = document.createElement('div');
    live.setAttribute('aria-live', 'polite');
    live.style.marginTop = '8px';
    live.style.color = '#334155';
    form.appendChild(live);

    form.addEventListener('submit', (e) => {
      let ok = true;
      [type, value, qty, email].forEach(clearError);

      if (!type.value) { showError(type, 'Choisissez un type.'); ok = false; }
      if (!value.value) { showError(value, 'Choisissez un montant.'); ok = false; }
      if (!/^[1-9][0-9]*$/.test(qty.value)) { showError(qty, 'Quantité invalide.'); ok = false; }
      if (!validateEmail(email.value)) { showError(email, 'E-mail invalide.'); ok = false; }

      if (!ok) {
        e.preventDefault();
        live.textContent = 'Veuillez corriger les champs en surbrillance.';
      } else {
        try {
          const payload = {
            type: type.value,
            value: value.value,
            quantity: qty.value,
            email: email.value,
            submittedAt: new Date().toISOString()
          };
          localStorage.setItem('ts_last_purchase', JSON.stringify(payload));
        } catch (_) { /* ignore */ }
        e.preventDefault();
        window.location.href = 'payment.html';
      }
    });
  }

  function attachActivateValidation() {
    const form = byId('activateForm');
    if (!form) return;
    const code = byId('code');
    const email = byId('email');
    const live = document.createElement('div');
    live.setAttribute('aria-live', 'polite');
    live.style.marginTop = '8px';
    live.style.color = '#334155';
    form.appendChild(live);

    form.addEventListener('submit', (e) => {
      let ok = true;
      [code, email].forEach(clearError);

      if (!code.value || code.value.replace(/\s+/g, '').length < 6) {
        showError(code, 'Entrez un code valide.'); ok = false;
      }
      if (email.value && !validateEmail(email.value)) {
        showError(email, 'E-mail invalide.'); ok = false;
      }

      if (!ok) {
        e.preventDefault();
        live.textContent = 'Veuillez corriger les champs en surbrillance.';
      } else {
        try {
          const payload = {
            code: code.value,
            email: email.value,
            submittedAt: new Date().toISOString()
          };
          localStorage.setItem('ts_last_activation', JSON.stringify(payload));
        } catch (_) { /* ignore */ }
        e.preventDefault();
        window.location.href = 'thank_you.html';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    const toggle = document.getElementById('navToggle');
    const nav = document.querySelector('.nav');
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
      });
    }
    attachPurchaseValidation();
    attachActivateValidation();
  });
})();



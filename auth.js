/* ============================================================
   Aman Foundation — Auth Pages JavaScript
   Handles: validation, password toggle, strength meter, submit
   ============================================================ */

(function () {
  'use strict';

  /* ── Helpers ─────────────────────────────────────────── */

  function $(id) { return document.getElementById(id); }

  function setError(inputEl, errorEl, message) {
    const wrapper = inputEl.closest('.input-wrapper');
    wrapper.classList.add('has-error');
    wrapper.classList.remove('is-valid');
    if (errorEl) errorEl.textContent = message;
  }

  function setValid(inputEl, errorEl) {
    const wrapper = inputEl.closest('.input-wrapper');
    wrapper.classList.remove('has-error');
    wrapper.classList.add('is-valid');
    if (errorEl) errorEl.textContent = '';
  }

  function clearState(inputEl, errorEl) {
    const wrapper = inputEl.closest('.input-wrapper');
    wrapper.classList.remove('has-error', 'is-valid');
    if (errorEl) errorEl.textContent = '';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  /* ── Password Toggle ─────────────────────────────────── */

  function initPasswordToggle(btnId, inputId) {
    const btn   = $(btnId);
    const input = $(inputId);
    if (!btn || !input) return;

    btn.addEventListener('click', function () {
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      btn.querySelector('.eye-icon').style.display     = isHidden ? 'none'  : '';
      btn.querySelector('.eye-off-icon').style.display = isHidden ? ''      : 'none';
      btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    });
  }

  /* ── Password Strength ───────────────────────────────── */

  function measureStrength(password) {
    let score = 0;
    if (password.length >= 8)  score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: 'weak',   label: 'Weak' };
    if (score <= 3) return { level: 'fair',   label: 'Fair' };
    return              { level: 'strong', label: 'Strong' };
  }

  function initStrengthMeter(inputId) {
    const input = $(inputId);
    const fill  = $('strengthFill');
    const label = $('strengthLabel');
    if (!input || !fill || !label) return;

    input.addEventListener('input', function () {
      if (!this.value) {
        fill.className = 'strength-fill';
        label.className = 'strength-label';
        label.textContent = '';
        return;
      }
      const result = measureStrength(this.value);
      fill.className  = 'strength-fill ' + result.level;
      label.className = 'strength-label ' + result.level;
      label.textContent = result.label;
    });
  }

  /* ── Inline validation on blur ───────────────────────── */

  function attachBlurValidation(inputId, errorId, validator) {
    const input = $(inputId);
    const error = $(errorId);
    if (!input) return;

    input.addEventListener('blur', function () {
      if (!this.value.trim()) { clearState(this, error); return; }
      const msg = validator(this.value);
      msg ? setError(this, error, msg) : setValid(this, error);
    });

    input.addEventListener('input', function () {
      if (error && error.textContent) {
        const msg = validator(this.value);
        msg ? setError(this, error, msg) : setValid(this, error);
      }
    });
  }

  /* ── Login Page ──────────────────────────────────────── */

  const loginForm = $('loginForm');

  if (loginForm) {
    initPasswordToggle('togglePassword', 'password');

    attachBlurValidation('email', 'emailError', function (v) {
      if (!v.trim()) return 'Email is required.';
      if (!isValidEmail(v)) return 'Enter a valid email address.';
      return '';
    });

    attachBlurValidation('password', 'passwordError', function (v) {
      if (!v) return 'Password is required.';
      if (v.length < 6) return 'Password must be at least 6 characters.';
      return '';
    });

    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      const emailEl   = $('email');
      const passEl    = $('password');
      const emailErr  = $('emailError');
      const passErr   = $('passwordError');

      if (!emailEl.value.trim()) {
        setError(emailEl, emailErr, 'Email is required.'); valid = false;
      } else if (!isValidEmail(emailEl.value)) {
        setError(emailEl, emailErr, 'Enter a valid email address.'); valid = false;
      } else {
        setValid(emailEl, emailErr);
      }

      if (!passEl.value) {
        setError(passEl, passErr, 'Password is required.'); valid = false;
      } else if (passEl.value.length < 6) {
        setError(passEl, passErr, 'Password must be at least 6 characters.'); valid = false;
      } else {
        setValid(passEl, passErr);
      }

      if (!valid) return;

      /* Simulate sign-in */
      const btn = $('loginBtn');
      btn.classList.add('loading');
      btn.disabled = true;

      setTimeout(function () {
        btn.classList.remove('loading');
        btn.disabled = false;
        /* Replace this alert with your actual auth logic */
        alert('Sign-in successful! Redirecting to dashboard…');
      }, 1800);
    });
  }

  /* ── Register Page ───────────────────────────────────── */

  const registerForm = $('registerForm');

  if (registerForm) {
    initPasswordToggle('toggleRegPassword', 'regPassword');
    initStrengthMeter('regPassword');

    attachBlurValidation('firstName', 'firstNameError', function (v) {
      return v.trim() ? '' : 'First name is required.';
    });

    attachBlurValidation('lastName', 'lastNameError', function (v) {
      return v.trim() ? '' : 'Last name is required.';
    });

    attachBlurValidation('regEmail', 'regEmailError', function (v) {
      if (!v.trim()) return 'Email is required.';
      if (!isValidEmail(v)) return 'Enter a valid email address.';
      return '';
    });

    attachBlurValidation('regPassword', 'regPasswordError', function (v) {
      if (!v) return 'Password is required.';
      if (v.length < 8) return 'Password must be at least 8 characters.';
      return '';
    });

    attachBlurValidation('confirmPassword', 'confirmPasswordError', function (v) {
      const pass = $('regPassword');
      if (!v) return 'Please confirm your password.';
      if (v !== pass.value) return 'Passwords do not match.';
      return '';
    });

    registerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let valid = true;

      /* First name */
      const fn = $('firstName'), fnErr = $('firstNameError');
      if (!fn.value.trim()) { setError(fn, fnErr, 'First name is required.'); valid = false; }
      else setValid(fn, fnErr);

      /* Last name */
      const ln = $('lastName'), lnErr = $('lastNameError');
      if (!ln.value.trim()) { setError(ln, lnErr, 'Last name is required.'); valid = false; }
      else setValid(ln, lnErr);

      /* Email */
      const em = $('regEmail'), emErr = $('regEmailError');
      if (!em.value.trim()) { setError(em, emErr, 'Email is required.'); valid = false; }
      else if (!isValidEmail(em.value)) { setError(em, emErr, 'Enter a valid email address.'); valid = false; }
      else setValid(em, emErr);

      /* Department */
      const dept = $('department'), deptErr = $('departmentError');
      if (!dept.value) { setError(dept, deptErr, 'Please select a department.'); valid = false; }
      else setValid(dept, deptErr);

      /* Password */
      const pw = $('regPassword'), pwErr = $('regPasswordError');
      if (!pw.value) { setError(pw, pwErr, 'Password is required.'); valid = false; }
      else if (pw.value.length < 8) { setError(pw, pwErr, 'Password must be at least 8 characters.'); valid = false; }
      else setValid(pw, pwErr);

      /* Confirm password */
      const cpw = $('confirmPassword'), cpwErr = $('confirmPasswordError');
      if (!cpw.value) { setError(cpw, cpwErr, 'Please confirm your password.'); valid = false; }
      else if (cpw.value !== pw.value) { setError(cpw, cpwErr, 'Passwords do not match.'); valid = false; }
      else setValid(cpw, cpwErr);

      /* Terms */
      const terms = $('terms'), termsErr = $('termsError');
      if (!terms.checked) {
        termsErr.textContent = 'You must accept the terms to continue.'; valid = false;
      } else {
        termsErr.textContent = '';
      }

      if (!valid) return;

      /* Simulate registration */
      const btn = $('registerBtn');
      btn.classList.add('loading');
      btn.disabled = true;

      setTimeout(function () {
        btn.classList.remove('loading');
        btn.disabled = false;
        /* Show success modal */
        const modal = $('successModal');
        if (modal) modal.classList.add('active');
      }, 1800);
    });

    /* Close modal on overlay click */
    const modal = $('successModal');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) modal.classList.remove('active');
      });
    }
  }

})();

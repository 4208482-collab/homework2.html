// validate.js - MIS3371 Homework 3
// Author: Hussain
// All validation done with JavaScript on the fly (oninput / onblur / onkeyup)

// ─── Helpers ───────────────────────────────────────────────────────────────

function showErr(id, msg) {
  var el = document.getElementById(id);
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function hideErr(id) {
  var el = document.getElementById(id);
  if (el) { el.style.display = 'none'; }
}

function markValid(inputEl) {
  inputEl.classList.remove('invalid');
  inputEl.classList.add('valid');
}

function markInvalid(inputEl) {
  inputEl.classList.remove('valid');
  inputEl.classList.add('invalid');
}

// ─── Date helpers ──────────────────────────────────────────────────────────

function getTodayStr() {
  var d = new Date();
  var mm = String(d.getMonth() + 1).padStart(2, '0');
  var dd = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + mm + '-' + dd;
}

function getMinDOB() {
  var d = new Date();
  d.setFullYear(d.getFullYear() - 120);
  var mm = String(d.getMonth() + 1).padStart(2, '0');
  var dd = String(d.getDate()).padStart(2, '0');
  return d.getFullYear() + '-' + mm + '-' + dd;
}

// ─── SSN auto-format as you type ──────────────────────────────────────────

function formatSSN() {
  var el = document.getElementById('patientId');
  var digits = el.value.replace(/\D/g, '').substring(0, 9);
  var formatted = digits;
  if (digits.length > 5) {
    formatted = digits.substring(0,3) + '-' + digits.substring(3,5) + '-' + digits.substring(5);
  } else if (digits.length > 3) {
    formatted = digits.substring(0,3) + '-' + digits.substring(3);
  }
  el.value = formatted;
  validateSSN();
}

function validateSSN() {
  var el = document.getElementById('patientId');
  var digits = el.value.replace(/\D/g, '');
  if (digits.length === 0) {
    markInvalid(el); showErr('err_patientId', 'Patient ID is required.');
    return false;
  }
  if (digits.length !== 9) {
    markInvalid(el); showErr('err_patientId', 'Must be exactly 9 digits (format: 123-45-6789).');
    return false;
  }
  markValid(el); hideErr('err_patientId'); return true;
}

// ─── Field validators ──────────────────────────────────────────────────────

function validateFirstName() {
  var el = document.getElementById('firstName');
  var val = el.value.trim();
  if (val.length === 0) {
    markInvalid(el); showErr('err_firstName', 'First name is required.');
    return false;
  }
  if (val.length > 30) {
    markInvalid(el); showErr('err_firstName', 'Maximum 30 characters allowed.');
    return false;
  }
  if (!/^[A-Za-z'\-]+$/.test(val)) {
    markInvalid(el); showErr('err_firstName', 'Letters, apostrophes, and dashes only.');
    return false;
  }
  markValid(el); hideErr('err_firstName'); return true;
}

function validateMiddleInitial() {
  var el = document.getElementById('middleInitial');
  var val = el.value.trim();
  if (val === '') { markValid(el); hideErr('err_mi'); return true; }
  if (!/^[A-Za-z]$/.test(val)) {
    markInvalid(el); showErr('err_mi', 'Single letter only, no numbers.');
    return false;
  }
  markValid(el); hideErr('err_mi'); return true;
}

function validateLastName() {
  var el = document.getElementById('lastName');
  var val = el.value.trim();
  if (val.length === 0) {
    markInvalid(el); showErr('err_lastName', 'Last name is required.');
    return false;
  }
  if (val.length > 30) {
    markInvalid(el); showErr('err_lastName', 'Maximum 30 characters allowed.');
    return false;
  }
  if (!/^[A-Za-z'\-]+$/.test(val)) {
    markInvalid(el); showErr('err_lastName', 'Letters, apostrophes, and dashes only.');
    return false;
  }
  markValid(el); hideErr('err_lastName'); return true;
}

function validateDOB() {
  var el = document.getElementById('dob');
  var val = el.value;
  if (!val) {
    markInvalid(el); showErr('err_dob', 'Date of birth is required.');
    return false;
  }
  var today = new Date(); today.setHours(0,0,0,0);
  var chosen = new Date(val + 'T00:00:00');
  var minDate = new Date(); minDate.setFullYear(minDate.getFullYear() - 120); minDate.setHours(0,0,0,0);
  if (chosen >= today) {
    markInvalid(el); showErr('err_dob', 'Date of birth cannot be today or in the future.');
    return false;
  }
  if (chosen < minDate) {
    markInvalid(el); showErr('err_dob', 'Cannot be more than 120 years ago.');
    return false;
  }
  markValid(el); hideErr('err_dob'); return true;
}

function validateEmail() {
  var el = document.getElementById('email');
  var val = el.value.trim();
  if (!val) {
    markInvalid(el); showErr('err_email', 'Email address is required.');
    return false;
  }
  el.value = val.toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val.toLowerCase())) {
    markInvalid(el); showErr('err_email', 'Must be in the format name@domain.tld');
    return false;
  }
  markValid(el); hideErr('err_email'); return true;
}

function validatePhone() {
  var el = document.getElementById('phone');
  var val = el.value.trim();
  if (!val) { markValid(el); hideErr('err_phone'); return true; }
  if (!/^\d{3}-\d{3}-\d{4}$/.test(val)) {
    markInvalid(el); showErr('err_phone', 'Format must be 000-000-0000');
    return false;
  }
  markValid(el); hideErr('err_phone'); return true;
}

function validateAddress1() {
  var el = document.getElementById('address1');
  var val = el.value.trim();
  if (val.length < 2) {
    markInvalid(el); showErr('err_address1', 'Required. At least 2 characters.');
    return false;
  }
  if (val.length > 30) {
    markInvalid(el); showErr('err_address1', 'Maximum 30 characters allowed.');
    return false;
  }
  markValid(el); hideErr('err_address1'); return true;
}

function validateAddress2() {
  var el = document.getElementById('address2');
  var val = el.value.trim();
  if (val === '') { markValid(el); hideErr('err_address2'); return true; }
  if (val.length < 2 || val.length > 30) {
    markInvalid(el); showErr('err_address2', 'If entered: 2 to 30 characters.');
    return false;
  }
  markValid(el); hideErr('err_address2'); return true;
}

function validateCity() {
  var el = document.getElementById('city');
  var val = el.value.trim();
  if (val.length < 2) {
    markInvalid(el); showErr('err_city', 'Required. At least 2 characters.');
    return false;
  }
  if (val.length > 30) {
    markInvalid(el); showErr('err_city', 'Maximum 30 characters allowed.');
    return false;
  }
  markValid(el); hideErr('err_city'); return true;
}

function validateState() {
  var el = document.getElementById('state');
  if (!el.value) {
    markInvalid(el); showErr('err_state', 'Please select a state.');
    return false;
  }
  markValid(el); hideErr('err_state'); return true;
}

function validateZip() {
  var el = document.getElementById('zip');
  var val = el.value.trim();
  if (!val) {
    markInvalid(el); showErr('err_zip', 'ZIP code is required.');
    return false;
  }
  if (!/^\d{5}$/.test(val)) {
    markInvalid(el); showErr('err_zip', '5 digits only (e.g. 77004).');
    return false;
  }
  markValid(el); hideErr('err_zip'); return true;
}

function validateUserId() {
  var el = document.getElementById('userId');
  var val = el.value;
  if (val.length < 5) {
    markInvalid(el); showErr('err_userId', 'Must be at least 5 characters.');
    return false;
  }
  if (val.length > 20) {
    markInvalid(el); showErr('err_userId', 'Maximum 20 characters allowed.');
    return false;
  }
  if (/^\d/.test(val)) {
    markInvalid(el); showErr('err_userId', 'Cannot start with a number.');
    return false;
  }
  if (/\s/.test(val)) {
    markInvalid(el); showErr('err_userId', 'No spaces allowed.');
    return false;
  }
  if (!/^[A-Za-z][A-Za-z0-9_\-]*$/.test(val)) {
    markInvalid(el); showErr('err_userId', 'Letters, numbers, underscore, or dash only.');
    return false;
  }
  el.value = val.toLowerCase();
  markValid(el); hideErr('err_userId'); return true;
}

function validatePassword() {
  var el = document.getElementById('password');
  var val = el.value;
  var userId = document.getElementById('userId').value.toLowerCase();
  var firstName = document.getElementById('firstName').value.toLowerCase();
  var lastName = document.getElementById('lastName').value.toLowerCase();

  if (val.length < 8) {
    markInvalid(el); showErr('err_password', 'Must be at least 8 characters.');
    return false;
  }
  if (val.length > 30) {
    markInvalid(el); showErr('err_password', 'Cannot exceed 30 characters.');
    return false;
  }
  if (!/[A-Z]/.test(val)) {
    markInvalid(el); showErr('err_password', 'Must contain at least 1 uppercase letter.');
    return false;
  }
  if (!/[a-z]/.test(val)) {
    markInvalid(el); showErr('err_password', 'Must contain at least 1 lowercase letter.');
    return false;
  }
  if (!/[0-9]/.test(val)) {
    markInvalid(el); showErr('err_password', 'Must contain at least 1 number.');
    return false;
  }
  if (!/[!@#%^&*()\-_+=\/><.,`~]/.test(val)) {
    markInvalid(el); showErr('err_password', 'Must contain at least 1 special character (e.g. !@#$).');
    return false;
  }
  if (/"/.test(val)) {
    markInvalid(el); showErr('err_password', 'Double quotes are not allowed.');
    return false;
  }
  var lowerVal = val.toLowerCase();
  if (userId && lowerVal === userId) {
    markInvalid(el); showErr('err_password', 'Password cannot equal your User ID.');
    return false;
  }
  if (userId && lowerVal.includes(userId)) {
    markInvalid(el); showErr('err_password', 'Password cannot contain your User ID.');
    return false;
  }
  if (firstName && firstName.length >= 3 && lowerVal.includes(firstName)) {
    markInvalid(el); showErr('err_password', 'Password cannot contain your first name.');
    return false;
  }
  if (lastName && lastName.length >= 3 && lowerVal.includes(lastName)) {
    markInvalid(el); showErr('err_password', 'Password cannot contain your last name.');
    return false;
  }
  markValid(el); hideErr('err_password'); return true;
}

function validatePasswordConfirm() {
  var el = document.getElementById('passwordConfirm');
  var pw1 = document.getElementById('password').value;
  var pw2 = el.value;
  if (!pw2) {
    markInvalid(el); showErr('err_passwordConfirm', 'Please re-enter your password.');
    return false;
  }
  if (pw1 !== pw2) {
    markInvalid(el); showErr('err_passwordConfirm', 'Passwords do not match.');
    return false;
  }
  markValid(el); hideErr('err_passwordConfirm'); return true;
}

// ─── Salary slider ─────────────────────────────────────────────────────────

function updateSalaryDisplay() {
  var slider = document.getElementById('salarySlider');
  var display = document.getElementById('salaryDisplay');
  var val = parseInt(slider.value, 10);
  display.textContent = '$' + val.toLocaleString() + ' / year';
}

// ─── Review panel ──────────────────────────────────────────────────────────

function buildReview() {
  var rows = [];
  function row(label, value, pass, note) {
    var s = pass
      ? '<span class="status-pass">&#10004; pass</span>'
      : '<span class="status-error">&#10008; ERROR' + (note ? ': ' + note : '') + '</span>';
    return '<tr><td>' + label + '</td><td>' + (value || '<em>&mdash;</em>') + '</td><td>' + s + '</td></tr>';
  }

  var fn = document.getElementById('firstName').value.trim();
  var mi = document.getElementById('middleInitial').value.trim();
  var ln = document.getElementById('lastName').value.trim();
  var nameOk = validateFirstName() & validateMiddleInitial() & validateLastName();
  rows.push(row('Full Name', fn + (mi ? ' ' + mi + '.' : '') + (ln ? ' ' + ln : ''), nameOk));

  var dobOk = validateDOB();
  rows.push(row('Date of Birth', document.getElementById('dob').value, dobOk, dobOk ? '' : 'Invalid or out of range'));

  var pidOk = validateSSN();
  rows.push(row('Patient ID', '(obscured)', pidOk, pidOk ? '' : '9 digits required'));

  var emailOk = validateEmail();
  rows.push(row('Email', document.getElementById('email').value, emailOk));

  var phoneOk = validatePhone();
  rows.push(row('Phone', document.getElementById('phone').value || '&mdash;', phoneOk));

  var addrOk = validateAddress1() & validateCity() & validateState() & validateZip();
  var addrStr = document.getElementById('address1').value.trim();
  var a2 = document.getElementById('address2').value.trim();
  if (a2) addrStr += ', ' + a2;
  addrStr += ', ' + document.getElementById('city').value.trim() + ', ' + document.getElementById('state').value + ' ' + document.getElementById('zip').value.trim();
  rows.push(row('Address', addrStr, addrOk));

  var checks = ['history_diabetes','history_hypertension','history_asthma','history_allergies','history_heart','history_covid'];
  var clabels = ['Diabetes','Hypertension','Asthma','Allergies','Heart Disease','COVID-19'];
  var cl = checks.map(function(id, i) {
    return document.querySelector('input[name="' + id + '"]').checked ? clabels[i] : null;
  }).filter(Boolean);
  rows.push(row('Medical History', cl.length ? cl.join(', ') : 'None', true));

  var gEl = document.querySelector('input[name="gender"]:checked');
  rows.push(row('Gender', gEl ? gEl.value : '&mdash;', !!gEl, gEl ? '' : 'No selection'));

  var vEl = document.querySelector('input[name="vaccinated"]:checked');
  rows.push(row('Vaccinated', vEl ? vEl.value : '&mdash;', !!vEl, vEl ? '' : 'No selection'));

  var iEl = document.querySelector('input[name="insurance"]:checked');
  rows.push(row('Insurance', iEl ? iEl.value : '&mdash;', !!iEl, iEl ? '' : 'No selection'));

  rows.push(row('Desired Salary', '$' + parseInt(document.getElementById('salarySlider').value).toLocaleString() + ' / year', true));

  var symp = document.getElementById('symptoms').value.trim();
  rows.push(row('Current Symptoms', symp || '(none)', true));

  var uidOk = validateUserId();
  rows.push(row('User ID', document.getElementById('userId').value, uidOk));

  var pwOk = validatePassword();
  var pw2Ok = validatePasswordConfirm();
  rows.push(row('Password', pwOk ? '(meets all requirements)' : '(see error)', pwOk));
  rows.push(row('Passwords Match', pw2Ok ? 'Yes' : 'No', pw2Ok));

  return rows.join('');
}

function handleReview() {
  var panel = document.getElementById('reviewPanel');
  var tbody = document.getElementById('reviewBody');
  tbody.innerHTML = buildReview();
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth' });
}

// ─── Validate button ───────────────────────────────────────────────────────

function runAllValidators() {
  var results = [
    validateFirstName(),
    validateMiddleInitial(),
    validateLastName(),
    validateDOB(),
    validateSSN(),
    validateEmail(),
    validatePhone(),
    validateAddress1(),
    validateAddress2(),
    validateCity(),
    validateState(),
    validateZip(),
    validateUserId(),
    validatePassword(),
    validatePasswordConfirm()
  ];
  return results.filter(function(r) { return !r; }).length;
}

function handleValidate() {
  var errors = runAllValidators();
  var submitBtn = document.getElementById('submitBtn');
  var validateMsg = document.getElementById('validateMsg');

  if (errors === 0) {
    submitBtn.style.display = 'inline-block';
    validateMsg.textContent = 'All fields look good! You can now submit.';
    validateMsg.style.color = '#2e7d32';
  } else {
    submitBtn.style.display = 'none';
    validateMsg.textContent = errors + ' error' + (errors > 1 ? 's' : '') + ' found. Please fix the highlighted fields.';
    validateMsg.style.color = '#c8102e';
    var firstErr = document.querySelector('.invalid');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ─── DOM Ready ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {

  // Banner date
  var dateSpan = document.getElementById('todayDate');
  if (dateSpan) {
    var today = new Date();
    var weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    function suffix(d) {
      if (d >= 11 && d <= 13) return 'th';
      return ['th','st','nd','rd'][d % 10] || 'th';
    }
    dateSpan.textContent = weekdays[today.getDay()] + ', ' + months[today.getMonth()] + ' ' + today.getDate() + suffix(today.getDate()) + ', ' + today.getFullYear();
  }

  // DOB range
  var dobEl = document.getElementById('dob');
  if (dobEl) { dobEl.max = getTodayStr(); dobEl.min = getMinDOB(); dobEl.addEventListener('change', validateDOB); dobEl.addEventListener('blur', validateDOB); }

  // oninput + onblur for text fields
  var inputMap = {
    'firstName': validateFirstName, 'middleInitial': validateMiddleInitial,
    'lastName': validateLastName, 'email': validateEmail, 'phone': validatePhone,
    'address1': validateAddress1, 'address2': validateAddress2,
    'city': validateCity, 'zip': validateZip, 'userId': validateUserId
  };
  Object.keys(inputMap).forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', inputMap[id]);
    el.addEventListener('blur', inputMap[id]);
  });

  // State
  var stateEl = document.getElementById('state');
  if (stateEl) stateEl.addEventListener('change', validateState);

  // SSN
  var ssnEl = document.getElementById('patientId');
  if (ssnEl) { ssnEl.addEventListener('input', formatSSN); ssnEl.addEventListener('blur', validateSSN); }

  // Password live
  var pwEl = document.getElementById('password');
  if (pwEl) { pwEl.addEventListener('keyup', validatePassword); pwEl.addEventListener('blur', validatePassword); }
  var pw2El = document.getElementById('passwordConfirm');
  if (pw2El) { pw2El.addEventListener('keyup', validatePasswordConfirm); pw2El.addEventListener('blur', validatePasswordConfirm); }

  // Slider
  var sliderEl = document.getElementById('salarySlider');
  if (sliderEl) { sliderEl.addEventListener('input', updateSalaryDisplay); updateSalaryDisplay(); }

  // Buttons
  document.getElementById('validateBtn').addEventListener('click', handleValidate);
  document.getElementById('reviewBtn').addEventListener('click', handleReview);
});

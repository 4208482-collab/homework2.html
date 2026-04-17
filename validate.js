// validate.js - MIS3371 Homework 2
// Author: Hussain
// External validation module

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

// ─── Field validators ──────────────────────────────────────────────────────

function validateFirstName() {
  var el = document.getElementById('firstName');
  var val = el.value.trim();
  if (val.length < 1 || val.length > 30) {
    markInvalid(el); showErr('err_firstName', 'Required. 1–30 characters.');
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
  if (val === '') { markValid(el); hideErr('err_mi'); return true; } // optional
  if (!/^[A-Za-z]$/.test(val)) {
    markInvalid(el); showErr('err_mi', 'Single letter only.');
    return false;
  }
  markValid(el); hideErr('err_mi'); return true;
}

function validateLastName() {
  var el = document.getElementById('lastName');
  var val = el.value.trim();
  if (val.length < 1 || val.length > 30) {
    markInvalid(el); showErr('err_lastName', 'Required. 1–30 characters.');
    return false;
  }
  if (!/^[A-Za-z'\-2-5]+$/.test(val)) {
    markInvalid(el); showErr('err_lastName', 'Letters, apostrophes, dashes, or numbers 2–5 only.');
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
    markInvalid(el); showErr('err_dob', 'Date of birth cannot be more than 120 years ago.');
    return false;
  }
  markValid(el); hideErr('err_dob'); return true;
}

function validatePatientId() {
  var el = document.getElementById('patientId');
  var val = el.value;
  if (val.length < 9 || val.length > 11) {
    markInvalid(el); showErr('err_patientId', '9 to 11 characters required.');
    return false;
  }
  markValid(el); hideErr('err_patientId'); return true;
}

function validateEmail() {
  var el = document.getElementById('email');
  var val = el.value.trim();
  if (!val) {
    markInvalid(el); showErr('err_email', 'Email is required.');
    return false;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    markInvalid(el); showErr('err_email', 'Must be in name@domain.tld format.');
    return false;
  }
  markValid(el); hideErr('err_email'); return true;
}

function validatePhone() {
  var el = document.getElementById('phone');
  var val = el.value.trim();
  if (!val) { markValid(el); hideErr('err_phone'); return true; } // optional
  if (!/^\d{3}-\d{3}-\d{4}$/.test(val)) {
    markInvalid(el); showErr('err_phone', 'Format: 000-000-0000');
    return false;
  }
  markValid(el); hideErr('err_phone'); return true;
}

function validateAddress1() {
  var el = document.getElementById('address1');
  var val = el.value.trim();
  if (val.length < 2 || val.length > 30) {
    markInvalid(el); showErr('err_address1', 'Required. 2–30 characters.');
    return false;
  }
  markValid(el); hideErr('err_address1'); return true;
}

function validateAddress2() {
  var el = document.getElementById('address2');
  var val = el.value.trim();
  if (val === '') { markValid(el); hideErr('err_address2'); return true; }
  if (val.length < 2 || val.length > 30) {
    markInvalid(el); showErr('err_address2', 'If entered: 2–30 characters.');
    return false;
  }
  markValid(el); hideErr('err_address2'); return true;
}

function validateCity() {
  var el = document.getElementById('city');
  var val = el.value.trim();
  if (val.length < 2 || val.length > 30) {
    markInvalid(el); showErr('err_city', 'Required. 2–30 characters.');
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
  if (!/^\d{5}(-\d{4})?$/.test(val)) {
    markInvalid(el); showErr('err_zip', 'Format: 77004 or 77004-1234');
    return false;
  }
  // truncate to 5 digits and redisplay
  el.value = val.substring(0, 5);
  markValid(el); hideErr('err_zip'); return true;
}

function validateUserId() {
  var el = document.getElementById('userId');
  var val = el.value;
  if (val.length < 5 || val.length > 30) {
    markInvalid(el); showErr('err_userId', '5–30 characters required.');
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
  // force lowercase
  el.value = val.toLowerCase();
  markValid(el); hideErr('err_userId'); return true;
}

function validatePassword() {
  var el = document.getElementById('password');
  var val = el.value;
  var userId = document.getElementById('userId').value.toLowerCase();
  var firstName = document.getElementById('firstName').value.toLowerCase();
  var lastName = document.getElementById('lastName').value.toLowerCase();

  if (val.length < 8 || val.length > 30) {
    markInvalid(el); showErr('err_password', '8–30 characters required.');
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
    markInvalid(el); showErr('err_password', 'Must contain at least 1 special character.');
    return false;
  }
  if (/"/.test(val)) {
    markInvalid(el); showErr('err_password', 'Double quotes (") are not allowed.');
    return false;
  }
  var lowerVal = val.toLowerCase();
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

// ─── Review panel builder ──────────────────────────────────────────────────

function buildReview() {
  var rows = [];

  function row(label, value, pass, note) {
    var statusHtml = pass
      ? '<span class="status-pass">✔ pass</span>'
      : '<span class="status-error">✖ ERROR' + (note ? ': ' + note : '') + '</span>';
    var noteHtml = (!pass && note) ? '' : (note ? '<div class="review-note">' + note + '</div>' : '');
    return '<tr><td>' + label + '</td><td>' + (value || '<em>—</em>') + noteHtml + '</td><td>' + statusHtml + '</td></tr>';
  }

  // Name
  var fn = document.getElementById('firstName').value.trim();
  var mi = document.getElementById('middleInitial').value.trim();
  var ln = document.getElementById('lastName').value.trim();
  var fullName = fn + (mi ? ' ' + mi + '.' : '') + (ln ? ' ' + ln : '');
  var nameOk = validateFirstName() & validateMiddleInitial() & validateLastName();
  rows.push(row('Full Name', fullName, nameOk));

  // DOB
  var dobVal = document.getElementById('dob').value;
  var dobOk = validateDOB();
  rows.push(row('Date of Birth', dobVal, dobOk, dobOk ? '' : 'Invalid or out of range'));

  // Patient ID
  var pidOk = validatePatientId();
  rows.push(row('Patient ID', '(obscured)', pidOk, pidOk ? '' : '9–11 characters required'));

  // Email
  var emailVal = document.getElementById('email').value.trim();
  var emailOk = validateEmail();
  rows.push(row('Email', emailVal, emailOk));

  // Phone
  var phoneVal = document.getElementById('phone').value.trim();
  var phoneOk = validatePhone();
  rows.push(row('Phone', phoneVal || '—', phoneOk));

  // Address
  var a1 = document.getElementById('address1').value.trim();
  var a2 = document.getElementById('address2').value.trim();
  var cityVal = document.getElementById('city').value.trim();
  var stateVal = document.getElementById('state').value;
  var zipVal = document.getElementById('zip').value.trim();
  var addrOk = validateAddress1() & validateCity() & validateState() & validateZip();
  var addrStr = a1 + (a2 ? ', ' + a2 : '') + ', ' + cityVal + ', ' + stateVal + ' ' + zipVal;
  rows.push(row('Address', addrStr, addrOk));

  // Medical history checkboxes
  var checks = ['history_diabetes','history_hypertension','history_asthma','history_allergies','history_heart'];
  var labels = ['Diabetes','Hypertension','Asthma','Allergies','Heart Disease'];
  var checkedList = [];
  checks.forEach(function(id, i) {
    if (document.querySelector('input[name="' + id + '"]').checked) checkedList.push(labels[i]);
  });
  rows.push(row('Medical History', checkedList.length ? checkedList.join(', ') : 'None selected', true));

  // Gender
  var genderEl = document.querySelector('input[name="gender"]:checked');
  rows.push(row('Gender', genderEl ? genderEl.value : '—', !!genderEl, genderEl ? '' : 'No selection'));

  // Vaccinated
  var vaccEl = document.querySelector('input[name="vaccinated"]:checked');
  rows.push(row('Vaccinated (COVID-19)', vaccEl ? vaccEl.value : '—', !!vaccEl, vaccEl ? '' : 'No selection'));

  // Insurance
  var insEl = document.querySelector('input[name="insurance"]:checked');
  rows.push(row('Insurance Coverage', insEl ? insEl.value : '—', !!insEl, insEl ? '' : 'No selection'));

  // Salary slider
  var sliderVal = document.getElementById('salarySlider').value;
  rows.push(row('Desired Salary', '$' + parseInt(sliderVal).toLocaleString() + ' / year', true));

  // Symptoms
  var sympVal = document.getElementById('symptoms').value.trim();
  rows.push(row('Current Symptoms', sympVal || '(none entered)', true));

  // User ID
  var uidOk = validateUserId();
  var uidVal = document.getElementById('userId').value;
  rows.push(row('User ID', uidVal, uidOk));

  // Password
  var pwOk = validatePassword();
  var pw2Ok = validatePasswordConfirm();
  rows.push(row('Password', pwOk ? '(meets requirements)' : '(see error above)', pwOk));
  rows.push(row('Passwords Match', pw2Ok ? 'Yes' : 'No', pw2Ok));

  return rows.join('');
}

// ─── Review button handler ─────────────────────────────────────────────────

function handleReview() {
  var panel = document.getElementById('reviewPanel');
  var tbody = document.getElementById('reviewBody');
  tbody.innerHTML = buildReview();
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth' });
}

// ─── Submit handler ────────────────────────────────────────────────────────

function handleSubmit(e) {
  e.preventDefault();
  var ok = true;
  ok = validateFirstName()     && ok;
  ok = validateMiddleInitial() && ok;
  ok = validateLastName()      && ok;
  ok = validateDOB()           && ok;
  ok = validatePatientId()     && ok;
  ok = validateEmail()         && ok;
  ok = validatePhone()         && ok;
  ok = validateAddress1()      && ok;
  ok = validateAddress2()      && ok;
  ok = validateCity()          && ok;
  ok = validateState()         && ok;
  ok = validateZip()           && ok;
  ok = validateUserId()        && ok;
  ok = validatePassword()      && ok;
  ok = validatePasswordConfirm() && ok;

  if (ok) {
    alert('Form submitted successfully!');
  } else {
    alert('Please fix the errors highlighted in red before submitting.');
    // scroll to first error
    var firstErr = document.querySelector('.invalid');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ─── Attach listeners on DOM ready ────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {

  // Date display in banner
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

  // Set DOB min/max dynamically
  var dobEl = document.getElementById('dob');
  if (dobEl) {
    dobEl.max = getTodayStr();
    dobEl.min = getMinDOB();
  }

  // Inline validators on blur
  var blurMap = {
    'firstName':       validateFirstName,
    'middleInitial':   validateMiddleInitial,
    'lastName':        validateLastName,
    'dob':             validateDOB,
    'patientId':       validatePatientId,
    'email':           validateEmail,
    'phone':           validatePhone,
    'address1':        validateAddress1,
    'address2':        validateAddress2,
    'city':            validateCity,
    'zip':             validateZip,
    'userId':          validateUserId,
    'password':        validatePassword,
    'passwordConfirm': validatePasswordConfirm
  };

  Object.keys(blurMap).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('blur', blurMap[id]);
  });

  var stateEl = document.getElementById('state');
  if (stateEl) stateEl.addEventListener('change', validateState);

  // Password live check on keyup
  var pwEl = document.getElementById('password');
  if (pwEl) pwEl.addEventListener('keyup', validatePassword);

  var pw2El = document.getElementById('passwordConfirm');
  if (pw2El) pw2El.addEventListener('keyup', validatePasswordConfirm);

  // Salary slider
  var sliderEl = document.getElementById('salarySlider');
  if (sliderEl) {
    sliderEl.addEventListener('input', updateSalaryDisplay);
    updateSalaryDisplay(); // init display
  }

  // Buttons
  var form = document.getElementById('patientForm');
  if (form) form.addEventListener('submit', handleSubmit);

  var reviewBtn = document.getElementById('reviewBtn');
  if (reviewBtn) reviewBtn.addEventListener('click', handleReview);
});

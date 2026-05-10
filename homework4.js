/* ============================================================
   homework4.js  –  Cougar Care Medical  (MIS 3371 HW4)
   Covers: Cookies, localStorage, Fetch, validation, review
   ============================================================ */

/* ─── COOKIE HELPERS ──────────────────────────────────────── */
function setCookie(name, value, hours) {
  const d = new Date();
  d.setTime(d.getTime() + hours * 3600 * 1000);
  document.cookie = name + "=" + encodeURIComponent(value) +
                    ";expires=" + d.toUTCString() + ";path=/";
}

function getCookie(name) {
  const prefix = name + "=";
  const decoded = decodeURIComponent(document.cookie);
  for (const part of decoded.split(";")) {
    const p = part.trimStart();
    if (p.startsWith(prefix)) return p.substring(prefix.length);
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
}

/* ─── LOCAL STORAGE HELPERS ───────────────────────────────── */
const LS_KEY = "ccm_form_data";

function saveToLS(fieldId, value) {
  let data = {};
  try { data = JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch(e) {}
  data[fieldId] = value;
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function loadFromLS() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch(e) { return {}; }
}

function clearLS() {
  localStorage.removeItem(LS_KEY);
}

/* ─── FETCH STATE LIST ─────────────────────────────────────── */
async function loadStates() {
  const sel = document.getElementById("state");
  if (!sel) return;
  try {
    const res = await fetch("states.html");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const html = await res.text();
    sel.innerHTML = html;
  } catch (err) {
    console.error("Fetch states failed:", err);
    sel.innerHTML = '<option value="">Could not load states</option>';
  }
}

/* ─── COOKIE / WELCOME LOGIC ──────────────────────────────── */
function initWelcome() {
  const firstName = getCookie("ccm_firstname");
  const welcomeEl  = document.getElementById("welcome-msg");
  const notYouBox  = document.getElementById("not-you-box");

  if (firstName) {
    welcomeEl.textContent = "Welcome back, " + firstName + "!";
    notYouBox.style.display = "inline-block";
    notYouBox.textContent   = "Not " + firstName + "? Click here to start as a new user";

    // Pre-fill first name field
    const fnInput = document.getElementById("firstName");
    if (fnInput) fnInput.value = firstName;

    // Restore all other fields from localStorage
    restoreFromLS();
  } else {
    welcomeEl.textContent  = "Welcome, New User!";
    notYouBox.style.display = "none";
  }
}

function newUserReset() {
  if (!confirm("Start over as a new user? This will clear all saved data.")) return;
  deleteCookie("ccm_firstname");
  clearLS();
  document.getElementById("hw4form").reset();
  document.getElementById("not-you-box").style.display = "none";
  document.getElementById("welcome-msg").textContent = "Welcome, New User!";
  clearValidation();
}

/* ─── RESTORE FORM FROM LOCAL STORAGE ─────────────────────── */
function restoreFromLS() {
  const data = loadFromLS();
  for (const [id, val] of Object.entries(data)) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (el.type === "checkbox" || el.type === "radio") {
      el.checked = (val === true || val === "true");
    } else {
      el.value = val;
    }
  }
  // restore checkboxes by name arrays stored as JSON
  const cbNames = ["conditions"];
  cbNames.forEach(name => {
    const saved = data["cb_" + name];
    if (!saved) return;
    let arr;
    try { arr = JSON.parse(saved); } catch(e) { return; }
    document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
      cb.checked = arr.includes(cb.value);
    });
  });
  // restore radios
  ["gender","insurance","vaccinated"].forEach(name => {
    const val = data["radio_" + name];
    if (!val) return;
    const rb = document.querySelector(`input[name="${name}"][value="${val}"]`);
    if (rb) rb.checked = true;
  });
  // slider
  if (data["healthSlider"]) {
    const sl = document.getElementById("healthSlider");
    if (sl) { sl.value = data["healthSlider"]; document.getElementById("healthVal").textContent = data["healthSlider"]; }
  }
}

/* ─── AUTO-SAVE ON BLUR / INPUT ───────────────────────────── */
function attachAutoSave() {
  const fields = ["firstName","mi","lastName","dob","phone","email","address","city","state","zip",
                  "username","comments","healthSlider"];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const evt = (el.type === "range") ? "input" : "blur";
    el.addEventListener(evt, () => {
      if (isRememberChecked()) saveToLS(id, el.value);
    });
  });

  // checkboxes
  document.querySelectorAll('input[name="conditions"]').forEach(cb => {
    cb.addEventListener("change", () => {
      if (!isRememberChecked()) return;
      const checked = [...document.querySelectorAll('input[name="conditions"]:checked')].map(c => c.value);
      saveToLS("cb_conditions", JSON.stringify(checked));
    });
  });

  // radios
  ["gender","insurance","vaccinated"].forEach(name => {
    document.querySelectorAll(`input[name="${name}"]`).forEach(rb => {
      rb.addEventListener("change", () => {
        if (isRememberChecked()) saveToLS("radio_" + name, rb.value);
      });
    });
  });

  // slider label
  const sl = document.getElementById("healthSlider");
  if (sl) sl.addEventListener("input", () => {
    document.getElementById("healthVal").textContent = sl.value;
    if (isRememberChecked()) saveToLS("healthSlider", sl.value);
  });

  // Remember Me toggle
  const remCb = document.getElementById("rememberMe");
  if (remCb) {
    remCb.addEventListener("change", () => {
      if (!remCb.checked) {
        deleteCookie("ccm_firstname");
        clearLS();
      } else {
        // immediately save current first name
        const fn = document.getElementById("firstName").value.trim();
        if (fn) {
          setCookie("ccm_firstname", fn, 48);
          saveToLS("firstName", fn);
        }
      }
    });
  }

  // Save cookie on first name blur
  const fnInput = document.getElementById("firstName");
  if (fnInput) {
    fnInput.addEventListener("blur", () => {
      if (!isRememberChecked()) return;
      const fn = fnInput.value.trim();
      if (fn) setCookie("ccm_firstname", fn, 48);
    });
  }
}

function isRememberChecked() {
  const cb = document.getElementById("rememberMe");
  return cb ? cb.checked : false;
}

/* ─── VALIDATION ───────────────────────────────────────────── */
const rules = {
  firstName:  { req: true, min: 2,  msg: "At least 2 chars" },
  lastName:   { req: true, min: 2,  msg: "At least 2 chars" },
  dob:        { req: true,           msg: "Date of birth required" },
  phone:      { req: true, regex: /^\d{3}-\d{3}-\d{4}$/, msg: "Format: 123-456-7890" },
  email:      { req: true, regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, msg: "Valid email required" },
  address:    { req: true, min: 5,   msg: "Enter a valid address" },
  city:       { req: true, min: 2,   msg: "Enter a city" },
  state:      { req: true,           msg: "Select a state" },
  zip:        { req: true, regex: /^\d{5}(-\d{4})?$/, msg: "5-digit ZIP required" },
  username:   { req: true, min: 4,   msg: "At least 4 chars" }
};

function validateField(id) {
  const el  = document.getElementById(id);
  const wrap = el ? el.closest(".field") : null;
  if (!el || !wrap) return true;
  const rule = rules[id];
  if (!rule) return true;
  const val = el.value.trim();
  let ok = true;
  let msg = "";
  if (rule.req && !val)         { ok = false; msg = rule.msg; }
  else if (val && rule.min && val.length < rule.min) { ok = false; msg = rule.msg; }
  else if (val && rule.regex && !rule.regex.test(val)) { ok = false; msg = rule.msg; }
  wrap.classList.toggle("valid",   ok && val.length > 0);
  wrap.classList.toggle("invalid", !ok);
  const hint = wrap.querySelector(".hint");
  if (hint) hint.textContent = ok ? (val ? "✓" : "") : "✗ " + msg;
  return ok;
}

function validateAll() {
  let allOk = true;
  for (const id of Object.keys(rules)) {
    if (!validateField(id)) allOk = false;
  }
  return allOk;
}

function clearValidation() {
  document.querySelectorAll(".field").forEach(f => {
    f.classList.remove("valid","invalid");
    const h = f.querySelector(".hint");
    if (h) h.textContent = "";
  });
  document.getElementById("review-section").style.display = "none";
  document.getElementById("submitBtn").style.display = "none";
}

function attachLiveValidation() {
  Object.keys(rules).forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("blur",  () => validateField(id));
    el.addEventListener("input", () => { if (el.classList.contains("invalid") || el.closest(".field").classList.contains("invalid")) validateField(id); });
  });

  // Phone auto-format
  const ph = document.getElementById("phone");
  if (ph) {
    ph.addEventListener("input", () => {
      let v = ph.value.replace(/\D/g,"").substring(0,10);
      if (v.length >= 7)      v = v.slice(0,3)+"-"+v.slice(3,6)+"-"+v.slice(6);
      else if (v.length >= 4) v = v.slice(0,3)+"-"+v.slice(3);
      ph.value = v;
    });
  }
}

/* ─── REVIEW TABLE ────────────────────────────────────────── */
function buildReview() {
  const allOk = validateAll();

  const section = document.getElementById("review-section");
  const tbody   = document.getElementById("review-tbody");
  section.style.display = "block";
  tbody.innerHTML = "";

  const rows = [
    ["First Name",   document.getElementById("firstName").value],
    ["MI",           document.getElementById("mi").value || "(none)"],
    ["Last Name",    document.getElementById("lastName").value],
    ["Date of Birth",document.getElementById("dob").value],
    ["Phone",        document.getElementById("phone").value],
    ["Email",        document.getElementById("email").value],
    ["Address",      document.getElementById("address").value],
    ["City",         document.getElementById("city").value],
    ["State",        document.getElementById("state").value],
    ["ZIP",          document.getElementById("zip").value],
    ["Username",     document.getElementById("username").value],
    ["Health Rating",document.getElementById("healthSlider").value],
    ["Gender",       getRadioVal("gender")],
    ["Insurance",    getRadioVal("insurance")],
    ["Vaccinated",   getRadioVal("vaccinated")],
    ["Conditions",   getChecked("conditions") || "(none selected)"],
    ["Comments",     document.getElementById("comments").value || "(none)"],
  ];

  rows.forEach(([label, val]) => {
    const hasRule = rules[labelToId(label)];
    const ok = !hasRule || val.trim().length > 0;
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><strong>${label}</strong></td><td>${val}</td>
                    <td class="${ok ? "status-pass":"status-error"}">${ok ? "PASS":"ERROR"}</td>`;
    tbody.appendChild(tr);
  });

  document.getElementById("submitBtn").style.display = allOk ? "inline-block" : "none";
}

function labelToId(label) {
  const map = {"First Name":"firstName","Last Name":"lastName","Date of Birth":"dob",
               "Phone":"phone","Email":"email","Address":"address","City":"city",
               "State":"state","ZIP":"zip","Username":"username"};
  return map[label] || "";
}

function getRadioVal(name) {
  const rb = document.querySelector(`input[name="${name}"]:checked`);
  return rb ? rb.value : "(not selected)";
}

function getChecked(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(c => c.value).join(", ");
}

/* ─── CLEAR FORM ───────────────────────────────────────────── */
function clearForm() {
  document.getElementById("hw4form").reset();
  clearValidation();
  document.getElementById("healthVal").textContent = "5";
}

/* ─── SUBMIT ───────────────────────────────────────────────── */
function submitForm() {
  if (!validateAll()) { alert("Please fix errors before submitting."); return; }
  // Save one last time if remember checked
  if (isRememberChecked()) {
    const fn = document.getElementById("firstName").value.trim();
    if (fn) setCookie("ccm_firstname", fn, 48);
  } else {
    deleteCookie("ccm_firstname");
    clearLS();
  }
  window.location.href = "thankyou4.html";
}

/* ─── INIT ─────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  loadStates();
  initWelcome();
  attachAutoSave();
  attachLiveValidation();

  document.getElementById("not-you-box").addEventListener("click", newUserReset);

  document.getElementById("reviewBtn").addEventListener("click", buildReview);
  document.getElementById("clearBtn").addEventListener("click", clearForm);
  document.getElementById("submitBtn").addEventListener("click", submitForm);
});

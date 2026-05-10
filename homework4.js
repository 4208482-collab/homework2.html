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
  // Fetch API loads states from external file; inline options are the fallback
  const sel = document.getElementById("state");
  if (!sel) return;
  try {
    const res = await fetch("states.html");
    if (!res.ok) throw new Error("HTTP " + res.status);
    const html = await res.text();
    // Only replace if fetch actually returned option tags
    if (html.includes("<option")) sel.innerHTML = html;
  } catch (err) {
    // Inline options already in HTML serve as fallback
    console.log("Fetch states: using inline fallback.", err.message);
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

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cougar Care Medical – Patient Registration (HW4)</title>
  <link rel="stylesheet" href="styles4.css">
</head>
<body>

  <!-- =============================================
       FIXED HEADER (content protection #1)
       Stays visible on scroll via position:fixed CSS
       ============================================= -->
  <header id="site-header">
    <h1>🏥 Cougar Care Medical</h1>
    <div id="header-right">
      <span id="welcome-msg">Welcome, New User!</span>
      <button id="not-you-box" style="display:none">Not you? Start as new user</button>
    </div>
  </header>

  <!-- =============================================
       MAIN SCROLLABLE CONTENT
       ============================================= -->
  <div class="container">

    <!-- ── IFRAME SECTION ──────────────────────────
         Shows UH's patient portal page as real-world
         context for the registration form.
         ──────────────────────────────────────────── -->
    <div class="iframe-section">
      <h2>🔗 UH Student Health Information (External Resource)</h2>
      <iframe
        src="https://www.youtube.com/embed/aUz-8uFiKMo"
        title="Understanding Your Health Insurance"
        loading="lazy"
        allowfullscreen>
      </iframe>
      <p style="font-size:0.75rem;color:#888;margin-top:6px;">
        Video: Understanding Health Insurance – a helpful resource for new patients
      </p>
    </div>

    <!-- ── PATIENT REGISTRATION FORM ────────────── -->
    <div class="form-card">
      <div class="form-card-header">Patient Registration Form</div>
      <div class="form-body">
        <form id="hw4form" novalidate>

          <!-- PERSONAL INFO -->
          <div class="section-label">Personal Information</div>
          <div class="form-row three">
            <div class="field" id="wrap-firstName">
              <label for="firstName">First Name *</label>
              <input type="text" id="firstName" name="firstName" placeholder="Jane">
              <span class="hint"></span>
            </div>
            <div class="field mi">
              <label for="mi">M.I.</label>
              <input type="text" id="mi" name="mi" maxlength="1" size="1" placeholder="A">
              <span class="hint"></span>
            </div>
            <div class="field" id="wrap-lastName">
              <label for="lastName">Last Name *</label>
              <input type="text" id="lastName" name="lastName" placeholder="Doe">
              <span class="hint"></span>
            </div>
          </div>
          <div class="form-row two">
            <div class="field">
              <label for="dob">Date of Birth *</label>
              <input type="date" id="dob" name="dob">
              <span class="hint"></span>
            </div>
            <div class="field">
              <label for="phone">Phone * (###-###-####)</label>
              <input type="tel" id="phone" name="phone" placeholder="713-000-0000">
              <span class="hint"></span>
            </div>
          </div>
          <div class="form-row single">
            <div class="field">
              <label for="email">Email Address *</label>
              <input type="email" id="email" name="email" placeholder="jane@example.com">
              <span class="hint"></span>
            </div>
          </div>

          <!-- GENDER -->
          <div class="section-label">Gender</div>
          <div class="radio-group">
            <label><input type="radio" name="gender" value="Male"> Male</label>
            <label><input type="radio" name="gender" value="Female"> Female</label>
            <label><input type="radio" name="gender" value="Non-binary"> Non-binary</label>
            <label><input type="radio" name="gender" value="Prefer not to say"> Prefer not to say</label>
          </div>

          <!-- ADDRESS -->
          <div class="section-label">Address</div>
          <div class="form-row single">
            <div class="field">
              <label for="address">Street Address *</label>
              <input type="text" id="address" name="address" placeholder="123 Main St">
              <span class="hint"></span>
            </div>
          </div>
          <div class="form-row three">
            <div class="field">
              <label for="city">City *</label>
              <input type="text" id="city" name="city" placeholder="Houston">
              <span class="hint"></span>
            </div>
            <div class="field">
              <label for="state">State *</label>
              <!-- Options loaded via Fetch API from states.html; inline fallback included -->
              <select id="state" name="state">
                <option value="">-- Select State --</option>
                <option value="AL">Alabama</option><option value="AK">Alaska</option><option value="AZ">Arizona</option><option value="AR">Arkansas</option><option value="CA">California</option><option value="CO">Colorado</option><option value="CT">Connecticut</option><option value="DE">Delaware</option><option value="FL">Florida</option><option value="GA">Georgia</option><option value="HI">Hawaii</option><option value="ID">Idaho</option><option value="IL">Illinois</option><option value="IN">Indiana</option><option value="IA">Iowa</option><option value="KS">Kansas</option><option value="KY">Kentucky</option><option value="LA">Louisiana</option><option value="ME">Maine</option><option value="MD">Maryland</option><option value="MA">Massachusetts</option><option value="MI">Michigan</option><option value="MN">Minnesota</option><option value="MS">Mississippi</option><option value="MO">Missouri</option><option value="MT">Montana</option><option value="NE">Nebraska</option><option value="NV">Nevada</option><option value="NH">New Hampshire</option><option value="NJ">New Jersey</option><option value="NM">New Mexico</option><option value="NY">New York</option><option value="NC">North Carolina</option><option value="ND">North Dakota</option><option value="OH">Ohio</option><option value="OK">Oklahoma</option><option value="OR">Oregon</option><option value="PA">Pennsylvania</option><option value="RI">Rhode Island</option><option value="SC">South Carolina</option><option value="SD">South Dakota</option><option value="TN">Tennessee</option><option value="TX">Texas</option><option value="UT">Utah</option><option value="VT">Vermont</option><option value="VA">Virginia</option><option value="WA">Washington</option><option value="WV">West Virginia</option><option value="WI">Wisconsin</option><option value="WY">Wyoming</option>
              </select>
              <span class="hint"></span>
            </div>
            <div class="field">
              <label for="zip">ZIP Code *</label>
              <input type="text" id="zip" name="zip" maxlength="10" placeholder="77004">
              <span class="hint"></span>
            </div>
          </div>

          <!-- INSURANCE -->
          <div class="section-label">Insurance Type</div>
          <div class="radio-group">
            <label><input type="radio" name="insurance" value="Private"> Private</label>
            <label><input type="radio" name="insurance" value="Medicare"> Medicare</label>
            <label><input type="radio" name="insurance" value="Medicaid"> Medicaid</label>
            <label><input type="radio" name="insurance" value="Self-Pay"> Self-Pay</label>
            <label><input type="radio" name="insurance" value="Other"> Other</label>
          </div>

          <!-- MEDICAL CONDITIONS -->
          <div class="section-label">Medical History (check all that apply)</div>
          <div class="check-group">
            <label><input type="checkbox" name="conditions" value="Diabetes"> Diabetes</label>
            <label><input type="checkbox" name="conditions" value="Hypertension"> Hypertension</label>
            <label><input type="checkbox" name="conditions" value="Heart Disease"> Heart Disease</label>
            <label><input type="checkbox" name="conditions" value="Asthma"> Asthma</label>
            <label><input type="checkbox" name="conditions" value="Cancer"> Cancer</label>
            <label><input type="checkbox" name="conditions" value="Arthritis"> Arthritis</label>
            <label><input type="checkbox" name="conditions" value="Depression/Anxiety"> Depression / Anxiety</label>
            <label><input type="checkbox" name="conditions" value="None"> None of the above</label>
          </div>

          <!-- VACCINATION -->
          <div class="section-label">COVID-19 Vaccination Status</div>
          <div class="radio-group">
            <label><input type="radio" name="vaccinated" value="Yes"> Yes, fully vaccinated</label>
            <label><input type="radio" name="vaccinated" value="No"> No</label>
            <label><input type="radio" name="vaccinated" value="Partially"> Partially vaccinated</label>
          </div>

          <!-- HEALTH RATING SLIDER -->
          <div class="section-label">Overall Health Rating</div>
          <div class="slider-row">
            <label for="healthSlider">Rate your health (1–10):</label>
            <input type="range" id="healthSlider" name="healthSlider" min="1" max="10" value="5">
            <span id="healthVal">5</span>
          </div>

          <!-- ACCOUNT INFO -->
          <div class="section-label">Account Info</div>
          <div class="form-row two">
            <div class="field">
              <label for="username">Username *</label>
              <input type="text" id="username" name="username" placeholder="jdoe2026">
              <span class="hint"></span>
            </div>
            <div class="field">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" placeholder="(not saved)">
              <span class="hint"></span>
            </div>
          </div>

          <!-- COMMENTS -->
          <div class="section-label">Additional Comments</div>
          <div class="form-row single">
            <div class="field">
              <label for="comments">Notes for your doctor</label>
              <textarea id="comments" name="comments" placeholder="Any allergies, current medications, concerns..."></textarea>
            </div>
          </div>

          <!-- REMEMBER ME -->
          <div class="remember-row">
            <input type="checkbox" id="rememberMe" name="rememberMe" checked>
            <label for="rememberMe">
              <strong>Remember me</strong> – Save my info for next visit
              (stores your name as a cookie and all other fields in local storage for up to 48 hours)
            </label>
          </div>

          <!-- BUTTONS -->
          <div class="btn-row">
            <button type="button" class="btn btn-secondary" id="reviewBtn">Review My Info</button>
            <button type="button" class="btn btn-outline"   id="clearBtn">Clear / Reset</button>
            <button type="button" class="btn btn-primary"   id="submitBtn">Submit Registration</button>
          </div>

        </form><!-- /form -->

        <!-- ── REVIEW TABLE ──────────────────────────
             Appears after clicking "Review My Info"
             ──────────────────────────────────────── -->
        <div id="review-section">
          <div class="section-label" style="margin-top:28px;">Form Review</div>
          <table id="review-table">
            <thead>
              <tr><th>Field</th><th>Value</th><th>Status</th></tr>
            </thead>
            <tbody id="review-tbody"></tbody>
          </table>
        </div>

      </div><!-- /form-body -->
    </div><!-- /form-card -->
  </div><!-- /container -->

  <!-- =============================================
       FIXED FOOTER (content protection #2)
       Stays pinned to bottom via position:fixed CSS
       ============================================= -->
  <footer id="site-footer">
    &copy; 2026 Cougar Care Medical &mdash; MIS 3371 Homework 4 &mdash; Sayed Hussain Abbas
  </footer>

  <script src="homework4.js"></script>
</body>
</html>

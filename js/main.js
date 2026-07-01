/* Source Music Group — interactions */
(function () {
  "use strict";

  /* ---- Current year in footer ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("navMenu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    // Close the menu after tapping a link (mobile)
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- Contact form: async submit with inline feedback ----
     Falls back to a normal POST if fetch fails or JS is disabled.
     Wire your endpoint by replacing YOUR_FORM_ID in index.html. */
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");

  if (form) {
    form.addEventListener("submit", function (e) {
      // If the endpoint hasn't been configured yet, let the user know
      // instead of silently POSTing to a placeholder URL.
      if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
        e.preventDefault();
        setStatus("Form isn't connected yet — add your Formspree ID to enable submissions.", "error");
        return;
      }

      e.preventDefault();
      var submitBtn = form.querySelector('[type="submit"]');
      var original = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }
      setStatus("", "");

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            setStatus("Thanks — your submission is in. We'll be in touch.", "success");
          } else {
            return res.json().then(function (data) {
              var msg = data && data.errors
                ? data.errors.map(function (er) { return er.message; }).join(", ")
                : "Something went wrong. Please try again or email us directly.";
              setStatus(msg, "error");
            });
          }
        })
        .catch(function () {
          setStatus("Network error. Please try again or email us directly.", "error");
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = original; }
        });
    });
  }

  function setStatus(msg, type) {
    if (!status) return;
    status.textContent = msg;
    status.classList.remove("is-success", "is-error");
    if (type === "success") status.classList.add("is-success");
    if (type === "error") status.classList.add("is-error");
  }
})();

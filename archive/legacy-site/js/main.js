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

  /* ================= Sing to Submit — AI-verified submission =================
     Phase 1: records a live vocal in-browser and shows a MOCK analysis so the
     full UX is testable with no backend. Swap BACKEND_URL + analyze() for the
     real AWS endpoint in Phase 2. Results are written to the #contactForm
     hidden fields so they submit alongside the form. */
  (function sing() {
    var el = document.getElementById("sing");
    if (!el) return;

    // Feature-detect: recording needs getUserMedia + MediaRecorder over HTTPS/localhost.
    var canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia &&
                       window.MediaRecorder);
    if (!canRecord) return;        // leave the block hidden; the normal form still works
    el.hidden = false;

    var BACKEND_URL = "";          // Phase 2: set to the AWS API Gateway URL to go live

    var rec       = el.querySelector(".rec");
    var meterBars = Array.prototype.slice.call(el.querySelectorAll(".rec__meter span"));
    var toggleBtn = document.getElementById("recToggle");
    var toggleLbl = toggleBtn.querySelector(".rec__btn-label");
    var timeEl    = document.getElementById("recTime");
    var playback  = document.getElementById("recPlayback");
    var actions   = el.querySelector(".rec__actions");
    var hint      = document.getElementById("recHint");
    var redoBtn   = document.getElementById("recRedo");
    var analyzeBtn= document.getElementById("recAnalyze");
    var results   = document.getElementById("singResults");
    var fileInput = document.getElementById("recFile");

    var mediaRecorder = null, chunks = [], stream = null;
    var audioCtx = null, analyser = null, rafId = null;
    var startedAt = 0, tickId = null, blobUrl = null;

    function setState(s) { rec.setAttribute("data-state", s); }

    function fmt(sec) {
      var m = Math.floor(sec / 60), s = Math.floor(sec % 60);
      return m + ":" + (s < 10 ? "0" + s : s);
    }

    function startMeter(src) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      audioCtx.createMediaStreamSource(src).connect(analyser);
      var data = new Uint8Array(analyser.frequencyBinCount);
      (function draw() {
        analyser.getByteFrequencyData(data);
        for (var i = 0; i < meterBars.length; i++) {
          var v = data[i % data.length] / 255;          // 0..1
          meterBars[i].style.height = (8 + v * 32).toFixed(1) + "px";
        }
        rafId = requestAnimationFrame(draw);
      })();
    }

    function stopMeter() {
      if (rafId) cancelAnimationFrame(rafId), rafId = null;
      if (audioCtx) { audioCtx.close(); audioCtx = null; }
      meterBars.forEach(function (b) { b.style.height = "8px"; });
    }

    function startTimer() {
      startedAt = Date.now();
      tickId = setInterval(function () {
        timeEl.textContent = fmt((Date.now() - startedAt) / 1000);
      }, 250);
    }
    function stopTimer() { if (tickId) clearInterval(tickId), tickId = null; }

    function cleanupStream() {
      if (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; }
    }

    function startRecording() {
      results.hidden = true;
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
        stream = s;
        chunks = [];
        mediaRecorder = new MediaRecorder(s);
        mediaRecorder.ondataavailable = function (e) { if (e.data.size) chunks.push(e.data); };
        mediaRecorder.onstop = function () {
          var blob = new Blob(chunks, { type: chunks[0] ? chunks[0].type : "audio/webm" });
          if (blobUrl) URL.revokeObjectURL(blobUrl);
          blobUrl = URL.createObjectURL(blob);
          playback.src = blobUrl;
          playback.hidden = false;
          actions.hidden = false;
          rec._blob = blob;
        };
        mediaRecorder.start();
        rec._source = "sing";
        setState("recording");
        toggleLbl.textContent = "Stop";
        toggleBtn.setAttribute("aria-label", "Stop recording");
        hint.textContent = "Recording… sing your heart out, then tap stop.";
        startTimer();
        startMeter(s);
      }).catch(function () {
        hint.textContent = "Mic access was blocked. Enable microphone permission and try again.";
      });
    }

    function stopRecording() {
      if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
      cleanupStream();
      stopTimer();
      stopMeter();
      setState("recorded");
      toggleLbl.textContent = "Record";
      toggleBtn.setAttribute("aria-label", "Start recording");
      hint.textContent = "Happy with it? Analyze — or re-record.";
    }

    toggleBtn.addEventListener("click", function () {
      if (rec.getAttribute("data-state") === "recording") stopRecording();
      else startRecording();
    });

    fileInput.addEventListener("change", function () {
      var file = fileInput.files && fileInput.files[0];
      if (!file) return;
      // Treat an uploaded file exactly like a recording, but flag its source
      // so the analyzer can run fingerprint/ISRC checks (only reliable on a real master).
      rec._blob = file;
      rec._source = "upload";
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      blobUrl = URL.createObjectURL(file);
      playback.src = blobUrl;
      playback.hidden = false;
      actions.hidden = false;
      results.hidden = true;
      timeEl.textContent = "0:00";
      setState("recorded");
      hint.textContent = 'Loaded "' + file.name + '". Analyze it — or choose a different file / record instead.';
    });

    redoBtn.addEventListener("click", function () {
      results.hidden = true;
      actions.hidden = true;
      playback.hidden = true;
      timeEl.textContent = "0:00";
      fileInput.value = "";           // allow re-selecting the same file
      rec._blob = null;
      rec._source = null;
      setState("idle");
      hint.textContent = "Sing 15–30 seconds — or upload your track for full ISRC & streaming checks.";
    });

    analyzeBtn.addEventListener("click", function () {
      if (!rec._blob) return;
      setState("analyzing");
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = "Analyzing…";
      hint.textContent = "Listening to your song and checking it against released music…";

      analyze(rec._blob).then(renderResults).catch(function () {
        hint.textContent = "Analysis failed — please try again.";
      }).finally(function () {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "Analyze my song ↗";
        setState("recorded");
      });
    });

    // Phase 1 mock. Phase 2 replaces this with a POST of the audio blob to BACKEND_URL.
    function analyze(blob) {
      var source = rec._source || "sing";
      if (BACKEND_URL) {
        var fd = new FormData();
        fd.append("audio", blob, source === "upload" ? "track" : "submission.webm");
        fd.append("source", source);
        return fetch(BACKEND_URL, { method: "POST", body: fd })
          .then(function (r) { if (!r.ok) throw new Error("bad status"); return r.json(); });
      }
      // Mock responses — prove the UX end-to-end with no backend/keys.
      // Uploaded files demo the fingerprint/ISRC/streaming path; live vocals demo "original".
      return new Promise(function (resolve) {
        setTimeout(function () {
          if (source === "upload") {
            resolve({
              transcript: "city lights, chasing a sound that feels like mine\nno one can tell me how it goes\nthis is the source, this is the flow",
              verdict: { type: "match", text: "Fingerprint match found — this is a released recording." },
              match: {
                title: "Source (Flow)",
                artist: "Duka",
                isrc: "USSMG2500123",
                streaming: [
                  { name: "Spotify", url: "https://open.spotify.com/artist/0oxAY1bzauffvCA5m6tsBZ" },
                  { name: "Apple Music", url: "https://music.apple.com" }
                ]
              },
              flags: [
                { kind: "ok",   text: "ISRC confirmed on Spotify — metadata matches." },
                { kind: "warn", text: "Verify you hold the rights to this ISRC before submitting." }
              ]
            });
          } else {
            resolve({
              transcript: "I've been running through the city lights\nchasing a sound that feels like mine\nno one can tell me how it goes\nthis is the source, this is the flow",
              verdict: { type: "original", text: "Sounds original — no strong match to released music." },
              match: null,
              flags: [
                { kind: "ok",   text: "Clear vocal captured — good for lyric analysis." },
                { kind: "warn", text: "Live mic quality: fine for screening, not a final master." }
              ]
            });
          }
        }, 1600);
      });
    }

    function renderResults(data) {
      // Verdict
      var v = document.getElementById("singVerdict");
      v.className = "verdict verdict--" + ((data.verdict && data.verdict.type) || "original");
      v.textContent = (data.verdict && data.verdict.text) || "";

      // Lyrics
      document.getElementById("singLyrics").textContent = data.transcript || "(no lyrics detected)";

      // Match table
      var matchBlock = document.getElementById("singMatchBlock");
      var rows = document.getElementById("singMatchRows");
      rows.innerHTML = "";
      if (data.match) {
        addRow(rows, "Title", data.match.title);
        addRow(rows, "Artist", data.match.artist);
        addRow(rows, "ISRC", data.match.isrc);
        if (data.match.streaming && data.match.streaming.length) {
          var links = data.match.streaming.map(function (s) {
            return '<a href="' + s.url + '" target="_blank" rel="noopener">' + s.name + " ↗</a>";
          }).join(" · ");
          addRow(rows, "Live on", links, true);
        }
        matchBlock.hidden = false;
      } else {
        matchBlock.hidden = true;
      }

      // Flags
      var flags = document.getElementById("singFlags");
      flags.innerHTML = "";
      (data.flags || []).forEach(function (f) {
        var li = document.createElement("li");
        li.setAttribute("data-kind", f.kind || "ok");
        li.textContent = (f.kind === "warn" ? "⚠️ " : "✅ ") + f.text;
        flags.appendChild(li);
      });

      // Carry results into the form's hidden fields
      setField("aiTranscript", data.transcript || "");
      setField("aiVerdict", (data.verdict && data.verdict.text) || "");
      setField("aiMatch", data.match ? JSON.stringify(data.match) : "");

      results.hidden = false;
      hint.textContent = "Analysis complete — details are ready to send with your submission.";
    }

    function addRow(tbody, label, value, isHtml) {
      var tr = document.createElement("tr");
      var th = document.createElement("th"); th.textContent = label;
      var td = document.createElement("td");
      if (isHtml) td.innerHTML = value; else td.textContent = value || "—";
      tr.appendChild(th); tr.appendChild(td); tbody.appendChild(tr);
    }

    function setField(id, val) { var f = document.getElementById(id); if (f) f.value = val; }
  })();
})();

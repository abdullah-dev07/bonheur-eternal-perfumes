/* ==========================================================
   Bonheur Eternal — small interactions layer
   Pure vanilla JS. No dependencies.
   ========================================================== */

(function () {
  "use strict";

  /* -------- 1. Sticky nav: toggle scrolled-state background -------- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* -------- 2. Mobile menu toggle -------- */
  const toggle = document.getElementById("navToggle");
  const mobile = document.getElementById("mobileMenu");

  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      const willOpen = mobile.hasAttribute("hidden");
      if (willOpen) {
        mobile.removeAttribute("hidden");
        nav.classList.add("is-open");
        toggle.setAttribute("aria-expanded", "true");
      } else {
        mobile.setAttribute("hidden", "");
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    // Close mobile menu after tapping any link inside it
    mobile.addEventListener("click", (e) => {
      if (e.target.tagName === "A") {
        mobile.setAttribute("hidden", "");
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* -------- 3. Smooth scroll for in-page anchors
     (CSS does this too, but this ensures consistent offset) -------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id === "#" || id.length < 2) return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });

  /* -------- 4. Contact form handling --------
     Approach: Progressive. On submit, we:
       (a) Validate client-side.
       (b) Open the visitor's mail client with a prefilled message
           via a mailto: link. This requires ZERO backend and works
           immediately. If you later wire up a real endpoint
           (Formspree, Resend, a Lambda, etc.), replace the
           `openMailto` call with a fetch() to that endpoint. */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactStatus");

  const RECIPIENT = "hello@bonheureternal.com";

  if (form && status) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      status.classList.remove("is-error", "is-success");

      const data = new FormData(form);
      const name = (data.get("name") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();

      if (!name || !email || !message) {
        status.textContent = "Please fill in every field.";
        status.classList.add("is-error");
        return;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        status.textContent = "Please enter a valid email address.";
        status.classList.add("is-error");
        return;
      }

      const subject = `Inquiry from ${name} — Bonheur Eternal`;
      const body =
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `Message:\n${message}\n`;

      const mailto =
        `mailto:${RECIPIENT}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;

      status.textContent =
        "Opening your email app… if nothing happens, write to us at " +
        RECIPIENT + ".";
      status.classList.add("is-success");
      form.reset();
    });
  }

  /* -------- 5. Auto-update footer year -------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

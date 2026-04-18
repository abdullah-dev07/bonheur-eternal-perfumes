/*
 * Scroll-reveal: every element with .reveal fades/translates in when
 * it enters the viewport. Stagger is controlled per-element via the
 * --reveal-delay CSS custom property set inline or in CSS.
 *
 * Uses IntersectionObserver — single observer, one pass per element
 * (unobserved after reveal) so it stays cheap.
 */

export function initAnimations() {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const targets = document.querySelectorAll(".reveal");

  if (prefersReduced || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    {
      // Trigger a little before the element enters, so the reveal
      // feels anticipatory rather than late.
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.12,
    }
  );

  targets.forEach((el) => io.observe(el));
}

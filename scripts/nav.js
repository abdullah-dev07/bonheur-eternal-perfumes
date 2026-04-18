/*
 * Navigation behavior:
 *   - Toggle a .is-scrolled class on the header once the user scrolls
 *     past the hero threshold, switching from transparent to frosted.
 *   - Mobile menu open/close, including auto-close on link tap.
 */

export function initNav() {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const toggle = document.getElementById("navToggle");
  const mobile = document.getElementById("mobileMenu");
  if (!toggle || !mobile) return;

  const close = () => {
    mobile.setAttribute("hidden", "");
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    mobile.removeAttribute("hidden");
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    mobile.hasAttribute("hidden") ? open() : close();
  });

  mobile.addEventListener("click", (e) => {
    if (e.target.tagName === "A") close();
  });
}

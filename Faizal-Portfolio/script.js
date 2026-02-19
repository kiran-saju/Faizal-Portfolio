/* ===== Helpers ===== */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* ===== Footer year ===== */
$("#year").textContent = String(new Date().getFullYear());

/* ===== Mobile nav ===== */
const menuBtn = $("#menuBtn");
const navLinks = $("#navLinks");

function setMenu(open) {
  navLinks.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

menuBtn.addEventListener("click", () => {
  const isOpen = navLinks.classList.contains("is-open");
  setMenu(!isOpen);
});

// Close menu when clicking a link (mobile)
$$(".nav__link, .nav__cta", navLinks).forEach((a) => {
  a.addEventListener("click", () => setMenu(false));
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (!navLinks.classList.contains("is-open")) return;
  const clickedInside = navLinks.contains(e.target) || menuBtn.contains(e.target);
  if (!clickedInside) setMenu(false);
});

/* ===== Scroll reveal (IntersectionObserver) ===== */
const revealEls = $$(".reveal");
const bars = $$(".bar");

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");

      // Animate proficiency bars when their container is visible
      if (entry.target.classList.contains("bar")) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.15 }
);

revealEls.forEach((el) => io.observe(el));
bars.forEach((el) => io.observe(el));

/* ===== Active nav link on scroll ===== */
const sections = ["home", "skills", "experience", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

const navMap = new Map(
  $$(".nav__link").map((a) => [a.getAttribute("href")?.replace("#", ""), a])
);

const spy = new IntersectionObserver(
  (entries) => {
    // Pick the most visible entry
    const visible = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const id = visible.target.id;
    navMap.forEach((link) => link.classList.remove("is-active"));
    const active = navMap.get(id);
    if (active) active.classList.add("is-active");
  },
  {
    // Helps highlight when section header area comes in
    rootMargin: "-20% 0px -65% 0px",
    threshold: [0.1, 0.2, 0.3, 0.4, 0.5]
  }
);

sections.forEach((s) => spy.observe(s));

/* ===== Contact form (front-end only) ===== */
const form = $("#contactForm");
const hint = $("#formHint");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();

  if (!name || !email || !message) {
    hint.textContent = "Please fill in all fields.";
    return;
  }

  // Front-end only demo behavior
  hint.textContent = "Message prepared. Hook this to a backend (EmailJS/Formspree) to send.";
  form.reset();

  // Clear message after a moment
  window.setTimeout(() => {
    hint.textContent = "";
  }, 4000);
});

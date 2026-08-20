/* Replace with the studio's number in international format.
   Example: 60123456789 — no + symbol, spaces or dashes. */
const WHATSAPP_NUMBER = "601XXXXXXXX";

const header = document.querySelector("#site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
const toast = document.querySelector("#toast");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3800);
}

function closeMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  mobileNav?.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuToggle?.addEventListener("click", () => {
  const opening = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(opening));
  mobileNav?.classList.toggle("open", opening);
  document.body.classList.toggle("menu-open", opening);
});

mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

const headerLinks = [...document.querySelectorAll(".desktop-nav a")];
if ("IntersectionObserver" in window) {
  const navigationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      headerLinks.forEach((link) => link.classList.toggle("active", link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: "-35% 0px -55%", threshold: 0 });
  document.querySelectorAll("main section[id]").forEach((section) => navigationObserver.observe(section));
}

const rotatingLabel = document.querySelector("[data-rotate-label]");
const labels = ["Graduation", "Family", "Portrait", "ROM / Couple"];
if (rotatingLabel && !reducedMotion) {
  let labelIndex = 0;
  window.setInterval(() => {
    labelIndex = (labelIndex + 1) % labels.length;
    rotatingLabel.textContent = labels[labelIndex];
  }, 2400);
}

const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector("figcaption");

document.querySelectorAll(".photo-item").forEach((item) => {
  item.addEventListener("click", () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.querySelector("img")?.alt || "Northlight Studio photograph";
    lightboxCaption.textContent = item.dataset.caption || "Northlight Studio";
    lightbox.showModal();
  });
});

lightbox?.querySelector(".lightbox-close")?.addEventListener("click", () => lightbox.close());
lightbox?.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });

const filmStrip = document.querySelector("#film-strip");
if (filmStrip) {
  let dragging = false;
  let startX = 0;
  let startScroll = 0;
  filmStrip.addEventListener("pointerdown", (event) => {
    dragging = true;
    startX = event.clientX;
    startScroll = filmStrip.scrollLeft;
    filmStrip.classList.add("dragging");
    filmStrip.setPointerCapture(event.pointerId);
  });
  filmStrip.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    filmStrip.scrollLeft = startScroll - (event.clientX - startX) * 1.35;
  });
  const endDrag = () => { dragging = false; filmStrip.classList.remove("dragging"); };
  filmStrip.addEventListener("pointerup", endDrag);
  filmStrip.addEventListener("pointercancel", endDrag);
}

function validWhatsAppNumber() {
  return /^\d{8,15}$/.test(WHATSAPP_NUMBER);
}

function openWhatsApp(message) {
  if (!validWhatsAppNumber()) {
    navigator.clipboard?.writeText(message).catch(() => {});
    showToast("Demo mode: replace WHATSAPP_NUMBER at the top of script.js. The message was copied.");
    return;
  }
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
}

document.querySelectorAll("[data-package]").forEach((button) => {
  button.addEventListener("click", () => {
    const packageName = button.dataset.package;
    const packageSelect = document.querySelector("#preferred-package");
    const shootType = document.querySelector("#shoot-type");
    if (packageSelect && [...packageSelect.options].some((option) => option.value === packageName)) packageSelect.value = packageName;
    if (shootType && [...shootType.options].some((option) => option.value === packageName)) shootType.value = packageName;
    openWhatsApp(`Hi Northlight Studio, I would like to ask about the ${packageName} package. Please share the confirmed price, duration, inclusions and available dates.`);
  });
});

document.querySelectorAll("[data-whatsapp]").forEach((button) => {
  button.addEventListener("click", () => openWhatsApp("Hi Northlight Studio, I would like to ask about your photography sessions."));
});

document.querySelectorAll("[data-map-link], [data-social-link]").forEach((button) => {
  button.addEventListener("click", () => showToast("Placeholder link — add the studio's confirmed Maps, Waze or Instagram URL before launch."));
});

document.querySelector("#booking-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = [
    "Hi Northlight Studio, I would like to enquire about a photography session.",
    "",
    `Name: ${data.get("name")}`,
    `My WhatsApp: ${data.get("phone")}`,
    `Shoot type: ${data.get("shootType")}`,
    `Preferred date: ${data.get("date")}`,
    `Number of people: ${data.get("people")}`,
    `Preferred package: ${data.get("package")}`,
    `Notes: ${data.get("notes") || "None"}`
  ].join("\n");
  openWhatsApp(message);
});

const revealItems = document.querySelectorAll(".reveal");
if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .1, rootMargin: "0px 0px -35px" });
  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

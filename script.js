document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const hamburgerIcon = document.querySelector(".hamburger-icon");
  if (hamburgerIcon) {
    hamburgerIcon.addEventListener("click", () => {
      const menu = document.querySelector(".menu-links");
      menu.classList.toggle("open");
      hamburgerIcon.classList.toggle("open");
    });
  }

  // Theme Toggle with emoji and toast
  const themeSwitch = document.getElementById("theme-switch");
  const themeIcon = document.getElementById("theme-icon");
  const themeToast = document.getElementById("theme-toast");

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");
  const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);

  // Set initial theme state
  document.body.classList.toggle("dark", isDark);
  if (themeSwitch) themeSwitch.checked = isDark;
  if (themeIcon) themeIcon.textContent = isDark ? "🌙" : "🌞";

  // Theme toggle handler
  if (themeSwitch) {
    themeSwitch.addEventListener("change", () => {
      const isDarkNow = themeSwitch.checked;
      document.body.classList.toggle("dark", isDarkNow);
      localStorage.setItem("theme", isDarkNow ? "dark" : "light");

      if (themeIcon) themeIcon.textContent = isDarkNow ? "🌙" : "🌞";

      // Toast feedback
      if (themeToast) {
        themeToast.textContent = isDarkNow ? "🌙 Dark Mode On" : "☀️ Light Mode On";
        themeToast.classList.add("show");
        setTimeout(() => themeToast.classList.remove("show"), 1500);
      }
    });
  }

  // Fade-in on scroll
  const fadeElements = document.querySelectorAll(".fade-in-on-scroll");
  const appearOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      } else {
        entry.target.classList.remove("in-view");
      }
    });
  }, { threshold: 0.2 });

  fadeElements.forEach(el => {
    appearOnScroll.observe(el);
  });

  // Accordion Toggle
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling;
      body.classList.toggle('open');
    });
  });
});

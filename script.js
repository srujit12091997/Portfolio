"use strict";

(function () {
  var THEME_KEY = "portfolio-theme";

  var root = document.documentElement;
  var body = document.body;

  var siteHeader = document.getElementById("site-header");
  var themeToggle = document.getElementById("theme-toggle");
  var menuToggle = document.getElementById("menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  var mobileBackdrop = document.getElementById("mobile-backdrop");

  var navLinks = Array.prototype.slice.call(document.querySelectorAll("[data-nav-link]"));
  var revealTargets = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  var staggerGroups = Array.prototype.slice.call(document.querySelectorAll("[data-stagger]"));
  var mainSections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var heroSection = document.getElementById("home");

  var parallaxNodes = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var projectFilterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-chip[data-filter]"));
  var projectCards = Array.prototype.slice.call(document.querySelectorAll("[data-project-category]"));

  var typedRole = document.getElementById("typed-role");
  var skillsSection = document.getElementById("skills");
  var ringProgressNodes = Array.prototype.slice.call(document.querySelectorAll(".ring-progress"));
  var contactForm = document.getElementById("contact-form");
  var formStatus = document.getElementById("form-status");

  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var prefersReducedMotion = reduceMotionQuery.matches;

  var ringsAnimated = false;

  function setTheme(theme) {
    var isDark = theme === "dark";
    root.setAttribute("data-theme", isDark ? "dark" : "light");

    if (!themeToggle) {
      return;
    }

    themeToggle.dataset.theme = isDark ? "dark" : "light";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }

  function updateThemeWaveOrigin() {
    if (!themeToggle) {
      return;
    }

    var rect = themeToggle.getBoundingClientRect();
    root.style.setProperty("--theme-wave-top", rect.top + rect.height / 2 + "px");
    root.style.setProperty("--theme-wave-left", rect.left + rect.width / 2 + "px");
  }

  function setupThemeToggle() {
    if (!themeToggle) {
      return;
    }

    updateThemeWaveOrigin();
    window.addEventListener("resize", updateThemeWaveOrigin);

    themeToggle.addEventListener("click", function () {
      var nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";

      updateThemeWaveOrigin();
      root.classList.add("theme-animating");
      setTheme(nextTheme);

      try {
        localStorage.setItem(THEME_KEY, nextTheme);
      } catch (error) {
        // Ignore storage errors.
      }

      window.setTimeout(function () {
        root.classList.remove("theme-animating");
      }, 560);
    });
  }

  function setMenuState(open) {
    var shouldOpen = Boolean(open);
    body.classList.toggle("menu-open", shouldOpen);

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", String(shouldOpen));
    }

    if (mobileNav) {
      mobileNav.setAttribute("aria-hidden", String(!shouldOpen));
    }
  }

  function setupMobileMenu() {
    if (!menuToggle || !mobileNav) {
      return;
    }

    menuToggle.addEventListener("click", function () {
      setMenuState(!body.classList.contains("menu-open"));
    });

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener("click", function () {
        setMenuState(false);
      });
    }

    navLinks.forEach(function (link) {
      if (link.closest(".mobile-nav")) {
        link.addEventListener("click", function () {
          setMenuState(false);
        });
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenuState(false);
      }
    });

    var desktopQuery = window.matchMedia("(min-width: 961px)");
    var onDesktop = function (event) {
      if (event.matches) {
        setMenuState(false);
      }
    };

    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", onDesktop);
    } else if (desktopQuery.addListener) {
      desktopQuery.addListener(onDesktop);
    }
  }

  function setupStickyHeader() {
    if (!siteHeader) {
      return;
    }

    var onScroll = function () {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 14);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setupSmoothAnchors() {
    navLinks.forEach(function (link) {
      var hash = link.getAttribute("href");
      if (!hash || hash.charAt(0) !== "#") {
        return;
      }

      link.addEventListener("click", function (event) {
        var target = document.querySelector(hash);
        if (!target) {
          return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });

        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", hash);
        }
      });
    });
  }

  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", isActive);
    });
  }

  function setupSectionTracking() {
    if (!mainSections.length || !("IntersectionObserver" in window)) {
      return;
    }

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-34% 0px -54% 0px",
        threshold: 0,
      }
    );

    mainSections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  function setupRevealAnimations() {
    if (!revealTargets.length) {
      return;
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      revealTargets.forEach(function (target) {
        target.classList.add("is-visible");
      });
      return;
    }

    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealTargets.forEach(function (target, index) {
      target.style.transitionDelay = Math.min(index * 70, 260) + "ms";
      revealObserver.observe(target);
    });
  }

  function setupStaggerAnimations() {
    if (!staggerGroups.length) {
      return;
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      staggerGroups.forEach(function (group) {
        var items = Array.prototype.slice.call(group.querySelectorAll("[data-stagger-item]"));
        items.forEach(function (item) {
          item.classList.add("is-visible");
        });
      });
      return;
    }

    var staggerObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          var items = Array.prototype.slice.call(entry.target.querySelectorAll("[data-stagger-item]"));
          items.forEach(function (item, index) {
            item.style.transitionDelay = Math.min(index * 95, 420) + "ms";
            item.classList.add("is-visible");
          });

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
      }
    );

    staggerGroups.forEach(function (group) {
      staggerObserver.observe(group);
    });
  }

  function setupParallax() {
    if (prefersReducedMotion || !parallaxNodes.length) {
      return;
    }

    var ticking = false;

    var updateParallax = function () {
      var scrollTop = window.scrollY || window.pageYOffset;
      var parallaxBase = scrollTop;

      if (heroSection) {
        var heroLimit = heroSection.offsetTop + heroSection.offsetHeight;
        parallaxBase = Math.max(0, Math.min(scrollTop, heroLimit));
      }

      parallaxNodes.forEach(function (node) {
        var speed = parseFloat(node.getAttribute("data-parallax"));
        if (!Number.isFinite(speed)) {
          speed = 0;
        }

        node.style.setProperty("--parallax-y", (parallaxBase * speed).toFixed(2) + "px");
      });

      ticking = false;
    };

    var onScroll = function () {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(updateParallax);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateParallax();
  }

  function setupTypedHero() {
    if (!typedRole) {
      return;
    }

    var roles = [
      "Software Architect",
      "Senior Software Engineer",
      "Distributed Systems Builder",
    ];

    if (prefersReducedMotion) {
      typedRole.textContent = roles[0];
      return;
    }

    var roleIndex = 0;
    var charIndex = 0;
    var deleting = false;

    var tick = function () {
      var role = roles[roleIndex];

      if (deleting) {
        charIndex -= 1;
      } else {
        charIndex += 1;
      }

      typedRole.textContent = role.slice(0, charIndex);

      if (!deleting && charIndex >= role.length) {
        deleting = true;
        window.setTimeout(tick, 1150);
        return;
      }

      if (deleting && charIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }

      window.setTimeout(tick, deleting ? 55 : 78);
    };

    tick();
  }

  function matchesFilter(card, filter) {
    if (filter === "all") {
      return true;
    }

    var categories = String(card.getAttribute("data-project-category") || "").split(/\s+/);
    return categories.indexOf(filter) > -1;
  }

  function showProjectCard(card) {
    clearTimeout(card._hideTimeout);
    clearTimeout(card._showTimeout);

    if (card.classList.contains("is-hidden")) {
      card.classList.remove("is-hidden");
      void card.offsetWidth;
    }

    card.classList.remove("is-hiding");
    card.classList.add("is-showing");

    card._showTimeout = window.setTimeout(function () {
      card.classList.remove("is-showing");
    }, 380);
  }

  function hideProjectCard(card) {
    clearTimeout(card._hideTimeout);
    clearTimeout(card._showTimeout);

    if (card.classList.contains("is-hidden")) {
      return;
    }

    card.classList.remove("is-showing");
    card.classList.add("is-hiding");

    card._hideTimeout = window.setTimeout(function () {
      card.classList.add("is-hidden");
    }, 250);
  }

  function applyProjectFilter(filter) {
    projectFilterButtons.forEach(function (button) {
      button.classList.toggle("is-active", button.getAttribute("data-filter") === filter);
    });

    projectCards.forEach(function (card) {
      if (matchesFilter(card, filter)) {
        showProjectCard(card);
      } else {
        hideProjectCard(card);
      }
    });
  }

  function setupProjectFiltering() {
    if (!projectFilterButtons.length || !projectCards.length) {
      return;
    }

    projectFilterButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        applyProjectFilter(button.getAttribute("data-filter") || "all");
      });
    });
  }

  function animateRingValue(node, targetValue) {
    if (!node) {
      return;
    }

    if (prefersReducedMotion) {
      node.textContent = String(targetValue) + "%";
      return;
    }

    var duration = 1100;
    var start = performance.now();

    var frame = function (time) {
      var progress = Math.min((time - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(targetValue * eased);

      node.textContent = String(current) + "%";

      if (progress < 1) {
        window.requestAnimationFrame(frame);
      }
    };

    window.requestAnimationFrame(frame);
  }

  function animateRings() {
    if (ringsAnimated || !ringProgressNodes.length) {
      return;
    }

    ringsAnimated = true;

    ringProgressNodes.forEach(function (ring) {
      var radius = Number(ring.getAttribute("r")) || 46;
      var percentage = Number(ring.getAttribute("data-percent")) || 0;
      var circumference = 2 * Math.PI * radius;
      var offset = circumference * (1 - percentage / 100);

      ring.style.strokeDasharray = String(circumference);
      ring.style.strokeDashoffset = String(circumference);

      var valueNode = ring.parentElement && ring.parentElement.parentElement
        ? ring.parentElement.parentElement.querySelector("[data-ring-value]")
        : null;

      animateRingValue(valueNode, percentage);

      if (prefersReducedMotion) {
        ring.style.strokeDashoffset = String(offset);
        return;
      }

      window.requestAnimationFrame(function () {
        ring.style.strokeDashoffset = String(offset);
      });
    });
  }

  function setupRingAnimation() {
    if (!skillsSection || !ringProgressNodes.length) {
      return;
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      animateRings();
      return;
    }

    var ringObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateRings();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.35,
      }
    );

    ringObserver.observe(skillsSection);
  }

  function setFormStatus(message, hasError) {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = message;
    formStatus.classList.toggle("is-error", Boolean(hasError));
    formStatus.classList.toggle("is-success", !hasError && message.length > 0);
  }

  function setupContactForm() {
    if (!contactForm) {
      return;
    }

    var submitButton = contactForm.querySelector('button[type="submit"]');
    var defaultButtonLabel = submitButton ? submitButton.textContent : "";
    var isSubmitting = false;

    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (isSubmitting) {
        return;
      }

      var name = String(contactForm.elements.name.value || "").trim();
      var email = String(contactForm.elements.email.value || "").trim();
      var message = String(contactForm.elements.message.value || "").trim();

      if (!name || !email || !message) {
        setFormStatus("Please complete all fields.", true);
        return;
      }

      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setFormStatus("Please enter a valid email address.", true);
        return;
      }

      isSubmitting = true;
      setFormStatus("Sending your message...", false);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      try {
        if (window.location.protocol === "file:") {
          throw new Error("Cannot submit from file://. Run npm start and open http://127.0.0.1:3000");
        }

        var response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message,
          }),
        });

        var responseBody = null;
        try {
          responseBody = await response.json();
        } catch (error) {
          responseBody = null;
        }

        if (!response.ok) {
          var backendError = responseBody && responseBody.error
            ? String(responseBody.error)
            : "Unable to send your message right now.";
          throw new Error(backendError);
        }

        var successMessage = responseBody && responseBody.message
          ? String(responseBody.message)
          : "Thanks. Your message has been sent.";
        setFormStatus(successMessage, false);
        contactForm.reset();
      } catch (error) {
        var errorMessage = error && error.message ? String(error.message) : "";
        if (!errorMessage || errorMessage === "Failed to fetch" || errorMessage.indexOf("fetch") > -1) {
          errorMessage = "Cannot reach contact backend. Run npm start and open http://127.0.0.1:3000";
        }
        setFormStatus(errorMessage, true);
      } finally {
        isSubmitting = false;

        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = defaultButtonLabel;
        }
      }
    });
  }

  function watchReducedMotion() {
    var onChange = function (event) {
      prefersReducedMotion = event.matches;
    };

    if (reduceMotionQuery.addEventListener) {
      reduceMotionQuery.addEventListener("change", onChange);
    } else if (reduceMotionQuery.addListener) {
      reduceMotionQuery.addListener(onChange);
    }
  }

  function init() {
    setTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

    watchReducedMotion();
    setupThemeToggle();
    setupMobileMenu();
    setupStickyHeader();
    setupSmoothAnchors();
    setupSectionTracking();
    setupRevealAnimations();
    setupStaggerAnimations();
    setupParallax();
    setupTypedHero();
    setupProjectFiltering();
    setupRingAnimation();
    setupContactForm();
  }

  init();
})();

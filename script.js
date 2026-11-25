/**
 * Gajula Beulah - Portfolio Interactivity
 * Vanilla JavaScript (ES6+)
 */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const navToggle = document.getElementById("nav-toggle");
  const primaryNav = document.getElementById("primary-navigation");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const backToTopBtn = document.getElementById("back-to-top");
  const yearSpan = document.getElementById("current-year");

  /* ------------------------------------------------------------------------
     1. Footer Current Year
     ------------------------------------------------------------------------ */
  if (yearSpan) {
    yearSpan.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------------------
     2. Mobile Hamburger Navigation
     ------------------------------------------------------------------------ */
  function setMenuOpen(isOpen) {
    if (!navToggle || !primaryNav) return;
    navToggle.setAttribute("aria-expanded", String(isOpen));
    primaryNav.classList.toggle("open", isOpen);
  }

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const currentlyOpen = navToggle.getAttribute("aria-expanded") === "true";
      setMenuOpen(!currentlyOpen);
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach((link) => {
      link.addEventListener("click", () => setMenuOpen(false));
    });

    // Close menu on Escape key
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    });

    // Close menu when clicking outside header/nav
    document.addEventListener("click", (event) => {
      if (!header || !primaryNav.classList.contains("open")) return;
      if (!header.contains(event.target)) {
        setMenuOpen(false);
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Active Navigation Highlighting & Scroll UI State
     ------------------------------------------------------------------------ */
  function setActiveNavLink(sectionId) {
    navLinks.forEach((link) => {
      const targetId = link.getAttribute("href")?.slice(1);
      link.classList.toggle("active", targetId === sectionId);
    });
  }

  if ("IntersectionObserver" in window && sections.length > 0) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNavLink(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  function handleScroll() {
    const scrollY = window.scrollY;
    if (header) {
      header.classList.toggle("scrolled", scrollY > 12);
    }
    if (backToTopBtn) {
      backToTopBtn.classList.toggle("visible", scrollY > 360);
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* ------------------------------------------------------------------------
     4. Back-to-Top Button
     ------------------------------------------------------------------------ */
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------------
     5. Subtle Scroll Reveal Animations
     ------------------------------------------------------------------------ */
  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* ------------------------------------------------------------------------
     6. Copy Email Helper
     ------------------------------------------------------------------------ */
  const copyEmailBtn = document.getElementById("copy-email-btn");
  const copyFeedback = document.getElementById("copy-feedback");
  const emailAddress = "gajulabeulah15@gmail.com";

  if (copyEmailBtn && copyFeedback) {
    copyEmailBtn.addEventListener("click", async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailAddress);
          copyFeedback.textContent = "Email copied to clipboard.";
        } else {
          copyFeedback.textContent = `Email: ${emailAddress}`;
        }
      } catch {
        copyFeedback.textContent = `Email: ${emailAddress}`;
      }

      window.setTimeout(() => {
        copyFeedback.textContent = "";
      }, 3500);
    });
  }

  /* ------------------------------------------------------------------------
     7. Contact Form Validation & Honest Mailto Composition
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    const fields = {
      name: {
        input: document.getElementById("contact-name"),
        error: document.getElementById("error-name"),
        validate(value) {
          if (!value) return "Please enter your name.";
          if (value.length < 2) return "Name must be at least 2 characters.";
          return "";
        },
      },
      email: {
        input: document.getElementById("contact-email"),
        error: document.getElementById("error-email"),
        validate(value) {
          if (!value) return "Please enter your email address.";
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) return "Please enter a valid email address.";
          return "";
        },
      },
      subject: {
        input: document.getElementById("contact-subject"),
        error: document.getElementById("error-subject"),
        validate(value) {
          if (!value) return "Please enter a subject.";
          if (value.length < 3) return "Subject must be at least 3 characters.";
          return "";
        },
      },
      message: {
        input: document.getElementById("contact-message"),
        error: document.getElementById("error-message"),
        validate(value) {
          if (!value) return "Please enter a message.";
          if (value.length < 10) return "Message must be at least 10 characters.";
          return "";
        },
      },
    };

    function validateField(fieldKey) {
      const field = fields[fieldKey];
      if (!field || !field.input || !field.error) return true;

      const trimmedValue = field.input.value.trim();
      const message = field.validate(trimmedValue);

      field.error.textContent = message;
      field.input.classList.toggle("invalid", Boolean(message));
      field.input.setAttribute("aria-invalid", String(Boolean(message)));

      return !message;
    }

    // Validate on blur and clear error as user fixes input
    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      if (!field.input) return;

      field.input.addEventListener("blur", () => validateField(key));
      field.input.addEventListener("input", () => {
        if (field.input.classList.contains("invalid")) {
          validateField(key);
        }
      });
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const results = Object.keys(fields).map((key) => validateField(key));
      const allValid = results.every(Boolean);

      if (!allValid) {
        if (formStatus) {
          formStatus.hidden = true;
          formStatus.textContent = "";
        }
        const firstInvalid = Object.values(fields).find(
          (f) => f.input && f.input.classList.contains("invalid")
        );
        if (firstInvalid?.input) {
          firstInvalid.input.focus();
        }
        return;
      }

      const nameVal = fields.name.input.value.trim();
      const emailVal = fields.email.input.value.trim();
      const subjectVal = fields.subject.input.value.trim();
      const messageVal = fields.message.input.value.trim();

      const mailBody = [
        `Name: ${nameVal}`,
        `Email: ${emailVal}`,
        "",
        messageVal,
      ].join("\n");

      const mailtoHref =
        `mailto:${emailAddress}` +
        `?subject=${encodeURIComponent(subjectVal)}` +
        `&body=${encodeURIComponent(mailBody)}`;

      if (formStatus) {
        formStatus.replaceChildren();

        const notice = document.createElement("p");
        notice.textContent =
          "Inputs validated. Because this static portfolio does not use a backend server, " +
          "your message was not sent automatically.";

        const mailLink = document.createElement("a");
        mailLink.href = mailtoHref;
        mailLink.textContent = "Open your email client with this message pre-filled";

        formStatus.appendChild(notice);
        formStatus.appendChild(mailLink);
        formStatus.hidden = false;
      }
    });
  }
});

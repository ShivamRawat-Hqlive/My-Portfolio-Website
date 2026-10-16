/**
 * Shivam Rawat - Portfolio Interactive Features
 * - Scroll Progress Indicator Bar
 * - IntersectionObserver Scroll Reveal Animations
 * - Interactive Skills Category Filtering Tabs
 * - Copy Email to Clipboard with Floating Toast Notification
 * - Floating Back-to-Top Button
 * - Navbar ScrollSpy (Active Section Highlighting)
 * - Accessible Mobile Hamburger Menu Toggle
 * - Dynamic Footer Year
 * - Interactive Contact Form Demo Handler
 */

document.addEventListener('DOMContentLoaded', () => {
  // Core Elements
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.portfolio-section');
  const currentYearSpan = document.getElementById('currentYear');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const floatingTopBtn = document.getElementById('floatingTopBtn');
  const toastNotification = document.getElementById('toastNotification');
  const copyButtons = document.querySelectorAll('[data-copy-text]');
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCategories = document.querySelectorAll('.skills-category');

  // Set current year in footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  /* --------------------------------------------------------------------------
     1. Scroll Progress Bar & Floating Top Button
     -------------------------------------------------------------------------- */
  const handleScrollProgress = () => {
    const scrollY = window.scrollY;
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Update top progress bar
    if (scrollProgressBar && documentHeight > 0) {
      const scrollPercent = Math.min(100, Math.max(0, (scrollY / documentHeight) * 100));
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // Toggle Floating Back to Top Button
    if (floatingTopBtn) {
      if (scrollY > 380) {
        floatingTopBtn.classList.add('visible');
      } else {
        floatingTopBtn.classList.remove('visible');
      }
    }
  };

  if (floatingTopBtn) {
    floatingTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --------------------------------------------------------------------------
     2. Scroll Reveal Animations (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback: reveal immediately if IntersectionObserver is unsupported
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  /* --------------------------------------------------------------------------
     3. Interactive Skills Category Filter
     -------------------------------------------------------------------------- */
  if (skillTabs.length > 0 && skillCategories.length > 0) {
    skillTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        // Toggle active tab style
        skillTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.getAttribute('data-filter');

        skillCategories.forEach((cat) => {
          const categoryGroup = cat.getAttribute('data-category');
          if (filter === 'all' || categoryGroup === filter) {
            cat.classList.remove('fade-out');
            cat.style.opacity = '1';
            cat.style.transform = 'translateY(0)';
          } else {
            cat.classList.add('fade-out');
          }
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     4. Copy to Clipboard & Toast Notification
     -------------------------------------------------------------------------- */
  const showToast = (message) => {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2800);
  };

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy-text');
      if (textToCopy) {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            showToast(`Copied ${textToCopy} to clipboard!`);
          }).catch(() => {
            fallbackCopy(textToCopy);
          });
        } else {
          fallbackCopy(textToCopy);
        }
      }
    });
  });

  const fallbackCopy = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${text} to clipboard!`);
    } catch (err) {
      showToast(`Email: ${text}`);
    }
    document.body.removeChild(textArea);
  };

  /* --------------------------------------------------------------------------
     5. Mobile Hamburger Navigation
     -------------------------------------------------------------------------- */
  const toggleMobileMenu = (forceClose = false) => {
    if (!navToggle || !navMenu) return;
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    const shouldOpen = forceClose ? false : !isExpanded;

    navToggle.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    navMenu.classList.toggle('nav-open', shouldOpen);
  };

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  // Close mobile menu when clicking nav links
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMobileMenu(true);
    });
  });

  // Close mobile menu on click outside
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('nav-open')) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        toggleMobileMenu(true);
      }
    }
  });

  // Close mobile menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('nav-open')) {
      toggleMobileMenu(true);
    }
  });

  /* --------------------------------------------------------------------------
     6. Navbar ScrollSpy (Active Section Highlight)
     -------------------------------------------------------------------------- */
  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const navbarHeight = document.querySelector('.navbar-wrapper')?.offsetHeight || 72;

    // Bottom of page detection (activates contact)
    if (scrollPosition + windowHeight >= documentHeight - 60) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        setActiveLink(lastSection.getAttribute('id'));
        return;
      }
    }

    let currentSectionId = '';

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navbarHeight - 70;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (!currentSectionId && sections.length > 0 && scrollPosition < 220) {
      currentSectionId = sections[0].getAttribute('id');
    }

    if (currentSectionId) {
      setActiveLink(currentSectionId);
    }
  };

  const setActiveLink = (sectionId) => {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  /* --------------------------------------------------------------------------
     7. Scroll Event Throttling via requestAnimationFrame
     -------------------------------------------------------------------------- */
  let isScrolling = false;
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        handleScrollProgress();
        updateActiveNavLink();
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  // Initial call on DOM load
  handleScrollProgress();
  updateActiveNavLink();

  /* --------------------------------------------------------------------------
     8. Contact Form Placeholder Demo Handler
     -------------------------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (formStatus) {
        formStatus.textContent = '✓ Thank you! Your message has been sent successfully.';
        formStatus.style.color = '#22543D';
        contactForm.reset();
        setTimeout(() => {
          formStatus.textContent = '';
        }, 5500);
      }
    });
  }
});

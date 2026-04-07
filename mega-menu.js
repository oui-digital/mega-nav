/**
 * Mega-Menu Disclosure Controller
 * Pragmatic, Accessible, and Lean (< 2KB)
 * No framework dependencies.
 */
(function () {
  const SELECTORS = {
    nav: '.mega-nav',
    mobileToggle: '.mega-nav__mobile-toggle',
    mobileClose: '.mega-nav__mobile-close',
    desktopToggle: '.mega-nav__toggle',
    panel: '.mega-nav__panel'
  };

  const cssOpenClass = 'is-open';
  let bodyScrollY = 0;

  /**
   * iOS specific scroll lock
   */
  function lockBodyScroll() {
    bodyScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${bodyScrollY}px`;
    document.body.style.width = '100%';
  }

  function unlockBodyScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, bodyScrollY);
  }

  /**
   * Checks if we are currently in desktop view (could use matchMedia, but offsetParent works fine too)
   */
  function isMobileView() {
    const mobileToggle = document.querySelector(SELECTORS.mobileToggle);
    return mobileToggle && window.getComputedStyle(mobileToggle).display !== 'none';
  }

  /**
   * Manage state of a disclosure button
   */
  function togglePanel(button, forceState = null) {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    const newState = forceState !== null ? forceState : !isExpanded;
    
    button.setAttribute('aria-expanded', newState);
    
    // Add CSS class for transition sync, since pure attribute selectors can be tricky to animate
    const panelId = button.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    if (panel) {
      if (newState) {
        panel.classList.add(cssOpenClass);
      } else {
        panel.classList.remove(cssOpenClass);
      }
    }
    
    return newState;
  }

  /**
   * Close all active dropdowns.
   */
  function closeAllDropdowns(withinNav = document) {
    const openToggles = withinNav.querySelectorAll(`${SELECTORS.desktopToggle}[aria-expanded="true"]`);
    openToggles.forEach(btn => togglePanel(btn, false));
  }

  /**
   * Setup Event Listeners
   */
  function init() {
    const mobileToggle = document.querySelector(SELECTORS.mobileToggle);
    const mobileClose = document.querySelector(SELECTORS.mobileClose);
    const mainNav = document.getElementById(mobileToggle?.getAttribute('aria-controls'));

    // Remove no-js class to enable JS interactions, disable CSS fallbacks
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js-enabled');

    // 1. Mobile Menu Toggle
    if (mobileToggle && mainNav) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = togglePanel(mobileToggle);
        if (isOpen) {
          mainNav.classList.add(cssOpenClass);
          lockBodyScroll();
        } else {
          mainNav.classList.remove(cssOpenClass);
          unlockBodyScroll();
        }
      });
    }

    // 2. Mobile Menu Explicit Close
    if (mobileClose && mainNav) {
      mobileClose.addEventListener('click', () => {
        togglePanel(mobileToggle, false);
        mainNav.classList.remove(cssOpenClass);
        unlockBodyScroll();
        mobileToggle.focus(); // Return focus for accessibility
      });
    }

    // 2. Desktop/Submenu Accordion Toggles (Event Delegation)
    document.addEventListener('click', (event) => {
      const toggleBtn = event.target.closest(SELECTORS.desktopToggle);
      
      if (toggleBtn) {
        // Enforce Accordion behavior defensively: if desktop, close siblings
        if (!isMobileView()) {
          const navRoot = toggleBtn.closest(SELECTORS.nav);
          // find all open toggles that are NOT this button or an ancestor of it
          const openToggles = navRoot.querySelectorAll(`${SELECTORS.desktopToggle}[aria-expanded="true"]`);
          openToggles.forEach(openBtn => {
             if (openBtn !== toggleBtn && !openBtn.contains(toggleBtn)) {
                 togglePanel(openBtn, false);
             }
          });
        }
        togglePanel(toggleBtn);
        return;
      }

      // 3. Click Outside to Close (Desktop primarily)
      if (!isMobileView()) {
        const isInsideNav = event.target.closest(SELECTORS.nav);
        if (!isInsideNav) {
          closeAllDropdowns();
        }
      }
    });

    // 4. Escape Key Unwinding Stack
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        // Stack 1: Close innermost open accordion/dropdown first
        const openToggles = Array.from(document.querySelectorAll(`${SELECTORS.desktopToggle}[aria-expanded="true"]`));
        if (openToggles.length > 0) {
          // Close the deepest one (pop the stack effectively)
          const lastOpen = openToggles[openToggles.length - 1];
          togglePanel(lastOpen, false);
          lastOpen.focus(); // Return focus to the toggle
          return; // Stop here, don't close the main drawer yet
        }

        // Stack 2: Close main mobile drawer
        if (isMobileView() && mobileToggle && mobileToggle.getAttribute('aria-expanded') === 'true') {
          togglePanel(mobileToggle, false);
          mainNav.classList.remove(cssOpenClass);
          unlockBodyScroll();
          mobileToggle.focus();
        }
      }
    });
  }

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

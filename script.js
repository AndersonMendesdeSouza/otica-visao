function initializePage() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.getElementById('main-navigation');

  if (menuToggle && navigation) {
    const desktopMedia = window.matchMedia('(min-width: 821px)');

    function setMenuOpen(isOpen) {
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      navigation.classList.toggle('is-open', isOpen);
    }

    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!isOpen);
    });

    navigation.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

      if (event.key === 'Escape' && isOpen) {
        setMenuOpen(false);
        menuToggle.focus();
      }
    });

    desktopMedia.addEventListener('change', (event) => {
      if (event.matches) {
        setMenuOpen(false);
      }
    });

    setMenuOpen(false);
  }

  const faqList = document.querySelector('.faq-list');

  if (faqList) {
    const faqItems = faqList.querySelectorAll('details.faq-item');

    faqItems.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (!item.open) {
          return;
        }

        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.open = false;
          }
        });
      });
    });
  }

  const currentYear = document.getElementById('current-year');

  if (currentYear) {
    currentYear.textContent = String(new Date().getFullYear());
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}

function initializeCarousels() {
  const carousels = document.querySelectorAll('.collection-carousel');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  carousels.forEach((carousel) => {
    const products = eyewearProducts.filter((product) => product.category === carousel.dataset.category);
    const track = carousel.querySelector('.carousel-track');
    const controls = carousel.querySelector('.carousel-controls');
    const status = carousel.querySelector('[data-carousel-status]');
    const name = carousel.querySelector('[data-product-name]');
    const description = carousel.querySelector('[data-product-description]');
    const detailsLink = carousel.querySelector('[data-product-details]');
    let currentIndex = 0;

    const slides = products.map((product, index) => {
      const link = document.createElement('a');
      link.className = 'carousel-slide';
      link.href = `details.html?modelo=${encodeURIComponent(product.id)}`;
      link.setAttribute('aria-label', `Ver detalhes de ${product.name}, modelo ${index + 1} de ${products.length}`);

      const image = document.createElement('img');
      image.src = product.image;
      image.alt = product.alt;
      image.width = 1200;
      image.height = 900;
      image.loading = 'lazy';
      image.draggable = false;
      link.append(image);
      return link;
    });

    track.replaceChildren(...slides);
    controls.hidden = false;

    function updateProduct(index) {
      const product = products[index];
      currentIndex = index;
      name.textContent = product.name;
      description.textContent = product.description;
      detailsLink.href = `details.html?modelo=${encodeURIComponent(product.id)}`;
      detailsLink.setAttribute('aria-label', `Ver detalhes de ${product.name}`);
      status.textContent = `Modelo ${index + 1} de ${products.length}`;

      slides.forEach((slide, slideIndex) => {
        slide.tabIndex = slideIndex === index ? 0 : -1;
      });

      if (slides.includes(document.activeElement)) {
        slides[index].focus({ preventScroll: true });
      }
    }

    function moveSlide(direction) {
      const nextIndex = (currentIndex + direction + products.length) % products.length;
      track.scrollTo({
        left: nextIndex * track.clientWidth,
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
      });
    }

    carousel.querySelector('[data-carousel-previous]').addEventListener('click', () => moveSlide(-1));
    carousel.querySelector('[data-carousel-next]').addEventListener('click', () => moveSlide(1));

    track.addEventListener('scroll', () => {
      const index = Math.round(track.scrollLeft / track.clientWidth);

      if (index !== currentIndex && products[index]) {
        updateProduct(index);
      }
    }, { passive: true });

    track.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        moveSlide(event.key === 'ArrowRight' ? 1 : -1);
      }
    });

    window.addEventListener('resize', () => {
      track.scrollTo({ left: currentIndex * track.clientWidth, behavior: 'auto' });
    });

    updateProduct(0);
  });
}

function initializeProductDetails() {
  const detailsSection = document.getElementById('product-details');

  if (!detailsSection) {
    return;
  }

  const productId = new URLSearchParams(window.location.search).get('modelo');
  const product = eyewearProducts.find((item) => item.id === productId);

  if (!product) {
    document.getElementById('product-not-found').hidden = false;
    document.title = 'Modelo não encontrado | Ótica Visão';
    return;
  }

  const image = document.getElementById('detail-image');
  image.src = product.image;
  image.alt = product.alt;
  document.getElementById('detail-category').textContent = product.categoryLabel;
  document.getElementById('detail-title').textContent = product.name;
  document.getElementById('detail-description').textContent = product.description;
  document.getElementById('detail-shape').textContent = product.shape;
  document.getElementById('detail-color').textContent = product.color;
  document.getElementById('detail-back').href = `index.html#${product.category}`;
  document.getElementById('detail-contact').setAttribute('aria-label', `Consultar o estilo ${product.name} no Instagram`);
  document.title = `${product.name} | Ótica Visão`;
  detailsSection.hidden = false;
}

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

  initializeCarousels();
  initializeProductDetails();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}

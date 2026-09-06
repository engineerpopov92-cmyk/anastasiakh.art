/**
 * Anastasia Kh. - Landing Page & Art Showcase
 * Interactive features: Lightbox modal, Light/Dark Theme toggle, Touch swipe
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // 2. Theme Toggle with LocalStorage
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  const savedTheme = localStorage.getItem('anastasia_theme');
  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Default to light paper aesthetic unless dark preferred
    htmlElement.setAttribute('data-theme', 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('anastasia_theme', newTheme);
    });
  }

  // 3. Gallery Lightbox
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxCounter = document.getElementById('lightboxCounter');

  let currentIndex = 0;
  const galleryData = galleryItems.map(item => ({
    src: item.getAttribute('data-src'),
    title: item.getAttribute('data-title') || '',
    desc: item.getAttribute('data-desc') || ''
  }));

  const updateLightboxContent = (index) => {
    if (index < 0) index = galleryData.length - 1;
    if (index >= galleryData.length) index = 0;
    currentIndex = index;

    const item = galleryData[currentIndex];
    
    // Smooth image transition
    lightboxImg.style.opacity = '0.3';
    lightboxImg.src = item.src;
    lightboxImg.alt = item.title;

    lightboxImg.onload = () => {
      lightboxImg.style.opacity = '1';
    };

    lightboxTitle.innerHTML = item.title;
    lightboxDesc.textContent = item.desc;
    lightboxCounter.textContent = `${currentIndex + 1} / ${galleryData.length}`;

    // Preload next and prev images
    const nextIdx = (currentIndex + 1) % galleryData.length;
    const prevIdx = (currentIndex - 1 + galleryData.length) % galleryData.length;
    new Image().src = galleryData[nextIdx].src;
    new Image().src = galleryData[prevIdx].src;
  };

  const openLightbox = (index) => {
    updateLightboxContent(index);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showNext = () => updateLightboxContent(currentIndex + 1);
  const showPrev = () => updateLightboxContent(currentIndex - 1);

  // Gallery item click listeners
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-index'), 10) || 0;
      openLightbox(idx);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    }
  });

  // Touch Swipe Support for Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showNext(); // Swiped left
    } else if (touchEndX > touchStartX + swipeThreshold) {
      showPrev(); // Swiped right
    }
  };

  // 4. Image Protection (Disable Right-Click & Drag to Save)
  const toast = document.getElementById('protectionToast');
  let toastTimeout = null;

  const showProtectionToast = () => {
    if (!toast) return;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 1800);
  };

  const protectedSelectors = [
    '.gallery-section',
    '.gallery-item',
    '.gallery-thumb-wrap',
    '.gallery-img',
    '#lightbox',
    '.lightbox-container',
    '.lightbox-content',
    '.lightbox-image-wrapper',
    '#lightboxImg',
    '.studio-imagery',
    '.studio-img'
  ];

  protectedSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showProtectionToast();
        return false;
      });
      el.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
      });
    });
  });

  // Catch-all safety net for any image right-click or drag
  document.addEventListener('contextmenu', (e) => {
    if (
      e.target.tagName === 'IMG' ||
      e.target.closest('.gallery-section') ||
      e.target.closest('#lightbox') ||
      e.target.closest('.studio-section')
    ) {
      e.preventDefault();
      showProtectionToast();
      return false;
    }
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      return false;
    }
  });
});


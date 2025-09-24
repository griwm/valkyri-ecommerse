document.addEventListener('DOMContentLoaded', () => {
  // Navbar and filter bar scroll behavior (hide on scroll down, show on scroll up)
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');
  const filterSection = document.querySelector('.filter-section');

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      navbar.classList.remove('hidden');
      filterSection?.classList.remove('hidden');
      lastScroll = 0;
      return;
    }

    if (currentScroll > lastScroll) {
      if (!navbar.classList.contains('hidden')) {
        navbar.classList.add('hidden');
        filterSection?.classList.add('hidden');
      }
    } else if (currentScroll < lastScroll) {
      if (navbar.classList.contains('hidden')) {
        navbar.classList.remove('hidden');
        filterSection?.classList.remove('hidden');
      }
    }

    lastScroll = currentScroll;
  });
    // Quick View Functionality
    const quickViewButtons = document.querySelectorAll('.quick-view-btn');
    const quickViewOverlay = document.createElement('div');
    quickViewOverlay.className = 'quick-view-overlay';
    document.body.appendChild(quickViewOverlay);
  
    quickViewButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const card = button.closest('.product-card');
        const image = card.querySelector('img').src;
        const title = card.querySelector('h3').textContent;
        const price = card.querySelector('.price').textContent;
        
        showQuickView(image, title, price);
      });
    });
  
    function showQuickView(image, title, price) {
      const modal = document.createElement('div');
      modal.className = 'quick-view-modal';
      modal.innerHTML = `
        <button class="quick-view-close">×</button>
        <div class="quick-view-content">
          <div class="quick-view-image">
            <img src="${image}" alt="${title}">
          </div>
          <div class="quick-view-details">
            <h2>${title}</h2>
            <p class="quick-view-price">${price}</p>
            
            <div class="quick-view-colors">
              <h3>Colors</h3>
              <div class="color-options">
                <button class="color-option" style="background: #000000;"></button>
                <button class="color-option" style="background: #4A90E2;"></button>
                <button class="color-option" style="background: #9B4D73;"></button>
              </div>
            </div>
            
            <div class="quick-view-sizes">
              <h3>Size</h3>
              <div class="size-options">
                <button class="size-option">XS</button>
                <button class="size-option">S</button>
                <button class="size-option">M</button>
                <button class="size-option">L</button>
                <button class="size-option">XL</button>
              </div>
            </div>
            
            <button class="add-to-cart-btn">Add to Cart</button>
          </div>
        </div>
      `;
  
      quickViewOverlay.innerHTML = '';
      quickViewOverlay.appendChild(modal);
      quickViewOverlay.style.display = 'flex';
  
      // Close button functionality
      const closeBtn = modal.querySelector('.quick-view-close');
      closeBtn.addEventListener('click', () => {
        quickViewOverlay.style.display = 'none';
      });
  
      // Close on overlay click
      quickViewOverlay.addEventListener('click', (e) => {
        if (e.target === quickViewOverlay) {
          quickViewOverlay.style.display = 'none';
        }
      });
  
      // Color selection
      const colorOptions = modal.querySelectorAll('.color-option');
      colorOptions.forEach(option => {
        option.addEventListener('click', () => {
          colorOptions.forEach(opt => opt.classList.remove('selected'));
          option.classList.add('selected');
        });
      });
  
      // Size selection
      const sizeOptions = modal.querySelectorAll('.size-option');
      sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
          sizeOptions.forEach(opt => opt.classList.remove('selected'));
          option.classList.add('selected');
        });
      });
    }
  
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
          behavior: 'smooth'
        });
      });
    });
  
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
  
    images.forEach(img => imageObserver.observe(img));
  
    // Add to cart animation
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', () => {
        button.classList.add('added');
        button.textContent = 'Added to Cart';
        
        setTimeout(() => {
          button.classList.remove('added');
          button.textContent = 'Add to Cart';
        }, 2000);
      });
    });
  
  // Filtering and sorting for Women's page
  const filterButtons = document.querySelectorAll('.filter-btn');
  const womensGrids = document.querySelectorAll('.womens-product-grid');
  const womensCards = document.querySelectorAll('.womens-product-grid .product-card');

  const normalize = (text) => (text || '').toLowerCase().trim();

  // Preserve original order per grid for Featured sorting
  womensGrids.forEach(grid => {
    Array.from(grid.children).forEach((child, idx) => {
      if (child instanceof HTMLElement) child.dataset.originalIndex = String(idx);
    });
  });

  const showCard = (card, show) => {
    if (card instanceof HTMLElement) card.style.display = show ? '' : 'none';
  };

  const parsePrice = (card) => {
    const priceEl = card.querySelector('.product-price');
    if (!priceEl) return NaN;
    const cleaned = priceEl.textContent ? priceEl.textContent.replace(/[^0-9.,]/g, '').replace(',', '') : '';
    const value = parseFloat(cleaned);
    return isNaN(value) ? NaN : value;
  };

  const isNewBadge = (card) => {
    const badge = card.querySelector('.product-badge');
    return badge && /new/i.test(badge.textContent || '');
  };

  const sortSelect = document.querySelector('.sort-select');
  const currentSortValue = () => (sortSelect instanceof HTMLSelectElement ? sortSelect.value : 'featured');

  const sortGrids = (sortValue) => {
    const sortKey = (sortValue || '').toLowerCase();
    womensGrids.forEach(grid => {
      const cards = Array.from(grid.querySelectorAll('.product-card'));
      if (sortKey === 'featured' || !sortKey) {
        cards.sort((a, b) => {
          const ia = Number((a instanceof HTMLElement && a.dataset.originalIndex) || 0);
          const ib = Number((b instanceof HTMLElement && b.dataset.originalIndex) || 0);
          return ia - ib;
        });
      } else if (sortKey === 'newest') {
        cards.sort((a, b) => {
          const na = isNewBadge(a) ? 1 : 0;
          const nb = isNewBadge(b) ? 1 : 0;
          if (nb !== na) return nb - na; // New first
          const ia = Number((a instanceof HTMLElement && a.dataset.originalIndex) || 0);
          const ib = Number((b instanceof HTMLElement && b.dataset.originalIndex) || 0);
          return ia - ib;
        });
      } else if (sortKey === 'price-low') {
        cards.sort((a, b) => {
          const pa = parsePrice(a);
          const pb = parsePrice(b);
          if (!isNaN(pa) && !isNaN(pb) && pa !== pb) return pa - pb;
          const ia = Number((a instanceof HTMLElement && a.dataset.originalIndex) || 0);
          const ib = Number((b instanceof HTMLElement && b.dataset.originalIndex) || 0);
          return ia - ib;
        });
      } else if (sortKey === 'price-high') {
        cards.sort((a, b) => {
          const pa = parsePrice(a);
          const pb = parsePrice(b);
          if (!isNaN(pa) && !isNaN(pb) && pa !== pb) return pb - pa;
          const ia = Number((a instanceof HTMLElement && a.dataset.originalIndex) || 0);
          const ib = Number((b instanceof HTMLElement && b.dataset.originalIndex) || 0);
          return ia - ib;
        });
      }

      cards.forEach(card => grid.appendChild(card));
    });
  };

  if (sortSelect instanceof HTMLSelectElement) {
    sortSelect.addEventListener('change', () => {
      sortGrids(currentSortValue());
    });
  }

  const applyFilter = (selectedCategory) => {
    const normalizedSelected = normalize(selectedCategory);
    womensCards.forEach(card => {
      const categoryEl = card.querySelector('.product-category');
      const productCategory = normalize(categoryEl ? categoryEl.textContent : '');
      if (!normalizedSelected || normalizedSelected === 'all') {
        showCard(card, true);
      } else {
        showCard(card, productCategory === normalizedSelected);
      }
    });

    sortGrids(currentSortValue());
  };

  if (filterButtons.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.textContent);
      });
    });

    const activeBtn = document.querySelector('.filter-btn.active') || filterButtons[0];
    if (activeBtn) applyFilter(activeBtn.textContent);
    sortGrids(currentSortValue());
  }
  });
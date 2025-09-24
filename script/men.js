document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll behavior
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');
  const filterSection = document.querySelector('.filter-section');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      navbar.classList.remove('hidden');
      filterSection?.classList.remove('hidden');
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

  // Mega Menu functionality
  const navItems = document.querySelectorAll('.nav-item');
  const megaMenu = document.getElementById('mega-menu');
  const overlay = document.querySelector('.dropdown-overlay');
  let activeDropdown = null;

  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const category = item.dataset.category;
      if (activeDropdown !== category) {
        activeDropdown = category;
        megaMenu.classList.add('active');
        overlay.classList.add('active');
      }
    });
  });

  megaMenu.addEventListener('mouseleave', () => {
    activeDropdown = null;
    megaMenu.classList.remove('active');
    overlay.classList.remove('active');
  });

  // Smooth scroll for hero scroll button
  const heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', () => {
      const nextSection = document.querySelector('.category-showcase');
      nextSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections for fade-in
  document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
  });

  // Newsletter form handling
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input[type="email"]').value;
      
      // Here you would typically send this to your backend
      console.log('Newsletter signup:', email);
      
      // Show success message
      const button = newsletterForm.querySelector('button');
      const originalText = button.textContent;
      button.textContent = 'Subscribed!';
      button.style.backgroundColor = '#2ecc71';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        newsletterForm.reset();
      }, 2000);
    });
  }

  // Product filtering by category (Filter Section)
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (filterButtons.length) {
    const allProductCards = document.querySelectorAll('.mens-product-grid .product-card');

    const normalize = (text) => (text || '').toLowerCase().trim();

    const showCard = (card, show) => {
      card.style.display = show ? '' : 'none';
    };

    // Prepare original order indexes for stable sorting within each grid
    document.querySelectorAll('.mens-product-grid').forEach(grid => {
      Array.from(grid.children).forEach((child, idx) => {
        if (child instanceof HTMLElement) child.dataset.originalIndex = String(idx);
      });
    });

    const parsePrice = (card) => {
      const priceEl = card.querySelector('.product-price');
      if (!priceEl) return NaN;
      const match = priceEl.textContent ? priceEl.textContent.replace(/[^0-9.,]/g, '').replace(',', '') : '';
      const value = parseFloat(match);
      return isNaN(value) ? NaN : value;
    };

    const isNewBadge = (card) => {
      const badge = card.querySelector('.product-badge');
      return badge && /new/i.test(badge.textContent || '');
    };

    const sortGrids = (sortValue) => {
      const sortKey = (sortValue || '').toLowerCase();
      document.querySelectorAll('.mens-product-grid').forEach(grid => {
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

        // Re-append in new order
        cards.forEach(card => grid.appendChild(card));
      });
    };

    const sortSelect = document.querySelector('.sort-select');
    const currentSortValue = () => (sortSelect instanceof HTMLSelectElement ? sortSelect.value : 'featured');
    if (sortSelect instanceof HTMLSelectElement) {
      sortSelect.addEventListener('change', () => {
        sortGrids(currentSortValue());
      });
    }

    const applyFilter = (selectedCategory) => {
      const normalizedSelected = normalize(selectedCategory);

      allProductCards.forEach(card => {
        const categoryEl = card.querySelector('.product-category');
        const productCategory = normalize(categoryEl ? categoryEl.textContent : '');

        if (!normalizedSelected || normalizedSelected === 'all') {
          showCard(card, true);
        } else {
          showCard(card, productCategory === normalizedSelected);
        }
      });

      // Update section heading and "View All" label in the Premium Jackets section
      const jacketsSection = document.getElementById('jackets');
      if (jacketsSection) {
        const heading = jacketsSection.querySelector('h2');
        const viewAll = jacketsSection.querySelector('.view-all-btn');
        const label = (selectedCategory || '').trim();
        if (heading && viewAll) {
          if (!normalizedSelected || normalizedSelected === 'all') {
            heading.textContent = 'Premium Jackets';
            viewAll.textContent = 'View All Jackets';
          } else {
            heading.textContent = `Premium ${label}`;
            viewAll.textContent = `View All ${label}`;
          }
        }
      }

      // Re-apply current sort after filtering so order stays consistent
      sortGrids(currentSortValue());
    };

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilter(btn.textContent);
      });
    });

    // Initialize to currently active button or default to 'All'
    const activeBtn = document.querySelector('.filter-btn.active') || filterButtons[0];
    if (activeBtn) applyFilter(activeBtn.textContent);
    // Initial sort
    sortGrids(currentSortValue());
  }
  // If clicking on the product card, prefer the explicit Add to cart button if present
  document.querySelectorAll('.mens-featured .product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const target = e.target;
      if (target instanceof HTMLElement && target.closest('.add-to-cart')) return; // let the button handler run
      const addBtn = card.querySelector('.add-to-cart, .product-button');
      if (addBtn instanceof HTMLElement) {
        addBtn.click();
      }
    });
  });
});
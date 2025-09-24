document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll behavior
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
      navbar.classList.remove('hidden');
      return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('hidden')) {
      navbar.classList.add('hidden');
    } else if (currentScroll < lastScroll && navbar.classList.contains('hidden')) {
      navbar.classList.remove('hidden');
    }
    
    lastScroll = currentScroll;
  });

  // Mega Menu functionality
  const navItems = document.querySelectorAll('.nav-item');
  const megaMenu = document.getElementById('mega-menu');
  const overlay = document.querySelector('.dropdown-overlay');
  let activeDropdown = null;

  // Profile/login injection removed per request

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

  // Mobile menu toggle
  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu && overlay) {
    const toggleMobileMenu = (open) => {
      if (open) {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        mobileMenu.setAttribute('aria-hidden', 'false');
      } else {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    };
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('active');
      toggleMobileMenu(!isOpen);
    });
    overlay.addEventListener('click', () => toggleMobileMenu(false));
  }

  // Cart state and Drawer interactions
  const cartButton = document.querySelector('.cart-btn') || document.querySelector('.icon-btn');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartClose = document.querySelector('.cart-close');
  const cartItemsEl = document.querySelector('.cart-items');
  const cartEmptyEl = document.querySelector('.cart-empty');
  const totalEl = document.querySelector('.cart-total-value');
  const buyBtn = document.getElementById('buy-now');

  const cart = [];
  const priceIdMap = {
    'Alpha Pro Jacket': 'price_1Ry6s4GdfBSUzsVFpwJDTiyW'
  };

  function openCart() {
    cartDrawer?.classList.add('active');
    cartOverlay?.classList.add('active');
    cartDrawer?.setAttribute('aria-hidden', 'false');
  }

  function closeCart() {
    cartDrawer?.classList.remove('active');
    cartOverlay?.classList.remove('active');
    cartDrawer?.setAttribute('aria-hidden', 'true');
  }

  function formatCurrency(amount) {
    return `$${amount.toFixed(0)}`;
  }

  function renderCart() {
    if (!cartItemsEl || !cartEmptyEl || !totalEl) return;
    cartItemsEl.innerHTML = '';
    if (cart.length === 0) {
      cartEmptyEl.style.display = 'block';
      totalEl.textContent = '$0';
      return;
    }
    cartEmptyEl.style.display = 'none';
    let total = 0;
    cart.forEach((item, index) => {
      total += item.price * item.qty;
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <div class="cart-item-meta"><span>$${item.price}</span></div>
          <div class="qty-controls" data-index="${index}">
            <button class="qty-btn" data-action="decrement" aria-label="Decrease quantity">−</button>
            <input class="qty-input" type="number" min="1" value="${item.qty}" aria-label="Quantity">
            <button class="qty-btn" data-action="increment" aria-label="Increase quantity">+</button>
          </div>
        </div>`;
      cartItemsEl.appendChild(row);
    });
    totalEl.textContent = formatCurrency(total);
  }

  function addToCart(product) {
    const existing = cart.find(i => i.name === product.name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }
    renderCart();
    openCart();
  }

  // Inject Add to cart buttons where missing
  document.querySelectorAll('.product-card').forEach(card => {
    const hasButton = card.querySelector('.add-to-cart, .product-button');
    const details = card.querySelector('.product-details');
    if (!hasButton && details) {
      const btn = document.createElement('button');
      btn.className = 'add-to-cart';
      btn.textContent = 'Add to cart';
      details.appendChild(btn);
    }
  });

  // Attach Add to cart buttons
  // Buttons we add on index and any existing product buttons
  document.querySelectorAll('.product-card .add-to-cart, .product-card .product-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.product-card');
      if (!card) return;
      // Try to read from dataset; fallback to DOM content
      let name = card.dataset.name;
      let price = parseFloat(card.dataset.price || '0');
      let image = card.dataset.image;
      let priceId = card.dataset.priceId;
      if (!name) name = card.querySelector('h3, .product-title')?.textContent?.trim() || 'Product';
      if (!price || Number.isNaN(price)) {
        const priceText = card.querySelector('.product-price')?.textContent || '';
        const match = priceText.replace(',', '').match(/([0-9]+(\.[0-9]{1,2})?)/);
        price = match ? parseFloat(match[1]) : 0;
      }
      if (!image) image = card.querySelector('img')?.src || '';
      if (!priceId && name && priceIdMap[name]) priceId = priceIdMap[name];
      const product = { name, price, image, priceId };
      addToCart(product);
    });
  });

  // Quantity handlers (event delegation)
  cartItemsEl?.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const wrapper = target.closest('.qty-controls');
    if (!wrapper) return;
    const index = parseInt(wrapper.dataset.index || '-1', 10);
    if (Number.isNaN(index) || !cart[index]) return;
    if (action === 'increment') cart[index].qty += 1;
    if (action === 'decrement') cart[index].qty = Math.max(1, cart[index].qty - 1);
    renderCart();
  });

  cartItemsEl?.addEventListener('input', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLInputElement) || !target.classList.contains('qty-input')) return;
    const wrapper = target.closest('.qty-controls');
    if (!wrapper) return;
    const index = parseInt(wrapper.dataset.index || '-1', 10);
    if (Number.isNaN(index) || !cart[index]) return;
    const value = Math.max(1, parseInt(target.value || '1', 10));
    cart[index].qty = value;
    renderCart();
  });

  // Open/Close cart events
  cartButton?.addEventListener('click', openCart);
  cartOverlay?.addEventListener('click', closeCart);
  cartClose?.addEventListener('click', closeCart);

  // Stripe Checkout
  buyBtn?.addEventListener('click', async () => {
    if (cart.length === 0) return;
    const pkMeta = document.querySelector('meta[name="stripe-pk"]');
    const publishableKey = pkMeta?.getAttribute('content') || '';
    const stripe = window.Stripe && window.Stripe(publishableKey);
    if (!stripe) {
      alert('Stripe is not configured. Add your publishable key to <meta name="stripe-pk" content="...">');
      return;
    }
    // Convert cart items to line items
    const lineItems = cart
      .filter(i => i.priceId)
      .map(i => ({ price: i.priceId, quantity: i.qty }));
    if (!lineItems.length) {
      alert('Missing Stripe price IDs.');
      return;
    }
    const paymentMethodSelect = document.getElementById('payment-select');
    const selectedMethod = paymentMethodSelect && paymentMethodSelect.value ? paymentMethodSelect.value : 'card';
    buyBtn.disabled = true;
    buyBtn.textContent = 'Redirecting...';
    try {
      const { error } = await stripe.redirectToCheckout({
        lineItems,
        mode: 'payment',
        successUrl: window.location.origin + '/success.html',
        cancelUrl: window.location.origin + '/cancel.html'
      });
      if (error) {
        alert(error.message || 'Checkout failed.');
      }
    } finally {
      buyBtn.disabled = false;
      buyBtn.textContent = 'Buy now';
    }
  });

  renderCart();
});
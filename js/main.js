/* ============================================
   GHOSTLINE — main.js

   Functionality:
   1. Navbar: scroll behavior + on-hero state
   2. Mobile navigation toggle
   3. Desktop nav groups
   4. Hero slider: auto-play, prev/next, progress bar
   5. Search overlay (static catalog)
   6. Bag / cart (localStorage)
   7. Smooth scroll
   8. Shop filters
   9. Legal TOC
   ============================================ */

const navbar = document.getElementById('navbar');
const hero = document.getElementById('hero');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const searchBtn = document.getElementById('search-btn');
const bagBtn = document.getElementById('bag-btn');
const bagCountEl = document.getElementById('bag-count');

const BAG_STORAGE_KEY = 'ghostline-bag';

const SEARCH_PAGES = [
  { name: 'Home', href: 'index.html', meta: 'Index' },
  { name: 'Men', href: 'men.html', meta: 'Shop' },
  { name: 'Women', href: 'women.html', meta: 'Shop' },
  { name: 'New Arrivals', href: 'new-arrivals.html', meta: 'Shop' },
  { name: 'Accessories', href: 'accessories.html', meta: 'Collections' },
  { name: 'Blog', href: 'blog.html', meta: 'Journal' },
  { name: 'Terms & Conditions', href: 'terms.html', meta: 'Info' },
  { name: 'Privacy Policy', href: 'privacy.html', meta: 'Info' }
];

const SEARCH_PRODUCTS = [
  { name: 'LAYER 03 TEE', price: '₹1,899', image: 'assets/images/products/layer-03-tee.jpg', href: 'men.html', meta: 'T-Shirts / Men' },
  { name: 'BLOCK 12 HOODIE', price: '₹3,499', image: 'assets/images/products/block-12-hoodie.jpg', href: 'men.html', meta: 'Hoodies / Men' },
  { name: 'LOT NO. 004 CARGO', price: '₹3,199', image: 'assets/images/products/lot-004-cargo.jpg', href: 'men.html', meta: 'Pants / Men' },
  { name: 'NIGHT WALL CAP', price: '₹1,299', image: 'assets/images/products/night-wall-cap.jpg', href: 'accessories.html', meta: 'Accessories' },
  { name: 'WALL PRINT TEE', price: '₹1,799', image: 'assets/images/products/mens-wall-tee.jpg', href: 'men.html', meta: 'T-Shirts / Men' },
  { name: 'CONCRETE PULLOVER', price: '₹3,299', image: 'assets/images/products/mens-concrete-hoodie.jpg', href: 'men.html', meta: 'Hoodies / Men' },
  { name: 'GHOST CARGO', price: '₹2,999', image: 'assets/images/products/mens-ghost-cargo.jpg', href: 'men.html', meta: 'Pants / Men' },
  { name: 'LAYER CAP', price: '₹1,199', image: 'assets/images/products/mens-layer-cap.jpg', href: 'accessories.html', meta: 'Accessories' },
  { name: 'BRICK TEE', price: '₹1,999', image: 'assets/images/products/mens-brick-tee.jpg', href: 'men.html', meta: 'T-Shirts / Men' },
  { name: 'GHOST SIGN TEE', price: '₹1,799', image: 'assets/images/products/womens-ghost-tee.jpg', href: 'women.html', meta: 'T-Shirts / Women' },
  { name: 'WALL HOODIE', price: '₹3,299', image: 'assets/images/products/womens-wall-hoodie.jpg', href: 'women.html', meta: 'Hoodies / Women' },
  { name: 'LAYER CARGO', price: '₹2,999', image: 'assets/images/products/womens-layer-cargo.jpg', href: 'women.html', meta: 'Pants / Women' },
  { name: 'BRICK TEE', price: '₹1,699', image: 'assets/images/products/womens-brick-tee.jpg', href: 'women.html', meta: 'T-Shirts / Women' },
  { name: 'CONCRETE DRESS', price: '₹2,499', image: 'assets/images/products/womens-concrete-dress.jpg', href: 'women.html', meta: 'Women' },
  { name: 'ARCHIVE HOODIE', price: '₹3,099', image: 'assets/images/products/womens-archive-hoodie.jpg', href: 'women.html', meta: 'Hoodies / Women' },
  { name: 'PAINT OVER TEE', price: '₹1,899', image: 'assets/images/products/womens-paint-tee.jpg', href: 'women.html', meta: 'T-Shirts / Women' },
  { name: 'GHOST TOTE', price: '₹899', image: 'assets/images/products/acc-ghost-tote.jpg', href: 'accessories.html', meta: 'Accessories' },
  { name: 'BRICK CAP', price: '₹1,099', image: 'assets/images/products/acc-brick-cap.jpg', href: 'accessories.html', meta: 'Accessories' },
  { name: 'WALL BAG', price: '₹1,599', image: 'assets/images/products/acc-wall-bag.jpg', href: 'accessories.html', meta: 'Accessories' },
  { name: 'LOT STAMP KEYCHAIN', price: '₹399', image: 'assets/images/products/acc-stamp-keychain.jpg', href: 'accessories.html', meta: 'Accessories' }
];

function parsePrice(text) {
  const n = String(text || '').replace(/[^\d]/g, '');
  return n ? parseInt(n, 10) : 0;
}

function formatPrice(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

function currentFile() {
  const path = window.location.pathname.split('/').pop();
  return path || 'index.html';
}

function setBodyLock() {
  const locked = Boolean(
    (mobileNav && mobileNav.classList.contains('open')) ||
    document.querySelector('.search-overlay.open') ||
    document.querySelector('.bag-panel.open')
  );
  document.body.classList.toggle('gl-lock', locked);
}

function setInert(el, inert) {
  if (!el) return;
  if (inert) el.setAttribute('inert', '');
  else el.removeAttribute('inert');
}


// ============================================
// 1. NAVBAR — scroll + hero awareness
// ============================================

function updateNavbar() {
  if (!navbar) return;

  const scrolled = window.scrollY > 20;
  navbar.classList.toggle('scrolled', scrolled);

  if (!hero) return;

  const heroBottom = hero.offsetTop + hero.offsetHeight;
  const pastHero = window.scrollY + 56 >= heroBottom;
  navbar.classList.toggle('on-hero', !pastHero);
}

if (navbar) {
  const isShopPage = !navbar.classList.contains('on-hero');

  if (isShopPage) {
    function updateShopNavbar() {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }
    updateShopNavbar();
    window.addEventListener('scroll', updateShopNavbar, { passive: true });
  } else {
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
  }
}


// ============================================
// 2. MOBILE NAVIGATION
// ============================================

function syncMobileNavLinks() {
  if (!mobileNav) return;
  const open = mobileNav.classList.contains('open');
  mobileNav.querySelectorAll('a').forEach(link => {
    if (open) link.removeAttribute('tabindex');
    else link.setAttribute('tabindex', '-1');
  });
  setInert(mobileNav, !open);
}

function openMobileNav() {
  if (!hamburger || !mobileNav) return;
  closeSearch();
  closeBag();
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileNav.classList.add('open');
  syncMobileNavLinks();
  setBodyLock();
}

function closeMobileNav() {
  if (!hamburger || !mobileNav) return;
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  syncMobileNavLinks();
  setBodyLock();
}

if (hamburger && mobileNav) {
  syncMobileNavLinks();

  hamburger.addEventListener('click', () => {
    if (mobileNav.classList.contains('open')) closeMobileNav();
    else openMobileNav();
  });

  mobileNav.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
}


// ============================================
// 3. DESKTOP NAV GROUPS
// ============================================

const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');

dropdownItems.forEach(item => {
  const trigger = item.querySelector('.nav-dropdown-trigger');
  if (!trigger) return;

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    const open = item.classList.contains('open');
    dropdownItems.forEach(other => other.classList.remove('open'));
    item.classList.toggle('open', !open);
    trigger.setAttribute('aria-expanded', String(!open));
  });
});

document.addEventListener('click', (e) => {
  dropdownItems.forEach(item => {
    if (!item.contains(e.target)) {
      item.classList.remove('open');
      const trigger = item.querySelector('.nav-dropdown-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }
  });
});

(function markCurrentNav() {
  const file = currentFile();
  document.querySelectorAll('.nav-links a[href], .nav-dropdown a[href], .mobile-nav-link[href]').forEach(link => {
    const href = link.getAttribute('href') || '';
    const dest = href.split('?')[0];
    if (dest === file) link.setAttribute('aria-current', 'page');
  });
})();


// ============================================
// 4. HERO SLIDER
// ============================================

const slides = Array.from(document.querySelectorAll('.slide'));
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const slideCounterEl = document.getElementById('slide-counter');
const progressFill = document.getElementById('progress-fill');

const SLIDE_DURATION = 5000;

let currentSlide = 0;
let autoPlayTimer = null;

function goToSlide(index) {
  if (!slides.length) return;

  slides[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');

  if (slideCounterEl) {
    const num = String(currentSlide + 1).padStart(2, '0');
    const total = String(slides.length).padStart(2, '0');
    slideCounterEl.textContent = num + ' / ' + total;
  }

  startProgressBar();
}

function startProgressBar() {
  if (!progressFill) return;
  progressFill.style.transition = 'none';
  progressFill.style.width = '0%';
  progressFill.offsetWidth;
  progressFill.style.transition = 'width ' + SLIDE_DURATION + 'ms linear';
  progressFill.style.width = '100%';
}

function startAutoPlay() {
  if (!slides.length) return;
  clearInterval(autoPlayTimer);
  autoPlayTimer = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, SLIDE_DURATION);
}

function resetAutoPlay() {
  clearInterval(autoPlayTimer);
  startAutoPlay();
}

function isTypingTarget(el) {
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || el.isContentEditable;
}

if (slides.length) {
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      resetAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      resetAutoPlay();
    });
  }

  if (hero) {
    hero.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
    hero.addEventListener('mouseleave', startAutoPlay);
  }

  goToSlide(0);
  startAutoPlay();
}


// ============================================
// 5. SEARCH
// ============================================

function ensureSearchOverlay() {
  let overlay = document.getElementById('search-overlay');
  if (overlay) return overlay;

  overlay = document.createElement('div');
  overlay.id = 'search-overlay';
  overlay.className = 'search-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Search archive');
  overlay.innerHTML =
    '<div class="search-overlay-bar">' +
      '<span class="search-overlay-label">Search archive</span>' +
      '<input id="search-input" type="search" placeholder="TYPE A LAYER, PAGE, OR PIECE" autocomplete="off" />' +
      '<button type="button" class="search-close" id="search-close">Close</button>' +
    '</div>' +
    '<div class="search-results" id="search-results"></div>';
  document.body.appendChild(overlay);
  return overlay;
}

const searchOverlay = ensureSearchOverlay();
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const searchClose = document.getElementById('search-close');

function matchesQuery(text, query) {
  return String(text).toLowerCase().indexOf(query) !== -1;
}

function renderSearch(query) {
  if (!searchResults) return;
  const q = query.trim().toLowerCase();

  if (!q) {
    searchResults.innerHTML =
      '<div class="search-empty">' +
        '<p>Type to search existing pages and products in this archive.</p>' +
        '<p class="search-meta">Pages</p>' +
        '<ul class="search-pages">' +
          SEARCH_PAGES.map(page =>
            '<li><a href="' + page.href + '"><span>' + page.name + '</span><span>' + page.meta + '</span></a></li>'
          ).join('') +
        '</ul>' +
      '</div>';
    return;
  }

  const pages = SEARCH_PAGES.filter(p => matchesQuery(p.name, q) || matchesQuery(p.meta, q));
  const products = SEARCH_PRODUCTS.filter(p =>
    matchesQuery(p.name, q) || matchesQuery(p.meta, q) || matchesQuery(p.price, q)
  );

  if (!pages.length && !products.length) {
    searchResults.innerHTML = '<p class="search-meta">Nothing in this layer matches “' + query.trim() + '”.</p>';
    return;
  }

  let html = '<p class="search-meta">' + (pages.length + products.length) + ' result' + ((pages.length + products.length) === 1 ? '' : 's') + '</p>';

  if (pages.length) {
    html += '<ul class="search-pages">';
    pages.forEach(page => {
      html += '<li><a href="' + page.href + '"><span>' + page.name + '</span><span>' + page.meta + '</span></a></li>';
    });
    html += '</ul>';
  }

  products.forEach(product => {
    html +=
      '<a class="search-result" href="' + product.href + '">' +
        '<img src="' + product.image + '" alt="" />' +
        '<span class="search-result-name">' + product.name + '</span>' +
        '<span class="search-result-meta">' + product.price + ' · ' + product.meta + '</span>' +
      '</a>';
  });

  searchResults.innerHTML = html;
}

function openSearch() {
  if (!searchOverlay) return;
  closeMobileNav();
  closeBag();
  searchOverlay.classList.add('open');
  renderSearch(searchInput ? searchInput.value : '');
  setBodyLock();
  if (searchInput) {
    searchInput.focus();
    searchInput.select();
  }
  if (searchBtn) searchBtn.setAttribute('aria-expanded', 'true');
}

function closeSearch() {
  if (!searchOverlay) return;
  searchOverlay.classList.remove('open');
  setBodyLock();
  if (searchBtn) searchBtn.setAttribute('aria-expanded', 'false');
}

if (searchBtn) {
  searchBtn.setAttribute('aria-expanded', 'false');
  searchBtn.addEventListener('click', () => {
    if (searchOverlay.classList.contains('open')) closeSearch();
    else openSearch();
  });
}

if (searchClose) searchClose.addEventListener('click', closeSearch);

if (searchInput) {
  searchInput.addEventListener('input', () => renderSearch(searchInput.value));
}

if (searchOverlay) {
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });
}


// ============================================
// 6. BAG / CART
// ============================================

function ensureBagPanel() {
  let backdrop = document.getElementById('bag-backdrop');
  let panel = document.getElementById('bag-panel');
  if (backdrop && panel) return { backdrop, panel };

  backdrop = document.createElement('div');
  backdrop.id = 'bag-backdrop';
  backdrop.className = 'bag-backdrop';

  panel = document.createElement('aside');
  panel.id = 'bag-panel';
  panel.className = 'bag-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Shopping bag');
  panel.innerHTML =
    '<div class="bag-header">' +
      '<h2>Bag</h2>' +
      '<button type="button" class="bag-close" id="bag-close">Close</button>' +
    '</div>' +
    '<div class="bag-body" id="bag-body"></div>' +
    '<div class="bag-footer" id="bag-footer"></div>';

  document.body.appendChild(backdrop);
  document.body.appendChild(panel);
  return { backdrop, panel };
}

const bagUI = ensureBagPanel();
const bagBody = document.getElementById('bag-body');
const bagFooter = document.getElementById('bag-footer');
const bagClose = document.getElementById('bag-close');

function loadBag() {
  try {
    const raw = localStorage.getItem(BAG_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
}

function saveBag(items) {
  localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(items));
}

function bagCount(items) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

function updateBagCount(items) {
  if (!bagCountEl) return;
  const count = bagCount(items);
  bagCountEl.textContent = String(count);
  bagCountEl.classList.toggle('visible', count > 0);
}

function renderBag() {
  const items = loadBag();
  updateBagCount(items);
  if (!bagBody || !bagFooter) return;

  if (!items.length) {
    bagBody.innerHTML =
      '<div class="bag-empty">' +
        '<p>Your bag is empty.</p>' +
        '<a href="new-arrivals.html">Shop New Arrivals</a>' +
      '</div>';
    bagFooter.innerHTML = '';
    return;
  }

  bagBody.innerHTML = items.map(item => {
    const line = item.price * item.qty;
    return (
      '<article class="bag-item" data-id="' + item.id + '">' +
        '<img src="' + item.image + '" alt="" />' +
        '<div>' +
          '<p class="bag-item-name">' + item.name + '</p>' +
          '<p class="bag-item-price">' + formatPrice(item.price) + '</p>' +
          '<p class="bag-item-line">Line ' + formatPrice(line) + '</p>' +
          '<div class="bag-item-controls">' +
            '<div class="bag-qty">' +
              '<button type="button" data-bag-action="dec" aria-label="Decrease quantity">−</button>' +
              '<span>' + item.qty + '</span>' +
              '<button type="button" data-bag-action="inc" aria-label="Increase quantity">+</button>' +
            '</div>' +
            '<button type="button" class="bag-remove" data-bag-action="remove">Remove</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }).join('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  bagFooter.innerHTML =
    '<div class="bag-subtotal"><span>Subtotal</span><strong>' + formatPrice(subtotal) + '</strong></div>' +
    '<button type="button" class="bag-checkout" id="bag-checkout">Checkout — Demo</button>' +
    '<p class="bag-demo-note">Frontend demo only. No payment is processed and no order is placed.</p>' +
    '<p class="bag-demo-msg" id="bag-demo-msg" hidden></p>';
}

function addItemToBag(product) {
  const items = loadBag();
  const existing = items.find(item => item.id === product.id);
  if (existing) existing.qty += 1;
  else items.push({ ...product, qty: 1 });
  saveBag(items);
  renderBag();
}

function changeBagQty(id, delta) {
  let items = loadBag();
  items = items.map(item => {
    if (item.id !== id) return item;
    return { ...item, qty: item.qty + delta };
  }).filter(item => item.qty > 0);
  saveBag(items);
  renderBag();
}

function removeBagItem(id) {
  const items = loadBag().filter(item => item.id !== id);
  saveBag(items);
  renderBag();
}

function productFromButton(btn) {
  const name = btn.dataset.product || 'Item';
  const card = btn.closest('.product-card');
  const featured = btn.closest('.acc-featured');
  const root = card || featured || document;

  const img = root.querySelector('img');
  const priceEl = root.querySelector('.product-price, .acc-featured-price');
  const image = img ? img.getAttribute('src') : '';
  const price = parsePrice(priceEl ? priceEl.textContent : '');

  return {
    id: image || name,
    name: name,
    price: price,
    image: image
  };
}

function openBag() {
  if (!bagUI.panel) return;
  closeMobileNav();
  closeSearch();
  renderBag();
  bagUI.backdrop.classList.add('open');
  bagUI.panel.classList.add('open');
  setBodyLock();
  if (bagBtn) bagBtn.setAttribute('aria-expanded', 'true');
}

function closeBag() {
  if (!bagUI.panel) return;
  bagUI.backdrop.classList.remove('open');
  bagUI.panel.classList.remove('open');
  setBodyLock();
  if (bagBtn) bagBtn.setAttribute('aria-expanded', 'false');
}

if (bagBtn) {
  bagBtn.setAttribute('aria-expanded', 'false');
  bagBtn.addEventListener('click', () => {
    if (bagUI.panel.classList.contains('open')) closeBag();
    else openBag();
  });
}

if (bagClose) bagClose.addEventListener('click', closeBag);
if (bagUI.backdrop) bagUI.backdrop.addEventListener('click', closeBag);

if (bagUI.panel) {
  bagUI.panel.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-bag-action]');
    if (actionBtn) {
      const item = actionBtn.closest('.bag-item');
      const id = item && item.getAttribute('data-id');
      const action = actionBtn.getAttribute('data-bag-action');
      if (!id) return;
      if (action === 'inc') changeBagQty(id, 1);
      if (action === 'dec') changeBagQty(id, -1);
      if (action === 'remove') removeBagItem(id);
      return;
    }

    if (e.target.id === 'bag-checkout') {
      const msg = document.getElementById('bag-demo-msg');
      if (msg) {
        msg.hidden = false;
        msg.textContent = 'Checkout is a frontend demonstration. Nothing was charged or submitted.';
      }
    }
  });
}

document.querySelectorAll('.add-to-bag-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    addItemToBag(productFromButton(btn));
    openBag();
  });
});

renderBag();


// ============================================
// 7. KEYBOARD
// ============================================

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeSearch();
    closeBag();
    closeMobileNav();
    dropdownItems.forEach(item => {
      item.classList.remove('open');
      const trigger = item.querySelector('.nav-dropdown-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
    return;
  }

  if (!slides.length || isTypingTarget(e.target)) return;
  if (document.querySelector('.search-overlay.open') || document.querySelector('.bag-panel.open')) return;

  if (e.key === 'ArrowLeft') {
    goToSlide(currentSlide - 1);
    resetAutoPlay();
  }
  if (e.key === 'ArrowRight') {
    goToSlide(currentSlide + 1);
    resetAutoPlay();
  }
});


// ============================================
// 8. SMOOTH SCROLL — for in-page anchors
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();
    const navbarHeight = navbar ? navbar.offsetHeight : 56;
    const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


// ============================================
// 9. SHOP PAGE — FILTER BAR
// ============================================

const filterButtons = document.querySelectorAll('.filter-btn');

function normalizeFilter(value) {
  return String(value || '').trim().toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ');
}

function applyFilter(label) {
  const cards = document.querySelectorAll('.shop-grid .product-card, .products-grid .product-card');
  if (!cards.length) return;

  const wanted = normalizeFilter(label);
  let visible = 0;

  cards.forEach(card => {
    const cat = normalizeFilter(card.getAttribute('data-filter'));
    const show = wanted === 'all' || cat === wanted;
    card.classList.toggle('is-hidden', !show);
    if (show) visible += 1;
  });

  const countEl = document.querySelector('.product-count');
  if (countEl) {
    countEl.textContent = visible + (visible === 1 ? ' PIECE' : ' PIECES');
  }
}

function activateFilterButton(label) {
  const wanted = normalizeFilter(label);
  filterButtons.forEach(btn => {
    btn.classList.toggle('active', normalizeFilter(btn.textContent) === wanted);
  });
}

if (filterButtons.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.filter-group');
      if (group) {
        group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      }
      btn.classList.add('active');
      applyFilter(btn.textContent);
    });
  });

  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('filter');
  if (fromQuery) {
    const match = Array.from(filterButtons).find(btn =>
      normalizeFilter(btn.textContent) === normalizeFilter(fromQuery)
    );
    if (match) {
      activateFilterButton(match.textContent);
      applyFilter(match.textContent);
    }
  }
}


// ============================================
// 10. LEGAL PAGES — TOC SCROLL-SPY
// ============================================

const tocLinks = document.querySelectorAll('.legal-toc-link');

if (tocLinks.length > 0) {
  const sections = [];
  tocLinks.forEach(link => {
    const targetId = link.getAttribute('href');
    const el = targetId ? document.querySelector(targetId) : null;
    if (el) sections.push(el);
  });

  if (sections.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          tocLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }
}

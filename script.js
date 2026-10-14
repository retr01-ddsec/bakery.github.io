// Sustituye este valor por tu número completo con código de país, sin + ni espacios.
const WHATSAPP_NUMBER = '525511104888';

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

function updateHeader() {
  if (header) header.classList.toggle('is-scrolled', window.scrollY > 24);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

if (menuToggle && navLinks) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menú');
    navLinks.classList.remove('is-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    navLinks.classList.toggle('is-open', !isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const filterButtons = document.querySelectorAll('.filter-button');
const productCards = document.querySelectorAll('.product-card');
const menuCategories = document.querySelectorAll('[data-menu-category]');
const menuEmpty = document.querySelector('.menu-empty');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    productCards.forEach((card) => {
      const isVisible = filter === 'todos' || card.dataset.category === filter;
      card.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    menuCategories.forEach((category) => {
      category.hidden = filter !== 'todos' && category.dataset.menuCategory !== filter;
    });

    if (menuEmpty) menuEmpty.hidden = visibleCount > 0;
  });
});

function createWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll('.order-button').forEach((button) => {
  const product = button.dataset.product;
  if (!product) return;

  button.href = createWhatsAppUrl(
    `¡Hola! Quiero pedir ${product} en Denis's Bakery. ¿Me ayudan con mi pedido?`,
  );
  button.target = '_blank';
  button.rel = 'noopener noreferrer';
});

document.querySelectorAll('.whatsapp-link').forEach((link) => {
  const message =
    link.dataset.message || "¡Hola! Quiero hacer un pedido en Denis's Bakery.";
  link.href = createWhatsAppUrl(message);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

const currentYear = document.querySelector('#current-year');
if (currentYear) currentYear.textContent = new Date().getFullYear();

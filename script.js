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

const REVIEW_STORAGE_KEY = 'denisBakeryReviews';
const reviewForm = document.querySelector('#review-form');
const reviewList = document.querySelector('#review-list');
const reviewEmpty = document.querySelector('#review-empty');
const reviewStatus = document.querySelector('#review-status');

function loadReviews() {
  try {
    const saved = JSON.parse(localStorage.getItem(REVIEW_STORAGE_KEY) || '[]');
    if (!Array.isArray(saved)) return [];

    return saved.filter((review) =>
      review &&
      typeof review.name === 'string' &&
      typeof review.product === 'string' &&
      typeof review.comment === 'string' &&
      Number.isInteger(Number(review.rating)) &&
      Number(review.rating) >= 1 &&
      Number(review.rating) <= 5,
    );
  } catch (error) {
    return [];
  }
}

function createReviewCard(review) {
  const card = document.createElement('article');
  card.className = 'review-card review-card--saved';

  const stars = document.createElement('div');
  stars.className = 'review-stars';
  stars.textContent = '★'.repeat(Number(review.rating));
  stars.setAttribute('aria-label', `${review.rating} de 5 estrellas`);

  const comment = document.createElement('blockquote');
  comment.textContent = `“${review.comment}”`;

  const author = document.createElement('div');
  author.className = 'review-author';

  const initial = document.createElement('span');
  initial.className = 'review-initial';
  initial.textContent = Array.from(review.name.trim())[0] || '?';

  const authorDetails = document.createElement('div');
  const name = document.createElement('strong');
  name.textContent = review.name;
  const product = document.createElement('span');
  product.textContent = review.product;

  authorDetails.append(name, product);
  author.append(initial, authorDetails);
  card.append(stars, comment, author);
  return card;
}

function renderSavedReviews() {
  if (!reviewList) return;

  reviewList.querySelectorAll('.review-card--saved').forEach((card) => card.remove());
  const reviews = loadReviews();
  reviews.forEach((review) => {
    reviewList.prepend(createReviewCard(review));
  });
  if (reviewEmpty) reviewEmpty.hidden = reviews.length > 0;
}

renderSavedReviews();

if (reviewForm && reviewList) {
  const ratingInputs = reviewForm.querySelectorAll('input[name="rating"]');

  ratingInputs.forEach((input) => {
    input.addEventListener('change', () => {
      const selectedRating = Number(input.value);
      reviewForm.querySelectorAll('.rating-options label').forEach((label) => {
        const labelRating = Number(label.htmlFor.replace('rating-', ''));
        label.classList.toggle('is-highlighted', labelRating <= selectedRating);
      });
    });
  });

  reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!reviewForm.reportValidity()) return;

    const formData = new FormData(reviewForm);
    const review = {
      name: String(formData.get('name')).trim(),
      product: String(formData.get('product')),
      rating: Number(formData.get('rating')),
      comment: String(formData.get('comment')).trim(),
      createdAt: new Date().toISOString(),
    };

    if (!review.name || !review.product || !review.comment || review.rating < 1 || review.rating > 5) {
      if (reviewStatus) reviewStatus.textContent = 'Completa todos los campos para publicar tu opinión.';
      return;
    }

    try {
      const reviews = loadReviews();
      reviews.unshift(review);
      localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviews));
      reviewList.prepend(createReviewCard(review));
      if (reviewEmpty) reviewEmpty.hidden = true;
      reviewForm.reset();
      reviewForm.querySelectorAll('.rating-options label').forEach((label) => {
        label.classList.remove('is-highlighted');
      });
      if (reviewStatus) reviewStatus.textContent = '¡Gracias! Tu opinión se publicó correctamente.';
    } catch (error) {
      if (reviewStatus) {
        reviewStatus.textContent = 'No se pudo guardar la opinión en este navegador. Inténtalo de nuevo.';
      }
    }
  });
}

window.addEventListener('storage', (event) => {
  if (event.key === REVIEW_STORAGE_KEY) renderSavedReviews();
});

const currentYear = document.querySelector('#current-year');
if (currentYear) currentYear.textContent = new Date().getFullYear();

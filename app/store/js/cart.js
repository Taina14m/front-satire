const cart = [];

const cartOverlay = document.getElementById('cart-overlay');
const cartDrawer = document.getElementById('cart-drawer');
const cartToggle = document.getElementById('cart-toggle');
const cartClose = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartTotal = document.getElementById('cart-total');
const cartBadge = document.getElementById('cart-badge');
const cartCheckout = document.getElementById('cart-checkout');

function openCart() {
  cartOverlay.classList.add('cart-overlay--active');
  cartDrawer.classList.add('cart-drawer--active');
}

function closeCart() {
  cartOverlay.classList.remove('cart-overlay--active');
  cartDrawer.classList.remove('cart-drawer--active');
}

function updateBadge() {
  const count = cart.length;
  cartBadge.textContent = count;
  if (count > 0) {
    cartBadge.classList.add('cart-badge--visible');
  } else {
    cartBadge.classList.remove('cart-badge--visible');
  }
}

function parsePrice(str) {
  return parseFloat(str.replace('R$', '').replace(/\./g, '').replace(',', '.'));
}

function formatPrice(value) {
  return 'R$' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function updateTotal() {
  const total = cart.reduce((sum, item) => sum + parsePrice(item.price), 0);
  cartTotal.textContent = formatPrice(total);
}

function renderCart() {
  // Remove itens antigos (mantém o parágrafo vazio)
  const items = cartItems.querySelectorAll('.cart-item');
  items.forEach(item => item.remove());

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
  } else {
    cartEmpty.style.display = 'none';
    cart.forEach((item, index) => {
      const el = document.createElement('div');
      el.classList.add('cart-item');
      el.innerHTML = `
        <div class="cart-item__img" style="background-color: ${item.color}"></div>
        <div class="cart-item__info">
          <span class="cart-item__name">${item.name}</span>
          <span class="cart-item__price">${item.price}</span>
        </div>
        <button class="cart-item__remove" data-index="${index}" aria-label="Remover">&times;</button>
      `;
      cartItems.appendChild(el);
    });
  }

  updateTotal();
  updateBadge();
}

function addToCart(name, price, color) {
  cart.push({ name, price, color });
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// Event listeners
cartToggle.addEventListener('click', (e) => {
  e.preventDefault();
  openCart();
});

cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && cartDrawer.classList.contains('cart-drawer--active')) {
    closeCart();
  }
});

cartItems.addEventListener('click', (e) => {
  const btn = e.target.closest('.cart-item__remove');
  if (btn) {
    const index = parseInt(btn.dataset.index);
    removeFromCart(index);
  }
});

cartCheckout.addEventListener('click', () => {
  if (cart.length === 0) return;
  alert('Compra finalizada com sucesso!');
  cart.length = 0;
  renderCart();
  closeCart();
});

// Inicializa
updateBadge();
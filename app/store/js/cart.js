let currentCart = { items: [], subtotal: 0 };

const cartOverlay = document.getElementById("cart-overlay");
const cartDrawer = document.getElementById("cart-drawer");
const cartToggle = document.getElementById("cart-toggle");
const cartClose = document.getElementById("cart-close");
const cartItems = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartTotal = document.getElementById("cart-total");
const cartBadge = document.getElementById("cart-badge");
const cartCheckout = document.getElementById("cart-checkout");
const cartClear = document.getElementById("cart-clear");

function formatCartPrice(value) {
  return "R$" + Number(value || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function openCart() {
  cartOverlay.classList.add("cart-overlay--active");
  cartDrawer.classList.add("cart-drawer--active");
  loadCart();
}

function closeCart() {
  cartOverlay.classList.remove("cart-overlay--active");
  cartDrawer.classList.remove("cart-drawer--active");
}

function updateBadge() {
  const quantity = currentCart.items.reduce(function (total, item) { return total + item.quantity; }, 0);
  cartBadge.textContent = quantity;
  cartBadge.classList.toggle("cart-badge--visible", quantity > 0);
}

function renderCart() {
  cartItems.querySelectorAll(".cart-item").forEach(function (item) { item.remove(); });
  cartEmpty.style.display = currentCart.items.length === 0 ? "block" : "none";

  currentCart.items.forEach(function (item) {
    const element = document.createElement("div");
    const productImage = document.createElement("div");
    const details = document.createElement("div");
    const name = document.createElement("span");
    const itemPrice = document.createElement("span");
    const quantity = document.createElement("input");
    const remove = document.createElement("button");
    element.className = "cart-item";
    productImage.className = "cart-item__img";
    details.className = "cart-item__info";
    name.className = "cart-item__name";
    name.textContent = item.productName + " — " + item.variationName;
    itemPrice.className = "cart-item__price";
    itemPrice.textContent = formatCartPrice(item.unitPrice) + " · " + formatCartPrice(item.subtotal);
    quantity.className = "cart-item__quantity";
    quantity.type = "number";
    quantity.min = "1";
    quantity.max = "99";
    quantity.value = item.quantity;
    quantity.dataset.itemId = item.id;
    quantity.setAttribute("aria-label", "Quantidade de " + item.productName);
    remove.className = "cart-item__remove";
    remove.type = "button";
    remove.dataset.itemId = item.id;
    remove.setAttribute("aria-label", "Remover " + item.productName);
    remove.textContent = "×";
    details.append(name, itemPrice, quantity);
    element.append(productImage, details, remove);
    cartItems.appendChild(element);
  });
  cartTotal.textContent = formatCartPrice(currentCart.subtotal);
  updateBadge();
}

function applyCartResponse(cart) {
  if (!cart) return;
  currentCart = cart;
  renderCart();
}

async function loadCart() {
  if (!isApiConfigured()) return;
  try {
    applyCartResponse(await getCart());
  } catch (error) {
    console.error("Não foi possível carregar o carrinho.", error);
  }
}

cartToggle.addEventListener("click", function (event) { event.preventDefault(); openCart(); });
cartClose.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && cartDrawer.classList.contains("cart-drawer--active")) closeCart();
});

cartItems.addEventListener("change", async function (event) {
  if (!event.target.matches(".cart-item__quantity")) return;
  const quantity = Number(event.target.value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    renderCart();
    return;
  }
  try {
    applyCartResponse(await updateCartItem(event.target.dataset.itemId, quantity));
  } catch (error) {
    console.error("Não foi possível atualizar o item do carrinho.", error);
    loadCart();
  }
});

cartItems.addEventListener("click", async function (event) {
  const remove = event.target.closest(".cart-item__remove");
  if (!remove) return;
  try {
    await removeCartItem(remove.dataset.itemId);
    loadCart();
  } catch (error) {
    console.error("Não foi possível remover o item do carrinho.", error);
  }
});

cartClear.addEventListener("click", async function () {
  try {
    await clearCart();
    applyCartResponse({ items: [], subtotal: 0 });
  } catch (error) {
    console.error("Não foi possível esvaziar o carrinho.", error);
  }
});

cartCheckout.addEventListener("click", async function () {
  try {
    const addresses = await getAddresses();
    const primaryAddress = addresses.find(function (address) { return address.primary; });
    if (!primaryAddress) {
      // TODO: criar uma interface de seleção de endereço para checkout sem endereço principal.
      return;
    }
    const order = await createOrder(primaryAddress.id);
    applyCartResponse({ items: [], subtotal: 0 });
    closeCart();
    console.info("Pedido criado:", order.number);
  } catch (error) {
    console.error("Não foi possível finalizar a compra.", error);
  }
});

renderCart();

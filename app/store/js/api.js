const API_URL = "";

function isApiConfigured() {
  return Boolean(API_URL);
}

async function apiRequest(path, options) {
  if (!API_URL) {
    return null;
  }

  const resposta = await fetch(API_URL + path, options || {});

  if (!resposta.ok) {
    throw new Error("Erro ao acessar a API");
  }

  if (resposta.status === 204) {
    return null;
  }

  return resposta.json();
}

function jsonRequest(method, body, headers) {
  return {
    method,
    headers: { "Content-Type": "application/json", ...(headers || {}) },
    body: JSON.stringify(body)
  };
}

// Catálogo público implementado no backend atual.
async function getCategories() {
  const dados = await apiRequest("/api/v1/categories");
  return dados || [];
}

async function getCategory(categoryId) {
  return apiRequest("/api/v1/categories/" + categoryId);
}

async function getProducts() {
  // TODO: o ENDPOINTS.md prevê paginação e filtros, mas não define os parâmetros públicos.
  const dados = await apiRequest("/api/v1/products");
  return dados || [];
}

async function getProduct(productId) {
  return apiRequest("/api/v1/products/" + productId);
}

async function getProductBySlug(slug) {
  return apiRequest("/api/v1/products/slug/" + encodeURIComponent(slug));
}

async function getVariations(productId) {
  // Cada item retornado pelo backend contém "id", que é o variationId do carrinho.
  const dados = await apiRequest("/api/v1/products/" + productId + "/variations");
  return dados || [];
}

async function getProductImages(productId) {
  const dados = await apiRequest("/api/v1/products/" + productId + "/images");
  return dados || [];
}

// Favoritos planejados: o contrato ainda não especifica a resposta.
async function getFavorites() {
  // TODO: aguardar controller e contrato de resposta do backend.
  return apiRequest("/api/v1/me/favorites");
}

async function addFavorite(productId) {
  // TODO: aguardar controller e contrato de resposta do backend.
  return apiRequest("/api/v1/me/favorites/" + productId, { method: "PUT" });
}

async function removeFavorite(productId) {
  // TODO: aguardar controller e contrato de resposta do backend.
  return apiRequest("/api/v1/me/favorites/" + productId, { method: "DELETE" });
}

// Avaliações planejadas: o formato do body e das respostas ainda não foi definido.
async function getProductReviews(productId) {
  // TODO: aguardar controller e contrato de resposta do backend.
  return apiRequest("/api/v1/products/" + productId + "/reviews");
}

async function saveReview(productId, review) {
  // TODO: confirmar formato de "review" no contrato do backend.
  return apiRequest("/api/v1/me/reviews/" + productId, jsonRequest("PUT", review));
}

async function removeReview(productId) {
  // TODO: aguardar controller e contrato de resposta do backend.
  return apiRequest("/api/v1/me/reviews/" + productId, { method: "DELETE" });
}

async function getVariationAvailability(productId, variationId) {
  // TODO: aguardar controller e contrato de resposta do backend.
  return apiRequest("/api/v1/products/" + productId + "/variations/" + variationId + "/availability");
}

// Conta e endereços implementados no backend atual.
async function getMe() {
  return apiRequest("/api/v1/me");
}

async function updateMe(account) {
  return apiRequest("/api/v1/me", jsonRequest("PATCH", account));
}

async function deactivateMe() {
  return apiRequest("/api/v1/me", { method: "DELETE" });
}

async function getAddresses() {
  const dados = await apiRequest("/api/v1/me/addresses");
  return dados || [];
}

async function createAddress(address) {
  return apiRequest("/api/v1/me/addresses", jsonRequest("POST", address));
}

async function getAddress(addressId) {
  return apiRequest("/api/v1/me/addresses/" + addressId);
}

async function updateAddress(addressId, address) {
  return apiRequest("/api/v1/me/addresses/" + addressId, jsonRequest("PATCH", address));
}

async function deleteAddress(addressId) {
  return apiRequest("/api/v1/me/addresses/" + addressId, { method: "DELETE" });
}

async function setPrimaryAddress(addressId) {
  return apiRequest("/api/v1/me/addresses/" + addressId + "/primary", { method: "PATCH" });
}

// Carrinho implementado no backend atual. variationId deve vir de getVariations() ou de produto.variations[].id.
async function getCart() {
  return apiRequest("/api/v1/me/cart");
}

async function addCartItem(variationId, quantity) {
  return apiRequest("/api/v1/me/cart/items", jsonRequest("POST", { variationId, quantity }));
}

async function updateCartItem(itemId, quantity) {
  return apiRequest("/api/v1/me/cart/items/" + itemId, jsonRequest("PATCH", { quantity }));
}

async function removeCartItem(itemId) {
  return apiRequest("/api/v1/me/cart/items/" + itemId, { method: "DELETE" });
}

async function clearCart() {
  return apiRequest("/api/v1/me/cart", { method: "DELETE" });
}

// Pedidos: criação implementada; consulta e cancelamento continuam planejados.
async function createOrder(addressId) {
  return apiRequest("/api/v1/orders", jsonRequest("POST", { addressId }));
}

async function getOrders() {
  // TODO: aguardar controller, paginação e formato da resposta.
  return apiRequest("/api/v1/orders");
}

async function getOrder(orderId) {
  // TODO: aguardar controller e contrato de resposta do backend.
  return apiRequest("/api/v1/orders/" + orderId);
}

async function cancelOrder(orderId) {
  // TODO: confirmar se o cancelamento terá body e qual será seu formato.
  return apiRequest("/api/v1/orders/" + orderId + "/cancel", { method: "POST" });
}

async function getOrderStatusHistory(orderId) {
  // TODO: aguardar controller e contrato de resposta do backend.
  return apiRequest("/api/v1/orders/" + orderId + "/status-history");
}

// Pagamentos planejados. O webhook é externo ao frontend e não deve ser chamado pela loja.
async function createPayment(orderId, payment, idempotencyKey) {
  // TODO: confirmar formato de "payment" no contrato do backend.
  return apiRequest(
    "/api/v1/orders/" + orderId + "/payments",
    jsonRequest("POST", payment, { "Idempotency-Key": idempotencyKey })
  );
}

async function getOrderPayments(orderId) {
  // TODO: aguardar controller e contrato de resposta do backend.
  return apiRequest("/api/v1/orders/" + orderId + "/payments");
}

async function getPayment(paymentId) {
  // TODO: aguardar controller e contrato de resposta do backend.
  return apiRequest("/api/v1/payments/" + paymentId);
}

// Entrega e rastreio planejados.
async function getOrderShipping(orderId) {
  // TODO: aguardar controller e contrato de resposta do backend.
  return apiRequest("/api/v1/orders/" + orderId + "/shipping");
}

async function getOrderTracking(orderId) {
  // TODO: aguardar controller e contrato de resposta do backend.
  return apiRequest("/api/v1/orders/" + orderId + "/tracking");
}

const ordersList = document.getElementById('orders-list');
const ordersEmpty = document.getElementById('orders-empty');

function formatPrice(value) {
  return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getStatusLabel(status) {
  const map = {
    pending: 'Pendente',
    processing: 'Processando',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
    refunded: 'Estornado'
  };
  return map[status] || status;
}

function getMethodLabel(method) {
  const map = {
    pix: 'PIX',
    credit_card: 'Cartão de Crédito',
    boleto: 'Boleto Bancário'
  };
  return map[method] || method;
}

async function renderOrders() {
  const orders = await OrderAPI.list();

  if (orders.length === 0) {
    ordersEmpty.style.display = 'block';
    return;
  }

  ordersEmpty.style.display = 'none';

  orders.forEach(order => {
    const el = document.createElement('a');
    el.className = 'order-card';
    el.href = `payment.html?id=${order.paymentId}`;

    el.innerHTML = `
      <div class="order-card__icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="1" y="4" width="22" height="16" rx="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      </div>
      <div class="order-card__info">
        <span class="order-card__id">Pedido ${order.orderId}</span>
        <span class="order-card__date">${formatDate(order.createdAt)}</span>
        <span class="order-card__items-count">${order.items} ${order.items === 1 ? 'item' : 'itens'} · ${getMethodLabel(order.method)}</span>
      </div>
      <div class="order-card__right">
        <span class="order-card__amount">${formatPrice(order.amount)}</span>
        <span class="status-badge status-badge--${order.status}">${getStatusLabel(order.status)}</span>
      </div>
    `;

    ordersList.appendChild(el);
  });
}

// Inicializa
renderOrders();
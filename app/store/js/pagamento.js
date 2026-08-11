const paymentIdEl = document.getElementById('payment-id');
const paymentOrderIdEl = document.getElementById('payment-order-id');
const paymentMethodEl = document.getElementById('payment-method');
const paymentAmountEl = document.getElementById('payment-amount');
const paymentDateEl = document.getElementById('payment-date');
const paymentUpdatedEl = document.getElementById('payment-updated');
const paymentStatusEl = document.getElementById('payment-status');
const timelineList = document.getElementById('timeline-list');

function formatPrice(value) {
  return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(isoStr) {
  const d = new Date(isoStr);
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
}

function getMethodLabel(method) {
  const map = {
    pix: 'PIX',
    credit_card: 'Cartão de Crédito',
    boleto: 'Boleto Bancário'
  };
  return map[method] || method;
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

function getPaymentIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function buildTimeline(payment) {
  timelineList.innerHTML = '';

  const events = [
    { event: 'Pagamento criado', date: payment.createdAt, active: true }
  ];

  if (payment.status === 'processing' || payment.status === 'approved') {
    events.push({ event: 'Processando pagamento', date: payment.updatedAt, active: true });
  }

  if (payment.status === 'approved') {
    events.push({ event: 'Pagamento aprovado', date: payment.updatedAt, active: true });
  }

  if (payment.status === 'rejected') {
    events.push({ event: 'Pagamento rejeitado', date: payment.updatedAt, active: true });
  }

  if (payment.status === 'refunded') {
    events.push({ event: 'Pagamento estornado', date: payment.updatedAt, active: true });
  }

  events.forEach(ev => {
    const li = document.createElement('li');
    li.className = `timeline__item${ev.active ? ' timeline__item--active' : ''}`;
    li.innerHTML = `
      <span class="timeline__event">${ev.event}</span>
      <span class="timeline__date">${formatDate(ev.date)}</span>
    `;
    timelineList.appendChild(li);
  });
}

async function renderPayment() {
  const paymentId = getPaymentIdFromUrl();
  if (!paymentId) {
    window.location.href = 'orders.html';
    return;
  }

  const payment = await PaymentAPI.getById(paymentId);
  if (!payment) {
    window.location.href = 'orders.html';
    return;
  }

  paymentIdEl.textContent = payment.paymentId;
  paymentOrderIdEl.textContent = payment.orderId;
  paymentMethodEl.textContent = getMethodLabel(payment.method);
  paymentAmountEl.textContent = formatPrice(payment.amount);
  paymentDateEl.textContent = formatDate(payment.createdAt);
  paymentUpdatedEl.textContent = formatDate(payment.updatedAt);

  // Status badge
  paymentStatusEl.innerHTML = `<span class="status-badge status-badge--${payment.status}">${getStatusLabel(payment.status)}</span>`;

  // Timeline
  buildTimeline(payment);

  // Se não está em estado final, polling a cada 5s
  if (payment.status === 'pending' || payment.status === 'processing') {
    setTimeout(renderPayment, 5000);
  }
}

// Inicializa
renderPayment();
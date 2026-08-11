const checkoutItems = document.getElementById('checkout-items');
const checkoutEmpty = document.getElementById('checkout-empty');
const checkoutSubtotal = document.getElementById('checkout-subtotal');
const checkoutTotal = document.getElementById('checkout-total');
const paymentMethods = document.getElementById('payment-methods');
const cardFields = document.getElementById('card-fields');
const btnPay = document.getElementById('btn-pay');
const confirmOverlay = document.getElementById('payment-confirm-overlay');
const confirmDetails = document.getElementById('confirm-details');
const confirmTitle = document.getElementById('confirm-title');
const confirmMsg = document.getElementById('confirm-msg');

function formatPrice(value) {
  return 'R$ ' + value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parsePrice(str) {
  return parseFloat(str.replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
}

async function renderCheckoutItems() {
  const items = await CartAPI.getItems();

  if (items.length === 0) {
    checkoutEmpty.style.display = 'block';
    btnPay.disabled = true;
    btnPay.style.opacity = '0.5';
    btnPay.style.cursor = 'not-allowed';
    return;
  }

  checkoutEmpty.style.display = 'none';

  let subtotal = 0;
  items.forEach(item => {
    const price = parsePrice(item.price);
    subtotal += price;

    const el = document.createElement('div');
    el.className = 'checkout-item';
    el.innerHTML = `
      <div class="checkout-item__color" style="background-color: ${item.color || '#ede4dd'}"></div>
      <div class="checkout-item__info">
        <span class="checkout-item__name">${item.name}</span>
        <span class="checkout-item__price">${item.price}</span>
      </div>
    `;
    checkoutItems.appendChild(el);
  });

  checkoutSubtotal.textContent = formatPrice(subtotal);
  checkoutTotal.textContent = formatPrice(subtotal);
}

// Mostrar/esconder campos do cartão
paymentMethods.addEventListener('change', (e) => {
  const selected = e.target.value;
  cardFields.style.display = selected === 'credit_card' ? 'flex' : 'none';
});

// Máscara do número do cartão
const cardNumber = document.getElementById('card-number');
if (cardNumber) {
  cardNumber.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 16);
    v = v.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = v;
  });
}

// Máscara da validade
const cardExpiry = document.getElementById('card-expiry');
if (cardExpiry) {
  cardExpiry.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    e.target.value = v;
  });
}

// Confirmar pagamento
btnPay.addEventListener('click', async () => {
  const items = await CartAPI.getItems();
  if (items.length === 0) return;

  const selected = document.querySelector('input[name="payment"]:checked');
  if (!selected) return;

  const method = selected.value;

  // Validar cartão se necessário
  if (method === 'credit_card') {
    const num = document.getElementById('card-number').value.replace(/\s/g, '');
    const name = document.getElementById('card-name').value.trim();
    const expiry = document.getElementById('card-expiry').value;
    const cvv = document.getElementById('card-cvv').value;

    if (num.length < 16 || !name || expiry.length < 5 || cvv.length < 3) {
      alert('Preencha todos os dados do cartão.');
      return;
    }
  }

  // Calcular total
  const total = items.reduce((sum, item) => sum + parsePrice(item.price), 0);

  // Chamar API de pagamento
  const payment = await PaymentAPI.create(null, method, total, items.length);

  // Limpar carrinho
  await CartAPI.clear();

  // Mostrar confirmação
  const methodNames = {
    pix: 'PIX',
    credit_card: 'Cartão de Crédito',
    boleto: 'Boleto Bancário'
  };

  confirmTitle.textContent = 'Pagamento Iniciado!';
  confirmMsg.textContent = method === 'pix'
    ? 'Seu código PIX foi gerado. Efetue o pagamento em até 30 minutos.'
    : method === 'boleto'
    ? 'Seu boleto foi gerado. Vencimento em 3 dias úteis.'
    : 'Pagamento sendo processado pelo operador do cartão.';

  confirmDetails.innerHTML = `
    <strong>Pedido:</strong> ${payment.orderId}<br>
    <strong>Pagamento:</strong> ${payment.paymentId}<br>
    <strong>Método:</strong> ${methodNames[method]}<br>
    <strong>Valor:</strong> ${formatPrice(payment.amount)}
  `;

  confirmOverlay.classList.add('payment-confirm-overlay--active');
});

// Fechar modal ao clicar fora
confirmOverlay.addEventListener('click', (e) => {
  if (e.target === confirmOverlay) {
    confirmOverlay.classList.remove('payment-confirm-overlay--active');
  }
});

// Inicializa
renderCheckoutItems();
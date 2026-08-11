document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('modal-overlay');
    const closeBtn = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalInfo = document.getElementById('modal-info');
    const modalPrice = document.getElementById('modal-price');
    const modalImg = document.getElementById('modal-img');
    const modalBtnCart = document.getElementById('modal-btn-cart');
  
    // modal com dados
    document.querySelectorAll('.figure').forEach(figure => {
      figure.style.cursor = 'pointer';
  
      figure.addEventListener('click', () => {
        const nome = figure.querySelector('.figure__name').textContent;
        const preco = figure.querySelector('.figure__price').textContent;
        const imgBg = getComputedStyle(figure.querySelector('.figure__img')).backgroundColor;
  
        modalTitle.textContent = nome;
        modalPrice.textContent = preco;
        modalInfo.textContent = 'Informações do boneco virão da API.';
        modalImg.style.backgroundColor = imgBg;
  
        overlay.classList.add('modal-overlay--active');
      });
    });
  
    // Fechar modal
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('modal-overlay--active');
    });
  
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('modal-overlay--active');
      }
    });
  
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        overlay.classList.remove('modal-overlay--active');
      }
    });
  
    // Botão de adicionar ao carrinho
    modalBtnCart.addEventListener('click', () => {
      const nome = modalTitle.textContent;
      const preco = modalPrice.textContent;
      const color = modalImg.style.backgroundColor;
      addToCart(nome, preco, color);
      overlay.classList.remove('modal-overlay--active');
    });
  });
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('access-toggle');
    const menu = document.getElementById('access-menu');
    const contrastBtn = document.getElementById('access-contrast');
  
    if (!toggle || !menu) return;
  
    // Restaura estado salvo
    if (localStorage.getItem('high-contrast') === 'true') {
      document.body.classList.add('high-contrast');
      if (contrastBtn) contrastBtn.classList.add('access-menu__item--active');
    }
  
    // Toggle menu
    toggle.addEventListener('click', () => {
      menu.classList.toggle('access-menu--active');
    });
  
    // Fecha menu ao clicar fora
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('access-menu--active');
      }
    });
  
    // Alto contraste
    if (contrastBtn) {
      contrastBtn.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        const isActive = document.body.classList.contains('high-contrast');
        localStorage.setItem('high-contrast', isActive);
        contrastBtn.classList.toggle('access-menu__item--active', isActive);
      });
    }
  });
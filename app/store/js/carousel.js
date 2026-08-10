document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.section__carousel');
  
    carousels.forEach(carousel => {
      const track = carousel.querySelector('.carousel__track');
      const pages = carousel.querySelectorAll('.carousel__page');
      const prevBtn = carousel.querySelector('.carousel__btn--prev');
      const nextBtn = carousel.querySelector('.carousel__btn--next');
      const dots = carousel.querySelectorAll('.carousel__dot');
      let current = 0;
      const total = pages.length;
  
      function goTo(index) {
        if (index < 0) index = 0;
        if (index >= total) index = total - 1;
        current = index;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((dot, i) => {
          dot.classList.toggle('carousel__dot--active', i === current);
        });
      }
  
      prevBtn.addEventListener('click', () => goTo(current - 1));
      nextBtn.addEventListener('click', () => goTo(current + 1));
  
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goTo(i));
      });
    });
  });
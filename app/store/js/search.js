document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
  
    const sections = document.querySelectorAll('.section');
    const mainHome = document.querySelector('.main-home');
  
    // não encontrado
    const noResults = document.createElement('div');
    noResults.className = 'search-empty';
    noResults.innerHTML = '<p>Nenhum boneco encontrado :(</p>';
    noResults.style.display = 'none';
    mainHome.appendChild(noResults);
  
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
  
      if (query === '') {
        noResults.style.display = 'none';
        sections.forEach(section => {
          section.style.display = '';
          const carousel = section.querySelector('.section__carousel');
          const title = section.querySelector('.section__title');
          if (carousel) carousel.style.display = '';
          if (title) title.style.display = '';
          section.querySelectorAll('.figure').forEach(b => b.style.display = '');
        });
        document.querySelectorAll('.carousel__track').forEach(track => {
          track.style.cssText = '';
        });
        document.querySelectorAll('.carousel__page').forEach(page => {
          page.style.display = '';
        });
        document.querySelectorAll('.carousel__nav').forEach(nav => {
          nav.style.display = '';
        });
        return;
      }
  
      let totalMatches = 0;
  
      sections.forEach(section => {
        const figures = section.querySelectorAll('.figure');
        const track = section.querySelector('.carousel__track');
        const nav = section.querySelector('.carousel__nav');
        let hasMatch = false;
  
        figures.forEach(figure => {
          const nome = figure.querySelector('.figure__name').textContent.toLowerCase();
          if (nome.includes(query)) {
            figure.style.display = '';
            hasMatch = true;
            totalMatches++;
          } else {
            figure.style.display = 'none';
          }
        });
  
        if (hasMatch) {
          section.style.display = '';
          if (track) {
            track.style.display = 'grid';
            track.style.gridTemplateColumns = 'repeat(3, 1fr)';
            track.style.gap = '60px 80px';
            track.style.padding = '0 140px';
            track.style.transform = 'none';
          }
          section.querySelectorAll('.carousel__page').forEach(page => {
            page.style.display = 'contents';
          });
          if (nav) nav.style.display = 'none';
        } else {
          section.style.display = 'none';
        }
      });
  
      noResults.style.display = totalMatches === 0 ? '' : 'none';
    });
  });
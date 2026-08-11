document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const sections = document.querySelectorAll('main section');
  const articles = document.querySelectorAll('article');

  function activateMenuLink(id) {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('ativo', isActive);
      link.toggleAttribute('aria-current', isActive);
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (!targetSection) return;

      event.preventDefault();
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      activateMenuLink(targetSection.id);
    });
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visivel');
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.18 });

    sections.forEach((section, index) => {
      section.style.opacity = '0';
      section.style.transform = 'translateY(24px)';
      section.style.transition = `opacity 0.6s ease ${index * 80}ms, transform 0.6s ease ${index * 80}ms`;
      revealObserver.observe(section);
    });
  }

  if ('IntersectionObserver' in window && sections.length > 0) {
    const menuObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateMenuLink(entry.target.id);
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.1 });

    sections.forEach((section) => menuObserver.observe(section));
  }

  articles.forEach((article) => {
    article.tabIndex = 0;
    article.setAttribute('role', 'button');
    article.setAttribute('aria-expanded', 'false');

    const originalText = article.querySelector('p')?.textContent.trim();
    const extraInfo = document.createElement('p');
    extraInfo.className = 'informacao-extra';
    extraInfo.hidden = true;
    extraInfo.textContent = 'Ação interativa: este tema mostra como tecnologia, planejamento e responsabilidade ambiental ajudam o campo a produzir melhor.';
    article.appendChild(extraInfo);

    function toggleArticle() {
      const isOpen = article.getAttribute('aria-expanded') === 'true';
      article.setAttribute('aria-expanded', String(!isOpen));
      extraInfo.hidden = isOpen;

      if (originalText && isOpen) {
        article.querySelector('p').textContent = originalText;
      }
    }

    article.addEventListener('click', toggleArticle);
    article.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleArticle();
      }
    });
  });

  const interactiveSection = document.querySelector('#interatividade');

  if (interactiveSection) {
    const button = document.createElement('button');
    const result = document.createElement('p');
    const tips = [
      'Use irrigação consciente para economizar água no campo.',
      'A rotação de culturas protege o solo e melhora a produtividade.',
      'Energia solar ajuda a reduzir custos e impactos ambientais.',
      'Tecnologias como sensores e drones tornam a produção mais eficiente.'
    ];
    let tipIndex = 0;

    button.type = 'button';
    button.textContent = 'Mostrar dica sustentável';
    button.style.padding = '12px 18px';
    button.style.border = '0';
    button.style.borderRadius = '999px';
    button.style.cursor = 'pointer';
    button.style.fontWeight = '700';
    button.style.color = '#1f5f35';
    button.style.background = '#fff8e6';

    result.textContent = 'Clique no botão para ver uma ação sustentável.';

    button.addEventListener('click', () => {
      result.textContent = tips[tipIndex];
      tipIndex = (tipIndex + 1) % tips.length;
    });

    interactiveSection.appendChild(button);
    interactiveSection.appendChild(result);
  }
});

// Iniciar o vídeo de fundo com compatibilidade máxima
const bgVideo = document.querySelector('.bg-video');
if (bgVideo) {
  // Garantir que o vídeo esteja mudo (necessário para autoplay)
  bgVideo.muted = true;
  bgVideo.volume = 0;

  // Função para tentar reproduzir o vídeo
  function attemptPlay() {
    const playPromise = bgVideo.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Vídeo iniciado com sucesso');
        })
        .catch(error => {
          console.log('Autoplay bloqueado, tentando alternativas:', error);
          // Tentar reproduzir após interação do usuário
          document.addEventListener('click', enableVideo, { once: true });
          document.addEventListener('touchstart', enableVideo, { once: true });
          document.addEventListener('keydown', enableVideo, { once: true });
        });
    }
  }

  // Função para habilitar vídeo após interação do usuário
  function enableVideo() {
    bgVideo.play().catch(error => {
      console.log('Erro ao reproduzir após interação:', error);
    });
  }

  // Tentar reproduzir imediatamente
  attemptPlay();

  // Tentar novamente quando a página estiver totalmente carregada
  window.addEventListener('load', attemptPlay);

  // Tentar novamente quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attemptPlay);
  }

  // Monitorar se o vídeo pausa e tentar reproduzir novamente
  setInterval(() => {
    if (bgVideo.paused && !bgVideo.ended && document.visibilityState === 'visible') {
      bgVideo.play().catch(error => {
        console.log('Erro ao reproduzir vídeo (loop):', error);
      });
    }
  }, 2000);

  // Pausar vídeo quando a aba não estiver visível (economizar recursos)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      bgVideo.pause();
    } else {
      bgVideo.play().catch(error => {
        console.log('Erro ao retomar vídeo:', error);
      });
    }
  });
}

// Efeito de Zoom Suave
let ticking = false;

function updateZoom() {
  const scrolled = window.pageYOffset;
  const bgVideo = document.querySelector('.bg-video');
  const heroContent = document.querySelector('.hero-content');
  const profileImage = document.querySelector('.profile-image');
  const scrollMenu = document.getElementById('scrollMenu');

  if (bgVideo) {
    const scale = 1 + (scrolled * 0.0005);
    const clampedScale = Math.min(scale, 1.3); // Limita o zoom máximo
    bgVideo.style.transform = `scale(${clampedScale})`;
  }

  if (heroContent && scrolled < window.innerHeight) {
    heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
  }

  // Adicionar animação ao logo quando rolar
  if (profileImage) {
    if (scrolled > 50) {
      profileImage.classList.add('scrolled');
    } else {
      profileImage.classList.remove('scrolled');
    }
  }

  // Mostrar/ocultar menu ao rolar
  if (scrollMenu) {
    if (scrolled > 100) {
      scrollMenu.classList.add('visible');
    } else {
      scrollMenu.classList.remove('visible');
    }
  }

  ticking = false;
}

window.addEventListener('scroll', function() {
  if (!ticking) {
    window.requestAnimationFrame(updateZoom);
    ticking = true;
  }
});

// Navegação suave para links âncora
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Formulário de contato
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    this.reset();
  });
}

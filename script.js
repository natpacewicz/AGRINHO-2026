const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-menu');

menuToggle.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  document.body.classList.toggle('menu-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 35, 260)}ms`;
  observer.observe(element);
});

function getYouTubeVideoId(urlOrId) {
  if (!urlOrId) return '';

  const value = String(urlOrId).trim();
  const directIdPattern = /^[a-zA-Z0-9_-]{11}$/;

  if (directIdPattern.test(value)) {
    return value;
  }

  try {
    const url = new URL(value);

    if (url.hostname.includes('youtu.be')) {
      return url.pathname.split('/').filter(Boolean)[0] || '';
    }

    if (url.pathname.startsWith('/embed/')) {
      return url.pathname.split('/embed/')[1].split('/')[0] || '';
    }

    return url.searchParams.get('v') || '';
  } catch {
    return '';
  }
}

function showVideoFallback(frame) {
  const iframe = frame.querySelector('iframe');
  const fallback = frame.querySelector('.video-fallback');

  if (!fallback) return;

  if (iframe) {
    iframe.hidden = true;
  }

  fallback.hidden = false;
}

function setupYouTubeEmbed(frame) {
  const videoId = getYouTubeVideoId(frame.dataset.youtubeId);
  const iframe = frame.querySelector('iframe');
  const fallback = frame.querySelector('.video-fallback');
  const thumbnail = fallback?.querySelector('img');
  const fallbackLink = fallback?.querySelector('a');

  if (fallback) {
    fallback.hidden = true;
  }

  if (!videoId || !iframe) {
    showVideoFallback(frame);
    return;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  iframe.hidden = false;
  iframe.src = embedUrl;
  iframe.title = iframe.title || 'Vídeo do YouTube';
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
  iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  iframe.setAttribute('allowfullscreen', '');

  iframe.addEventListener('error', () => showVideoFallback(frame), { once: true });

  if (thumbnail) {
    thumbnail.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  }

  if (fallbackLink) {
    fallbackLink.href = `https://www.youtube.com/watch?v=${videoId}`;
  }
}

document.querySelectorAll('.youtube-frame[data-youtube-id]').forEach(setupYouTubeEmbed);

const playLesson = document.querySelector('#playLesson');
const lessonText = document.querySelector('#lessonText');

if (playLesson && lessonText) {
  const lessons = [
    'Agricultura de precisão usa GPS, sensores e softwares para aplicar insumos somente onde é necessário.',
    'Irrigação inteligente mede umidade e libera a quantidade ideal de água, evitando desperdício.',
    'Drones agrícolas identificam pragas, falhas no plantio e ajudam a planejar ações rápidas.',
    'Energia solar, biomassa e eólica reduzem poluição e custos nas propriedades rurais.'
  ];
  let lessonIndex = 0;

  playLesson.addEventListener('click', () => {
    lessonText.textContent = lessons[lessonIndex];
    playLesson.textContent = lessonIndex === lessons.length - 1 ? '↻' : '▶';
    lessonIndex = (lessonIndex + 1) % lessons.length;
  });
}

const impactForm = document.querySelector('#impactForm');
const impactResult = document.querySelector('#impactResult');

impactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const water = Number(document.querySelector('#waterInput').value);
  const energy = Number(document.querySelector('#energyInput').value);
  const sustainableArea = Number(document.querySelector('#greenInput').value);
  const rawImpact = water * 0.018 + energy * 0.42;
  const reduction = rawImpact * (sustainableArea / 100) * 0.55;
  const finalImpact = Math.max(rawImpact - reduction, 0);
  const level = finalImpact < 55 ? 'baixo' : finalImpact < 120 ? 'moderado' : 'alto';

  impactResult.textContent = `Impacto estimado: ${finalImpact.toFixed(1)} pontos (${level}). Práticas sustentáveis reduziram aproximadamente ${reduction.toFixed(1)} pontos.`;
});

const quizQuestions = [
  {
    question: 'Qual tecnologia ajuda a aplicar fertilizantes apenas onde necessário?',
    options: ['Agricultura de precisão', 'Queimada', 'Desmatamento'],
    answer: 0
  },
  {
    question: 'Qual prática melhora o solo e reduz pragas naturalmente?',
    options: ['Rotação de culturas', 'Solo exposto', 'Uso excessivo de água'],
    answer: 0
  },
  {
    question: 'Qual fonte de energia reduz poluição no campo?',
    options: ['Energia solar', 'Combustível fóssil', 'Queima de resíduos'],
    answer: 0
  }
];
let quizIndex = 0;
const quizQuestion = document.querySelector('#quizQuestion');
const quizOptions = document.querySelector('#quizOptions');
const quizFeedback = document.querySelector('#quizFeedback');

function renderQuiz() {
  const current = quizQuestions[quizIndex];
  quizQuestion.textContent = current.question;
  quizOptions.innerHTML = '';
  quizFeedback.textContent = '';

  current.options.forEach((option, optionIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    button.addEventListener('click', () => answerQuiz(button, optionIndex));
    quizOptions.appendChild(button);
  });
}

function answerQuiz(button, optionIndex) {
  const current = quizQuestions[quizIndex];
  const buttons = quizOptions.querySelectorAll('button');
  buttons.forEach((item) => {
    item.disabled = true;
  });

  if (optionIndex === current.answer) {
    button.classList.add('correct');
    quizFeedback.textContent = 'Resposta correta! Essa prática fortalece a produção sustentável.';
  } else {
    button.classList.add('wrong');
    buttons[current.answer].classList.add('correct');
    quizFeedback.textContent = 'Não foi dessa vez. Observe a opção marcada em verde.';
  }

  window.setTimeout(() => {
    quizIndex = (quizIndex + 1) % quizQuestions.length;
    renderQuiz();
  }, 2200);
}

renderQuiz();

const galleryData = {
  soil: {
    bad: 'Solo exposto, erosão e perda de nutrientes.',
    good: 'Cobertura vegetal, rotação de culturas e solo vivo.',
    badImage: 'https://i.imgur.com/AgBA0Yr.jpeg',
    goodImage: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1000&q=80'
  },
  water: {
    bad: 'Irrigação sem controle e alto desperdício.',
    good: 'Sensores de umidade e irrigação na medida certa.',
    badImage: 'https://i.imgur.com/w2MzKyc.jpeg',
    goodImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80'
  },
  energy: {
    bad: 'Dependência de fontes poluentes e alto custo.',
    good: 'Painéis solares, biomassa e energia renovável.',
    badImage: 'https://i.imgur.com/osZhLfZ.jpeg',
    goodImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1000&q=80'
  }
};
const galleryButtons = document.querySelectorAll('[data-gallery]');
const badPractice = document.querySelector('#badPractice');
const goodPractice = document.querySelector('#goodPractice');
const galleryBad = document.querySelector('.gallery-bad');
const galleryGood = document.querySelector('.gallery-good');

function updateGallery(type) {
  galleryButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.gallery === type);
  });
  badPractice.textContent = galleryData[type].bad;
  goodPractice.textContent = galleryData[type].good;
  galleryBad.style.backgroundImage = `url('${galleryData[type].badImage}')`;
  galleryGood.style.backgroundImage = `url('${galleryData[type].goodImage}')`;
}

galleryButtons.forEach((button) => {
  button.addEventListener('click', () => updateGallery(button.dataset.gallery));
});
updateGallery('soil');

const regionData = {
  Norte: 'Monitoramento por satélite, fiscalização ambiental e manejo florestal sustentável.',
  Nordeste: 'Irrigação inteligente, energia solar e agricultura adaptada ao clima semiárido.',
  'Centro-Oeste': 'Agricultura de precisão, drones agrícolas e integração lavoura-pecuária-floresta.',
  Sudeste: 'Sensores de solo, rastreabilidade, energia renovável e logística tecnológica.',
  Sul: 'Rotação de culturas, plantio direto, conservação do solo e mecanização eficiente.'
};
const mapInfo = document.querySelector('#mapInfo');

document.querySelectorAll('[data-region]').forEach((button) => {
  button.addEventListener('click', () => {
    const region = button.dataset.region;
    mapInfo.textContent = `${region}: ${regionData[region]}`;
  });
});

const contactForm = document.querySelector('#contactForm');
const formStatus = document.querySelector('#formStatus');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('#name').value.trim();
  formStatus.textContent = `Obrigado, ${name}! Sua mensagem foi registrada para conscientização ambiental.`;
  contactForm.reset();
});

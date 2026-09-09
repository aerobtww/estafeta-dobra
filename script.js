// Данные мероприятий: план работы на семестр
const events = [
  {
    date: '15 сентября',
    title: 'Сбор вещей и канцтоваров',
    text: 'Пункт приёма одежды, книг и школьных принадлежностей в холле колледжа для передачи в детский дом города.'
  },
  {
    date: '10 октября',
    title: 'Мастер-класс «Игрушка своими руками»',
    text: 'Творческая встреча с детьми из многодетных семей: вместе с волонтёрами шьём мягкие игрушки из остатков ткани.'
  },
  {
    date: '14 ноября',
    title: 'Встреча «Разговор с мамой»',
    text: 'Открытая беседа с психологом колледжа для молодых мам: о поддержке, ресурсах и первых шагах в трудной ситуации.'
  },
  {
    date: '5 декабря',
    title: 'Новогодняя ёлка добра',
    text: 'Праздник с подарками, играми и сладким столом для детей из подшефного детского дома. Итоговое мероприятие семестра.'
  }
];

function renderEvents() {
  const grid = document.getElementById('eventGrid');
  if (!grid) return;

  grid.innerHTML = events.map(ev => `
    <article class="event-card reveal">
      <time>${ev.date}</time>
      <h3>${ev.title}</h3>
      <p>${ev.text}</p>
    </article>
  `).join('');
}

function initForm() {
  const form = document.getElementById('helpForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const contact = form.contact.value.trim();

    if (!name || !contact) {
      status.textContent = 'Пожалуйста, заполните имя и контакт.';
      status.style.color = '#C86B5C';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    status.textContent = 'Отправляем...';
    status.style.color = '#7A8B6F';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        status.textContent = `Спасибо, ${name}! Мы свяжемся с вами в ближайшее время.`;
        status.style.color = '#7A8B6F';
        form.reset();
      } else {
        status.textContent = 'Что-то пошло не так. Попробуйте ещё раз или напишите нам напрямую.';
        status.style.color = '#C86B5C';
      }
    } catch (err) {
      status.textContent = 'Не удалось отправить. Проверьте подключение к интернету.';
      status.style.color = '#C86B5C';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

function initNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('siteNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Закрывать меню при клике на ссылку
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 900;
  const start = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(target * progress);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');

        // Если это блок статистики — запускаем счётчик
        if (entry.target.id === 'statsBlock') {
          entry.target.querySelectorAll('strong[data-count]').forEach(animateCount);
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach(item => observer.observe(item));
}

function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = percent + '%';
  });
}

function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav a[href^="#"]');
  if (!navLinks.length) return;

  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const linkBySection = new Map();
  navLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) linkBySection.set(section, link);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = linkBySection.get(entry.target);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => observer.observe(section));
}

document.addEventListener('DOMContentLoaded', () => {
  renderEvents();
  initForm();
  initNav();
  initReveal();
  initBackToTop();
  initScrollProgress();
  initScrollSpy();
});
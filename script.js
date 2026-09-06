// Данные мероприятий — легко редактировать/дополнять
const events = [
  {
    date: '12 октября',
    title: 'Мастер-класс «Игрушка своими руками»',
    text: 'Творческая встреча для детей из многодетных семей: делаем мягкие игрушки вместе с волонтёрами.'
  },
  {
    date: '2 ноября',
    title: 'Сбор вещей и канцтоваров',
    text: 'Пункт приёма одежды, книг и школьных принадлежностей для детского дома.'
  },
  {
    date: '20 ноября',
    title: 'Встреча «Разговор с мамой»',
    text: 'Открытая беседа с психологом для молодых мам, оказавшихся в трудной ситуации.'
  },
  {
    date: '5 декабря',
    title: 'Новогодняя ёлка добра',
    text: 'Праздник с подарками для детей из подшефного детского дома.'
  }
];

function renderEvents() {
  const grid = document.getElementById('eventGrid');
  if (!grid) return;

  grid.innerHTML = events.map(ev => `
    <article class="event-card">
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

document.addEventListener('DOMContentLoaded', () => {
  renderEvents();
  initForm();
});
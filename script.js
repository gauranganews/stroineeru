// ===== Discount countdown timer =====
(function () {
  const DURATION = 24 * 60 * 60 * 1000; // 24 hours
  const KEY = 'elania_discount_deadline';

  const applyBtn = document.getElementById('applyBtn');
  const payBtn = document.getElementById('payBtn');
  const timer = document.getElementById('timer');
  const th = document.getElementById('th');
  const tm = document.getElementById('tm');
  const ts = document.getElementById('ts');

  let interval = null;

  function pad(n) { return String(n).padStart(2, '0'); }

  function showActiveState() {
    if (applyBtn) applyBtn.hidden = true;
    if (payBtn) payBtn.hidden = false;
    if (timer) timer.hidden = false;
  }

  function showInitialState() {
    if (applyBtn) applyBtn.hidden = false;
    if (payBtn) payBtn.hidden = true;
    if (timer) timer.hidden = true;
  }

  function tick(deadline) {
    const left = deadline - Date.now();
    if (left <= 0) {
      clearInterval(interval);
      localStorage.removeItem(KEY);
      // keep the discount visible but restart the offer
      showInitialState();
      return;
    }
    const h = Math.floor(left / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    const s = Math.floor((left % 60000) / 1000);
    th.textContent = pad(h);
    tm.textContent = pad(m);
    ts.textContent = pad(s);
  }

  function start(deadline) {
    showActiveState();
    tick(deadline);
    clearInterval(interval);
    interval = setInterval(() => tick(deadline), 1000);
  }

  // Resume if a deadline already exists
  const saved = parseInt(localStorage.getItem(KEY), 10);
  if (saved && saved > Date.now()) {
    start(saved);
  }

  if (applyBtn) {
    applyBtn.addEventListener('click', function () {
      const deadline = Date.now() + DURATION;
      localStorage.setItem(KEY, String(deadline));
      start(deadline);
    });
  }
})();

// ===== Legal modals =====
(function () {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  const content = {
    security: {
      t: 'Безопасность',
      h: '<p>Оплата проходит через защищённое соединение. Мы не храним данные ваших банковских карт.</p><p>Все персональные данные обрабатываются в соответствии с действующим законодательством РФ.</p>'
    },
    oferta: {
      t: 'Договор оферты',
      h: '<p>Настоящий документ является публичной офертой ИП Темников Дмитрий Павлович (ИНН&nbsp;420228273076) на оказание информационно-консультационных услуг «Мини группа стройности».</p><p>Оплачивая участие, вы соглашаетесь с условиями оферты. Услуга считается оказанной после проведения марафона.</p>'
    },
    privacy: {
      t: 'Политика конфиденциальности',
      h: '<p>Мы собираем минимально необходимые данные (контакт для связи) исключительно для оказания услуги и обратной связи.</p><p>Данные не передаются третьим лицам. По вопросам обработки данных пишите нам в Telegram.</p>'
    }
  };

  function open(key) {
    const c = content[key];
    if (!c) return;
    title.innerHTML = c.t;
    body.innerHTML = c.h;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      open(a.getAttribute('data-modal'));
    });
  });

  modal.querySelectorAll('[data-close]').forEach(function (el) {
    el.addEventListener('click', close);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
})();

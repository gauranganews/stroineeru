// ===== Discount countdown timer (10 000 -> 3 000 for 24h) =====
(function () {
  const DURATION = 24 * 60 * 60 * 1000;
  const KEY = 'elania_discount_deadline';

  const applyBtn = document.getElementById('applyBtn');
  const payBtn = document.getElementById('payBtn');
  const timer = document.getElementById('timer');
  const priceOld = document.getElementById('priceOld');
  const priceNow = document.getElementById('priceNow');
  const priceBadge = document.getElementById('priceBadge');
  const th = document.getElementById('th');
  const tm = document.getElementById('tm');
  const ts = document.getElementById('ts');
  let interval = null;

  const pad = (n) => String(n).padStart(2, '0');

  function activate() {
    applyBtn.hidden = true;
    payBtn.hidden = false;
    timer.hidden = false;
    priceNow.hidden = false;
    priceBadge.hidden = false;
    priceOld.classList.add('is-struck');
  }
  function reset() {
    applyBtn.hidden = false;
    payBtn.hidden = true;
    timer.hidden = true;
    priceNow.hidden = true;
    priceBadge.hidden = true;
    priceOld.classList.remove('is-struck');
  }

  function tick(deadline) {
    const left = deadline - Date.now();
    if (left <= 0) {
      clearInterval(interval);
      localStorage.removeItem(KEY);
      reset();
      return;
    }
    th.textContent = pad(Math.floor(left / 3600000));
    tm.textContent = pad(Math.floor((left % 3600000) / 60000));
    ts.textContent = pad(Math.floor((left % 60000) / 1000));
  }

  function start(deadline) {
    activate();
    tick(deadline);
    clearInterval(interval);
    interval = setInterval(() => tick(deadline), 1000);
  }

  const saved = parseInt(localStorage.getItem(KEY), 10);
  if (saved && saved > Date.now()) start(saved);

  applyBtn.addEventListener('click', function () {
    const deadline = Date.now() + DURATION;
    localStorage.setItem(KEY, String(deadline));
    start(deadline);
    document.getElementById('price').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();

// ===== Reviews lightbox (fullscreen) =====
(function () {
  const gallery = document.getElementById('gallery');
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const items = Array.from(gallery.querySelectorAll('img'));
  const srcs = items.map((i) => i.getAttribute('src'));
  let idx = 0;

  function show(i) {
    idx = (i + srcs.length) % srcs.length;
    lbImg.src = srcs[idx];
  }
  function open(i) {
    show(i);
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close() {
    lb.hidden = true;
    document.body.style.overflow = '';
  }

  gallery.querySelectorAll('.gallery__item').forEach(function (btn, i) {
    btn.addEventListener('click', () => open(i));
  });
  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', (e) => { e.stopPropagation(); show(idx - 1); });
  document.getElementById('lbNext').addEventListener('click', (e) => { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });

  // swipe on touch
  let x0 = null;
  lb.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) show(dx < 0 ? idx + 1 : idx - 1);
    x0 = null;
  });
})();

// ===== Legal modals =====
(function () {
  const modal = document.getElementById('modal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  const content = {
    security: { t: 'Безопасность', h: '<p>Оплата проходит через защищённое соединение. Мы не храним данные ваших банковских карт.</p><p>Все персональные данные обрабатываются в соответствии с действующим законодательством РФ.</p>' },
    oferta: { t: 'Договор оферты', h: '<p>Настоящий документ является публичной офертой ИП Темников Дмитрий Павлович (ИНН&nbsp;420228273076) на оказание информационно-консультационных услуг «Мини-группа стройности».</p><p>Оплачивая участие, вы соглашаетесь с условиями оферты. Услуга считается оказанной после проведения марафона.</p>' },
    privacy: { t: 'Политика конфиденциальности', h: '<p>Мы собираем минимально необходимые данные (контакт для связи) исключительно для оказания услуги и обратной связи.</p><p>Данные не передаются третьим лицам. По вопросам обработки данных пишите нам в Telegram.</p>' }
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
    a.addEventListener('click', function (e) { e.preventDefault(); open(a.getAttribute('data-modal')); });
  });
  modal.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', close));
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
})();

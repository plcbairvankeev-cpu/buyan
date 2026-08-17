/* =========================================================================
   main.js — минимальная логика сайта.
   1. Подстановка значений из config.js в элементы [data-cfg].
   2. Мобильное меню.
   3. Текущий год в футере.
   4. Заглушка отправки форм (без бэкенда).
   Никаких зависимостей. Работает при открытии index.html двойным кликом.
   ========================================================================= */
(function () {
  'use strict';

  var CFG = window.SITE_CONFIG || {};

  /* --- 0. Плашка принадлежности к сообществу «Буян» --------------------------
     Показывается только когда каталог открыт в составе единого проекта Буян
     (когда рядом на уровень выше есть хаб ../index.html). Ведёт обратно в хаб.
     В отдельном сайте prom-site этого файла-родителя нет — плашка не мешает. */
  (function () {
    var bar = document.createElement('a');
    bar.href = '../index.html';
    bar.setAttribute('aria-label', 'Вернуться в сообщество Буян');
    bar.textContent = '◀ Сообщество «Буян» · это направление круга';
    bar.style.cssText = 'display:block;background:#0e141b;color:#c7a24e;' +
      'font:600 13px/1.4 system-ui,-apple-system,sans-serif;letter-spacing:.02em;' +
      'text-decoration:none;padding:9px 16px;text-align:center;border-bottom:1px solid #22303d';
    bar.addEventListener('mouseenter', function () { bar.style.color = '#e6cd8a'; });
    bar.addEventListener('mouseleave', function () { bar.style.color = '#c7a24e'; });
    document.body.insertBefore(bar, document.body.firstChild);
  })();

  /* --- 1. Подстановка config в data-cfg="путь.до.значения" ---------------
     Пример: <span data-cfg="company.inn">—</span>
     Если значения нет — остаётся исходный текст (fallback в HTML). */
  function resolve(path) {
    return path.split('.').reduce(function (acc, key) {
      return (acc && acc[key] != null) ? acc[key] : undefined;
    }, CFG);
  }

  document.querySelectorAll('[data-cfg]').forEach(function (el) {
    var val = resolve(el.getAttribute('data-cfg'));
    if (val === undefined) return;
    var attr = el.getAttribute('data-cfg-attr'); // напр. href для ссылок
    if (attr) {
      el.setAttribute(attr, val);
    } else {
      el.textContent = val;
    }
  });

  /* --- 2. Мобильное меню --------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  /* --- 3. Текущий год ------------------------------------------------------ */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* --- 4. Заглушка форм ---------------------------------------------------
     Реальная отправка не подключена. Ниже — точка интеграции.
     Как подключить: укажите SITE_CONFIG.form.endpoint в config.js и
     раскомментируйте fetch-блок. */
  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      // var data = Object.fromEntries(new FormData(form).entries());
      // --- ПОДКЛЮЧЕНИЕ БЭКЕНДА (раскомментировать) ---
      // fetch(CFG.form.endpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // }).then(...).catch(...);
      // -------------------------------------------------

      var status = form.querySelector('.form-status');
      if (status) {
        status.className = 'form-status form-status--ok';
        status.textContent = 'Заявка подготовлена. Форма пока не отправляет данные — подключите обработчик в main.js. Спасибо!';
      }
      form.reset();
    });
  });
})();

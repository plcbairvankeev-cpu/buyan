/* =====================================================================
   Настройка Supabase для входа участников.
   1) Создайте проект на supabase.com → Project Settings → API.
   2) Вставьте сюда Project URL и anon public key.
      anon-ключ ПУБЛИЧНЫЙ — его можно держать во фронтенде, это штатно.
      Секретный service_role ключ сюда НЕ вставлять никогда.
   3) В Supabase → Authentication → Providers включите Email.
   Пока значения-плейсхолдеры не заменены — сайт работает в ДЕМО-режиме
   (можно посмотреть кабинет без реального входа).
   ===================================================================== */
window.SUPABASE = {
  url:     "https://YOUR-PROJECT.supabase.co",   // ← Project URL
  anonKey: "YOUR-ANON-PUBLIC-KEY",               // ← anon public key
};

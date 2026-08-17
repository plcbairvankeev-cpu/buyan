/* =====================================================================
   auth.js — вход участников через Supabase (+ демо-режим до настройки).
   Использует глобальный supabase-js (подключается CDN-скриптом на странице).
   Экспорт: window.BuyanAuth
   ===================================================================== */
(function () {
  "use strict";

  var CFG = window.SUPABASE || {};
  var DEMO_KEY = "buyan_demo_member";

  function isConfigured() {
    return !!(CFG.url && CFG.anonKey &&
      !/YOUR/i.test(CFG.url) && !/YOUR/i.test(CFG.anonKey) &&
      /^https:\/\/.+\.supabase\.co/.test(CFG.url));
  }

  var _client = null;
  function client() {
    if (!isConfigured()) return null;
    if (!window.supabase || !window.supabase.createClient) return null;
    if (!_client) _client = window.supabase.createClient(CFG.url, CFG.anonKey);
    return _client;
  }

  // --- Демо-режим (без Supabase): «вход» хранится в localStorage ---
  function demoLogin() { try { localStorage.setItem(DEMO_KEY, "1"); } catch (e) {} }
  function demoActive() { try { return localStorage.getItem(DEMO_KEY) === "1"; } catch (e) { return false; } }
  function demoLogout() { try { localStorage.removeItem(DEMO_KEY); } catch (e) {} }

  // --- Реальные действия ---
  function signIn(email, password) {
    var c = client();
    if (!c) return Promise.reject(new Error("Supabase не настроен"));
    return c.auth.signInWithPassword({ email: email, password: password });
  }
  function signUp(email, password) {
    var c = client();
    if (!c) return Promise.reject(new Error("Supabase не настроен"));
    return c.auth.signUp({ email: email, password: password });
  }
  function signOut() {
    demoLogout();
    var c = client();
    if (c) return c.auth.signOut();
    return Promise.resolve();
  }

  // Текущий пользователь: {email, demo} | null  (async)
  function currentUser() {
    var c = client();
    if (c) {
      return c.auth.getSession().then(function (r) {
        var s = r && r.data && r.data.session;
        return s ? { email: s.user.email, demo: false } : (demoActive() ? { email: "Демо-участник", demo: true } : null);
      });
    }
    return Promise.resolve(demoActive() ? { email: "Демо-участник", demo: true } : null);
  }

  // Защита страницы кабинета: нет сессии → на страницу входа
  function requireAuth(loginUrl) {
    return currentUser().then(function (u) {
      if (!u) {
        var base = loginUrl || "vhod.html";
        var here = location.pathname.split("/").pop() + location.search + location.hash;
        var sep = base.indexOf("?") >= 0 ? "&" : "?";
        location.replace(base + sep + "next=" + encodeURIComponent(here));
        return null;
      }
      return u;
    });
  }

  window.BuyanAuth = {
    isConfigured: isConfigured,
    getClient: client,
    signIn: signIn,
    signUp: signUp,
    signOut: signOut,
    currentUser: currentUser,
    requireAuth: requireAuth,
    demoLogin: demoLogin,
    demoActive: demoActive
  };
})();

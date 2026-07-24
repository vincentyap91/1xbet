/**
 * Shared demo inbox for desktop dropdown + mobile Messages page.
 * Mutate in place; optional session persistence via MessagesStore helpers in consumers.
 */
(function (global) {
  "use strict";

  var STORAGE_KEY = "1xbet_messages_v1";

  var SEED = [
    {
      id: "m1",
      title: "Odyssey bermula – sertai sekarang!",
      date: "24/07/2026",
      datetime: "24/07/2026 (17:10)",
      body: "Sertai Odyssey sekarang dan tuntut ganjaran eksklusif sepanjang kempen. Tawaran terhad — pastikan anda tidak ketinggalan!",
      unread: true,
    },
    {
      id: "m2",
      title: "Matches Of The Day...",
      date: "24/07/2026",
      datetime: "24/07/2026 (17:05)",
      body: "Matches Of The Day on 24.07.2026.Matches Of The Day comprise of today's best offers. We offer YOU boosted odds and increased maximum stakes on all outcomes of selected matches.",
      unread: true,
    },
    {
      id: "m3",
      title: "Tentangan adalah sia-sia, kerana ini ialah 1X Job",
      date: "24/07/2026",
      datetime: "24/07/2026 (16:48)",
      body: "Cabaran 1X Job sudah dibuka. Selesaikan misi harian dan kumpulkan ganjaran. Lawan adalah sia-sia — sertai sekarang!",
      unread: true,
    },
    {
      id: "m4",
      title: "💎 Sebahagian daripada €8,000 masih sedia disambar",
      date: "24/07/2026",
      datetime: "24/07/2026 (15:22)",
      body: "Pool hadiah €8,000 masih tersedia. Pasang taruhan layak dan bersaing untuk bahagian anda sebelum masa tamat.",
      unread: true,
    },
    {
      id: "m5",
      title: "🍕 Saya dapat piza, kamu dapat 100 FS",
      date: "24/07/2026",
      datetime: "24/07/2026 (14:01)",
      body: "Tuntut 100 Free Spins dengan deposit minimum yang layak. Tawaran piza + FS ini sah untuk masa yang terhad.",
      unread: true,
    },
    {
      id: "m6",
      title: "💰 Kami berikan +50% untuk deposit anda!",
      date: "24/07/2026",
      datetime: "24/07/2026 (12:30)",
      body: "Deposit sekarang dan dapatkan bonus +50%. Semak syarat promosi dalam akaun anda sebelum menuntut.",
      unread: true,
    },
  ];

  function cloneSeed() {
    return SEED.map(function (m) {
      return {
        id: m.id,
        title: m.title,
        date: m.date,
        datetime: m.datetime,
        body: m.body,
        unread: !!m.unread,
      };
    });
  }

  function load() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return cloneSeed();
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || !parsed.length) return cloneSeed();
      return parsed;
    } catch (e) {
      return cloneSeed();
    }
  }

  function save(list) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      /* ignore */
    }
  }

  function unreadCount(list) {
    return (list || []).filter(function (m) {
      return m.unread;
    }).length;
  }

  global.MessagesData = {
    STORAGE_KEY: STORAGE_KEY,
    seed: cloneSeed,
    load: load,
    save: save,
    unreadCount: unreadCount,
  };
})(typeof window !== "undefined" ? window : this);

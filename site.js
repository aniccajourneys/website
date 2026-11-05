// Anicca Journeys — v1
// 1) The hero sky follows the current time in Bali (WITA, UTC+8).
// 2) Nav: mobile menu toggle and the Journeys dropdown.

(function () {
  var phases = [
    { from: 0, to: 5, name: "night", top: "#1f130b", bottom: "#4a3020", far: "#3a2416", near: "#1a0f08", text: "#f4ece1",
      line: "Stars over the boat, anchored off Komodo." },
    { from: 5, to: 7, name: "dawn", top: "#c9a98a", bottom: "#f1dcc4", far: "#9a7a5c", near: "#5e3f25", text: "#2a1a0e",
      line: "Sunrise from the top of Padar Island." },
    { from: 7, to: 16, name: "day", top: "#d9c2a0", bottom: "#f4ece1", far: "#a88a68", near: "#6b4a2e", text: "#2a1a0e",
      line: "Clear water and empty sandbanks around Komodo." },
    { from: 16, to: 18.5, name: "golden", top: "#c49766", bottom: "#f0d6ac", far: "#8a6040", near: "#4f321c", text: "#2a1a0e",
      line: "Golden hour on the cliffs at Uluwatu." },
    { from: 18.5, to: 20, name: "dusk", top: "#4e3224", bottom: "#b98a6c", far: "#3f281a", near: "#24150b", text: "#f4ece1",
      line: "The sky over Ubud's rice terraces turning violet." },
    { from: 20, to: 24, name: "night", top: "#1f130b", bottom: "#4a3020", far: "#3a2416", near: "#1a0f08", text: "#f4ece1",
      line: "Stars over the boat, anchored off Komodo." }
  ];

  function baliNow() {
    try {
      var parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Makassar", hour: "numeric", minute: "2-digit", hour12: false
      }).formatToParts(new Date());
      var h = 0, m = 0;
      parts.forEach(function (p) {
        if (p.type === "hour") h = parseInt(p.value, 10) % 24;
        if (p.type === "minute") m = parseInt(p.value, 10);
      });
      return { h: h, m: m };
    } catch (e) {
      var d = new Date();
      var utc = d.getUTCHours() + d.getUTCMinutes() / 60;
      var bh = (utc + 8) % 24;
      return { h: Math.floor(bh), m: Math.round((bh % 1) * 60) };
    }
  }

  function label(t) {
    var h12 = t.h % 12 === 0 ? 12 : t.h % 12;
    var mm = t.m < 10 ? "0" + t.m : String(t.m);
    return h12 + ":" + mm + (t.h < 12 ? " am" : " pm");
  }

  function paint() {
    var t = baliNow();
    var hour = t.h + t.m / 60;
    var p = phases.filter(function (x) { return hour >= x.from && hour < x.to; })[0] || phases[2];
    var root = document.documentElement.style;
    root.setProperty("--sky-top", p.top);
    root.setProperty("--sky-bottom", p.bottom);
    root.setProperty("--ridge-far", p.far);
    root.setProperty("--ridge-near", p.near);
    root.setProperty("--sky-text", p.text);
    var el = document.getElementById("bali-now");
    if (el) el.textContent = "In Bali it's " + label(t) + ". " + p.line;
  }

  paint();
  setInterval(paint, 60000);

  // Mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
  }

  // Journeys dropdown
  var menuBtn = document.querySelector(".menu-button");
  var menu = document.getElementById("journeys-menu");
  if (menuBtn && menu) {
    function setMenu(open) {
      menu.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    }
    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenu(!menu.classList.contains("open"));
    });
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target)) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { setMenu(false); menuBtn.focus(); }
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        setMenu(false);
        if (links) { links.classList.remove("open"); }
        if (toggle) { toggle.setAttribute("aria-expanded", "false"); toggle.textContent = "Menu"; }
      }
    });
  }
})();

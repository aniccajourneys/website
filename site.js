// Anicca Journeys — v1
// 1) The hero sky follows the current time in Bali (WITA, UTC+8).
// 2) Nav: mobile menu toggle and the Journeys dropdown.

(function () {
  var phases = [
    { from: 0, to: 5, name: "night", top: "#0b1d2e", bottom: "#24415a", far: "#132a3c", near: "#0a1824", text: "#ffffff",
      line: "Stars over the boat, anchored off Komodo." },
    { from: 5, to: 7, name: "dawn", top: "#3c4f78", bottom: "#e8b59a", far: "#4a5470", near: "#2a3149", text: "#ffffff",
      line: "Sunrise from the top of Padar Island." },
    { from: 7, to: 16, name: "day", top: "#2f7f99", bottom: "#a9d7d4", far: "#2c6e6f", near: "#18484c", text: "#ffffff",
      line: "Clear water and empty sandbanks around Komodo." },
    { from: 16, to: 18.5, name: "golden", top: "#476a86", bottom: "#e9b871", far: "#4e5a5e", near: "#29363b", text: "#ffffff",
      line: "Golden hour on the cliffs at Uluwatu." },
    { from: 18.5, to: 20, name: "dusk", top: "#2b2f55", bottom: "#b87a86", far: "#3a3653", near: "#211f36", text: "#ffffff",
      line: "The sky over Ubud's rice terraces turning violet." },
    { from: 20, to: 24, name: "night", top: "#0b1d2e", bottom: "#24415a", far: "#132a3c", near: "#0a1824", text: "#ffffff",
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

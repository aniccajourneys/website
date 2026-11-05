// Anicca Journeys — v3
// 1) A line in the hero showing the current time in Bali (WITA, UTC+8),
//    and the hero overlay deepens a little after dark.
// 2) Nav: mobile menu toggle and the Journeys dropdown.
// 3) Enquiry form: opens the visitor's email app with their details filled in.

(function () {
  var phases = [
    { from: 0, to: 5, veil: 0.65, line: "Stars over the boat, anchored off Komodo." },
    { from: 5, to: 7, veil: 0.5, line: "Sunrise from the top of Padar Island." },
    { from: 7, to: 16, veil: 0.5, line: "Clear water and empty sandbanks around Komodo." },
    { from: 16, to: 18.5, veil: 0.5, line: "Golden hour on the cliffs at Uluwatu." },
    { from: 18.5, to: 20, veil: 0.58, line: "The sky over Ubud's rice terraces turning violet." },
    { from: 20, to: 24, veil: 0.65, line: "Stars over the boat, anchored off Komodo." }
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
      var bh = (d.getUTCHours() + d.getUTCMinutes() / 60 + 8) % 24;
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
    document.documentElement.style.setProperty("--veil", p.veil);
    var el = document.getElementById("bali-now");
    if (el) el.textContent = "In Bali it's " + label(t) + ". " + p.line;
  }

  paint();
  setInterval(paint, 60000);

  // Mobile nav
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  function closeNav() {
    if (links) links.classList.remove("open");
    if (toggle) { toggle.setAttribute("aria-expanded", "false"); toggle.textContent = "Menu"; }
  }
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") closeNav();
    });
  }

  // Journeys dropdown
  var menuBtn = document.querySelector(".menu-button");
  var menu = document.getElementById("journeys-menu");
  if (menuBtn && menu) {
    var setMenu = function (open) {
      menu.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    };
    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      setMenu(!menu.classList.contains("open"));
    });
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target)) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); menuBtn.focus(); }
    });
  }

  // Enquiry form -> email
  var form = document.getElementById("enquiry-form");
  var note = document.getElementById("form-note");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var names = (d.get("names") || "").trim();
      var email = (d.get("email") || "").trim();
      if (!names || !/^\S+@\S+\.\S+$/.test(email)) {
        note.textContent = "Add your names and a valid email so we can reply.";
        note.classList.add("error");
        return;
      }
      note.classList.remove("error");
      note.textContent = "Opening your email app…";
      var body = [
        "Names: " + names,
        "Email: " + email,
        "Occasion: " + d.get("occasion"),
        "Roughly when: " + (d.get("when") || "-"),
        "",
        (d.get("notes") || "")
      ].join("\n");
      window.location.href = "mailto:hello@aniccajourneys.com?subject=" +
        encodeURIComponent("Journey enquiry: " + d.get("occasion")) +
        "&body=" + encodeURIComponent(body);
    });
  }
})();

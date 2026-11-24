/* PakToolkit — Eid Card Maker.
   Retro 90s-style Eid cards drawn entirely on a canvas in the visitor's
   browser: five free designs, funny and emotional Urdu shayari presets,
   sender/recipient name personalisation, PNG download and WhatsApp share.
   Nothing is uploaded anywhere. */
function initEid(){
  var cv = document.getElementById("e-canvas");
  if (!cv) return;
  var ctx = cv.getContext("2d");
  var W = 1080, H = 1350;

  var SHAYARI = [
    ["ڈبے میں ڈبہ، ڈبے میں کیک", "میری دوست لاکھوں میں ایک"],
    ["گرم گرم روٹی توڑی نہیں جاتی", "بچپن کی دوستی چھوڑی نہیں جاتی"],
    ["چھوٹی سی چڑیا کہتی ہے گانا", "تم عید کی نماز پڑھ کر ہمارے گھر آنا"],
    ["عید آئی ہے زمانے میں", "میری دوست گر گئی غسل خانے میں"],
    ["گنے کے رس کو جوس کہتے ہیں", "جو عید کارڈ آگے نہ بھیجے اسے کنجوس کہتے ہیں"],
    ["عید عید کرتے ہو، عید بھی آ جانے گی", "پہلے تیس روزے رکھو، عقل آ جانے گی"],
    ["پردیس میں عید آئی، اپنوں کی یاد لائی", "دل نے کہا چپکے سے، عید مبارک ہو بھائی"],
    ["ماں کے ہاتھ کی سویاں، عید کی اصل پہچان", "جہاں ماں کی دعا ہو، وہاں ہر دن عید کا دن"]
  ];
  var TYPES = {
    fitr: { latin: "EID-UL-FITR MUBARAK", urdu: "عید الفطر مبارک" },
    adha: { latin: "EID-UL-ADHA MUBARAK", urdu: "عید الاضحیٰ مبارک" }
  };

  /* ---------- drawing helpers ---------- */
  var seed = 7;
  function rnd(){ seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function star4(x, y, r, color){
    ctx.fillStyle = color; ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y);
    ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
  }
  function starField(n, color, yMax){
    seed = 7;
    for (var i = 0; i < n; i++){
      var x = 70 + rnd() * (W - 140), y = 60 + rnd() * yMax, r = 5 + rnd() * 9;
      /* the middle band stays clear — a star never lands on the sher */
      if (y > 730 && y < 1020 && x > 105 && x < W - 105) continue;
      ctx.globalAlpha = 0.35 + rnd() * 0.6; star4(x, y, r, color);
    }
    ctx.globalAlpha = 1;
  }
  /* True crescent path (two circle arcs) — no cut-out disc, so it sits
     cleanly on gradients and sunburst rays, with a soft 90s glow. */
  function crescent(x, y, r, color, cut){
    var dx = r * 0.42, dy = -r * 0.22, r2 = r * 0.82;
    var cx2 = x + dx, cy2 = y + dy;
    var d = Math.sqrt(dx * dx + dy * dy);
    var a = Math.atan2(dy, dx);
    var t1 = Math.acos((d * d + r * r - r2 * r2) / (2 * d * r));
    var t2 = Math.acos((d * d + r2 * r2 - r * r) / (2 * d * r2));
    ctx.save();
    ctx.shadowColor = color; ctx.shadowBlur = 26;
    ctx.fillStyle = color; ctx.beginPath();
    ctx.arc(x, y, r, a + t1, a - t1, false);
    ctx.arc(cx2, cy2, r2, a + Math.PI + t2, a + Math.PI - t2, true);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  function frame(c1, c2){
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.40)"; ctx.shadowBlur = 16; ctx.shadowOffsetY = 4;
    ctx.strokeStyle = c1; ctx.lineWidth = 6; ctx.strokeRect(34, 34, W - 68, H - 68);
    ctx.restore();
    ctx.strokeStyle = c2; ctx.lineWidth = 2; ctx.strokeRect(52, 52, W - 104, H - 104);
    /* 90s printed-card motif band — tiny diamonds marching between the rules */
    ctx.fillStyle = c2;
    for (var mx = 84; mx < W - 62; mx += 46){ dia(mx, 43, 5, c2); dia(mx, H - 43, 5, c2); }
    for (var my = 84; my < H - 62; my += 46){ dia(43, my, 5, c2); dia(W - 43, my, 5, c2); }
    [[34, 34], [W - 34, 34], [34, H - 34], [W - 34, H - 34]].forEach(function(p){ star4(p[0], p[1], 15, c1); });
  }
  function dia(x, y, r, color){
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4);
    ctx.fillStyle = color; ctx.fillRect(-r, -r, r * 2, r * 2); ctx.restore();
  }
  function medallion(cx, cy, r, color){
    ctx.save(); ctx.globalAlpha = 0.55; ctx.strokeStyle = color;
    ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
    ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r + 13, 0, 7); ctx.stroke();
    ctx.restore();
  }
  function glow(cx, cy, r, rgba){
    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    g.addColorStop(0, rgba); g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }
  function rose(x, y, r, petal, deep){
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4;
    ctx.fillStyle = petal;
    for (var i = 0; i < 6; i++){
      var a = i * Math.PI / 3;
      ctx.beginPath(); ctx.arc(x + Math.cos(a) * r * 0.52, y + Math.sin(a) * r * 0.52, r * 0.5, 0, 7); ctx.fill();
    }
    ctx.fillStyle = deep; ctx.beginPath(); ctx.arc(x, y, r * 0.42, 0, 7); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = deep; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, r * 0.22, 0.4, 4.6); ctx.stroke();
  }
  function leaf(x, y, r, color){
    ctx.fillStyle = color; ctx.beginPath();
    ctx.ellipse(x, y, r, r * 0.42, -0.6, 0, 7); ctx.fill();
  }
  function mosque(baseY, color, win, s){
    s = s || 1;
    ctx.fillStyle = color;
    ctx.fillRect(0, baseY, W, H - baseY);
    /* side domes — fillStyle is re-set before every shape: star4() changes it */
    [-40, W - 190].forEach(function(x){
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(x + 115, baseY, 115 * s, Math.PI, 0); ctx.fill();
      ctx.fillRect(x + 103, baseY - 52 * s, 24, 52 * s);
      star4(x + 115, baseY - 66 * s, 13, win);
    });
    /* main dome — no finial star: it used to land right on the sher's
       second line (Mazeen's screenshot, 2026-11-24) */
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(W / 2, baseY, 185 * s, Math.PI, 0); ctx.fill();
    ctx.fillRect(W / 2 - 12, baseY - 226 * s, 24, 44 * s);
    /* minarets */
    [92, W - 128].forEach(function(x){
      ctx.fillStyle = color;
      ctx.fillRect(x, baseY - 330 * s, 36, 330 * s);
      ctx.fillRect(x - 12, baseY - 268 * s, 60, 16);
      ctx.beginPath(); ctx.moveTo(x - 8, baseY - 330 * s); ctx.lineTo(x + 18, baseY - 408 * s); ctx.lineTo(x + 44, baseY - 330 * s); ctx.fill();
    });
    /* lit windows */
    ctx.fillStyle = win;
    for (var i = 0; i < 7; i++){
      var wx = 150 + i * 130;
      ctx.beginPath(); ctx.arc(wx, baseY + 58, 15, Math.PI, 0); ctx.fill();
      ctx.fillRect(wx - 15, baseY + 58, 30, 40);
    }
    ctx.beginPath(); ctx.arc(W / 2, baseY + 26, 24, Math.PI, 0); ctx.fill();
    ctx.fillRect(W / 2 - 24, baseY + 26, 48, 62);
  }
  function divider(cx, y, color){
    ctx.strokeStyle = color; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx - 300, y); ctx.lineTo(cx - 42, y); ctx.moveTo(cx + 42, y); ctx.lineTo(cx + 300, y); ctx.stroke();
    ctx.save(); ctx.translate(cx, y); ctx.rotate(Math.PI / 4);
    ctx.fillStyle = color; ctx.fillRect(-15, -15, 30, 30); ctx.restore();
    star4(cx - 330, y, 11, color); star4(cx + 330, y, 11, color);
  }
  function txt(str, x, y, font, color, align){
    ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align || "center"; ctx.textBaseline = "middle";
    ctx.fillText(str, x, y);
  }
  function fitUrdu(lines, base, fontFn){
    var size = base;
    ctx.textAlign = "center";
    while (size > 30){
      ctx.font = fontFn(size);
      var ok = true;
      for (var i = 0; i < lines.length; i++) if (ctx.measureText(lines[i]).width > W - 190) { ok = false; break; }
      if (ok) break;
      size -= 3;
    }
    return size;
  }
  function printedUrduFont(size){ return "700 " + size + "px 'Noto Nastaliq Urdu','Jameel Noori Nastaleeq',serif"; }
  /* Handwriting style: AlQalam Tehreeri for Urdu (self-hosted woff2 —
     Mazeen's pick, 2026-11-19: thin pencil-like hand, full Urdu letters),
     Caveat for Latin. Loaded lazily, only when the style is picked. */
  var handLoaded = false;
  function ensureHandFonts(cb){
    if (!handLoaded){
      handLoaded = true;
      var l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap";
      try {
        var ff = new FontFace("AlQalam Tehreeri", "url(/assets/fonts/tehreeri.woff2)", { weight: "400", style: "normal" });
        document.fonts.add(ff);
        ff.load();
      } catch (e) {}
      document.head.appendChild(l);
    }
    if (document.fonts && document.fonts.load){
      Promise.all([
        document.fonts.load("54px 'AlQalam Tehreeri'", "عید مبارک"),
        document.fonts.load("700 42px Caveat", "Ahmed Khan")
      ]).then(function(){ if (cb) cb(); }, function(){ if (cb) cb(); });
    } else if (cb) cb();
  }
  function isUrdu(s){ return /[\u0600-\u06FF]/.test(s || ""); }
  function handMode(){ var n = document.getElementById("e-script"); return !!(n && n.value === "hand"); }
  function spacing(v){ try { ctx.letterSpacing = v; } catch (e) {} }

  /* ---------- designs ---------- */
  var DESIGNS = [
    { id: "chaand", name: "Chaand Raat Classic", sw: "linear-gradient(135deg,#0b3d2e,#14604a)",
      bg: "#0b3d2e", main: "#f4d47c", soft: "#ffe9a8", body: "#fdf6dd", accent: "#e8b64c",
      draw: function(){
        var g = ctx.createRadialGradient(W / 2, 520, 120, W / 2, 520, 980);
        g.addColorStop(0, "#14523a"); g.addColorStop(1, "#07271c");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        glow(W / 2, 226, 300, "rgba(244,212,124,.20)");
        starField(46, "#ffe9a8", 1050);
        frame(this.accent, this.main);
        medallion(W / 2, 218, 116, this.accent);
        crescent(W / 2, 218, 74, this.main, this.bg);
        star4(W / 2 + 62, 158, 21, this.main);
      } },
    { id: "gulab", name: "Gulab Wala", sw: "linear-gradient(135deg,#5e1224,#8e1f3a)",
      bg: "#5e1224", main: "#f7cf7d", soft: "#ffe1a8", body: "#fdeeda", accent: "#e8b64c",
      draw: function(){
        var g = ctx.createRadialGradient(W / 2, 470, 120, W / 2, 470, 980);
        g.addColorStop(0, "#771b31"); g.addColorStop(1, "#400a19");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        glow(W / 2, 214, 280, "rgba(255,190,120,.16)");
        frame(this.accent, this.main);
        [[96, 96], [W - 96, 96], [96, H - 96], [W - 96, H - 96]].forEach(function(p){
          rose(p[0], p[1], 44, "#d94f6a", "#8e1f3a");
          leaf(p[0] + (p[0] < W / 2 ? 52 : -52), p[1] + (p[1] < H / 2 ? 26 : -26), 26, "#2e7d4f");
        });
        crescent(W / 2, 208, 60, this.main, this.bg);
        star4(W / 2 + 50, 158, 17, this.main);
      } },
    { id: "rangeen", name: "Rangeen 90s", sw: "linear-gradient(135deg,#0e5a63,#e2543e)",
      bg: "#0e5a63", main: "#ffd94d", soft: "#ffb3c8", body: "#ffffff", accent: "#ff7a59",
      draw: function(){
        ctx.fillStyle = this.bg; ctx.fillRect(0, 0, W, H);
        ctx.save(); ctx.translate(W / 2, 120);
        for (var i = 0; i < 24; i++){
          ctx.fillStyle = i % 2 ? "rgba(255,217,77,.13)" : "rgba(255,122,89,.13)";
          ctx.beginPath(); ctx.moveTo(0, 0);
          var a1 = i * Math.PI / 12, a2 = a1 + Math.PI / 12;
          ctx.lineTo(Math.cos(a1) * 1250, Math.sin(a1) * 1250); ctx.lineTo(Math.cos(a2) * 1250, Math.sin(a2) * 1250);
          ctx.fill();
        }
        ctx.restore();
        glow(W / 2, 120, 540, "rgba(255,217,77,.15)");
        starField(30, "#ffffff", 900);
        frame("#ffd94d", "#ffffff");
        crescent(W / 2, 208, 62, "#ffd94d", this.bg);
        star4(W / 2 + 52, 160, 18, "#ffb3c8");
      } },
    { id: "masjid", name: "Masjid-e-Noor", sw: "linear-gradient(135deg,#0d1b3e,#27407c)",
      bg: "#0d1b3e", main: "#f4d47c", soft: "#cfe0ff", body: "#eef3ff", accent: "#8fb0ff",
      draw: function(){
        var g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, "#0d1b3e"); g.addColorStop(1, "#1d3263");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        glow(168, 168, 250, "rgba(244,212,124,.22)");
        starField(60, "#ffffff", 760);
        crescent(168, 168, 56, this.main, "#0d1b3e");
        star4(212, 128, 16, this.main);
        mosque(H - 190, "#081230", "#ffd94d", 0.82);
      } },
    { id: "vintage", name: "Vintage Cream", sw: "linear-gradient(135deg,#f6ecd7,#e8d9b0)",
      bg: "#f6ecd7", main: "#0b5a3c", soft: "#8a6d1f", body: "#274435", accent: "#b8912f",
      draw: function(){
        var g = ctx.createRadialGradient(W / 2, 620, 140, W / 2, 620, 1020);
        g.addColorStop(0, "#fbf2dd"); g.addColorStop(1, "#ead9ab");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        frame(this.main, this.accent);
        ctx.strokeStyle = this.accent; ctx.lineWidth = 2; ctx.strokeRect(70, 70, W - 140, H - 140);
        /* stitched inner line — like the printed cards of the era */
        ctx.save(); ctx.strokeStyle = this.accent; ctx.lineWidth = 3; ctx.lineCap = "round";
        ctx.setLineDash([1, 12]); ctx.strokeRect(90, 90, W - 180, H - 180); ctx.restore();
        medallion(W / 2, 208, 104, this.accent);
        crescent(W / 2, 208, 58, this.main, this.bg);
        star4(W / 2 + 48, 162, 16, this.accent);
      } }
  ];

  /* ---------- state + render ---------- */
  function $(id){ return document.getElementById(id); }
  var state = { design: 0 };
  /* Screen-reader announcements (audit fix, 2026-11-20): download/share
     outcomes are written into this persistent live region. */
  var esEl = $("e-status");
  if (esEl){ if (!esEl.hasAttribute("role")) esEl.setAttribute("role", "status"); if (!esEl.hasAttribute("aria-live")) esEl.setAttribute("aria-live", "polite"); }
  var box = $("e-designs");
  DESIGNS.forEach(function(d, i){
    var b = document.createElement("button");
    b.type = "button"; b.className = "eid-swatch" + (i === 0 ? " on" : "");
    var sw = document.createElement("span"); sw.className = "eid-sw"; sw.style.background = d.sw;
    var nm = document.createElement("span"); nm.className = "eid-nm"; nm.textContent = d.name;
    b.appendChild(sw); b.appendChild(nm);
    b.addEventListener("click", function(){
      state.design = i;
      box.querySelectorAll(".eid-swatch").forEach(function(x){ x.classList.remove("on"); });
      b.classList.add("on"); draw();
    });
    box.appendChild(b);
  });

  /* "Mera dost" versions of the two gendered shers (Mazeen, 2026-11-24:
     the cake sher only had "meri dost" — a boy's version must exist too) */
  var DOST_MERA = {
    0: ["ڈبے میں ڈبہ، ڈبے میں کیک", "میرا دوست لاکھوں میں ایک"],
    3: ["عید آئی ہے زمانے میں", "میرا دوست گر گیا غسل خانے میں"]
  };
  function currentLines(){
    var sel = $("e-shayari").value;
    if (sel === "custom"){
      var t = $("e-msg").value.replace(/\s+\n/g, "\n").trim();
      return t ? t.split("\n").slice(0, 4) : ["عید مبارک"];
    }
    var idx = parseInt(sel, 10);
    var dn = $("e-dost");
    if (dn && dn.value === "mera" && DOST_MERA[idx]) return DOST_MERA[idx];
    return SHAYARI[idx] || SHAYARI[0];
  }

  function draw(){
    var d = DESIGNS[state.design];
    var type = TYPES[$("e-type").value] || TYPES.fitr;
    var isMasjid = d.id === "masjid";
    ctx.save();
    d.draw();
    /* greeting — foil-gold with a soft print shadow, like the era's cards */
    spacing("10px");
    ctx.save();
    ctx.font = "700 96px Georgia,'Times New Roman',serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,.35)"; ctx.shadowBlur = 5; ctx.shadowOffsetY = 3;
    if (d.id === "vintage") ctx.fillStyle = d.main;
    else {
      var fg = ctx.createLinearGradient(0, 366, 0, 464);
      fg.addColorStop(0, "#fff6cf"); fg.addColorStop(.45, d.main); fg.addColorStop(.58, d.main); fg.addColorStop(1, "#a87b1e");
      ctx.fillStyle = fg;
    }
    ctx.fillText("EID MUBARAK", W / 2, 415);
    ctx.restore();
    spacing("0px");
    var us = fitUrdu(["عید مبارک"], 80, printedUrduFont);
    txt("عید مبارک", W / 2, 578, printedUrduFont(us), d.soft);
    spacing("6px");
    txt(type.latin, W / 2, 668, "600 33px Georgia,serif", d.accent);
    spacing("0px");
    divider(W / 2, 716, d.accent);
    /* shayari / message */
    var lines = currentLines();
    var urdu = isUrdu(lines[0] || "");
    var fontFn = function(size){
      if (urdu) return handMode() ? "400 " + size + "px 'AlQalam Tehreeri','Noto Nastaliq Urdu',serif" : "600 " + size + "px 'Noto Nastaliq Urdu','Jameel Noori Nastaleeq',serif";
      return handMode() ? "700 " + size + "px 'Caveat',cursive" : "italic 600 " + size + "px Georgia,serif";
    };
    var ss = fitUrdu(lines, urdu && handMode() ? 60 : 54, fontFn);
    ctx.font = fontFn(ss);
    ctx.fillStyle = d.body; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    var y0 = lines.length > 1 ? 828 : 862;
    lines.forEach(function(ln, i){ ctx.fillText(ln, W / 2, y0 + i * 96); });
    /* recipient */
    var to = $("e-to").value.trim();
    if (to){
      spacing("4px");
      txt("WITH LOVE FOR", W / 2, isMasjid ? 985 : 1030, "600 28px Georgia,serif", d.accent);
      spacing("0px");
      txt(to, W / 2, isMasjid ? 1045 : 1092, handMode() ? (isUrdu(to) ? "400 62px 'AlQalam Tehreeri','Noto Nastaliq Urdu',serif" : "700 62px 'Caveat','AlQalam Tehreeri',cursive") : "700 58px Georgia,'Noto Nastaliq Urdu',serif", d.main);
    }
    /* sender — on Masjid-e-Noor it sits in gold on the dark mosque band.
       Urdu naam: the WHOLE line in Urdu, one font ("نام کی طرف سے") —
       the old mixed line (Urdu naam + Latin "ki taraf se") sat in two
       halves at two heights (Mazeen's review, 2026-11-24). */
    var from = $("e-from").value.trim();
    if (from){
      var sy = isMasjid ? 1288 : 1180, scol = isMasjid ? "#ffd94d" : d.soft;
      if (isUrdu(from)) txt(from + " کی طرف سے", W / 2, sy, handMode() ? "400 54px 'AlQalam Tehreeri','Noto Nastaliq Urdu',serif" : printedUrduFont(48), scol);
      else txt("— " + from + " ki taraf se", W / 2, sy, handMode() ? "700 47px 'Caveat',cursive" : "italic 600 42px Georgia,serif", scol);
    }
    /* brand — inside the frame on framed designs; Vintage Cream has a
       third inner rule at H-70, so its brand line sits higher (it used to
       be struck through by that rule) */
    ctx.globalAlpha = isMasjid ? 0.85 : 0.66;
    txt("paktoolkit.top", W / 2, isMasjid ? 1330 : (d.id === "vintage" ? 1244 : 1272), "600 25px Georgia,serif", isMasjid ? "#cfe0ff" : d.accent);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  ["e-type", "e-shayari", "e-dost", "e-to", "e-from", "e-msg", "e-script"].forEach(function(id){
    var n = $(id); if (!n) return;
    n.addEventListener("input", function(){
      if (id === "e-shayari") $("e-msg-wrap").style.display = (n.value === "custom") ? "" : "none";
      if (id === "e-script" && n.value === "hand") ensureHandFonts(draw);
      draw();
    });
    n.addEventListener("change", draw);
  });

  $("e-download").addEventListener("click", function(){
    var name = "eid-card-" + DESIGNS[state.design].id + ".png";
    function done(href){
      var a = document.createElement("a"); a.href = href; a.download = name; a.click();
      $("e-status").textContent = "Card download ho gaya ✓ — WhatsApp par share kar dein.";
    }
    if (cv.toBlob) cv.toBlob(function(b){ b ? done(URL.createObjectURL(b)) : done(cv.toDataURL("image/png")); }, "image/png");
    else done(cv.toDataURL("image/png"));
  });

  $("e-share").addEventListener("click", function(){
    var from = $("e-from").value.trim();
    var text = "Eid Mubarak! 🌙" + (from ? " — " + from + " ki taraf se" : "") + " (Card banaya: paktoolkit.top/eid-card-maker/)";
    function waFallback(){
      window.open("https://wa.me/?text=" + encodeURIComponent(text), "_blank");
      $("e-status").textContent = "WhatsApp khul gaya hai — pehle card download karke wahan attach kar dein.";
    }
    if (navigator.share && cv.toBlob){
      cv.toBlob(function(b){
        if (!b) { waFallback(); return; }
        var file = new File([b], "eid-card.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })){
          navigator.share({ files: [file], text: text }).catch(function(){});
        } else waFallback();
      }, "image/png");
    } else waFallback();
  });

  /* ---------- shareable card link + guest view ----------
     The whole card travels inside the link (?d= payload), exactly like
     the wedding maker: nothing is uploaded. A guest who taps the link
     on WhatsApp finds a sealed lifafa; one tap opens it — the same
     card, with a burst of stars — plus a road back to making their own. */
  function encObj(o){
    return btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function decObj(s){
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    return JSON.parse(decodeURIComponent(escape(atob(s))));
  }
  function buildPayload(){
    var sel = $("e-shayari").value;
    var dn = $("e-dost");
    var p = { v: 1, d: state.design, t: $("e-type").value, m: $("e-script").value,
              g: dn ? dn.value : "meri",
              to: $("e-to").value.trim(), from: $("e-from").value.trim(), s: sel };
    if (sel === "custom") p.c = currentLines();
    return p;
  }
  var linkBtn = $("e-link");
  if (linkBtn) linkBtn.addEventListener("click", function(){
    var url = location.origin + location.pathname + "?d=" + encObj(buildPayload());
    var box2 = $("e-linkresult");
    box2.style.display = "";
    box2.textContent = "";
    var head = document.createElement("p");
    head.textContent = "Aap ke card ka link tayyar hai — copy karke kahin bhi bhejein. Jo bhi is par tap karega, use wahi card khulta hua milega:";
    var code = document.createElement("p");
    code.style.cssText = "word-break:break-all;font-size:.92em;background:#f4f1e6;border:1px dashed #b8912f;border-radius:8px;padding:8px";
    code.textContent = url;
    var wa = document.createElement("a");
    wa.className = "btn"; wa.target = "_blank"; wa.rel = "noopener";
    wa.href = "https://wa.me/?text=" + encodeURIComponent("Eid Mubarak! 🌙 Aap ke liye aik Eid card bheja hai — tap karke kholein: " + url);
    wa.textContent = "💬 Yeh link WhatsApp par bhejein";
    box2.appendChild(head); box2.appendChild(code); box2.appendChild(wa);
    $("e-status").textContent = "Link tayyar hai ✓";
  });

  function burst(){
    var fx = $("e-fx"); if (!fx) return;
    var fctx = fx.getContext("2d");
    fx.style.display = "";
    var parts = [];
    for (var i = 0; i < 110; i++){
      var a = Math.random() * Math.PI * 2, sp = 2 + Math.random() * 7;
      parts.push({ x: W / 2, y: 430, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 3.2,
                   r: 4 + Math.random() * 9, rot: Math.random() * 3,
                   c: ["#ffd94d", "#ffffff", "#ffb3c8", "#ffe9a8"][i % 4], life: 1 });
    }
    var t0 = null;
    function tick(ts){
      if (!t0) t0 = ts;
      var t = (ts - t0) / 1000;
      fctx.clearRect(0, 0, W, H);
      var alive = false;
      parts.forEach(function(pt){
        pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.09; pt.life = 1 - t / 1.5;
        if (pt.life <= 0) return;
        alive = true;
        fctx.save(); fctx.globalAlpha = Math.max(pt.life, 0);
        fctx.translate(pt.x, pt.y); fctx.rotate(pt.rot + t * 2);
        fctx.fillStyle = pt.c;
        var r = pt.r;
        fctx.beginPath();
        fctx.moveTo(0, -r); fctx.quadraticCurveTo(0, 0, r, 0); fctx.quadraticCurveTo(0, 0, 0, r);
        fctx.quadraticCurveTo(0, 0, -r, 0); fctx.quadraticCurveTo(0, 0, 0, -r); fctx.fill();
        fctx.restore();
      });
      if (alive && t < 1.6) requestAnimationFrame(tick);
      else { fctx.clearRect(0, 0, W, H); fx.style.display = "none"; }
    }
    requestAnimationFrame(tick);
  }

  var guestParam = null;
  try { guestParam = new URLSearchParams(location.search).get("d"); } catch (e) {}
  if (guestParam){
    try {
      var p = decObj(guestParam);
      if (p && p.v === 1){
        state.design = Math.min(Math.max(parseInt(p.d, 10) || 0, 0), DESIGNS.length - 1);
        box.querySelectorAll(".eid-swatch").forEach(function(x, i){ x.classList.toggle("on", i === state.design); });
        $("e-type").value = p.t === "adha" ? "adha" : "fitr";
        $("e-script").value = p.m === "hand" ? "hand" : "printed";
        var dn2 = $("e-dost");
        if (dn2 && p.g) dn2.value = p.g === "mera" ? "mera" : "meri";
        if (p.s === "custom"){ $("e-shayari").value = "custom"; $("e-msg-wrap").style.display = ""; $("e-msg").value = (p.c || []).join("\n"); }
        else $("e-shayari").value = String(parseInt(p.s, 10) || 0);
        $("e-to").value = p.to || "";
        $("e-from").value = p.from || "";
        var wrap = $("e-cardwrap"), guest = $("e-guest");
        if (wrap && guest){
          var uiRoot = wrap.parentElement;
          Array.prototype.forEach.call(uiRoot.children, function(el){
            if (el !== guest && el !== wrap && el.id !== "e-status") el.style.display = "none";
          });
          wrap.style.display = "none";
          guest.style.display = "";
          $("e-guest-from").textContent = p.from
            ? (isUrdu(p.from) ? p.from + " کی طرف سے آپ کے لیے ایک عید کارڈ آیا ہے" : p.from + " ki taraf se aap ke liye aik Eid card aya hai")
            : "Aap ke liye aik Eid card aya hai";
          var opened = false;
          var openIt = function(){
            if (opened) return; opened = true;
            $("e-env").style.display = "none";
            $("e-open").style.display = "none";
            wrap.style.display = "";
            wrap.style.opacity = "0"; wrap.style.transform = "scale(.94)";
            requestAnimationFrame(function(){
              wrap.style.transition = "opacity .45s ease, transform .45s ease";
              wrap.style.opacity = "1"; wrap.style.transform = "scale(1)";
            });
            $("e-guest-actions").style.display = "";
            burst();
          };
          $("e-open").addEventListener("click", openIt);
          $("e-env").addEventListener("click", openIt);
          $("e-gdownload").addEventListener("click", function(){ $("e-download").click(); });
        }
        if (p.m === "hand") ensureHandFonts(draw); else draw();
      }
    } catch (e) { /* a broken link simply shows the normal maker */ }
  }

  draw();
}

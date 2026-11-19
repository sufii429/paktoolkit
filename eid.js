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
      ctx.globalAlpha = 0.35 + rnd() * 0.6; star4(x, y, r, color);
    }
    ctx.globalAlpha = 1;
  }
  function crescent(x, y, r, color, cut){
    ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
    ctx.fillStyle = cut; ctx.beginPath(); ctx.arc(x + r * 0.42, y - r * 0.22, r * 0.82, 0, 7); ctx.fill();
  }
  function frame(c1, c2){
    ctx.strokeStyle = c1; ctx.lineWidth = 6; ctx.strokeRect(34, 34, W - 68, H - 68);
    ctx.strokeStyle = c2; ctx.lineWidth = 2; ctx.strokeRect(52, 52, W - 104, H - 104);
    [[34, 34], [W - 34, 34], [34, H - 34], [W - 34, H - 34]].forEach(function(p){ star4(p[0], p[1], 15, c1); });
  }
  function rose(x, y, r, petal, deep){
    ctx.fillStyle = petal;
    for (var i = 0; i < 6; i++){
      var a = i * Math.PI / 3;
      ctx.beginPath(); ctx.arc(x + Math.cos(a) * r * 0.52, y + Math.sin(a) * r * 0.52, r * 0.5, 0, 7); ctx.fill();
    }
    ctx.fillStyle = deep; ctx.beginPath(); ctx.arc(x, y, r * 0.42, 0, 7); ctx.fill();
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
    /* main dome */
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(W / 2, baseY, 185 * s, Math.PI, 0); ctx.fill();
    ctx.fillRect(W / 2 - 14, baseY - 245 * s, 28, 62 * s);
    star4(W / 2, baseY - 268 * s, 20, win);
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
        ctx.fillStyle = this.bg; ctx.fillRect(0, 0, W, H);
        starField(46, "#ffe9a8", 1050);
        frame(this.accent, this.main);
        crescent(W / 2, 218, 74, this.main, this.bg);
        star4(W / 2 + 62, 158, 21, this.main);
      } },
    { id: "gulab", name: "Gulab Wala", sw: "linear-gradient(135deg,#5e1224,#8e1f3a)",
      bg: "#5e1224", main: "#f7cf7d", soft: "#ffe1a8", body: "#fdeeda", accent: "#e8b64c",
      draw: function(){
        ctx.fillStyle = this.bg; ctx.fillRect(0, 0, W, H);
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
        starField(60, "#ffffff", 760);
        crescent(168, 168, 56, this.main, "#0d1b3e");
        star4(212, 128, 16, this.main);
        mosque(H - 190, "#081230", "#ffd94d", 0.82);
      } },
    { id: "vintage", name: "Vintage Cream", sw: "linear-gradient(135deg,#f6ecd7,#e8d9b0)",
      bg: "#f6ecd7", main: "#0b5a3c", soft: "#8a6d1f", body: "#274435", accent: "#b8912f",
      draw: function(){
        ctx.fillStyle = this.bg; ctx.fillRect(0, 0, W, H);
        frame(this.main, this.accent);
        ctx.strokeStyle = this.accent; ctx.lineWidth = 2; ctx.strokeRect(70, 70, W - 140, H - 140);
        crescent(W / 2, 208, 58, this.main, this.bg);
        star4(W / 2 + 48, 162, 16, this.accent);
      } }
  ];

  /* ---------- state + render ---------- */
  function $(id){ return document.getElementById(id); }
  var state = { design: 0 };
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

  function currentLines(){
    var sel = $("e-shayari").value;
    if (sel === "custom"){
      var t = $("e-msg").value.replace(/\s+\n/g, "\n").trim();
      return t ? t.split("\n").slice(0, 4) : ["عید مبارک"];
    }
    return SHAYARI[parseInt(sel, 10)] || SHAYARI[0];
  }

  function draw(){
    var d = DESIGNS[state.design];
    var type = TYPES[$("e-type").value] || TYPES.fitr;
    var isMasjid = d.id === "masjid";
    ctx.save();
    d.draw();
    /* greeting */
    spacing("10px");
    txt("EID MUBARAK", W / 2, 415, "700 96px Georgia,'Times New Roman',serif", d.main);
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
    /* sender — on Masjid-e-Noor it sits in gold on the dark mosque band */
    var from = $("e-from").value.trim();
    if (from) txt("— " + from + " ki taraf se", W / 2, isMasjid ? 1288 : 1180, handMode() ? "700 47px 'Caveat','AlQalam Tehreeri',cursive" : "italic 600 42px Georgia,serif", isMasjid ? "#ffd94d" : d.soft);
    /* brand — inside the frame on framed designs */
    ctx.globalAlpha = 0.66;
    txt("paktoolkit.top", W / 2, isMasjid ? 1330 : 1272, "600 25px Georgia,serif", d.accent);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  ["e-type", "e-shayari", "e-to", "e-from", "e-msg", "e-script"].forEach(function(id){
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

  draw();
}

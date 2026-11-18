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
    ["یاروں کی محفل ہو تو ہر دن عید لگتا ہے", "تم ساتھ ہو تو چاند بھی شرما کے چھپتا ہے"],
    ["پردیس میں عید آئی، اپنوں کی یاد لائی", "دل نے کہا چپکے سے، عید مبارک ہو بھائی"],
    ["ماں کے ہاتھ کی سویاں، عید کی اصل پہچان", "جہاں ماں کی دعا ہو، وہاں ہر دن عید کا دن"],
    ["چاند نے کہا رات سے، عید کا دن آ گیا", "ہر اداس چہرے پر، مسکان کا رنگ آ گیا"],
    ["چاند رات گئی، عید آ گئی", "عیدی کی لائن میں، ہماری باری آ گئی"],
    ["عید پر سویاں، ہر گھر کی شان", "کھا کھا کر مہمان، ہو گئے پریشان"],
    ["نئے کپڑے پہنے، آئینہ بھی مسکرایا", "عید مبارک ہو سب کو، چاند بھی شرمایا"],
    ["عید کا چاند دیکھا، جیب کو بھی دیکھا", "عیدی ملی اتنی، کہ دل نے شکر ادا کیا"]
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
  function mosque(baseY, color, win){
    ctx.fillStyle = color;
    ctx.fillRect(0, baseY, W, H - baseY);
    /* side domes */
    [-40, W - 190].forEach(function(x){
      ctx.beginPath(); ctx.arc(x + 115, baseY, 115, Math.PI, 0); ctx.fill();
      ctx.fillRect(x + 103, baseY - 52, 24, 52);
      star4(x + 115, baseY - 66, 13, win);
    });
    /* main dome */
    ctx.beginPath(); ctx.arc(W / 2, baseY, 185, Math.PI, 0); ctx.fill();
    ctx.fillRect(W / 2 - 14, baseY - 245, 28, 62);
    star4(W / 2, baseY - 268, 20, win);
    /* minarets */
    [92, W - 128].forEach(function(x){
      ctx.fillRect(x, baseY - 330, 36, 330);
      ctx.fillRect(x - 12, baseY - 268, 60, 16);
      ctx.beginPath(); ctx.moveTo(x - 8, baseY - 330); ctx.lineTo(x + 18, baseY - 408); ctx.lineTo(x + 44, baseY - 330); ctx.fill();
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
  function fitUrdu(lines, base){
    var size = base;
    ctx.textAlign = "center";
    while (size > 30){
      ctx.font = "600 " + size + "px 'Noto Nastaliq Urdu','Jameel Noori Nastaleeq',serif";
      var ok = true;
      for (var i = 0; i < lines.length; i++) if (ctx.measureText(lines[i]).width > W - 190) { ok = false; break; }
      if (ok) break;
      size -= 3;
    }
    return size;
  }
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
        ctx.strokeStyle = this.accent; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(190, 470); ctx.quadraticCurveTo(W / 2, 330, W - 190, 470); ctx.stroke();
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
        mosque(H - 218, "#081230", "#ffd94d");
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
    ctx.save();
    d.draw();
    /* greeting */
    spacing("10px");
    txt("EID MUBARAK", W / 2, 428, "700 96px Georgia,'Times New Roman',serif", d.main);
    spacing("0px");
    var us = fitUrdu(["عید مبارک"], 88);
    txt("عید مبارک", W / 2, 545, "700 " + us + "px 'Noto Nastaliq Urdu','Jameel Noori Nastaleeq',serif", d.soft);
    spacing("6px");
    txt(type.latin, W / 2, 636, "600 33px Georgia,serif", d.accent);
    spacing("0px");
    divider(W / 2, 692, d.accent);
    /* shayari / message */
    var lines = currentLines();
    var ss = fitUrdu(lines, 54);
    ctx.font = "600 " + ss + "px 'Noto Nastaliq Urdu','Jameel Noori Nastaleeq',serif";
    ctx.fillStyle = d.body; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    var y0 = lines.length > 1 ? 800 : 838;
    lines.forEach(function(ln, i){ ctx.fillText(ln, W / 2, y0 + i * 96); });
    /* recipient */
    var to = $("e-to").value.trim();
    if (to){
      spacing("4px");
      txt("WITH LOVE FOR", W / 2, 1006, "600 28px Georgia,serif", d.accent);
      spacing("0px");
      txt(to, W / 2, 1072, "700 58px Georgia,'Noto Nastaliq Urdu',serif", d.main);
    }
    /* sender */
    var from = $("e-from").value.trim();
    if (from) txt("— " + from + " ki taraf se", W / 2, 1180, "italic 600 42px Georgia,serif", d.soft);
    /* brand */
    ctx.globalAlpha = 0.66;
    txt("paktoolkit.top", W / 2, 1296, "600 25px Georgia,serif", d.accent);
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  ["e-type", "e-shayari", "e-to", "e-from", "e-msg"].forEach(function(id){
    var n = $(id); if (!n) return;
    n.addEventListener("input", function(){
      if (id === "e-shayari") $("e-msg-wrap").style.display = (n.value === "custom") ? "" : "none";
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

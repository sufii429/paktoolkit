"use strict";
/* ============ CONFIG — rates live here, edit in ONE place ============ */
/* Bijli: base tariff per S.R.O. 279(I)/2026 (NEPRA tariff kept unchanged for
   calendar 2026). Progressive slabs, Rs per unit. Rates are also editable
   in the on-page rates table — that is deliberate, as upper-slab figures
   can vary slightly between DISCO publications. */
var BIJLI_CONFIG = {
  gstPercent: 18,
  categories: {
    nonprotected: { label: "Non-protected", slabs: [
      {upTo:100, rate:22.44},{upTo:200, rate:28.91},{upTo:300, rate:33.10},
      {upTo:400, rate:37.99},{upTo:500, rate:40.20},{upTo:600, rate:41.62},
      {upTo:700, rate:42.76},{upTo:null, rate:47.69} ]},
    protected: { label: "Protected", slabs: [
      {upTo:100, rate:10.54},{upTo:200, rate:13.01} ]},
    lifeline: { label: "Lifeline", slabs: [
      {upTo:50, rate:3.95},{upTo:100, rate:7.74} ]}
  }
};
/* Salary tax: Finance Act 2025 slabs for tax year 2025-26 (verified).
   Section 4AB surcharge: +9% on the tax when annual income exceeds Rs 10,000,000. */
var TAX_CONFIG = {
  slabs: [
    {upTo:600000,    base:0,      rate:0,    over:0},
    {upTo:1200000,   base:0,      rate:0.01, over:600000},
    {upTo:2200000,   base:6000,   rate:0.11, over:1200000},
    {upTo:3200000,   base:116000, rate:0.23, over:2200000},
    {upTo:4100000,   base:346000, rate:0.30, over:3200000},
    {upTo:null,      base:616000, rate:0.35, over:4100000}
  ],
  surchargeThreshold: 10000000, surchargeRate: 0.09
};
/* Zakat: Government-notified nisab for 1447 AH (Ramadan 2026): Rs 503,529,
   based on 52.5 tola silver (notified Feb 2026 to SBP). Editable on page. */
var ZAKAT_CONFIG = { nisab: 503529, rate: 0.025 };
var MARLA_SQFT = 272.25; /* 1 Marla = 272.25 sq ft; 1 Kanal = 20 Marla; 1 Acre = 8 Kanal */

/* ============ helpers (no HTML-string injection anywhere — textContent only) ============ */
function $(id){ return document.getElementById(id); }
function num(id){ var v = parseFloat($(id).value); return isNaN(v) ? 0 : v; }
function fmt(n){ return "Rs " + Math.round(n).toLocaleString("en-PK"); }
function fmtN(n, d){ return n.toLocaleString("en-PK",{maximumFractionDigits:(d==null?2:d)}); }
function el(tag, text){ var e = document.createElement(tag); if(text != null) e.textContent = text; return e; }
function makeTable(container, headers, rows){
  /* NOTE: does NOT clear the container — callers clear first, so a headline
     appended before the table (e.g. exact age) survives. */
  var t = el("table"), thead = el("thead"), tr = el("tr");
  headers.forEach(function(h){ tr.appendChild(el("th", h)); });
  thead.appendChild(tr); t.appendChild(thead);
  var tb = el("tbody");
  rows.forEach(function(r){ var row = el("tr"); r.forEach(function(c){ row.appendChild(el("td", String(c))); }); tb.appendChild(row); });
  t.appendChild(tb); container.appendChild(t);
}
function loadScript(src){
  return new Promise(function(res, rej){
    var s = document.createElement("script"); s.src = src;
    s.onload = res; s.onerror = function(){ rej(new Error("load failed")); };
    document.head.appendChild(s);
  });
}
var PDFLIB_URL = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";
var PDFJS_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js";
var PDFJS_WORKER = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
function loadPdfLib(){
  if (window.PDFLib) return Promise.resolve(window.PDFLib);
  return loadScript(PDFLIB_URL).then(function(){ return window.PDFLib; });
}
function download(url, name){ var a = el("a"); a.href = url; a.download = name; a.textContent = "Download: " + name; a.className = "dl"; return a; }
function fileToImage(file){
  return new Promise(function(res, rej){
    var img = new Image();
    img.onload = function(){ res(img); };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}
/* Home live search */
document.addEventListener("DOMContentLoaded", function(){
  var search = $("toolSearch");
  if (search) search.addEventListener("input", function(){
    var q = search.value.trim().toLowerCase();
    document.querySelectorAll(".tool-card").forEach(function(c){
      c.style.display = (!q || c.getAttribute("data-search").toLowerCase().indexOf(q) >= 0) ? "" : "none";
    });
    document.querySelectorAll(".cat-section").forEach(function(s){
      var any = false;
      s.querySelectorAll(".tool-card").forEach(function(c){ if (c.style.display !== "none") any = true; });
      s.style.display = any ? "" : "none";
    });
  });
});

/* ============ 1. Bijli Bill ============ */
function bijliSlabsFor(units, category){
  /* Returns {slabs, note} applying protected/lifeline fallback rules. */
  if (category === "protected" && units > 200)
    return { slabs: BIJLI_CONFIG.categories.nonprotected.slabs,
             note: "Protected status is lost above 200 units, so all units are calculated on the non-protected tariff." };
  if (category === "lifeline" && units > 100)
    return { slabs: (units > 200 ? BIJLI_CONFIG.categories.nonprotected.slabs : BIJLI_CONFIG.categories.protected.slabs),
             note: "Lifeline tariff no longer applies above 100 units, so the " + (units > 200 ? "non-protected" : "protected") + " tariff is used instead." };
  return { slabs: BIJLI_CONFIG.categories[category].slabs, note: "" };
}
function computeBijli(units, category, gstPct, extraPerUnit, rateOverrides){
  var pick = bijliSlabsFor(units, category), rows = [], prev = 0, base = 0;
  pick.slabs.forEach(function(s, i){
    var top = (s.upTo == null ? units : Math.min(units, s.upTo));
    var u = Math.max(0, top - prev);
    var rate = (rateOverrides && rateOverrides[i] != null && !isNaN(rateOverrides[i])) ? rateOverrides[i] : s.rate;
    if (u > 0) { rows.push([ (prev+1) + "–" + (s.upTo == null ? "above" : s.upTo), u, fmtN(rate), fmtN(u * rate) ]); base += u * rate; }
    prev = (s.upTo == null ? units : s.upTo);
  });
  var extra = units * extraPerUnit;
  var subtotal = base + extra;
  var gst = subtotal * gstPct / 100;
  return { rows: rows, base: base, extra: extra, gst: gst, total: subtotal + gst, note: pick.note };
}
function renderBijliRates(){
  var cat = $("b-cat").value, box = $("b-rates"); if (!box) return;
  box.textContent = "";
  var t = el("table"), tb = el("tbody");
  var hr = el("tr"); hr.appendChild(el("th","Slab (units)")); hr.appendChild(el("th","Rate (Rs/unit — editable)")); tb.appendChild(hr);
  var prev = 0;
  BIJLI_CONFIG.categories[cat].slabs.forEach(function(s, i){
    var tr = el("tr");
    tr.appendChild(el("td", (prev+1) + " – " + (s.upTo == null ? "above" : s.upTo)));
    var td = el("td"), inp = el("input"); inp.type = "number"; inp.step = "0.01"; inp.min = "0";
    inp.value = s.rate; inp.className = "rate-input"; inp.id = "b-rate-" + i;
    td.appendChild(inp); tr.appendChild(td); tb.appendChild(tr);
    prev = (s.upTo == null ? prev : s.upTo);
  });
  t.appendChild(tb); box.appendChild(t);
}
function initBijli(){
  if (!$("b-calc")) return;
  renderBijliRates();
  $("b-cat").addEventListener("change", renderBijliRates);
  $("b-calc").addEventListener("click", function(){
    var units = num("b-units"), cat = $("b-cat").value;
    var overrides = BIJLI_CONFIG.categories[cat].slabs.map(function(s, i){ var f = $("b-rate-" + i); return f ? parseFloat(f.value) : s.rate; });
    var r = computeBijli(units, cat, num("b-gst") || 0, num("b-extra") || 0, overrides);
    var out = $("b-result"); out.className = "result show"; out.textContent = "";
    out.appendChild(el("div", "Estimated bill")).className = "";
    var big = el("div", fmt(r.total)); big.className = "big"; out.appendChild(big);
    var tbl = el("div"); out.appendChild(tbl);
    makeTable(tbl, ["Slab (units)","Units","Rate (Rs)","Amount (Rs)"], r.rows);
    var lines = el("div");
    lines.appendChild(el("p", "Base tariff: " + fmt(r.base)));
    lines.appendChild(el("p", "FPA / extra charges: " + fmt(r.extra)));
    lines.appendChild(el("p", "GST: " + fmt(r.gst)));
    if (r.note) { var n = el("p", r.note); n.className = "note"; lines.appendChild(n); }
    out.appendChild(lines);
  });
}

/* ============ 2. Marla / Kanal ============ */
var AREA_TO_SQFT = { marla: 272.25, kanal: 272.25 * 20, sqft: 1, sqyard: 9, sqm: 10.7639, acre: 272.25 * 20 * 8 };
function convertArea(value, from){ var sqft = value * AREA_TO_SQFT[from], out = {}; for (var k in AREA_TO_SQFT) out[k] = sqft / AREA_TO_SQFT[k]; return out; }
function initArea(){
  if (!$("a-calc")) return;
  $("a-calc").addEventListener("click", function(){
    var r = convertArea(num("a-value"), $("a-from").value);
    var out = $("a-result"); out.className = "result show"; out.textContent = "";
    makeTable(out, ["Unit","Value"], [
      ["Marla", fmtN(r.marla)],["Kanal", fmtN(r.kanal)],["Square Feet", fmtN(r.sqft)],
      ["Square Yard (Gaj)", fmtN(r.sqyard)],["Square Metre", fmtN(r.sqm)],["Acre", fmtN(r.acre, 4)] ]);
  });
}

/* ============ 3. Salary Tax ============ */
function computeTax(annual){
  var slab = TAX_CONFIG.slabs[TAX_CONFIG.slabs.length - 1];
  for (var i = 0; i < TAX_CONFIG.slabs.length; i++){
    if (TAX_CONFIG.slabs[i].upTo == null || annual <= TAX_CONFIG.slabs[i].upTo) { slab = TAX_CONFIG.slabs[i]; break; }
  }
  var base = slab.base + slab.rate * Math.max(0, annual - slab.over);
  var surcharge = annual > TAX_CONFIG.surchargeThreshold ? base * TAX_CONFIG.surchargeRate : 0;
  return { baseTax: base, surcharge: surcharge, totalTax: base + surcharge };
}
function initTax(){
  if (!$("t-calc")) return;
  $("t-calc").addEventListener("click", function(){
    var monthlyIn = num("t-monthly"), annualIn = num("t-annual");
    var annual = annualIn > 0 ? annualIn : monthlyIn * 12;
    var r = computeTax(annual), takeAnnual = annual - r.totalTax;
    var out = $("t-result"); out.className = "result show"; out.textContent = "";
    var big = el("div", "Tax per month: " + fmt(r.totalTax / 12)); big.className = "big"; out.appendChild(big);
    makeTable(out, ["Item","Amount"], [
      ["Annual salary", fmt(annual)],["Annual tax (base)", fmt(r.baseTax)],
      ["Surcharge — Section 4AB (9%, income above Rs 10,000,000)", fmt(r.surcharge)],
      ["Total annual tax", fmt(r.totalTax)],["Take-home per year", fmt(takeAnnual)],
      ["Take-home per month", fmt(takeAnnual / 12)] ]);
  });
}

/* ============ 4. MDCAT Aggregate ============ */
function computeAggregate(mObt, mTot, fObt, fTot, dObt, dTot){
  return (mObt / mTot * 100 * 0.10) + (fObt / fTot * 100 * 0.40) + (dObt / dTot * 100 * 0.50);
}
function initMdcat(){
  if (!$("m-calc")) return;
  $("m-calc").addEventListener("click", function(){
    var agg = computeAggregate(num("m-mat-o"), num("m-mat-t") || 1, num("m-fsc-o"), num("m-fsc-t") || 1, num("m-md-o"), num("m-md-t") || 1);
    var out = $("m-result"); out.className = "result show"; out.textContent = "";
    var big = el("div", "Aggregate: " + fmtN(agg) + "%"); big.className = "big"; out.appendChild(big);
    makeTable(out, ["Part","Contribution"], [
      ["Matric (10%)", fmtN(num("m-mat-o") / (num("m-mat-t") || 1) * 10) + "%"],
      ["FSc (40%)", fmtN(num("m-fsc-o") / (num("m-fsc-t") || 1) * 40) + "%"],
      ["MDCAT (50%)", fmtN(num("m-md-o") / (num("m-md-t") || 1) * 50) + "%"] ]);
  });
}

/* ============ 5. Zakat ============ */
function computeZakat(totalAssets, liabilities, nisab){
  var net = Math.max(0, totalAssets - liabilities);
  return { net: net, reached: net >= nisab, zakat: net >= nisab ? net * ZAKAT_CONFIG.rate : 0 };
}
function initZakat(){
  if (!$("z-calc")) return;
  if ($("z-nisab")) $("z-nisab").value = ZAKAT_CONFIG.nisab;
  $("z-calc").addEventListener("click", function(){
    var assets = num("z-cash") + num("z-gold") + num("z-silver") + num("z-other");
    var nisab = num("z-nisab") || ZAKAT_CONFIG.nisab;
    var r = computeZakat(assets, num("z-liab"), nisab);
    var out = $("z-result"); out.className = "result show"; out.textContent = "";
    var big = el("div", r.reached ? "Zakat due: " + fmt(r.zakat) : "Nisab not reached — no Zakat due on these assets");
    big.className = "big"; out.appendChild(big);
    makeTable(out, ["Item","Amount"], [["Total assets", fmt(assets)],["Liabilities", fmt(num("z-liab"))],
      ["Net zakatable assets", fmt(r.net)],["Nisab used", fmt(nisab)],["Zakat at 2.5%", fmt(r.zakat)] ]);
  });
}

/* ============ 6. Image Compressor to KB ============ */
function canvasBlob(canvas, type, q){ return new Promise(function(res){ canvas.toBlob(res, type, q); }); }
function initCompress(){
  if (!$("c-go")) return;
  $("c-go").addEventListener("click", async function(){
    var f = $("c-file").files[0], out = $("c-result"), status = $("c-status");
    out.textContent = ""; status.textContent = "";
    if (!f) { status.textContent = "Please choose an image first."; return; }
    var target = (num("c-target") || 200) * 1024;
    status.textContent = "Working on: " + f.name + " (" + fmtN(f.size / 1024, 1) + " KB)";
    try {
      var img = await fileToImage(f);
      var scale = 1, blob = null;
      for (var round = 0; round < 12 && !blob; round++){
        var cv = document.createElement("canvas");
        cv.width = Math.max(1, Math.round(img.naturalWidth * scale));
        cv.height = Math.max(1, Math.round(img.naturalHeight * scale));
        var ctx = cv.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        for (var q = 0.92; q >= 0.08; q -= 0.07){
          var b = await canvasBlob(cv, "image/jpeg", q);
          if (b && b.size <= target) { blob = b; break; }
          blob = b;
        }
        if (blob && blob.size <= target) break;
        blob = null; scale *= 0.8;
      }
      if (!blob) { status.textContent = "Could not reach the target size; try a larger target KB."; return; }
      out.className = "result show";
      out.appendChild(el("p", "Before: " + fmtN(f.size / 1024, 1) + " KB  →  After: " + fmtN(blob.size / 1024, 1) + " KB"));
      out.appendChild(download(URL.createObjectURL(blob), "compressed.jpg"));
    } catch(e){ status.textContent = "That file could not be read as an image."; }
  });
}

/* ============ 7. Passport Photo ============ */
/* Background removal: real person segmentation — MediaPipe Selfie
   Segmentation (Google's on-device model), lazy-loaded on first use, the
   same lazy pattern as the PDF libraries. Replaced the earlier colour-based
   flood fill, which failed on busy real-world backgrounds (Mazeen's test
   photo, 2026-11-09: background untouched, highlights bleached). The mask's
   red channel becomes the person's alpha, with a firmer edge curve and one
   light blur pass so hair/shoulder edges feather instead of biting. */
var SEG_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js";
var segInstance = null;
function loadSegmenter(){
  if (segInstance) return Promise.resolve(segInstance);
  return loadScript(SEG_URL).then(function(){
    var seg = new window.SelfieSegmentation({ locateFile: function(f){ return "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/" + f; } });
    seg.setOptions({ modelSelection: 1 });
    segInstance = seg;
    return seg;
  });
}
function maskToAlpha(maskData, imgData, w, h){
  var raw = new Uint8Array(w * h), q, x, y, dx, dy;
  for (q = 0; q < w * h; q++){
    var v = maskData[q * 4]; /* red channel: 255 = person, 0 = background */
    var a = (v - 40) * 255 / 175;
    raw[q] = a <= 0 ? 0 : a >= 255 ? 255 : Math.round(a);
  }
  for (y = 0; y < h; y++) for (x = 0; x < w; x++){
    var sum = 0, n = 0;
    for (dy = -1; dy <= 1; dy++) for (dx = -1; dx <= 1; dx++){
      var xx = x + dx, yy = y + dy;
      if (xx >= 0 && xx < w && yy >= 0 && yy < h){ sum += raw[yy * w + xx]; n++; }
    }
    imgData[(y * w + x) * 4 + 3] = Math.round(sum / n);
  }
}
function segmentPerson(srcCanvas){
  return loadSegmenter().then(function(seg){
    return new Promise(function(resolve, reject){
      var timer = setTimeout(function(){ reject(new Error("segmentation timed out")); }, 90000);
      seg.onResults(function(results){
        clearTimeout(timer);
        try {
          var w = srcCanvas.width, h = srcCanvas.height;
          var mc = document.createElement("canvas"); mc.width = w; mc.height = h;
          var mctx = mc.getContext("2d");
          mctx.drawImage(results.segmentationMask, 0, 0, w, h);
          var maskData = mctx.getImageData(0, 0, w, h).data;
          var pc = document.createElement("canvas"); pc.width = w; pc.height = h;
          var pctx = pc.getContext("2d");
          pctx.drawImage(srcCanvas, 0, 0);
          var idata = pctx.getImageData(0, 0, w, h);
          maskToAlpha(maskData, idata.data, w, h);
          pctx.putImageData(idata, 0, 0);
          resolve(pc);
        } catch(e){ reject(e); }
      });
      seg.send({ image: srcCanvas }).catch(function(e){ clearTimeout(timer); reject(e); });
    });
  });
}
var PASSPORT_BLUE = "#4f9fe0";
var passportCanvas = null;
function initPassport(){
  if (!$("p-go")) return;
  $("p-go").addEventListener("click", async function(){
    var f = $("p-file").files[0], status = $("p-status"), out = $("p-result");
    out.textContent = ""; status.textContent = "";
    if (!f) { status.textContent = "Please choose a photo first."; return; }
    status.textContent = "Photo: " + f.name;
    try {
      var img = await fileToImage(f), zoom = parseFloat($("p-zoom").value) || 1;
      var ratio = 35 / 45; /* width : height */
      var cropW = img.naturalWidth / zoom, cropH = cropW / ratio;
      if (cropH > img.naturalHeight / zoom) { cropH = img.naturalHeight / zoom; cropW = cropH * ratio; }
      cropW = Math.min(cropW, img.naturalWidth); cropH = Math.min(cropH, img.naturalHeight);
      var sx = (img.naturalWidth - cropW) / 2, sy = (img.naturalHeight - cropH) / 3;
      var cv = document.createElement("canvas"); cv.width = 413; cv.height = 531;
      var ctx = cv.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 413, 531);
      ctx.drawImage(img, sx, sy, cropW, cropH, 0, 0, 413, 531);
      var bgMode = $("p-bg") ? $("p-bg").value : "keep";
      if (bgMode !== "keep"){
        status.textContent = "Removing the background with AI — the first time, a small model downloads (a few seconds)…";
        try {
          var person = await segmentPerson(cv);
          ctx.fillStyle = bgMode === "blue" ? PASSPORT_BLUE : "#ffffff";
          ctx.fillRect(0, 0, 413, 531);
          ctx.drawImage(person, 0, 0);
          status.textContent = "";
        } catch(e){
          status.textContent = "Background removal could not run (it needs internet once, for the model download). Here is the photo with its original background:";
        }
      }
      passportCanvas = cv;
      cv.className = "preview"; out.appendChild(cv);
      var b = await canvasBlob(cv, "image/jpeg", 0.95);
      out.appendChild(el("p", "Passport size: 35 × 45 mm (413 × 531 px at 300 DPI)" + (bgMode !== "keep" ? " — background replaced by AI person detection, which also works on busy backgrounds." : "")));
      out.appendChild(download(URL.createObjectURL(b), "passport-photo.jpg"));
      status.textContent = "";
    } catch(e){ status.textContent = "That file could not be read as an image."; }
  });
  if ($("p-sheet")) $("p-sheet").addEventListener("click", async function(){
    var status = $("p-status"), out = $("p-result");
    if (!passportCanvas){ status.textContent = "Make the passport photo first, then the print sheet."; return; }
    var sheet = document.createElement("canvas"); sheet.width = 1200; sheet.height = 1800;
    var sctx = sheet.getContext("2d"); sctx.fillStyle = "#fff"; sctx.fillRect(0, 0, 1200, 1800);
    var xs = [172, 615], ys = [354, 915];
    for (var r = 0; r < 2; r++) for (var c = 0; c < 2; c++) sctx.drawImage(passportCanvas, xs[c], ys[r]);
    var b = await canvasBlob(sheet, "image/jpeg", 0.95);
    out.appendChild(download(URL.createObjectURL(b), "passport-photo-sheet-4x6.jpg"));
  });
}

/* ============ 8. Image Converter ============ */
function initConvert(){
  if (!$("v-go")) return;
  $("v-go").addEventListener("click", async function(){
    var f = $("v-file").files[0], status = $("v-status"), out = $("v-result");
    out.textContent = ""; status.textContent = "";
    if (!f) { status.textContent = "Please choose an image first."; return; }
    status.textContent = "Image: " + f.name;
    try {
      var img = await fileToImage(f), type = $("v-format").value;
      var cv = document.createElement("canvas"); cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      var ctx = cv.getContext("2d");
      if (type !== "image/png") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, cv.width, cv.height); }
      ctx.drawImage(img, 0, 0);
      var ext = type === "image/png" ? "png" : (type === "image/webp" ? "webp" : "jpg");
      var b = await canvasBlob(cv, type, 0.92);
      out.className = "result show";
      out.appendChild(el("p", "Converted size: " + fmtN(b.size / 1024, 1) + " KB"));
      out.appendChild(download(URL.createObjectURL(b), "converted." + ext));
    } catch(e){ status.textContent = "That file could not be read as an image."; }
  });
}

/* ============ 9. Merge PDF ============ */
function initMerge(){
  if (!$("mp-go")) return;
  $("mp-go").addEventListener("click", async function(){
    var files = $("mp-files").files, status = $("mp-status"), out = $("mp-result");
    out.textContent = ""; status.textContent = "";
    if (!files.length) { status.textContent = "Please choose at least two PDF files."; return; }
    var list = el("p"); list.textContent = "Files: " + Array.prototype.map.call(files, function(f){ return f.name; }).join(", ");
    out.appendChild(list);
    status.textContent = "Loading the PDF library…";
    try {
      var PDFLib = await loadPdfLib();
      var merged = await PDFLib.PDFDocument.create();
      for (var i = 0; i < files.length; i++){
        var doc = await PDFLib.PDFDocument.load(await files[i].arrayBuffer());
        var pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach(function(p){ merged.addPage(p); });
      }
      var bytes = await merged.save();
      status.textContent = "Merged " + files.length + " files.";
      out.appendChild(download(URL.createObjectURL(new Blob([bytes], {type: "application/pdf"})), "merged.pdf"));
    } catch(e){ status.textContent = "Sorry — the PDF library or a file failed to load. Check your connection and that every file is a valid PDF, then try again."; status.className = "err"; }
  });
}

/* ============ 10. Split PDF ============ */
function parsePageRange(text, total){
  var pages = new Set();
  text.split(",").forEach(function(part){
    part = part.trim(); if (!part) return;
    if (part.indexOf("-") >= 0){ var ab = part.split("-"), a = parseInt(ab[0], 10), b = parseInt(ab[1], 10);
      for (var p = a; p <= b; p++) if (p >= 1 && p <= total) pages.add(p - 1);
    } else { var n = parseInt(part, 10); if (n >= 1 && n <= total) pages.add(n - 1); }
  });
  return Array.from(pages).sort(function(x, y){ return x - y; });
}
function initSplit(){
  if (!$("sp-go")) return;
  $("sp-go").addEventListener("click", async function(){
    var f = $("sp-file").files[0], status = $("sp-status"), out = $("sp-result");
    out.textContent = ""; status.textContent = "";
    if (!f) { status.textContent = "Please choose a PDF file first."; return; }
    status.textContent = "File: " + f.name + " — loading the PDF library…";
    try {
      var PDFLib = await loadPdfLib();
      var doc = await PDFLib.PDFDocument.load(await f.arrayBuffer());
      var idx = parsePageRange($("sp-range").value, doc.getPageCount());
      if (!idx.length) { status.textContent = "No valid pages in that range. The PDF has " + doc.getPageCount() + " pages."; return; }
      var nd = await PDFLib.PDFDocument.create();
      var pages = await nd.copyPages(doc, idx);
      pages.forEach(function(p){ nd.addPage(p); });
      var bytes = await nd.save();
      status.textContent = "Extracted " + idx.length + " page(s).";
      out.appendChild(download(URL.createObjectURL(new Blob([bytes], {type: "application/pdf"})), "extracted-pages.pdf"));
    } catch(e){ status.textContent = "Sorry — the PDF library or file failed to load. Check your connection and that the file is a valid PDF."; status.className = "err"; }
  });
}

/* ============ 11. JPG ↔ PDF ============ */
function initJpgPdf(){
  if (!$("j-go")) return;
  $("j-go").addEventListener("click", async function(){
    var files = $("j-files").files, status = $("j-status"), out = $("j-result");
    out.textContent = ""; status.textContent = "";
    if (!files.length) { status.textContent = "Please choose one or more images."; return; }
    status.textContent = "Images: " + Array.prototype.map.call(files, function(f){ return f.name; }).join(", ") + " — loading the PDF library…";
    try {
      var PDFLib = await loadPdfLib();
      var doc = await PDFLib.PDFDocument.create();
      for (var i = 0; i < files.length; i++){
        var buf = await files[i].arrayBuffer();
        var emb = files[i].type === "image/png" ? await doc.embedPng(buf) : await doc.embedJpg(buf);
        var page = doc.addPage([emb.width, emb.height]);
        page.drawImage(emb, {x: 0, y: 0, width: emb.width, height: emb.height});
      }
      var bytes = await doc.save();
      status.textContent = "Created a PDF with " + files.length + " page(s).";
      out.appendChild(download(URL.createObjectURL(new Blob([bytes], {type: "application/pdf"})), "images-to-pdf.pdf"));
    } catch(e){ status.textContent = "Sorry — the PDF library or an image failed to load. JPG and PNG images work best."; status.className = "err"; }
  });
  $("pj-go").addEventListener("click", async function(){
    var f = $("pj-file").files[0], status = $("pj-status"), out = $("pj-result");
    out.textContent = ""; status.textContent = "";
    if (!f) { status.textContent = "Please choose a PDF file first."; return; }
    status.textContent = "File: " + f.name + " — loading the PDF reader…";
    try {
      await loadScript(PDFJS_URL);
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
      var pdf = await window.pdfjsLib.getDocument({ data: await f.arrayBuffer() }).promise;
      status.textContent = "Rendering " + pdf.numPages + " page(s) to JPG…";
      for (var pno = 1; pno <= pdf.numPages; pno++){
        var page = await pdf.getPage(pno), vp = page.getViewport({ scale: 2 });
        var cv = document.createElement("canvas"); cv.width = vp.width; cv.height = vp.height;
        await page.render({ canvasContext: cv.getContext("2d"), viewport: vp }).promise;
        var b = await canvasBlob(cv, "image/jpeg", 0.92);
        out.appendChild(download(URL.createObjectURL(b), "page-" + pno + ".jpg"));
      }
    } catch(e){ status.textContent = "Sorry — the PDF reader failed to load, or the file is not a valid PDF. Check your connection and try again."; status.className = "err"; }
  });
}

/* ============ 12. Age & Date Difference ============ */
function dateDiffYMD(from, to){
  var y = to.getFullYear() - from.getFullYear(), m = to.getMonth() - from.getMonth(), d = to.getDate() - from.getDate();
  if (d < 0) { m -= 1; d += new Date(to.getFullYear(), to.getMonth(), 0).getDate(); }
  if (m < 0) { y -= 1; m += 12; }
  var days = Math.round((to - from) / 86400000);
  return { years: y, months: m, days: d, totalDays: days };
}
function initAge(){
  if (!$("age-go")) return;
  var today = new Date(); var iso = today.toISOString().slice(0, 10);
  if ($("age-at") && !$("age-at").value) $("age-at").value = iso;
  if ($("d2") && !$("d2").value) $("d2").value = iso;
  $("age-go").addEventListener("click", function(){
    var dob = new Date($("dob").value + "T00:00:00"), at = new Date($("age-at").value + "T00:00:00");
    var out = $("age-result");
    if (isNaN(dob) || isNaN(at) || at < dob) { out.className = "result show"; out.textContent = "Please pick a birth date and a later “age at” date."; return; }
    var r = dateDiffYMD(dob, at);
    out.className = "result show"; out.textContent = "";
    var big = el("div", r.years + " years, " + r.months + " months, " + r.days + " days"); big.className = "big"; out.appendChild(big);
    makeTable(out, ["Measure","Value"], [["Total days", fmtN(r.totalDays, 0)],["Total weeks", fmtN(Math.floor(r.totalDays / 7), 0) + " (" + (r.totalDays % 7) + " extra days)"],["Total months (approx.)", fmtN(r.totalDays / 30.44, 1)]]);
  });
  $("dd-go").addEventListener("click", function(){
    var a = new Date($("d1").value + "T00:00:00"), b = new Date($("d2").value + "T00:00:00");
    var out = $("dd-result");
    if (isNaN(a) || isNaN(b)) { out.className = "result show"; out.textContent = "Please pick both dates."; return; }
    var from = a <= b ? a : b, to = a <= b ? b : a, r = dateDiffYMD(from, to);
    out.className = "result show"; out.textContent = "";
    var big = el("div", r.years + " years, " + r.months + " months, " + r.days + " days (" + fmtN(r.totalDays, 0) + " days in total)");
    big.className = "big"; out.appendChild(big);
  });
}

document.addEventListener("DOMContentLoaded", function(){
  initBijli(); initArea(); initTax(); initMdcat(); initZakat();
  initCompress(); initPassport(); initConvert();
  initMerge(); initSplit(); initJpgPdf(); initAge();
});

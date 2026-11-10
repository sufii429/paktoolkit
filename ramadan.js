/* PakToolkit — Ramadan Calendar Maker (loaded only on the ramadan tool page).
   Defines initRamadan; tools.js calls it from its dispatch under a window guard.

   A printable Ramadan calendar in the local printing-press style: a ready
   design with a "patti" (band) in the middle where the user puts their own
   shop / business / personal name, phones and address. Sehri & Iftar times
   are computed on-device for the chosen city with the University of Islamic
   Sciences, Karachi method (Fajr 18°, Iftar at sunset) — PrayTimes math.
   Nothing is uploaded anywhere. */

var R_CITIES = [
  ["Karachi", 24.8608, 67.0011], ["Lahore", 31.5497, 74.3436],
  ["Islamabad", 33.7294, 73.0931], ["Rawalpindi", 33.5651, 73.0169],
  ["Faisalabad", 31.4504, 73.1350], ["Multan", 30.1575, 71.5249],
  ["Peshawar", 34.0151, 71.5785], ["Quetta", 30.1798, 66.9750],
  ["Hyderabad", 25.3960, 68.3578], ["Sialkot", 32.4945, 74.5229],
  ["Gujranwala", 32.1877, 74.1945], ["Bahawalpur", 29.4000, 71.6833],
  ["Sargodha", 32.0836, 72.6711], ["Sukkur", 27.7246, 68.8484],
  ["Larkana", 27.5570, 68.2028], ["Sheikhupura", 31.7131, 73.9783],
  ["Rahim Yar Khan", 28.4212, 70.2989], ["Jhang", 31.2681, 72.3181],
  ["Dera Ghazi Khan", 30.0489, 70.6455], ["Mardan", 34.1989, 72.0400],
  ["Abbottabad", 34.1688, 73.2215], ["Muzaffarabad", 34.3700, 73.4708],
  ["Kasur", 31.1165, 74.4500], ["Okara", 30.8138, 73.4534],
  ["Gujrat", 32.5742, 74.0754], ["Chakwal", 32.9300, 72.8500]
];

/* ---- prayer-time engine (Karachi method) ---- */
var R_D2R = Math.PI / 180, R_R2D = 180 / Math.PI;
function rFixAngle(a){ return a - 360 * Math.floor(a / 360); }
function rFixHour(a){ return a - 24 * Math.floor(a / 24); }
function rJulian(y, m, d){
  if (m <= 2){ y -= 1; m += 12; }
  var A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}
function rSunPos(jd){
  var D = jd - 2451545.0;
  var g = rFixAngle(357.529 + 0.98560028 * D);
  var q = rFixAngle(280.459 + 0.98564736 * D);
  var L = rFixAngle(q + 1.915 * Math.sin(g * R_D2R) + 0.020 * Math.sin(2 * g * R_D2R));
  var e = 23.439 - 0.00000036 * D;
  var RA = rFixHour(Math.atan2(Math.cos(e * R_D2R) * Math.sin(L * R_D2R), Math.cos(L * R_D2R)) * R_R2D / 15);
  var decl = Math.asin(Math.sin(e * R_D2R) * Math.sin(L * R_D2R)) * R_R2D;
  return { decl: decl, eqt: q / 15 - RA };
}
function rAngleTime(jd, lat, angle, dir){
  var sp = rSunPos(jd), noon = rFixHour(12 - sp.eqt);
  var cosT = (-Math.sin(angle * R_D2R) - Math.sin(sp.decl * R_D2R) * Math.sin(lat * R_D2R)) /
             (Math.cos(sp.decl * R_D2R) * Math.cos(lat * R_D2R));
  var T = Math.acos(cosT) * R_R2D / 15;
  return noon + (dir === "ccw" ? -T : T);
}
function rFmt(t){
  t = rFixHour(t); var h = Math.floor(t), m = Math.floor((t - h) * 60 + 0.5);
  if (m === 60){ m = 0; h += 1; }
  var ap = h >= 12 ? "PM" : "AM", h12 = h % 12; if (h12 === 0) h12 = 12;
  return h12 + ":" + ("0" + m).slice(-2) + " " + ap;
}
function rDayTimes(lat, lng, y, mo, da){
  var jd = rJulian(y, mo, da);
  var fajr = rFixHour(rAngleTime(jd, lat, 18, "ccw") - lng / 15 + 5);
  var magh = rFixHour(rAngleTime(jd, lat, 0.833, "cw") - lng / 15 + 5);
  return { sehri: rFmt(fajr), iftar: rFmt(magh) };
}

/* ---- Urdu helpers ---- */
var R_UD = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
function rUrduNum(n){ return String(n).split("").map(function(c){ return R_UD[+c]; }).join(""); }
var R_WDU = ["اتوار","پیر","منگل","بدھ","جمعرات","جمعہ","ہفتہ"];
var R_MONU = ["جنوری","فروری","مارچ","اپریل","مئی","جون","جولائی","اگست","ستمبر","اکتوبر","نومبر","دسمبر"];
var R_MONE = ["January","February","March","April","May","June","July","August","September","October","November","December"];

var R_CSS = `
.rsheet{background:#fdfaf0;border-radius:14px;overflow:hidden;box-shadow:0 14px 40px rgba(0,0,0,.28);max-width:840px;margin:14px auto 0;text-align:left}
.rsheet .hdr{background:linear-gradient(180deg,#bfe3f2 0%,#eaf6fb 55%,#fdfaf0 100%);text-align:center;padding:20px 14px 0}
.rsheet .verse{font-family:'Amiri',serif;font-size:1.35rem;color:#0b5136;line-height:2.1}
.rsheet .title{font-family:'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif;font-size:2rem;line-height:2;color:#08331d}
.rsheet .title small{display:block;font-size:1rem;color:#5c7355;font-family:Georgia,serif}
.rsheet .hphoto{margin-top:8px;border:2px solid #c9a227;border-radius:10px;overflow:hidden;height:200px;background:#e8e2cf}
.rsheet .hphoto img{width:100%;height:100%;object-fit:cover;display:block}
.rphotos{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0 4px}
.rphoto{width:104px;border:2px solid #d8d2c0;border-radius:10px;overflow:hidden;cursor:pointer;background:#fff;padding:0}
.rphoto.sel{border-color:#b8860b;box-shadow:0 0 0 2px #f3d67b}
.rphoto img{width:100%;height:56px;object-fit:cover;display:block}
.rphoto .pn{font-size:.7rem;text-align:center;padding:3px 2px;color:#4a463c;line-height:1.25}
.rsheet .band{background:linear-gradient(160deg,#0e4d2e,#08331d);color:#ffeeb8;text-align:center;padding:16px 14px 14px;border-top:4px solid #c9a227;border-bottom:4px solid #c9a227}
.rsheet .band .shop{font-family:'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif;font-size:2.3rem;line-height:1.9;color:#ffd968}
.rsheet .band .svc{font-family:'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif;font-size:1.02rem;line-height:2;color:#e9f5e4}
.rsheet .band .contact{margin-top:8px;display:flex;flex-wrap:wrap;gap:8px;justify-content:center;font-family:system-ui,Arial,sans-serif}
.rsheet .band .contact span{background:rgba(255,255,255,.12);border:1.5px solid #c9a227;border-radius:999px;padding:5px 14px;font-size:1rem;color:#ffeeb8}
.rsheet .band .contact .ph{font-weight:bold;font-size:1.08rem}
.rsheet .cityline{text-align:center;padding:10px 10px 0;font-size:1rem;color:#0e4d2e;letter-spacing:.14em;text-transform:uppercase;font-family:Georgia,serif}
.rsheet .cols{display:flex;gap:12px;padding:12px 14px 4px;direction:rtl}
.rsheet .blk{flex:1;min-width:0;border:1.5px solid #cfc48f;border-radius:10px;overflow:hidden;background:#fffdf4}
.rsheet .blkhd{background:#0e4d2e;color:#ffd968;font-family:'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif;font-size:1.06rem;line-height:2;text-align:center;padding:2px 4px}
.rsheet .blk.b2 .blkhd{background:#7c4a12}.rsheet .blk.b3 .blkhd{background:#5e1220}
.rsheet .blkdua{font-family:'Amiri',serif;font-size:.86rem;line-height:1.9;text-align:center;color:#4a5738;padding:5px 6px;border-bottom:1px solid #e4dcc2}
.rsheet table{width:100%;border-collapse:collapse;font-size:.8rem}
.rsheet th{background:#efe8c8;color:#5b4a12;padding:5px 2px;font-family:'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif;font-size:.82rem;line-height:1.8;font-weight:normal}
.rsheet td{padding:4px 2px;text-align:center;border-bottom:1px solid #eee5c8;color:#26331f;font-family:'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif;font-size:.84rem;line-height:1.7}
.rsheet td.tm{font-family:Georgia,serif;font-variant-numeric:tabular-nums;white-space:nowrap;font-size:.8rem}
.rsheet td.rz{font-weight:bold;color:#0e4d2e;font-size:.95rem}
.rsheet tr.fri td{background:#fdf3cd;font-weight:bold}
.rsheet .star{color:#b8860b;font-size:.75rem}
.rsheet .duas{display:flex;gap:12px;padding:12px 14px 4px}
.rsheet .dua{flex:1;background:#f4efdb;border:1px solid #ddd2a4;border-radius:10px;padding:9px 10px;text-align:center}
.rsheet .dua h3{font-size:.76rem;letter-spacing:.16em;color:#0e4d2e;text-transform:uppercase;margin-bottom:4px;font-family:Georgia,serif}
.rsheet .dua .ar{font-family:'Amiri',serif;font-size:1.08rem;line-height:2;color:#20301f;direction:rtl}
.rsheet .dua .ur{font-family:'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif;font-size:.82rem;line-height:2;color:#4a5738}
.rsheet .foot{padding:10px 16px 16px;text-align:center;font-family:system-ui,Arial,sans-serif;font-size:.76rem;line-height:1.6;color:#67755c}
.rsheet .foot .brand{margin-top:5px;color:#0e4d2e;font-weight:bold}
@media (max-width:680px){.rsheet .cols{flex-direction:column}.rsheet .duas{flex-direction:column}.rsheet table{font-size:.9rem}.rsheet td{font-size:.92rem}.rsheet .band .shop{font-size:1.8rem}}
.rdesigns{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:6px 0 4px}
.rdesign{border:2px solid #d8d2b8;border-radius:12px;padding:10px;text-align:center;cursor:pointer;background:#fffdf4}
.rdesign.sel{border-color:#0e4d2e;box-shadow:0 4px 14px rgba(14,77,46,.18)}
.rdesign .sw{height:44px;border-radius:8px;margin-bottom:6px}
.rdesign .nm{font-weight:bold;color:#20301f}
.rdesign .tag{font-size:.78rem;color:#67755c}
.rdesign.locked{cursor:not-allowed;opacity:.92}
.rsheet.theme-royal .band{background:linear-gradient(160deg,#21397a,#0f1c40)}
.rsheet.theme-royal .blk .blkhd{background:#21397a}
.rsheet.theme-royal .title{color:#16295c}
.rsheet.theme-royal .cityline{color:#21397a}
.rsheet.theme-royal td.rz{color:#21397a}
.rsheet.theme-royal .foot .brand{color:#21397a}
.rsheet.theme-wine .band{background:linear-gradient(160deg,#7c1d30,#4a0d19)}
.rsheet.theme-wine .blk .blkhd{background:#7c1d30}
.rsheet.theme-wine .title{color:#5e1220}
.rsheet.theme-wine .cityline{color:#7c1d30}
.rsheet.theme-wine td.rz{color:#7c1d30}
.rsheet.theme-wine .foot .brand{color:#7c1d30}
`;

/* Header photos — freely licensed on Wikimedia Commons (credits shown on the
   tool page): Nabawi CC0 (TheHadiRahim) · Kaaba CC BY-SA 4.0 (Adli Wahid) ·
   Badshahi CC BY-SA 4.0 (Zapata1000) · Data Darbar CC BY 2.0 (Guilhem Vellut). */
var R_PHOTOS = [
  { id: "nabawi", nm: "Roza-e-Rasool ﷺ", sub: "Madina", pos: "center 75%",
    full: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Wide_shot_of_the_Green_Dome_at_The_Prophet%27s_Mosque_%28Al_Masjid-e-Nabawi%29.jpg/1280px-Wide_shot_of_the_Green_Dome_at_The_Prophet%27s_Mosque_%28Al_Masjid-e-Nabawi%29.jpg",
    thumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/Wide_shot_of_the_Green_Dome_at_The_Prophet%27s_Mosque_%28Al_Masjid-e-Nabawi%29.jpg/500px-Wide_shot_of_the_Green_Dome_at_The_Prophet%27s_Mosque_%28Al_Masjid-e-Nabawi%29.jpg" },
  { id: "kaaba", nm: "Khana Kaaba", sub: "Makkah", pos: "center 30%",
    full: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/The_Kaaba_during_Hajj_-_edited.jpg/1280px-The_Kaaba_during_Hajj_-_edited.jpg",
    thumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b3/The_Kaaba_during_Hajj_-_edited.jpg/500px-The_Kaaba_during_Hajj_-_edited.jpg" },
  { id: "badshahi", nm: "Badshahi Masjid", sub: "Lahore", pos: "center 18%",
    full: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Badshahi_mosque_of_Lahore%2C_Pakistan.jpg/1280px-Badshahi_mosque_of_Lahore%2C_Pakistan.jpg",
    thumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/Badshahi_mosque_of_Lahore%2C_Pakistan.jpg/500px-Badshahi_mosque_of_Lahore%2C_Pakistan.jpg" },
  { id: "data", nm: "Data Darbar", sub: "Lahore", pos: "center 26%",
    full: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Data_Darbar_Shrine_%40_Lahore_%2815284918880%29.jpg/1280px-Data_Darbar_Shrine_%40_Lahore_%2815284918880%29.jpg",
    thumb: "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/12/Data_Darbar_Shrine_%40_Lahore_%2815284918880%29.jpg/500px-Data_Darbar_Shrine_%40_Lahore_%2815284918880%29.jpg" }
];

function rLoadFonts(){
  if (document.getElementById("r-fonts")) return;
  var l1 = document.createElement("link"); l1.rel = "stylesheet";
  l1.href = "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap";
  var l2 = document.createElement("link"); l2.rel = "stylesheet"; l2.id = "r-fonts";
  l2.href = "https://fonts.cdnfonts.com/css/jameel-noori-nastaleeq";
  document.head.appendChild(l1); document.head.appendChild(l2);
}

function initRamadan(){
  var citySel = document.getElementById("r-city");
  if (!citySel) return;
  rLoadFonts();
  if (!document.getElementById("r-css")){
    var st = document.createElement("style"); st.id = "r-css"; st.textContent = R_CSS;
    document.head.appendChild(st);
  }
  R_CITIES.forEach(function(c, i){
    var o = document.createElement("option"); o.value = i; o.textContent = c[0];
    if (c[0] === "Faisalabad") o.selected = true;
    citySel.appendChild(o);
  });
  var startIn = document.getElementById("r-start");
  var nameIn = document.getElementById("r-name");
  var svcIn = document.getElementById("r-svc");
  var ph1In = document.getElementById("r-ph1");
  var ph2In = document.getElementById("r-ph2");
  var addrIn = document.getElementById("r-addr");
  var sheetBox = document.getElementById("r-sheet");
  var designsBox = document.getElementById("r-designs");
  var status = document.getElementById("r-status");
  var PREMIUM_WA = "https://wa.me/923181746809?text=" + encodeURIComponent("Assalam-o-Alaikum! Mujhe PakToolkit Ramadan Calendar ka premium design chahiye.");

  /* Owner unlock: opening the tool once with ?unlock=premium unlocks the
     premium designs on THIS device only (localStorage). ?unlock=off locks
     them again. Ordinary visitors always see them locked. */
  var unlocked = false;
  try {
    var uq = new URLSearchParams(location.search).get("unlock");
    if (uq === "premium") localStorage.setItem("r-premium", "1");
    if (uq === "off") localStorage.removeItem("r-premium");
    unlocked = localStorage.getItem("r-premium") === "1";
  } catch (e) {}
  var currentDesign = "emerald";

  /* design picker: 1 free + 2 premium (WhatsApp manual model; owner-unlockable) */
  var designs = [
    { id: "emerald", nm: "Sabz (Emerald)", tag: "Muft — free design", free: true,
      sw: "linear-gradient(160deg,#0e4d2e,#08331d)" },
    { id: "royal", nm: "Shahi Neela (Royal)", tag: "Premium — Rs 20", free: false,
      sw: "linear-gradient(160deg,#21397a,#0f1c40)" },
    { id: "wine", nm: "Mehroon Sunehra (Wine & Gold)", tag: "Premium — Rs 20", free: false,
      sw: "linear-gradient(160deg,#7c1d30,#4a0d19)" }
  ];
  designs.forEach(function(dz){
    var usable = dz.free || unlocked;
    var card = document.createElement("div");
    card.className = "rdesign" + (dz.id === currentDesign ? " sel" : "") + (usable ? "" : " locked");
    var sw = document.createElement("div"); sw.className = "sw"; sw.style.background = dz.sw; card.appendChild(sw);
    var nm = document.createElement("div"); nm.className = "nm"; nm.textContent = (usable ? "" : "🔒 ") + dz.nm; card.appendChild(nm);
    var tg = document.createElement("div"); tg.className = "tag"; tg.textContent = usable && !dz.free ? "Premium — unlocked ✓" : dz.tag; card.appendChild(tg);
    if (usable){
      card.addEventListener("click", function(){
        currentDesign = dz.id;
        designsBox.querySelectorAll(".rdesign").forEach(function(c){ c.classList.remove("sel"); });
        card.classList.add("sel");
        buildSheet();
      });
    } else {
      card.addEventListener("click", function(){
        status.className = "result show";
        status.textContent = "";
        var p = document.createElement("p");
        p.textContent = "Ye premium design hai (Rs 20). WhatsApp par order karein — design aap ke naam ke saath tayyar karke bhej diya jayega: ";
        var a = document.createElement("a"); a.href = PREMIUM_WA; a.target = "_blank"; a.rel = "noopener";
        a.textContent = "WhatsApp par order karein";
        p.appendChild(a); status.appendChild(p);
      });
    }
    designsBox.appendChild(card);
  });

  /* Header photo picker — freely licensed photos (Wikimedia Commons). */
  var currentPhoto = R_PHOTOS[0];
  var photosBox = document.getElementById("r-photos");
  if (photosBox) R_PHOTOS.forEach(function(ph){
    var b = document.createElement("button"); b.type = "button";
    b.className = "rphoto" + (ph === currentPhoto ? " sel" : "");
    var im = document.createElement("img"); im.src = ph.thumb; im.alt = ph.nm; im.loading = "lazy"; b.appendChild(im);
    var pn = document.createElement("div"); pn.className = "pn"; pn.textContent = ph.nm + " · " + ph.sub; b.appendChild(pn);
    b.addEventListener("click", function(){
      currentPhoto = ph;
      photosBox.querySelectorAll(".rphoto").forEach(function(x){ x.classList.remove("sel"); });
      b.classList.add("sel");
      buildSheet();
    });
    photosBox.appendChild(b);
  });

  function el(tag, txt){ var e = document.createElement(tag); if (txt != null) e.textContent = txt; return e; }

  function buildSheet(){
    var c = R_CITIES[+citySel.value || 0];
    var sVal = startIn.value || "2027-02-08";
    var parts = sVal.split("-");
    var start = new Date(Date.UTC(+parts[0], +parts[1] - 1, +parts[2]));
    var rows = [];
    for (var i = 0; i < 30; i++){
      var dt = new Date(start.getTime() + i * 86400000);
      var t = rDayTimes(c[1], c[2], dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
      rows.push({ roza: i + 1, wd: R_WDU[dt.getUTCDay()], fri: dt.getUTCDay() === 5,
        date: rUrduNum(dt.getUTCDate()) + " " + R_MONU[dt.getUTCMonth()],
        sehri: t.sehri, iftar: t.iftar, qadr: [21, 23, 25, 27, 29].indexOf(i + 1) >= 0 });
    }
    var end = new Date(start.getTime() + 29 * 86400000);
    var rangeEn = R_MONE[start.getUTCMonth()] + " — " + R_MONE[end.getUTCMonth()] + " " + end.getUTCFullYear();

    var sheet = el("div"); sheet.className = "rsheet" + (currentDesign !== "emerald" ? " theme-" + currentDesign : ""); sheet.id = "r-sheet-inner";
    var hdr = el("div"); hdr.className = "hdr";
    var verse = el("div", "شَهْرُ رَمَضَانَ الَّذِيْٓ اُنْزِلَ فِيْهِ الْقُرْاٰنُ"); verse.className = "verse"; hdr.appendChild(verse);
    var title = el("div"); title.className = "title"; title.textContent = "کیلنڈر رمضان المبارک ۱۴۴۸ھ";
    var small = el("small", "Ramadan Calendar 1448 AH · " + c[0] + " · " + rangeEn); title.appendChild(small);
    hdr.appendChild(title);
    var photo = el("div"); photo.className = "hphoto";
    var himg = document.createElement("img");
    himg.src = currentPhoto.full; himg.alt = currentPhoto.nm; himg.crossOrigin = "anonymous";
    himg.style.objectPosition = currentPhoto.pos;
    photo.appendChild(himg); hdr.appendChild(photo);
    sheet.appendChild(hdr);

    var band = el("div"); band.className = "band";
    var shop = el("div", nameIn.value.trim() || "آپ کا نام یہاں"); shop.className = "shop"; band.appendChild(shop);
    if (svcIn.value.trim()){ var svc = el("div", svcIn.value.trim()); svc.className = "svc"; band.appendChild(svc); }
    var contact = el("div"); contact.className = "contact";
    [ph1In.value.trim(), ph2In.value.trim()].forEach(function(ph){
      if (!ph) return;
      var s = el("span", "📞 " + ph); s.className = "ph"; contact.appendChild(s);
    });
    if (addrIn.value.trim()) contact.appendChild(el("span", "📍 " + addrIn.value.trim()));
    if (contact.childNodes.length) band.appendChild(contact);
    sheet.appendChild(band);

    var cl = el("div", "Sehri & Iftar Timings — " + c[0]); cl.className = "cityline"; sheet.appendChild(cl);

    var cols = el("div"); cols.className = "cols";
    var ashras = [
      { rows: rows.slice(0, 10), hd: "پہلا عشرہ — رحمت", dua: "رَبِّ اغْفِرْ وَارْحَمْ وَاَنْتَ خَيْرُ الرّٰحِمِيْنَ", cls: "blk b1" },
      { rows: rows.slice(10, 20), hd: "دوسرا عشرہ — مغفرت", dua: "اَسْتَغْفِرُ اللّٰهَ رَبِّيْ مِنْ كُلِّ ذَنْبٍ وَّاَتُوْبُ اِلَيْهِ", cls: "blk b2" },
      { rows: rows.slice(20, 30), hd: "تیسرا عشرہ — نجات", dua: "اَللّٰهُمَّ اَجِرْنِيْ مِنَ النَّارِ", cls: "blk b3" }
    ];
    ashras.forEach(function(a){
      var blk = el("div"); blk.className = a.cls;
      var hd = el("div", a.hd); hd.className = "blkhd"; blk.appendChild(hd);
      var du = el("div", a.dua); du.className = "blkdua"; blk.appendChild(du);
      var tb = el("table"); tb.setAttribute("dir", "rtl");
      var hr = el("tr");
      ["تاریخ", "دن", "روزہ", "سحری", "افطار"].forEach(function(h){ hr.appendChild(el("th", h)); });
      tb.appendChild(hr);
      a.rows.forEach(function(r){
        var tr = el("tr"); if (r.fri) tr.className = "fri";
        tr.appendChild(el("td", r.date));
        tr.appendChild(el("td", r.wd));
        var rz = el("td", rUrduNum(r.roza)); rz.className = "rz";
        if (r.qadr){ var star = el("span", " ★"); star.className = "star"; rz.appendChild(star); }
        tr.appendChild(rz);
        var s1 = el("td", r.sehri); s1.className = "tm"; tr.appendChild(s1);
        var s2 = el("td", r.iftar); s2.className = "tm"; tr.appendChild(s2);
        tb.appendChild(tr);
      });
      blk.appendChild(tb); cols.appendChild(blk);
    });
    sheet.appendChild(cols);

    var duas = el("div"); duas.className = "duas";
    [["SEHRI KI DUA", "وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ", "اور میں نے رمضان کے کل کے روزے کی نیت کی"],
     ["IFTAR KI DUA", "اللَّهُمَّ اِنِّیْ لَکَ صُمْتُ وَبِکَ اٰمَنْتُ وَعَلَیْکَ تَوَکَّلْتُ وَعَلٰی رِزْقِکَ اَفْطَرْتُ", "اے اللہ! میں نے تیرے لیے روزہ رکھا، تجھ پر ایمان لایا، تجھ پر بھروسا کیا اور تیرے رزق سے افطار کیا"]].forEach(function(x){
      var d = el("div"); d.className = "dua";
      d.appendChild(el("h3", x[0]));
      var ar = el("div", x[1]); ar.className = "ar"; d.appendChild(ar);
      var ur = el("div", x[2]); ur.className = "ur"; d.appendChild(ur);
      duas.appendChild(d);
    });
    sheet.appendChild(duas);

    var foot = el("div"); foot.className = "foot";
    foot.appendChild(document.createTextNode("★ = تیسرے عشرے کی طاق راتیں (شبِ قدر کی تلاش) · جمعہ کی سطریں نمایاں ہیں"));
    foot.appendChild(document.createElement("br"));
    foot.appendChild(document.createTextNode("اوقات یونیورسٹی آف اسلامک سائنسز کراچی کے طریقے سے کمپیوٹ شدہ ہیں۔ پہلے روزے کی تاریخ چاند نظر آنے پر ایک دن آگے/پیچھے ہو سکتی ہے — مقامی اعلان کی تصدیق کر لیں۔ فقیہ جعفریہ کے لیے سحری تقریباً ۱۰ منٹ پہلے اور افطار تقریباً ۱۰ منٹ بعد ہے۔"));
    var br2 = el("div", "💌 PakToolkit — Ramadan Calendar Maker (muft banayein: paktoolkit.top)"); br2.className = "brand"; foot.appendChild(br2);
    sheet.appendChild(foot);

    sheetBox.textContent = "";
    sheetBox.appendChild(sheet);
  }

  [citySel, startIn, nameIn, svcIn, ph1In, ph2In, addrIn].forEach(function(inp){
    inp.addEventListener("input", buildSheet);
    inp.addEventListener("change", buildSheet);
  });
  buildSheet();

  /* ---- downloads ---- */
  function loadScript(src){
    return new Promise(function(res, rej){
      var s = document.createElement("script"); s.src = src;
      s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
  }
  var pngBtn = document.getElementById("r-png");
  if (pngBtn) pngBtn.addEventListener("click", async function(){
    status.className = "result show"; status.textContent = "Tasveer tayyar ho rahi hai…";
    try {
      if (!window.html2canvas) await loadScript("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js");
      var node = document.getElementById("r-sheet-inner");
      var canvas = await window.html2canvas(node, { scale: 2, useCORS: true, backgroundColor: "#fdfaf0" });
      var a = document.createElement("a");
      a.download = "ramadan-calendar-" + (R_CITIES[+citySel.value || 0][0] || "calendar").toLowerCase() + ".png";
      a.href = canvas.toDataURL("image/png");
      a.click();
      status.textContent = "Tasveer download ho gayi ✓ — WhatsApp par share kar dein.";
    } catch (e) {
      status.textContent = "Tasveer nahi ban saki — Print / PDF wala button istemal kar lein.";
    }
  });
  var printBtn = document.getElementById("r-print");
  if (printBtn) printBtn.addEventListener("click", function(){
    var node = document.getElementById("r-sheet-inner");
    if (!node) return;
    var ifr = document.createElement("iframe");
    ifr.style.position = "fixed"; ifr.style.right = "0"; ifr.style.bottom = "0";
    ifr.style.width = "0"; ifr.style.height = "0"; ifr.style.border = "0";
    document.body.appendChild(ifr);
    var doc = ifr.contentWindow.document;
    doc.open();
    doc.write("<!DOCTYPE html><html><head><meta charset='utf-8'><title>Ramadan Calendar</title>" +
      "<link href='https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap' rel='stylesheet'>" +
      "<style>*{box-sizing:border-box;margin:0;padding:0}body{background:#fff}" + R_CSS + ".rsheet{box-shadow:none;margin:0 auto}</style></head><body>" +
      node.outerHTML + "</body></html>");
    doc.close();
    setTimeout(function(){
      try { ifr.contentWindow.focus(); ifr.contentWindow.print(); } catch (e) {}
      setTimeout(function(){ ifr.remove(); }, 4000);
    }, 900);
  });
}

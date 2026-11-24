/* PakToolkit — Premium wedding theme (Ivory & Gold) guest renderer.
   Loaded only on the wedding tool page, after wedding.js + lifafa.js;
   the branch inside wRenderGuest calls wRenderPremium from here.
   Design: the viral interactive-invitation pattern Mazeen approved
   2026-11-24 — sealed ivory envelope with a gold wax seal, one bespoke
   floral artwork (premiumdata.js) carried through the cover, falling
   petals, scroll reveals, events timeline, venue artwork + Maps,
   Add to Calendar (.ics), countdown, and a clear Our Song button.
   All motion is CSS (transform/opacity) — no GSAP dependency — and
   every reveal carries a fail-safe so no screen can stay blank. */
var W_PREM_CSS = `
/* ================= Premium — Ivory & Gold (sty-premium) ================= */
#wguest.sty-premium{background:#e9dfc8;font-family:'Playfair Display',Georgia,serif;color:#3f3826;--pr-gold:#b8912f;--pr-gold2:#cfa73f;--pr-deep:#6d5410;--pr-ink:#3f3826;--pr-soft:#6f6450;--pr-cream:#faf5ec}
#wguest.sty-premium .pr-stage{max-width:430px;margin:0 auto;background:var(--pr-cream);min-height:100%;position:relative;overflow:hidden;box-shadow:0 0 60px rgba(60,45,10,.45)}
#wguest.sty-premium .pr-script{font-family:'Great Vibes',cursive;font-weight:400}
#wguest.sty-premium .pr-caps{letter-spacing:.38em;font-size:.72rem;color:#8a6a1d;text-transform:uppercase;text-align:center}
/* petals */
#wguest.sty-premium .pr-petals{position:fixed;top:0;bottom:0;left:0;right:0;margin:0 auto;width:min(430px,100%);overflow:hidden;pointer-events:none;z-index:30}
#wguest.sty-premium .pr-petal{position:absolute;top:-5%;border-radius:90% 4px 90% 4px;opacity:0;animation:prFall linear infinite}
@keyframes prFall{0%{transform:translate3d(0,-30px,0) rotate(0deg);opacity:0}8%{opacity:.55}50%{transform:translate3d(16px,330px,0) rotate(170deg)}92%{opacity:.5}100%{transform:translate3d(-10px,720px,0) rotate(330deg);opacity:0}}
/* envelope */
#wguest.sty-premium .pr-env{position:fixed;top:0;bottom:0;left:0;right:0;margin:0 auto;width:min(430px,100%);z-index:20;text-align:center;background:radial-gradient(120% 90% at 50% 0%,#fffdf6 0%,#faf3e3 55%,#f3e8cf 100%);transition:opacity .8s ease,transform .8s ease;cursor:pointer}
#wguest.sty-premium .pr-env.open{opacity:0;transform:scale(1.05);pointer-events:none}
#wguest.sty-premium .pr-env:before{content:"";position:absolute;inset:14px;border:1px solid rgba(184,145,47,.65);border-radius:24px;pointer-events:none}
#wguest.sty-premium .pr-env:after{content:"";position:absolute;inset:19px;border:1px solid rgba(184,145,47,.35);border-radius:20px;pointer-events:none}
#wguest.sty-premium .pr-flap{position:absolute;top:0;left:0;right:0;height:46%;background:linear-gradient(180deg,#f7ecd2,#efe0ba);clip-path:polygon(0 0,100% 0,50% 78%);filter:drop-shadow(0 3px 4px rgba(140,110,40,.25))}
#wguest.sty-premium .pr-cord{position:absolute;top:0;left:50%;width:2px;height:47%;transform:translateX(-50%);background:linear-gradient(180deg,rgba(184,145,47,0),#b8912f 30%,#b8912f)}
#wguest.sty-premium .pr-seal{position:absolute;top:40%;left:50%;transform:translate(-50%,-50%);width:96px;height:96px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ecd27c,#c39a35 55%,#8a6a1d);box-shadow:0 8px 20px rgba(120,90,20,.45),inset 0 2px 6px rgba(255,255,255,.6),inset 0 -4px 8px rgba(90,65,10,.5);display:flex;align-items:center;justify-content:center;font-family:'Great Vibes',cursive;font-size:2rem;color:#fff7dd;text-shadow:0 1px 2px rgba(90,65,10,.6);z-index:3}
#wguest.sty-premium .pr-seal:after{content:"";position:absolute;inset:9px;border:1.5px solid rgba(255,248,220,.65);border-radius:50%}
#wguest.sty-premium .pr-envtext{position:absolute;left:0;right:0;bottom:11%;padding:0 30px}
#wguest.sty-premium .pr-envsmall{letter-spacing:.4em;font-size:.68rem;color:#8a6a1d;text-transform:uppercase}
#wguest.sty-premium .pr-envnames{font-family:'Great Vibes',cursive;font-size:2.6rem;color:var(--pr-deep);margin:10px 0 4px;line-height:1.2}
#wguest.sty-premium .pr-envdate{font-size:.8rem;letter-spacing:.25em;color:#7c7261;text-transform:uppercase}
#wguest.sty-premium .pr-openbtn{margin-top:22px;font-family:inherit;cursor:pointer;background:linear-gradient(180deg,#cfa73f,#a37f24);color:#fffbef;border:none;border-radius:999px;padding:13px 34px;font-size:.95rem;letter-spacing:.12em;box-shadow:0 8px 18px rgba(140,110,40,.4)}
#wguest.sty-premium .pr-taphint{margin-top:12px;font-size:.64rem;letter-spacing:.3em;color:#a2937a;text-transform:uppercase;animation:prPulse 1.8s ease-in-out infinite}
@keyframes prPulse{0%,100%{opacity:.55}50%{opacity:1}}
/* invitation */
#wguest.sty-premium .pr-inv{opacity:0;transition:opacity .7s ease .25s}
#wguest.sty-premium .pr-inv.show{opacity:1}
#wguest.sty-premium .pr-cover{min-height:100vh;min-height:100svh;background-size:cover;background-position:center;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:104px 44px 84px}
#wguest.sty-premium .pr-bismillah{font-size:1.3rem;color:#7a6420}
#wguest.sty-premium .pr-diamond{width:9px;height:9px;background:var(--pr-gold);transform:rotate(45deg);margin:14px auto 16px}
#wguest.sty-premium .pr-names{font-family:'Great Vibes',cursive;font-size:3.4rem;line-height:1.15;color:var(--pr-deep);margin:12px 0 6px}
#wguest.sty-premium .pr-names .amp{color:#c08a94;font-size:2.4rem}
#wguest.sty-premium .pr-unames{font-size:1.05rem;color:#7a6420;margin-top:2px;line-height:2.1}
#wguest.sty-premium .pr-request{font-size:.86rem;line-height:1.75;color:#57503f;max-width:300px;margin-top:10px}
#wguest.sty-premium .pr-request b{color:var(--pr-ink)}
#wguest.sty-premium .pr-datebox{margin-top:22px;border:1px solid rgba(184,145,47,.8);background:rgba(255,255,255,.55);border-radius:12px;padding:12px 20px}
#wguest.sty-premium .pr-datebox .d1{letter-spacing:.18em;font-size:.84rem;color:#4c4326;font-weight:600;text-transform:uppercase}
#wguest.sty-premium .pr-datebox .d2{font-size:.74rem;color:#8a7a4e;margin-top:3px;letter-spacing:.08em}
#wguest.sty-premium .pr-count{display:flex;gap:7px;justify-content:center;margin-top:16px}
#wguest.sty-premium .pr-count div{background:rgba(255,255,255,.6);border:1px solid rgba(184,145,47,.65);border-radius:10px;min-width:56px;padding:7px 2px}
#wguest.sty-premium .pr-count b{display:block;font-size:1.15rem;color:var(--pr-deep)}
#wguest.sty-premium .pr-count span{font-size:.56rem;letter-spacing:.16em;text-transform:uppercase;color:#8a7a4e}
#wguest.sty-premium .pr-scrollhint{margin-top:20px;font-size:.62rem;letter-spacing:.28em;color:#8a7a4e;text-transform:uppercase}
#wguest.sty-premium .pr-sec{padding:50px 34px 6px;background:var(--pr-cream)}
#wguest.sty-premium .pr-secsub{text-align:center;font-family:'Great Vibes',cursive;font-size:1.9rem;color:var(--pr-deep);margin:6px 0 26px}
#wguest.sty-premium .pr-arch{width:min(290px,78vw);margin:0 auto;border-radius:150px 150px 14px 14px;overflow:hidden;border:3px solid var(--pr-gold);box-shadow:0 14px 34px rgba(109,84,16,.25);background:#fff}
#wguest.sty-premium .pr-arch img{display:block;width:100%}
#wguest.sty-premium .pr-couplenames{text-align:center;font-family:'Great Vibes',cursive;font-size:2rem;color:var(--pr-deep);margin-top:16px;line-height:1.25}
#wguest.sty-premium .pr-storytxt{font-size:.92rem;line-height:1.8;color:#5c4f38;white-space:pre-line;max-width:320px;margin:0 auto;text-align:center}
/* timeline */
#wguest.sty-premium .pr-timeline{position:relative;margin-left:8px;padding-bottom:4px}
#wguest.sty-premium .pr-timeline:before{content:"";position:absolute;left:5px;top:8px;bottom:8px;width:2px;background:linear-gradient(180deg,rgba(184,145,47,.15),#b8912f,rgba(184,145,47,.15))}
#wguest.sty-premium .pr-ev{position:relative;padding:0 0 28px 30px}
#wguest.sty-premium .pr-ev:before{content:"";position:absolute;left:0;top:5px;width:12px;height:12px;border-radius:50%;background:var(--pr-cream);border:3px solid var(--pr-gold)}
#wguest.sty-premium .pr-evname{font-size:1.02rem;letter-spacing:.18em;color:var(--pr-ink);font-weight:700;text-transform:uppercase}
#wguest.sty-premium .pr-evurdu{font-size:.92rem;color:#8a6a1d;line-height:1.9}
#wguest.sty-premium .pr-evdet{font-size:.84rem;color:var(--pr-soft);margin-top:3px;line-height:1.6}
/* venue */
#wguest.sty-premium .pr-venue{text-align:center}
#wguest.sty-premium .pr-venue img{width:100%;border-radius:14px;border:1px solid rgba(184,145,47,.45);display:block;background:#fff}
#wguest.sty-premium .pr-vname{font-size:1.35rem;font-weight:700;color:var(--pr-ink);margin-top:18px}
#wguest.sty-premium .pr-vaddr{font-size:.84rem;color:var(--pr-soft);margin-top:5px;line-height:1.6}
#wguest.sty-premium .pr-btns{margin-top:20px;display:flex;flex-direction:column;gap:10px}
#wguest.sty-premium .pr-btn{font-family:inherit;cursor:pointer;border-radius:999px;padding:13px 20px;font-size:.9rem;letter-spacing:.05em;text-decoration:none;display:block;text-align:center}
#wguest.sty-premium .pr-btngold{background:linear-gradient(180deg,#cfa73f,#a37f24);color:#fffbef;border:none;box-shadow:0 6px 14px rgba(140,110,40,.35)}
#wguest.sty-premium .pr-btnline{background:transparent;color:var(--pr-deep);border:1.5px solid var(--pr-gold)}
#wguest.sty-premium .pr-btnwa{background:#1faa55;color:#fff;border:none;box-shadow:0 8px 18px rgba(31,170,85,.3);font-weight:600}
/* families + faq */
#wguest.sty-premium .pr-fam{display:grid;grid-template-columns:1fr 1fr;gap:12px}
#wguest.sty-premium .pr-side{background:#fffdf8;border:1px solid #e6cf9a;border-radius:12px;padding:16px 12px;text-align:center}
#wguest.sty-premium .pr-side h4{font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:#8a6a1d}
#wguest.sty-premium .pr-side .parents{font-family:'Great Vibes',cursive;font-size:1.35rem;color:var(--pr-deep);line-height:1.3;margin:8px 0 4px}
#wguest.sty-premium .pr-side p{font-size:.72rem;color:#6b5c40;line-height:1.55}
#wguest.sty-premium .pr-contact{display:flex;justify-content:space-between;align-items:center;gap:10px;background:#fffdf8;border:1px solid #e6cf9a;border-radius:10px;padding:11px 14px;margin-top:9px;font-size:.82rem;color:#5c4f38}
#wguest.sty-premium .pr-contact a{color:var(--pr-deep);text-decoration:none;font-weight:700;white-space:nowrap}
#wguest.sty-premium .pr-faq details{background:#fffdf8;border:1px solid #e6cf9a;border-radius:10px;padding:13px 15px;margin-top:9px;text-align:left}
#wguest.sty-premium .pr-faq summary{font-weight:600;font-size:.88rem;color:var(--pr-deep);cursor:pointer}
#wguest.sty-premium .pr-faq details p{font-size:.82rem;line-height:1.6;color:#5c4f38;margin-top:7px}
#wguest.sty-premium .pr-dua{font-size:1.1rem;color:var(--pr-deep);text-align:center;line-height:2;padding:8px 20px 0}
#wguest.sty-premium .pr-foot{text-align:center;padding:24px 30px 38px;background:var(--pr-cream);font-size:.66rem;letter-spacing:.14em;color:#a2937a;text-transform:uppercase;line-height:2}
#wguest.sty-premium .pr-foot a{color:var(--pr-deep);font-weight:700;text-decoration:none;letter-spacing:.05em}
/* song pill */
#wguest.sty-premium .pr-song{position:fixed;right:14px;bottom:14px;z-index:260;display:none;align-items:center;gap:7px;background:linear-gradient(180deg,#cfa73f,#a37f24);color:#fffbef;border:none;border-radius:999px;padding:11px 18px;font-family:inherit;font-size:.85rem;letter-spacing:.05em;cursor:pointer;box-shadow:0 8px 18px rgba(140,110,40,.45)}
#wguest.sty-premium .pr-song.off{background:#7c7261}
/* reveals — with a hard fail-safe in JS */
#wguest.sty-premium .pr-rise{opacity:0;transform:translateY(26px);transition:opacity .9s ease,transform .9s ease}
#wguest.sty-premium .pr-rise.in{opacity:1;transform:none}
@media (prefers-reduced-motion: reduce){
  #wguest.sty-premium .pr-petal{animation:none}
  #wguest.sty-premium .pr-rise{transition-duration:.01s}
  #wguest.sty-premium .pr-env,#wguest.sty-premium .pr-inv{transition-duration:.01s}
  #wguest.sty-premium .pr-taphint{animation:none}
}
`;
function wInjectPremCSS(){
  if (document.getElementById("w-prem-css")) return;
  var st = document.createElement("style"); st.id = "w-prem-css"; st.textContent = W_PREM_CSS;
  document.head.appendChild(st);
}

/* ---- Premium guest view: sealed ivory envelope + gold wax seal, then
   a long ivory-and-gold invitation — artwork cover with countdown,
   optional couple section (the maker's photo), story, events timeline,
   families, FAQ, venue artwork + Maps + Calendar + WhatsApp RSVP. ---- */
function wRenderPremium(d, opts){
  opts = opts || {};
  wLoadFonts(); wInjectCSS(); wInjectPremCSS();
  document.body.style.overflow = "hidden";
  var main = (typeof d.main === "number" && d.ev[d.main]) ? d.main : Math.min(1, d.ev.length - 1);
  var mev = d.ev[main];
  var mdt = wEventDate(mev);
  var root = el("div"); root.id = "wguest";
  root.className = "pal-" + (d.pal || "maroon") + " sty-premium";
  var stage = el("div"); stage.className = "pr-stage"; root.appendChild(stage);
  /* photo: maker's upload (preview opts / #p= hash) or a built-in shot —
     it feeds the couple section; the cover is always the artwork */
  var photoSrc = null;
  if (opts.photo) photoSrc = opts.photo;
  else if (location.hash && location.hash.indexOf("#p=") === 0){
    var hp = location.hash.slice(3);
    photoSrc = "data:image/" + (hp.charAt(0) === "j" ? "jpeg" : "webp") + ";base64," + wB64UrlToStd(hp.slice(2));
  }
  else if (d.shot && window.W_SHOTS && W_SHOTS[d.shot]) photoSrc = W_SHOTS[d.shot];
  /* ---------- petals ---------- */
  var petals = el("div"); petals.className = "pr-petals";
  var pcols = ["#eec3c8", "#d9b45a", "#f2d7da", "#cfa73f"];
  for (var pi = 0; pi < 12; pi++){
    var pt = el("span"); pt.className = "pr-petal";
    var ps = 8 + Math.random() * 6;
    pt.style.left = (2 + Math.random() * 94) + "%";
    pt.style.width = ps + "px"; pt.style.height = (ps * 0.82) + "px";
    pt.style.background = pcols[pi % pcols.length];
    pt.style.animationDuration = (8 + Math.random() * 6) + "s";
    pt.style.animationDelay = (-Math.random() * 14) + "s";
    petals.appendChild(pt);
  }
  stage.appendChild(petals);
  /* ---------- envelope ---------- */
  var env = el("div"); env.className = "pr-env";
  var flap = el("div"); flap.className = "pr-flap"; env.appendChild(flap);
  var cord = el("div"); cord.className = "pr-cord"; env.appendChild(cord);
  var seal = el("div"); seal.className = "pr-seal";
  seal.title = "Seal par tap karein — kholein";
  seal.textContent = (d.g || "G").charAt(0).toUpperCase() + "&" + (d.b || "B").charAt(0).toUpperCase();
  env.appendChild(seal);
  var envText = el("div"); envText.className = "pr-envtext";
  var es1 = el("div", "You are invited"); es1.className = "pr-envsmall"; envText.appendChild(es1);
  var es2 = el("div"); es2.className = "pr-envnames";
  es2.textContent = (d.g || "") + " & " + (d.b || ""); envText.appendChild(es2);
  var es3 = el("div"); es3.className = "pr-envdate";
  es3.textContent = mdt.getDate() + " · " + mdt.toLocaleDateString("en-GB", { month: "long" }) + " · " + mdt.getFullYear();
  envText.appendChild(es3);
  var openBtn = el("button", "Dawat Kholein"); openBtn.className = "pr-openbtn"; openBtn.type = "button";
  envText.appendChild(openBtn);
  var es4 = el("div", "Tap to open"); es4.className = "pr-taphint"; envText.appendChild(es4);
  env.appendChild(envText);
  stage.appendChild(env);
  /* ---------- invitation ---------- */
  var inv = el("div"); inv.className = "pr-inv"; stage.appendChild(inv);
  /* cover */
  var cover = el("section"); cover.className = "pr-cover pr-rise";
  if (window.W_PREM_BG) cover.style.backgroundImage = "url(" + window.W_PREM_BG + ")";
  var bis = el("div", "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"); bis.className = "pr-bismillah arabic"; cover.appendChild(bis);
  var dia = el("div"); dia.className = "pr-diamond"; cover.appendChild(dia);
  var wo = el("div", "The Wedding Of"); wo.className = "pr-caps"; cover.appendChild(wo);
  var names = el("h1"); names.className = "pr-names";
  names.appendChild(document.createTextNode(d.g || ""));
  var amp = el("span", " & "); amp.className = "amp"; names.appendChild(amp);
  names.appendChild(document.createTextNode(d.b || ""));
  cover.appendChild(names);
  if (d.gu || d.bu){
    var un = el("div"); un.className = "pr-unames urdu";
    un.textContent = (d.gu || d.g || "") + " ♥ " + (d.bu || d.b || "");
    cover.appendChild(un);
  }
  var req = el("p"); req.className = "pr-request";
  var hb = el("b", d.host || ""); req.appendChild(hb);
  req.appendChild(document.createTextNode(" request the honour of your presence at the wedding of "));
  var gb = el("b", d.g || ""); req.appendChild(gb);
  if (d.gf) req.appendChild(document.createTextNode(", " + d.gf + ","));
  req.appendChild(document.createTextNode(" with "));
  var bb = el("b", d.b || ""); req.appendChild(bb);
  if (d.bf) req.appendChild(document.createTextNode(", " + d.bf));
  cover.appendChild(req);
  var dbox = el("div"); dbox.className = "pr-datebox";
  var db1 = el("div"); db1.className = "d1"; db1.textContent = wDateLong(mev).replace(", ", " · ");
  var db2 = el("div"); db2.className = "d2"; db2.textContent = (mev.n || "") + " · " + (mev.t || "") + " onwards";
  dbox.appendChild(db1); dbox.appendChild(db2); cover.appendChild(dbox);
  var count = el("div"); count.className = "pr-count";
  var cids = {};
  [["cd", "Days"], ["ch", "Hours"], ["cm", "Mins"], ["cs", "Secs"]].forEach(function(pr){
    var cell = el("div"); var cbb = el("b", "–"); cell.appendChild(cbb);
    var csp = el("span", pr[1]); cell.appendChild(csp); count.appendChild(cell); cids[pr[0]] = cbb;
  });
  cover.appendChild(count);
  var shint = el("div", "👇 Neeche dekhein"); shint.className = "pr-scrollhint"; cover.appendChild(shint);
  inv.appendChild(cover);
  /* couple section — only when a photo was given */
  var coupleBox = null;
  if (photoSrc){
    coupleBox = el("section"); coupleBox.className = "pr-sec pr-rise";
    var cp1 = el("div", "The Bride & Groom"); cp1.className = "pr-caps"; coupleBox.appendChild(cp1);
    var cp2 = el("div", "Dulha aur Dulhan"); cp2.className = "pr-secsub"; coupleBox.appendChild(cp2);
    var arch = el("div"); arch.className = "pr-arch";
    var cimg = document.createElement("img"); cimg.src = photoSrc; cimg.alt = "Couple";
    cimg.onerror = function(){ coupleBox.remove(); };
    arch.appendChild(cimg); coupleBox.appendChild(arch);
    var cn = el("div"); cn.className = "pr-couplenames";
    cn.textContent = (d.g || "") + " & " + (d.b || "");
    coupleBox.appendChild(cn);
    inv.appendChild(coupleBox);
  }
  /* our story */
  if (d.story){
    var sts = el("section"); sts.className = "pr-sec pr-rise";
    var st1 = el("div", "Our Story"); st1.className = "pr-caps"; sts.appendChild(st1);
    var st2 = el("div", "Hamari Kahani"); st2.className = "pr-secsub"; sts.appendChild(st2);
    var stp = el("p"); stp.className = "pr-storytxt"; stp.textContent = d.story; sts.appendChild(stp);
    inv.appendChild(sts);
  }
  /* events timeline */
  var evs = el("section"); evs.className = "pr-sec pr-rise";
  var ev1 = el("div", "Wedding Festivities"); ev1.className = "pr-caps"; evs.appendChild(ev1);
  var ev2 = el("div", "Dawati Taqreebat"); ev2.className = "pr-secsub"; evs.appendChild(ev2);
  var tl = el("div"); tl.className = "pr-timeline";
  d.ev.forEach(function(ev, i){
    var e1 = el("div"); e1.className = "pr-ev";
    var en = el("div", ev.n || ""); en.className = "pr-evname"; e1.appendChild(en);
    var eu = (typeof wEventUrdu === "function") ? wEventUrdu(ev.n) : "";
    if (eu){ var euu = el("div", eu); euu.className = "pr-evurdu urdu"; e1.appendChild(euu); }
    var ed = el("div"); ed.className = "pr-evdet";
    ed.textContent = wDateLong(ev) + " · " + (ev.t || "") + " onwards";
    e1.appendChild(ed);
    var evn = ev.vn || (i === main ? d.venue : "");
    if (evn){ var evv = el("div", evn); evv.className = "pr-evdet"; e1.appendChild(evv); }
    tl.appendChild(e1);
  });
  evs.appendChild(tl);
  inv.appendChild(evs);
  /* families */
  if (d.fam && d.fam.some(function(x){ return !!x; })){
    var fm = el("section"); fm.className = "pr-sec pr-rise";
    var f1 = el("div", "The Families"); f1.className = "pr-caps"; fm.appendChild(f1);
    var f2 = el("div", "With the blessings of"); f2.className = "pr-secsub"; fm.appendChild(f2);
    var fgrid = el("div"); fgrid.className = "pr-fam";
    [["Groom's Side", d.fam[0], "request the honour of your presence at the wedding of their son"],
     ["Bride's Side", d.fam[1], "request the honour of your presence at the wedding of their daughter"]].forEach(function(sd){
      var side = el("div"); side.className = "pr-side";
      var h4 = el("h4", sd[0]); side.appendChild(h4);
      var par = el("div", sd[1] || "—"); par.className = "parents"; side.appendChild(par);
      var pp = el("p", sd[2]); side.appendChild(pp);
      fgrid.appendChild(side);
    });
    fm.appendChild(fgrid);
    [[d.fam[2], d.fam[3]], [d.fam[4], d.fam[5]]].forEach(function(ct){
      if (!ct[0] && !ct[1]) return;
      var row = el("div"); row.className = "pr-contact";
      var lab = el("span", ct[0] || "Rabta"); row.appendChild(lab);
      if (ct[1]){ var ca = el("a", "+" + ct[1]); ca.href = "tel:+" + ct[1]; row.appendChild(ca); }
      fm.appendChild(row);
    });
    inv.appendChild(fm);
  }
  /* FAQ */
  if (d.faq && d.faq.length){
    var fq = el("section"); fq.className = "pr-sec pr-rise pr-faq";
    var q1 = el("div", "A Few Questions"); q1.className = "pr-caps"; fq.appendChild(q1);
    var q2 = el("div", "Good to know"); q2.className = "pr-secsub"; fq.appendChild(q2);
    d.faq.forEach(function(pair){
      var det = el("details");
      var sum = el("summary", pair[0] || ""); det.appendChild(sum);
      var ans = el("p", pair[1] || ""); det.appendChild(ans);
      fq.appendChild(det);
    });
    inv.appendChild(fq);
  }
  /* venue */
  var vn = el("section"); vn.className = "pr-sec pr-rise pr-venue";
  var v1 = el("div", "The Venue"); v1.className = "pr-caps"; vn.appendChild(v1);
  var vsp = el("div"); vsp.style.height = "18px"; vn.appendChild(vsp);
  if (window.W_PREM_VENUE){
    var vimg = document.createElement("img"); vimg.src = window.W_PREM_VENUE; vimg.alt = "Venue illustration";
    vn.appendChild(vimg);
  }
  var vname = el("div", d.venue || ""); vname.className = "pr-vname"; vn.appendChild(vname);
  if (d.addr){ var vaddr = el("div", d.addr); vaddr.className = "pr-vaddr"; vn.appendChild(vaddr); }
  if (d.dress){ var vdr = el("div", "👗 Dress code: " + d.dress); vdr.className = "pr-vaddr"; vn.appendChild(vdr); }
  var btns = el("div"); btns.className = "pr-btns";
  var calB = el("button", "📅 Add to Calendar"); calB.className = "pr-btn pr-btngold"; calB.type = "button";
  calB.addEventListener("click", function(){ wDownloadICS(d, mev); });
  btns.appendChild(calB);
  var mapA = el("a", "📍 Google Maps — Rasta Dekhein"); mapA.className = "pr-btn pr-btnline";
  mapA.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent((d.venue || "") + ", " + (d.addr || ""));
  mapA.target = "_blank"; mapA.rel = "noopener"; btns.appendChild(mapA);
  if (d.rsvp){
    var wa = el("a", "✅ WhatsApp par RSVP"); wa.className = "pr-btn pr-btnwa";
    wa.href = "https://wa.me/" + d.rsvp + "?text=" + encodeURIComponent("Assalam-o-Alaikum! Main " + (d.g || "") + " & " + (d.b || "") + " ki shaadi mein shirkat ki tasdeeq karta hoon.");
    wa.target = "_blank"; wa.rel = "noopener"; btns.appendChild(wa);
  }
  vn.appendChild(btns);
  inv.appendChild(vn);
  var dua = el("div", "بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ");
  dua.className = "pr-dua arabic"; inv.appendChild(dua);
  var foot = el("div"); foot.className = "pr-foot";
  foot.appendChild(document.createTextNode("Premium Design"));
  foot.appendChild(document.createElement("br"));
  var ba = el("a", "PakToolkit Wedding Invitation Maker"); ba.href = "https://paktoolkit.top/wedding-invitation-maker/";
  foot.appendChild(ba);
  foot.appendChild(document.createElement("br"));
  foot.appendChild(document.createTextNode("Apna muft banayein"));
  inv.appendChild(foot);
  /* song pill — a clear guest-facing music button (brief: "Our Song") */
  var song = el("button", "🎵 Our Song"); song.className = "pr-song"; song.type = "button";
  song.title = "Gaana on/off"; root.appendChild(song);
  document.body.appendChild(root);
  /* ---------- interactions ---------- */
  var tune = null, pvAudio = null;
  if (opts.preview){
    var closeB = el("button", "✕"); closeB.className = "sndbtn";
    closeB.style.left = "14px"; closeB.style.right = "auto"; closeB.style.display = "flex";
    closeB.title = "Band karein — maker par wapas";
    closeB.addEventListener("click", function(){
      if (tune && tune.stop) tune.stop();
      if (pvAudio) pvAudio.pause();
      root.remove(); document.body.style.overflow = "";
    });
    root.appendChild(closeB);
  }
  function armReveals(){
    var nodes = root.querySelectorAll(".pr-rise");
    if ("IntersectionObserver" in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
      }, { root: root, threshold: 0.15 });
      nodes.forEach(function(n){ io.observe(n); });
    } else {
      nodes.forEach(function(n){ n.classList.add("in"); });
    }
    /* fail-safes: the cover must never stay blank, and nothing may
       stay hidden if the observer misbehaves */
    setTimeout(function(){ cover.classList.add("in"); }, 1600);
    setTimeout(function(){ nodes.forEach(function(n){ n.classList.add("in"); }); }, 4500);
  }
  var opened = false;
  function openPrem(){
    if (opened) return; opened = true;
    if (opts.preview && wMp3){
      pvAudio = new Audio(wMp3.url); pvAudio.loop = true;
      pvAudio.play().then(function(){ song.style.display = "flex"; }).catch(function(){});
      tune = { playing: true };
    } else if (d.tune && d.tune !== "none"){
      tune = wTuneStart(d.tune, null);
      if (tune) song.style.display = "flex";
    }
    env.classList.add("open");
    inv.classList.add("show");
    root.scrollTop = 0;
    setTimeout(function(){ env.style.display = "none"; }, 900);
    armReveals();
  }
  env.addEventListener("click", openPrem);
  openBtn.addEventListener("click", function(e){ e.stopPropagation(); openPrem(); });
  var songOn = true;
  song.addEventListener("click", function(){
    if (pvAudio){
      if (pvAudio.paused){ pvAudio.play(); songOn = true; }
      else { pvAudio.pause(); songOn = false; }
    } else if (tune && tune.stop){
      if (songOn){ tune.stop(); songOn = false; }
      else { tune.resume(); songOn = true; }
    } else return;
    song.textContent = songOn ? "🎵 Our Song" : "🔇 Song Off";
    song.classList.toggle("off", !songOn);
  });
  var target = wEventDate(mev).getTime();
  function tick(){
    var diff = Math.max(0, target - Date.now());
    cids.cd.textContent = Math.floor(diff / 86400000);
    cids.ch.textContent = ("0" + (Math.floor(diff / 3600000) % 24)).slice(-2);
    cids.cm.textContent = ("0" + (Math.floor(diff / 60000) % 60)).slice(-2);
    cids.cs.textContent = ("0" + (Math.floor(diff / 1000) % 60)).slice(-2);
  }
  tick(); setInterval(tick, 1000);
}

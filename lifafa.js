/* PakToolkit — Mehroon Lifafa guest renderer + styles.
   Loaded only on the wedding tool page, after wedding.js; the
   branch inside wRenderGuest calls wRenderLifafa from here. */
var W_LIFAFA_CSS = `
/* ================= Mehroon Lifafa (sty-lifafa) =================
   Cream envelope + maroon wax seal, then a long maroon-and-cream card:
   hero, bismillah, guest chips, countdown, per-event cards, families,
   FAQ, RSVP. Motion is transform/opacity only; GSAP drives it when
   present, CSS classes (.nogsap) carry the same beats without it. */
#wguest.sty-lifafa{background:#faf3e7;scroll-behavior:smooth;--lf-maroon:#5f1220;--lf-deep:#43091a;--lf-soft:#7a2233;--lf-gold:#c9a24b;--lf-gold2:#e6cf9a;--lf-cream:#faf3e7}
#wguest.sty-lifafa .lf-script{font-family:'Great Vibes',cursive;font-weight:400}
#wguest.sty-lifafa .lf-env{position:absolute;inset:0;z-index:90;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px 20px;background:radial-gradient(120% 90% at 50% 0%,#7a2233 0%,var(--lf-maroon) 55%,var(--lf-deep) 100%);cursor:pointer}
#wguest.sty-lifafa .lf-envnames{text-align:center;margin-bottom:30px;color:var(--lf-cream)}
#wguest.sty-lifafa .lf-envnames .lf-script{font-size:2.5rem;color:var(--lf-gold2);line-height:1.2}
#wguest.sty-lifafa .lf-envnames p{letter-spacing:.28em;font-size:.68rem;text-transform:uppercase;color:#e9d9bd;margin-top:8px}
#wguest.sty-lifafa .lf-envelope{position:relative;width:min(320px,86vw);height:216px;flex:none}
#wguest.sty-lifafa .lf-envbody{position:absolute;inset:0;background:linear-gradient(160deg,#fdf8ee,#efe0c6);border-radius:8px;box-shadow:0 24px 50px rgba(0,0,0,.45);overflow:hidden}
#wguest.sty-lifafa .lf-envbody:before,#wguest.sty-lifafa .lf-envbody:after{content:"";position:absolute;top:0;bottom:0;width:52%;background:linear-gradient(105deg,rgba(201,162,75,.16),rgba(201,162,75,0) 60%);z-index:1}
#wguest.sty-lifafa .lf-envbody:before{left:0;clip-path:polygon(0 0,100% 50%,0 100%)}
#wguest.sty-lifafa .lf-envbody:after{right:0;clip-path:polygon(100% 0,0 50%,100% 100%)}
#wguest.sty-lifafa .lf-envcard{position:absolute;left:14px;right:14px;top:10px;height:170px;background:#fffdf8;border:1px solid var(--lf-gold2);border-radius:6px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:16px;gap:2px;transition:transform 1s ease .45s}
#wguest.sty-lifafa .lf-envcard .lf-script{font-size:1.6rem;color:var(--lf-maroon)}
#wguest.sty-lifafa .lf-envcard span{font-size:.62rem;letter-spacing:.24em;text-transform:uppercase;color:#8a6d3b}
#wguest.sty-lifafa .lf-flap{position:absolute;left:0;right:0;top:0;height:118px;background:linear-gradient(180deg,#f6ecd7,#ecd9b8);clip-path:polygon(0 0,100% 0,50% 100%);transform-origin:top center;transition:transform .85s ease;z-index:3}
#wguest.sty-lifafa .lf-seal{position:absolute;left:50%;top:104px;transform:translate(-50%,0);width:86px;height:86px;z-index:4;transition:transform .5s ease,opacity .5s ease}
#wguest.sty-lifafa .lf-seal .blob{position:absolute;inset:0;background:radial-gradient(circle at 35% 30%,#93354a,var(--lf-maroon) 62%,var(--lf-deep));border-radius:48% 52% 55% 45%/52% 46% 54% 48%;box-shadow:0 8px 18px rgba(0,0,0,.4),inset 0 2px 6px rgba(255,255,255,.25),inset 0 -4px 8px rgba(0,0,0,.35)}
#wguest.sty-lifafa .lf-seal .ring{position:absolute;inset:11px;border:1.5px solid rgba(230,207,154,.85);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--lf-gold2);font-family:'Great Vibes',cursive;font-size:1.4rem;padding-top:4px}
#wguest.sty-lifafa .lf-env.open .lf-seal{transform:translate(-50%,0) scale(1.25) rotate(-14deg);opacity:0}
#wguest.sty-lifafa .lf-env.open .lf-flap{transform:rotateX(178deg);z-index:0}
#wguest.sty-lifafa .lf-env.open .lf-envcard{transform:translateY(-96px)}
#wguest.sty-lifafa .lf-env.fading{opacity:0;transition:opacity .7s ease}
#wguest.sty-lifafa .lf-taphint{margin-top:34px;color:#e9d9bd;font-size:.78rem;letter-spacing:.3em;text-transform:uppercase;animation:lfPulse 1.8s ease-in-out infinite}
@keyframes lfPulse{0%,100%{opacity:.55}50%{opacity:1}}
#wguest.sty-lifafa .lf-inv{max-width:560px;margin:0 auto;padding-bottom:8px}
#wguest.sty-lifafa .lf-hero{padding:34px 22px 4px;text-align:center}
#wguest.sty-lifafa .lf-arch{width:min(300px,80vw);margin:0 auto;border-radius:150px 150px 14px 14px;overflow:hidden;border:3px solid var(--lf-gold);box-shadow:0 14px 34px rgba(95,18,32,.28);background:#fff}
#wguest.sty-lifafa .lf-arch img{display:block;width:100%}
#wguest.sty-lifafa .lf-names{font-family:'Great Vibes',cursive;font-weight:400;font-size:2.9rem;color:var(--lf-maroon);line-height:1.25;margin-top:20px}
#wguest.sty-lifafa .lf-names .amp{color:var(--lf-gold);font-size:2rem}
#wguest.sty-lifafa .lf-when{letter-spacing:.2em;font-size:.72rem;text-transform:uppercase;color:#8a6d3b;margin-top:6px}
#wguest.sty-lifafa .lf-rule{display:flex;align-items:center;gap:10px;margin:18px auto 2px;width:70%;color:var(--lf-gold)}
#wguest.sty-lifafa .lf-rule:before,#wguest.sty-lifafa .lf-rule:after{content:"";flex:1;height:1px;background:linear-gradient(90deg,transparent,var(--lf-gold),transparent)}
#wguest.sty-lifafa .lf-card{background:#fffdf8;border:1px solid var(--lf-gold2);border-radius:14px;margin:18px;padding:24px 20px;box-shadow:0 8px 22px rgba(95,18,32,.08);text-align:center}
#wguest.sty-lifafa .lf-mehrab{height:54px;background:var(--lf-maroon);border-radius:12px 12px 50% 50%/12px 12px 26px 26px;display:flex;align-items:center;justify-content:center;color:var(--lf-gold2);letter-spacing:.3em;font-size:.66rem;text-transform:uppercase;margin:-24px -20px 18px}
#wguest.sty-lifafa .lf-card .bismillah{font-size:1.6rem;color:var(--lf-maroon)}
#wguest.sty-lifafa .lf-card .tr{font-size:.82rem;color:#7a6a55;font-style:italic;margin-top:2px}
#wguest.sty-lifafa .lf-card h2.lf-script{font-size:2rem;color:var(--lf-maroon);margin:14px 0 6px}
#wguest.sty-lifafa .lf-card p{font-size:.92rem;line-height:1.65;color:#5c4a38}
#wguest.sty-lifafa .lf-maroon{background:linear-gradient(170deg,var(--lf-soft),var(--lf-maroon) 40%,var(--lf-deep));color:#f6e8d2;margin:18px;border-radius:14px;padding:26px 20px;box-shadow:0 12px 28px rgba(67,9,26,.35)}
#wguest.sty-lifafa .lf-maroon h2.lf-script{font-size:2.1rem;color:var(--lf-gold2);text-align:center}
#wguest.sty-lifafa .lf-maroon .msg{text-align:center;font-size:.9rem;line-height:1.7;color:#efdfc2;margin-top:8px}
#wguest.sty-lifafa .lf-chips{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:18px}
#wguest.sty-lifafa .lf-chips a{text-decoration:none;color:var(--lf-cream);border:1px solid rgba(230,207,154,.65);padding:7px 14px;border-radius:999px;font-size:.82rem;background:rgba(255,255,255,.06);text-align:center}
#wguest.sty-lifafa .lf-chips a small{display:block;font-size:.78rem;color:var(--lf-gold2);line-height:1.9}
#wguest.sty-lifafa .lf-count{display:flex;gap:9px;justify-content:center;flex-wrap:wrap}
#wguest.sty-lifafa .lf-count div{background:#fffdf8;border:1px solid var(--lf-gold2);border-radius:10px;min-width:66px;padding:10px 4px;text-align:center}
#wguest.sty-lifafa .lf-count b{display:block;font-size:1.45rem;color:var(--lf-maroon)}
#wguest.sty-lifafa .lf-count span{font-size:.62rem;letter-spacing:.18em;text-transform:uppercase;color:#8a6d3b}
#wguest.sty-lifafa .lf-sectitle{text-align:center;margin:30px 18px 2px}
#wguest.sty-lifafa .lf-sectitle .lf-script{font-size:2.2rem;color:var(--lf-maroon)}
#wguest.sty-lifafa .lf-sectitle p{font-size:.7rem;letter-spacing:.26em;text-transform:uppercase;color:#8a6d3b}
#wguest.sty-lifafa .lf-event{background:linear-gradient(165deg,#6d1626,var(--lf-maroon) 45%,var(--lf-deep));border:1px solid rgba(201,162,75,.55);border-radius:16px;margin:16px 18px;padding:24px 20px;color:#f6e8d2;box-shadow:0 12px 26px rgba(67,9,26,.3);scroll-margin-top:14px}
#wguest.sty-lifafa .lf-event .urdu{display:block;text-align:center;font-size:1.05rem;color:var(--lf-gold2);line-height:2}
#wguest.sty-lifafa .lf-event h3.lf-script{font-size:2.3rem;text-align:center;color:#fdf3dd;line-height:1.15}
#wguest.sty-lifafa .lf-rows{margin-top:12px;font-size:.9rem;line-height:1.5}
#wguest.sty-lifafa .lf-rows div{display:flex;gap:10px;padding:7px 0;border-top:1px dashed rgba(230,207,154,.35)}
#wguest.sty-lifafa .lf-rows b{color:var(--lf-gold2);font-weight:500;min-width:64px;flex:none}
#wguest.sty-lifafa .lf-btns{display:flex;gap:9px;margin-top:16px}
#wguest.sty-lifafa .lf-btns a{flex:1;text-align:center;text-decoration:none;font-size:.82rem;font-weight:600;padding:11px 6px;border-radius:999px}
#wguest.sty-lifafa .lf-btnmap{background:var(--lf-gold);color:#3d2404}
#wguest.sty-lifafa .lf-btncal{border:1px solid var(--lf-gold2);color:var(--lf-gold2)}
#wguest.sty-lifafa .lf-scratchlbl{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--lf-gold2);text-align:center;margin:16px 0 8px}
#wguest.sty-lifafa .lf-fam{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:12px 18px 0}
#wguest.sty-lifafa .lf-side{background:#fffdf8;border:1px solid var(--lf-gold2);border-radius:12px;padding:16px 12px;text-align:center}
#wguest.sty-lifafa .lf-side h4{font-size:.66rem;letter-spacing:.2em;text-transform:uppercase;color:#8a6d3b}
#wguest.sty-lifafa .lf-side .parents{font-family:'Great Vibes',cursive;font-size:1.4rem;color:var(--lf-maroon);line-height:1.3;margin:8px 0 4px}
#wguest.sty-lifafa .lf-side p{font-size:.76rem;color:#6b5844;line-height:1.55}
#wguest.sty-lifafa .lf-contacts{margin:0 18px}
#wguest.sty-lifafa .lf-contact{display:flex;justify-content:space-between;align-items:center;gap:10px;background:#fffdf8;border:1px solid var(--lf-gold2);border-radius:10px;padding:11px 14px;margin-top:9px;font-size:.85rem;color:#5c4a38}
#wguest.sty-lifafa .lf-contact a{color:var(--lf-maroon);text-decoration:none;font-weight:700;white-space:nowrap}
#wguest.sty-lifafa .lf-faq{margin:6px 18px 0}
#wguest.sty-lifafa .lf-faq details{background:#fffdf8;border:1px solid var(--lf-gold2);border-radius:10px;padding:13px 15px;margin-top:9px}
#wguest.sty-lifafa .lf-faq summary{font-weight:600;font-size:.9rem;color:var(--lf-maroon);cursor:pointer}
#wguest.sty-lifafa .lf-faq details p{font-size:.85rem;line-height:1.6;color:#5c4a38;margin-top:7px}
#wguest.sty-lifafa .lf-venue{text-align:center;font-size:.95rem;line-height:1.6;color:#5c4a38}
#wguest.sty-lifafa .lf-venue b{color:var(--lf-maroon);font-size:1.05rem}
#wguest.sty-lifafa .lf-rsvpbtn{display:inline-block;background:#1faa55;color:#fff;text-decoration:none;font-weight:600;font-size:.95rem;padding:13px 30px;border-radius:999px;box-shadow:0 10px 22px rgba(31,170,85,.3);margin-top:14px}
#wguest.sty-lifafa .lf-mapbtn{display:inline-block;border:1px solid var(--lf-gold);color:var(--lf-maroon);text-decoration:none;font-weight:600;font-size:.85rem;padding:10px 22px;border-radius:999px;margin-top:12px}
#wguest.sty-lifafa .lf-icsbtn{display:inline-block;background:var(--lf-gold);border:none;color:#3d2404;font-weight:600;font-size:.85rem;padding:10px 22px;border-radius:999px;margin:10px 0 0 8px;cursor:pointer;font-family:inherit}
#wguest.sty-lifafa .lf-dua{font-size:1.15rem;color:var(--lf-maroon);text-align:center;margin-top:18px;line-height:2}
#wguest.sty-lifafa .lf-brand{text-align:center;padding:20px 12px 30px;font-size:.78rem;color:#9b8465}
#wguest.sty-lifafa .lf-brand a{color:var(--lf-maroon);font-weight:700}
#wguest.sty-lifafa.nogsap .lf-rise{opacity:0;transform:translateY(26px);transition:opacity .8s ease,transform .8s cubic-bezier(.22,.8,.3,1)}
#wguest.sty-lifafa.nogsap .lf-rise.in{opacity:1;transform:none}
`;
function wInjectLifafaCSS(){
  if (document.getElementById("w-lifafa-css")) return;
  var st = document.createElement("style"); st.id = "w-lifafa-css"; st.textContent = W_LIFAFA_CSS;
  document.head.appendChild(st);
}
/* ---- Mehroon Lifafa guest view: envelope + wax seal opening, then a
   long invitation — hero, bismillah, event chips, countdown, per-event
   cards (the main event carries the scratch date), families, FAQ, RSVP.
   Animations: GSAP when present (transform/opacity only, whole-line
   text fades — never letter splits), CSS-class fallback otherwise. ---- */
function wRenderLifafa(d, opts){
  opts = opts || {};
  wLoadFonts(); wInjectCSS(); wInjectLifafaCSS();
  document.body.style.overflow = "hidden";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var useGsap = !!window.gsap && !reduced;
  var main = (typeof d.main === "number" && d.ev[d.main]) ? d.main : Math.min(1, d.ev.length - 1);
  var mev = d.ev[main];
  var root = el("div"); root.id = "wguest";
  root.className = "pal-" + (d.pal || "maroon") + " sty-lifafa" + (useGsap ? "" : " nogsap");
  var coverSrc = null;
  if (opts.photo) coverSrc = opts.photo;
  else if (location.hash && location.hash.indexOf("#p=") === 0){
    var hp = location.hash.slice(3);
    coverSrc = "data:image/" + (hp.charAt(0) === "j" ? "jpeg" : "webp") + ";base64," + wB64UrlToStd(hp.slice(2));
  }
  else if (d.shot && window.W_SHOTS && W_SHOTS[d.shot]) coverSrc = W_SHOTS[d.shot];
  else if (window.W_LIFAFA) coverSrc = window.W_LIFAFA;
  /* ---------- envelope scene ---------- */
  var env = el("div"); env.className = "lf-env";
  var envNames = el("div"); envNames.className = "lf-envnames";
  var enScript = el("div"); enScript.className = "lf-script";
  enScript.textContent = (d.g || "") + " & " + (d.b || ""); envNames.appendChild(enScript);
  var enSub = el("p", "You are cordially invited"); envNames.appendChild(enSub);
  env.appendChild(envNames);
  var envBox = el("div"); envBox.className = "lf-envelope";
  var envBody = el("div"); envBody.className = "lf-envbody"; envBox.appendChild(envBody);
  var envCard = el("div"); envCard.className = "lf-envcard";
  var ec1 = el("span", "The Wedding Of"); envCard.appendChild(ec1);
  var ec2 = el("div"); ec2.className = "lf-script"; ec2.textContent = (d.g || "") + " & " + (d.b || ""); envCard.appendChild(ec2);
  envBox.appendChild(envCard);
  var flap = el("div"); flap.className = "lf-flap"; envBox.appendChild(flap);
  var seal = el("div"); seal.className = "lf-seal";
  var blob = el("div"); blob.className = "blob"; seal.appendChild(blob);
  var ring = el("div", (d.g || "G").charAt(0).toUpperCase() + "✦" + (d.b || "B").charAt(0).toUpperCase()); ring.className = "ring"; seal.appendChild(ring);
  envBox.appendChild(seal);
  env.appendChild(envBox);
  var tapHint = el("div", "Tap to Open"); tapHint.className = "lf-taphint"; env.appendChild(tapHint);
  root.appendChild(env);
  var snd = el("button", "🔊"); snd.className = "sndbtn"; snd.title = "Sound on/off"; root.appendChild(snd);
  /* ---------- invitation ---------- */
  var inv = el("div"); inv.className = "lf-inv"; root.appendChild(inv);
  var hero = el("section"); hero.className = "lf-hero";
  var arch = el("div"); arch.className = "lf-arch";
  if (coverSrc){
    var himg = document.createElement("img"); himg.src = coverSrc; himg.alt = "Couple";
    himg.onerror = function(){ arch.remove(); };
    arch.appendChild(himg); hero.appendChild(arch);
  }
  var names = el("h1"); names.className = "lf-names";
  names.appendChild(document.createTextNode(d.g || ""));
  var amp = el("span", " & "); amp.className = "amp"; names.appendChild(amp);
  names.appendChild(document.createElement("br"));
  names.appendChild(document.createTextNode(d.b || ""));
  hero.appendChild(names);
  var when = el("div"); when.className = "lf-when";
  when.textContent = wDateLong(mev) + (d.addr ? " · " + d.addr : "");
  hero.appendChild(when);
  var rule = el("div", "✦"); rule.className = "lf-rule"; hero.appendChild(rule);
  inv.appendChild(hero);
  /* bismillah + hosts */
  var bc = el("section"); bc.className = "lf-card lf-rise";
  var mh = el("div", "With Love"); mh.className = "lf-mehrab"; bc.appendChild(mh);
  var bis = el("div"); bis.className = "bismillah arabic"; bis.textContent = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"; bc.appendChild(bis);
  var tr = el("div", "In the name of Allah, the Most Gracious, the Most Merciful"); tr.className = "tr"; bc.appendChild(tr);
  var bh2 = el("h2", "We cannot wait to celebrate with you"); bh2.className = "lf-script"; bc.appendChild(bh2);
  var bp = el("p");
  bp.appendChild(document.createTextNode((d.host || "") + " request the honour of your presence at the wedding of "));
  var bpg = el("b", d.g || ""); bp.appendChild(bpg);
  if (d.gf){ bp.appendChild(document.createElement("br")); bp.appendChild(document.createTextNode(d.gf)); }
  bp.appendChild(document.createElement("br"));
  bp.appendChild(document.createTextNode("— ♥ weds ♥ —"));
  bp.appendChild(document.createElement("br"));
  var bpb = el("b", d.b || ""); bp.appendChild(bpb);
  if (d.bf){ bp.appendChild(document.createElement("br")); bp.appendChild(document.createTextNode(d.bf)); }
  bc.appendChild(bp);
  if (d.gu || d.bu){ var un = el("div"); un.className = "urdu"; un.style.cssText = "font-size:1.1rem;color:#5f1220;margin-top:8px"; un.textContent = (d.gu || d.g) + " ♥ " + (d.bu || d.b); bc.appendChild(un); }
  inv.appendChild(bc);
  /* dear guests + chips */
  var dg = el("section"); dg.className = "lf-maroon lf-rise";
  var dgh = el("h2", "Dear Guests,"); dgh.className = "lf-script"; dg.appendChild(dgh);
  var dgm = el("p", "Har taqreeb ki tafseel neeche hai — kisi bhi taqreeb par tap karein, seedha us ki maloomat par pahunchein ge."); dgm.className = "msg"; dg.appendChild(dgm);
  var chips = el("div"); chips.className = "lf-chips";
  d.ev.forEach(function(ev, i){
    var a = document.createElement("a"); a.href = "#lf-ev-" + i;
    a.appendChild(document.createTextNode(ev.n));
    var eu = wEventUrdu(ev.n);
    if (eu){ var sm = el("small", eu); sm.className = "urdu"; a.appendChild(sm); }
    chips.appendChild(a);
  });
  dg.appendChild(chips); inv.appendChild(dg);
  /* countdown */
  var cTitle = el("div"); cTitle.className = "lf-sectitle lf-rise";
  var ct1 = el("div", "Counting the Moments"); ct1.className = "lf-script"; cTitle.appendChild(ct1);
  var ct2 = el("p", "Until the " + (mev.n || "Wedding")); cTitle.appendChild(ct2);
  inv.appendChild(cTitle);
  var cc = el("section"); cc.className = "lf-card lf-rise"; cc.style.marginTop = "12px";
  var count = el("div"); count.className = "lf-count";
  var cids = {};
  [["cd", "Days"], ["ch", "Hours"], ["cm", "Minutes"], ["cs", "Seconds"]].forEach(function(pr){
    var cell = el("div"); var bb = el("b", "–"); cell.appendChild(bb);
    var sp = el("span", pr[1]); cell.appendChild(sp); count.appendChild(cell); cids[pr[0]] = bb;
  });
  cc.appendChild(count); inv.appendChild(cc);
  /* events */
  var eTitle = el("div"); eTitle.className = "lf-sectitle lf-rise";
  var et1 = el("div", "The Celebrations"); et1.className = "lf-script"; eTitle.appendChild(et1);
  var et2 = el("p", d.ev.length + " Gatherings"); eTitle.appendChild(et2);
  inv.appendChild(eTitle);
  var scratchCanvas = null;
  function lfCalUrl(ev){
    var s = wEventDate(ev), e2 = new Date(s.getTime() + 3 * 3600000);
    function st(dt){ return dt.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); }
    return "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
      encodeURIComponent(ev.n + " — " + (d.g || "") + " & " + (d.b || "")) +
      "&dates=" + st(s) + "/" + st(e2) + "&location=" + encodeURIComponent(ev.vn || d.venue || "");
  }
  d.ev.forEach(function(ev, i){
    var card = el("section"); card.className = "lf-event lf-rise"; card.id = "lf-ev-" + i;
    var eu = wEventUrdu(ev.n);
    if (eu){ var us = el("span", eu); us.className = "urdu"; card.appendChild(us); }
    var h3 = el("h3", ev.n); h3.className = "lf-script"; card.appendChild(h3);
    var rows = el("div"); rows.className = "lf-rows";
    [["Date", wDateLong(ev)], ["Time", (ev.t || "") + " onwards"], ["Venue", ev.vn || (i === main ? ((d.venue || "") + (d.addr ? ", " + d.addr : "")) : "")]].forEach(function(rw){
      if (!rw[1]) return;
      var row = el("div"); var rb = el("b", rw[0]); row.appendChild(rb);
      var rs = el("span", rw[1]); row.appendChild(rs); rows.appendChild(row);
    });
    card.appendChild(rows);
    if (i === main){
      var sl = el("div", "Scratch to reveal the date"); sl.className = "lf-scratchlbl"; card.appendChild(sl);
      var sbox = el("div"); sbox.className = "scratchbox";
      var sdate = el("div"); sdate.className = "scratchdate";
      var sd1 = el("div"); sd1.className = "d1"; sd1.textContent = wDateLong(ev); sdate.appendChild(sd1);
      var sd2 = el("div"); sd2.className = "d2"; sd2.textContent = ev.n + " · " + (ev.t || "") + " onwards"; sdate.appendChild(sd2);
      sbox.appendChild(sdate);
      scratchCanvas = document.createElement("canvas"); scratchCanvas.id = "wscratch"; scratchCanvas.width = 290; scratchCanvas.height = 96;
      sbox.appendChild(scratchCanvas); card.appendChild(sbox);
      var sh = el("div", "👆 Ungli se raghrein — tareekh zahir hogi"); sh.className = "lf-scratchlbl"; card.appendChild(sh);
    }
    var btns = el("div"); btns.className = "lf-btns";
    var mapA = el("a", "📍 View on Map"); mapA.className = "lf-btnmap";
    mapA.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ev.vn || ((d.venue || "") + ", " + (d.addr || "")));
    mapA.target = "_blank"; mapA.rel = "noopener"; btns.appendChild(mapA);
    var calA = el("a", "📅 Add to Calendar"); calA.className = "lf-btncal";
    calA.href = lfCalUrl(ev); calA.target = "_blank"; calA.rel = "noopener"; btns.appendChild(calA);
    card.appendChild(btns);
    inv.appendChild(card);
  });
  /* families */
  if (d.fam && d.fam.some(function(x){ return !!x; })){
    var fTitle = el("div"); fTitle.className = "lf-sectitle lf-rise";
    var ft1 = el("div", "The Families"); ft1.className = "lf-script"; fTitle.appendChild(ft1);
    var ft2 = el("p", "With the blessings of"); fTitle.appendChild(ft2);
    inv.appendChild(fTitle);
    var famBox = el("div"); famBox.className = "lf-fam lf-rise";
    [["Groom's Side", d.fam[0], "request the honour of your presence at the wedding of their son"],
     ["Bride's Side", d.fam[1], "request the honour of your presence at the wedding of their daughter"]].forEach(function(sd){
      var side = el("div"); side.className = "lf-side lf-stagger";
      var sh4 = el("h4", sd[0]); side.appendChild(sh4);
      var par = el("div", sd[1] || "—"); par.className = "parents"; side.appendChild(par);
      var sp2 = el("p", sd[2]); side.appendChild(sp2);
      famBox.appendChild(side);
    });
    inv.appendChild(famBox);
    var contacts = el("div"); contacts.className = "lf-contacts lf-rise";
    [[d.fam[2], d.fam[3]], [d.fam[4], d.fam[5]]].forEach(function(ct){
      if (!ct[0] && !ct[1]) return;
      var row = el("div"); row.className = "lf-contact lf-stagger";
      var lab = el("span", ct[0] || "Rabta"); row.appendChild(lab);
      if (ct[1]){ var a = el("a", "+" + ct[1]); a.href = "tel:+" + ct[1]; row.appendChild(a); }
      contacts.appendChild(row);
    });
    inv.appendChild(contacts);
  }
  /* FAQ */
  if (d.faq && d.faq.length){
    var qTitle = el("div"); qTitle.className = "lf-sectitle lf-rise";
    var qt1 = el("div", "A Few Questions"); qt1.className = "lf-script"; qTitle.appendChild(qt1);
    var qt2 = el("p", "Good to know"); qTitle.appendChild(qt2);
    inv.appendChild(qTitle);
    var fq = el("section"); fq.className = "lf-faq lf-rise";
    d.faq.forEach(function(pair){
      var det = el("details"); det.className = "lf-stagger";
      var sum = el("summary", pair[0] || ""); det.appendChild(sum);
      var ans = el("p", pair[1] || ""); det.appendChild(ans);
      fq.appendChild(det);
    });
    inv.appendChild(fq);
  }
  /* venue + RSVP */
  var vc = el("section"); vc.className = "lf-card lf-rise";
  var vmh = el("div", "Venue & RSVP"); vmh.className = "lf-mehrab"; vc.appendChild(vmh);
  var vp = el("div"); vp.className = "lf-venue";
  var vb = el("b", d.venue || ""); vp.appendChild(vb);
  if (d.addr){ vp.appendChild(document.createElement("br")); vp.appendChild(document.createTextNode(d.addr)); }
  if (d.dress){ vp.appendChild(document.createElement("br")); vp.appendChild(document.createTextNode("👗 Dress code: " + d.dress)); }
  vc.appendChild(vp);
  var mapB = el("a", "📍 Open in Google Maps"); mapB.className = "lf-mapbtn";
  mapB.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent((d.venue || "") + ", " + (d.addr || ""));
  mapB.target = "_blank"; mapB.rel = "noopener"; vc.appendChild(mapB);
  var ics = el("button", "📅 Save the Date"); ics.className = "lf-icsbtn"; ics.type = "button"; vc.appendChild(ics);
  var rp = el("p", "Apni shirkat ki tasdeeq kar dein — ye hamare liye khushi ki baat hogi."); rp.style.marginTop = "16px"; vc.appendChild(rp);
  if (d.rsvp){
    var wa = el("a", "✅ WhatsApp par RSVP"); wa.className = "lf-rsvpbtn";
    wa.href = "https://wa.me/" + d.rsvp + "?text=" + encodeURIComponent("Assalam-o-Alaikum! Main " + (d.g || "") + " & " + (d.b || "") + " ki shaadi mein shirkat ki tasdeeq karta hoon.");
    wa.target = "_blank"; wa.rel = "noopener"; vc.appendChild(wa);
  }
  var dua = el("div"); dua.className = "dua arabic lf-dua"; dua.textContent = "بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ"; vc.appendChild(dua);
  inv.appendChild(vc);
  var brand = el("div"); brand.className = "lf-brand";
  brand.appendChild(document.createTextNode("💌 Ye invitation "));
  var ba = el("a", "PakToolkit"); ba.href = "https://paktoolkit.top/wedding-invitation-maker/"; brand.appendChild(ba);
  brand.appendChild(document.createTextNode(" se banaya gaya — apna muft banayein"));
  inv.appendChild(brand);
  document.body.appendChild(root);
  if (scratchCanvas) wInitScratch(scratchCanvas, d);
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
    var nodes = root.querySelectorAll(".lf-rise");
    if (useGsap){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if (!en.isIntersecting) return;
          var n = en.target; io.unobserve(n);
          gsap.fromTo(n, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: .9, ease: "power3.out" });
          var kids = n.querySelectorAll(".lf-stagger");
          if (kids.length) gsap.fromTo(kids, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .8, ease: "power3.out", stagger: .09, delay: .08 });
        });
      }, { root: root, threshold: 0.15 });
      nodes.forEach(function(n){ io.observe(n); });
    } else {
      var io2 = new IntersectionObserver(function(entries){
        entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add("in"); io2.unobserve(en.target); } });
      }, { root: root, threshold: 0.15 });
      nodes.forEach(function(n){ io2.observe(n); });
      setTimeout(function(){ nodes.forEach(function(n){ n.classList.add("in"); }); }, 4000);
    }
  }
  var opened = false;
  env.addEventListener("click", function(){
    if (opened) return; opened = true;
    if (opts.preview && wMp3){
      pvAudio = new Audio(wMp3.url); pvAudio.loop = true;
      pvAudio.play().then(function(){ snd.style.display = "flex"; }).catch(function(){});
      tune = { playing: true };
    } else if (d.tune && d.tune !== "none"){
      tune = wTuneStart(d.tune, null);
      if (tune) snd.style.display = "flex";
    }
    root.scrollTop = 0;
    if (useGsap){
      gsap.set(envBox, { perspective: 900 });
      var heroKids = [];
      hero.childNodes.forEach(function(n){ if (n.nodeType === 1) heroKids.push(n); });
      var tl = gsap.timeline({ defaults: { ease: "power2.inOut" }, onComplete: function(){
        env.style.display = "none"; armReveals();
      } });
      tl.to(seal, { scale: 1.28, rotation: -14, autoAlpha: 0, duration: .45, ease: "power1.out" }, 0)
        .to(flap, { rotationX: 178, duration: .85 }, .1)
        .to(envCard, { y: -96, duration: .95, ease: "power2.out" }, .5)
        .to(env, { autoAlpha: 0, duration: .7, ease: "power1.out" }, 1.3)
        .from(heroKids, { opacity: 0, y: 30, duration: .9, ease: "power3.out", stagger: .1 }, 1.6);
    } else {
      env.classList.add("open");
      setTimeout(function(){ env.classList.add("fading"); }, 1350);
      setTimeout(function(){ env.style.display = "none"; armReveals(); }, 2100);
    }
  });
  var sndOn = true;
  snd.addEventListener("click", function(){
    if (pvAudio){
      if (pvAudio.paused){ pvAudio.play(); snd.textContent = "🔊"; } else { pvAudio.pause(); snd.textContent = "🔇"; }
      return;
    }
    if (!tune || !tune.stop) return;
    if (sndOn){ tune.stop(); sndOn = false; snd.textContent = "🔇"; }
    else { tune.resume(); sndOn = true; snd.textContent = "🔊"; }
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
  ics.addEventListener("click", function(){ wDownloadICS(d, mev); });
}

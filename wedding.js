/* PakToolkit — Wedding Invitation Maker (loaded only on the wedding tool page).
   Defines initWedding + the guest-invitation renderer; tools.js calls
   initWedding() from its dispatch under a window guard. */
/* ============ 13. Wedding Invitation Maker ============ */
/* One page, two faces: the maker form, and — when the URL carries ?d=<data> —
   the guest invitation itself, rebuilt entirely from the link (no server).
   Styles: curtain / doors / arch openings × maroon / green / royal palettes.
   All animation is transform/opacity-only (smooth on cheap phones). */
var W_URDU_EVENTS = { "mehndi": "مہندی", "barat": "برات", "walima": "ولیمہ", "nikah": "نکاح", "dholki": "ڈھولکی", "shaadi": "شادی", "reception": "استقبالیہ" };
var W_EVENT_ICONS = { "mehndi": "🌿", "barat": "💍", "walima": "🍽️", "nikah": "📜", "dholki": "🥁" };
function wEventUrdu(name){ return W_URDU_EVENTS[(name || "").trim().toLowerCase()] || ""; }
function wEventIcon(name){ return W_EVENT_ICONS[(name || "").trim().toLowerCase()] || "💐"; }
function wB64UrlEncode(bytes){
  var bin = "", i, chunk = 0x8000;
  for (i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function wB64UrlToStd(s){
  s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "=";
  return s;
}
function wB64UrlDecode(s){
  s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "=";
  var bin = atob(s), bytes = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
async function wEncodePayload(obj){
  var bytes = new TextEncoder().encode(JSON.stringify(obj));
  if (window.CompressionStream){
    try {
      var buf = await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip"))).arrayBuffer();
      return "z." + wB64UrlEncode(new Uint8Array(buf));
    } catch (e) { /* fall through to plain */ }
  }
  return "p." + wB64UrlEncode(bytes);
}
async function wDecodePayload(s){
  var bytes = wB64UrlDecode(s.slice(2));
  if (s.charAt(0) === "z"){
    var buf = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))).arrayBuffer();
    bytes = new Uint8Array(buf);
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}
/* Compact v2 payload: positional array + coded enums + day-numbers, so the
   share link stays as short as possible (long links scare guests off).
   v1 object payloads still decode — old links keep working. */
var W_STYLES = ["curtain", "doors", "arch", "doors2", "tieback"];
var W_PALS_LIST = ["maroon", "green", "royal"];
var W_TUNES_LIST = ["strings", "bells", "drone", "none"];
var W_SHOTS_LIST = ["maroon", "green", "royal"];
function wDayNum(ds){
  var p = (ds || "").split("-"); if (p.length < 3) return 0;
  return Math.round((Date.UTC(+p[0], +p[1] - 1, +p[2]) - Date.UTC(2025, 0, 1)) / 86400000);
}
function wDayStr(n){
  var dt = new Date(Date.UTC(2025, 0, 1) + n * 86400000);
  function p2(x){ return ("0" + x).slice(-2); }
  return dt.getUTCFullYear() + "-" + p2(dt.getUTCMonth() + 1) + "-" + p2(dt.getUTCDate());
}
function wToCompact(d){
  return [2, d.g, d.b, d.gu, d.bu, d.host, d.gf, d.bf,
    W_STYLES.indexOf(d.style), W_PALS_LIST.indexOf(d.pal), W_TUNES_LIST.indexOf(d.tune),
    (d.ev || []).map(function(e){ return [e.n, wDayNum(e.d), e.t, e.vn]; }),
    d.main, d.venue, d.addr, d.dress, d.rsvp,
    d.shot ? W_SHOTS_LIST.indexOf(d.shot) + 1 : 0];
}
function wFromCompact(a){
  return { v: 2, g: a[1], b: a[2], gu: a[3], bu: a[4], host: a[5], gf: a[6], bf: a[7],
    style: W_STYLES[a[8]] || "doors2", pal: W_PALS_LIST[a[9]] || "maroon", tune: W_TUNES_LIST[a[10]] || "strings",
    ev: (a[11] || []).map(function(e){ return { n: e[0], d: wDayStr(e[1]), t: e[2], vn: e[3] }; }),
    main: a[12] || 0, venue: a[13], addr: a[14], dress: a[15], rsvp: a[16],
    shot: a[17] ? W_SHOTS_LIST[a[17] - 1] : "" };
}
function wEventDate(ev){
  var d = (ev.d || "").split("-"), y = +d[0] || 2026, mo = (+d[1] || 1) - 1, da = +d[2] || 1;
  var h = 19, mi = 0, m = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i.exec(ev.t || "");
  if (m){ h = +m[1] % 12; if (m[2]) mi = +m[2]; if (m[3] && m[3].toLowerCase() === "pm") h += 12; }
  return new Date(y, mo, da, h, mi, 0, 0);
}
function wDateLong(ev){
  var dt = wEventDate(ev);
  return dt.toLocaleDateString("en-GB", { weekday: "long" }) + ", " + dt.getDate() + " " +
    dt.toLocaleDateString("en-GB", { month: "long" }) + " " + dt.getFullYear();
}
function wLoadFonts(){
  if (document.getElementById("w-fonts")) return;
  var l1 = document.createElement("link"); l1.rel = "stylesheet";
  l1.href = "https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap";
  var l2 = document.createElement("link"); l2.rel = "stylesheet"; l2.id = "w-fonts";
  l2.href = "https://fonts.cdnfonts.com/css/jameel-noori-nastaleeq";
  document.head.appendChild(l1); document.head.appendChild(l2);
}
var W_CSS = `
#wguest{position:fixed;inset:0;z-index:200;overflow-y:auto;background:#2a0a12;font-family:Georgia,'Times New Roman',serif;color:#3d2c1e;--gold:#c9a227;--gold2:#e8cf7a;--cream:#fdf6e9;--ink:#3d2c1e}
#wguest.pal-maroon{--deep:#5e1220;--deep2:#7c1d30;--dark:#4a0d19}
#wguest.pal-green{--deep:#0b3d24;--deep2:#11603a;--dark:#072a19}
#wguest.pal-royal{--deep:#16295c;--deep2:#21397a;--dark:#0f1c40}
#wguest .arabic{font-family:'Amiri',serif;direction:rtl}
#wguest .urdu{font-family:'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif;direction:rtl;line-height:2.3}
#wguest .stage{max-width:430px;margin:0 auto;background:var(--cream);min-height:100%;position:relative;overflow:hidden;box-shadow:0 0 60px rgba(0,0,0,.5)}
#wguest .doorwrap{position:fixed;inset:0;z-index:250;display:flex;justify-content:center}
#wguest .doors{position:relative;width:min(430px,100%);height:100%;overflow:hidden;perspective:1400px}
#wguest .panel{position:absolute;top:0;width:50.5%;height:100%;will-change:transform;transition:transform 2s cubic-bezier(.7,0,.25,1),opacity 1.1s ease;box-shadow:inset 0 0 60px rgba(0,0,0,.55)}
#wguest .panel.left{left:0}#wguest .panel.right{right:0}
#wguest.sty-curtain .panel{background:repeating-linear-gradient(90deg,var(--dark) 0 16px,var(--deep2) 16px 30px,var(--deep) 30px 44px,var(--deep2) 44px 58px,var(--dark) 58px 72px)}
#wguest.sty-curtain .panel.left{border-right:3px solid var(--gold)}#wguest.sty-curtain .panel.right{border-left:3px solid var(--gold)}
#wguest.sty-curtain .doors.open .panel.left{transform:translateX(-104%)}#wguest.sty-curtain .doors.open .panel.right{transform:translateX(104%)}
#wguest.sty-doors .panel{background:repeating-linear-gradient(90deg,#3a2413 0 34px,#4c2f18 34px 40px,#3a2413 40px 74px);border:4px solid var(--gold)}
#wguest.sty-doors .panel.left{transform-origin:left center;border-right-width:2px}#wguest.sty-doors .panel.right{transform-origin:right center;border-left-width:2px}
#wguest.sty-doors .doors.open .panel.left{transform:rotateY(-102deg)}#wguest.sty-doors .doors.open .panel.right{transform:rotateY(102deg)}
#wguest .knob{position:absolute;top:50%;width:22px;height:22px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#f3e2ac,var(--gold) 60%,#8a6d1c);box-shadow:0 2px 8px rgba(0,0,0,.5)}
#wguest .dpanel{position:absolute;top:0;width:50.5%;height:100%;will-change:transform;transition:transform 2.4s cubic-bezier(.6,.02,.2,1);background:repeating-linear-gradient(90deg,#3a2413 0 34px,#4c2f18 34px 40px,#3a2413 40px 74px);border:4px solid var(--gold);z-index:2;box-shadow:inset 0 0 50px rgba(0,0,0,.5)}
#wguest .dpanel.left{left:0;transform-origin:left center;border-right-width:2px}
#wguest .dpanel.right{right:0;transform-origin:right center;border-left-width:2px}
#wguest .dpanel.left .knob{right:16px}#wguest .dpanel.right .knob{left:16px}
#wguest .doors.dopen .dpanel.left{transform:rotateY(-103deg)}
#wguest .doors.dopen .dpanel.right{transform:rotateY(103deg)}
#wguest .doors.dopen .doorcenter{opacity:0;pointer-events:none}
#wguest.sty-doors2 .panel{z-index:1;transition:transform 1.7s cubic-bezier(.7,0,.25,1);background:repeating-linear-gradient(90deg,var(--dark) 0 16px,var(--deep2) 16px 30px,var(--deep) 30px 44px,var(--deep2) 44px 58px,var(--dark) 58px 72px)}
#wguest.sty-doors2 .panel.left{border-right:3px solid var(--gold)}#wguest.sty-doors2 .panel.right{border-left:3px solid var(--gold)}
#wguest .doors.copen .panel.left{transform:translateX(-104%)}
#wguest .doors.copen .panel.right{transform:translateX(104%)}
#wguest .cmedal{position:absolute;inset:0;z-index:1;display:flex;align-items:center;justify-content:center;font-size:2.1rem;color:var(--gold2);transition:opacity .5s;text-shadow:0 2px 12px rgba(0,0,0,.45);pointer-events:none}
#wguest .doors.copen .cmedal{opacity:0}
#wguest.sty-tieback .panel{background:repeating-linear-gradient(90deg,var(--dark) 0 16px,var(--deep2) 16px 30px,var(--deep) 30px 44px,var(--deep2) 44px 58px,var(--dark) 58px 72px);transition:transform 2.2s cubic-bezier(.65,0,.25,1),clip-path 2.2s cubic-bezier(.65,0,.25,1),opacity 1.1s ease;clip-path:polygon(0 0,100% 0,100% 100%,50% 100%,0 100%)}
#wguest.sty-tieback .panel.left{border-right:3px solid var(--gold);transform-origin:left top}
#wguest.sty-tieback .panel.right{border-left:3px solid var(--gold);transform-origin:right top}
#wguest.sty-tieback .doors.open .panel.left{transform:scaleX(.52) translateX(-4%);clip-path:polygon(0 0,100% 0,34% 50%,20% 100%,0 100%)}
#wguest.sty-tieback .doors.open .panel.right{transform:scaleX(.52) translateX(4%);clip-path:polygon(0 0,100% 0,100% 100%,80% 100%,66% 50%)}
#wguest.sty-tieback .panel::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 43%,rgba(0,0,0,.25) 52%,rgba(255,255,255,.07) 59%,transparent 67%);opacity:0;transition:opacity 1.4s ease .3s;pointer-events:none}
#wguest.sty-tieback .doors.open .panel::after{opacity:1}
#wguest .tieband{position:absolute;top:48.5%;z-index:2;width:46px;height:17px;border-radius:9px;background:linear-gradient(180deg,#e8cf7a,#c9a227 55%,#9a7b1e);box-shadow:0 3px 10px rgba(0,0,0,.45),inset 0 1px 2px rgba(255,255,255,.6);opacity:0;transition:opacity .7s ease 1.1s,left .9s ease,right .9s ease;pointer-events:none}
#wguest .tieband.l{left:20%}#wguest .tieband.r{right:20%}
#wguest .doors.open .tieband{opacity:1}
#wguest .doors.settled .panel{transition-duration:.9s}
#wguest .doors.settled .panel.left{transform:scaleX(.22) translateX(-2%);clip-path:polygon(0 0,100% 0,58% 46%,42% 100%,0 100%)}
#wguest .doors.settled .panel.right{transform:scaleX(.22) translateX(2%);clip-path:polygon(0 0,100% 0,100% 100%,58% 100%,42% 46%)}
#wguest .doors.settled .tieband.l{left:8%}#wguest .doors.settled .tieband.r{right:8%}
#wguest .inv{transition:padding .9s ease}
#wguest.has-drapes .inv{padding-left:42px;padding-right:42px}
#wguest.has-drapes .minicurtain{margin-left:-42px;margin-right:-42px}
#wguest.has-drapes .brand{margin-left:-42px;margin-right:-42px}
#wguest .panel.left .knob{right:16px}#wguest .panel.right .knob{left:16px}
#wguest.sty-arch .panel{width:100%;background:radial-gradient(circle at 20% 15%,rgba(232,207,122,.28) 0 26px,transparent 27px),radial-gradient(circle at 82% 22%,rgba(232,207,122,.22) 0 20px,transparent 21px),radial-gradient(circle at 50% 88%,rgba(232,207,122,.18) 0 30px,transparent 31px),linear-gradient(160deg,var(--deep2),var(--deep) 55%,var(--dark))}
#wguest.sty-arch .panel.right{display:none}
#wguest.sty-arch .doors.open .panel{opacity:0;transform:scale(1.07)}
#wguest .doorcenter{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:24px;transition:opacity .6s;color:var(--cream);z-index:3}
#wguest .doors.open .doorcenter{opacity:0;pointer-events:none}
#wguest .archframe{border:2px solid var(--gold);border-radius:190px 190px 14px 14px;padding:26px 20px 18px;background:rgba(0,0,0,.16)}
#wguest .bismillah{font-size:1.55rem;color:var(--gold2);margin-bottom:10px;line-height:2}
#wguest .mono{width:118px;height:118px;border-radius:50%;border:2px solid var(--gold);outline:6px double rgba(201,162,39,.45);outline-offset:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(circle,var(--deep2),var(--dark));margin:6px auto 12px}
#wguest .mono .ini{font-size:1.75rem;letter-spacing:.06em;color:var(--gold2)}
#wguest .mono .sm{font-size:.6rem;letter-spacing:.32em;color:#f3e2ac;margin-top:3px}
#wguest .coverphoto{display:block;width:min(232px,62vw);aspect-ratio:264/338;object-fit:cover;border-radius:148px 148px 14px 14px;border:3px solid var(--gold);outline:5px double rgba(201,162,39,.4);outline-offset:4px;margin:2px auto 10px;box-shadow:0 14px 34px rgba(0,0,0,.45)}
#wguest .doors.withphoto .bismillah{font-size:1.22rem;margin-bottom:2px}
#wguest .doorcenter h1{font-size:1.22rem;font-weight:normal;margin:4px 0;color:#fff}
#wguest .dcnames{font-size:1.02rem;color:var(--gold2);letter-spacing:.12em}
#wguest .dcunames{font-size:1.28rem;color:#fff;margin-top:4px}
#wguest .tap{margin-top:22px;background:linear-gradient(180deg,#e8cf7a,#c9a227);color:#43101c;border:0;font-family:inherit;font-size:1.02rem;font-weight:bold;padding:14px 30px;border-radius:999px;cursor:pointer;box-shadow:0 8px 22px rgba(0,0,0,.4);animation:wpulse 1.8s infinite}
@keyframes wpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
#wguest .hint{font-size:.8rem;color:#d9c9a8;margin-top:10px;font-family:system-ui,Arial,sans-serif}
#wguest .valance{height:40px;background:radial-gradient(circle at 50% -8px,transparent 25px,var(--gold) 26px,var(--deep2) 28px,var(--deep) 44px);background-size:64px 40px;background-repeat:repeat-x;filter:drop-shadow(0 3px 3px rgba(0,0,0,.18))}
#wguest .minicurtain{position:relative;height:74px;margin:26px -22px 4px;overflow:hidden}
#wguest .minicurtain .mp{position:absolute;top:0;width:50.5%;height:100%;z-index:2;will-change:transform,opacity;transition:transform 1.5s cubic-bezier(.7,0,.25,1),opacity .9s ease;background:repeating-linear-gradient(90deg,var(--dark) 0 10px,var(--deep2) 10px 19px,var(--deep) 19px 28px,var(--deep2) 28px 37px,var(--dark) 37px 46px)}
#wguest .minicurtain .mp.l{left:0;border-right:2px solid var(--gold)}#wguest .minicurtain .mp.r{right:0;border-left:2px solid var(--gold)}
#wguest .minicurtain.open .mp.l{transform:translateX(-103%)}#wguest .minicurtain.open .mp.r{transform:translateX(103%)}
#wguest .minicurtain.flat .mp{width:100%}
#wguest .minicurtain.flat .mp.r{display:none}
#wguest .minicurtain.flat.open .mp{opacity:0;transform:none}
#wguest .minicurtain .medal{position:absolute;inset:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity .5s;color:var(--gold2)}
#wguest .minicurtain.open .medal{opacity:0}
#wguest .minicurtain .medal .en{letter-spacing:.3em;font-size:.78rem}
#wguest .minicurtain .medal .ur{font-size:1.15rem;line-height:1.9}
#wguest .minicurtain .behind{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:1.6rem;color:var(--deep)}
#wguest .rise{opacity:0;transform:translateY(26px);transition:opacity .8s ease,transform .8s ease}
#wguest .rise.in{opacity:1;transform:none}
#wguest .inv{padding:0 22px 8px;text-align:center;background:radial-gradient(circle at 15% 4%,rgba(201,162,39,.13),transparent 42%),radial-gradient(circle at 85% 30%,rgba(201,162,39,.11),transparent 42%),var(--cream)}
#wguest .frame{border:2px solid var(--gold);outline:1px solid rgba(201,162,39,.5);outline-offset:5px;padding:22px 16px 20px;background:rgba(255,255,255,.55);margin-top:14px}
#wguest .inv .bismillah{color:var(--deep);font-size:1.42rem}
#wguest .host{font-size:.97rem;line-height:1.65;color:#5a4632}
#wguest .big{font-size:2rem;color:var(--deep);margin:10px 0 0;font-style:italic;line-height:1.25}
#wguest .unames2{font-size:1.42rem;color:#7c5a17;margin-top:8px}
#wguest .uinvite{font-size:1.1rem;color:#5a4632;margin-top:10px}
#wguest .weds{color:var(--gold);font-size:1.45rem;margin:2px 0}
#wguest .dof{font-size:.92rem;color:#5a4632}
#wguest .rule{width:120px;height:2px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:16px auto}
#wguest h2.sec{font-size:1rem;letter-spacing:.28em;color:var(--deep);margin:26px 0 2px;text-transform:uppercase}
#wguest .secsub{font-size:1.08rem;color:#7c5a17;margin-bottom:10px}
#wguest .scratchbox{position:relative;width:290px;max-width:88%;margin:0 auto;border-radius:16px;overflow:hidden;border:2px solid var(--gold);background:#fff}
#wguest .scratchdate{padding:20px 10px 16px}
#wguest .scratchdate .d1{font-size:1.3rem;color:var(--deep);font-weight:bold}
#wguest .scratchdate .d2{font-size:.98rem;color:#5a4632;margin-top:4px}
#wguest #wscratch{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:pointer}
#wguest .scratchhint{font-family:system-ui,Arial,sans-serif;font-size:.82rem;color:#8a6d3b;margin-top:8px}
#wguest .btn{display:inline-block;margin-top:14px;background:linear-gradient(180deg,var(--deep2),var(--deep));color:var(--cream);text-decoration:none;border:0;font-family:inherit;font-size:1rem;font-weight:bold;padding:14px 26px;border-radius:999px;cursor:pointer;box-shadow:0 8px 20px rgba(0,0,0,.3)}
#wguest .btn.goldb{background:linear-gradient(180deg,#e8cf7a,#c9a227);color:#43101c}
#wguest .btn.wa{background:linear-gradient(180deg,#2bb673,#1c9457);color:#fff}
#wguest .count{display:flex;gap:8px;justify-content:center;margin-top:6px}
#wguest .count div{background:var(--deep);color:var(--cream);border-radius:14px;min-width:62px;padding:10px 4px;border:1px solid var(--gold)}
#wguest .count b{display:block;font-size:1.32rem;color:var(--gold2)}
#wguest .count span{font-size:.66rem;letter-spacing:.18em;font-family:system-ui,Arial,sans-serif}
#wguest .tl{margin:6px auto 0;max-width:330px;text-align:left}
#wguest .ev{display:flex;gap:12px;padding:10px 0;border-bottom:1px dashed rgba(201,162,39,.55)}
#wguest .ev:last-child{border-bottom:0}
#wguest .ev .ic{font-size:1.45rem;width:44px;height:44px;flex:none;border-radius:50%;background:#f7ead0;border:1px solid var(--gold);display:flex;align-items:center;justify-content:center}
#wguest .ev .et{font-weight:bold;color:var(--deep);font-size:1.04rem}
#wguest .ev .ed{font-size:.9rem;color:#5a4632;line-height:1.45}
#wguest .venue{font-size:1rem;line-height:1.6;color:#5a4632}
#wguest .dua{font-size:1.28rem;line-height:2.2;color:var(--deep);margin-top:8px}
#wguest .brand{margin:26px -22px 0;background:var(--deep);color:var(--gold2);text-align:center;padding:16px;font-family:system-ui,Arial,sans-serif;font-size:.9rem}
#wguest .brand a{color:#fff;font-weight:bold}
#wguest .petal{position:fixed;top:-4vh;z-index:240;font-size:15px;pointer-events:none;animation:wfall linear forwards}
@keyframes wfall{to{transform:translateY(108vh) rotate(340deg);opacity:.25}}
#wguest .sndbtn{position:fixed;right:14px;bottom:14px;z-index:260;width:48px;height:48px;border-radius:50%;border:2px solid var(--gold);background:var(--deep);color:#fff;font-size:1.25rem;display:none;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 16px rgba(0,0,0,.35)}
@media (prefers-reduced-motion: reduce){#wguest .panel,#wguest .minicurtain .mp{transition-duration:.01s}#wguest .tap{animation:none}}
`;
function wInjectCSS(){
  if (document.getElementById("w-css")) return;
  var st = document.createElement("style"); st.id = "w-css"; st.textContent = W_CSS;
  document.head.appendChild(st);
}
function wPetals(root){
  var syms = ["🌸", "🌺", "🤍", "✨"], i;
  for (i = 0; i < 26; i++){
    var p = document.createElement("div");
    p.className = "petal"; p.textContent = syms[i % syms.length];
    p.style.left = (Math.random() * 96) + "vw";
    p.style.animationDuration = (3.4 + Math.random() * 3.4) + "s";
    p.style.animationDelay = (Math.random() * 1.6) + "s";
    root.appendChild(p);
    setTimeout((function(node){ return function(){ node.remove(); }; })(p), 9500);
  }
}
function wRenderGuest(d, opts){
  opts = opts || {};
  wLoadFonts(); wInjectCSS();
  document.body.style.overflow = "hidden";
  var main = (typeof d.main === "number" && d.ev[d.main]) ? d.main : Math.min(1, d.ev.length - 1);
  var mev = d.ev[main];
  var root = el("div"); root.id = "wguest";
  root.className = "pal-" + (d.pal || "maroon") + " sty-" + (d.style || "curtain");
  var stage = el("div"); stage.className = "stage"; root.appendChild(stage);
  /* ---- cover ---- */
  var wrap = el("div"); wrap.className = "doorwrap";
  var doors = el("div"); doors.className = "doors";
  var pl = el("div"); pl.className = "panel left"; var pr = el("div"); pr.className = "panel right";
  if (d.style === "doors"){ var k1 = el("div"); k1.className = "knob"; pl.appendChild(k1); var k2 = el("div"); k2.className = "knob"; pr.appendChild(k2); }
  doors.appendChild(pl); doors.appendChild(pr);
  if (d.style === "doors2"){
    var cmedal = el("div", "✦"); cmedal.className = "cmedal"; doors.appendChild(cmedal);
    var dl = el("div"); dl.className = "dpanel left"; var dr = el("div"); dr.className = "dpanel right";
    var dk1 = el("div"); dk1.className = "knob"; dl.appendChild(dk1);
    var dk2 = el("div"); dk2.className = "knob"; dr.appendChild(dk2);
    doors.appendChild(dl); doors.appendChild(dr);
  }
  if (d.style === "tieback"){
    var tb1 = el("div"); tb1.className = "tieband l"; var tb2 = el("div"); tb2.className = "tieband r";
    doors.appendChild(tb1); doors.appendChild(tb2);
  }
  var dc = el("div"); dc.className = "doorcenter";
  var dcIn = el("div"); if (d.style === "arch") dcIn.className = "archframe";
  var bis = el("div"); bis.className = "bismillah arabic"; bis.textContent = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"; dcIn.appendChild(bis);
  var coverSrc = null;
  if (opts.photo) coverSrc = opts.photo;
  else if (location.hash && location.hash.indexOf("#p=") === 0){
    var hp = location.hash.slice(3);
    coverSrc = "data:image/" + (hp.charAt(0) === "j" ? "jpeg" : "webp") + ";base64," + wB64UrlToStd(hp.slice(2));
  }
  else if (d.shot && window.W_SHOTS && W_SHOTS[d.shot]) coverSrc = W_SHOTS[d.shot];
  if (coverSrc){
    doors.classList.add("withphoto");
    var cimg = document.createElement("img");
    cimg.className = "coverphoto"; cimg.src = coverSrc; cimg.alt = "Couple photo";
    cimg.onerror = function(){
      /* A photo that cannot decode must never leave a broken frame —
         fall back to the monogram cover. */
      cimg.remove(); doors.classList.remove("withphoto");
      var mono2 = el("div"); mono2.className = "mono";
      var ini2 = el("div"); ini2.className = "ini"; ini2.textContent = (d.g || "G").charAt(0).toUpperCase() + " ♥ " + (d.b || "B").charAt(0).toUpperCase(); mono2.appendChild(ini2);
      var sm2 = el("div"); sm2.className = "sm"; sm2.textContent = "WEDDING"; mono2.appendChild(sm2);
      dcIn.insertBefore(mono2, dcIn.children[1] || null);
    };
    dcIn.appendChild(cimg);
  } else {
    var mono = el("div"); mono.className = "mono";
    var ini = el("div"); ini.className = "ini"; ini.textContent = (d.g || "G").charAt(0).toUpperCase() + " ♥ " + (d.b || "B").charAt(0).toUpperCase(); mono.appendChild(ini);
    var sm = el("div"); sm.className = "sm"; sm.textContent = "WEDDING"; mono.appendChild(sm); dcIn.appendChild(mono);
  }
  var h1 = el("h1"); h1.textContent = "Assalam-o-Alaikum"; dcIn.appendChild(h1);
  var dcn = el("div"); dcn.className = "dcnames"; dcn.textContent = (d.g || "").toUpperCase() + "  ·  " + (d.b || "").toUpperCase(); dcIn.appendChild(dcn);
  if (d.gu || d.bu){ var dcu = el("div"); dcu.className = "dcunames urdu"; dcu.textContent = (d.gu || d.g) + " ♥ " + (d.bu || d.b); dcIn.appendChild(dcu); }
  var tap = el("button", "💌 Tap to Open"); tap.className = "tap"; dcIn.appendChild(tap);
  var hint = el("div"); hint.className = "hint"; hint.textContent = "Dawwat-nama kholne ke liye dabayein" + (d.tune && d.tune !== "none" ? " — dhun saath bajegi" : ""); dcIn.appendChild(hint);
  dc.appendChild(dcIn); doors.appendChild(dc); wrap.appendChild(doors); stage.appendChild(wrap);
  var snd = el("button", "🔊"); snd.className = "sndbtn"; snd.title = "Sound on/off"; stage.appendChild(snd);
  /* ---- invitation body ---- */
  var inv = el("div"); inv.className = "inv";
  var val = el("div"); val.className = "valance"; inv.appendChild(val);
  var frame = el("div"); frame.className = "frame"; inv.appendChild(frame);
  var bis2 = el("div"); bis2.className = "bismillah arabic"; bis2.textContent = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"; frame.appendChild(bis2);
  var host = el("p"); host.className = "host";
  var hb = el("b"); hb.textContent = d.host || ""; host.appendChild(hb);
  host.appendChild(document.createElement("br"));
  host.appendChild(document.createTextNode("request the honour of your presence at the wedding of"));
  frame.appendChild(host);
  var gr = el("div"); gr.className = "big"; gr.textContent = d.g || ""; frame.appendChild(gr);
  if (d.gf){ var gf = el("p"); gf.className = "dof"; gf.textContent = d.gf; frame.appendChild(gf); }
  var weds = el("div"); weds.className = "weds"; weds.textContent = "— ♥ weds ♥ —"; frame.appendChild(weds);
  var br = el("div"); br.className = "big"; br.textContent = d.b || ""; frame.appendChild(br);
  if (d.bf){ var bf = el("p"); bf.className = "dof"; bf.textContent = d.bf; frame.appendChild(bf); }
  if (d.gu || d.bu){ var un = el("div"); un.className = "unames2 urdu"; un.textContent = (d.gu || d.g) + " ♥ " + (d.bu || d.b); frame.appendChild(un); }
  var ui2 = el("p"); ui2.className = "uinvite urdu"; ui2.textContent = "آپ کی شرکت ہمارے لیے باعثِ مسرت و افتخار ہوگی"; frame.appendChild(ui2);
  var rule = el("div"); rule.className = "rule"; frame.appendChild(rule);
  /* save the date */
  var r1 = el("div"); r1.className = "rise";
  var sh = el("h2", "Save the Date"); sh.className = "sec"; r1.appendChild(sh);
  var ss = el("div"); ss.className = "secsub urdu"; ss.textContent = "تاریخ محفوظ کر لیں"; r1.appendChild(ss);
  var sbox = el("div"); sbox.className = "scratchbox";
  var sdate = el("div"); sdate.className = "scratchdate";
  var d1 = el("div"); d1.className = "d1"; d1.textContent = wDateLong(mev); sdate.appendChild(d1);
  var d2 = el("div"); d2.className = "d2"; d2.textContent = mev.n + " · " + (mev.t || "") + " onwards"; sdate.appendChild(d2);
  sbox.appendChild(sdate);
  var sc = document.createElement("canvas"); sc.id = "wscratch"; sc.width = 290; sc.height = 96; sbox.appendChild(sc);
  r1.appendChild(sbox);
  var shint = el("div"); shint.className = "scratchhint"; shint.textContent = "👆 Sunehri hisse ko ungli se raghrein — tareekh zahir hogi"; r1.appendChild(shint);
  var ics = el("button", "📅 Save the Date"); ics.className = "btn goldb"; r1.appendChild(ics);
  frame.appendChild(r1);
  /* countdown */
  var r2 = el("div"); r2.className = "rise";
  var ch2 = el("h2", "Countdown"); ch2.className = "sec"; r2.appendChild(ch2);
  var cs2 = el("div"); cs2.className = "secsub urdu"; cs2.textContent = "الٹی گنتی"; r2.appendChild(cs2);
  var count = el("div"); count.className = "count";
  var cids = {};
  [["cd", "DAYS"], ["ch", "HOURS"], ["cm", "MINUTES"], ["cs", "SECONDS"]].forEach(function(pr2){
    var cell = el("div"); var bb = el("b", "–"); cell.appendChild(bb);
    var sp = el("span", pr2[1]); cell.appendChild(sp); count.appendChild(cell); cids[pr2[0]] = bb;
  });
  r2.appendChild(count); frame.appendChild(r2);
  /* program */
  frame.appendChild(wMiniCurtain(d, "THE PROGRAM", "پروگرام", "💍"));
  var r3 = el("div"); r3.className = "rise";
  var tl = el("div"); tl.className = "tl";
  d.ev.forEach(function(ev){
    var row = el("div"); row.className = "ev";
    var ic = el("div", wEventIcon(ev.n)); ic.className = "ic"; row.appendChild(ic);
    var tx = el("div");
    var et = el("div"); et.className = "et"; et.textContent = ev.n;
    var eu = wEventUrdu(ev.n); if (eu){ var us = el("span", " — " + eu); us.className = "urdu"; et.appendChild(us); }
    tx.appendChild(et);
    var ed = el("div"); ed.className = "ed";
    ed.textContent = wDateLong(ev) + " · " + (ev.t || "") + (ev.vn ? "\n" + ev.vn : "");
    ed.style.whiteSpace = "pre-line";
    tx.appendChild(ed); row.appendChild(tx); tl.appendChild(row);
  });
  r3.appendChild(tl); frame.appendChild(r3);
  /* venue + rsvp */
  frame.appendChild(wMiniCurtain(d, "VENUE & RSVP", "مقام اور تصدیق", "📍"));
  var r4 = el("div"); r4.className = "rise";
  var vp = el("p"); vp.className = "venue";
  var vb = el("b"); vb.textContent = d.venue || ""; vp.appendChild(vb);
  vp.appendChild(document.createElement("br"));
  vp.appendChild(document.createTextNode(d.addr || ""));
  if (d.dress){ vp.appendChild(document.createElement("br")); vp.appendChild(document.createTextNode("👗 Dress code: " + d.dress)); }
  r4.appendChild(vp);
  var maps = el("a", "📍 Open in Google Maps"); maps.className = "btn";
  maps.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent((d.venue || "") + ", " + (d.addr || ""));
  maps.target = "_blank"; maps.rel = "noopener"; r4.appendChild(maps);
  var rp = el("p"); rp.className = "venue"; rp.style.marginTop = "22px";
  rp.textContent = "Apni shirkat ki tasdeeq kar dein — ye hamare liye khushi ki baat hogi.";
  r4.appendChild(rp);
  if (d.rsvp){
    var wa = el("a", "✅ WhatsApp par RSVP"); wa.className = "btn wa";
    wa.href = "https://wa.me/" + d.rsvp + "?text=" + encodeURIComponent("Assalam-o-Alaikum! Main " + d.g + " & " + d.b + " ki shaadi mein shirkat ki tasdeeq karta hoon.");
    wa.target = "_blank"; wa.rel = "noopener"; r4.appendChild(wa);
  }
  var rule2 = el("div"); rule2.className = "rule"; r4.appendChild(rule2);
  var dua = el("div"); dua.className = "dua arabic"; dua.textContent = "بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ"; r4.appendChild(dua);
  frame.appendChild(r4);
  var brand = el("div"); brand.className = "brand";
  brand.appendChild(document.createTextNode("💌 Ye invitation "));
  var ba = el("a", "PakToolkit"); ba.href = "https://paktoolkit.top/wedding-invitation-maker/"; brand.appendChild(ba);
  brand.appendChild(document.createTextNode(" se banaya gaya — apna muft banayein"));
  inv.appendChild(brand); stage.appendChild(inv);
  document.body.appendChild(root);
  /* ---- interactions ---- */
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
    stage.appendChild(closeB);
  }
  tap.addEventListener("click", function(){
    if (d.style === "doors2") doors.classList.add("dopen"); else doors.classList.add("open");
    wPetals(root);
    if (opts.preview && wMp3){
      pvAudio = new Audio(wMp3.url); pvAudio.loop = true;
      pvAudio.play().then(function(){ snd.style.display = "flex"; }).catch(function(){});
      tune = { playing: true };
    } else if (d.tune && d.tune !== "none"){
      tune = wTuneStart(d.tune, null);
      if (tune) { snd.style.display = "flex"; }
    }
    if (d.style === "doors2") setTimeout(function(){ doors.classList.add("copen"); wPetals(root); }, 2350);
    setTimeout(function(){
      if (d.style === "tieback"){
        /* Tied-back curtains STAY as a frame around the card (like the
           reference photo) — the wrap becomes click-through instead of
           being removed, and the card gains side room so no text or
           icons ever slide under the drapes. */
        doors.classList.add("settled"); wrap.style.pointerEvents = "none";
        root.classList.add("has-drapes");
      } else {
        wrap.style.display = "none";
      }
      root.scrollTop = 0;
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add(en.target.hasAttribute("data-curtain") ? "open" : "in"); io.unobserve(en.target); } });
      }, { root: root, threshold: 0.3 });
      root.querySelectorAll(".rise, [data-curtain]").forEach(function(n){ io.observe(n); });
    }, d.style === "doors2" ? 4600 : (d.style === "tieback" ? 2500 : (d.style === "doors" ? 2100 : 1950)));
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
  wInitScratch(sc, d);
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
function wMiniCurtain(d, en, ur, behind){
  var mc = el("div"); mc.className = "minicurtain" + (d.style === "curtain" ? "" : " flat");
  mc.setAttribute("data-curtain", "");
  var bh = el("div", behind); bh.className = "behind"; mc.appendChild(bh);
  var l = el("div"); l.className = "mp l"; var r = el("div"); r.className = "mp r";
  mc.appendChild(l); mc.appendChild(r);
  var md = el("div"); md.className = "medal";
  var e1 = el("div", en); e1.className = "en"; md.appendChild(e1);
  var e2 = el("div", ur); e2.className = "ur urdu"; md.appendChild(e2);
  mc.appendChild(md);
  return mc;
}
function wInitScratch(sc, d){
  var ctx = sc.getContext("2d");
  var palDeep = { maroon: "#8c2438", green: "#14532d", royal: "#21397a" }[d.pal || "maroon"];
  var palDeep2 = { maroon: "#a93447", green: "#1c6b41", royal: "#2c4a96" }[d.pal || "maroon"];
  var g = ctx.createLinearGradient(0, 0, 290, 96);
  g.addColorStop(0, palDeep); g.addColorStop(.5, palDeep2); g.addColorStop(1, palDeep);
  ctx.fillStyle = g; ctx.fillRect(0, 0, 290, 96);
  ctx.strokeStyle = "rgba(232,207,122,.85)";
  for (var x = 14; x < 290; x += 26){ ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - 18, 96); ctx.stroke(); }
  ctx.fillStyle = "#e8cf7a"; ctx.font = "bold 15px Georgia"; ctx.textAlign = "center";
  ctx.fillText("✦  SCRATCH HERE  ✦", 145, 54);
  ctx.globalCompositeOperation = "destination-out";
  var drawing = false, cleared = false;
  function pos(e){
    var r = sc.getBoundingClientRect(); var t = e.touches ? e.touches[0] : e;
    return { x: (t.clientX - r.left) * (290 / r.width), y: (t.clientY - r.top) * (96 / r.height) };
  }
  function scratchAt(e){
    if (!drawing) return;
    var p = pos(e);
    ctx.beginPath(); ctx.arc(p.x, p.y, 17, 0, Math.PI * 2); ctx.fill();
    if (!cleared){
      var dd = ctx.getImageData(0, 0, 290, 96).data, clear = 0, total = 0, i;
      for (i = 3; i < dd.length; i += 64){ total++; if (dd[i] === 0) clear++; }
      if (clear / total > 0.45){ cleared = true; sc.style.transition = "opacity .7s"; sc.style.opacity = "0"; setTimeout(function(){ if (sc.parentNode) sc.remove(); }, 750); }
    }
    if (e.cancelable) e.preventDefault();
  }
  sc.addEventListener("pointerdown", function(e){ drawing = true; scratchAt(e); });
  window.addEventListener("pointermove", scratchAt);
  window.addEventListener("pointerup", function(){ drawing = false; });
  sc.addEventListener("touchstart", function(e){ drawing = true; scratchAt(e); }, { passive: false });
  sc.addEventListener("touchmove", scratchAt, { passive: false });
  sc.addEventListener("touchend", function(){ drawing = false; });
}
function wDownloadICS(d, mev){
  function p2(n){ return ("0" + n).slice(-2); }
  function stamp(dt){ return dt.getUTCFullYear() + p2(dt.getUTCMonth() + 1) + p2(dt.getUTCDate()) + "T" + p2(dt.getUTCHours()) + p2(dt.getUTCMinutes()) + "00Z"; }
  var start = wEventDate(mev), end = new Date(start.getTime() + 4 * 3600000);
  var ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//PakToolkit//Wedding Invitation//EN", "BEGIN:VEVENT",
    "UID:" + Date.now() + "@paktoolkit.top", "DTSTAMP:" + stamp(new Date()),
    "DTSTART:" + stamp(start), "DTEND:" + stamp(end),
    "SUMMARY:" + mev.n + " — " + d.g + " weds " + d.b,
    "LOCATION:" + (d.venue || "") + "\\, " + (d.addr || ""),
    "DESCRIPTION:Wedding invitation — " + d.g + " & " + d.b + ". " + mev.n + " " + (mev.t || "") + ".",
    "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  var a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  a.download = "wedding-invitation.ics";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function(){ URL.revokeObjectURL(a.href); }, 4000);
}

/* ---- Video invitation + poster: the invitation is drawn on a 720x1280
   canvas over ~15 s while MediaRecorder captures it (plus the music). ---- */
var W_PALS = {
  maroon: { deep: "#5e1220", deep2: "#7c1d30", dark: "#4a0d19" },
  green: { deep: "#0b3d24", deep2: "#11603a", dark: "#072a19" },
  royal: { deep: "#16295c", deep2: "#21397a", dark: "#0f1c40" }
};
function wRR(x, a, b, w, h, r){
  x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r);
  x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r);
  x.arcTo(a, b, a + w, b, r); x.closePath();
}
function wCT(x, txt, y, font, color){
  x.font = font; x.fillStyle = color; x.textAlign = "center"; x.textBaseline = "middle";
  x.fillText(txt, 360, y);
}
function wFitFont(x, txt, base, min, weight, family){
  var s = base;
  x.font = weight + " " + s + "px " + family;
  while (s > min && x.measureText(txt).width > 620){ s -= 3; x.font = weight + " " + s + "px " + family; }
  return s;
}
function wSceneA(t, s, e){
  if (t < s) return 0;
  var f = 0.45, a = 1;
  if (t < s + f) a = (t - s) / f;
  if (e < 90 && t > e - f) a = Math.min(a, Math.max(0, (e - t) / f));
  return a;
}
function wDrawCard(x, d, pal, mev){
  x.fillStyle = "#fdf6e9"; x.fillRect(0, 0, 720, 1280);
  var gl = x.createRadialGradient(110, 60, 10, 110, 60, 420);
  gl.addColorStop(0, "rgba(201,162,39,.20)"); gl.addColorStop(1, "rgba(201,162,39,0)");
  x.fillStyle = gl; x.fillRect(0, 0, 720, 700);
  var gr2 = x.createRadialGradient(620, 420, 10, 620, 420, 420);
  gr2.addColorStop(0, "rgba(201,162,39,.16)"); gr2.addColorStop(1, "rgba(201,162,39,0)");
  x.fillStyle = gr2; x.fillRect(0, 300, 720, 700);
  x.strokeStyle = "#c9a227"; x.lineWidth = 3; x.strokeRect(26, 26, 668, 1228);
  x.lineWidth = 1; x.strokeRect(38, 38, 644, 1204);
  wCT(x, "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", 130, "700 44px Amiri, serif", pal.deep);
  wFitFont(x, d.host || "", 29, 20, "", "Georgia, serif");
  wCT(x, d.host || "", 215, x.font, "#5a4632");
  wCT(x, "request the honour of your presence", 258, "26px Georgia, serif", "#5a4632");
  wFitFont(x, d.g || "", 62, 34, "italic 700", "Georgia, serif");
  wCT(x, d.g || "", 350, x.font, pal.deep);
  if (d.gf) wCT(x, d.gf, 402, "25px Georgia, serif", "#5a4632");
  wCT(x, "— ♥ weds ♥ —", 468, "34px Georgia, serif", "#c9a227");
  wFitFont(x, d.b || "", 62, 34, "italic 700", "Georgia, serif");
  wCT(x, d.b || "", 556, x.font, pal.deep);
  if (d.bf) wCT(x, d.bf, 608, "25px Georgia, serif", "#5a4632");
  if (d.gu || d.bu) wCT(x, (d.gu || d.g) + " ♥ " + (d.bu || d.b), 700, "42px 'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif", "#7c5a17");
  wCT(x, "آپ کی شرکت ہمارے لیے باعثِ مسرت و افتخار ہوگی", 782, "30px 'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif", "#5a4632");
  x.strokeStyle = "#c9a227"; x.lineWidth = 2;
  x.beginPath(); x.moveTo(300, 850); x.lineTo(420, 850); x.stroke();
  wCT(x, wDateLong(mev), 915, "700 40px Georgia, serif", pal.deep);
  wCT(x, mev.n + " · " + (mev.t || "") + " onwards", 972, "29px Georgia, serif", "#5a4632");
  wCT(x, d.venue || "", 1060, "30px Georgia, serif", "#5a4632");
}
function wArchPath(x, a, b, w, h){
  var r = w / 2;
  x.beginPath();
  x.moveTo(a, b + h); x.lineTo(a, b + r); x.arc(a + r, b + r, r, Math.PI, 0);
  x.lineTo(a + w, b + h); x.closePath();
}
function wDrawFrame(x, d, pal, photo, t, petals){
  var main = (typeof d.main === "number" && d.ev[d.main]) ? d.main : Math.min(1, d.ev.length - 1);
  var mev = d.ev[main];
  x.clearRect(0, 0, 720, 1280);
  /* S2 card (also the dim backdrop behind the opening cover) */
  x.save(); x.globalAlpha = t < 3.1 ? 0.3 : wSceneA(t, 2.2, 6.6); wDrawCard(x, d, pal, mev); x.restore();
  /* S3 photo / date */
  var a3 = wSceneA(t, 5.9, 9.7);
  if (a3 > 0){
    x.save(); x.globalAlpha = a3;
    x.fillStyle = "#fdf6e9"; x.fillRect(0, 0, 720, 1280);
    if (photo){
      wCT(x, "✦ With the blessings of Allah ✦", 130, "26px Georgia, serif", "#8a6d3b");
      wArchPath(x, 150, 210, 420, 700);
      x.save(); x.clip();
      x.drawImage(photo, 150, 210, 420, 700);
      x.restore();
      wArchPath(x, 150, 210, 420, 700); x.strokeStyle = "#c9a227"; x.lineWidth = 6; x.stroke();
      wFitFont(x, (d.g || "") + "  ♥  " + (d.b || ""), 42, 28, "italic 700", "Georgia, serif");
      wCT(x, (d.g || "") + "  ♥  " + (d.b || ""), 990, x.font, pal.deep);
      if (d.gu || d.bu) wCT(x, (d.gu || d.g) + " ♥ " + (d.bu || d.b), 1062, "36px 'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif", "#7c5a17");
      wCT(x, wDateLong(mev), 1150, "700 32px Georgia, serif", pal.deep);
    } else {
      wCT(x, "پروگرام", 300, "40px 'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif", "#7c5a17");
      wRR(x, 80, 400, 560, 330, 24); x.fillStyle = "#ffffff"; x.fill(); x.strokeStyle = "#c9a227"; x.lineWidth = 4; x.stroke();
      wCT(x, "S A V E   T H E   D A T E", 480, "30px Georgia, serif", "#8a6d3b");
      wFitFont(x, wDateLong(mev), 44, 30, "700", "Georgia, serif");
      wCT(x, wDateLong(mev), 575, x.font, pal.deep);
      wCT(x, mev.n + " · " + (mev.t || "") + " onwards", 645, "30px Georgia, serif", "#5a4632");
      wCT(x, "Save the date — aur link mein scratch karke bhi dekhein", 830, "24px Georgia, serif", "#8a6d3b");
    }
    x.restore();
  }
  /* S4 program */
  var a4 = wSceneA(t, 9.2, 12.7);
  if (a4 > 0){
    x.save(); x.globalAlpha = a4;
    x.fillStyle = "#fdf6e9"; x.fillRect(0, 0, 720, 1280);
    wCT(x, "T H E   P R O G R A M", 190, "34px Georgia, serif", pal.deep);
    wCT(x, "پروگرام", 252, "38px 'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif", "#7c5a17");
    d.ev.forEach(function(ev, i){
      var ra = Math.max(0, Math.min(1, (t - (9.4 + i * 0.55)) / 0.5)) * a4;
      if (ra <= 0) return;
      var y = 380 + i * 190;
      x.save(); x.globalAlpha = ra;
      x.beginPath(); x.arc(120, y + 10, 40, 0, Math.PI * 2);
      x.fillStyle = "#f7ead0"; x.fill(); x.strokeStyle = "#c9a227"; x.lineWidth = 2; x.stroke();
      wCT(x, wEventIcon(ev.n), y + 12, "36px serif", pal.deep);
      x.textAlign = "left"; x.fillStyle = pal.deep;
      x.font = "700 38px Georgia, serif"; x.fillText(ev.n, 190, y - 8);
      x.fillStyle = "#5a4632"; x.font = "27px Georgia, serif";
      x.fillText(wDateLong(ev) + " · " + (ev.t || ""), 190, y + 38);
      if (ev.vn) x.fillText(ev.vn, 190, y + 76);
      x.restore();
    });
    x.restore();
  }
  /* S5 venue + rsvp */
  var a5 = wSceneA(t, 12.2, 99);
  if (a5 > 0){
    x.save(); x.globalAlpha = a5;
    x.fillStyle = "#fdf6e9"; x.fillRect(0, 0, 720, 1280);
    wCT(x, "V E N U E   &   R S V P", 190, "32px Georgia, serif", pal.deep);
    wFitFont(x, d.venue || "", 46, 30, "700", "Georgia, serif");
    wCT(x, d.venue || "", 320, x.font, pal.deep);
    wCT(x, d.addr || "", 380, "29px Georgia, serif", "#5a4632");
    if (d.dress) wCT(x, "👗 Dress code: " + d.dress, 445, "27px Georgia, serif", "#5a4632");
    wRR(x, 165, 540, 390, 78, 39); x.fillStyle = pal.deep; x.fill();
    wCT(x, "📍 Google Maps", 580, "30px Georgia, serif", "#fdf6e9");
    if (d.rsvp){ wRR(x, 165, 650, 390, 78, 39); x.fillStyle = "#1c9457"; x.fill(); wCT(x, "✅ WhatsApp RSVP", 690, "30px Georgia, serif", "#ffffff"); }
    wCT(x, "بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ", 850, "34px Amiri, serif", pal.deep);
    wCT(x, "شرکت کی تصدیق کے لیے واٹس ایپ پر پیغام بھیجیں", 930, "30px 'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif", "#5a4632");
    x.fillStyle = pal.deep; x.fillRect(0, 1180, 720, 100);
    wCT(x, "Made with PakToolkit — paktoolkit.top", 1232, "26px Georgia, serif", "#e8cf7a");
    x.restore();
  }
  /* petals over scenes 2-5 */
  if (t > 2.4 && petals){
    x.save();
    petals.forEach(function(p){
      var y = ((t * p.sp + p.off) % 1420) - 80;
      var px = p.x + Math.sin((t + p.off) * 0.9) * 22;
      x.font = p.sz + "px serif"; x.globalAlpha = 0.85; x.textAlign = "center";
      x.fillText(p.ch, px, y);
    });
    x.restore();
  }
  /* S1 cover opening */
  if (t < 3.1){
    var p = Math.max(0, Math.min(1, (t - 0.35) / 2.1));
    var pe = 1 - Math.pow(1 - p, 3);
    x.save();
    if (d.style === "arch"){
      x.globalAlpha = 1 - pe;
      var grd = x.createLinearGradient(0, 0, 0, 1280);
      grd.addColorStop(0, pal.deep2); grd.addColorStop(0.55, pal.deep); grd.addColorStop(1, pal.dark);
      x.fillStyle = grd; x.fillRect(0, 0, 720, 1280);
    } else {
      var off = pe * 385, sx;
      [-1, 1].forEach(function(side){
        var a = side < 0 ? -off : 360 + off, b = a + 364;
        x.save(); x.beginPath(); x.rect(Math.max(0, a), 0, Math.min(720, b) - Math.max(0, a), 1280); x.clip();
        for (sx = Math.floor(a / 36) * 36; sx < b; sx += 36){
          x.fillStyle = ((sx / 36) % 2 === 0) ? pal.dark : pal.deep2;
          x.fillRect(sx, 0, 36, 1280);
        }
        x.fillStyle = "rgba(0,0,0,.25)"; x.fillRect(side < 0 ? b - 90 : a, 0, 90, 1280);
        x.restore();
        x.fillStyle = "#c9a227"; x.fillRect(side < 0 ? b - 4 : a, 0, 4, 1280);
      });
    }
    x.globalAlpha = (1 - pe) * (t < 0.35 ? Math.min(1, t / 0.35) : 1);
    wCT(x, "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", 330, "700 40px Amiri, serif", "#e8cf7a");
    x.beginPath(); x.arc(360, 540, 92, 0, Math.PI * 2);
    x.fillStyle = pal.dark; x.fill(); x.strokeStyle = "#c9a227"; x.lineWidth = 3; x.stroke();
    wCT(x, (d.g || "G").charAt(0) + " ♥ " + (d.b || "B").charAt(0), 528, "44px Georgia, serif", "#e8cf7a");
    wCT(x, "W E D D I N G", 578, "17px Georgia, serif", "#f3e2ac");
    wCT(x, "Assalam-o-Alaikum", 730, "34px Georgia, serif", "#ffffff");
    wFitFont(x, (d.g || "").toUpperCase() + "  ·  " + (d.b || "").toUpperCase(), 30, 20, "", "Georgia, serif");
    wCT(x, (d.g || "").toUpperCase() + "  ·  " + (d.b || "").toUpperCase(), 790, x.font, "#e8cf7a");
    if (d.gu || d.bu) wCT(x, (d.gu || d.g) + " ♥ " + (d.bu || d.b), 855, "36px 'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif", "#ffffff");
    x.restore();
  }
}
async function wMakeVideo(){
  var status = $("w-videostatus"), out = $("w-videoresult"), btn = $("w-videogo");
  out.textContent = ""; out.className = "result"; btn.disabled = true;
  try {
    if (!window.MediaRecorder) throw new Error("norec");
    status.textContent = "Video ban raha hai — fonts load ho rahe hain…";
    wLoadFonts();
    try { await Promise.race([document.fonts.ready, new Promise(function(r){ setTimeout(r, 3000); })]); } catch (e) {}
    var d = wReadPayloadFromForm();
    var pal = W_PALS[d.pal || "maroon"];
    var cv = document.createElement("canvas"); cv.width = 720; cv.height = 1280;
    cv.style.cssText = "position:fixed;left:-9999px;top:0;width:72px;height:128px";
    document.body.appendChild(cv);
    var x = cv.getContext("2d");
    var ctxA = wCtx();
    var recDest = ctxA.createMediaStreamDestination();
    var tune = null, mp3Audio = null;
    if (wMp3){
      mp3Audio = new Audio(wMp3.url); mp3Audio.loop = true;
      try {
        var src = ctxA.createMediaElementSource(mp3Audio);
        src.connect(recDest); src.connect(ctxA.destination);
      } catch (e) {}
    } else if (d.tune && d.tune !== "none"){ tune = wTuneStart(d.tune, recDest); }
    var stream = new MediaStream(cv.captureStream(30).getVideoTracks().concat(recDest.stream.getAudioTracks()));
    var mime = "";
    ["video/mp4;codecs=avc1.640028,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"].forEach(function(m){
      if (!mime && MediaRecorder.isTypeSupported(m)) mime = m;
    });
    var rec = new MediaRecorder(stream, { mimeType: mime || undefined, videoBitsPerSecond: 6000000, audioBitsPerSecond: 128000 });
    var chunks = [];
    rec.ondataavailable = function(e){ if (e.data && e.data.size) chunks.push(e.data); };
    var doneP = new Promise(function(res){ rec.onstop = res; });
    var petals = [], i;
    for (i = 0; i < 16; i++) petals.push({ x: 20 + Math.random() * 680, off: Math.random() * 1300, sp: 55 + Math.random() * 55, sz: 14 + Math.random() * 13, ch: ["🌸", "🌺", "🤍", "✨"][i % 4] });
    status.textContent = "Video record ho raha hai (taqreeban 15 second) — ye page khula rakhein…";
    rec.start(250);
    if (mp3Audio) { try { await mp3Audio.play(); } catch (e) {} }
    var t0 = performance.now();
    await new Promise(function(res){
      (function frame(){
        var t = (performance.now() - t0) / 1000;
        wDrawFrame(x, d, pal, wPhotoCanvas, t, petals);
        if (t < 15.2) requestAnimationFrame(frame); else res();
      })();
    });
    rec.stop(); await doneP;
    if (tune) tune.stop();
    if (mp3Audio) mp3Audio.pause();
    cv.remove();
    var ext = mime.indexOf("mp4") >= 0 ? "mp4" : "webm";
    var blob = new Blob(chunks, { type: mime || "video/webm" });
    var url = URL.createObjectURL(blob);
    out.className = "result show";
    out.appendChild(el("p", "Video tayyar hai (" + ext.toUpperCase() + ", " + (blob.size / 1048576).toFixed(1) + " MB). Download karke WhatsApp par bhej dein" + (ext === "webm" ? " — agar kisi phone par seedha video na chale to use document ki surat bhej dein." : ".")));
    out.appendChild(download(url, "wedding-invitation." + ext));
    status.textContent = "Video mukammal ✓";
  } catch (e) {
    status.textContent = "Video is browser mein nahi ban saka — Chrome mein dobara koshish karein.";
  }
  btn.disabled = false;
}
async function wMakePoster(){
  var out = $("w-posterresult"); out.textContent = "";
  wLoadFonts();
  try { await Promise.race([document.fonts.ready, new Promise(function(r){ setTimeout(r, 3000); })]); } catch (e) {}
  var d = wReadPayloadFromForm();
  var pal = W_PALS[d.pal || "maroon"];
  var main = (typeof d.main === "number" && d.ev[d.main]) ? d.main : Math.min(1, d.ev.length - 1);
  var mev = d.ev[main];
  var cv = document.createElement("canvas"); cv.width = 720; cv.height = 1280;
  var x = cv.getContext("2d");
  x.fillStyle = "#fdf6e9"; x.fillRect(0, 0, 720, 1280);
  x.strokeStyle = "#c9a227"; x.lineWidth = 3; x.strokeRect(26, 26, 668, 1228);
  x.lineWidth = 1; x.strokeRect(38, 38, 644, 1204);
  wCT(x, "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", 105, "700 40px Amiri, serif", pal.deep);
  wFitFont(x, d.g || "", 54, 32, "italic 700", "Georgia, serif");
  wCT(x, d.g || "", 185, x.font, pal.deep);
  wCT(x, "— ♥ weds ♥ —", 238, "30px Georgia, serif", "#c9a227");
  wFitFont(x, d.b || "", 54, 32, "italic 700", "Georgia, serif");
  wCT(x, d.b || "", 292, x.font, pal.deep);
  if (d.gu || d.bu) wCT(x, (d.gu || d.g) + " ♥ " + (d.bu || d.b), 362, "36px 'Jameel Noori Nastaleeq','Noto Nastaliq Urdu',serif", "#7c5a17");
  if (wPhotoCanvas){
    wArchPath(x, 190, 420, 340, 520);
    x.save(); x.clip(); x.drawImage(wPhotoCanvas, 190, 420, 340, 520); x.restore();
    wArchPath(x, 190, 420, 340, 520); x.strokeStyle = "#c9a227"; x.lineWidth = 5; x.stroke();
  } else {
    x.beginPath(); x.arc(360, 640, 105, 0, Math.PI * 2);
    x.fillStyle = pal.dark; x.fill(); x.strokeStyle = "#c9a227"; x.lineWidth = 3; x.stroke();
    wCT(x, (d.g || "G").charAt(0) + " ♥ " + (d.b || "B").charAt(0), 628, "46px Georgia, serif", "#e8cf7a");
    wCT(x, "W E D D I N G", 682, "18px Georgia, serif", "#f3e2ac");
  }
  wCT(x, wDateLong(mev), 1010, "700 38px Georgia, serif", pal.deep);
  wCT(x, mev.n + " · " + (mev.t || "") + " — " + (d.venue || ""), 1068, "27px Georgia, serif", "#5a4632");
  x.fillStyle = pal.deep; x.fillRect(0, 1180, 720, 100);
  wCT(x, "Made with PakToolkit — paktoolkit.top", 1232, "25px Georgia, serif", "#e8cf7a");
  var b = await canvasBlob(cv, "image/jpeg", 0.92);
  var url = URL.createObjectURL(b);
  out.className = "result show";
  var im = document.createElement("img"); im.className = "preview"; im.alt = "Wedding invitation poster";
  im.src = url; out.appendChild(im);
  out.appendChild(download(url, "wedding-poster.jpg"));
}

/* ---- Built-in tunes: synthesized with WebAudio (no audio files, no
   copyright). start(kind, extraDest) -> {playing, stop(), resume()}.
   extraDest lets the video recorder tap the same music. ---- */
var wAudioCtx = null;
function wCtx(){
  if (!wAudioCtx) { var AC = window.AudioContext || window.webkitAudioContext; wAudioCtx = new AC(); }
  if (wAudioCtx.state === "suspended") wAudioCtx.resume();
  return wAudioCtx;
}
function wTuneStart(kind, extraDest){
  if (!kind || kind === "none") return null;
  var ctx = wCtx();
  var master = ctx.createGain(); master.gain.value = 0.0;
  master.connect(ctx.destination);
  if (extraDest) master.connect(extraDest);
  master.gain.linearRampToValueAtTime(0.55, ctx.currentTime + 1.2);
  var timer = null, step = 0, stopped = false;
  function pluck(freq, vol, dur){
    var t = ctx.currentTime;
    var o1 = ctx.createOscillator(); o1.type = "triangle"; o1.frequency.value = freq;
    var o2 = ctx.createOscillator(); o2.type = "sine"; o2.frequency.value = freq * 2;
    var f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 2600;
    var g = ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o1.connect(f); o2.connect(f); f.connect(g); g.connect(master);
    o1.start(t); o2.start(t); o1.stop(t + dur); o2.stop(t + dur);
  }
  function bell(freq, vol){
    var t = ctx.currentTime;
    [1, 2.76, 5.4].forEach(function(mult, ix){
      var o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = freq * mult;
      var g = ctx.createGain();
      var v = vol / (ix + 1);
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.8 - ix * 0.7);
      o.connect(g); g.connect(master); o.start(t); o.stop(t + 3);
    });
  }
  var droneNodes = [];
  function droneStart(){
    [[110, "sawtooth"], [164.81, "sawtooth"], [220, "triangle"]].forEach(function(cfg){
      var o = ctx.createOscillator(); o.type = cfg[1]; o.frequency.value = cfg[0];
      var f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 420;
      var g = ctx.createGain(); g.gain.value = 0.045;
      o.connect(f); f.connect(g); g.connect(master); o.start();
      droneNodes.push(o);
    });
  }
  var scales = {
    strings: [220, 261.63, 293.66, 329.63, 392, 440, 392, 329.63, 293.66, 261.63],
    bells: [659.25, 783.99, 880, 783.99, 659.25, 587.33, 523.25, 587.33]
  };
  function schedule(){
    if (kind === "strings"){ timer = setInterval(function(){ if (step % 5 !== 4) pluck(scales.strings[step % scales.strings.length], 0.5, 1.4); step++; }, 560); }
    else if (kind === "bells"){ timer = setInterval(function(){ bell(scales.bells[step % scales.bells.length], 0.32); step++; }, 1150); }
    else if (kind === "drone"){ droneStart(); timer = setInterval(function(){ pluck(step % 2 ? 220 : 164.81, 0.3, 2.2); step++; }, 4000); pluck(220, 0.3, 2.2); }
  }
  schedule();
  var handle = {
    playing: true,
    stop: function(){
      handle.playing = false;
      if (timer) clearInterval(timer);
      droneNodes.forEach(function(o){ try { o.stop(); } catch (e) {} });
      droneNodes = [];
      try { master.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.4); } catch (e) {}
      setTimeout(function(){ try { master.disconnect(); } catch (e) {} }, 600);
    },
    resume: function(){
      var h = wTuneStart(kind, extraDest);
      if (h){ handle.stop = h.stop; handle.resume = h.resume; handle.playing = true; }
    }
  };
  return handle;
}
/* Maker-side MP3 (preview + video only — a guest link cannot carry a file) */
var wMp3 = null; /* {url, name} */
var wPhotoCanvas = null;
var wPhotoB64 = null; /* "w."/"j." + base64url of the tiny cover copy that rides in the link fragment */
function wCurrentShot(){
  var r = document.querySelector('input[name="w-shot"]:checked');
  return r ? r.value : "";
}
function wBuildGuest(){
  var d = wReadPayloadFromForm();
  var shot = wCurrentShot();
  d.shot = shot;
  return { d: d, photo: (!shot && wPhotoB64) ? wPhotoB64 : null };
}
function wReadPayloadFromForm(){
  function evRow(n){
    return { n: $("w-ev" + n + "-n").value.trim(), d: $("w-ev" + n + "-d").value, t: $("w-ev" + n + "-t").value.trim(), vn: $("w-ev" + n + "-v").value.trim() };
  }
  var rows = [evRow(1), evRow(2), evRow(3)], evs = [], main = 0;
  rows.forEach(function(r, i){ if (r.n){ if (i === 1) main = evs.length; evs.push(r); } });
  if (!evs.length) evs.push(rows[1]);
  return {
    v: 1,
    g: $("w-groom").value.trim(), b: $("w-bride").value.trim(),
    gu: $("w-groom-u").value.trim(), bu: $("w-bride-u").value.trim(),
    host: $("w-host").value.trim(), gf: $("w-groom-fam").value.trim(), bf: $("w-bride-fam").value.trim(),
    style: $("w-style").value, pal: $("w-pal").value, tune: $("w-tune").value,
    ev: evs, main: main,
    venue: $("w-venue").value.trim(), addr: $("w-addr").value.trim(),
    dress: $("w-dress").value.trim(),
    rsvp: $("w-rsvp").value.replace(/\D/g, "").replace(/^0/, "92")
  };
}
function initWedding(){
  var hasMaker = !!$("w-makelink");
  var dParam = new URLSearchParams(location.search).get("d");
  if (dParam){
    wDecodePayload(dParam).then(function(d){ if (Array.isArray(d)) d = wFromCompact(d); wRenderGuest(d, {}); }).catch(function(){ /* bad link — fall through to the maker */ });
    if (!hasMaker) return;
  }
  if (!hasMaker) return;
  wLoadFonts();
  $("w-makelink").addEventListener("click", async function(){
    var out = $("w-linkresult"); out.className = "result show"; out.textContent = "";
    var status = el("p", "Link ban raha hai…"); out.appendChild(status);
    try {
      var built = wBuildGuest();
      var enc = await wEncodePayload(wToCompact(built.d));
      var link = location.origin + location.pathname + "?d=" + enc + (built.photo ? "#p=" + built.photo : "");
      status.textContent = "Aap ka invitation link tayyar hai — copy karke WhatsApp par bhejein:";
      var inp = document.createElement("input");
      inp.type = "text"; inp.readOnly = true; inp.value = link; inp.style.width = "100%";
      out.appendChild(inp);
      var cp = el("button", "📋 Link copy karein"); cp.className = "btn"; cp.type = "button";
      cp.addEventListener("click", function(){
        inp.select();
        if (navigator.clipboard) navigator.clipboard.writeText(link).then(function(){ cp.textContent = "✅ Copy ho gaya"; }, function(){ document.execCommand("copy"); cp.textContent = "✅ Copy ho gaya"; });
        else { document.execCommand("copy"); cp.textContent = "✅ Copy ho gaya"; }
      });
      out.appendChild(cp);
      var share = el("a", "💬 WhatsApp par bhejein"); share.className = "btn";
      share.href = "https://wa.me/?text=" + encodeURIComponent("Assalam-o-Alaikum! " + built.d.g + " & " + built.d.b + " ki shadi ki dawwat hai 💌 Ye mera apna banaya hua digital invitation hai (PakToolkit par) — is link ko khol kar dekhein: " + link);
      share.target = "_blank"; share.rel = "noopener";
      share.style.marginLeft = "8px"; out.appendChild(share);
      var pv = el("button", "👀 Preview — mehman ki nazar se"); pv.className = "btn"; pv.type = "button";
      pv.style.marginLeft = "8px";
      pv.addEventListener("click", function(){
        var b2 = wBuildGuest();
        wRenderGuest(b2.d, { preview: true, photo: b2.photo ? ("data:image/" + (b2.photo.charAt(0) === "j" ? "jpeg" : "webp") + ";base64," + wB64UrlToStd(b2.photo.slice(2))) : null });
      });
      out.appendChild(pv);
    } catch (e) { status.textContent = "Link nahi ban saka — dobara koshish karein."; }
  });
  $("w-mp3btn").addEventListener("click", function(){ $("w-mp3file").click(); });
  $("w-mp3file").addEventListener("change", function(){
    var f = this.files[0]; if (!f) return;
    if (wMp3) URL.revokeObjectURL(wMp3.url);
    wMp3 = { url: URL.createObjectURL(f), name: f.name };
    $("w-mp3name").textContent = "🎵 Chosen: " + f.name + " — ye dhun aap ke preview mein chalegi.";
  });
  $("w-photogo").addEventListener("click", async function(){
    var status = $("w-photostatus"), out = $("w-photoresult");
    var f = $("w-photo").files[0];
    out.textContent = "";
    if (!f) { status.textContent = "Pehle couple ki photo chunein."; return; }
    status.textContent = "Photo tayyar ho rahi hai…";
    try {
      var img = await fileToImage(f);
      var cut = await removeBgSmart(img, f.name + ":" + f.size + ":" + f.lastModified, status);
      var W = 900, H = 1150, cv = document.createElement("canvas"); cv.width = W; cv.height = H;
      var x = cv.getContext("2d");
      var bgKind = $("w-photobg").value;
      var grad = x.createRadialGradient(W / 2, H * 0.35, 60, W / 2, H / 2, H * 0.75);
      if (bgKind === "gold"){ grad.addColorStop(0, "#f9edbe"); grad.addColorStop(1, "#d9a83f"); }
      else if (bgKind === "maroon"){ grad.addColorStop(0, "#a93447"); grad.addColorStop(1, "#4a0d19"); }
      else if (bgKind === "garden"){ grad.addColorStop(0, "#cfe8b8"); grad.addColorStop(1, "#3f7a3a"); }
      else { grad.addColorStop(0, "#eaf6ff"); grad.addColorStop(1, "#7fb2e5"); }
      x.fillStyle = grad; x.fillRect(0, 0, W, H);
      var sc2 = Math.min(W / cut.width, H / cut.height);
      var dw = cut.width * sc2, dh = cut.height * sc2;
      x.drawImage(cut, (W - dw) / 2, H - dh, dw, dh);
      wPhotoCanvas = cv;
      try {
        var tiny = document.createElement("canvas"); tiny.width = 208; tiny.height = 266;
        tiny.getContext("2d").drawImage(cv, 0, 0, 208, 266);
        /* JPEG on purpose: every browser decodes it. (A WebP copy failed to
           decode in one test browser — not worth the risk for a cover.)
           Kept small so the photo link stays as short as possible. */
        var tb = await canvasBlob(tiny, "image/jpeg", 0.6);
        var tbuf = new Uint8Array(await tb.arrayBuffer());
        wPhotoB64 = "j." + wB64UrlEncode(tbuf);
      } catch (e2) { wPhotoB64 = null; }
      status.textContent = "Photo tayyar hai ✓ — yehi photo cover par lagegi aur link ke saath mehman tak jayegi.";
      out.className = "result show";
      var b = await canvasBlob(cv, "image/jpeg", 0.9);
      var im = document.createElement("img"); im.className = "preview"; im.alt = "Couple photo with new background";
      im.src = URL.createObjectURL(b); out.appendChild(im);
      out.appendChild(download(URL.createObjectURL(b), "couple-photo.jpg"));
    } catch (e) { status.textContent = "Background remove nahi ho saka (model ke liye pehli dafa internet chahiye). Dobara koshish karein."; }
  });
  (function buildShots(){
    var box = $("w-shots"); if (!box) return;
    box.style.cssText = "display:flex;gap:12px;flex-wrap:wrap;margin:6px 0 4px";
    var opts = [["", "Apni photo / koi nahi", null],
                ["maroon", "Maroon shot", window.W_SHOTS && W_SHOTS.maroon],
                ["green", "Sabz shot", window.W_SHOTS && W_SHOTS.green],
                ["royal", "Shahi neela shot", window.W_SHOTS && W_SHOTS.royal]];
    opts.forEach(function(o, ix){
      var lab = document.createElement("label");
      lab.style.cssText = "text-align:center;font-size:.8rem;cursor:pointer;width:76px";
      var inp = document.createElement("input");
      inp.type = "radio"; inp.name = "w-shot"; inp.value = o[0]; if (ix === 0) inp.checked = true;
      lab.appendChild(inp);
      if (o[2]){
        var im = document.createElement("img");
        im.src = o[2]; im.alt = o[1];
        im.style.cssText = "width:64px;height:82px;object-fit:cover;border-radius:10px;border:3px solid #d8cfc0;display:block;margin:4px auto 2px";
        lab.appendChild(im);
      }
      lab.appendChild(document.createTextNode(o[1]));
      box.appendChild(lab);
    });
    box.addEventListener("change", function(){
      box.querySelectorAll("img").forEach(function(im){ im.style.borderColor = "#d8cfc0"; });
      var chk = box.querySelector('input[name="w-shot"]:checked');
      if (chk && chk.value){
        var im2 = chk.parentNode.querySelector("img");
        if (im2) im2.style.borderColor = "#c9a227";
      }
    });
  })();
  /* v1 is link-only (Mazeen's call): the video/poster buttons are not in the
     maker UI; wMakeVideo / wMakePoster stay dormant in this file for later. */
}


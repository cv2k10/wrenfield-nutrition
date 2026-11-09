// Wrenfield Nutrition ad-style walkthrough. Writes index.html and compositions/*.html from the
// live-site captures (assets/shots + manifest.json), the narration (script.json, assets/vo) and its
// word timings (assets/words). Re-run after changing copy or timing: node build.mjs
import fs from 'fs';
import { execSync } from 'child_process';

const M = JSON.parse(fs.readFileSync('assets/shots/manifest.json', 'utf8'));
const SCRIPT = JSON.parse(fs.readFileSync('script.json', 'utf8'));
const r2 = n => Math.round(n * 100) / 100;
const probe = f => parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${f}`).toString());

// ---------- brand (the site's own palette) ----------
const C = { cream: '#FBF7F0', sage: '#2F4A3A', deep: '#1F3328', terra: '#C4623F', wheat: '#F2E6CF', olive: '#7C8B5A', leaf: '#3E8E5E', glow: '#FFC48A' };
const FONTS = `
    @font-face { font-family: "Fraunces"; src: url("assets/fonts/fraunces.woff2") format("woff2"); font-weight: 100 900; }
    @font-face { font-family: "Fraunces"; src: url("assets/fonts/fraunces-italic.woff2") format("woff2"); font-weight: 100 900; font-style: italic; }
    @font-face { font-family: "Outfit"; src: url("assets/fonts/outfit.woff2") format("woff2"); font-weight: 100 900; }`;
const DEMO_URL = 'www.wrenfieldnutrition.demo';
const BAR = 72;          // browser bar; the page keeps its full 1920px width under it
const VW = 1920, VH = 1008;
const D = 1030;          // extra height the open Plate Check result adds above later sections in the live captures

// ---------- narration clock ----------
const GAP = { intro: 0.7, hero: 0.7, sf: 1.5, quiz: 1.5, quiz2: 1.1, dont: 1.7, how: 1.0, plans: 1.1, toolkit: 1.2, guide: 1.3, faq: 1.1, final: 1.2, f1: 2.9, f1err: 0.9, f2: 1.3, f3: 1.2, f4: 1.4, f5: 1.2, cta: 2.2 };
const norm = s => s.toLowerCase().replace(/[^a-z0-9']/g, '');
const vo = {}, words = {};
let clock = 0;
for (const s of SCRIPT) {
  const raw = JSON.parse(fs.readFileSync(`assets/words/${s.id}.json`, 'utf8'));
  const w = (Array.isArray(raw) ? raw : raw.words).map(x => ({ text: x.text, start: x.start, end: x.end }));
  const said = s.text.split(/\s+/);
  if (s.id === 'plans') { const k = w.findIndex(x => norm(x.text) === 'week'); w[k].text = 'week-by-week'; w[k].end = w[k + 2].end; w.splice(k + 1, 2); }
  if (s.id === 'cta') { const k = w.findIndex(x => norm(x.text) === 'talk'); const a = w[k], m = (a.start + a.end) / 2; w.splice(k + 1, 0, { text: 'to', start: m, end: a.end }); a.end = m; }
  if (w.length === said.length) w.forEach((x, i) => (x.text = said[i]));
  else throw new Error(`word count mismatch in ${s.id}`);
  const dur = probe(`assets/vo/${s.id}.wav`);
  const start = clock + GAP[s.id];
  vo[s.id] = { start, dur, end: start + dur };
  words[s.id] = w.map(x => ({ ...x, start: start + x.start, end: start + x.end }));
  clock = start + dur;
}
const at = (id, word, nth = 0) => {
  const hits = words[id].filter(w => norm(w.text) === norm(word));
  if (!hits[nth]) throw new Error(`no "${word}" #${nth} in ${id}`);
  return hits[nth].start;
};
const COVER = r2(Math.max(5.8, at('intro', 'watch') - 0.35));
const END0 = r2(vo.f5.end + 1.3);
const total = r2(vo.cta.end + 3.2);

// ---------- scene wrapper ----------
const scene = (id, css, body, js) => `<template>
  <style>${FONTS}
    #root { position: absolute; inset: 0; overflow: hidden; }
${css}
  </style>
  <div id="root" data-composition-id="${id}" data-width="1920" data-height="1080" data-layout-allow-overflow data-layout-allow-overlap>
${body}
  </div>
  <script>
    window.__timelines = window.__timelines || {};
    const tl = gsap.timeline({ paused: true });
${js.join('\n')}
    window.__timelines["${id}"] = tl;
  </script>
</template>
`;
const sfx = [];
const addSfx = (name, t, dur, vol) => sfx.push({ name, t: r2(t), dur, vol });

// =================== SITE: the live page in a browser ===================
const S0 = r2(COVER - 0.7);           // site scene starts under the cover's exit
const js = [];
const L = t => r2(t - S0);              // absolute -> scene-local time
const st = M.states, P = M.prect;
const mid = r => ({ x: r.x + r.width / 2, y: r.y + r.height / 2 });

// page scroll (plate), header overlay once the page has moved
let pageY = 0;
const scrollTo = (t, y, d = 1.2) => { js.push(`tl.to("#plate",{y:${-y},duration:${d},ease:"power2.inOut"},${L(t)});`); pageY = y; };
const jumpTo = (t, y) => { js.push(`tl.set("#plate",{y:${-y}},${L(t)});`); pageY = y; };

// one captured state on screen at a time (over the plate)
const used = new Set();
let live = null;
const show = (name, t, fade = 0) => {
  used.add(name);
  if (fade) js.push(`tl.to("#s-${name}",{opacity:1,duration:${fade},ease:"power1.inOut"},${L(t)});`);
  else js.push(`tl.set("#s-${name}",{opacity:1},${L(t)});`);
  if (live && live !== name) js.push(`tl.set("#s-${live}",{opacity:0},${L(t + fade + 0.02)});`);
  live = name;
};
const clear = (t, fade = 0) => {
  if (!live) return;
  if (fade) js.push(`tl.to("#s-${live}",{opacity:0,duration:${fade}},${L(t)});`);
  else js.push(`tl.set("#s-${live}",{opacity:0},${L(t)});`);
  live = null;
};

// camera: punch-ins only on lead-capture moments
const cam = (cx, cy, s) => ({
  x: r2(Math.min(0, Math.max(VW - VW * s, VW / 2 - s * cx))),
  y: r2(Math.min(0, Math.max(VH - VH * s, VH / 2 - s * cy))),
  s,
});
const zoom = (t, cx, cy, s, d = 0.9) => { const c = cam(cx, cy, s); js.push(`tl.to("#cam",{x:${c.x},y:${c.y},scale:${s},duration:${d},ease:"power3.inOut"},${L(t)});`); };
const unzoom = (t, d = 0.8) => js.push(`tl.to("#cam",{x:0,y:0,scale:1,duration:${d},ease:"power3.inOut"},${L(t)});`);

// spotlight: dims the page around one rect (viewport coords)
const spot = (t, r, pad = 14, d = 0.45) => {
  const v = { x: r.x - pad, y: r.y - pad, w: r.width + pad * 2, h: r.height + pad * 2 };
  js.push(`tl.to("#spot",{x:${r2(v.x)},y:${r2(v.y)},width:${r2(v.w)},height:${r2(v.h)},opacity:1,duration:${d},ease:"power3.out"},${L(t)});`);
};
const spotOff = (t, d = 0.35) => js.push(`tl.to("#spot",{opacity:0,duration:${d},ease:"power2.in"},${L(t)});`);
const pageRect = (r, y = pageY) => ({ x: r.x, y: r.y - y, width: r.width, height: r.height });

// cursor
const cursorTo = (t, p, d = 0.7) => js.push(`tl.to("#cur",{x:${r2(p.x)},y:${r2(p.y)},duration:${d},ease:"power2.inOut"},${L(t)});`);
const cursorIn = (t, p) => { js.push(`tl.set("#cur",{x:${r2(p.x + 260)},y:${r2(p.y + 180)}},${L(t)});`, `tl.to("#cur",{opacity:1,duration:0.25},${L(t)});`); cursorTo(t, p, 0.8); };
const cursorOut = t => js.push(`tl.to("#cur",{opacity:0,duration:0.25},${L(t)});`);
let rip = 0;
const click = (t, p) => {
  const id = `rip${rip++}`;
  ripples.push(id);
  js.push(`tl.to("#cur",{scale:0.82,duration:0.08,yoyo:true,repeat:1,transformOrigin:"0 0"},${L(t)});`);
  js.push(`tl.set("#${id}",{x:${r2(p.x - 30)},y:${r2(p.y - 30)},opacity:0.9,scale:0.3},${L(t)});`);
  js.push(`tl.to("#${id}",{scale:1.6,opacity:0,duration:0.5,ease:"power2.out"},${L(t)});`);
  addSfx(rip % 2 ? 'click' : 'click-soft', t, 0.36, 0.5);
};
const ripples = [];

// chapter stickers + story progress segments
const CH = [];
const chapter = (t, label) => {
  const i = CH.length;
  CH.push(label);
  js.push(`tl.fromTo("#stk${i}",{opacity:0,scale:0.6,rotation:-14},{opacity:1,scale:1,rotation:-4,duration:0.45,ease:"back.out(2.4)"},${L(t)});`);
  if (i > 0) js.push(`tl.to("#stk${i - 1}",{opacity:0,y:-20,duration:0.2,ease:"power2.in"},${L(t - 0.3)});`);
  js.push(`tl.to("#seg${i} i",{scaleX:1,duration:0.6,ease:"power2.out"},${L(t)});`);
  js.push(`tl.set("#chap",{text:""},${L(t)});`);
  addSfx('pop', t + 0.05, 0.4, 0.28);
};

// ---- HOOK: hero ----
show('hero', S0);
chapter(S0 + 0.5, 'The hook');
const H = st.hero;
spot(at('hero', 'first'), H.h1, 22);
spot(at('hero', 'two'), { x: H.cta.x, y: H.cta.y, width: H.quizcta.x + H.quizcta.width - H.cta.x, height: H.cta.height }, 16);
cursorIn(at('hero', 'two') + 0.2, mid(H.cta));
cursorTo(at('hero', 'take'), mid(H.quizcta), 0.6);
spotOff(vo.hero.end - 0.1);

// ---- PAIN POINTS: sound familiar ----
let t = vo.hero.end + 0.15;
clear(t); jumpTo(t, 0);
js.push(`tl.set("#hdr",{opacity:1},${L(t + 0.25)});`);
scrollTo(t, st.sf_open.scrollY, 1.3); addSfx('whoosh-short', t, 0.5, 0.25);
chapter(t + 0.6, 'Pain points');
spot(at('sf', 'visitors'), pageRect(P.sf_cards, st.sf_open.scrollY), 16);
cursorTo(at('sf', 'tap') - 0.3, mid(st.sf_open.card), 0.6);
spotOff(at('sf', 'sounds'));
click(at('sf', 'sounds') + 0.05, mid(st.sf_open.card));
show('sf_open', at('sf', 'sounds') + 0.1, 0.18);
spot(at('sf', 'plain'), st.sf_open.panel, 10);
spotOff(vo.sf.end);

// ---- LEAD MAGNET: Plate Check ----
t = vo.sf.end + 0.15;
clear(t, 0.2);
scrollTo(t + 0.1, st.quiz_q1.scrollY, 1.3); addSfx('whoosh-short', t + 0.1, 0.5, 0.25);
chapter(t + 0.7, 'Lead magnet');
const Q = st.quiz_q1;
show('quiz_q1', vo.quiz.start - 0.05);
spot(at('quiz', 'plate'), Q.card, 16);
cursorTo(at('quiz', 'seven') - 0.4, mid(Q.opt), 0.5);
click(at('quiz', 'seven') + 0.1, mid(Q.opt));
show('quiz_q1_sel', at('quiz', 'seven') + 0.15);
cursorTo(at('quiz', 'questions'), mid(Q.next), 0.45);
click(at('quiz', 'one', 0) + 0.05, mid(Q.next));
const Q4 = st.quiz_q4_sel;
show('quiz_q4_sel', at('quiz', 'time') - 0.05, 0.15);
spot(at('quiz', 'time') - 0.05, Q4.card, 16);
cursorTo(at('quiz', 'time') + 0.2, mid(Q4.next), 0.4);
click(vo.quiz.end + 0.15, mid(Q4.next));
spotOff(vo.quiz.end + 0.2);
// result: punch in on score, weakest areas, plan + the carry-over button
show('quiz_res1', vo.quiz.end + 0.4, 0.25);
addSfx('sparkle', vo.quiz.end + 0.45, 1.2, 0.2);
cursorOut(vo.quiz.end + 0.4);
zoom(at('quiz2', 'score') - 0.3, 960, 330, 1.45, 0.9);
zoom(at('quiz2', 'weakest') - 0.2, 960, 690, 1.45, 1.0);
const R2 = st.quiz_res2;
show('quiz_res2', at('quiz2', 'plan') - 0.15, 0.3);
zoom(at('quiz2', 'plan') - 0.15, 960, 330, 1.5, 0.9);
spot(at('quiz2', 'button') - 0.1, R2.bring, 10);
cursorIn(at('quiz2', 'button'), mid(R2.bring));
unzoom(vo.quiz2.end + 0.1);
spotOff(vo.quiz2.end + 0.1);
cursorOut(vo.quiz2.end + 0.1);

// ---- TRUST: what we don't do, how it works ----
t = vo.quiz2.end + 0.5;
jumpTo(t, st.quiz_q1.scrollY);
clear(t, 0.3);
scrollTo(t + 0.25, P.dont_table.y - 230, 1.3); addSfx('whoosh-short', t + 0.25, 0.5, 0.25);
chapter(t + 0.8, 'Trust');
spot(at('dont', 'red') - 0.1, pageRect(P.dont_table, P.dont_table.y - 230), 12);
spotOff(vo.dont.end + 0.2);
scrollTo(vo.dont.end + 0.3, P.how_cards.y - 330, 1.1);
spot(at('how', 'four'), pageRect(P.how_cards, P.how_cards.y - 330), 14);
spotOff(vo.how.end + 0.1);

// ---- PRICING: plans, plan details, toolkit, coach ----
t = vo.how.end + 0.2;
scrollTo(t, P.plan_cards.y - 220, 1.1); addSfx('whoosh-short', t, 0.5, 0.2);
chapter(t + 0.5, 'Clear pricing');
spot(at('plans', 'prices'), pageRect(P.plan_cards, P.plan_cards.y - 220), 14);
spotOff(at('plans', 'each') - 0.1);
// swap to the live capture at the same spot, then open Steady Strength
const PL = st.plans;
jumpTo(at('plans', 'each') - 0.1, PL.scrollY - D);
show('plans', at('plans', 'each') - 0.08);
cursorIn(at('plans', 'each') - 0.1, mid(PL.btn));
click(at('plans', 'opens') + 0.05, mid(PL.btn));
show('plan_dialog', at('plans', 'opens') + 0.1, 0.2);
cursorTo(at('plans', 'booking') - 0.3, { x: 960, y: 952 }, 0.6);
cursorOut(vo.plans.end + 0.2);
t = vo.plans.end + 0.3;
clear(t, 0.25);
scrollTo(t + 0.1, P.toolkit.y - 160, 1.2);
spot(at('toolkit', 'home') - 0.4, pageRect(P.toolkit, P.toolkit.y - 160), 12);
spotOff(at('toolkit', 'meet') - 0.15);
scrollTo(at('toolkit', 'meet') - 0.2, P.coach_img.y - 240, 1.0);
spot(at('toolkit', 'coach') - 0.1, pageRect(P.coach_img, P.coach_img.y - 240), 10);
spotOff(vo.toolkit.end + 0.4);

// ---- EMAIL CAPTURE: protein guide, FAQ ----
const G = st.guide_filled;
t = vo.toolkit.end + 0.5;
scrollTo(t, G.scrollY - D, 1.1); addSfx('whoosh-short', t, 0.5, 0.2);
chapter(t + 0.5, 'Email capture');
show('guide_filled', vo.guide.start - 0.1, 0.25);
addSfx('typing', vo.guide.start - 0.05, 0.6, 0.25);
zoom(at('guide', 'free') - 0.2, mid(G.form).x - 60, mid(G.form).y + 20, 1.35, 0.9);
cursorIn(at('guide', 'captures') - 0.2, mid(G.btn));
click(at('guide', 'email') + 0.1, mid(G.btn));
show('guide_done', at('guide', 'email') + 0.15, 0.2);
addSfx('sparkle', at('guide', 'email') + 0.2, 1.2, 0.18);
unzoom(vo.guide.end + 0.15);
cursorOut(vo.guide.end + 0.15);
t = vo.guide.end + 0.35;
jumpTo(t, G.scrollY - D);
clear(t, 0.2);
scrollTo(t + 0.1, P.faq.y - 150, 1.0);
spot(at('faq', 'straight'), pageRect(P.faq, P.faq.y - 150), 12);
spotOff(vo.faq.end + 0.1);

// ---- BOOKING FUNNEL ----
const F = st.final;
t = vo.faq.end + 0.2;
scrollTo(t, F.scrollY - D, 1.0); addSfx('whoosh-short', t, 0.5, 0.2);
chapter(t + 0.4, 'Booking funnel');
show('final', vo.final.start - 0.1);
spot(at('final', 'every'), F.cta, 12);
cursorIn(at('final', 'every'), mid(F.cta));
click(vo.final.end + 0.1, mid(F.cta));
spotOff(vo.final.end + 0.1);
// bumper: a terracotta plate fills the frame from the click, says the promise, opens on step 1
const B0 = vo.final.end + 0.15;
js.push(`tl.set("#plateWipe",{x:${r2(mid(F.cta).x - 60)},y:${r2(mid(F.cta).y - 60)},scale:0,opacity:1},${L(B0)});`);
js.push(`tl.to("#plateWipe",{scale:40,duration:0.75,ease:"power3.in"},${L(B0)});`);
js.push(`tl.fromTo("#bump1",{opacity:0,y:40},{opacity:1,y:0,duration:0.45,ease:"power3.out"},${L(B0 + 0.6)});`);
js.push(`tl.fromTo("#bump2",{opacity:0,y:30},{opacity:1,y:0,duration:0.45,ease:"power3.out"},${L(B0 + 0.85)});`);
addSfx('whoosh-short', B0, 0.5, 0.3);
cursorOut(B0 + 0.3);
const Bout = vo.f1.start - 0.55;
const Z = s => ({ s: s, cx: 960 });
show('b1', Bout - 0.05);
zoom(Bout - 0.06, 960, mid(st.b1.dlg).y, 1.3, 0.01);
js.push(`tl.to("#bump1,#bump2",{opacity:0,duration:0.2},${L(Bout - 0.2)});`);
js.push(`tl.to("#plateWipe",{scale:0,duration:0.6,ease:"power3.out"},${L(Bout)});`);
// step 1: empty, errors, filled
const b1 = st.b1;
zoom(at('f1', 'where') - 0.2, 960, 420, 1.55, 0.8);
cursorIn(at('f1', 'concern'), mid(b1.next));
zoom(vo.f1.end - 0.2, 960, 760, 1.55, 0.7);
click(vo.f1.end + 0.5, mid(b1.next));
show('b1_err', vo.f1.end + 0.55, 0.12);
zoom(vo.f1.end + 0.6, 960, 420, 1.5, 0.8);
cursorTo(at('f1err', 'exactly'), mid(st.b1_err.opt), 0.6);
click(vo.f1err.end - 0.3, mid(st.b1_err.opt));
show('b1_ok', vo.f1err.end - 0.25, 0.15);
zoom(vo.f1err.end - 0.1, 960, 600, 1.45, 0.8);
cursorTo(vo.f1err.end + 0.1, mid(st.b1_ok.next), 0.6);
click(vo.f1err.end + 0.75, mid(st.b1_ok.next));
// step 2
show('b2', vo.f1err.end + 0.8, 0.15);
zoom(vo.f1err.end + 0.85, 960, 330, 1.55, 0.7);
cursorTo(at('f2', 'goals') - 0.2, mid(st.b2.box), 0.5);
click(at('f2', 'goals'), mid(st.b2.box));
show('b2_ok', at('f2', 'few') - 0.05, 0.12);
click(at('f2', 'few'), { x: mid(st.b2.box).x, y: mid(st.b2.box).y + 72 });
zoom(vo.f2.end + 0.1, 960, 830, 1.45, 0.7);
cursorTo(vo.f2.end + 0.2, mid(st.b2_ok.next), 0.55);
click(vo.f2.end + 0.9, mid(st.b2_ok.next));
// step 3
show('b3', vo.f2.end + 0.95, 0.15);
zoom(vo.f2.end + 1.0, 960, mid(st.b3.dlg).y - 60, 1.5, 0.7);
show('b3_ok', at('f3', 'contact') + 0.3, 0.5);
addSfx('typing', at('f3', 'contact') + 0.3, 0.9, 0.25);
cursorTo(at('f3', 'best'), mid(st.b3_ok.next), 0.6);
zoom(at('f3', 'best'), 960, mid(st.b3.dlg).y + 40, 1.5, 0.7);
click(vo.f3.end + 0.7, mid(st.b3_ok.next));
// step 4 review with the Plate Check banner
show('b4', vo.f3.end + 0.75, 0.15);
zoom(vo.f3.end + 0.8, 960, 300, 1.6, 0.8);
cursorTo(at('f4', 'plate'), { x: 1150, y: 236 }, 0.6);
zoom(vo.f4.end + 0.1, 960, 800, 1.45, 0.8);
cursorTo(vo.f4.end + 0.2, mid(st.b4.next), 0.6);
click(vo.f4.end + 1.0, mid(st.b4.next));
// success
show('b5', vo.f4.end + 1.05, 0.2);
addSfx('sparkle', vo.f4.end + 1.1, 1.2, 0.22);
zoom(vo.f4.end + 1.1, 960, mid(st.b5.dlg).y, 1.3, 0.8);
cursorOut(vo.f4.end + 1.1);
unzoom(vo.f5.end + 0.2, 1.0);

// ---- site markup ----
const segs = CH.map((_, i) => `<div class="seg" id="seg${i}"><i></i></div>`).join('');
const stks = CH.map((c, i) => `<div class="stk" id="stk${i}"><b>${String(i + 1).padStart(2, '0')}</b>${c}</div>`).join('\n    ');
const imgs = [...used].map(n => `<img id="s-${n}" class="state" src="assets/shots/${n}.jpg" alt="">`).join('\n        ');
const rips = ripples.map(id => `<div class="rip" id="${id}"></div>`).join('');
const siteDur = r2(END0 + 0.6 - S0);
const siteCss = `
    #root { background: ${C.deep}; }
    #bar { position: absolute; left: 0; top: 0; width: 1920px; height: ${BAR}px; background: #EFE7D9; border-bottom: 1px solid #DCD0BC; }
    .dot { position: absolute; top: 30px; width: 14px; height: 14px; border-radius: 50%; }
    #url { position: absolute; left: 50%; top: 18px; width: 640px; margin-left: -320px; height: 38px; border-radius: 19px; background: #FFFDF8;
      border: 1px solid #DCD0BC; font: 500 19px/38px Outfit; color: ${C.sage}; text-align: center; letter-spacing: .01em; }
    #url svg { vertical-align: -3px; margin-right: 8px; }
    #segs { position: absolute; right: 36px; top: 31px; display: flex; gap: 6px; }
    .seg { width: 46px; height: 8px; border-radius: 4px; background: #D9CDB8; overflow: hidden; }
    .seg i { display: block; width: 100%; height: 100%; background: ${C.terra}; transform: scaleX(0); transform-origin: 0 50%; }
    #view { position: absolute; left: 0; top: ${BAR}px; width: ${VW}px; height: ${VH}px; overflow: hidden; background: ${C.cream}; }
    #cam { position: absolute; left: 0; top: 0; width: ${VW}px; height: ${VH}px; transform-origin: 0 0; }
    #plate { position: absolute; left: 0; top: 0; width: ${VW}px; }
    #hdr { position: absolute; left: 0; top: 0; width: ${VW}px; opacity: 0; }
    .state { position: absolute; left: 0; top: 0; width: ${VW}px; height: ${VH}px; opacity: 0; }
    #spot { position: absolute; left: 0; top: 0; width: 100px; height: 100px; opacity: 0; border-radius: 18px;
      box-shadow: 0 0 0 4000px rgba(24,38,30,.48), 0 0 0 4px ${C.terra} inset; }
    #cur { position: absolute; left: 0; top: 0; opacity: 0; width: 34px; height: 44px; }
    .rip { position: absolute; left: 0; top: 0; width: 60px; height: 60px; border-radius: 50%; border: 5px solid ${C.terra}; opacity: 0; }
    .stk { position: absolute; left: 70px; top: ${BAR + 34}px; opacity: 0; padding: 14px 26px 14px 18px; border-radius: 14px; background: ${C.terra}; color: #fff;
      font: 800 34px/1 Outfit; letter-spacing: .02em; text-transform: uppercase; box-shadow: 0 10px 24px rgba(31,51,40,.35); transform-origin: 0 50%; }
    .stk b { display: inline-block; margin-right: 14px; padding: 6px 10px; border-radius: 8px; background: ${C.cream}; color: ${C.terra}; font: 800 24px/1 Outfit; vertical-align: 4px; }
    #plateWipe { position: absolute; left: 0; top: 0; width: 120px; height: 120px; border-radius: 50%; background: ${C.terra}; opacity: 0; }
    #bump1 { position: absolute; left: 0; right: 0; top: 380px; text-align: center; font: italic 600 112px/1.05 Fraunces; color: ${C.cream}; opacity: 0; }
    #bump2 { position: absolute; left: 0; right: 0; top: 540px; text-align: center; font: 700 40px/1 Outfit; letter-spacing: .14em; text-transform: uppercase; color: ${C.wheat}; opacity: 0; }`;
const siteBody = `
    <div id="bar">
      <span class="dot" style="left:28px;background:#E0705A"></span><span class="dot" style="left:52px;background:#E3B04B"></span><span class="dot" style="left:76px;background:#6FAE6A"></span>
      <div id="url"><svg width="16" height="18" viewBox="0 0 16 18"><rect x="1.5" y="8" width="13" height="9" rx="2" fill="${C.sage}"/><path d="M4.5 8V5.5a3.5 3.5 0 0 1 7 0V8" fill="none" stroke="${C.sage}" stroke-width="2"/></svg>${DEMO_URL}</div>
      <div id="segs">${segs}</div>
    </div>
    <div id="view">
      <div id="cam">
        <img id="plate" src="assets/shots/plate.jpg" alt="">
        <img id="hdr" src="assets/shots/header.png" alt="" style="height:${M.headerH}px">
        ${imgs}
        <div id="spot"></div>
        ${rips}
        <svg id="cur" viewBox="0 0 34 44"><path d="M3 2 L3 34 L11 27 L17 41 L23 38 L17 25 L28 25 Z" fill="#1F3328" stroke="#FFFDF8" stroke-width="2.5" stroke-linejoin="round"/></svg>
      </div>
    </div>
    ${stks}
    <div id="plateWipe"></div>
    <div id="bump1">One short form.</div>
    <div id="bump2">4 steps · review · done</div>`;
fs.mkdirSync('compositions', { recursive: true });
fs.writeFileSync('compositions/site.html', scene('site', siteCss, siteBody, js.filter(l => !l.includes('#chap'))));

// =================== COVER ===================
const cjs = [
  `tl.fromTo("#c-tag",{opacity:0,scale:.6,rotation:-12},{opacity:1,scale:1,rotation:-4,duration:.5,ease:"back.out(2.2)"},0.25);`,
  `tl.fromTo("#c-t1",{opacity:0,y:60},{opacity:1,y:0,duration:.7,ease:"power4.out"},0.45);`,
  `tl.fromTo("#c-t2",{opacity:0,y:60},{opacity:1,y:0,duration:.7,ease:"power4.out"},0.65);`,
  `tl.fromTo("#c-line",{scaleX:0},{scaleX:1,duration:.7,ease:"power3.inOut"},1.1);`,
  `tl.fromTo("#c-desc",{opacity:0,y:24},{opacity:1,y:0,duration:.6,ease:"power3.out"},1.3);`,
  `tl.fromTo("#c-shot",{opacity:0,x:120,rotation:6},{opacity:1,x:0,rotation:3,duration:1,ease:"power4.out"},0.5);`,
  `tl.fromTo("#c-plate",{scale:.4,opacity:0},{scale:1,opacity:1,duration:1.1,ease:"power3.out"},0.2);`,
  `tl.fromTo(".chip",{opacity:0,y:30,scale:.8},{opacity:1,y:0,scale:1,duration:.45,ease:"back.out(2)",stagger:.28},1.7);`,
  `tl.to("#c-shot",{y:-14,duration:${r2(COVER - 1.6)},ease:"sine.inOut"},1.5);`,
  `tl.to("#c-wrap",{y:-1080,duration:.65,ease:"power3.in"},${r2(COVER - 0.65)});`,
];
addSfx('whoosh-short', COVER - 0.6, 0.5, 0.3);
const coverCss = `
    #c-wrap { position: absolute; inset: 0; background: ${C.cream}; }
    #c-plate { position: absolute; left: 1060px; top: 90px; width: 900px; height: 900px; border-radius: 50%; background: ${C.wheat}; box-shadow: inset 0 0 0 28px #EADBBE; }
    #c-tag { position: absolute; left: 140px; top: 170px; padding: 12px 22px; border-radius: 12px; background: ${C.terra}; color: #fff; font: 800 30px/1 Outfit; letter-spacing: .06em; text-transform: uppercase; }
    #c-t1, #c-t2 { position: absolute; left: 136px; font: 700 132px/1 Fraunces; color: ${C.sage}; letter-spacing: -.02em; }
    #c-t1 { top: 270px; } #c-t2 { top: 410px; font-style: italic; color: ${C.terra}; }
    #c-line { position: absolute; left: 140px; top: 580px; width: 520px; height: 8px; border-radius: 4px; background: ${C.olive}; transform-origin: 0 50%; }
    #c-desc { position: absolute; left: 140px; top: 630px; width: 820px; font: 400 38px/1.4 Outfit; color: ${C.sage}; }
    #c-shot { position: absolute; left: 1010px; top: 250px; width: 820px; border-radius: 18px; overflow: hidden; background: #fff; box-shadow: 0 30px 70px rgba(31,51,40,.3); }
    #c-shot .b { height: 40px; background: #EFE7D9; font: 500 15px/40px Outfit; color: ${C.sage}; text-align: center; }
    #c-shot img { display: block; width: 820px; }
    .chip { position: absolute; padding: 14px 22px; border-radius: 40px; background: #fff; color: ${C.sage}; font: 700 28px/1 Outfit; box-shadow: 0 12px 28px rgba(31,51,40,.22); }
    .chip i { display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: ${C.leaf}; margin-right: 12px; vertical-align: 1px; }`;
const coverBody = `
    <div id="c-wrap">
      <div id="c-plate"></div>
      <div id="c-tag">Website demo</div>
      <div id="c-t1">From curious</div>
      <div id="c-t2">to booked.</div>
      <div id="c-line"></div>
      <div id="c-desc">A quick tour of a nutrition coaching website: a 2-minute quiz that captures leads, clear plans, and a 4-step booking form.</div>
      <div id="c-shot"><div class="b">${DEMO_URL}</div><img src="assets/shots/hero.jpg" alt=""></div>
      <div class="chip" style="left:1090px;top:690px"><i></i>Lead-magnet quiz</div>
      <div class="chip" style="left:1440px;top:760px"><i></i>4-step booking</div>
      <div class="chip" style="left:1180px;top:830px"><i></i>Mobile-ready</div>
    </div>`;
fs.writeFileSync('compositions/cover.html', scene('cover', coverCss, coverBody, cjs));

// =================== END CARD: Delta Web ===================
const EDUR = r2(total - END0);
const cta0 = r2(vo.cta.start - END0);
const ejs = [
  `tl.fromTo("#e-bg",{clipPath:"circle(0% at 50% 50%)"},{clipPath:"circle(75% at 50% 50%)",duration:.8,ease:"power3.inOut"},0);`,
  `tl.fromTo("#e-shot",{opacity:0,x:80,rotation:5},{opacity:1,x:0,rotation:2.5,duration:.9,ease:"power4.out"},0.5);`,
  `tl.fromTo("#e-brand",{opacity:0,y:30},{opacity:1,y:0,duration:.5,ease:"power3.out"},${r2(cta0 - 0.3)});`,
  `tl.fromTo("#e-h",{opacity:0,y:50},{opacity:1,y:0,duration:.65,ease:"power4.out"},${r2(cta0)});`,
  `tl.fromTo("#e-btn",{opacity:0,scale:.7},{opacity:1,scale:1,duration:.5,ease:"back.out(2.2)"},${r2(cta0 + 2.4)});`,
  `tl.fromTo(".e-c",{opacity:0,x:-30},{opacity:1,x:0,duration:.45,ease:"power3.out",stagger:.2},${r2(cta0 + 2.8)});`,
  `tl.to("#e-btn",{scale:1.05,duration:.5,yoyo:true,repeat:3,ease:"sine.inOut"},${r2(cta0 + 3.4)});`,
];
addSfx('whoosh-short', END0, 0.5, 0.3);
addSfx('pop', vo.cta.start + 2.45, 0.4, 0.35);
const endCss = `
    #e-bg { position: absolute; inset: 0; background: ${C.sage}; }
    #e-brand { position: absolute; left: 130px; top: 190px; font: 800 34px/1 Outfit; letter-spacing: .16em; text-transform: uppercase; color: ${C.glow}; }
    #e-brand span { display: inline-block; width: 46px; height: 46px; margin-right: 16px; border-radius: 12px; background: ${C.terra}; color: #fff; text-align: center; font: 800 30px/46px Outfit; letter-spacing: 0; vertical-align: -8px; }
    #e-h { position: absolute; left: 126px; top: 270px; width: 900px; font: 700 96px/1.04 Fraunces; color: ${C.cream}; letter-spacing: -.015em; }
    #e-h em { color: ${C.glow}; }
    #e-btn { position: absolute; left: 130px; top: 640px; padding: 26px 44px; border-radius: 60px; background: ${C.terra}; color: #fff; font: 800 38px/1 Outfit; box-shadow: 0 16px 34px rgba(0,0,0,.28); transform-origin: 0 50%; }
    .e-c { position: absolute; left: 132px; font: 500 38px/1 Outfit; color: ${C.cream}; }
    .e-c b { color: ${C.glow}; font-weight: 700; margin-right: 14px; }
    #e-shot { position: absolute; left: 1150px; top: 120px; width: 620px; height: 780px; border-radius: 22px; overflow: hidden; background: url("assets/shots/b5.jpg");
      background-size: ${VW * 1.12}px ${VH * 1.12}px; background-position: ${r2(-(st.b5.dlg.x * 1.12 - 22))}px ${r2(-(st.b5.dlg.y * 1.12 - 20))}px; box-shadow: 0 30px 80px rgba(0,0,0,.4); }`;
const endBody = `
    <div id="e-bg"></div>
    <div id="e-shot"></div>
    <div id="e-brand"><span>D</span>Delta Web</div>
    <div id="e-h">Want a website that <em>books calls?</em></div>
    <div id="e-btn">Talk to Delta Web →</div>
    <div class="e-c" style="top:790px"><b>Web</b>createyourbestsite.com</div>
    <div class="e-c" style="top:860px"><b>Email</b>admin@createyourbestsite.com</div>`;
fs.writeFileSync('compositions/endcard.html', scene('endcard', endCss, endBody, ejs));

// =================== CAPTIONS ===================
const all = SCRIPT.flatMap(s => words[s.id]);
const groups = [];
for (const s of SCRIPT) {
  let g = [];
  const ws = words[s.id];
  ws.forEach((w, i) => {
    g.push(w);
    const nx = ws[i + 1];
    if (!nx || /[.,!?:]$/.test(w.text) || g.length >= 4 || nx.start - w.end > 0.15) { groups.push(g); g = []; }
  });
}
const cjs2 = [];
const capBody = groups.map((g, gi) => `<div id="g${gi}" class="cap">${g.map((w, wi) => `<span id="g${gi}w${wi}">${w.text}</span>`).join(' ')}</div>`).join('\n      ');
groups.forEach((g, gi) => {
  const s = r2(g[0].start - 0.05), e = r2(Math.min(g[g.length - 1].end + 0.12, groups[gi + 1] ? groups[gi + 1][0].start - 0.07 : 1e9));
  cjs2.push(`tl.set("#g${gi}",{opacity:1,visibility:"visible"},${s});`);
  cjs2.push(`tl.fromTo("#g${gi}",{y:14},{y:0,duration:.18,ease:"power2.out"},${s});`);
  g.forEach((w, wi) => {
    cjs2.push(`tl.set("#g${gi}w${wi}",{color:"${C.glow}",scale:1.1},${r2(w.start)});tl.set("#g${gi}w${wi}",{color:"#FFFFFF",scale:1},${r2(Math.min(w.end, e))});`);
  });
  cjs2.push(`tl.set("#g${gi}",{opacity:0,visibility:"hidden"},${e});`);
});
const capCss = `
    #root { background: transparent; }
    #root .cap { position: absolute; left: 0; right: 0; bottom: 84px; text-align: center; opacity: 0; visibility: hidden; overflow: visible;
      font: 800 62px/1.15 Outfit; color: #fff; -webkit-text-stroke: 9px ${C.deep}; paint-order: stroke fill; text-shadow: 0 6px 16px rgba(20,32,26,.45); }
    #root .cap span { display: inline-block; margin: 0 .13em; transform-origin: 50% 70%; }`;
fs.writeFileSync('compositions/captions.html', scene('captions', capCss, `      ${capBody}`, cjs2));

// =================== ROOT ===================
let ti = 20;
const audio = SCRIPT.map(s => `<audio id="vo-${s.id}" src="assets/vo/${s.id}.wav" data-start="${r2(vo[s.id].start)}" data-duration="${r2(vo[s.id].dur)}" data-track-index="10" data-volume="1"></audio>`);
const fx = sfx.sort((a, b) => a.t - b.t).map((f, i) => `<audio id="fx${i}" src="assets/sfx/${f.name}.mp3" data-start="${f.t}" data-duration="${f.dur}" data-track-index="${12 + (i % 3)}" data-volume="${f.vol}"></audio>`);
const root = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: ${C.deep}; }
      #root { position: relative; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1920" data-height="1080">
      <div id="site" data-composition-id="site" data-composition-src="compositions/site.html" data-start="${S0}" data-duration="${siteDur}" data-track-index="1" data-track-kind="graphics" style="z-index:1"></div>
      <div id="cover" data-composition-id="cover" data-composition-src="compositions/cover.html" data-start="0" data-duration="${COVER}" data-track-index="2" data-track-kind="graphics" style="z-index:15"></div>
      <div id="endcard" data-composition-id="endcard" data-composition-src="compositions/endcard.html" data-start="${END0}" data-duration="${EDUR}" data-track-index="3" data-track-kind="graphics" style="z-index:13"></div>
      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="${total}" data-track-index="4" data-track-kind="captions" style="z-index:20"></div>
      <audio id="music" src="assets/music/bed.m4a" data-start="0" data-duration="${total}" data-track-index="11" data-volume="0.16" data-fade-in="1" data-fade-out="2.5"></audio>
      ${audio.join('\n      ')}
      ${fx.join('\n      ')}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
fs.writeFileSync('index.html', root);
fs.writeFileSync('timing.json', JSON.stringify({ COVER, END0, total, vo }, null, 1));
console.log({ COVER, END0, total, groups: groups.length, states: used.size, chapters: CH });

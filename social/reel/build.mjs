// Wrenfield Nutrition 9:16 Reel: "lead journey". A phone taps through the live site's funnel
// under big narrated captions, a lead meter fills at the top, the alert email lands, then the
// Delta Web end card. Writes index.html + compositions/*.html from assets/shots (phone captures
// of the production site), script.json, assets/vo and assets/words. Re-run: node build.mjs
import fs from 'fs';
import { execSync } from 'child_process';

const M = JSON.parse(fs.readFileSync('assets/shots/manifest.json', 'utf8')).states;
const SCRIPT = JSON.parse(fs.readFileSync('script.json', 'utf8'));
const r2 = n => Math.round(n * 100) / 100;
const probe = f => parseFloat(execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 ${f}`).toString());
const W = 1080, H = 1920;
const C = { cream: '#FBF7F0', sage: '#2F4A3A', deep: '#1F3328', terra: '#C4623F', wheat: '#F2E6CF', olive: '#7C8B5A', leaf: '#3E8E5E', glow: '#F4A57F' };
const FONTS = `
    @font-face { font-family: "Fraunces"; src: url("assets/fonts/fraunces.woff2") format("woff2"); font-weight: 100 900; }
    @font-face { font-family: "Fraunces"; src: url("assets/fonts/fraunces-italic.woff2") format("woff2"); font-weight: 100 900; font-style: italic; }
    @font-face { font-family: "Outfit"; src: url("assets/fonts/outfit.woff2") format("woff2"); font-weight: 100 900; }`;

// ---------- narration clock + word timings ----------
const GAP = { hook: 0.35, how: 0.35, quiz: 0.4, score: 0.25, book: 0.45, send: 0.55, inbox: 0.55, cta: 0.8 };
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
// Lines up the script's words with the transcript's: merges split words ("two minute") and
// gives a dropped word ("to") half of the word before it.
function align(said, heard) {
  const out = [];
  let j = 0;
  for (let i = 0; i < said.length; i++) {
    const s = norm(said[i]);
    if (j < heard.length && norm(heard[j].text) === s) { out.push({ ...heard[j++], text: said[i] }); continue; }
    if (j + 1 < heard.length && norm(heard[j].text + heard[j + 1].text) === s) { out.push({ text: said[i], start: heard[j].start, end: heard[j + 1].end }); j += 2; continue; }
    if (j < heard.length && i + 1 < said.length && norm(heard[j].text) === norm(said[i + 1]) && out.length) {
      const p = out[out.length - 1], m = (p.start + p.end) / 2; out.push({ text: said[i], start: m, end: p.end }); p.end = m; continue;
    }
    if (j < heard.length) { out.push({ ...heard[j++], text: said[i] }); continue; }
    throw new Error(`can't align "${said[i]}"`);
  }
  return out;
}
const vo = {}, words = {};
let clock = 0;
for (const s of SCRIPT) {
  const raw = JSON.parse(fs.readFileSync(`assets/words/${s.id}.json`, 'utf8'));
  const heard = (Array.isArray(raw) ? raw : raw.words).map(x => ({ text: x.text, start: x.start, end: x.end }));
  const w = align(s.text.split(/\s+/), heard);
  const dur = probe(`assets/vo/${s.id}.wav`);
  const start = clock + GAP[s.id];
  vo[s.id] = { start: r2(start), dur, end: start + dur };
  words[s.id] = w.map(x => ({ ...x, start: start + x.start, end: start + x.end }));
  clock = start + dur;
}
const at = (id, word, nth = 0) => {
  const hits = words[id].filter(w => norm(w.text) === norm(word));
  if (!hits[nth]) throw new Error(`no "${word}" #${nth} in ${id}`);
  return hits[nth].start;
};
const TOTAL = r2(vo.cta.end + 2.4);
const END0 = r2(vo.cta.start - 0.45);

const scene = (id, css, body, js) => `<template>
  <style>${FONTS}
    #root { position: absolute; inset: 0; overflow: hidden; }
${css}
  </style>
  <div id="root" data-composition-id="${id}" data-width="${W}" data-height="${H}" data-layout-allow-overflow data-layout-allow-overlap>
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
const fx = (name, t, dur, vol) => sfx.push({ name, t: r2(t), dur, vol });

// =================== JOURNEY: meter + phone + inbox ===================
const PH = { x: 290, y: 610, w: 500 };
const K = (PH.w - 24) / 390;                       // screen px per site css px
const SHOTS = ['res1', 'hero', 'quiz_q1', 'quiz_q1_sel', 'res2', 'b1', 'b1_ok', 'b2_ok', 'b3_ok2', 'b4', 'b4_send', 'b5'];
const js = [];
const show = (img, t, fade = 0) => {
  if (fade) js.push(`tl.fromTo("#s-${img}",{opacity:0},{opacity:1,duration:${fade},ease:"power1.out"},${r2(t)});`);
  else js.push(`tl.set("#s-${img}",{opacity:1},${r2(t)});`);
  for (const o of SHOTS) if (o !== img) js.push(`tl.set("#s-${o}",{opacity:0},${r2(t + fade + 0.01)});`);
};
// finger tap on a site-css rect: dot glides in, presses, ripple
let taps = 0;
const tap = (rect, t, sound = 'click-soft') => {
  const cx = r2((rect.x + rect.width / 2) * K), cy = r2((rect.y + rect.height / 2) * K);
  const n = taps++;
  js.push(`tl.fromTo("#finger${n}",{x:${cx + 70},y:${cy + 110},opacity:0,scale:1},{x:${cx},y:${cy},opacity:1,duration:0.32,ease:"power2.out",immediateRender:false},${r2(t - 0.36)});`);
  js.push(`tl.to("#finger${n}",{scale:0.78,duration:0.08,yoyo:true,repeat:1,ease:"power1.inOut"},${r2(t)});`);
  js.push(`tl.fromTo("#rip${n}",{x:${cx},y:${cy},scale:0.2,opacity:0.85},{scale:2.4,opacity:0,duration:0.5,ease:"power2.out",immediateRender:false},${r2(t)});`);
  js.push(`tl.to("#finger${n}",{opacity:0,duration:0.2},${r2(t + 0.3)});`);
  fx(sound, t, 0.36, 0.55);
};
let rings = 0;
const ring = (rect, t0, t1) => {
  const n = rings++;
  js.push(`tl.set("#ring${n}",{left:${r2(rect.x * K - 8)},top:${r2(rect.y * K - 8)},width:${r2(rect.width * K + 16)},height:${r2(rect.height * K + 16)}},0);`);
  js.push(`tl.fromTo("#ring${n}",{opacity:0,scale:1.12},{opacity:1,scale:1,duration:0.28,ease:"back.out(2)"},${r2(t0)});`);
  js.push(`tl.to("#ring${n}",{opacity:0,duration:0.2},${r2(t1)});`);
};
// lead meter
const STOPS = ['Visit', 'Quiz', 'Book', 'Inbox'];
const meter = (i, t) => {
  js.push(`tl.to("#fill",{scaleX:${i / (STOPS.length - 1)},duration:0.5,ease:"power2.inOut"},${r2(t)});`);
  js.push(`tl.to("#dot${i}",{backgroundColor:"${C.terra}",borderColor:"${C.terra}",scale:1.18,duration:0.3,ease:"back.out(3)"},${r2(t + 0.3)});`);
  js.push(`tl.to("#lab${i}",{color:"${C.cream}",duration:0.3},${r2(t + 0.3)});`);
};

// opening: the answer first (the quiz result), phone already on screen
js.push(`tl.set("#fill",{scaleX:0},0);`);
js.push(`tl.fromTo("#phone",{scale:0.93,y:30},{scale:1,y:0,duration:0.6,ease:"power3.out"},0);`);
show('res1', 0);
ring({ x: 60, y: 50, width: 270, height: 290 }, at('hook', 'books'), vo.hook.end + 0.1);

// how: the visitor lands
const tHow = vo.how.start - 0.15;
show('hero', tHow, 0.2); fx('whoosh-short', tHow - 0.1, 0.5, 0.25);
meter(0, tHow);
ring({ x: 8, y: 596, width: 236, height: 108 }, at('how', 'works') - 0.1, vo.quiz.start - 0.3);

// quiz
show('quiz_q1', vo.quiz.start - 0.2, 0.2); fx('whoosh-short', vo.quiz.start - 0.3, 0.5, 0.22);
meter(1, vo.quiz.start - 0.2);
tap(M.quiz_q1_sel.opt, at('quiz', 'take')); show('quiz_q1_sel', r2(at('quiz', 'take') + 0.05));
tap(M.quiz_q1_sel.next, at('quiz', 'two-minute') + 0.05);

// score + plan, then "Bring my Plate Check to a free call"
show('res1', vo.score.start - 0.15, 0.18); fx('sparkle', vo.score.start - 0.1, 1.2, 0.18);
ring({ x: 60, y: 50, width: 270, height: 290 }, at('score', 'score') - 0.1, at('score', 'plan') - 0.1);
show('res2', at('score', 'plan') - 0.05, 0.18);
ring(M.res2.bring, at('score', 'plan') + 0.1, vo.score.end + 0.35);
tap(M.res2.bring, vo.score.end + 0.15, 'click');

// book: four short steps
show('b1', vo.book.start - 0.2, 0.2);
meter(2, vo.book.start - 0.2);
show('b1_ok', at('book', 'carries')); tap(M.b1_ok.next, at('book', 'carries') + 0.4);
show('b2_ok', at('book', 'a')); tap(M.b2_ok.next, at('book', 'short') + 0.15);
show('b3_ok2', at('book', 'booking') + 0.05); tap(M.b3_ok2.next, vo.book.end + 0.2);

// review (Plate Check pinned), request, success
show('b4', vo.book.end + 0.35, 0.15);
ring({ x: 16, y: 292, width: 300, height: 108 }, at('send', 'check') - 0.1, at('send', 'request') - 0.15);
show('b4_send', at('send', 'request') - 0.1, 0.15);
ring(M.b4_send.send, at('send', 'request'), at('send', 'call') + 0.1);
tap(M.b4_send.send, at('send', 'the') + 0.05, 'click');
show('b5', at('send', 'call') + 0.15, 0.2); fx('sparkle', at('send', 'call') + 0.15, 1.2, 0.2);

// inbox: phone steps back, the alert email lands
const tIn = vo.inbox.start - 0.1;
js.push(`tl.to("#phone",{scale:0.8,y:-70,duration:0.6,ease:"power3.inOut"},${r2(tIn)});`);
js.push(`tl.to("#phoneDim",{opacity:0.35,duration:0.5},${r2(tIn + 0.3)});`);
js.push(`tl.fromTo("#mail",{y:700,opacity:0,rotation:3},{y:0,opacity:1,rotation:0,duration:0.7,ease:"back.out(1.3)"},${r2(at('inbox', 'lead') - 0.2)});`);
fx('pop', at('inbox', 'lead') - 0.05, 0.4, 0.4);
meter(3, at('inbox', 'lead') - 0.1);
js.push(`tl.fromTo("#mail tr.pc td",{backgroundColor:"rgba(251,231,220,0)"},{backgroundColor:"rgba(251,231,220,1)",duration:0.35,ease:"power2.out"},${r2(at('inbox', 'inbox') + 0.05)});`);
js.push(`tl.to(["#tag1","#tag2"],{opacity:1,y:0,duration:0.35,stagger:0.12},${r2(at('inbox', 'inbox') + 0.25)});`);
// background drift for the whole piece
js.push(`tl.fromTo("#blobA",{x:-60,y:0},{x:80,y:120,duration:${TOTAL},ease:"none"},0);`);
js.push(`tl.fromTo("#blobB",{x:40,y:0},{x:-90,y:-140,duration:${TOTAL},ease:"none"},0);`);

const shotImgs = SHOTS.map((s, i) => `        <img id="s-${s}" class="shot" src="assets/shots/${s}.png" style="opacity:${i === 0 ? 1 : 0}">`).join('\n');
const ripples = Array.from({ length: taps }, (_, i) => `        <div id="rip${i}" class="rip"></div><div id="finger${i}" class="finger"></div>`).join('\n');
const ringEls = Array.from({ length: rings }, (_, i) => `        <div id="ring${i}" class="ring"></div>`).join('\n');
const stops = STOPS.map((s, i) => `      <div class="stop" style="left:${i * 280}px"><div id="dot${i}" class="dot"></div><div id="lab${i}" class="lab">${s}</div></div>`).join('\n');
const row = (k, v, cls = '') => `<tr class="${cls}"><td>${k}</td><td>${v}</td></tr>`;
const JOURNEY = scene('journey', `
    #root { background: radial-gradient(120% 70% at 50% 62%, #3B5C49 0%, ${C.sage} 45%, ${C.deep} 100%); }
    .blob { position: absolute; border-radius: 50%; }
    #blobA { left: -180px; top: 1180px; width: 640px; height: 640px; background: radial-gradient(circle, rgba(242,230,207,.13), rgba(242,230,207,0) 70%); }
    #blobB { left: 620px; top: 420px; width: 720px; height: 720px; background: radial-gradient(circle, rgba(196,98,63,.16), rgba(196,98,63,0) 70%); }
    #meter { position: absolute; left: 120px; top: 108px; width: 840px; height: 110px; }
    #meter .track { position: absolute; left: 0; right: 0; top: 17px; height: 6px; border-radius: 3px; background: rgba(251,247,240,.18); }
    #fill { position: absolute; left: 0; right: 0; top: 17px; height: 6px; border-radius: 3px; background: ${C.terra}; transform-origin: 0 50%; }
    .stop { position: absolute; top: 0; width: 0; }
    .dot { position: absolute; left: -20px; top: 0; width: 40px; height: 40px; border-radius: 50%; background: ${C.deep}; border: 4px solid rgba(251,247,240,.35); }
    .lab { position: absolute; left: -100px; width: 200px; top: 54px; text-align: center; font: 700 30px Outfit; letter-spacing: .06em; text-transform: uppercase; color: rgba(251,247,240,.45); }
    #phone { position: absolute; left: ${PH.x}px; top: ${PH.y}px; width: ${PH.w}px; padding: 12px; border-radius: 66px; background: #141F18; box-shadow: 0 60px 120px -40px rgba(0,0,0,.65), 0 0 0 2px #33453A inset; transform-origin: 50% 0; }
    .screen { position: relative; width: 100%; aspect-ratio: 390/844; border-radius: 54px; overflow: hidden; background: #fff; }
    .shot { position: absolute; left: 0; top: 0; width: 100%; }
    #phoneDim { position: absolute; inset: 0; background: ${C.deep}; opacity: 0; }
    .ring { position: absolute; border: 5px solid ${C.terra}; border-radius: 20px; box-shadow: 0 0 0 9px rgba(196,98,63,.22); opacity: 0; }
    .rip { position: absolute; left: -40px; top: -40px; width: 80px; height: 80px; border-radius: 50%; border: 5px solid ${C.terra}; opacity: 0; }
    #root .finger { position: absolute; left: -34px; top: -34px; width: 68px; height: 68px; border-radius: 50%; background: rgba(255,255,255,.55); border: 4px solid rgba(31,51,40,.55); box-shadow: 0 8px 20px rgba(0,0,0,.25); opacity: 0; }
    #mail { position: absolute; left: 80px; top: 1060px; width: 920px; background: #fff; border-radius: 34px; overflow: hidden; box-shadow: 0 50px 100px -30px rgba(0,0,0,.6); opacity: 0; }
    #mail .bar { background: ${C.terra}; color: #fff; padding: 26px 36px; display: flex; align-items: center; gap: 18px; font: 700 32px Outfit; }
    #mail .bar span:last-child { margin-left: auto; font-weight: 500; opacity: .85; }
    #mail .body { padding: 30px 36px 34px; font-family: Outfit; color: #1F2A22; }
    #mail .from { font-size: 26px; color: #6b756d; }
    #mail .subj { font-weight: 700; font-size: 36px; line-height: 1.2; margin: 8px 0 22px; }
    #mail table { width: 100%; border-collapse: collapse; font-size: 28px; line-height: 1.3; position: relative; }
    #mail td { padding: 7px 0; vertical-align: top; }
    #mail td:first-child { color: #6b756d; width: 230px; }
    #mail tr.pc td { color: ${C.terra}; font-weight: 700; }
    #mail tr.pc td:first-child { padding-left: 12px; border-radius: 12px 0 0 12px; } #mail tr.pc td:last-child { border-radius: 0 12px 12px 0; }
    .tags { display: flex; gap: 14px; margin-top: 24px; }
    .tags span { opacity: 0; transform: translateY(14px); background: ${C.wheat}; border-radius: 999px; padding: 10px 20px; font-size: 25px; font-weight: 600; color: ${C.sage}; }`, `
    <div id="blobA" class="blob"></div>
    <div id="blobB" class="blob"></div>
    <div id="meter">
      <div class="track"></div><div id="fill"></div>
${stops}
    </div>
    <div id="phone">
      <div class="screen">
${shotImgs}
${ringEls}
${ripples}
        <div id="phoneDim"></div>
      </div>
    </div>
    <div id="mail">
      <div class="bar"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg><span>New lead</span><span>just now</span></div>
      <div class="body">
        <div class="from">Wrenfield Nutrition website</div>
        <div class="subj">New fit-call request from Dana Rivera: Fresh Start (Within two weeks)</div>
        <table>
          ${row('Stage', 'Just started (first weeks)')}
          ${row('Main concern', "I'm losing weight but feel weaker")}
          <tr class="pc"><td>Plate Check</td><td>17/100, Build the base</td></tr>
          ${row('Best time', 'Weekday morning · 8–11 ET')}
        </table>
        <div class="tags"><span id="tag1">Saved to your lead list</span><span id="tag2">Reply goes to Dana</span></div>
      </div>
    </div>`, js);

// =================== END CARD ===================
const ejs = [
  `tl.fromTo("#wipe",{clipPath:"circle(0% at 50% 100%)"},{clipPath:"circle(150% at 50% 100%)",duration:0.7,ease:"power3.inOut"},0);`,
  `tl.fromTo("#mark",{y:60,opacity:0},{y:0,opacity:1,duration:0.6,ease:"power3.out"},0.55);`,
  `tl.fromTo(".pill",{y:40,opacity:0},{y:0,opacity:1,duration:0.5,stagger:0.15,ease:"power2.out"},0.9);`,
  `tl.fromTo("#note",{opacity:0},{opacity:1,duration:0.5},1.4);`,
];
fx('whoosh-short', END0, 0.5, 0.3);
const ENDCARD = scene('endcard', `
    #wipe { position: absolute; inset: 0; background: radial-gradient(90% 60% at 50% 55%, #3B5C49, ${C.deep}); }
    #mark { position: absolute; left: 0; right: 0; top: 640px; text-align: center; }
    #mark .lead { font: 700 32px Outfit; letter-spacing: .16em; text-transform: uppercase; color: ${C.wheat}; }
    #mark .name { font: 700 190px/1 Fraunces; color: ${C.cream}; margin-top: 26px; }
    #mark .name em { font-style: italic; color: ${C.glow}; font-weight: 600; }
    #mark .tag { font: 500 40px Outfit; color: rgba(251,247,240,.85); margin-top: 26px; }
    .pill { position: absolute; left: 140px; right: 140px; border-radius: 999px; text-align: center; font: 700 44px Outfit; padding: 30px 0; }
    #p1 { top: 1130px; background: ${C.terra}; color: #fff; }
    #p2 { top: 1270px; background: rgba(251,247,240,.1); color: ${C.cream}; border: 3px solid rgba(251,247,240,.35); font-size: 38px; }
    #note { position: absolute; left: 0; right: 0; top: 1440px; text-align: center; font: 400 26px Outfit; color: rgba(251,247,240,.6); }`, `
    <div id="wipe">
      <div id="mark"><div class="lead">Websites that book calls</div><div class="name">Delta <em>Web</em></div><div class="tag">Quiz · booking · lead alerts, built for you</div></div>
      <div id="p1" class="pill">createyourbestsite.com</div>
      <div id="p2" class="pill">admin@createyourbestsite.com</div>
      <div id="note">Wrenfield Nutrition is a fictional business made for this demo.</div>
    </div>`, ejs);

// =================== CAPTIONS: the narration, big, top band ===================
const cjs = [], groups = [];
const ids = SCRIPT.map(s => s.id);
ids.forEach((id, gi) => {
  const ws = words[id];
  const next = ids[gi + 1] ? vo[ids[gi + 1]].start : TOTAL;
  const t0 = gi === 0 ? 0 : r2(ws[0].start - 0.18), t1 = r2(Math.min(next - 0.08, vo[id].end + 0.55));
  groups.push(`      <div id="g${gi}" class="cap">${ws.map((w, wi) => `<span id="g${gi}w${wi}">${w.text}</span>`).join(' ')}</div>`);
  cjs.push(gi === 0 ? `tl.set("#g0",{opacity:1},0);` : `tl.fromTo("#g${gi}",{opacity:0,y:24},{opacity:1,y:0,duration:0.22,ease:"power2.out"},${t0});`);
  cjs.push(`tl.to("#g${gi}",{opacity:0,duration:0.15},${t1});`);
  ws.forEach((w, wi) => {
    cjs.push(`tl.to("#g${gi}w${wi}",{color:"${C.glow}",scale:1.06,duration:0.1},${r2(w.start)});`);
    cjs.push(`tl.to("#g${gi}w${wi}",{color:"${C.cream}",scale:1,duration:0.12},${r2(Math.min(w.end + 0.05, t1))});`);
  });
});
const CAPTIONS = scene('captions', `
    #root .cap { position: absolute; left: 70px; right: 70px; top: 270px; height: 300px; display: flex; flex-wrap: wrap; align-content: center; justify-content: center;
      text-align: center; opacity: 0; font: 600 84px/1.08 Fraunces; color: ${C.cream}; text-shadow: 0 6px 24px rgba(10,20,14,.45); }
    #root .cap span { display: inline-block; margin: 0 .12em; transform-origin: 50% 70%; }`, groups.join('\n'), cjs);

// =================== ROOT ===================
const audio = [
  `      <audio id="music" src="assets/music/bed.m4a" data-start="0" data-duration="${TOTAL}" data-track-index="11" data-volume="0.2" data-fade-in="0.4" data-fade-out="1.8"></audio>`,
  ...ids.map(id => `      <audio id="vo-${id}" src="assets/vo/${id}.wav" data-start="${vo[id].start}" data-duration="${r2(vo[id].dur)}" data-track-index="10" data-volume="1"></audio>`),
  ...sfx.map((s, i) => `      <audio id="fx${i}" src="assets/sfx/${s.name}.mp3" data-start="${s.t}" data-duration="${s.dur}" data-track-index="${12 + (i % 3)}" data-volume="${s.vol}"></audio>`),
];
const INDEX = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${W}, height=${H}" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: ${C.deep}; }
      #root { position: relative; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}">
      <div id="journey" data-composition-id="journey" data-composition-src="compositions/journey.html" data-start="0" data-duration="${r2(END0 + 0.8)}" data-track-index="1" data-track-kind="graphics" style="z-index:1"></div>
      <div id="endcard" data-composition-id="endcard" data-composition-src="compositions/endcard.html" data-start="${END0}" data-duration="${r2(TOTAL - END0)}" data-track-index="2" data-track-kind="graphics" style="z-index:5"></div>
      <div id="captions" data-composition-id="captions" data-composition-src="compositions/captions.html" data-start="0" data-duration="${TOTAL}" data-track-index="3" data-track-kind="captions" style="z-index:20"></div>
${audio.join('\n')}
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`;
fs.mkdirSync('compositions', { recursive: true });
fs.writeFileSync('compositions/journey.html', JOURNEY);
fs.writeFileSync('compositions/endcard.html', ENDCARD);
fs.writeFileSync('compositions/captions.html', CAPTIONS);
fs.writeFileSync('index.html', INDEX);
fs.writeFileSync('timing.json', JSON.stringify({ total: TOTAL, end0: END0, vo }, null, 1));
console.log('total', TOTAL, 'end card at', END0, 'taps', taps, 'rings', rings, 'sfx', sfx.length);

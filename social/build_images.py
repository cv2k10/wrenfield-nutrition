# Builds the Facebook images from the phone/desktop captures in shots/:
#   carousel/card-1..7.png  1080x1350 annotated walk-through of one visitor
#   mockup.png              1080x1350 desktop + tablet + phone
#   lead-flow.png           1080x1080 visitor -> booked call diagram
#   before-after.png        1080x1350 typical contact page vs this funnel
# Each image is an HTML page in src/ (editable), rendered with Playwright.
import os
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "src")
os.makedirs(SRC, exist_ok=True)
os.makedirs(os.path.join(HERE, "carousel"), exist_ok=True)

CSS = """
@font-face{font-family:Fraunces;src:url(../fonts/fraunces.woff2) format('woff2');font-weight:100 900}
@font-face{font-family:Fraunces;src:url(../fonts/fraunces-italic.woff2) format('woff2');font-weight:100 900;font-style:italic}
@font-face{font-family:Outfit;src:url(../fonts/outfit.woff2) format('woff2');font-weight:100 900}
:root{--cream:#FBF7F0;--sage:#2F4A3A;--sage2:#22382B;--terra:#C4623F;--wheat:#F2E6CF;--olive:#7C8B5A;--leaf:#3E8E5E;--ink:#1F2A22}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:WIDTHpx;height:HEIGHTpx;overflow:hidden}
body{background:var(--cream);font-family:Outfit,sans-serif;color:var(--ink);position:relative}
.serif{font-family:Fraunces,serif}
em{font-family:Fraunces,serif;font-style:italic;color:var(--terra);font-weight:500}
.chip{display:inline-flex;align-items:center;gap:14px;font-weight:700;font-size:22px;letter-spacing:.12em;text-transform:uppercase;color:var(--olive)}
.chip b{background:var(--terra);color:#fff;border-radius:999px;padding:8px 18px;letter-spacing:.06em}
h1{font-family:Fraunces,serif;font-weight:600;font-size:64px;line-height:1.04;color:var(--sage);letter-spacing:-.01em}
.sub{font-size:29px;line-height:1.35;color:#46524A;margin-top:18px}
.phone{position:absolute;padding:11px;border-radius:60px;background:#17241C;box-shadow:0 40px 80px -30px rgba(23,36,28,.55),0 0 0 2px #2c3b31 inset}
.screen{position:relative;width:100%;aspect-ratio:390/844;border-radius:49px;overflow:hidden;background:#fff}
.screen img{width:100%;display:block}
.ring{position:absolute;border:4px solid var(--terra);border-radius:18px;box-shadow:0 0 0 6px rgba(196,98,63,.18)}
.note{position:absolute;width:440px;font-size:27px;line-height:1.3;color:var(--ink);padding:20px 24px;background:#fff;border-radius:20px;box-shadow:0 12px 30px -14px rgba(31,42,34,.35);border-left:6px solid var(--terra)}
.note b{display:block;font-weight:700;color:var(--sage);font-size:28px;margin-bottom:4px}
.foot{position:absolute;left:72px;right:72px;bottom:44px;display:flex;justify-content:space-between;font-size:22px;color:#6b756d;letter-spacing:.02em}
.foot .swipe{color:var(--terra);font-weight:700}
svg.lines{position:absolute;inset:0;pointer-events:none}
"""


def page(w, h, body, extra=""):
    return f"<!doctype html><html><head><meta charset=utf-8><style>{CSS.replace('WIDTH', str(w)).replace('HEIGHT', str(h))}{extra}</style></head><body>{body}</body></html>"


def phone(img, x, y, w, rings=(), crop=0, sh=844):
    """Phone frame at card (x, y), outer width w. rings are screen-px rects (x, y, w, h)."""
    k = (w - 22) / 390
    rs = "".join(f'<div class="ring" style="left:{rx*k-6}px;top:{(ry-crop)*k-6}px;width:{rw*k+12}px;height:{rh*k+12}px"></div>' for rx, ry, rw, rh in rings)
    style = f"margin-top:{-crop*k}px" if crop else ""
    return f'<div class="phone" style="left:{x}px;top:{y}px;width:{w}px"><div class="screen" style="aspect-ratio:390/{sh}"><img src="../shots/{img}.png" style="{style}">{rs}</div></div>'


def to_card(x, y, w, sy, crop=0):
    return y + 11 + (sy - crop) * (w - 22) / 390


def annotated(n, chip, title, sub, img, notes, rings, px=72, py=430, pw=400, crop=0, extra_body=""):
    """notes: (screen_y, card_note_top, title, text). A line joins each ring/point to its note."""
    nx = px + pw + 70
    lines, boxes = [], []
    for sy, ny, t, txt in notes:
        cy = to_card(px, py, pw, sy, crop)
        lines.append(f'<path d="M{px+pw-30} {cy} H{px+pw+30} L{nx-14} {ny+50}" stroke="#C4623F" stroke-width="3" fill="none"/><circle cx="{px+pw-30}" cy="{cy}" r="9" fill="#C4623F"/>')
        boxes.append(f'<div class="note" style="left:{nx}px;top:{ny}px"><b>{t}</b>{txt}</div>')
    body = f"""
<div style="position:absolute;left:72px;top:64px;right:72px">
  <div class="chip"><b>{n} / 7</b>{chip}</div>
  <h1 style="margin-top:26px">{title}</h1>
  <p class="sub">{sub}</p>
</div>
{phone(img, px, py, pw, rings, crop)}
<svg class="lines" width="1080" height="1350">{''.join(lines)}</svg>
{''.join(boxes)}
{extra_body}
<div class="foot"><span>Wrenfield Nutrition · concept website</span><span class="swipe">Swipe →</span></div>"""
    return page(1080, 1350, body)


cards = {}
cards[1] = annotated(1, "The hook", "This website books calls for a <em>nutrition coach.</em>",
    "Follow one visitor from first tap to booked call.", "hero",
    [(280, 470, "Says who it's for", "First screen names the client and the problem."),
     (648, 700, "Two clear next steps", "Book a call now, or take a 2-minute quiz first."),
     (810, 930, "Always one tap away", "Sticky buttons stay on screen while they read.")],
    [(8, 175, 320, 200), (8, 596, 236, 108), (8, 668, 374, 40)], py=440)

cards[2] = annotated(2, "The problem", "Visitors see <em>their own</em> week.",
    "Pain points written in the client's words, not a sales pitch.", "sf_open",
    [(80, 470, "Speaks to their worries", "“The quiet ways a small appetite trips people up.”"),
     (665, 760, "Tap to open", "Each worry explains why it happens and what helps.")],
    [(10, 40, 370, 70), (14, 550, 362, 262)])

cards[3] = annotated(3, "The lead magnet", "A 2-minute quiz gives every visitor <em>a score.</em>",
    "The Plate Check: 7 quick questions, a result in plain English.", "res1",
    [(240, 470, "Score + named result", "Out of 100, with a result like “Build the base”."),
     (470, 680, "Explains what's going on", "What their answers mean, without medical claims."),
     (640, 890, "Their weakest areas", "Ranked, with the plan that fits them best.")],
    [(80, 60, 230, 270), (16, 316, 358, 260), (16, 530, 358, 140)])

cards[4] = annotated(4, "The hand-off", "Quiz answers carry <em>straight</em> into booking.",
    "One tap on “Bring my Plate Check to a free call” opens a 4-step form.", "b4",
    [(170, 470, "4 short steps", "Progress bar shows where they are."),
     (345, 650, "Score pinned on top", "Nobody types the same thing twice."),
     (455, 840, "Edit in one tap", "They check every answer before sending."),
     (795, 1030, "Nothing sent early", "Only “Request my call” submits.")],
    [(10, 160, 300, 22), (16, 292, 300, 108), (276, 438, 72, 34), (162, 775, 154, 42)])

cards[5] = annotated(5, "The safety net", "Not ready to book? You still get the email.",
    "A free GLP-1 Protein Plate Guide catches visitors who aren't ready yet.", "guide_filled",
    [(80, 470, "A useful freebie", "A printable plate guide in exchange for an email."),
     (420, 680, "Three fields", "First name, email, and where they are with their medication."),
     (690, 900, "Consent built in", "A clear opt-in, and spam bots are filtered out.")],
    [(10, 50, 360, 140), (16, 230, 290, 280), (16, 590, 296, 120)])

EMAIL = """
<div style="position:absolute;left:520px;top:440px;width:500px;background:#fff;border-radius:24px;box-shadow:0 30px 60px -25px rgba(31,42,34,.45);overflow:hidden">
  <div style="background:var(--sage);color:#fff;padding:22px 28px;display:flex;align-items:center;gap:14px;font-size:22px">
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#F2E6CF" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
    <span style="font-weight:700;letter-spacing:.04em">Your inbox</span><span style="margin-left:auto;opacity:.75">just now</span>
  </div>
  <div style="padding:24px 28px 28px">
    <div style="font-size:19px;color:#6b756d">Wrenfield Nutrition website</div>
    <div style="font-weight:700;font-size:25px;line-height:1.25;color:var(--ink);margin:6px 0 18px">New fit-call request from Dana Rivera: Fresh Start (Within two weeks)</div>
    <table style="font-size:19px;line-height:1.35;border-collapse:collapse;width:100%">
      <tr><td style="color:#6b756d;padding:5px 12px 5px 0;width:150px;vertical-align:top">Email</td><td>dana.rivera@example.com</td></tr>
      <tr><td style="color:#6b756d;padding:5px 12px 5px 0;vertical-align:top">Stage</td><td>Just started (first weeks)</td></tr>
      <tr><td style="color:#6b756d;padding:5px 12px 5px 0;vertical-align:top">Main concern</td><td>I'm losing weight but feel weaker</td></tr>
      <tr><td style="color:#6b756d;padding:5px 12px 5px 0;vertical-align:top">Goals</td><td>Eat enough protein on a small appetite, Protect strength and muscle</td></tr>
      <tr style="background:#FBEFE8"><td style="color:var(--terra);font-weight:700;padding:7px 12px 7px 8px;vertical-align:top">Plate Check</td><td style="font-weight:700;color:var(--terra)">17/100, Build the base</td></tr>
      <tr><td style="color:#6b756d;padding:5px 12px 5px 0;vertical-align:top">Best time</td><td>Weekday (Mon–Fri), Morning · 8–11 (ET)</td></tr>
    </table>
    <div style="margin-top:20px;display:flex;gap:10px;font-size:18px">
      <span style="background:var(--wheat);border-radius:999px;padding:7px 14px">Saved to your lead list</span>
      <span style="background:var(--wheat);border-radius:999px;padding:7px 14px">Reply goes to Dana</span>
    </div>
  </div>
</div>
<div style="position:absolute;left:520px;top:1150px;width:500px;font-size:19px;color:#6b756d">Sample alert with test data, in the same format the site sends.</div>"""

cards[6] = page(1080, 1350, f"""
<div style="position:absolute;left:72px;top:64px;right:72px">
  <div class="chip"><b>6 / 7</b>The proof</div>
  <h1 style="margin-top:26px">Every lead lands <em>in your inbox.</em></h1>
  <p class="sub">The visitor gets a clear “what happens next”. You get their answers, score and best time.</p>
</div>
{phone("b5", 60, 440, 400, [(14, 250, 362, 70)])}
{EMAIL}
<div class="foot"><span>Wrenfield Nutrition · concept website</span><span class="swipe">Swipe →</span></div>""")

cards[7] = page(1080, 1350, f"""
<div style="position:absolute;inset:0;background:var(--sage)"></div>
<div style="position:absolute;left:-120px;bottom:-160px;width:620px;height:620px;border-radius:50%;background:var(--sage2)"></div>
<div style="position:absolute;left:72px;top:64px;right:72px;color:var(--cream)">
  <div class="chip" style="color:var(--wheat)"><b>7 / 7</b>Your turn</div>
  <h1 style="margin-top:26px;color:var(--cream);font-size:72px">Want a website that <em style="color:#F0A27F">books calls</em> like this?</h1>
</div>
<div style="position:absolute;left:72px;top:470px;width:520px;color:var(--cream);font-size:30px;line-height:1.35">
  <div style="display:flex;gap:16px;margin-bottom:26px"><span style="color:#F0A27F">✓</span>Built around your offer and your clients</div>
  <div style="display:flex;gap:16px;margin-bottom:26px"><span style="color:#F0A27F">✓</span>Quiz, booking form and email capture included</div>
  <div style="display:flex;gap:16px;margin-bottom:26px"><span style="color:#F0A27F">✓</span>Leads emailed to you and saved</div>
  <div style="display:flex;gap:16px"><span style="color:#F0A27F">✓</span>Fast on every phone</div>
</div>
{phone("b5", 640, 420, 370)}
<div style="position:absolute;left:72px;right:72px;bottom:150px;background:var(--cream);border-radius:28px;padding:34px 40px;display:flex;align-items:center;gap:34px">
  <div style="font-family:Fraunces,serif;font-weight:700;font-size:46px;color:var(--sage);line-height:1">Delta<br><span style="color:var(--terra)">Web</span></div>
  <div style="font-size:30px;line-height:1.5;color:var(--ink)"><b>createyourbestsite.com</b><br>admin@createyourbestsite.com</div>
</div>
<div style="position:absolute;left:72px;right:72px;bottom:56px;font-size:20px;color:#C9D3C6">Wrenfield Nutrition is a fictional business made for this demo.</div>""")

MOCKUP = page(1080, 1350, f"""
<div style="position:absolute;inset:0;background:var(--wheat)"></div>
<div style="position:absolute;left:72px;top:72px;right:72px">
  <div class="chip">Website design · Wrenfield Nutrition</div>
  <h1 style="margin-top:22px;font-size:76px">One website. <em>Every screen.</em></h1>
  <p class="sub">A GLP-1 nutrition coaching site with a quiz, a 4-step booking form and email capture.</p>
</div>
<div style="position:absolute;left:110px;top:470px;width:860px">
  <div style="background:#17241C;border-radius:26px 26px 0 0;padding:20px 20px 0">
    <div style="border-radius:8px 8px 0 0;overflow:hidden;aspect-ratio:1440/900"><img src="../shots/desktop.png" style="width:100%;display:block"></div>
  </div>
  <div style="height:30px;background:linear-gradient(#c9ccc6,#9fa39c);border-radius:0 0 30px 30px;margin:0 -60px"></div>
</div>
<div class="phone" style="left:40px;top:760px;width:380px;border-radius:40px;padding:16px"><div class="screen" style="aspect-ratio:820/1180;border-radius:26px"><img src="../shots/tablet.png"></div></div>
{phone("hero", 770, 770, 240)}
<div style="position:absolute;left:450px;top:1200px;width:300px;text-align:center;font-size:26px;color:var(--sage);font-weight:700">Desktop · tablet · phone</div>
<div style="position:absolute;left:450px;top:1242px;width:300px;text-align:center;font-size:22px;color:#5c6a60">Built by Delta Web</div>""")

ICONS = {
    "visit": '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    "quiz": '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="m9 9 2 2 4-4M9 16h6"/>',
    "form": '<path d="M4 6h16M4 12h16M4 18h10"/>',
    "mail": '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    "call": '<rect x="3" y="7" width="13" height="10" rx="2"/><path d="m16 11 5-3v8l-5-3"/>',
    "gift": '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M12 9v11M3 9h18M12 9S9 3 7 5s5 4 5 4 3-6 5-4-5 4-5 4"/>',
}


def icon(k, color="#fff", size=34):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">{ICONS[k]}</svg>'


steps = [("visit", "A visitor lands", "Sees who it's for and two clear next steps."),
         ("quiz", "Takes the Plate Check", "Gets a score, weakest areas and a plan that fits."),
         ("form", "Books in 4 short steps", "Quiz answers carry over. Review, then request."),
         ("mail", "Lead hits your inbox", "Answers, score and best time. Saved to your list."),
         ("call", "Free 15–20 min call", "You show up already knowing what they need.")]
rows = ""
for i, (ic, t, d) in enumerate(steps):
    y = 250 + i * 150
    last = i == len(steps) - 1
    bg = "var(--terra)" if last else "var(--sage)"
    rows += f"""<div style="position:absolute;left:72px;top:{y}px;width:92px;height:92px;border-radius:50%;background:{bg};display:grid;place-items:center">{icon(ic)}</div>
<div style="position:absolute;left:96px;top:{y-22}px;width:44px;height:30px;font-weight:800;font-size:20px;color:var(--olive)">0{i+1}</div>
<div style="position:absolute;left:196px;top:{y+6}px;width:480px"><div class="serif" style="font-weight:600;font-size:36px;color:var(--sage)">{t}</div><div style="font-size:24px;color:#4d5a51;margin-top:4px">{d}</div></div>"""
FLOW = page(1080, 1080, f"""
<div style="position:absolute;left:72px;top:64px;right:72px">
  <div class="chip">Wrenfield Nutrition · concept website</div>
  <h1 style="margin-top:18px;font-size:56px">How a visitor becomes <em>a booked call</em></h1>
</div>
<div style="position:absolute;left:116px;top:300px;width:4px;height:600px;background:repeating-linear-gradient(var(--olive) 0 12px,transparent 12px 22px)"></div>
{rows}
<svg class="lines" width="1080" height="1080"><path d="M640 344 C 700 344 700 400 730 400" stroke="#7C8B5A" stroke-width="3" stroke-dasharray="8 8" fill="none"/><path d="M730 610 C 700 610 700 700 660 700" stroke="#7C8B5A" stroke-width="3" stroke-dasharray="8 8" fill="none" marker-end="url(#a)"/><defs><marker id="a" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0 10 5 0 10z" fill="#7C8B5A"/></marker></defs></svg>
<div style="position:absolute;left:730px;top:330px;width:290px;background:var(--wheat);border-radius:22px;padding:24px 24px 26px;border:2px dashed var(--olive)">
  <div style="width:62px;height:62px;border-radius:50%;background:var(--olive);display:grid;place-items:center">{icon("gift", size=30)}</div>
  <div class="serif" style="font-weight:600;font-size:30px;color:var(--sage);margin-top:14px;line-height:1.1">Not ready yet?</div>
  <div style="font-size:22px;color:#4d5a51;margin-top:8px;line-height:1.3">They grab the free Protein Plate Guide, and you still get their email.</div>
</div>
<div class="foot" style="bottom:40px"><span>Built by Delta Web</span><span class="swipe">createyourbestsite.com</span></div>""")

GENERIC = """
<div class="phone" style="left:72px;top:500px;width:400px"><div class="screen" style="aspect-ratio:390/640;background:#f4f4f2;padding:60px 30px 0;font-family:Arial,sans-serif">
  <div style="height:16px;width:120px;background:#d6d6d2;border-radius:4px"></div>
  <div style="font-size:34px;font-weight:700;color:#555;margin:40px 0 10px">Contact us</div>
  <div style="font-size:17px;color:#888;line-height:1.4;margin-bottom:26px">Have a question? Fill out the form and we'll get back to you.</div>
  <div style="font-size:15px;color:#777">Name</div><div style="height:46px;border:2px solid #d4d4d0;border-radius:6px;background:#fff;margin:6px 0 16px"></div>
  <div style="font-size:15px;color:#777">Email</div><div style="height:46px;border:2px solid #d4d4d0;border-radius:6px;background:#fff;margin:6px 0 16px"></div>
  <div style="font-size:15px;color:#777">Message</div><div style="height:96px;border:2px solid #d4d4d0;border-radius:6px;background:#fff;margin:6px 0 22px"></div>
  <div style="height:50px;width:130px;background:#9a9a96;border-radius:6px;color:#fff;display:grid;place-items:center;font-weight:700">Submit</div>
</div></div>"""


def bullets(items, mark, color):
    return "".join(f'<div style="display:flex;gap:14px;margin-bottom:10px"><span style="color:{color};font-weight:800;flex:none">{mark}</span><span>{t}</span></div>' for t in items)


BEFORE = page(1080, 1350, f"""
<div style="position:absolute;left:540px;top:0;right:0;bottom:0;background:#EEF2EC"></div>
<div style="position:absolute;left:72px;top:64px;right:72px">
  <div class="chip">Same coach · two kinds of website</div>
  <h1 style="margin-top:22px;font-size:62px">A “Contact us” page vs a site that <em>books calls</em></h1>
</div>
<div style="position:absolute;left:72px;top:430px;font-weight:800;font-size:24px;letter-spacing:.12em;color:#8b8f8a">TYPICAL SITE</div>
<div style="position:absolute;left:612px;top:430px;font-weight:800;font-size:24px;letter-spacing:.12em;color:var(--leaf)">THIS SITE</div>
{GENERIC}
{phone("b4", 612, 500, 400, [(16, 292, 300, 108)], sh=640)}
<div style="position:absolute;left:72px;top:1170px;width:430px;font-size:24px;line-height:1.3;color:#5d625e">{bullets(["One form, no reason to fill it in", "You learn nothing before the call", "Not-ready visitors just leave"], "✕", "#b4473a")}</div>
<div style="position:absolute;left:612px;top:1170px;width:430px;font-size:24px;line-height:1.3;color:var(--ink)">{bullets(["A quiz gives them a reason to start", "You get their answers, score and best time", "Not-ready visitors still leave an email"], "✓", "var(--leaf)")}</div>
""")

jobs = {f"carousel/card-{i}": (cards[i], 1080, 1350) for i in cards}
jobs.update({"mockup": (MOCKUP, 1080, 1350), "lead-flow": (FLOW, 1080, 1080), "before-after": (BEFORE, 1080, 1350)})

with sync_playwright() as p:
    b = p.chromium.launch()
    for name, (html, w, h) in jobs.items():
        src = os.path.join(SRC, name.replace("/", "-") + ".html")
        open(src, "w").write(html)
        pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=1)
        pg.goto("file://" + src)
        pg.evaluate("document.fonts.ready")
        pg.wait_for_timeout(400)
        pg.screenshot(path=os.path.join(HERE, name + ".png"))
        pg.close()
        print(name)
    b.close()

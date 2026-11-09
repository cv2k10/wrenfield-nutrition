# Captures the live Option B page (Arena's banner wrapper bypassed): a full-page plate for
# scrolling, plus one viewport image per interactive state, and records section offsets and
# the rectangles the video zooms on. Output: assets/shots/*.jpg|png + manifest.json
import json, os, re
from playwright.sync_api import sync_playwright

URL = "https://01a1a93f-4a17-7c4e-888a-602c5b97aec7.arena.site/"
HDR = {"sec-fetch-dest": "iframe", "sec-fetch-mode": "navigate", "sec-fetch-site": "cross-site", "referer": "https://arena.ai/"}
OUT = "assets/shots"
W, H = 1920, 1008
os.makedirs(OUT, exist_ok=True)
M = {"y": {}, "rects": {}, "states": {}}


def rect(loc):
    b = loc.bounding_box()
    return {k: round(b[k], 1) for k in ("x", "y", "width", "height")}


def go(pg, y):
    pg.evaluate(f"window.scrollTo({{top:{y},behavior:'instant'}})")
    pg.wait_for_timeout(300)


def live(pg, sel=None, text=None):
    if sel:
        return pg.evaluate(f"Math.round(document.querySelector('{sel}').getBoundingClientRect().top+scrollY)")
    return pg.evaluate(f"(()=>{{const h=[...document.querySelectorAll('h2,h3')].find(h=>h.textContent.includes(\"{text}\"));return Math.round(h.getBoundingClientRect().top+scrollY)}})()")


def quiz_view(pg):
    go(pg, live(pg, "#plate-check form") - 200)


def shot(pg, name, **rects):
    pg.mouse.move(4, 700)
    pg.wait_for_timeout(400)
    pg.screenshot(path=f"{OUT}/{name}.jpg", type="jpeg", quality=92)
    M["states"][name] = {"scrollY": pg.evaluate("Math.round(scrollY)"), **{k: rect(v) for k, v in rects.items()}}


with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": W, "height": H}, device_scale_factor=2)
    ctx.route("**/*", lambda r: r.fulfill(response=ctx.request.get(r.request.url, headers=HDR)) if r.request.resource_type == "document" else r.continue_())
    pg = ctx.new_page()
    pg.goto(URL, wait_until="networkidle", timeout=120000)
    pg.add_style_tag(content="html{scroll-behavior:auto!important}*{transition-duration:0s!important;animation-duration:0s!important}")
    h = pg.evaluate("document.documentElement.scrollHeight")
    for y in range(0, h, 500):
        go(pg, y)
    go(pg, 0)
    pg.wait_for_load_state("networkidle")
    pg.wait_for_timeout(800)

    hh = pg.evaluate("document.querySelector('header').getBoundingClientRect().bottom")
    M["headerBottom"] = hh
    top = lambda sel: pg.evaluate(f"Math.round(document.querySelector('{sel}').getBoundingClientRect().top+scrollY)")
    for k, sel in {"sf": "#sound-familiar", "quiz": "#plate-check", "dont": "#dont-heading", "how": "#how-it-works", "plans": "#plans", "coach": "#coach", "faq": "#faq"}.items():
        M["y"][k] = top(sel)
    for k, t in {"toolkit": "Things you'll hold", "guide": "Protein Plate Guide", "final": "Eat less.", "compare": "Side by side"}.items():
        M["y"][k] = pg.evaluate(f"(()=>{{const h=[...document.querySelectorAll('h2,h3')].find(h=>h.textContent.includes(\"{t}\"));return Math.round(h.getBoundingClientRect().top+scrollY)}})()")
    M["pageH"] = pg.evaluate("document.documentElement.scrollHeight")
    BOX = """([t,w,h])=>{const all=[...document.querySelectorAll('body *')].filter(e=>e.children.length<3&&e.textContent.includes(t));
      let e=all.sort((a,b)=>a.textContent.length-b.textContent.length)[0]; if(!e) return null;
      while(e&&(e.getBoundingClientRect().width<w||e.getBoundingClientRect().height<h)) e=e.parentElement;
      const r=e.getBoundingClientRect(); return {x:Math.round(r.x),y:Math.round(r.y+scrollY),width:Math.round(r.width),height:Math.round(r.height)}}"""
    M["prect"] = {}
    for k, args in {"dont_table": ["Red flag elsewhere", 900, 400], "how_cards": ["Weekly check-ins", 1000, 200],
                    "plan_cards": ["Our core program", 1000, 400], "toolkit": ["Yours to keep", 600, 400],
                    "coach_img": ["Sample profile", 250, 400], "promises": ["Our promises to you", 400, 250],
                    "faq": ["Is this medical care?", 800, 400], "sf_cards": ["feel weaker", 1000, 150]}.items():
        M["prect"][k] = pg.evaluate(BOX, args)

    shot(pg, "hero", h1=pg.locator("h1"), card=pg.get_by_text("Eating less?").first.locator("xpath=ancestor::div[1]"),
         cta=pg.locator("main button, main a", has_text="Book a free fit call").first,
         quizcta=pg.locator("main button, main a", has_text="Take the Plate Check").first)
    go(pg, 400)
    pg.locator("header").first.screenshot(path=f"{OUT}/header.png")
    M["headerH"] = pg.evaluate("document.querySelector('header').offsetHeight")
    go(pg, 0)
    tag = pg.add_style_tag(content="header{position:relative!important;top:auto!important}")
    pg.wait_for_timeout(300)
    pg.screenshot(path=f"{OUT}/plate.png", full_page=True, scale="css")
    tag.evaluate("e=>e.remove()")

    # sound familiar: open "losing weight but feel weaker"
    go(pg, M["y"]["sf"] - 40)
    card = pg.locator("#sound-familiar button", has_text="feel weaker").first
    card.click(); pg.wait_for_timeout(500)
    shot(pg, "sf_open", card=card, panel=card.locator("xpath=ancestor::*[self::li or self::div][1]"))

    # quiz
    quiz = pg.locator("#plate-check")
    quiz_view(pg)
    shot(pg, "quiz_q1", card=quiz.locator("form").first, opt=quiz.locator("label").nth(1), next=quiz.locator("button[type=submit]").first)
    answers = [1, 0, 0, 1, 1, 0, 1]
    for i, a in enumerate(answers):
        opts = quiz.locator("input[type=radio]")
        opts.nth(min(a, opts.count() - 1)).check(force=True)
        pg.wait_for_timeout(250)
        if i in (0, 3):
            quiz_view(pg)
            shot(pg, f"quiz_q{i+1}_sel", card=quiz.locator("form").first, opt=quiz.locator("label").nth(a), next=quiz.locator("button[type=submit]").first)
        quiz.locator("button[type=submit]").first.click()
        pg.wait_for_timeout(400)
    pg.wait_for_timeout(700)
    res_top = pg.evaluate("Math.round(document.querySelector('#plate-check h3, #plate-check [class*=result]')?.getBoundingClientRect().top+scrollY)")
    go(pg, live(pg, text="Your result") - 120)
    shot(pg, "quiz_res1")
    go(pg, live(pg, text="Your result") + 560)
    bring = pg.locator("#plate-check button", has_text="Bring my Plate Check")
    shot(pg, "quiz_res2", bring=bring)
    M["quizText"] = re.sub(r"\s+", " ", quiz.inner_text())[:400]

    # plan details dialog (Steady Strength)
    go(pg, live(pg, "#plans") + 60)
    shot(pg, "plans", btn=pg.locator("#plans button", has_text="See details").nth(1))
    pg.locator("#plans button", has_text="See details").nth(1).click(); pg.wait_for_timeout(600)
    dlg = pg.locator("[role=dialog]:visible, dialog[open]").last
    shot(pg, "plan_dialog", dlg=dlg)
    pg.keyboard.press("Escape"); pg.wait_for_timeout(400)

    # guide capture filled
    gy = live(pg, text="Protein Plate Guide") - 140
    go(pg, gy)
    form = pg.get_by_text("Where should it go?").locator("xpath=ancestor::form[1]")
    form.locator("input[type=text], input:not([type])").first.fill("Dana")
    form.locator("input[type=email]").fill("dana.rivera@example.com")
    form.locator("select").select_option(index=2)
    form.locator("input[type=checkbox]").check(force=True)
    pg.wait_for_timeout(200)
    shot(pg, "guide_filled", form=form, btn=form.locator("button[type=submit]"))
    form.locator("button[type=submit]").click(); pg.wait_for_timeout(700)
    shot(pg, "guide_done")

    # final CTA -> booking dialog (carries the Plate Check from above)
    go(pg, live(pg, text="Eat less.") - 330)
    shot(pg, "final", cta=pg.locator("section button", has_text="Book a free fit call").last)
    pg.locator("section button", has_text="Book a free fit call").last.click(); pg.wait_for_timeout(700)
    dlg = pg.locator("[role=dialog]:visible").last
    shot(pg, "b1", dlg=dlg, next=dlg.locator("button[type=submit]"))
    dlg.locator("button[type=submit]").click(); pg.wait_for_timeout(500)
    shot(pg, "b1_err", dlg=dlg, opt=dlg.locator("label", has=pg.locator("input[name=stage]")).nth(1))
    dlg.locator("input[name=stage]").nth(1).check(force=True)
    dlg.locator("#concern").select_option("weaker")
    dlg.locator("input[name=soon]").nth(0).check(force=True)
    pg.wait_for_timeout(300)
    shot(pg, "b1_ok", dlg=dlg, next=dlg.locator("button[type=submit]"))
    dlg.locator("button[type=submit]").click(); pg.wait_for_timeout(600)
    shot(pg, "b2", dlg=dlg, box=dlg.locator("label", has=pg.locator("input[type=checkbox]")).first)
    boxes = dlg.locator("input[type=checkbox]")
    boxes.nth(0).check(force=True); boxes.nth(2).check(force=True)
    pg.wait_for_timeout(300)
    shot(pg, "b2_ok", dlg=dlg, next=dlg.locator("button[type=submit]"))
    dlg.locator("button[type=submit]").click(); pg.wait_for_timeout(600)
    shot(pg, "b3", dlg=dlg)
    dlg.locator("#firstName").fill("Dana"); dlg.locator("#lastName").fill("Rivera")
    dlg.locator("#email").fill("dana.rivera@example.com")
    for sel in ("#timeZone", "#day", "#window"):
        dlg.locator(sel).select_option(index=1)
    dlg.locator("input[type=checkbox]").last.check(force=True)
    pg.wait_for_timeout(300)
    shot(pg, "b3_ok", dlg=dlg, next=dlg.locator("button[type=submit]"))
    dlg.locator("button[type=submit]").click(); pg.wait_for_timeout(600)
    shot(pg, "b4", dlg=dlg, next=dlg.locator("button[type=submit]"))
    dlg.locator("button[type=submit]").click(); pg.wait_for_timeout(900)
    dlg = pg.locator("[role=dialog]:visible").last
    shot(pg, "b5", dlg=dlg)
    M["successText"] = re.sub(r"\s+", " ", dlg.inner_text())[:400]

    json.dump(M, open(f"{OUT}/manifest.json", "w"), indent=1)
    print(json.dumps({k: M[k] for k in ("y", "pageH", "headerH")}), M["quizText"][:200])
    b.close()

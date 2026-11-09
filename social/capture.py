# Captures phone-size screens (390x844 @3x) of the live production site for the Facebook
# carousel and Reel. Form posts are answered in the browser with 201, so nothing reaches KV
# or sends an alert. Output: shots/*.png + shots/manifest.json
import json, os, re
from playwright.sync_api import sync_playwright

URL = "https://wrenfield-nutrition.createyourbestsite-cl.workers.dev/"
OUT = os.path.join(os.path.dirname(__file__), "shots")
os.makedirs(OUT, exist_ok=True)
M = {"states": {}, "posts": []}


def go(pg, y):
    pg.evaluate(f"window.scrollTo({{top:{y},behavior:'instant'}})")
    pg.wait_for_timeout(300)


def top(pg, sel=None, text=None):
    if sel:
        return pg.evaluate(f"Math.round(document.querySelector('{sel}').getBoundingClientRect().top+scrollY)")
    return pg.evaluate(f"(()=>{{const h=[...document.querySelectorAll('h2,h3')].find(h=>h.textContent.includes(\"{text}\"));return Math.round(h.getBoundingClientRect().top+scrollY)}})()")


def rect(loc):
    b = loc.bounding_box()
    return {k: round(b[k], 1) for k in ("x", "y", "width", "height")} if b else None


def shot(pg, name, **rects):
    pg.wait_for_timeout(350)
    pg.screenshot(path=f"{OUT}/{name}.png")
    M["states"][name] = {k: rect(v) for k, v in rects.items()}


def stub(route):
    M["posts"].append(route.request.url)
    route.fulfill(status=201, content_type="application/json", body='{"ok":true}')


with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = b.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=3, is_mobile=True, has_touch=True,
                        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1")
    ctx.route("**/api/**", stub)
    pg = ctx.new_page()
    pg.goto(URL, wait_until="networkidle", timeout=120000)
    pg.add_style_tag(content="html{scroll-behavior:auto!important}*{transition-duration:0s!important;animation-duration:0s!important}")
    h = pg.evaluate("document.documentElement.scrollHeight")
    for y in range(0, h, 400):
        go(pg, y)
    go(pg, 0)
    pg.wait_for_timeout(800)

    shot(pg, "hero", cta=pg.locator("main a, main button", has_text="Book a free fit call").first,
         quizcta=pg.locator("main a, main button", has_text="Take the Plate Check").first)
    tag = pg.add_style_tag(content="header{position:relative!important;top:auto!important}")
    pg.wait_for_timeout(300)
    pg.screenshot(path=f"{OUT}/plate.png", full_page=True)
    M["plateH"] = pg.evaluate("document.documentElement.scrollHeight")
    tag.evaluate("e=>e.remove()")
    M["y"] = {k: top(pg, s) for k, s in {"sf": "#sound-familiar", "quiz": "#plate-check", "plans": "#plans"}.items()}
    M["y"]["guide"] = top(pg, text="Protein Plate Guide")

    go(pg, M["y"]["sf"] - 70)
    shot(pg, "sf")
    card = pg.locator("#sound-familiar button", has_text="feel weaker").first
    card.click(); pg.wait_for_timeout(500)
    go(pg, top(pg, "#sound-familiar") - 70 + 120)
    shot(pg, "sf_open", card=card)

    quiz = pg.locator("#plate-check")
    go(pg, top(pg, "#plate-check form") - 90)
    shot(pg, "quiz_q1", form=quiz.locator("form").first)
    for i, a in enumerate([1, 0, 0, 1, 1, 0, 1]):
        opts = quiz.locator("input[type=radio]")
        opts.nth(min(a, opts.count() - 1)).check(force=True)
        pg.wait_for_timeout(200)
        if i == 0:
            go(pg, top(pg, "#plate-check form") - 90)
            shot(pg, "quiz_q1_sel", opt=quiz.locator("label").nth(a), next=quiz.locator("button[type=submit]").first)
        quiz.locator("button[type=submit]").first.click()
        pg.wait_for_timeout(350)
    pg.wait_for_timeout(700)
    ry = top(pg, text="Your result")
    go(pg, ry - 90)
    shot(pg, "res1")
    bring = pg.locator("#plate-check button", has_text="Bring my Plate Check")
    bring.scroll_into_view_if_needed()
    go(pg, pg.evaluate("scrollY") + 300)
    shot(pg, "res2", bring=bring)
    M["quizText"] = re.sub(r"\s+", " ", quiz.inner_text())[:600]

    bring.click(); pg.wait_for_timeout(700)
    dlg = pg.locator("[role=dialog]:visible").last
    shot(pg, "b1", dlg=dlg)
    dlg.locator("input[name=stage]").nth(1).check(force=True)
    dlg.locator("#concern").select_option("weaker")
    dlg.locator("input[name=soon]").nth(0).check(force=True)
    pg.wait_for_timeout(200)
    nxt = dlg.locator("button[type=submit]")
    nxt.scroll_into_view_if_needed()
    shot(pg, "b1_ok", next=nxt)
    nxt.click(); pg.wait_for_timeout(500)
    shot(pg, "b2")
    boxes = dlg.locator("input[type=checkbox]")
    boxes.nth(0).check(force=True); boxes.nth(2).check(force=True)
    dlg.locator("button[type=submit]").scroll_into_view_if_needed()
    shot(pg, "b2_ok", next=dlg.locator("button[type=submit]"))
    dlg.locator("button[type=submit]").click(); pg.wait_for_timeout(500)
    dlg.locator("#firstName").fill("Dana"); dlg.locator("#lastName").fill("Rivera")
    dlg.locator("#email").fill("dana.rivera@example.com")
    for sel in ("#timeZone", "#day", "#window"):
        dlg.locator(sel).select_option(index=1)
    dlg.locator("#firstName").scroll_into_view_if_needed()
    shot(pg, "b3_ok")
    dlg.locator("input[type=checkbox]").last.check(force=True)
    dlg.locator("button[type=submit]").scroll_into_view_if_needed()
    shot(pg, "b3_ok2", next=dlg.locator("button[type=submit]"))
    dlg.locator("button[type=submit]").click(); pg.wait_for_timeout(600)
    dlg.evaluate("d=>{d.scrollTop=0; d.querySelectorAll('*').forEach(e=>{if(e.scrollHeight>e.clientHeight+4)e.scrollTop=0})}")
    shot(pg, "b4")
    M["reviewText"] = re.sub(r"\s+", " ", dlg.inner_text())[:700]
    send = dlg.locator("button[type=submit]")
    send.scroll_into_view_if_needed()
    shot(pg, "b4_send", send=send)
    send.click(); pg.wait_for_timeout(900)
    dlg = pg.locator("[role=dialog]:visible").last
    dlg.evaluate("d=>{d.scrollTop=0; d.querySelectorAll('*').forEach(e=>{if(e.scrollHeight>e.clientHeight+4)e.scrollTop=0})}")
    shot(pg, "b5")
    M["successText"] = re.sub(r"\s+", " ", dlg.inner_text())[:500]
    pg.keyboard.press("Escape"); pg.wait_for_timeout(500)

    go(pg, top(pg, text="Protein Plate Guide") - 80)
    shot(pg, "guide")
    form = pg.get_by_text("Where should it go?").locator("xpath=ancestor::form[1]")
    form.locator("input[type=text], input:not([type])").first.fill("Dana")
    form.locator("input[type=email]").fill("dana.rivera@example.com")
    form.locator("select").select_option(index=2)
    form.locator("input[type=checkbox]").check(force=True)
    go(pg, top(pg, text="Protein Plate Guide") + 10)
    shot(pg, "guide_filled", form=form, btn=form.locator("button[type=submit]"))
    form.locator("button[type=submit]").click(); pg.wait_for_timeout(900)
    shot(pg, "guide_done")

    json.dump(M, open(f"{OUT}/manifest.json", "w"), indent=1)
    print(M["posts"]); print(M["reviewText"][:300]); print(M["successText"][:300])
    b.close()

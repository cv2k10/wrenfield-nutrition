# End-to-end checks for the Wrenfield Nutrition build.
# usage: python3 tests/e2e.py [base_url]   (default http://127.0.0.1:8787, i.e. `npm run preview`)
# Leaves "Test" rows in KV (local or live) and, against a deployed site, sends alert emails.
import json, sys, urllib.request, urllib.error
from playwright.sync_api import sync_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8787").rstrip("/")
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
results = []


def check(name, ok, detail=""):
    results.append(ok)
    print(("PASS " if ok else "FAIL ") + name + (f" — {detail}" if detail and not ok else ""))


def api(path, body=None, method="POST"):
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(BASE + path, data=data, method=method, headers={"content-type": "application/json", "user-agent": UA})
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read() or b"{}")


with sync_playwright() as p:
    b = p.chromium.launch()
    # layout at three widths
    for w, h in ((375, 812), (768, 1024), (1440, 900)):
        pg = b.new_page(viewport={"width": w, "height": h}, user_agent=UA)
        bad = []
        pg.on("response", lambda r: bad.append(f"{r.status} {r.url}") if r.status >= 400 else None)
        pg.goto(BASE + "/", wait_until="networkidle")
        for y in range(0, pg.evaluate("document.documentElement.scrollHeight"), 600):
            pg.evaluate(f"scrollTo(0,{y})"); pg.wait_for_timeout(60)
        pg.wait_for_load_state("networkidle")
        ox = pg.evaluate("document.documentElement.scrollWidth - innerWidth")
        broken = pg.evaluate("[...document.images].filter(i=>i.complete&&!i.naturalWidth&&!i.src.startsWith('data:')).map(i=>i.src)")
        check(f"{w}px: no sideways scroll", ox <= 0, f"overflow {ox}px")
        check(f"{w}px: no broken images or 4xx", not broken and not bad, f"{broken} {bad}")
        pg.close()

    # full funnel on a phone: Plate Check -> carry over -> 4 steps -> real POST
    pg = b.new_page(viewport={"width": 390, "height": 844}, user_agent=UA, is_mobile=True, has_touch=True)
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    posts = []
    pg.on("request", lambda r: posts.append((r.url, r.post_data)) if r.method == "POST" else None)
    pg.goto(BASE + "/", wait_until="networkidle")
    quiz = pg.locator("#plate-check")
    quiz.scroll_into_view_if_needed()
    for a in (1, 1, 2, 1, 2, 1, 1):
        opts = quiz.locator("input[type=radio]")
        opts.nth(min(a, opts.count() - 1)).check(force=True)
        quiz.locator("button[type=submit]").first.click()
        pg.wait_for_timeout(250)
    score = quiz.get_by_text("OUT OF 100").count() > 0 or "out of 100" in quiz.inner_text().lower()
    check("Plate Check shows a score", score)
    pg.locator("#plate-check button", has_text="Bring my Plate Check").click()
    dlg = pg.locator("[role=dialog]:visible").last
    dlg.wait_for()
    pg.wait_for_timeout(400)
    dlg.locator("button[type=submit]").click(); pg.wait_for_timeout(600)
    focused = pg.evaluate("document.activeElement.getAttribute('aria-invalid')")
    check("step 1 errors move focus to the first invalid field", focused == "true", str(focused))
    dlg.locator("label", has=pg.locator("input[name=stage]")).nth(2).click()
    dlg.locator("#concern").select_option("weaker")
    dlg.locator("label", has=pg.locator("input[name=soon]")).nth(0).click()
    dlg.locator("button[type=submit]").click(); pg.wait_for_timeout(300)
    check("step 2 of 4", "Step 2 of 4" in dlg.inner_text())
    dlg.locator("input[type=checkbox]").first.check(force=True)
    dlg.locator("button[type=submit]").click(); pg.wait_for_timeout(300)
    check("step 3 of 4", "Step 3 of 4" in dlg.inner_text())
    dlg.locator("#firstName").fill("Test"); dlg.locator("#lastName").fill("Rivera")
    dlg.locator("#email").fill("test.rivera@example.com")
    for sel in ("#timeZone", "#day", "#window"):
        dlg.locator(sel).select_option(index=1)
    dlg.locator("input[type=checkbox]").last.check(force=True)
    dlg.locator("button[type=submit]").click(); pg.wait_for_timeout(400)
    txt = dlg.inner_text()
    check("Next on step 3 shows the review step (no early submit)", "Step 4 of 4" in txt and not any("/api/requests" in u for u, _ in posts))
    check("review carries the Plate Check", "Plate Check" in txt)
    dlg.locator("button[type=submit]").click()
    pg.get_by_text("Request received").wait_for(timeout=10000)
    sent = [json.loads(d) for u, d in posts if u.endswith("/api/requests")]
    check("booking POSTs once with the score attached", len(sent) == 1 and sent[0].get("plateScore", "") != "", str(sent)[:200])
    pg.keyboard.press("Escape")
    # guide signup
    form = pg.get_by_text("Where should it go?").locator("xpath=ancestor::form[1]")
    form.scroll_into_view_if_needed()
    form.locator("input[type=text], input:not([type])").first.fill("Test")
    form.locator("input[type=email]").fill("test.guide@example.com")
    form.locator("select").select_option(index=2)
    form.locator("input[type=checkbox]").check(force=True)
    form.locator("button[type=submit]").click()
    try:
        pg.get_by_text("The guide is on its way").wait_for(timeout=15000)
    except Exception:
        print("guide page text:", form.inner_text()[:300])
    check("guide signup POSTs and confirms", any(u.endswith("/api/guide") for u, _ in posts))
    check("no page errors", not errs, str(errs))
    b.close()

# API rules
s, _ = api("/api/requests", method="GET")
check("GET /api/requests is 405", s == 405, s)
s, _ = api("/api/requests", {"firstName": "Test"})
check("incomplete booking is 422", s == 422, s)
s, _ = api("/api/guide", {"firstName": "Test", "email": "x@example.com", "stage": "bogus", "consent": True})
check("unknown option is 422", s == 422, s)
s, _ = api("/api/guide", {"website": "spam.example", "firstName": "x"})
check("honeypot answers 201 and stores nothing", s == 201, s)
s, _ = api("/api/nope", {})
check("unknown API path is 404", s == 404, s)

print(f"\n{sum(results)}/{len(results)} checks passed")
sys.exit(0 if all(results) else 1)

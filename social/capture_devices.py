# Desktop and tablet first folds of the live production site, for the device mockup.
import os
from playwright.sync_api import sync_playwright
URL = "https://wrenfield-nutrition.createyourbestsite-cl.workers.dev/"
OUT = os.path.join(os.path.dirname(__file__), "shots")
with sync_playwright() as p:
    b = p.chromium.launch()
    for name, w, h in (("desktop", 1440, 900), ("tablet", 820, 1180)):
        pg = b.new_page(viewport={"width": w, "height": h}, device_scale_factor=2)
        pg.goto(URL, wait_until="networkidle", timeout=120000)
        pg.wait_for_timeout(1200)
        pg.screenshot(path=f"{OUT}/{name}.png")
    b.close()

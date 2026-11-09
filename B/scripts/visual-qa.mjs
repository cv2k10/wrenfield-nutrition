/** Visual QA: screenshots at 375/768/1440 + overflow + console error checks. */
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const widths = [375, 768, 1440];
let failures = 0;

const browser = await chromium.launch();
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE, { waitUntil: "networkidle" });

  // horizontal overflow check
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth - document.documentElement.clientWidth;
  });
  const ok = overflow <= 0;
  console.log(`${ok ? "ok" : "FAIL"}: ${width}px horizontal overflow (${overflow}px)`);
  if (!ok) failures++;

  await page.screenshot({ path: `qa-${width}-top.png` });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.35));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `qa-${width}-mid.png` });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.7));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `qa-${width}-low.png` });

  const realErrors = errors.filter(
    (e) => !e.includes("Download the React DevTools") && !e.includes("favicon")
  );
  console.log(`${realErrors.length === 0 ? "ok" : "FAIL"}: ${width}px console errors (${realErrors.length})`);
  if (realErrors.length) {
    failures++;
    console.log("  " + realErrors.slice(0, 5).join("\n  "));
  }
  await page.close();
}

// Check mobile bar doesn't cover footer content at 375
{
  const page = await browser.newPage({ viewport: { width: 375, height: 800 } });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  const covered = await page.evaluate(() => {
    const bar = document.querySelector('[aria-label="Quick actions"]');
    if (!bar) return false;
    const barRect = bar.getBoundingClientRect();
    const privacy = Array.from(document.querySelectorAll("button")).find((b) =>
      b.textContent?.includes("Privacy notice")
    );
    if (!privacy) return false;
    const r = privacy.getBoundingClientRect();
    return r.bottom > barRect.top + 4; // overlapping?
  });
  console.log(`${covered ? "FAIL" : "ok"}: mobile bar does not cover footer content`);
  if (covered) failures++;
  await page.screenshot({ path: "qa-375-bottom.png" });
  await page.close();
}

await browser.close();
if (failures) {
  console.error(`\n${failures} visual QA issue(s)`);
  process.exit(1);
}
console.log("\nVisual QA passed at all widths.");

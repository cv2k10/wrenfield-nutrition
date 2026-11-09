import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 768, height: 900 } });
await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
const bad = await page.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  const out = [];
  document.querySelectorAll("*").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 || r.left < -1) {
      out.push(`${el.tagName}.${String(el.className).slice(0, 80)} L${Math.round(r.left)} R${Math.round(r.right)}`);
    }
  });
  return out.slice(0, 20);
});
console.log(bad.join("\n"));
await browser.close();

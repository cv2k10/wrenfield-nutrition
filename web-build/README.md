# Wrenfield Nutrition — production build

The voted Option B site (kimi-k3), made fully functional and set up for Cloudflare Workers.

**What changed from `../B`:**
- Next.js is now a static export (`output: "export"`, unoptimized images). Cloudflare serves `out/` as static assets, and a Worker handles `/api/*`.
- The Postgres template code is removed: `src/db`, the `/api/health` route, `drizzle.config.json`, `pg`, `drizzle-*`, and Arena's own test scripts.
- The fit-call form posts to `POST /api/requests`. It sends all four steps, plus the Plate Check score, result and recommended plan when the visitor took the quiz. The Protein Plate Guide form posts to `POST /api/guide`. Both show a "Sending…" state and a readable error if the request fails. The submit and next buttons have separate React keys.
- The Worker (`worker/index.ts`) checks each request with the same validators and option lists the browser uses (`src/lib/scoring.ts`, `src/lib/data.ts`). It stores the request in Workers KV and sends an email alert to cv2k10@gmail.com from alerts@createyourbestsite.com.
- Spam protection: a hidden honeypot field, and a limit of 5 requests per hour per IP. Only a hash of the IP is kept, for one hour.
- Copy now matches what the site does. The "Demo only" notes are gone, the privacy notice describes what is stored, and the success screen no longer promises an automatic confirmation email, because none is sent. Guide signups reach you as an alert, and sending the guide is a manual step for now. The site still labels itself a concept business, since the coach and prices are samples.
- Photos are served from `public/images/`, taken from the live Arena preview. Fonts come from `@fontsource-variable` instead of `next/font/google`, so the build doesn't fetch from Google.
- Fixed 12px of sideways scroll at 768px, caused by the footer email address. It was in Arena's original too.
- Security and cache headers are in `public/_headers`.

## Run locally

```bash
npm install
```

```bash
npm run preview
```

This builds `out/` and serves the site, the Worker and a local KV store at http://localhost:8787. For live-reload editing, run `npm run dev` for Next on :3000. The forms need the Worker, so test them on :8787.

## Test

With the local server on port 8787:

```bash
python3 tests/e2e.py
```

The test checks the following:
- No sideways scroll and no broken images at 375, 768 and 1440px.
- The Plate Check score carries into the form.
- Step 1 errors move focus to the first invalid field.
- Next on step 3 opens the review step and doesn't submit.
- Both forms post.
- The API returns 405, 422 and 404 in the right places, and the honeypot works.

Last run (2026-11-05): all 20 checks passed. A manual run of 6 posts got 201 ×3 then 429 ×3, so the rate limit holds. The test leaves "Test" rows in local KV. After more than 5 posts in an hour from one IP, you get 429s until you clear `.wrangler/state`.

## Live site

- URL: https://wrenfield-nutrition.createyourbestsite-cl.workers.dev
- Cloudflare account: cv2k10@gmail.com (ed7bc2fd0dfb16c182579349b9bdd9ee)
- Worker: `wrenfield-nutrition`. KV namespace: `wrenfield-nutrition-requests` (3a80e25ed1c74122a3fb5058389e318a)
- First deployed 2026-11-05 through the Cloudflare connector, not local wrangler. The 48 static files went up through an asset-upload session. The minified Worker was uploaded after its SHA-256 checksum matched the local build.
- Live check: `python3 tests/e2e.py https://wrenfield-nutrition.createyourbestsite-cl.workers.dev` passed 20/20.
  - On the first run, the guide check timed out at 10 seconds even though the signup was saved. The test now waits 15 seconds.
  - Five "Test" rows are now in live KV, and alert emails were sent: telemetry shows "alert sent".
  - Delete the test rows from the Cloudflare dashboard if you don't want them.

## Publishing changes

`wrangler.jsonc` has the real KV id and account. Local wrangler is signed in to a different account (lfei2k@gmail.com), so `npm run deploy` only works after `npx wrangler login` as cv2k10@gmail.com. Otherwise, redeploy through the Cloudflare connector as before. Run `npx wrangler whoami` first.

Email alerts come from alerts@createyourbestsite.com to cv2k10@gmail.com through Cloudflare Email Routing.

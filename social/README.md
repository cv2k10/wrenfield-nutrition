# Facebook showcase pieces: Wrenfield Nutrition

Made for the Facebook feed, so everything is sized and paced for a phone. All screens are captured from the live production site (https://wrenfield-nutrition.createyourbestsite-cl.workers.dev) at iPhone size (390×844 @3x), plus desktop and tablet for the mockup. The form posts were answered inside the capture browser, so the captures created no real leads and sent no alert emails. Every form shows sample data (Dana Rivera, dana.rivera@example.com).

| File | Size | What it's for |
| --- | --- | --- |
| `reel/renders/wrenfield-reel-9x16.mp4` | 1080×1920, 24.6 s | Reel / Story: how a visitor turns into a lead |
| `carousel/card-1.png` … `card-7.png` | 1080×1350 (4:5) | Carousel: one visitor's journey, one callout per card |
| `mockup.png` | 1080×1350 | Desktop, tablet and phone together; post thumbnail or carousel opener |
| `lead-flow.png` | 1080×1080 | Visitor → quiz → booking → inbox → call, plus the free-guide branch |
| `before-after.png` | 1080×1350 | A plain "Contact us" page vs this site's funnel |

## 1. Reel (`reel/`)

A new HyperFrames project, not based on the presentation video's template. A lead-journey meter at the top (Visit → Quiz → Book → Inbox) fills as the story moves. Below it, big narrated captions highlight each word as it's spoken. A phone taps through the real funnel, with a finger, ripples and rings on what the voice names:
- **0–3 s:** opens on the answer, the Plate Check result, with "This website books calls for a nutrition coach."
- The quiz, the score and plan, "Bring my Plate Check to a free call", the four booking steps, the review with the Plate Check pinned, then the request.
- **The lead lands:** the alert email slides in, with the Plate Check row highlighted.
- **End card:** Delta Web, createyourbestsite.com, admin@createyourbestsite.com.

Voice: Kokoro `am_michael` (American), 1.05×. Music: your Suno bed at 0.2. Loudness: −16.5 LUFS, −1.4 dBTP peak. Captions make sense with the sound off. `hyperframes check`: 0 errors, 0 warnings. I reviewed snapshots and frames pulled from the MP4, but didn't watch it end to end.

Rebuild with `node build.mjs`, then `npx hyperframes@0.8.147 render`. Copy and timing are in `script.json` and `build.mjs`.

## 2. Carousel (`carousel/`)

1. **The hook:** "This website books calls for a nutrition coach."
2. **The problem:** pain points in the client's own words.
3. **The lead magnet:** the 2-minute Plate Check gives a score.
4. **The hand-off:** quiz answers carry into the 4-step booking.
5. **The safety net:** the free guide still captures the email.
6. **The proof:** the visitor's confirmation, and the alert email you get.
7. **Your turn:** Delta Web contact details.

Card 6's email is a sample in the same format the site's Worker sends: same subject line and fields, test data, labelled as a sample.

## Rebuilding

- `python3 capture.py`: phone captures (form posts stubbed).
- `python3 capture_devices.py`: desktop and tablet first folds.
- `python3 build_images.py`: renders the carousel, mockup, lead-flow and before/after from the HTML in `src/`. Edit copy there or in the script.

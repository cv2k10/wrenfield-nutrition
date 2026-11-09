# Wrenfield Nutrition — fictional GLP-1 nutrition coaching website (Arena Battle + Code)

A fictional online nutrition coaching practice for U.S. adults who are taking a GLP-1 weight-loss medication (semaglutide, tirzepatide) or coming off one. Coaching runs by video and works alongside the client's prescriber, with no medication or dosing advice.

**Why this business:** demand is high. A 2026 Gallup poll found 11% of U.S. adults taking a GLP-1 for weight loss, up from 3% two years earlier, and a small study found few users get dietitian support. Supply is crowded: nutrition and weight coaching is the largest segment of the health-coach market, and generic macro-plan offers are everywhere. Research, the limits of that evidence and sources are in [business-brief.md](business-brief.md). It's a different business from the earlier builds (HVAC, roofing, life coaching, career coaching).

## Links

| Item | URL |
| --- | --- |
| Arena session | https://arena.ai/c/01a1a93e-9b08-7661-9084-e624276ba17c |
| Option A live preview | https://01a1a93f-4a17-718c-85a5-2640d75bf0b9.arena.site/ |
| Option B live preview | https://01a1a93f-4a17-7c4e-888a-602c5b97aec7.arena.site/ |
| Production site (Cloudflare) | https://wrenfield-nutrition.createyourbestsite-cl.workers.dev |

## Build status

The battle started 2026-11-05 at 01:07 UTC.
- Option A was ready at the 3rd check (~15 min).
- Option B was ready at the 10th and last check (~50 min).

Both are Next.js 16 + Tailwind on Arena's `nextjs-postgresql` template, with no database use. Code was pulled through Arena's API, not the Download dialog: 30 files for A and 37 for B. Neither manifest listed binary files. B's five photos exist on the live preview and were copied into `web-build/public/images/`.

## Funnel (3+ steps)

1. The "Plate Check" quiz (7 questions) gives a score, the three weakest areas and a recommended plan.
2. "Bring my Plate Check to a free call" opens a 4-step fit-call request: where you are → goals → contact and time → review.
3. A confirmation screen follows.

Every concern card and plan card can open the form with its choice preselected. A free "GLP-1 Protein Plate Guide" email signup catches visitors who aren't ready to book.

## Verdict: Option B (voted on Arena)

Arena revealed the models after the vote: **A = deepseek-v4.1-flash-max**, **B = kimi-k3**.

| Criterion | Option A | Option B |
| --- | --- | --- |
| UI / UX practice | Polished editorial layout and strong copy. The dark, moody salmon hero and the gym-style coach photo feel less "kitchen-real" | Brighter, more appetizing hero bowl and on-brand photos throughout (kitchen prep, coach in an apron, guide breakfast). Tighter page (10.6k vs 11.5k px on desktop) |
| User friendliness | Excellent: full-width mobile buttons, a "From your Plate Check" panel in step 2, Edit links, focus to the first error | Excellent: the Plate Check summary is pinned at the top of the review, Edit links, focus to the first error, clear "Next: Your goals" labels |
| Lead capture | Strong: score ring, focus bars, plan carry-over | Stronger: every plan card has its own "Free call" button next to "See details", the quiz gives concrete next steps, and the plan dialog has its own booking button |
| Honesty | No invented stats (a fictional coach backstory only) | No invented stats (a fictional coach backstory only) |

It was close: both funnels passed end to end with no console errors. B wins on first impression for a food business and on more direct paths to booking.

**Tested on the live previews (Playwright, 390px phone):** both quizzes and both booking funnels ran end to end. "Step X of 4" was correct, the review step appeared, there were no page errors, and there was no sideways overflow at 390, 820 or 1440px. Evidence is in `status/`.

## Presentation video

`video/renders/wrenfield-nutrition-presentation.mp4` (1:55, 1080p) presents Option B to visitors who want to see what kind of website gets built. It's a new HyperFrames project in a social-ad style: chapter stickers, story progress bar, spotlight and cursor, and a plate-wipe bumper.
- Opens with a 5.8-second cover with a title and short description.
- Footage is loaded from the live Option B URL with Arena's banner removed, in a browser frame showing `www.wrenfieldnutrition.demo`. The page stays full width and pauses at each section. The camera zooms only on the quiz result, the guide form and the booking steps.
- American voice (Kokoro `am_michael`) with word-highlight captions on a transparent background.
- Your Suno track as background music.
- Closing CTA: Delta Web, createyourbestsite.com, admin@createyourbestsite.com.

Review notes are in [video/REVIEW.md](video/REVIEW.md).

## Files

- [prompt.md](prompt.md): the exact prompt submitted to Arena.
- [business-brief.md](business-brief.md): niche research, sources and brand direction.
- [fb-post.md](fb-post.md): Facebook post draft (not published).
- `A/`, `B/`: source for each option, as Arena made it.
- `screenshot/`: 12 PNGs, `option-{A,B}-{desktop,ipad,mobile}-{first-fold,full-page}.png` (1440×900, 820×1180 and 390×844 viewports).
  - `option-B-desktop-full-page-3-pages.png` is the landscape version: three slices cut at section boundaries on a 3600×2250 sage canvas with a title panel (no Option or Arena wording).
- `status/`: phone test evidence for both funnels, plus the web-build success screen.
- `video/`: HyperFrames project (`capture.py`, `build.mjs`, `script.json`) and the final render.
- `web-build/`: the working site, a static Next.js export plus a Cloudflare Worker with KV and email alerts. Deployed 2026-11-05; it passed 20/20 checks both locally and live. See [web-build/README.md](web-build/README.md).

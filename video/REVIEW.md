# Review — Wrenfield Nutrition presentation video

A new HyperFrames project built for this site. It doesn't reuse the earlier builds' templates. `node build.mjs` regenerates `index.html` and `compositions/` from the captures, the narration and the word timings. `python3 capture.py` re-captures the live site.

**Look: social ad style in the site's own palette** (cream, sage, terracotta, Fraunces and Outfit)
- `cover`: a "Website demo" sticker, the title "From curious to booked." and a one-line description. The live hero sits in a tilted browser card on a wheat plate, with three pop-in feature chips.
- `site`: the live page at full 1920px width in a browser frame showing `www.wrenfieldnutrition.demo`. Ad-style elements:
  - Numbered terracotta chapter stickers: The hook → Pain points → Lead magnet → Trust → Clear pricing → Email capture → Booking funnel.
  - Story-style progress segments in the browser bar.
  - A spotlight that dims everything except what the voice names.
  - A cursor with click ripples.
- A terracotta plate-wipe bumper, "One short form. 4 steps · review · done", leads into the booking form.
- The camera stays at full width while scrolling and pausing on sections. It zooms in only on the Plate Check result, the guide signup form and the four booking steps.
- `endcard`: Delta Web call to action (createyourbestsite.com, admin@createyourbestsite.com) beside the real confirmation dialog.
- `captions`: Outfit 800, white with a dark sage stroke and no background box. The current word turns warm orange and scales up slightly.

**Checked:** `hyperframes check` reports 0 errors. Its warnings are only info-level overlaps from the brief sticker handoffs. I looked at snapshots at 16 timestamps and 7 frames pulled from the final MP4. Audio was measured, not listened to: −16.0 LUFS integrated and −1.3 dBTP peak after loudnorm. I didn't watch the full render end to end.

**Fixed in review**
- Outfit didn't resolve in the sub-compositions, so captions and stickers fell back to a serif. The font is now bundled in `assets/fonts/outfit.woff2`.
- The highlighted word's scale crowded the next word → spans get a small side margin.
- The final-CTA capture landed on the FAQ because the open quiz result made the page taller. The capture now uses live offsets.
- The cover chips overlapped the captions → moved up.

**Disclosures**
- Footage comes from the live Option B URL with Arena's banner wrapper bypassed (`capture.py`), not from `web-build`. So the success dialog in the video still shows the build's "Demo only" line.
- Form entries are sample data (Dana Rivera, dana.rivera@example.com).
- Voice: Kokoro `am_michael` (American English), generated locally at 1.05× speed.
- Music: your Suno track from the earlier videos, at a low bed level.
- Sound effects: the bundled Pixabay clips (click, pop, whoosh, typing, sparkle).
- Length 1:55, 1920×1080, 30 fps.

/**
 * Headless end-to-end test of the Wrenfield funnel + Plate Check using jsdom.
 * Run: npx tsx scripts/e2e-funnel.tsx
 */
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});

const g = globalThis as Record<string, unknown>;
for (const key of [
  "window", "document", "navigator", "HTMLElement", "Element", "Node",
  "getComputedStyle", "requestAnimationFrame", "cancelAnimationFrame",
  "MutationObserver", "KeyboardEvent", "MouseEvent", "Event", "CustomEvent",
]) {
  if (!(key in g) && key in dom.window) {
    g[key] = (dom.window as unknown as Record<string, unknown>)[key];
  }
}
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
window.HTMLElement.prototype.scrollIntoView = () => {};
Object.defineProperty(window.HTMLElement.prototype, "offsetParent", {
  get() { return this.parentElement; },
  configurable: true,
});

async function main() {
  const React = await import("react");
  const { render, screen, within, waitFor } = await import("@testing-library/react");
  const { default: userEvent } = await import("@testing-library/user-event");
  const { default: Home } = await import("../src/app/page");

  let failures = 0;
  const check = (name: string, cond: boolean) => {
    if (!cond) {
      failures++;
      console.error("FAIL:", name);
    } else {
      console.log("ok:", name);
    }
  };

  const user = userEvent.setup({ document: dom.window.document });
  render(React.createElement(Home));

  /* ------------------------------- Page shell ------------------------------ */
  check("h1 present", !!screen.getByRole("heading", { level: 1, name: /Your appetite changed/i }));
  check("demo notice shown", screen.getAllByText(/Concept website: fictional business/i).length >= 1);
  check("main landmark exists", !!screen.getByRole("main"));

  /* --------------------------- Sound familiar card -------------------------- */
  const concernBtn = screen.getByRole("button", { name: /I'm losing weight but feel weaker/i });
  await user.click(concernBtn);
  await screen.findByText(/some of the weight lost can be muscle/i);
  check("concern panel opens", true);
  const ctaInPanel = screen.getAllByRole("button", { name: /Work on this with a coach/i })[0];
  await user.click(ctaInPanel);

  /* ------------------------------ Booking dialog ---------------------------- */
  const dialog = await screen.findByRole("dialog", { name: /Book a free fit call/i });
  check("step 1 of 4 shown", !!within(dialog).getByText(/Step 1 of 4/i));
  const concernSelect = within(dialog).getByLabelText(/main concern right now/i) as HTMLSelectElement;
  check("concern preselected = weaker", concernSelect.value === "weaker");

  await user.click(within(dialog).getByRole("button", { name: /Next: Your goals/i }));
  await within(dialog).findByRole("alert");
  check("step 1 validation blocks advance", !!within(dialog).getByText(/Step 1 of 4/i));

  await user.click(within(dialog).getByLabelText(/Steady on a stable dose/i));
  await user.click(within(dialog).getByLabelText(/Within a month or so/i));
  await user.click(within(dialog).getByRole("button", { name: /Next: Your goals/i }));
  await within(dialog).findByText(/Step 2 of 4/i);
  check("reached step 2", true);

  // go Back: stage choice must be preserved
  await user.click(within(dialog).getByRole("button", { name: /^Back$/i }));
  const steadyRadio = within(dialog).getByLabelText(/Steady on a stable dose/i) as HTMLInputElement;
  check("stage value preserved across steps", steadyRadio.checked);
  const concernAfterBack = within(dialog).getByLabelText(/main concern right now/i) as HTMLSelectElement;
  check("concern still preselected", concernAfterBack.value === "weaker");
  await user.click(within(dialog).getByRole("button", { name: /Next: Your goals/i }));
  await within(dialog).findByText(/Step 2 of 4/i);

  await user.click(within(dialog).getByRole("button", { name: /Next: Contact & time/i }));
  await within(dialog).findByRole("alert");
  check("step 2 needs at least one goal", !!within(dialog).getByText(/Step 2 of 4/i));

  await user.click(within(dialog).getByLabelText(/Eat enough protein on a small appetite/i));
  await user.click(within(dialog).getByLabelText(/Protect strength and muscle/i));
  await user.click(within(dialog).getByLabelText(/Vegetarian/i));
  await user.click(within(dialog).getByRole("button", { name: /Next: Contact & time/i }));
  await within(dialog).findByText(/Step 3 of 4/i);
  check("reached step 3", true);

  await user.click(within(dialog).getByRole("button", { name: /Review request/i }));
  await within(dialog).findByRole("alert");
  check("step 3 empty blocked", !!within(dialog).getByText(/Step 3 of 4/i));
  let focusOk = false;
  try {
    await waitFor(
      () => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el.getAttribute("aria-invalid") !== "true") throw new Error("focus pending");
        focusOk = true;
      },
      { timeout: 1500, interval: 50 }
    );
  } catch { /* focusOk stays false */ }
  check("focus moved to first invalid field", focusOk);

  await user.type(within(dialog).getByLabelText(/^First name/i), "Jordan");
  await user.type(within(dialog).getByLabelText(/^Last name/i), "Mills");
  await user.type(within(dialog).getByLabelText(/^Email/i), "jordan@example.com");
  await user.selectOptions(within(dialog).getByLabelText(/Time zone/i), "CT");
  await user.selectOptions(within(dialog).getByLabelText(/Preferred day/i), "saturday");
  await user.selectOptions(within(dialog).getByLabelText(/Time window/i), "evening");

  await user.click(within(dialog).getByRole("button", { name: /Review request/i }));
  await within(dialog).findByRole("alert");
  check("consent required before review", !!within(dialog).getByText(/Step 3 of 4/i));

  await user.click(within(dialog).getByLabelText(/I agree to be contacted/i));
  await user.click(within(dialog).getByRole("button", { name: /Review request/i }));
  await within(dialog).findByText(/Step 4 of 4/i);
  check("reached step 4 review", true);
  check("review shows name", !!within(dialog).getByText(/Jordan Mills/i));
  check("review shows concern", !!within(dialog).getByText(/I'm losing weight but feel weaker/i));

  await user.click(within(dialog).getByRole("button", { name: /Edit Your goals/i }));
  await within(dialog).findByText(/Step 2 of 4/i);
  check("edit link jumps back to step 2", true);
  await user.click(within(dialog).getByRole("button", { name: /Next: Contact & time/i }));
  await within(dialog).findByText(/Step 3 of 4/i);
  await user.click(within(dialog).getByRole("button", { name: /Review request/i }));
  await within(dialog).findByText(/Step 4 of 4/i);

  await user.click(within(dialog).getByRole("button", { name: /Request my call/i }));
  await within(dialog).findByText(/Request noted, Jordan/i);
  check("success state shown", true);
  check("demo-only note shown", !!within(dialog).getByText(/Demo only: your request has not been sent/i));
  check("timeline present", !!within(dialog).getByText(/replies within two business days/i));

  await user.click(within(dialog).getByRole("button", { name: /Back to the site/i }));
  await waitFor(() =>
    check("dialog closed", screen.queryByRole("dialog", { name: /Book a free fit call/i }) === null)
  );

  /* -------------------------------- Plate Check ----------------------------- */
  const plateSection = document.querySelector("#plate-check") as HTMLElement;
  const pc = within(plateSection);
  check("Q1 rendered", !!pc.getByText(/Where are you with your medication right now\?/i));

  await user.click(pc.getByRole("button", { name: /^Next$/i }));
  await pc.findByText(/Choose the answer closest to your life/i);
  check("plate check requires an answer", true);

  await user.click(pc.getByLabelText(/^Steady/i));
  await user.click(pc.getByRole("button", { name: /^Next$/i }));
  await pc.findByText(/how many real meals/i);
  check("plate check advances to Q2", true);

  await user.click(pc.getByRole("button", { name: /^Back$/i }));
  await pc.findByText(/Where are you with your medication right now\?/i);
  const pcSteady = pc.getByLabelText(/^Steady/i) as HTMLInputElement;
  check("plate answer preserved after Back", pcSteady.checked);
  await user.click(pc.getByRole("button", { name: /^Next$/i }));

  await pc.findByText(/how many real meals/i);
  await user.click(pc.getByLabelText(/Three steady meals/i));
  await user.click(pc.getByRole("button", { name: /^Next$/i }));
  await user.click(pc.getByLabelText(/^Rarely/)); // protein 0
  await user.click(pc.getByRole("button", { name: /^Next$/i }));
  await user.click(pc.getByLabelText(/^Steady sipping is automatic/)); // fluids 3
  await user.click(pc.getByRole("button", { name: /^Next$/i }));
  await user.click(pc.getByLabelText(/token serving/i)); // fiber 1
  await user.click(pc.getByRole("button", { name: /^Next$/i }));
  await user.click(pc.getByLabelText(/Occasionally, no routine/i)); // strength 1
  await user.click(pc.getByRole("button", { name: /^Next$/i }));
  await user.click(pc.getByLabelText(/^A lot/)); // side effects 0
  await user.click(pc.getByRole("button", { name: /See my result/i }));

  // 3+0+3+1+1+0 = 8/18 → 44 → Build the base
  await pc.findByRole("heading", { name: /Your result: Build the base/i });
  check("result tier correct", true);
  check("score 44 shown", !!pc.getByText("44"));
  check("weakest areas rendered", pc.getAllByText(/^\d+%$/).length >= 3);
  check("next steps rendered", !!pc.getByText(/Anchor two daily meal times/i));
  check("Fresh Start suggested", pc.getAllByText(/Fresh Start/).length >= 1);
  check("plate disclaimer shown", !!pc.getByText(/self-reflection tool/i));

  await user.click(pc.getByRole("button", { name: /Bring my Plate Check to a free call/i }));
  const dialog2 = await screen.findByRole("dialog", { name: /Book a free fit call/i });
  check("booking reopened from plate check", true);
  // fill step 1 quickly, then confirm recommended plan is preselected on step 2
  await user.click(within(dialog2).getByLabelText(/Just started \(first weeks\)/i));
  await user.selectOptions(within(dialog2).getByLabelText(/main concern right now/i), "general");
  await user.click(within(dialog2).getByLabelText(/Just exploring for now/i));
  await user.click(within(dialog2).getByRole("button", { name: /Next: Your goals/i }));
  await within(dialog2).findByText(/Step 2 of 4/i);
  const planRadio = within(dialog2).getByLabelText(/^Fresh Start/i) as HTMLInputElement;
  check("recommended plan preselected from Plate Check", planRadio.checked);
  await user.keyboard("{Escape}");
  await waitFor(() =>
    check("escape closes booking", screen.queryByRole("dialog", { name: /Book a free fit call/i }) === null)
  );

  await user.click(pc.getByRole("button", { name: /Retake/i }));
  await pc.findByText(/Where are you with your medication right now\?/i);
  check("retake resets to Q1", true);

  /* ------------------------------- Guide form ------------------------------- */
  const guideBtn = screen.getByRole("button", { name: /Send me the guide/i });
  const guideForm = guideBtn.closest("form") as HTMLElement;
  const gf = within(guideForm);
  await user.click(guideBtn);
  await gf.findByText(/Please fix 4 fields/i);
  check("guide form validates all fields", true);
  await user.type(gf.getByLabelText(/^First name/i), "Sam");
  await user.type(gf.getByLabelText(/^Email/i), "sam@example.com");
  await user.selectOptions(gf.getByLabelText(/Where are you now\?/i), "steady");
  await user.click(gf.getByLabelText(/I agree to receive the guide/i));
  await user.click(guideBtn);
  await screen.findByText(/The guide is on its way, Sam/i);
  check("guide demo success state", true);

  /* ---------------------------------- FAQ ----------------------------------- */
  await user.click(screen.getByRole("button", { name: /Will you tell me how to change my dose/i }));
  await screen.findByText(/exclusively a conversation between you and your prescriber/i);
  check("faq accordion opens", true);

  /* ------------------------------- Mobile menu ------------------------------ */
  await user.click(screen.getByRole("button", { name: /Open menu/i }));
  await screen.findByRole("dialog", { name: /^Menu$/i });
  check("mobile menu opens", true);
  await user.keyboard("{Escape}");
  await waitFor(() => check("escape closes menu", screen.queryByRole("dialog", { name: /^Menu$/i }) === null));

  /* ------------------------------ Privacy dialog ----------------------------- */
  await user.click(screen.getByRole("button", { name: /Privacy notice/i }));
  await screen.findByRole("dialog", { name: /Privacy, in plain English/i });
  check("privacy dialog opens", true);
  await user.click(screen.getByRole("button", { name: /Got it/i }));

  check("exactly one h1", screen.getAllByRole("heading", { level: 1 }).length === 1);

  // No dead anchors: every href="#x" resolves to an element with that id
  const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
  const dead = anchors.filter((a) => {
    const id = a.getAttribute("href")!;
    return id !== "#top" && !document.querySelector(id);
  });
  check(`no dead in-page anchors (${anchors.length} checked)`, dead.length === 0);

  if (failures > 0) {
    console.error(`\n${failures} E2E check(s) failed`);
    process.exit(1);
  }
  console.log("\nAll end-to-end funnel checks passed.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

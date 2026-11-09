"use client";

import {
  brand,
  coach,
  howItWorks,
  promises,
  redFlags,
  toolkit,
} from "@/content/site";
import { useFunnel } from "./funnel-context";
import { SafeImage } from "./safe-image";
import {
  ArrowRightIcon,
  BasketIcon,
  CheckIcon,
  CloseIcon,
  LeafSprig,
  ListIcon,
  PlateDivider,
  PlateIcon,
  SectionHeading,
  StrengthIcon,
  WrenMark,
} from "./brand";

/* ------------------------------------------------------- What we don't do */
export function HonestyPanel() {
  return (
    <section aria-labelledby="honesty-title" className="bg-sage py-16 text-cream md:py-24">
      <div className="container-editorial">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-wheat">
              The honest part
            </p>
            <h2
              id="honesty-title"
              className="mt-2 font-serif text-[clamp(1.9rem,4.4vw,2.9rem)] leading-[1.1] text-cream"
            >
              What we don&apos;t do
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-wheat">
              Nutrition coaching is crowded with things that look helpful and are not. Here is our
              side of the comparison, in plain language.
            </p>
          </div>
          <PlateDivider className="hidden h-8 w-40 opacity-90 md:block" />
        </div>

        <div className="mt-9 overflow-hidden rounded-2xl border border-cream/20">
          <table className="hidden w-full border-collapse text-left md:table">
            <caption className="sr-only">
              Wrenfield Nutrition compared with common red flags in nutrition coaching
            </caption>
            <thead>
              <tr className="bg-[#263d30] text-cream">
                <th scope="col" className="px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.1em]">
                  The topic
                </th>
                <th scope="col" className="px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.1em]">
                  With Wrenfield
                </th>
                <th scope="col" className="px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.1em]">
                  Common red flags elsewhere
                </th>
              </tr>
            </thead>
            <tbody>
              {redFlags.map((row) => (
                <tr key={row.topic} className="border-t border-cream/15 align-top">
                  <th scope="row" className="px-5 py-4 font-serif text-[1.05rem] font-medium text-cream">
                    {row.topic}
                  </th>
                  <td className="px-5 py-4 text-[1rem] leading-relaxed text-cream">
                    <span className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3E8E5E] text-white">
                        <CheckIcon className="h-3.5 w-3.5" />
                      </span>
                      <span>{row.ours}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[1rem] leading-relaxed text-[#F3D3C5]">
                    <span className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#F3D3C5]/60 text-[#F3D3C5]">
                        <CloseIcon className="h-3 w-3" />
                      </span>
                      <span>{row.elsewhere}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="divide-y divide-cream/15 md:hidden">
            {redFlags.map((row) => (
              <li key={row.topic} className="bg-[#2b4335] px-4 py-4">
                <h3 className="font-serif text-[1.1rem] text-cream">{row.topic}</h3>
                <div className="mt-2.5 flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#3E8E5E] text-white">
                    <CheckIcon className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-sm leading-relaxed text-cream">
                    <span className="font-semibold">We do:</span> {row.ours}
                  </p>
                </div>
                <div className="mt-2 flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#F3D3C5]/60 text-[#F3D3C5]">
                    <CloseIcon className="h-3 w-3" />
                  </span>
                  <p className="text-sm leading-relaxed text-[#F3D3C5]">
                    <span className="font-semibold">Red flag:</span> {row.elsewhere}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-5 flex items-start gap-2 text-sm text-wheat">
          <LeafSprig className="mt-0.5 h-4 w-8 shrink-0 text-wheat/80" />
          We are a nutrition coaching practice, not a medical provider. Nothing here replaces care
          from your prescriber or care team.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ How it works */
export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="scroll-mt-24 bg-cream py-16 md:py-24">
      <div className="container-editorial">
        <SectionHeading
          id="how-it-works-title"
          eyebrow="How it works"
          title="Four steps, one calm plan."
          intro={
            <p>
              No app to live inside, no points to count. A coach, a written plan, and a weekly
              conversation that fits around your prescriber&apos;s schedule.
            </p>
          }
        />

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step, index) => (
            <li key={step.step} className="relative flex h-full flex-col rounded-2xl border border-line bg-white/70 p-5 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <span className="font-serif text-[2rem] leading-none text-terracotta">{step.step}</span>
                {index < howItWorks.length - 1 ? (
                  <ArrowRightIcon className="hidden h-4 w-4 text-olive lg:block" />
                ) : (
                  <LeafSprig className="hidden h-5 w-10 text-olive lg:block" />
                )}
              </div>
              <h3 className="mt-3 font-serif text-[1.25rem] leading-snug text-sage">{step.title}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-olive-deep">
                {step.meta}
              </p>
              <p className="mt-2.5 text-[1.0625rem] leading-relaxed text-cocoa">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-wheat-deep bg-wheat/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="max-w-2xl text-[0.98rem] leading-relaxed text-cocoa">
            <span className="font-semibold text-sage">Your prescriber stays in charge.</span> We
            never advise on medication or dosing. With your written permission, we can send a short
            nutrition summary to your care team after your first month.
          </p>
          <a href="#plans" className="btn btn-secondary shrink-0">
            See the plans
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------- Kitchen toolkit */
const toolkitIcons = {
  plate: PlateIcon,
  list: ListIcon,
  basket: BasketIcon,
  strength: StrengthIcon,
};

export function KitchenToolkit() {
  return (
    <section id="toolkit" aria-labelledby="toolkit-title" className="scroll-mt-24 border-y border-line bg-cream-deep py-16 md:py-24">
      <div className="container-editorial">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-14">
          <div className="lg:sticky lg:top-28">
            <SectionHeading
              id="toolkit-title"
              eyebrow="Your kitchen toolkit"
              title="Real things you leave with."
              intro={
                <p>
                  These are deliverables, not promises about the scale. Each one is built with
                  your coach, written for your kitchen, and yours to keep.
                </p>
              }
            />
            <p className="mt-5 text-sm leading-relaxed text-cocoa">
              Food only. No supplements, powders or affiliate products — if a food-first option
              exists, we use it.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {toolkit.map((item) => {
              const Icon = toolkitIcons[item.icon];
              return (
                <li key={item.title} className="flex h-full flex-col rounded-2xl border border-line bg-cream p-5 shadow-card">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-olive/40 bg-sage-wash text-sage">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-serif text-[1.2rem] leading-snug text-sage">{item.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-olive-deep">
                    {item.format}
                  </p>
                  <p className="mt-2 text-[1.0625rem] leading-relaxed text-cocoa">{item.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-cocoa">
          The strength starter is a one-page routine to discuss with your doctor, not a
          prescription for exercise. If you have injuries or conditions that limit activity, get
          medical clearance first.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- Coach */
export function MeetCoach() {
  const { openBooking } = useFunnel();

  return (
    <section id="coach" aria-labelledby="coach-title" className="scroll-mt-24 bg-cream py-16 md:py-24">
      <div className="container-editorial">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
          <div className="relative mx-auto w-full max-w-[26rem] lg:mx-0">
            <div
              aria-hidden="true"
              className="absolute -right-3 top-6 hidden h-[94%] w-full rounded-t-[6rem] border border-olive/35 sm:block"
            />
            <div className="relative overflow-hidden rounded-t-[6rem] rounded-b-2xl border border-line shadow-lift">
              <SafeImage
                {...coach.image}
                sizes="(min-width: 1024px) 32vw, 90vw"
                fallbackLabel="Illustration of a coach holding a plate of vegetables"
              />
            </div>
            <p className="absolute bottom-3 left-3 right-3 rounded-full border border-wheat-deep bg-cream/95 px-3 py-1.5 text-center text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-olive-deep shadow-card">
              {coach.sampleProfile}
            </p>
            <p className="sr-only">{coach.caption}</p>
          </div>

          <div>
            <p className="eyebrow">Meet your coach</p>
            <h2 id="coach-title" className="mt-2 font-serif text-[clamp(1.9rem,4.4vw,2.9rem)] leading-[1.1] text-sage">
              {coach.name}
            </h2>
            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-olive-deep">
              {coach.role}
            </p>
            <div className="mt-5 space-y-3.5 text-[1.0625rem] leading-relaxed text-cocoa">
              {coach.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <p className="mt-4 rounded-lg border border-line bg-white/60 px-3 py-2 text-xs leading-relaxed text-cocoa">
              {coach.caption} No certifications, awards or client outcomes are claimed anywhere on
              this concept site.
            </p>
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <button type="button" className="btn btn-primary" onClick={() => openBooking()}>
                Book a free fit call with Wrenfield
                <ArrowRightIcon className="h-4 w-4" />
              </button>
              <a href="#plans" className="btn btn-secondary">
                Compare the plans
              </a>
            </div>
          </div>
        </div>

        <div className="mt-11 rounded-2xl border border-olive/40 bg-sage-wash p-5 sm:p-7">
          <div className="flex items-start gap-3">
            <WrenMark className="mt-0.5 h-7 w-7 shrink-0 text-sage" />
            <div>
              <h3 className="font-serif text-[1.5rem] leading-snug text-sage">Our promises to you</h3>
              <p className="mt-1 text-[1.0625rem] text-cocoa">
                Four things you can hold us to. They are process commitments, not health outcomes.
              </p>
            </div>
          </div>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2">
            {promises.map((promise) => (
              <li key={promise.title} className="flex items-start gap-3 rounded-xl border border-line bg-cream p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-wash text-leaf-deep">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                <div>
                  <h4 className="font-serif text-[1.08rem] leading-snug text-sage">{promise.title}</h4>
                  <p className="mt-1 text-[0.95rem] leading-relaxed text-cocoa">{promise.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Final CTA */
export function FinalCta() {
  const { openBooking } = useFunnel();

  return (
    <section aria-labelledby="final-cta-title" className="relative overflow-hidden bg-sage py-16 md:py-24">
      <LeafSprig className="pointer-events-none absolute -left-6 top-10 h-24 w-48 text-wheat/25" />
      <LeafSprig
        className="pointer-events-none absolute -right-6 bottom-8 h-24 w-48 text-wheat/20"
        flip
      />
      <div className="container-editorial relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-wheat">
            One last, simple idea
          </p>
          <h2
            id="final-cta-title"
            className="mt-3 font-serif text-[clamp(2.2rem,5.6vw,3.6rem)] leading-[1.05] text-cream"
          >
            Eat less. <span className="italic text-[#F3D3C5]">Nourish more.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-wheat">
            A free, 20-minute fit call is enough to know whether this is useful for you. If it is
            not, we will say so and point you somewhere better.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              className="btn btn-primary min-h-12 w-full px-7 text-[1.02rem] sm:w-auto"
              onClick={() => openBooking()}
            >
              Book a free fit call
              <ArrowRightIcon className="h-4 w-4" />
            </button>
            <a
              href="#plate-check"
              className="btn min-h-12 w-full border border-cream/70 px-6 text-[1.02rem] text-cream hover:bg-cream/10 sm:w-auto"
            >
              Take the Plate Check
            </a>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-wheat/90">
            Not medical advice. We never prescribe or advise on medication or dosing — talk with
            your prescriber. Sample contact: {brand.contact.phone}.
          </p>
        </div>
      </div>
    </section>
  );
}

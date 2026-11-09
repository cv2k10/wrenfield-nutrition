import { HOW_IT_WORKS } from "@/lib/data";

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="hiw-heading" className="scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 id="hiw-heading" className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Four steps, no haze
          </h2>
          <p className="mt-4 text-sage-600">
            Coaching happens by secure video, anywhere in the U.S. Here is the whole arc before you
            spend a dollar.
          </p>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map((s) => (
            <li key={s.step} className="card relative flex flex-col p-6 pt-8 transition-transform duration-200 hover:-translate-y-1">
              <span
                aria-hidden="true"
                className="absolute -top-4 left-6 flex h-9 w-9 items-center justify-center rounded-full border-2 border-cream bg-terracotta font-display text-lg font-bold text-cream"
              >
                {s.step}
              </span>
              <h3 className="font-display text-xl font-semibold text-sage-800">{s.title}</h3>
              <p className="mt-2 text-[0.98rem] text-sage-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import type { ReactNode, SVGProps } from "react";

/* ---------------------------------------------------------------- Wren mark */
export function WrenMark({
  className = "",
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 33c0-8.5 6-15 14.6-15 5.2 0 9.2 2.2 11.9 5.3" />
        <path d="M35.7 23.6c2.6 0 4.6 1.3 5.6 3.2-2 .9-4.2.9-6.2.2" />
        <path
          d="M23.6 18.4c-2.7-4.4-1.6-8.6 2.3-11.4 1.3 4.4.5 8.2-2.3 11.4z"
          fill="#C4623F"
          stroke="#C4623F"
        />
        <path d="M12.4 36.8 9.6 42" />
        <path d="M20 37.8 18.8 43" />
        <path d="M9.4 33.2c-1.5 1.3-3.6 1.5-5.1.6" />
      </g>
      <circle cx="31" cy="26" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage text-cream shadow-sm">
        <WrenMark className="h-7 w-7" />
      </span>
      <span className="flex flex-col leading-none">
          <span className="font-serif text-[1.22rem] leading-tight text-sage">
          Wrenfield
          {compact ? null : <span className="text-olive-deep">&nbsp;Nutrition</span>}
        </span>
        <span className="mt-0.5 text-[0.63rem] font-semibold uppercase tracking-[0.15em] text-olive-deep">
          GLP-1 nutrition coaching
        </span>
      </span>
    </span>
  );
}

/* ------------------------------------------------------------- Accent marks */
export function LeafSprig({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 64"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M4 58C26 44 52 30 112 8" />
        <path d="M28 45c-2-9 3-16 12-19 1 9-3 16-12 19z" fill="#7C8B5A" stroke="none" opacity="0.55" />
        <path d="M48 34c8 1 12 7 11 16-8-1-12-7-11-16z" fill="#7C8B5A" stroke="none" opacity="0.4" />
        <path d="M66 24c-1-8 3-14 11-16 1 8-3 14-11 16z" fill="#7C8B5A" stroke="none" opacity="0.5" />
        <path d="M86 16c7 1 11 6 10 14-7-1-11-6-10-14z" fill="#7C8B5A" stroke="none" opacity="0.35" />
      </g>
    </svg>
  );
}

export function PlateDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 34"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="#C4623F" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M4 20c34-8 76-11 116-9 34 2 72 7 116 12" opacity="0.75" />
        <path d="M28 25c30-5 66-7 100-6 30 1 55 4 84 8" opacity="0.35" />
      </g>
      <g stroke="#7C8B5A" strokeWidth="1.4" fill="none" strokeLinecap="round">
        <path d="M112 4c4-2 8-2 12 0" />
        <path d="M118 3v6" />
      </g>
    </svg>
  );
}

/* -------------------------------------------------------------------- Icons */
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m4.5 12.5 5 5L19.5 7" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 12H5" />
      <path d="m11 18-6-6 6-6" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M8 3.5v3M16 3.5v3M3.5 10h17" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}

export function PlateIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5" opacity="0.55" />
    </svg>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 6.5h11M9 12h11M9 17.5h11" />
      <path d="M4 6.5h1M4 12h1M4 17.5h1" />
    </svg>
  );
}

export function BasketIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9h16l-1.6 9.5a2 2 0 0 1-2 1.5H7.6a2 2 0 0 1-2-1.5L4 9z" />
      <path d="m8 9 3-5M16 9l-3-5" />
      <path d="M10 13v3M14 13v3" />
    </svg>
  );
}

export function StrengthIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9v6M7 7.5v9M17 7.5v9M20 9v6" />
      <path d="M7 12h10" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="4.5" y="10" width="15" height="10.5" rx="2.5" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 11v5.5M12 7.8v.4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ Layout */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  id,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  align?: "left" | "center";
  id?: string;
  as?: "h2" | "h3";
}) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-3xl text-left"
      }
    >
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <Tag
        id={id}
        className="mt-2 font-serif text-[clamp(1.85rem,4.4vw,2.85rem)] leading-[1.1] text-sage"
      >
        {title}
      </Tag>
      {intro ? (
        <div className="mt-4 text-[1.0625rem] leading-relaxed text-cocoa">{intro}</div>
      ) : null}
    </div>
  );
}

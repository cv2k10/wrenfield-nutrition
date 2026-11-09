import { FunnelProvider } from "@/components/funnel-context";
import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { Concerns } from "@/components/concerns";
import { PlateCheck } from "@/components/plate-check";
import { HonestyPanel, HowItWorks, KitchenToolkit, MeetCoach, FinalCta } from "@/components/sections";
import { Plans } from "@/components/plans";
import { ResourceBand } from "@/components/resource-band";
import { Faq } from "@/components/faq";
import { SiteFooter } from "@/components/site-footer";
import { MobileBar } from "@/components/mobile-bar";

export default function HomePage() {
  return (
    <FunnelProvider>
      <div id="page-shell">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <div id="top" />
      <SiteHeader />
      <main id="main">
        <Hero />
        <Concerns />
        <PlateCheck />
        <HonestyPanel />
        <HowItWorks />
        <Plans />
        <KitchenToolkit />
        <MeetCoach />
        <ResourceBand />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <MobileBar />
      </div>
    </FunnelProvider>
  );
}

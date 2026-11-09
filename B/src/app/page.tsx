import { FunnelProvider } from "@/components/funnel-context";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { SoundFamiliar } from "@/components/sound-familiar";
import { PlateCheck } from "@/components/plate-check";
import { DontDo } from "@/components/dont-do";
import { HowItWorks } from "@/components/how-it-works";
import { Plans } from "@/components/plans";
import { Toolkit } from "@/components/toolkit";
import { Coach } from "@/components/coach";
import { ResourceBand } from "@/components/resource-band";
import { Faq } from "@/components/faq";
import { FinalCta, SiteFooter } from "@/components/site-footer";
import { MobileBar } from "@/components/mobile-bar";
import { BookingDialog } from "@/components/booking-dialog";

export default function Home() {
  return (
    <FunnelProvider>
      <Header />
      <main id="main">
        <Hero />
        <SoundFamiliar />
        <PlateCheck />
        <DontDo />
        <HowItWorks />
        <Plans />
        <Toolkit />
        <Coach />
        <ResourceBand />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <MobileBar />
      <BookingDialog />
    </FunnelProvider>
  );
}

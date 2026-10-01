import { Hero } from "@/components/sections/hero/Hero";
import { Problem } from "@/components/sections/problem/Problem";
import { Agents } from "@/components/sections/agents/Agents";
import { Demo } from "@/components/sections/demo/Demo";
import { Close } from "@/components/sections/close/Close";
import { Reporting } from "@/components/sections/reporting/Reporting";
import { Comparison } from "@/components/sections/comparison/Comparison";
import { Process } from "@/components/sections/process/Process";
import { Integrations } from "@/components/sections/integrations/Integrations";
import { Testimonials } from "@/components/sections/testimonials/Testimonials";
import { Faq } from "@/components/sections/faq/Faq";
import { Booking } from "@/components/sections/booking/Booking";
import { LightPanel } from "@/components/ui/LightPanel";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Agents />
      <Demo />
      <Close />
      <Reporting />
      <LightPanel as="div" className="my-6 md:my-10">
        <Comparison />
        <Process />
      </LightPanel>
      <Integrations />
      <Testimonials />
      <Faq />
      <Booking />
    </>
  );
}

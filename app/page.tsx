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

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <Agents />
      <Demo />
      <Close />
      <Reporting />
      <Comparison />
      <Process />
      <Integrations />
      <Testimonials />
      <Faq />
      <Booking />
    </>
  );
}

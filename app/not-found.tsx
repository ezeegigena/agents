import { Button } from "@/components/ui/Button";
import { Glow } from "@/components/ui/Glow";
import { GradientText } from "@/components/ui/GradientText";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[80vh] place-items-center overflow-hidden pt-24">
      <Glow color="#9d6bff" className="top-1/4 left-1/2 -translate-x-1/2" size={640} opacity={0.3} />
      <div className="container-page relative text-center">
        <p className="eyebrow text-fg-subtle">Error 404</p>
        <h1 className="mt-5 text-6xl font-semibold tracking-[-0.05em] md:text-8xl">
          This page is <GradientText>unreconciled.</GradientText>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-fg-muted">
          We couldn&apos;t find what you were looking for. Your finance team, however, is right
          this way.
        </p>
        <div className="mt-10 flex justify-center">
          <Button href="/" arrow size="lg">
            Back to home
          </Button>
        </div>
      </div>
    </section>
  );
}

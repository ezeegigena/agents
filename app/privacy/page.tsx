import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects your information.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="[PLACEHOLDER DATE]">
      <section>
        <h2>Information we collect</h2>
        <p>
          [PLACEHOLDER] Describe the information collected through this website, for example
          details you submit when booking a call (name, email, company) and basic analytics.
        </p>
      </section>
      <section>
        <h2>How we use information</h2>
        <p>
          [PLACEHOLDER] Explain how information is used: to schedule and prepare for calls, to
          respond to inquiries and to improve the website.
        </p>
      </section>
      <section>
        <h2>Data security</h2>
        <p>[PLACEHOLDER] Summarize your security practices and data retention policy.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Questions about this policy? Email{" "}
          <a className="text-fg underline underline-offset-4" href={`mailto:${siteConfig.contactEmail}`}>
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}

import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that govern use of the ${siteConfig.name} website and services.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="[PLACEHOLDER DATE]">
      <section>
        <h2>Use of this website</h2>
        <p>[PLACEHOLDER] Describe acceptable use of the website and its content.</p>
      </section>
      <section>
        <h2>Services</h2>
        <p>
          [PLACEHOLDER] Clarify that services are provided under a separate written agreement and
          that website content (including demos and illustrative figures) is not financial advice.
        </p>
      </section>
      <section>
        <h2>Limitation of liability</h2>
        <p>[PLACEHOLDER] Add your limitation of liability and governing law clauses.</p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms? Email{" "}
          <a className="text-fg underline underline-offset-4" href={`mailto:${siteConfig.contactEmail}`}>
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}

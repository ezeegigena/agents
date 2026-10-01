import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [display, body] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/BricolageGrotesque-Bold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Geist-Medium.ttf")),
  ]);

  const agents = ["Bookkeeper", "AP/AR", "Budget", "FP&A", "Controller", "Accounting", "Finance", "CFO"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#060814",
          backgroundImage:
            "radial-gradient(circle at 85% 20%, rgba(157,107,255,0.45), transparent 45%), radial-gradient(circle at 70% 90%, rgba(31,224,181,0.30), transparent 45%), radial-gradient(circle at 10% 10%, rgba(76,125,255,0.35), transparent 40%)",
          color: "#f5f7ff",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: "linear-gradient(45deg, #4c7dff, #9d6bff 50%, #1fe0b5)",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 32 32">
              <path d="M6 17 12 23 26 8" fill="none" stroke="white" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ display: "flex", fontFamily: "Bricolage", fontSize: 38, letterSpacing: -1.5 }}>
            yourfinance
            <span
              style={{
                backgroundImage: "linear-gradient(90deg, #9d6bff, #1fe0b5)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              done
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontFamily: "Bricolage",
              fontSize: 92,
              lineHeight: 0.98,
              letterSpacing: -4.5,
              maxWidth: 980,
            }}
          >
            Automate your complete&nbsp;
            <span
              style={{
                backgroundImage: "linear-gradient(100deg, #4c7dff, #9d6bff 45%, #1fe0b5)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              finance team.
            </span>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {agents.map((a) => (
              <div
                key={a}
                style={{
                  display: "flex",
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(160,170,255,0.22)",
                  background: "rgba(255,255,255,0.05)",
                  fontSize: 22,
                  color: "#a8b0d0",
                }}
              >
                AI {a}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bricolage", data: display, weight: 700, style: "normal" },
        { name: "Geist", data: body, weight: 500, style: "normal" },
      ],
    },
  );
}

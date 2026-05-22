import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Check } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | Jumanah Typing & Documents Clearing" },
      { name: "description", content: "Jumanah is a UAE-based documents clearing and PRO services firm built on precision, discretion, and trust." },
      { property: "og:title", content: "About Jumanah Typing & Documents Clearing" },
      { property: "og:description", content: "Founded by Tanvirul Islam — premium UAE documents clearing." },
    ],
  }),
  component: AboutPage,
});

const values = [
  "Founder-led, hands-on service",
  "Deep knowledge of UAE regulations",
  "Transparent process and pricing",
  "Confidential handling of every document",
  "Multilingual client support",
  "Fast turnaround across all emirates",
];

function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="container mx-auto px-6 pt-20 pb-16">
        <div className="text-xs tracking-[0.3em] uppercase text-gold mb-5">About Us</div>
        <h1 className="font-display text-5xl md:text-6xl font-bold max-w-3xl">
          A premium standard for <span className="gold-text">UAE documentation</span>
        </h1>
        <div className="gold-divider w-32 my-8" />
      </section>

      <section className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 pb-24">
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-lg">
            Jumanah Typing & Documents Clearing is a UAE-based firm offering a complete range of
            documents clearing, PRO and business setup services for individuals, families and enterprises.
          </p>
          <p>
            We combine in-depth knowledge of UAE regulations with a refined client experience —
            handling every visa, license and government interaction with discretion and precision.
          </p>
          <p>
            From Ras Al Khaimah, we serve clients across the Emirates with a single promise:
            paperwork, perfected.
          </p>
        </div>

        <div className="luxury-card rounded-2xl p-10">
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Leadership</div>
          <h3 className="font-display text-3xl font-bold mb-1">Tanvirul Islam</h3>
          <p className="text-sm text-muted-foreground tracking-widest uppercase mb-8">Founder & CEO</p>
          <ul className="space-y-3">
            {values.map((v) => (
              <li key={v} className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span className="text-foreground/90">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}

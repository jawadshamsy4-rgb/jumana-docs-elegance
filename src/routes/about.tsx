import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Check } from "lucide-react";
import aboutImg from "@/assets/dubai-about.jpg";
import { useSetting, type AboutSettings } from "@/lib/site-data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Jumanah — UAE Documents Clearing & PRO" },
      { name: "description", content: "Jumanah is a UAE-based documents clearing and PRO services firm built on precision, discretion, and trust. Founded by Tanvirul Islam." },
      { property: "og:title", content: "About Jumanah — UAE Documents Clearing & PRO" },
      { property: "og:description", content: "UAE documents clearing and PRO services led by founder Tanvirul Islam." },
      { property: "og:url", content: "https://jumanahdocs.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://jumanahdocs.lovable.app/about" }],
  }),
  component: AboutPage,
});

const DEFAULTS: AboutSettings = {
  label: "About Us",
  heading: "A premium standard for UAE documentation",
  intro: "Jumanah Typing & Documents Clearing is a UAE-based firm offering a complete range of documents clearing, PRO and business setup services for individuals, families and enterprises.",
  body: "We combine in-depth knowledge of UAE regulations with a refined client experience — handling every visa, license and government interaction with discretion and precision.",
  closing: "From Ras Al Khaimah, we serve clients across the Emirates with a single promise: paperwork, perfected.",
  founder_name: "Tanvirul Islam",
  founder_title: "Founder & CEO",
  values: [
    "Founder-led, hands-on service",
    "Deep knowledge of UAE regulations",
    "Transparent process and pricing",
    "Confidential handling of every document",
    "Multilingual client support",
    "Fast turnaround across all emirates",
  ],
  image_url: null,
};

function AboutPage() {
  const { data } = useSetting<AboutSettings>("about");
  const a = { ...DEFAULTS, ...(data ?? {}) } as AboutSettings;
  const headingParts = a.heading.split(/\s+/);
  const headingMain = headingParts.slice(0, -2).join(" ");
  const headingAccent = headingParts.slice(-2).join(" ");
  const img = a.image_url || aboutImg;

  return (
    <div className="min-h-screen">
      <Header />
      <section className="container mx-auto px-6 pt-20 pb-16">
        <div className="text-xs tracking-[0.3em] uppercase text-gold mb-5">{a.label}</div>
        <h1 className="font-display text-5xl md:text-6xl font-bold max-w-3xl">
          {headingMain} <span className="gold-text">{headingAccent}</span>
        </h1>
        <div className="gold-divider w-32 my-8" />
      </section>

      <section className="container mx-auto px-6 pb-12">
        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden luxury-card">
          <img src={img} alt="About Jumanah" loading="lazy" width={1600} height={1024} className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </section>

      <section className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 pb-24">
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          {a.intro && <p className="text-lg whitespace-pre-wrap">{a.intro}</p>}
          {a.body && <p className="whitespace-pre-wrap">{a.body}</p>}
          {a.closing && <p className="whitespace-pre-wrap">{a.closing}</p>}
        </div>

        <div className="luxury-card rounded-2xl p-10">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <div className="text-xs tracking-[0.3em] uppercase text-gold mb-3">Leadership</div>
              <h3 className="font-display text-3xl font-bold mb-1">{a.founder_name}</h3>
              <p className="text-sm text-muted-foreground tracking-widest uppercase">{a.founder_title}</p>
            </div>
            {(a as any).founder_image_url && (
              <img
                src={(a as any).founder_image_url}
                alt={a.founder_name}
                loading="lazy"
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-2 border-gold shrink-0"
              />
            )}
          </div>
          <ul className="space-y-3">
            {(a.values ?? []).map((v) => (
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

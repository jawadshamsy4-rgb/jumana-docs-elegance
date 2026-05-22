import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ServiceCard } from "@/components/site/ServiceCard";
import { services } from "@/lib/services";
import { ArrowRight, Phone, Award, Clock, ShieldCheck, Users } from "lucide-react";
import skyline from "@/assets/hero-skyline.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jumanah Typing & Documents Clearing | UAE Documents Services" },
      { name: "description", content: "UAE all documents clearing services — visa processing, Emirates ID, trade license, business setup and PRO services in Ras Al Khaimah." },
      { property: "og:title", content: "Jumanah Typing & Documents Clearing" },
      { property: "og:description", content: "Premium UAE documents clearing, PRO services and business setup." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `url(${skyline})`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
            backgroundRepeat: "no-repeat",
            mixBlendMode: "lighten",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
        <div className="container mx-auto px-6 pt-20 pb-28 lg:pt-28 lg:pb-40 relative">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full gold-border text-xs tracking-[0.25em] uppercase text-gold mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> UAE All Documents Clearing
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6">
              <span className="gold-text">JUMANAH</span>
              <br />
              <span className="text-foreground/95">Typing & Documents</span>
              <br />
              <span className="text-foreground/95">Clearing</span>
            </h1>
            <div className="gold-divider w-32 my-8" />
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
              A premium UAE partner for visa processing, Emirates ID, trade licensing,
              PRO services and complete business setup — handled with precision and discretion.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/services" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full btn-gold text-sm">
                Explore Services <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="tel:0505064847" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full btn-outline-gold text-sm">
                <Phone className="w-4 h-4" /> 050 506 4847
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 luxury-card rounded-2xl p-8">
          {[
            { icon: Award, n: "10+", l: "Years Expertise" },
            { icon: Users, n: "5,000+", l: "Clients Served" },
            { icon: ShieldCheck, n: "100%", l: "Trusted Process" },
            { icon: Clock, n: "24/7", l: "Support" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <s.icon className="w-7 h-7 text-gold mx-auto mb-3" strokeWidth={1.5} />
              <div className="font-display text-3xl font-bold gold-text">{s.n}</div>
              <div className="text-xs tracking-widest uppercase text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="container mx-auto px-6 py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">Services Include</div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            A complete suite for <span className="gold-text">UAE documentation</span>
          </h2>
          <div className="gold-divider w-24 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <ServiceCard key={s.title} {...s} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl p-12 md:p-20 luxury-card text-center">
          <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-radial-gold)" }} />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Ready to clear your documents <span className="gold-text">effortlessly?</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Speak with our team today and let us handle every detail with the care it deserves.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:0505064847" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full btn-gold text-sm">
                <Phone className="w-4 h-4" /> Call 050 506 4847
              </a>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full btn-outline-gold text-sm">
                Get in Touch <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

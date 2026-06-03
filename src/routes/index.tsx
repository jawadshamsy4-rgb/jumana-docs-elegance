import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { SocialBar } from "@/components/site/SocialBar";
import { LocationMap } from "@/components/site/LocationMap";
import { ServiceCard } from "@/components/site/ServiceCard";
import { ArrowRight, Phone, Award, Clock, ShieldCheck, Users, Send } from "lucide-react";
import skyline from "@/assets/hero-skyline.jpg";
import dubaiServices from "@/assets/dubai-services.jpg";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useServices, useSetting, type HeroSettings, type ContactSettings } from "@/lib/site-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jumanah Typing & Documents Clearing — UAE PRO" },
      { name: "description", content: "UAE documents clearing services — visa processing, Emirates ID, trade license, business setup and PRO services in Ras Al Khaimah." },
      { property: "og:title", content: "Jumanah Typing & Documents Clearing — UAE PRO" },
      { property: "og:description", content: "Premium UAE documents clearing, PRO services and business setup in Ras Al Khaimah." },
      { property: "og:url", content: "https://jumanahdocs.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://jumanahdocs.lovable.app/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Jumanah Typing & Documents Clearing",
        url: "https://jumanahdocs.lovable.app/",
      }),
    }],
  }),
  component: Home,
});

const HERO_DEFAULTS: HeroSettings = {
  badge: "UAE All Documents Clearing",
  title_line1: "JUMANAH",
  title_line2: "Typing & Documents",
  title_line3: "Clearing",
  subtitle: "A premium UAE partner for visa processing, Emirates ID, trade licensing, PRO services and complete business setup — handled with precision and discretion.",
  cta_primary: "Explore Services",
  cta_secondary_phone: "054 549 9790",
  image_url: null,
};

function Home() {
  const { data: heroData } = useSetting<HeroSettings>("hero");
  const { data: contact } = useSetting<ContactSettings>("contact");
  const { data: services } = useServices();

  const hero = { ...HERO_DEFAULTS, ...(heroData ?? {}) } as HeroSettings;
  const bgImage = hero.image_url || skyline;
  const phone = hero.cta_secondary_phone || contact?.phone1 || "054 549 9790";
  const telHref = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <div className="min-h-screen">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
        <div className="container mx-auto px-6 pt-20 pb-28 lg:pt-28 lg:pb-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-3xl animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full red-border text-xs tracking-[0.25em] uppercase text-red-accent mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-red-accent" /> {hero.badge}
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
                <span className="gold-text">{hero.title_line1}</span>
                <br />
                <span className="text-foreground/95">{hero.title_line2}</span>
                <br />
                <span className="text-foreground/95">{hero.title_line3}</span>
              </h1>
              <div className="gold-divider w-32 my-8" />
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10">
                {hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/services" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full btn-gold text-sm">
                  {hero.cta_primary} <ArrowRight className="w-4 h-4" />
                </Link>
                <a href={telHref} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full btn-outline-gold text-sm">
                  <Phone className="w-4 h-4" /> {phone}
                </a>
              </div>
            </div>

            <div className="lg:justify-self-end w-full max-w-md animate-fade-up">
              <ConsultationForm whatsapp={contact?.whatsapp || "971545499790"} />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container mx-auto px-6 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 luxury-card rounded-2xl p-8">
          {[
            { icon: Award, n: "10+", l: "Years Expertise", red: false },
            { icon: Users, n: "5,000+", l: "Clients Served", red: true },
            { icon: ShieldCheck, n: "100%", l: "Trusted Process", red: false },
            { icon: Clock, n: "24/7", l: "Support", red: true },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <s.icon className={`w-7 h-7 mx-auto mb-3 ${s.red ? "text-red-accent" : "text-gold"}`} strokeWidth={1.5} />
              <div className={`font-display text-3xl font-bold ${s.red ? "red-text" : "gold-text"}`}>{s.n}</div>
              <div className="text-xs tracking-widest uppercase text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="container mx-auto px-6 py-28">
        <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-16 luxury-card">
          <img
            src={dubaiServices}
            alt="Dubai business district skyline"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            width={1920}
            height={800}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-8 px-6">
            <div className="text-xs tracking-[0.3em] uppercase text-red-accent mb-3">Services Include</div>
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
              A complete suite for <span className="gold-text">UAE documentation</span>
            </h2>
            <div className="red-divider w-24 mx-auto" />
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(services ?? []).map((s, i) => (
            <ServiceCard key={s.id} iconName={s.icon} title={s.title} desc={s.description} slug={s.slug} index={i} />
          ))}
        </div>
      </section>

      {/* LOCATION MAP */}
      <LocationMap />

      {/* CTA */}
      <section className="container mx-auto px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl p-12 md:p-20 luxury-card text-center">
          <div className="absolute inset-0 opacity-40" style={{ background: "var(--gradient-radial-gold)" }} />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
              Ready to clear your documents <span className="red-text">effortlessly?</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Speak with our team today and let us handle every detail with the care it deserves.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href={telHref} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full btn-gold text-sm">
                <Phone className="w-4 h-4" /> Call {phone}
              </a>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full btn-outline-red text-sm">
                Get in Touch <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SocialBar />

      <Footer />
    </div>
  );
}

const consultationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

function ConsultationForm({ whatsapp }: { whatsapp: string }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = consultationSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSubmitting(true);

    // Save to admin inbox
    const { error } = await supabase.from("inquiries").insert({
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      service: "Consultation (home)",
      message: result.data.message,
    });
    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    // Also forward via WhatsApp
    const lines = [
      `Name: ${result.data.name}`,
      `Email: ${result.data.email}`,
      result.data.phone ? `Phone: ${result.data.phone}` : "",
      "",
      result.data.message,
    ].filter(Boolean).join("\n");
    const waNumber = whatsapp.replace(/\D/g, "") || "971545499790";
    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank", "noopener,noreferrer");

    toast.success("Message sent — opening WhatsApp");
    setForm({ name: "", email: "", phone: "", message: "" });
    setSubmitting(false);
  };

  return (
    <div className="luxury-card rounded-2xl p-8 backdrop-blur-sm">
      <div className="text-xs tracking-[0.3em] uppercase text-red-accent mb-2">Get a Free Consultation</div>
      <h3 className="font-display text-2xl md:text-3xl font-bold mb-6">Start the <span className="gold-text">Conversation</span></h3>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Full Name *</label>
            <input
              id="name" name="name" type="text" required maxLength={100}
              value={form.name} onChange={onChange} placeholder="John Smith"
              className="w-full rounded-md bg-input/40 border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Email *</label>
            <input
              id="email" name="email" type="email" required maxLength={255}
              value={form.email} onChange={onChange} placeholder="your@email.com"
              className="w-full rounded-md bg-input/40 border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        </div>
        <div>
          <label htmlFor="phone" className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Phone Number</label>
          <input
            id="phone" name="phone" type="tel" maxLength={30}
            value={form.phone} onChange={onChange} placeholder="+971 XX XXX XXXX"
            className="w-full rounded-md bg-input/40 border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Message *</label>
          <textarea
            id="message" name="message" required maxLength={1000} rows={4}
            value={form.message} onChange={onChange} placeholder="Tell us about your requirements..."
            className="w-full rounded-md bg-input/40 border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-gold transition-colors resize-none"
          />
        </div>
        <button
          type="submit" disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full btn-gold text-sm"
        >
          <Send className="w-4 h-4" /> {submitting ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ServiceCard } from "@/components/site/ServiceCard";
import { services } from "@/lib/services";
import { ArrowRight, Phone, Award, Clock, ShieldCheck, Users, Send } from "lucide-react";
import skyline from "@/assets/hero-skyline.jpg";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

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
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `url(${skyline})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
        <div className="container mx-auto px-6 pt-20 pb-28 lg:pt-28 lg:pb-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-3xl animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full gold-border text-xs tracking-[0.25em] uppercase text-gold mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" /> UAE All Documents Clearing
              </div>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
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
                <a href="tel:0545499790" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full btn-outline-gold text-sm">
                  <Phone className="w-4 h-4" /> 054 549 9790
                </a>
              </div>
            </div>

            <div className="lg:justify-self-end w-full max-w-md animate-fade-up">
              <ConsultationForm />
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

const consultationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

function ConsultationForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = consultationSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSubmitting(true);
    const lines = [
      `Name: ${result.data.name}`,
      `Email: ${result.data.email}`,
      result.data.phone ? `Phone: ${result.data.phone}` : "",
      "",
      result.data.message,
    ].filter(Boolean).join("\n");
    const url = `https://wa.me/971505064847?text=${encodeURIComponent(lines)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp to send your message");
    setForm({ name: "", email: "", phone: "", message: "" });
    setSubmitting(false);
  };

  return (
    <div className="luxury-card rounded-2xl p-8 backdrop-blur-sm">
      <div className="text-xs tracking-[0.3em] uppercase text-gold mb-2">Get a Free Consultation</div>
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
          <Send className="w-4 h-4" /> Send Message
        </button>
      </form>
    </div>
  );
}

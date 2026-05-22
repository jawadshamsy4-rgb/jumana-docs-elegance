import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Jumanah Typing & Documents Clearing" },
      { name: "description", content: "Contact Jumanah for UAE documents clearing, visa, Emirates ID, trade license and PRO services. Ras Al Khaimah." },
      { property: "og:title", content: "Contact Jumanah" },
      { property: "og:description", content: "Get in touch with our UAE documents clearing team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Message received — our team will contact you shortly.");
      (e.target as HTMLFormElement).reset();
    }, 700);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <Toaster />
      <section className="container mx-auto px-6 pt-20 pb-12">
        <div className="text-xs tracking-[0.3em] uppercase text-gold mb-5">Contact</div>
        <h1 className="font-display text-5xl md:text-6xl font-bold max-w-3xl">
          Let's <span className="gold-text">talk</span>
        </h1>
        <div className="gold-divider w-32 my-8" />
        <p className="text-muted-foreground max-w-xl text-lg">
          Reach out for a quick consultation — we typically respond within the hour.
        </p>
      </section>

      <section className="container mx-auto px-6 grid lg:grid-cols-5 gap-8 pb-24">
        <div className="lg:col-span-2 space-y-5">
          {[
            
            { icon: Phone, label: "Mobile", value: "054 549 9790", href: "tel:0545499790" },
            { icon: Phone, label: "Mobile", value: "054 547 6784", href: "tel:0545476784" },
            { icon: Mail, label: "Email", value: "jumanahdoc@gmail.com", href: "mailto:jumanahdoc@gmail.com" },
            { icon: MapPin, label: "Office", value: "Dahan, Ras Al Khaimah, UAE" },
          ].map((c, i) => {
            const Inner = (
              <div className="luxury-card rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full gold-border flex items-center justify-center bg-[oklch(0.78_0.13_78/0.08)]">
                  <c.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{c.label}</div>
                  <div className="text-foreground font-medium">{c.value}</div>
                </div>
              </div>
            );
            return c.href ? (
              <a key={i} href={c.href} className="block">{Inner}</a>
            ) : (
              <div key={i}>{Inner}</div>
            );
          })}
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-3 luxury-card rounded-2xl p-8 md:p-10 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Full Name" name="name" />
            <Field label="Phone" name="phone" type="tel" />
          </div>
          <Field label="Email" name="email" type="email" />
          <Field label="Service Required" name="service" />
          <div>
            <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Message</label>
            <textarea
              name="message" required rows={5}
              className="mt-2 w-full bg-[oklch(0.12_0.005_60)] border border-border focus:border-[var(--gold)] outline-none rounded-lg p-4 text-foreground transition-colors"
            />
          </div>
          <button type="submit" disabled={sending}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full btn-gold text-sm disabled:opacity-60">
            <Send className="w-4 h-4" /> {sending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
      <Footer />
    </div>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{label}</label>
      <input
        required name={name} type={type}
        className="mt-2 w-full bg-[oklch(0.12_0.005_60)] border border-border focus:border-[var(--gold)] outline-none rounded-lg p-3.5 text-foreground transition-colors"
      />
    </div>
  );
}

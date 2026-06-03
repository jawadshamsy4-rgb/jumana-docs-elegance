import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import contactImg from "@/assets/dubai-contact.jpg";
import { useSetting, useServices, type ContactSettings } from "@/lib/site-data";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Jumanah — UAE Documents Clearing" },
      { name: "description", content: "Contact Jumanah for UAE documents clearing, visa, Emirates ID, trade license and PRO services. Based in Ras Al Khaimah." },
      { property: "og:title", content: "Contact Jumanah — UAE Documents Clearing" },
      { property: "og:description", content: "Get in touch with our UAE documents clearing team in Ras Al Khaimah." },
      { property: "og:url", content: "https://jumanahdocs.lovable.app/contact" },
    ],
    links: [{ rel: "canonical", href: "https://jumanahdocs.lovable.app/contact" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Jumanah Typing & Documents Clearing",
        url: "https://jumanahdocs.lovable.app/contact",
        telephone: "+971-50-506-4847",
        email: "jumanahdoc@gmail.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Dahan",
          addressLocality: "Ras Al Khaimah",
          addressCountry: "AE",
        },
      }),
    }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  service: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

function ContactPage() {
  const { data: contact } = useSetting<ContactSettings>("contact");
  const { data: services } = useServices();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" });

  const heading = contact?.heading || "Contact Jumanah — UAE Documents Clearing";
  const subtitle = contact?.subtitle || "Reach out for a quick consultation — we typically respond within the hour.";
  const phone1 = contact?.phone1 || "054 549 9790";
  const phone2 = contact?.phone2 || "054 547 6784";
  const email = contact?.email || "jumanahdoc@gmail.com";
  const address = contact?.address || "Dahan, Ras Al Khaimah, UAE";

  const headingParts = heading.split(/\s+/);
  const headingMain = headingParts.slice(0, -1).join(" ");
  const headingAccent = headingParts.slice(-1).join(" ");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your inputs");
      return;
    }
    setSending(true);
    const { error } = await supabase.from("inquiries").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      service: parsed.data.service || null,
      message: parsed.data.message,
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Message received — our team will contact you shortly.");
    setForm({ name: "", phone: "", email: "", service: "", message: "" });
  };

  const onChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const contactItems: { icon: typeof Phone; label: string; value: string; href?: string }[] = [
    { icon: Phone, label: "Mobile", value: phone1, href: `tel:${phone1.replace(/\s+/g, "")}` },
  ];
  if (phone2) contactItems.push({ icon: Phone, label: "Mobile", value: phone2, href: `tel:${phone2.replace(/\s+/g, "")}` });
  contactItems.push({ icon: Mail, label: "Email", value: email, href: `mailto:${email}` });
  contactItems.push({ icon: MapPin, label: "Office", value: address });

  return (
    <div className="min-h-screen">
      <Header />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: `url(${contactImg})`, backgroundSize: "cover", backgroundPosition: "center" }} aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/30" />
        <div className="container mx-auto px-6 pt-20 pb-16 relative">
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-5">Contact</div>
          <h1 className="font-display text-5xl md:text-6xl font-bold max-w-3xl">
            {headingMain} <span className="gold-text">{headingAccent}</span>
          </h1>
          <div className="gold-divider w-32 my-8" />
          <p className="text-muted-foreground max-w-xl text-lg">{subtitle}</p>
        </div>
      </section>

      <section className="container mx-auto px-6 grid lg:grid-cols-5 gap-8 pb-24">
        <div className="lg:col-span-2 space-y-5">
          {contactItems.map((c, i) => {
            const Inner = (
              <div className="luxury-card rounded-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full gold-border flex items-center justify-center bg-[oklch(0.6_0.17_145/0.08)]">
                  <c.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{c.label}</div>
                  <div className="text-foreground font-medium">{c.value}</div>
                </div>
              </div>
            );
            return c.href ? <a key={i} href={c.href} className="block">{Inner}</a> : <div key={i}>{Inner}</div>;
          })}
        </div>

        <form onSubmit={onSubmit} className="lg:col-span-3 luxury-card rounded-2xl p-8 md:p-10 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <Field label="Full Name" name="name" value={form.name} onChange={onChange("name")} />
            <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={onChange("phone")} required={false} />
          </div>
          <Field label="Email" name="email" type="email" value={form.email} onChange={onChange("email")} />
          <div>
            <label htmlFor="contact-service" className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Service Required</label>
            <select
              id="contact-service" name="service" value={form.service} onChange={onChange("service")}
              className="mt-2 w-full bg-secondary border border-border focus:border-[var(--gold)] outline-none rounded-lg p-3.5 text-foreground transition-colors"
            >
              <option value="">Select a service (optional)</option>
              {services?.map((s) => <option key={s.id} value={s.title}>{s.title}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="contact-message" className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Message</label>
            <textarea
              id="contact-message" name="message" required rows={5} value={form.message} onChange={onChange("message")}
              className="mt-2 w-full bg-secondary border border-border focus:border-[var(--gold)] outline-none rounded-lg p-4 text-foreground transition-colors"
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

function Field({ label, name, type = "text", value, onChange, required = true }: {
  label: string; name: string; type?: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean;
}) {
  const id = `contact-${name}`;
  return (
    <div>
      <label htmlFor={id} className="text-xs tracking-[0.2em] uppercase text-muted-foreground">{label}</label>
      <input
        id={id} required={required} name={name} type={type} value={value} onChange={onChange}
        className="mt-2 w-full bg-secondary border border-border focus:border-[var(--gold)] outline-none rounded-lg p-3.5 text-foreground transition-colors"
      />
    </div>
  );
}

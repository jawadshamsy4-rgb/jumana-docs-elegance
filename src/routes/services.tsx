import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ServiceCard } from "@/components/site/ServiceCard";
import { services } from "@/lib/services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services | Jumanah Typing & Documents Clearing" },
      { name: "description", content: "Visa processing, Emirates ID, trade license, PRO services, business setup, document typing and attestation across the UAE." },
      { property: "og:title", content: "UAE Documents Clearing Services — Jumanah" },
      { property: "og:description", content: "Full-service UAE documents clearing and PRO." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="container mx-auto px-6 pt-20 pb-12">
        <div className="text-xs tracking-[0.3em] uppercase text-gold mb-5">Our Services</div>
        <h1 className="font-display text-5xl md:text-6xl font-bold max-w-3xl">
          UAE All Documents <span className="gold-text">Clearing Services</span>
        </h1>
        <div className="gold-divider w-32 my-8" />
        <p className="text-muted-foreground max-w-2xl text-lg">
          From visa processing to full company formation — every service delivered with the precision and discretion expected of a premium UAE partner.
        </p>
      </section>
      <section className="container mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <ServiceCard key={s.title} {...s} index={i} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}

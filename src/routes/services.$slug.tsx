import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { services } from "@/lib/services";
import { ArrowLeft, Check, Phone, ArrowRight } from "lucide-react";
import detailImg from "@/assets/dubai-service-detail.jpg";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { slug: service.slug };
  },
  head: ({ loaderData }) => {
    const s = loaderData ? services.find((service) => service.slug === loaderData.slug) : undefined;
    const title = s ? `${s.title} | Jumanah Typing & Documents Clearing` : "Service | Jumanah";
    const desc = s?.desc ?? "UAE documents clearing services.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-4xl font-bold mb-4">Service not found</h1>
        <p className="text-muted-foreground mb-8">The service you’re looking for doesn’t exist.</p>
        <Link to="/services" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full btn-gold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>
      </div>
      <Footer />
    </div>
  ),
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Something went wrong loading this service.</p>
    </div>
  ),
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useLoaderData();
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    return null;
  }

  const Icon = service.icon;
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${detailImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        <div className="container mx-auto px-6 py-24 lg:py-32 relative">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mb-8">
            <ArrowLeft className="w-4 h-4" /> All Services
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center gold-border bg-[oklch(0.6_0.17_145/0.08)]">
              <Icon className="w-8 h-8 text-gold" strokeWidth={1.5} />
            </div>
            <div className="text-xs tracking-[0.3em] uppercase text-gold">Service</div>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold max-w-3xl mb-6">
            <span className="gold-text">{service.title}</span>
          </h1>
          <div className="gold-divider w-32 my-6" />
          <p className="text-lg text-muted-foreground max-w-2xl">{service.desc}</p>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 py-20 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">Overview</h2>
          <p className="text-lg">{service.long}</p>
          <p>
            Our team handles documentation, follow-up and authority coordination end-to-end —
            so you get a faster, cleaner result without dealing with multiple counters.
          </p>
        </div>
        <div className="luxury-card rounded-2xl p-8">
          <div className="text-xs tracking-[0.3em] uppercase text-gold mb-4">What’s included</div>
          <ul className="space-y-3">
            {service.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span className="text-foreground/90">{h}</span>
              </li>
            ))}
          </ul>
          <a href="tel:0545499790" className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full btn-gold text-sm">
            <Phone className="w-4 h-4" /> Call 054 549 9790
          </a>
        </div>
      </section>

      {/* Other services */}
      <section className="container mx-auto px-6 pb-24">
        <h2 className="font-display text-2xl font-bold mb-6">Other services</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {others.map((o) => {
            const OIcon = o.icon;
            return (
              <Link
                key={o.slug}
                to="/services/$slug"
                params={{ slug: o.slug }}
                className="luxury-card rounded-xl p-6 group block"
              >
                <div className="flex items-center gap-3 mb-3">
                  <OIcon className="w-6 h-6 text-gold" strokeWidth={1.5} />
                  <h3 className="font-display text-lg font-bold group-hover:text-gold transition-colors">{o.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{o.desc}</p>
                <div className="inline-flex items-center gap-2 text-sm font-medium text-gold mt-4 group-hover:gap-3 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}

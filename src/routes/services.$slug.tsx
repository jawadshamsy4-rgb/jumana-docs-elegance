import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { services } from "@/lib/services";
import { ArrowLeft, Check, Phone, ArrowRight } from "lucide-react";
import imgVisa from "@/assets/svc-visa-processing.jpg";
import imgMoi from "@/assets/svc-moi.jpg";
import imgEid from "@/assets/svc-emirates-id.jpg";
import imgMedical from "@/assets/svc-medical.jpg";
import imgTrade from "@/assets/svc-trade-license.jpg";
import imgBusiness from "@/assets/svc-business-setup.jpg";
import imgPro from "@/assets/svc-pro.jpg";
import imgMohre from "@/assets/svc-mohre.jpg";
import imgIcp from "@/assets/svc-icp.jpg";
import imgTyping from "@/assets/svc-typing.jpg";
import imgFallback from "@/assets/dubai-highrise.jpg";

const serviceImages: Record<string, string> = {
  "visa-processing": imgVisa,
  "moi-services": imgMoi,
  "emirates-id": imgEid,
  "medical-insurance": imgMedical,
  "trade-license": imgTrade,
  "business-setup": imgBusiness,
  "pro-services": imgPro,
  "mohre": imgMohre,
  "icp-gdrfa": imgIcp,
  "typing-attestation": imgTyping,
};

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

      {/* Full-bleed Dubai high-rise banner — fully visible */}
      <section className="relative w-full">
        <img
          src={serviceImages[service.slug] ?? imgFallback}
          alt="Dubai high-rise skyline featuring Burj Khalifa"
          className="w-full h-[42vh] md:h-[58vh] object-cover"
          width={1920}
          height={1080}
        />
        {/* very light bottom fade only, keeps picture near 100% visible */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Title block on clean surface */}
      <section className="container mx-auto px-6 pt-12 pb-4 relative">
        <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mb-8">
          <ArrowLeft className="w-4 h-4" /> All Services
        </Link>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center gold-border bg-[oklch(0.6_0.17_145/0.08)]">
            <Icon className="w-8 h-8 text-gold" strokeWidth={1.5} />
          </div>
          <div className="text-xs tracking-[0.3em] uppercase text-red-accent">Service</div>
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold max-w-3xl mb-6">
          <span className="gold-text">{service.title}</span>
        </h1>
        <div className="gold-divider w-32 my-6" />
        <p className="text-lg text-muted-foreground max-w-2xl">{service.desc}</p>
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
          <div className="text-xs tracking-[0.3em] uppercase text-red-accent mb-4">What’s included</div>
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArrowLeft, Check, Phone, ArrowRight } from "lucide-react";
import { useService, useServices, useSetting, type ContactSettings } from "@/lib/site-data";
import { getServiceImage } from "@/lib/services";
import { getIcon } from "@/lib/icon-map";

export const Route = createFileRoute("/services/$slug")({
  loader: async ({ params }) => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data } = await supabase
      .from("services")
      .select("title,description,slug,image_url")
      .eq("slug", params.slug)
      .maybeSingle();
    return { service: data as { title: string; description: string; slug: string; image_url: string | null } | null };
  },
  head: ({ params, loaderData }) => {
    const s = loaderData?.service;
    const title = s ? `${s.title} — Jumanah UAE` : "Service — Jumanah UAE";
    const desc = s?.description ?? "UAE documents clearing services by Jumanah.";
    const url = `https://jumanahdocs.lovable.app/services/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        ...(s?.image_url ? [
          { property: "og:image", content: s.image_url },
          { name: "twitter:image", content: s.image_url },
        ] : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Something went wrong loading this service.</p>
    </div>
  ),
  notFoundComponent: () => <NotFound />,
  component: ServiceDetail,
});

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-4xl font-bold mb-4">Service not found</h1>
        <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist.</p>
        <Link to="/services" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full btn-gold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Services
        </Link>
      </div>
      <Footer />
    </div>
  );
}

function ServiceDetail() {
  const { slug } = Route.useParams();
  const { data: service, isLoading } = useService(slug);
  const { data: allServices } = useServices();
  const { data: contact } = useSetting<ContactSettings>("contact");

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-6 py-32 text-center text-muted-foreground">Loading…</div>
        <Footer />
      </div>
    );
  }

  if (!service || !service.is_published) return <NotFound />;

  const Icon = getIcon(service.icon);
  const phone = contact?.phone1 || "054 549 9790";
  const telHref = `tel:${phone.replace(/\s+/g, "")}`;
  const heroImg = getServiceImage(service.slug, service.image_url);
  const others = (allServices ?? []).filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative w-full">
        <img
          src={heroImg}
          alt={`${service.title} in the UAE`}
          className="w-full h-[42vh] md:h-[58vh] object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

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
        <p className="text-lg text-muted-foreground max-w-2xl">{service.description}</p>
      </section>

      <section className="container mx-auto px-6 py-20 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6 text-muted-foreground leading-relaxed">
          <h2 className="font-display text-3xl font-bold text-foreground mb-2">Overview</h2>
          <p className="text-lg whitespace-pre-wrap">{service.long_description || service.description}</p>
          <p>
            Our team handles documentation, follow-up and authority coordination end-to-end —
            so you get a faster, cleaner result without dealing with multiple counters.
          </p>
        </div>
        <div className="luxury-card rounded-2xl p-8">
          <div className="text-xs tracking-[0.3em] uppercase text-red-accent mb-4">What's included</div>
          <ul className="space-y-3">
            {service.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-sm">
                <Check className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span className="text-foreground/90">{h}</span>
              </li>
            ))}
          </ul>
          <a href={telHref} className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full btn-gold text-sm">
            <Phone className="w-4 h-4" /> Call {phone}
          </a>
        </div>
      </section>

      {others.length > 0 && (
        <section className="container mx-auto px-6 pb-24">
          <h2 className="font-display text-2xl font-bold mb-6">Other services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {others.map((o) => {
              const OIcon = getIcon(o.icon);
              return (
                <Link
                  key={o.id}
                  to="/services/$slug"
                  params={{ slug: o.slug }}
                  className="luxury-card rounded-xl p-6 group block"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <OIcon className="w-6 h-6 text-gold" strokeWidth={1.5} />
                    <h3 className="font-display text-lg font-bold group-hover:text-gold transition-colors">{o.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{o.description}</p>
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-gold mt-4 group-hover:gap-3 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

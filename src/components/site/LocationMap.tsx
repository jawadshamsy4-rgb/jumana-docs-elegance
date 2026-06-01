import { useSetting, type LocationMapSettings } from "@/lib/site-data";

export function LocationMap() {
  const { data } = useSetting<LocationMapSettings>("location_map");
  if (!data || !data.is_enabled || !data.embed_src) return null;

  return (
    <section className="container mx-auto px-6 pb-20">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="text-xs tracking-[0.3em] uppercase text-red-accent mb-3">Visit Our Office</div>
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-4">
          {data.title || "Find Us"}
        </h2>
        {data.description && (
          <p className="text-muted-foreground">{data.description}</p>
        )}
        <div className="gold-divider w-24 mx-auto mt-6" />
      </div>
      <div className="luxury-card rounded-2xl overflow-hidden">
        <iframe
          src={data.embed_src}
          title={data.title || "Our Location"}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-[420px] md:h-[480px] border-0 block"
        />
      </div>
    </section>
  );
}

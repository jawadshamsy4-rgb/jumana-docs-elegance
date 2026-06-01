import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getSocialMeta } from "@/lib/social-icons";

type SocialLinkRow = {
  id: string;
  platform: string;
  url: string;
  is_enabled: boolean;
  sort_order: number;
};

export function SocialBar() {
  const { data } = useQuery({
    queryKey: ["social-links", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links")
        .select("id,platform,url,is_enabled,sort_order")
        .eq("is_enabled", true)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as SocialLinkRow[];
    },
  });

  if (!data || data.length === 0) return null;

  return (
    <section className="container mx-auto px-6 pb-16 pt-4">
      <div className="flex flex-col items-center gap-5">
        <div className="text-xs tracking-[0.3em] uppercase text-red-accent">Follow Us</div>
        <div className="gold-divider w-16" />
        <ul className="flex flex-wrap items-center justify-center gap-4">
          {data.map((link) => {
            const meta = getSocialMeta(link.platform);
            const Icon = meta.icon;
            const href =
              link.platform === "email" && !/^mailto:/i.test(link.url)
                ? `mailto:${link.url}`
                : link.url;
            return (
              <li key={link.id}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={meta.label}
                  className="group inline-flex items-center justify-center w-12 h-12 rounded-full border border-border bg-secondary text-foreground/80 transition-all duration-300 hover:scale-110 hover:border-gold hover:text-gold hover:bg-card"
                >
                  <Icon className="w-5 h-5 transition-colors duration-300" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  long_description: string;
  highlights: string[];
  icon: string;
  image_url: string | null;
  sort_order: number;
  is_published: boolean;
};

export function useServices(opts: { includeUnpublished?: boolean } = {}) {
  return useQuery({
    queryKey: ["services", opts.includeUnpublished ?? false],
    queryFn: async () => {
      let q = supabase.from("services").select("*").order("sort_order");
      if (!opts.includeUnpublished) q = q.eq("is_published", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as ServiceRow[];
    },
  });
}

export function useService(slug: string) {
  return useQuery({
    queryKey: ["service", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      return data as ServiceRow | null;
    },
  });
}

export function useSetting<T = any>(key: string) {
  return useQuery({
    queryKey: ["setting", key],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings").select("value").eq("key", key).maybeSingle();
      return (data?.value ?? null) as T | null;
    },
  });
}

export type HeroSettings = {
  badge: string; title_line1: string; title_line2: string; title_line3: string;
  subtitle: string; cta_primary: string; cta_secondary_phone: string; image_url: string | null;
};
export type AboutSettings = {
  label: string; heading: string; intro: string; body: string; closing: string;
  founder_name: string; founder_title: string; values: string[]; image_url: string | null;
};
export type ContactSettings = {
  phone1: string; phone2: string; email: string; address: string;
  whatsapp: string; heading: string; subtitle: string;
};
export type BrandingSettings = {
  logo_text: string; logo_tagline: string; logo_url: string | null;
  primary_color: string; accent_color: string;
  font_display: string; font_sans: string;
};
export type LocationMapSettings = {
  title: string; description: string;
  embed_code: string; embed_src: string; is_enabled: boolean;
};

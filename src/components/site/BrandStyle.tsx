import { useSetting, type BrandingSettings } from "@/lib/site-data";

// Injects branding colors as CSS variables, overriding defaults from styles.css
export function BrandStyle() {
  const { data } = useSetting<BrandingSettings>("branding");
  if (!data) return null;
  const css = `:root{
    ${data.primary_color ? `--gold: ${data.primary_color}; --primary: ${data.primary_color}; --ring: ${data.primary_color};` : ""}
    ${data.accent_color ? `--brand-red: ${data.accent_color}; --accent: ${data.accent_color}; --destructive: ${data.accent_color};` : ""}
  }`;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

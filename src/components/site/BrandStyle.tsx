import { useEffect } from "react";
import { useSetting, type BrandingSettings } from "@/lib/site-data";

const FONT_WEIGHTS: Record<string, string> = {
  "Playfair Display": "wght@600;700;800",
  "Inter": "wght@300;400;500;600;700",
  "Space Grotesk": "wght@400;500;600;700",
  "DM Sans": "wght@400;500;700",
  "Outfit": "wght@300;400;500;600;700",
  "Figtree": "wght@300;400;500;600;700",
  "Sora": "wght@400;500;600;700",
  "Manrope": "wght@300;400;500;600;700",
  "Urbanist": "wght@300;400;500;600;700",
  "Lora": "wght@400;500;600;700",
  "Cormorant Garamond": "wght@400;500;600;700",
  "Libre Baskerville": "wght@400;700",
  "Work Sans": "wght@300;400;500;600;700",
  "Karla": "wght@400;500;600;700",
  "Bebas Neue": "wght@400",
};

function ensureFontLoaded(family: string) {
  if (typeof document === "undefined" || !family) return;
  const id = `gf-${family.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const weights = FONT_WEIGHTS[family] ?? "wght@400;500;600;700";
  const href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${weights}&display=swap`;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

export function BrandStyle() {
  const { data } = useSetting<BrandingSettings>("branding");

  useEffect(() => {
    if (data?.font_display) ensureFontLoaded(data.font_display);
    if (data?.font_sans) ensureFontLoaded(data.font_sans);
  }, [data?.font_display, data?.font_sans]);

  if (!data) return null;

  const css = `:root{
    ${data.primary_color ? `--gold: ${data.primary_color}; --primary: ${data.primary_color}; --ring: ${data.primary_color};` : ""}
    ${data.accent_color ? `--brand-red: ${data.accent_color}; --accent: ${data.accent_color}; --destructive: ${data.accent_color};` : ""}
    ${data.font_display ? `--font-display: "${data.font_display}", Georgia, serif;` : ""}
    ${data.font_sans ? `--font-sans: "${data.font_sans}", system-ui, sans-serif;` : ""}
  }
  ${data.font_display ? `h1,h2,h3,h4,.font-display{font-family: var(--font-display) !important;}` : ""}
  ${data.font_sans ? `body{font-family: var(--font-sans) !important;}` : ""}
  `;
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

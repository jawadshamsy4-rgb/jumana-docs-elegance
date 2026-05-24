import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo.png";
import { useSetting, type BrandingSettings, type ContactSettings } from "@/lib/site-data";

const nav = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { data: branding } = useSetting<BrandingSettings>("branding");
  const { data: contact } = useSetting<ContactSettings>("contact");

  const logoText = branding?.logo_text || "JUMANAH";
  const logoTagline = branding?.logo_tagline || "Typing & Clearing";
  const logoUrl = branding?.logo_url || logo;
  const phone = contact?.phone1 || "054 549 9790";
  const telHref = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logoUrl} alt={logoText} className="w-12 h-12 object-contain rounded-full" />
          <div className="leading-tight">
            <div className="font-display text-base font-bold tracking-wide gold-text">{logoText}</div>
            <div className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">{logoTagline}</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm tracking-wide text-foreground/80 hover:text-gold transition-colors relative"
              activeProps={{ className: "text-gold" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <a
          href={telHref}
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-gold text-sm"
        >
          <Phone className="w-4 h-4" /> {phone}
        </a>

        <button className="md:hidden text-gold" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="text-sm text-foreground/80 hover:text-gold"
                activeProps={{ className: "text-gold" }}
              >
                {n.label}
              </Link>
            ))}
            <a href={telHref} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full btn-gold text-sm w-fit">
              <Phone className="w-4 h-4" /> {phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

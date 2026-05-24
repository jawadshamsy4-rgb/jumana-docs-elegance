import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";
import { useSetting, useServices, type BrandingSettings, type ContactSettings } from "@/lib/site-data";

export function Footer() {
  const { data: branding } = useSetting<BrandingSettings>("branding");
  const { data: contact } = useSetting<ContactSettings>("contact");
  const { data: services } = useServices();

  const name = branding?.logo_text || "JUMANAH";
  const tagline = branding?.logo_tagline || "Typing & Documents Clearing";
  const phone1 = contact?.phone1 || "054 549 9790";
  const phone2 = contact?.phone2 || "054 547 6784";
  const email = contact?.email || "jumanahdoc@gmail.com";
  const address = contact?.address || "Dahan, Ras Al Khaimah";

  const footerServices = (services ?? []).slice(0, 5);

  return (
    <footer className="mt-32 border-t border-border bg-secondary">
      <div className="red-divider" />
      <div className="container mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-2xl gold-text font-bold">{name}</div>
          <div className="text-xs tracking-[0.25em] text-muted-foreground uppercase mt-1">{tagline}</div>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
            UAE's trusted partner for complete documents clearing, PRO, and business setup services.
          </p>
        </div>
        <div>
          <h4 className="text-red-accent text-sm tracking-widest uppercase mb-4">Navigate</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-gold">Home</Link></li>
            <li><Link to="/services" className="hover:text-gold">Services</Link></li>
            <li><Link to="/about" className="hover:text-gold">About</Link></li>
            <li><Link to="/contact" className="hover:text-gold">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold text-sm tracking-widest uppercase mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {footerServices.length === 0 ? (
              <>
                <li>Visa Processing</li>
                <li>Emirates ID</li>
                <li>Trade License</li>
                <li>Business Setup</li>
                <li>PRO Services</li>
              </>
            ) : footerServices.map((s) => (
              <li key={s.id}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="hover:text-gold">{s.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-red-accent text-sm tracking-widest uppercase mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold shrink-0" /><span>{phone1}</span></li>
            {phone2 && <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold shrink-0" /><span>{phone2}</span></li>}
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-gold shrink-0" /><span>{email}</span></li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold shrink-0" /><span>{address}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {name} {tagline}. All rights reserved.
      </div>
    </footer>
  );
}

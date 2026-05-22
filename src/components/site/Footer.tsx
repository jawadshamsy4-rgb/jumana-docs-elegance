import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border bg-[oklch(0.12_0.005_60)]">
      <div className="gold-divider" />
      <div className="container mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-2xl gold-text font-bold">JUMANAH</div>
          <div className="text-xs tracking-[0.25em] text-muted-foreground uppercase mt-1">Typing & Documents Clearing</div>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
            UAE's trusted partner for complete documents clearing, PRO, and business setup services.
          </p>
        </div>
        <div>
          <h4 className="text-gold text-sm tracking-widest uppercase mb-4">Navigate</h4>
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
            <li>Visa Processing</li>
            <li>Emirates ID</li>
            <li>Trade License</li>
            <li>Business Setup</li>
            <li>PRO Services</li>
          </ul>
        </div>
        <div>
          <h4 className="text-gold text-sm tracking-widest uppercase mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold" /> 050 506 4847</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-gold" /> jumanahdoc@gmail.com</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold" /> Dahan, Ras Al Khaimah</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Jumanah Typing & Documents Clearing. All rights reserved.
      </div>
    </footer>
  );
}

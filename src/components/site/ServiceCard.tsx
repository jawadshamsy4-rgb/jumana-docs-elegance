import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function ServiceCard({
  icon: Icon, title, desc, slug, index = 0,
}: { icon: LucideIcon; title: string; desc: string; slug: string; index?: number }) {
  return (
    <Link
      to="/services/$slug"
      params={{ slug }}
      className="luxury-card rounded-xl p-7 group relative overflow-hidden animate-fade-up block focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-px animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-5 gold-border bg-[oklch(0.6_0.17_145/0.08)]">
        <Icon className="w-7 h-7 text-gold" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-display font-bold mb-3 text-foreground group-hover:text-gold transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">{desc}</p>
      <div className="inline-flex items-center gap-2 text-sm font-medium text-gold group-hover:gap-3 transition-all">
        Learn more <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  );
}

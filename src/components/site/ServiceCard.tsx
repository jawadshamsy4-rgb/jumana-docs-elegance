import type { LucideIcon } from "lucide-react";

export function ServiceCard({
  icon: Icon, title, desc, index = 0,
}: { icon: LucideIcon; title: string; desc: string; index?: number }) {
  return (
    <div
      className="luxury-card rounded-xl p-7 group relative overflow-hidden animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="absolute inset-x-0 top-0 h-px animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-5 gold-border bg-[oklch(0.78_0.13_78/0.08)]">
        <Icon className="w-7 h-7 text-gold" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-display font-bold mb-3 text-foreground group-hover:text-gold transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

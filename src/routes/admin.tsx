import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Briefcase, FileText, Palette, Inbox, LogOut, ExternalLink, UserCog, Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin | Jumanah" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const nav: { to: string; label: string; icon: any; exact?: boolean }[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/services", label: "Services", icon: Briefcase },
  { to: "/admin/content", label: "Content", icon: FileText },
  { to: "/admin/branding", label: "Branding", icon: Palette },
  { to: "/admin/social", label: "Social Media", icon: Share2 },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/account", label: "Account", icon: UserCog },
];

function AdminLayout() {
  const { session, loading, isAdmin, adminLoading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  if (loading || (session && adminLoading)) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading admin…</div>;
  }
  if (!session) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Access denied</h1>
          <p className="text-muted-foreground mb-6">Your account does not have admin privileges.</p>
          <Button onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}>Sign out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-60 bg-card border-r border-border flex flex-col">
        <Link to="/admin" className="px-5 py-5 border-b border-border">
          <div className="font-display text-lg font-bold gold-text">JUMANAH</div>
          <div className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Admin Panel</div>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => {
            const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to as any}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  active ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted"
                }`}>
                <n.icon className="w-4 h-4" /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border space-y-2">
          <a href="/" target="_blank" rel="noopener" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-2 py-1">
            <ExternalLink className="w-3 h-3" /> View site
          </a>
          <Button variant="ghost" size="sm" className="w-full justify-start"
            onClick={async () => { await supabase.auth.signOut(); navigate({ to: "/auth" }); }}>
            <LogOut className="w-4 h-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto"><div className="p-8 max-w-6xl mx-auto"><Outlet /></div></main>
    </div>
  );
}

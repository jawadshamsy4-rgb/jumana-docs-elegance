import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, FileText, Inbox, Palette } from "lucide-react";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [s, i, n] = await Promise.all([
        supabase.from("services").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }),
        supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      return { services: s.count ?? 0, inquiries: i.count ?? 0, newInquiries: n.count ?? 0 };
    },
  });

  const cards = [
    { label: "Services", value: stats?.services ?? "—", to: "/admin/services", icon: Briefcase },
    { label: "Total Inquiries", value: stats?.inquiries ?? "—", to: "/admin/inquiries", icon: Inbox },
    { label: "New Inquiries", value: stats?.newInquiries ?? "—", to: "/admin/inquiries", icon: Inbox },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage your website content from one place.</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to}>
            <Card className="hover:shadow-md transition">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">{c.label}</CardTitle>
                <c.icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-3xl font-bold">{c.value}</div></CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <QuickLink to="/admin/content" icon={FileText} title="Edit page content" desc="Hero, About, Contact info" />
        <QuickLink to="/admin/branding" icon={Palette} title="Customize branding" desc="Logo, colors, fonts" />
      </div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, title, desc }: any) {
  return (
    <Link to={to}>
      <Card className="hover:shadow-md transition">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="font-medium">{title}</div>
            <div className="text-sm text-muted-foreground">{desc}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

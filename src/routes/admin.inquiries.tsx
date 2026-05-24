import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Check, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/inquiries")({ component: Inquiries });

type Inquiry = {
  id: string; name: string; email: string; phone: string | null;
  service: string | null; message: string; status: string; created_at: string;
};

function Inquiries() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Inquiry[];
    },
  });

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("inquiries").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (error) toast.error(error.message);
    else qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inquiries</h1>
        <p className="text-muted-foreground mt-1">Messages submitted through your contact form.</p>
      </div>
      {isLoading ? <p className="text-muted-foreground">Loading…</p> : (
        <div className="space-y-3">
          {data?.length === 0 && <p className="text-muted-foreground">No inquiries yet.</p>}
          {data?.map((i) => (
            <Card key={i.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="font-medium">{i.name}</div>
                    <div className="text-xs text-muted-foreground">{new Date(i.created_at).toLocaleString()}</div>
                  </div>
                  <Badge variant={i.status === "new" ? "default" : "secondary"}>{i.status}</Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <a href={`mailto:${i.email}`} className="inline-flex items-center gap-1 hover:text-foreground"><Mail className="w-3 h-3" />{i.email}</a>
                  {i.phone && <a href={`tel:${i.phone}`} className="inline-flex items-center gap-1 hover:text-foreground"><Phone className="w-3 h-3" />{i.phone}</a>}
                  {i.service && <span>Service: {i.service}</span>}
                </div>
                <p className="text-sm whitespace-pre-wrap bg-muted/50 rounded p-3">{i.message}</p>
                <div className="flex gap-2">
                  {i.status !== "read" && <Button size="sm" variant="outline" onClick={() => setStatus(i.id, "read")}><Check className="w-3 h-3 mr-1" />Mark read</Button>}
                  {i.status !== "archived" && <Button size="sm" variant="outline" onClick={() => setStatus(i.id, "archived")}>Archive</Button>}
                  <Button size="sm" variant="ghost" onClick={() => remove(i.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { SOCIAL_PLATFORMS, getSocialMeta } from "@/lib/social-icons";

export const Route = createFileRoute("/admin/social")({ component: SocialAdmin });

type Row = {
  id: string;
  platform: string;
  url: string;
  is_enabled: boolean;
  sort_order: number;
};

function SocialAdmin() {
  const qc = useQueryClient();
  const { data: links, isLoading } = useQuery({
    queryKey: ["admin-social-links"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("social_links")
        .select("id,platform,url,is_enabled,sort_order")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-social-links"] });
    qc.invalidateQueries({ queryKey: ["social-links", "public"] });
  };

  const createNew = async () => {
    const next = (links?.length ?? 0) + 1;
    const { error } = await supabase.from("social_links").insert({
      platform: "facebook",
      url: "",
      is_enabled: false,
      sort_order: next,
    });
    if (error) toast.error(error.message);
    else { toast.success("Added"); invalidate(); }
  };

  const update = async (id: string, patch: Partial<Row>) => {
    const { error } = await supabase.from("social_links").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else invalidate();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this social link?")) return;
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); invalidate(); }
  };

  const move = async (id: string, dir: -1 | 1) => {
    if (!links) return;
    const idx = links.findIndex((l) => l.id === id);
    const swap = links[idx + dir];
    if (!swap) return;
    const a = links[idx];
    await Promise.all([
      supabase.from("social_links").update({ sort_order: swap.sort_order }).eq("id", a.id),
      supabase.from("social_links").update({ sort_order: a.sort_order }).eq("id", swap.id),
    ]);
    invalidate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social Media</h1>
          <p className="text-muted-foreground mt-1">
            Manage the social icons shown above the footer on your home page.
          </p>
        </div>
        <Button onClick={createNew}><Plus className="w-4 h-4 mr-2" />Add link</Button>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : links?.length === 0 ? (
        <p className="text-muted-foreground">No social links yet. Add your first one.</p>
      ) : (
        <div className="space-y-2">
          {links?.map((l, i) => (
            <SocialRow
              key={l.id}
              row={l}
              isFirst={i === 0}
              isLast={i === (links.length - 1)}
              onChange={(patch) => update(l.id, patch)}
              onDelete={() => remove(l.id)}
              onMoveUp={() => move(l.id, -1)}
              onMoveDown={() => move(l.id, 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SocialRow({
  row, isFirst, isLast, onChange, onDelete, onMoveUp, onMoveDown,
}: {
  row: Row;
  isFirst: boolean;
  isLast: boolean;
  onChange: (patch: Partial<Row>) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const [url, setUrl] = useState(row.url);
  const Icon = getSocialMeta(row.platform).icon;

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-3 p-4">
        <div className="flex flex-col">
          <Button variant="ghost" size="icon" disabled={isFirst} onClick={onMoveUp} className="h-6 w-6">
            <ArrowUp className="w-3 h-3" />
          </Button>
          <Button variant="ghost" size="icon" disabled={isLast} onClick={onMoveDown} className="h-6 w-6">
            <ArrowDown className="w-3 h-3" />
          </Button>
        </div>

        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>

        <div className="w-40">
          <Select value={row.platform} onValueChange={(v) => onChange({ platform: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SOCIAL_PLATFORMS.map((p) => (
                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Input
          className="flex-1 min-w-[200px]"
          placeholder="https://… or email address"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={() => { if (url !== row.url) onChange({ url }); }}
        />

        <Input
          type="number"
          className="w-20"
          value={row.sort_order}
          onChange={(e) => onChange({ sort_order: Number(e.target.value) || 0 })}
        />

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Switch checked={row.is_enabled} onCheckedChange={(v) => onChange({ is_enabled: v })} />
          <span className="w-14">{row.is_enabled ? "Enabled" : "Off"}</span>
        </div>

        <Button variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </CardContent>
    </Card>
  );
}

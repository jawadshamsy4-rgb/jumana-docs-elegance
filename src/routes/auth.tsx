import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

function PasswordInput({
  value, onChange, minLength,
}: { value: string; onChange: (v: string) => void; minLength?: number }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        required
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Admin Sign In | Jumanah" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/admin" });
  }, [session, loading, navigate]);

  useEffect(() => {
    supabase.rpc("has_any_admin").then(({ data, error }) => {
      if (error) {
        console.error(error);
        setAdminExists(true); // fail safe: hide bootstrap
      } else {
        setAdminExists(Boolean(data));
      }
    });
  }, []);

  const onSignIn = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Welcome back"); navigate({ to: "/admin" }); }
  };

  const onBootstrap = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const redirectUrl = `${window.location.origin}/admin`;
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: redirectUrl },
    });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Admin account created. Signing in…");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) toast.error(signInError.message);
    else navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-6 font-display text-2xl gold-text font-bold">JUMANAH</Link>
        <Card>
          <CardHeader>
            <CardTitle>{adminExists === false ? "Create Admin Account" : "Admin Sign In"}</CardTitle>
            <CardDescription>
              {adminExists === false
                ? "First-time setup. This account will be the site administrator."
                : "Sign in to manage your website."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {adminExists === null ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : adminExists ? (
              <form onSubmit={onSignIn} className="space-y-4">
                <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label>Password</Label><PasswordInput value={password} onChange={setPassword} /></div>
                <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in..." : "Sign in"}</Button>
              </form>
            ) : (
              <form onSubmit={onBootstrap} className="space-y-4">
                <div><Label>Admin email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div><Label>Password (min 6)</Label><PasswordInput value={password} onChange={setPassword} minLength={6} /></div>
                <Button type="submit" className="w-full" disabled={busy}>{busy ? "Creating..." : "Create admin account"}</Button>
                <p className="text-xs text-muted-foreground">After this, sign-up is closed. You can change your password later from the admin panel.</p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

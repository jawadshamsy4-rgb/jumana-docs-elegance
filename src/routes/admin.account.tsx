import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/account")({
  head: () => ({ meta: [{ title: "Account | Admin" }, { name: "robots", content: "noindex" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { session } = useAuth();
  const [newEmail, setNewEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busyPw, setBusyPw] = useState(false);
  const [busyEmail, setBusyEmail] = useState(false);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 6) return toast.error("Password must be at least 6 characters");
    if (pw !== pw2) return toast.error("Passwords don't match");
    setBusyPw(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusyPw(false);
    if (error) toast.error(error.message);
    else { toast.success("Password updated"); setPw(""); setPw2(""); }
  };

  const changeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    setBusyEmail(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setBusyEmail(false);
    if (error) toast.error(error.message);
    else { toast.success("Confirmation email sent to new address"); setNewEmail(""); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">Account</h1>
        <p className="text-muted-foreground">Manage your admin login credentials.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current account</CardTitle>
          <CardDescription>The email you use to sign in to the admin panel.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm"><span className="text-muted-foreground">Email:</span> <span className="font-medium">{session?.user.email}</span></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>Use a strong password. You'll stay signed in after the change.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={changePassword} className="space-y-4 max-w-md">
            <div><Label>New password</Label><Input type="password" minLength={6} required value={pw} onChange={(e) => setPw(e.target.value)} /></div>
            <div><Label>Confirm new password</Label><Input type="password" minLength={6} required value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
            <Button type="submit" disabled={busyPw}>{busyPw ? "Updating..." : "Update password"}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change email</CardTitle>
          <CardDescription>A confirmation link will be sent to the new email address. The change applies once confirmed.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={changeEmail} className="space-y-4 max-w-md">
            <div><Label>New email</Label><Input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} /></div>
            <Button type="submit" variant="outline" disabled={busyEmail}>{busyEmail ? "Sending..." : "Send confirmation"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

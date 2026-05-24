## Goal
Lock the site to a single admin account and give that admin a way to change their password from inside the panel.

## Changes

### 1. `/auth` page — sign-in only (with first-time bootstrap)
- Remove the Sign Up tab from `src/routes/auth.tsx`.
- On page load, check if any admin already exists (via a lightweight public RPC `has_any_admin()` returning boolean — safe, no data leak).
  - If **no admin exists yet** → show a one-time "Create admin account" form (email + password). On submit, sign up + the existing `handle_new_user` trigger auto-promotes them to admin.
  - If an admin already exists → show only the Sign In form. No way to register another account from the UI.
- Disable public sign-ups at the auth provider level via `configure_auth` (`disable_signup: true`) once the first admin is set up. Until then, sign-ups stay open so the bootstrap form works. (We'll enable the flag now since an admin account likely already exists — confirm in step below.)

### 2. Password change in admin panel
- Add a new route `src/routes/admin.account.tsx` with:
  - Display current admin email (read-only).
  - "Change password" form: new password + confirm password. Calls `supabase.auth.updateUser({ password })`.
  - Optional: "Change email" field using `supabase.auth.updateUser({ email })` (sends confirmation email). I'll include it but keep it secondary.
- Add an "Account" link to the admin sidebar/nav in `src/routes/admin.tsx`.

### 3. Database
- Add a tiny SQL function `public.has_any_admin()` returning boolean, `SECURITY DEFINER`, granted to `anon` — only returns true/false, exposes nothing else.

## Technical Notes
- `disable_signup: true` blocks `supabase.auth.signUp` globally — so the bootstrap form only works before we flip the flag. Order: deploy code → user confirms admin exists → flip the flag.
- Password change uses the already-authenticated session, no extra backend needed.
- No changes to existing admin routes, services, content, branding, inquiries.

## Question before I build
Has the first admin account already been created at `/auth`? If yes, I'll flip `disable_signup: true` immediately and skip the bootstrap form. If no, I'll keep sign-ups open until you create it, then we flip it.

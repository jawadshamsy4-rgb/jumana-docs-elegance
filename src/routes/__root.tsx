import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/use-auth";
import { BrandStyle } from "@/components/site/BrandStyle";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-display font-bold gold-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex px-6 py-2.5 rounded-full btn-gold text-sm">Go home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong.</p>
        <div className="mt-6 flex gap-2 justify-center">
          <button onClick={() => { router.invalidate(); reset(); }} className="px-5 py-2 rounded-full btn-gold text-sm">Try again</button>
          <a href="/" className="px-5 py-2 rounded-full btn-outline-gold text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Jumanah Typing & Documents Clearing | UAE PRO Services" },
      { name: "description", content: "Premium UAE documents clearing, visa processing, Emirates ID, trade license, PRO services, and business setup. Ras Al Khaimah." },
      { property: "og:title", content: "Jumanah Typing & Documents Clearing | UAE PRO Services" },
      { name: "twitter:title", content: "Jumanah Typing & Documents Clearing | UAE PRO Services" },
      { property: "og:description", content: "Premium UAE documents clearing, visa processing, Emirates ID, trade license, PRO services, and business setup. Ras Al Khaimah." },
      { name: "twitter:description", content: "Premium UAE documents clearing, visa processing, Emirates ID, trade license, PRO services, and business setup. Ras Al Khaimah." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/QcHjxqgd1tablh6rGx4YiB9T0s33/social-images/social-1779445523944-789a9163-098d-4d2e-8668-d9fe92611ac3.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/QcHjxqgd1tablh6rGx4YiB9T0s33/social-images/social-1779445523944-789a9163-098d-4d2e-8668-d9fe92611ac3.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrandStyle />
        <Outlet />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

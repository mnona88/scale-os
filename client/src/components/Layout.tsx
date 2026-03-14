import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/_core/hooks/useAuth";

const publicNavItems = [
  { href: "/simulator", label: "Profit Simulator" },
  { href: "/concierge", label: "AI Concierge" },
];

const adminNavItem = { href: "/sop", label: "Implementation Guide" };

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();

  const navItems = isAuthenticated
    ? [...publicNavItems, adminNavItem]
    : publicNavItems;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border/60">
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="w-8 h-8 rounded-sm bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-display text-sm font-medium">S</span>
                </div>
                <div>
                  <span className="font-display text-lg font-medium text-foreground tracking-tight">Scale OS</span>
                  <span className="hidden md:block text-xs text-muted-foreground font-body tracking-widest uppercase ml-0.5">Profit Recovery Suite</span>
                </div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className={cn(
                      "px-4 py-2 rounded-md text-sm font-body font-medium transition-all duration-200 cursor-pointer touch-target flex items-center",
                      location === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Mobile nav */}
            <nav className="flex md:hidden items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className={cn(
                      "px-3 py-2 rounded-md text-xs font-body font-medium transition-all duration-200 cursor-pointer",
                      location === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label.split(" ")[0]}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 page-enter">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground font-body">
              © 2025 Scale OS. Serving South Bay business owners.
            </p>
            <p className="text-xs text-muted-foreground font-body">
              Palos Verdes · Torrance · South Bay, California
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

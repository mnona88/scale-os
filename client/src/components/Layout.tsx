import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/_core/hooks/useAuth";
import { Mail } from "lucide-react";
import ContactModal from "./ContactModal";

const CONTACT_EMAIL = "m.nonaka@akanon-intl.com";
const COMPANY_NAME = "A-kanon International";

const publicNavItems = [
  { href: "/simulator", label: "Profit Simulator" },
  { href: "/concierge", label: "AI Concierge" },
];

const adminNavItem = { href: "/sop", label: "Implementation Guide" };

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const [contactOpen, setContactOpen] = useState(false);

  const navItems = isAuthenticated
    ? [...publicNavItems, adminNavItem]
    : publicNavItems;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border/60">
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

            {/* Desktop Navigation */}
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

              {/* Contact Button — opens modal */}
              <button
                onClick={() => setContactOpen(true)}
                className="ml-2 flex items-center gap-2 px-4 py-2 rounded-md border border-primary text-primary text-sm font-body font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-200 touch-target"
              >
                <Mail className="h-3.5 w-3.5" />
                Contact
              </button>
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
              {/* Mobile Contact */}
              <button
                onClick={() => setContactOpen(true)}
                className="p-2 rounded-md text-primary hover:bg-secondary transition-colors touch-target"
                aria-label="Contact"
              >
                <Mail className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 page-enter">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="font-display text-sm font-medium text-foreground">{COMPANY_NAME}</p>
              <p className="text-xs text-muted-foreground font-body mt-0.5">
                Palos Verdes · Torrance · South Bay, California
              </p>
            </div>
            <button
              onClick={() => setContactOpen(true)}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary font-body transition-colors"
            >
              <Mail className="h-3.5 w-3.5" />
              {CONTACT_EMAIL}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

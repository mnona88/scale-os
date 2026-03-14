import { Link } from "wouter";
import { ArrowRight, TrendingUp, Clock, Shield, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const CONTACT_EMAIL = "m.nonaka@akanon-intl.com";

const stats = [
  { value: "$28/hr", label: "True Cost of Admin Staff in California" },
  { value: "68%", label: "Average Admin Hours Reclaimed" },
  { value: "3–5×", label: "Typical First-Year ROI" },
];

const features = [
  {
    icon: TrendingUp,
    title: "Profit Restoration",
    description: "See exactly how much California's wage environment is costing your business — and what you can recover.",
    href: "/simulator",
    cta: "Run Your Numbers",
  },
  {
    icon: Clock,
    title: "24/7 AI Concierge",
    description: "Your business never sleeps. An intelligent assistant handles inquiries, scheduling, and follow-ups around the clock.",
    href: "/concierge",
    cta: "Experience the Demo",
  },
  {
    icon: Shield,
    title: "Implementation Guide",
    description: "A step-by-step playbook for deploying AI automation in your business — no technical background required.",
    href: "/sop",
    cta: "View the Guide",
  },
];

export default function Home() {
  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, oklch(0.97 0.008 80) 0%, oklch(0.99 0.003 55) 50%, oklch(0.97 0.008 80) 100%)",
          }}
        />
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl">
            <p className="font-body text-xs tracking-widest uppercase text-primary mb-6">
              South Bay · California
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-light text-foreground leading-tight mb-6">
              Restore Your
              <br />
              <em className="not-italic text-primary">Profitability.</em>
            </h1>
            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
              California's minimum wage has reached $16.90 — with true loaded costs of $25–30 per hour. 
              Scale OS helps South Bay business owners reclaim their margins through intelligent automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/simulator">
                <Button size="lg" className="font-body font-medium touch-target w-full sm:w-auto">
                  Calculate My Savings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/concierge">
                <Button size="lg" variant="outline" className="font-body font-medium touch-target w-full sm:w-auto bg-card">
                  Meet the AI Concierge
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/60 bg-card">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-border/60">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center md:px-8">
                <div className="metric-display text-primary mb-2">{stat.value}</div>
                <p className="font-body text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container py-20 md:py-28">
        <div className="mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-4">
            Three tools. One outcome.
          </h2>
          <p className="font-body text-muted-foreground max-w-lg">
            Built specifically for South Bay business owners navigating California's evolving labor landscape.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.title} href={feature.href}>
                <div className="ql-card p-8 h-full flex flex-col gap-6 hover:shadow-md transition-shadow duration-300 cursor-pointer group">
                  <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center">
                    <Icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-medium text-foreground mb-3">{feature.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-body text-sm font-medium group-hover:gap-3 transition-all duration-200">
                    {feature.cta}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trust Section */}
      <section className="border-t border-border/40 bg-secondary/30">
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-body text-xs tracking-widest uppercase text-muted-foreground mb-6">Built for South Bay</p>
            <blockquote className="font-display text-2xl md:text-3xl font-light text-foreground italic leading-relaxed">
              "The question is no longer whether to automate — it's how quickly you can afford not to."
            </blockquote>
            <p className="font-body text-sm text-muted-foreground mt-6">
              Serving Palos Verdes · Torrance · Redondo Beach · Manhattan Beach
            </p>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="border-t border-border/40 bg-card">
        <div className="container py-16">
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-body text-xs tracking-widest uppercase text-primary mb-4">A-kanon International</p>
            <h2 className="font-display text-3xl md:text-4xl font-light text-foreground mb-4">
              Ready to see what's possible
              <br />for your business?
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-8 leading-relaxed">
              Schedule a complimentary 15-minute consultation. We'll walk through your numbers and show you exactly where the opportunity is.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Scale OS Consultation Request`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-md font-body font-medium hover:opacity-90 transition-opacity touch-target"
            >
              <Mail className="h-4 w-4" />
              Get in Touch
            </a>
            <p className="font-body text-xs text-muted-foreground mt-4">{CONTACT_EMAIL}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

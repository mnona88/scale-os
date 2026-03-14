import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, Clock, TrendingUp, Share2 } from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const formatHours = (v: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(v);

const businessTypeLabels: Record<string, string> = {
  clinic: "Medical / Aesthetic Clinic",
  realestate: "Real Estate Brokerage",
  retail: "Retail / Boutique",
  restaurant: "Restaurant / Hospitality",
  general: "Business",
};

export default function Results() {
  const params = useParams<{ token: string }>();
  const token = params.token;

  const { data: result, isLoading, error } = trpc.simulator.getByToken.useQuery(
    { token: token ?? "" },
    { enabled: !!token }
  );

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard.");
  };

  if (isLoading) {
    return (
      <div className="container py-24 text-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-6" />
        <p className="font-body text-muted-foreground">Loading your results...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="container py-24 text-center max-w-md mx-auto">
        <div className="ql-card p-10">
          <h2 className="font-display text-2xl font-light text-foreground mb-3">Results Not Found</h2>
          <p className="font-body text-sm text-muted-foreground mb-6">
            This link may have expired or the results were not saved. Run a new simulation to generate fresh results.
          </p>
          <Link href="/simulator">
            <Button className="font-body font-medium touch-target">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Run New Simulation
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Reconstruct monthly projection from saved data
  const monthlyInvestment = 3000;
  const monthlyProjection = Array.from({ length: 12 }, (_, i) => {
    const rampFactor = Math.min(1, 0.4 + (i * 0.06));
    return {
      month: i + 1,
      savings: Math.round((result.annualSavings / 12) * rampFactor),
      cost: monthlyInvestment,
    };
  });

  const businessLabel = businessTypeLabels[result.businessType] || "Business";
  const netSavings = result.annualSavings - monthlyInvestment * 12;

  return (
    <div className="page-enter">
      {/* Header */}
      <section className="border-b border-border/40 bg-card">
        <div className="container py-10 md:py-14">
          <Link href="/simulator">
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-body mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Simulator
            </button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-primary mb-3">Profit Recovery Analysis</p>
              <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-2">
                {result.ownerName ? `${result.ownerName}'s` : "Your"} Results
              </h1>
              {result.businessName && (
                <p className="font-body text-muted-foreground">{result.businessName} · {businessLabel}</p>
              )}
              <p className="font-body text-xs text-muted-foreground mt-2">
                Generated {new Date(result.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            </div>

            <Button
              variant="outline"
              className="font-body font-medium bg-card touch-target flex-shrink-0"
              onClick={handleCopyLink}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share This Report
            </Button>
          </div>
        </div>
      </section>

      <div className="container py-10 md:py-16 max-w-4xl mx-auto space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="ql-card p-6 md:p-8 text-center">
            <DollarSign className="h-5 w-5 text-primary mx-auto mb-4" />
            <div className="metric-display text-primary mb-2">{formatCurrency(result.annualSavings)}</div>
            <p className="font-body text-sm text-muted-foreground">Annual Cost Recovered</p>
          </div>
          <div className="ql-card p-6 md:p-8 text-center">
            <Clock className="h-5 w-5 text-primary mx-auto mb-4" />
            <div className="metric-display text-primary mb-2">{formatHours(result.hoursFreedPerYear)}</div>
            <p className="font-body text-sm text-muted-foreground">Hours Freed Per Year</p>
          </div>
          <div className="ql-card p-6 md:p-8 text-center">
            <TrendingUp className="h-5 w-5 text-primary mx-auto mb-4" />
            <div className="metric-display text-primary mb-2">{result.roiPercent}%</div>
            <p className="font-body text-sm text-muted-foreground">First-Year ROI</p>
          </div>
        </div>

        {/* Projection Chart */}
        <div className="ql-card p-6 md:p-8">
          <h2 className="font-display text-xl font-medium text-foreground mb-1">12-Month Recovery Projection</h2>
          <p className="font-body text-xs text-muted-foreground mb-6">
            Based on {result.adminStaff} staff member{result.adminStaff > 1 ? "s" : ""}, 
            {" "}{result.hoursPerWeek} hours/week of manual tasks, at ${result.loadedHourlyRate}/hr true cost
          </p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyProjection} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="savingsGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.38 0.06 55)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="oklch(0.38 0.06 55)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.008 80)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Inter" }} tickFormatter={(v) => `Mo ${v}`} />
              <YAxis tick={{ fontSize: 11, fontFamily: "Inter" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} labelFormatter={(l) => `Month ${l}`} />
              <Area type="monotone" dataKey="savings" name="Savings" stroke="oklch(0.38 0.06 55)" fill="url(#savingsGrad2)" strokeWidth={2} />
              <Area type="monotone" dataKey="cost" name="Investment" stroke="oklch(0.80 0.04 80)" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Net Savings Callout */}
        <div className="ql-card p-6 md:p-8 border-l-4 border-primary bg-accent/30">
          <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-2">Net Annual Benefit After Scale OS Investment</p>
          <div className="metric-display text-primary">{formatCurrency(netSavings)}</div>
          <p className="font-body text-sm text-muted-foreground mt-3 leading-relaxed">
            This represents money that stays in your business — not spent on administrative overhead that could be automated.
          </p>
        </div>

        {/* CTA */}
        <div className="ql-card p-6 md:p-8 bg-primary text-primary-foreground text-center">
          <h2 className="font-display text-2xl font-medium mb-3">Ready to Restore Your Margins?</h2>
          <p className="font-body text-sm opacity-90 mb-6 max-w-md mx-auto">
            Scale OS is built specifically for South Bay businesses navigating California's labor environment. 
            Let's build your implementation plan.
          </p>
          <Link href="/concierge">
            <Button variant="secondary" size="lg" className="font-body font-medium touch-target">
              Speak with Our AI Advisor
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

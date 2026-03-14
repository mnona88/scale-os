import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from "recharts";
import { ArrowRight, DollarSign, Clock, TrendingUp, Share2, Mail } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const businessTypes = [
  { value: "clinic", label: "Medical / Aesthetic Clinic" },
  { value: "realestate", label: "Real Estate Brokerage" },
  { value: "retail", label: "Retail / Boutique" },
  { value: "restaurant", label: "Restaurant / Hospitality" },
  { value: "general", label: "Other Business" },
];

const LOADED_RATE_OPTIONS = [
  { value: 25, label: "$25/hr (Minimum)" },
  { value: 27.5, label: "$27.50/hr (Average)" },
  { value: 30, label: "$30/hr (Full Burden)" },
];

type SimResult = {
  token: string;
  annualSavings: number;
  netSavings: number;
  hoursFreedPerYear: number;
  roiPercent: number;
  monthlyProjection: Array<{ month: number; savings: number; cost: number; net: number }>;
  timeBreakdown: Array<{ name: string; value: number; fill: string }>;
  totalHoursPerYear: number;
};

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

const formatHours = (v: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(v);

export default function Simulator() {
  const [adminStaff, setAdminStaff] = useState(2);
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [businessType, setBusinessType] = useState("general");
  const [loadedRate, setLoadedRate] = useState(27.5);
  const [result, setResult] = useState<SimResult | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [, navigate] = useLocation();

  const calculate = trpc.simulator.calculate.useMutation({
    onSuccess: (data) => setResult(data),
    onError: () => toast.error("Calculation failed. Please try again."),
  });

  const saveContact = trpc.simulator.saveContact.useMutation({
    onSuccess: () => {
      toast.success("Your results have been saved. We'll be in touch.");
      setEmailOpen(false);
    },
    onError: () => toast.error("Could not save. Please try again."),
  });

  const handleCalculate = () => {
    calculate.mutate({ adminStaff, hoursPerWeek, businessType, loadedHourlyRate: loadedRate });
  };

  const handleCopyLink = () => {
    if (!result) return;
    const url = `${window.location.origin}/results/${result.token}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard.");
    setShareOpen(false);
  };

  const handleSaveEmail = () => {
    if (!result || !ownerEmail) return;
    saveContact.mutate({ token: result.token, ownerEmail, ownerName, businessName });
  };

  const CHART_COLORS = {
    primary: "oklch(0.38 0.06 55)",
    secondary: "oklch(0.66 0.06 55)",
    muted: "oklch(0.88 0.008 80)",
    cost: "oklch(0.80 0.04 80)",
  };

  return (
    <div className="page-enter">
      {/* Header */}
      <section className="border-b border-border/40 bg-card">
        <div className="container py-10 md:py-14">
          <p className="font-body text-xs tracking-widest uppercase text-primary mb-4">Profit Restoration Simulator</p>
          <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-3">
            What is California's wage environment
            <br className="hidden md:block" /> actually costing you?
          </h1>
          <p className="font-body text-muted-foreground max-w-xl">
            Enter your current staffing details below. We'll calculate your true annual cost — and what you could recover.
          </p>
        </div>
      </section>

      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Input Panel */}
          <div className="lg:col-span-2 space-y-8">
            <div className="ql-card p-6 md:p-8 space-y-8">
              {/* Business Type */}
              <div className="space-y-3">
                <Label className="font-body text-sm font-medium text-foreground">Your Business Type</Label>
                <div className="grid grid-cols-1 gap-2">
                  {businessTypes.map((bt) => (
                    <button
                      key={bt.value}
                      onClick={() => setBusinessType(bt.value)}
                      className={`text-left px-4 py-3 rounded-lg border text-sm font-body transition-all duration-150 touch-target ${
                        businessType === bt.value
                          ? "border-primary bg-accent text-accent-foreground font-medium"
                          : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                      }`}
                    >
                      {bt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Staff */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-body text-sm font-medium text-foreground">Administrative Staff</Label>
                  <span className="metric-display text-2xl text-primary">{adminStaff}</span>
                </div>
                <Slider
                  min={1} max={20} step={1}
                  value={[adminStaff]}
                  onValueChange={([v]) => setAdminStaff(v)}
                  className="touch-target"
                />
                <div className="flex justify-between text-xs text-muted-foreground font-body">
                  <span>1 person</span>
                  <span>20 people</span>
                </div>
              </div>

              {/* Hours Per Week */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="font-body text-sm font-medium text-foreground">Manual Task Hours / Week</Label>
                  <span className="metric-display text-2xl text-primary">{hoursPerWeek}h</span>
                </div>
                <Slider
                  min={2} max={60} step={1}
                  value={[hoursPerWeek]}
                  onValueChange={([v]) => setHoursPerWeek(v)}
                  className="touch-target"
                />
                <div className="flex justify-between text-xs text-muted-foreground font-body">
                  <span>2 hrs</span>
                  <span>60 hrs</span>
                </div>
                <p className="text-xs text-muted-foreground font-body">
                  Includes: email triage, scheduling, data entry, document prep, follow-ups
                </p>
              </div>

              {/* Loaded Rate */}
              <div className="space-y-3">
                <Label className="font-body text-sm font-medium text-foreground">True Hourly Cost (with taxes & benefits)</Label>
                <div className="grid grid-cols-3 gap-2">
                  {LOADED_RATE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setLoadedRate(opt.value)}
                      className={`px-3 py-2.5 rounded-lg border text-xs font-body transition-all duration-150 touch-target ${
                        loadedRate === opt.value
                          ? "border-primary bg-accent text-accent-foreground font-medium"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleCalculate}
                disabled={calculate.isPending}
                size="lg"
                className="w-full font-body font-medium touch-target"
              >
                {calculate.isPending ? "Calculating..." : "Calculate My Recovery"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Assumptions note */}
            <p className="text-xs text-muted-foreground font-body px-1 leading-relaxed">
              Calculations based on California minimum wage ($16.90/hr), typical loaded cost of ${loadedRate}/hr, 
              and Scale OS's average 68% automation rate across administrative functions.
            </p>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3 space-y-6">
            {!result ? (
              <div className="ql-card p-12 flex flex-col items-center justify-center text-center min-h-80 gap-4">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="font-display text-2xl font-light text-foreground">Your results will appear here</h3>
                <p className="font-body text-sm text-muted-foreground max-w-xs">
                  Adjust the inputs on the left and tap "Calculate My Recovery" to see your personalized profit analysis.
                </p>
              </div>
            ) : (
              <div className="space-y-6 page-enter">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="ql-card p-6 text-center">
                    <DollarSign className="h-5 w-5 text-primary mx-auto mb-3" />
                    <div className="metric-display text-primary mb-1">{formatCurrency(result.annualSavings)}</div>
                    <p className="font-body text-xs text-muted-foreground">Annual Cost Recovered</p>
                  </div>
                  <div className="ql-card p-6 text-center">
                    <Clock className="h-5 w-5 text-primary mx-auto mb-3" />
                    <div className="metric-display text-primary mb-1">{formatHours(result.hoursFreedPerYear)}</div>
                    <p className="font-body text-xs text-muted-foreground">Hours Freed Per Year</p>
                  </div>
                  <div className="ql-card p-6 text-center">
                    <TrendingUp className="h-5 w-5 text-primary mx-auto mb-3" />
                    <div className="metric-display text-primary mb-1">{result.roiPercent}%</div>
                    <p className="font-body text-xs text-muted-foreground">First-Year ROI</p>
                  </div>
                </div>

                {/* Monthly Projection Chart */}
                <div className="ql-card p-6">
                  <h3 className="font-display text-lg font-medium text-foreground mb-1">12-Month Recovery Projection</h3>
                  <p className="font-body text-xs text-muted-foreground mb-6">Net savings grow as automation matures in your business</p>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={result.monthlyProjection} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.008 80)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Inter" }} tickFormatter={(v) => `Mo ${v}`} />
                      <YAxis tick={{ fontSize: 11, fontFamily: "Inter" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: number) => formatCurrency(v)} labelFormatter={(l) => `Month ${l}`} />
                      <Area type="monotone" dataKey="savings" name="Savings" stroke={CHART_COLORS.primary} fill="url(#savingsGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="cost" name="Investment" stroke={CHART_COLORS.cost} fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Before/After Bar + Time Donut */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Before/After */}
                  <div className="ql-card p-6">
                    <h3 className="font-display text-base font-medium text-foreground mb-1">Annual Labor Cost</h3>
                    <p className="font-body text-xs text-muted-foreground mb-4">Before vs. after automation</p>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart
                        data={[
                          { name: "Today", cost: Math.round(result.totalHoursPerYear * loadedRate) },
                          { name: "With Scale OS", cost: Math.round(result.totalHoursPerYear * loadedRate * (1 - 0.68)) },
                        ]}
                        margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.008 80)" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fontFamily: "Inter" }} />
                        <YAxis tick={{ fontSize: 11, fontFamily: "Inter" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(v: number) => formatCurrency(v)} />
                        <Bar dataKey="cost" name="Annual Cost" radius={[4, 4, 0, 0]}>
                          <Cell fill={CHART_COLORS.cost} />
                          <Cell fill={CHART_COLORS.primary} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Time Donut */}
                  <div className="ql-card p-6">
                    <h3 className="font-display text-base font-medium text-foreground mb-1">Your Time, Reclaimed</h3>
                    <p className="font-body text-xs text-muted-foreground mb-4">Annual hours breakdown</p>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={result.timeBreakdown}
                          cx="50%" cy="50%"
                          innerRadius={45} outerRadius={70}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {result.timeBreakdown.map((entry, index) => (
                            <Cell key={index} fill={index === 0 ? CHART_COLORS.primary : CHART_COLORS.muted} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => `${formatHours(v)} hrs`} />
                        <Legend
                          formatter={(value) => <span style={{ fontFamily: "Inter", fontSize: 11 }}>{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Net Savings Callout */}
                <div className="ql-card p-6 border-l-4 border-primary bg-accent/30">
                  <p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-2">Net Annual Benefit</p>
                  <div className="metric-display text-primary">{formatCurrency(result.netSavings)}</div>
                  <p className="font-body text-sm text-muted-foreground mt-2">
                    After Scale OS investment of $3,000/month — money that stays in your business.
                  </p>
                </div>

                {/* Share Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 font-body font-medium bg-card touch-target"
                    onClick={() => setShareOpen(true)}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share These Results
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 font-body font-medium bg-card touch-target"
                    onClick={() => setEmailOpen(true)}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email Me This Report
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={shareOpen} onOpenChange={setShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-medium">Share Your Results</DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              Copy the link below to review your profit analysis anytime.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg border border-border">
              <code className="flex-1 text-xs font-body text-foreground truncate">
                {result ? `${window.location.origin}/results/${result.token}` : ""}
              </code>
            </div>
            <Button onClick={handleCopyLink} className="w-full font-body font-medium touch-target">
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-medium">Save Your Report</DialogTitle>
            <DialogDescription className="font-body text-sm text-muted-foreground">
              Enter your details and we'll preserve your personalized profit analysis.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label className="font-body text-sm">Your Name</Label>
              <Input
                placeholder="Jane Smith"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="font-body touch-target"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Business Name</Label>
              <Input
                placeholder="Smith & Associates"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="font-body touch-target"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm">Email Address</Label>
              <Input
                type="email"
                placeholder="jane@yourbusiness.com"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="font-body touch-target"
              />
            </div>
            <Button
              onClick={handleSaveEmail}
              disabled={!ownerEmail || saveContact.isPending}
              className="w-full font-body font-medium touch-target"
            >
              {saveContact.isPending ? "Saving..." : "Save My Results"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

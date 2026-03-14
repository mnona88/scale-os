import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Printer, CheckCircle2, AlertCircle } from "lucide-react";

type Step = {
  title: string;
  description: string;
  details: string[];
  note?: string;
};

type Section = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  steps: Step[];
};

const sections: Section[] = [
  {
    id: "odoo-setup",
    title: "Setting Up Odoo Studio",
    subtitle: "Your no-code command center — drag, drop, done.",
    icon: "01",
    steps: [
      {
        title: "Access Odoo Studio",
        description: "Open your Odoo dashboard and activate Studio mode.",
        details: [
          "Log in to your Odoo account at your company's Odoo URL",
          "In the top-right corner, click the grid icon (⊞) to open the App menu",
          "Find and click 'Studio' — it looks like a paintbrush icon",
          "If you don't see Studio, contact your Odoo administrator to enable it for your account",
        ],
      },
      {
        title: "Customize Your Customer Intake Form",
        description: "Drag and drop fields to capture the information your business needs.",
        details: [
          "Inside Studio, navigate to the module you want to customize (e.g., CRM, Appointments, or Contacts)",
          "Click 'Edit' to enter design mode — you'll see a panel of field types on the left",
          "Drag any field type (Text, Date, Dropdown, etc.) onto your form",
          "Click a field to rename it — use plain language your team understands",
          "Drag fields to reorder them. Put the most important fields at the top",
          "Click 'Save' when done. Changes apply immediately — no technical deployment needed",
        ],
        note: "If a field type you need isn't visible, scroll down in the left panel. All common field types are available without any coding.",
      },
      {
        title: "Create an Automated Email Response",
        description: "Set up Odoo to automatically reply to new inquiries — 24/7.",
        details: [
          "Go to Settings → Technical → Automation → Automated Actions",
          "Click 'New' to create a new automation rule",
          "Name it clearly: e.g., 'New Patient Inquiry — Auto Reply'",
          "Set 'Model' to the record type you want to trigger on (e.g., Lead/Opportunity for CRM)",
          "Set 'When' to 'Record Creation'",
          "Under 'Action', select 'Send Email'",
          "Choose or create an email template. Write your message in plain English — no code required",
          "Click 'Save' then 'Enable'. Test it by creating a sample record",
        ],
      },
    ],
  },
  {
    id: "customer-automation",
    title: "Automating Customer Interactions",
    subtitle: "Your AI handles inquiries while you focus on what matters.",
    icon: "02",
    steps: [
      {
        title: "Set Up the AI Response Agent",
        description: "Connect Scale OS's AI to your customer-facing channels.",
        details: [
          "Log in to your Scale OS dashboard (provided by Mika after onboarding)",
          "Navigate to 'Channels' and click 'Add New Channel'",
          "Select your channel type: Website Chat, Email, or Phone",
          "Paste your business information into the 'Business Profile' section — the AI learns from this",
          "Set your business hours. The AI automatically handles after-hours inquiries",
          "Click 'Activate Channel' — your AI is now live",
        ],
      },
      {
        title: "Customize AI Responses for Your Business",
        description: "Teach the AI to sound like your brand — warm, professional, and knowledgeable.",
        details: [
          "In Scale OS, go to 'AI Settings' → 'Response Style'",
          "Choose your tone: Professional, Warm & Friendly, or Concierge (recommended for high-end businesses)",
          "Add your most common FAQs in the 'Knowledge Base' section — type them in plain language",
          "Upload your service menu, pricing guide, or product catalog as a PDF — the AI reads it automatically",
          "Set 'Escalation Rules': specify when the AI should transfer to a human (e.g., complaints, large orders)",
          "Preview responses by typing test questions in the 'Test Your AI' panel",
        ],
        note: "You don't need to write scripts or code. The AI adapts its responses based on the context of each conversation.",
      },
      {
        title: "Connect to Your Appointment System",
        description: "Let customers book directly through the AI — no back-and-forth required.",
        details: [
          "In Scale OS, go to 'Integrations' → 'Calendar & Scheduling'",
          "Select your calendar system (Google Calendar, Outlook, or Odoo Calendar)",
          "Click 'Connect' and follow the authorization prompts (this takes about 2 minutes)",
          "Set your available appointment slots and buffer times",
          "The AI will now offer real-time booking to customers during conversations",
          "New appointments automatically appear in your calendar and trigger confirmation emails",
        ],
      },
    ],
  },
  {
    id: "inventory-sync",
    title: "Inventory & Operations Sync",
    subtitle: "Your systems talk to each other — automatically.",
    icon: "03",
    steps: [
      {
        title: "Connect Odoo Inventory to Your Sales Channels",
        description: "Keep stock levels accurate across all your sales points without manual updates.",
        details: [
          "In Odoo, go to Inventory → Configuration → Warehouses",
          "Ensure your warehouse is set up with your physical location",
          "Go to Sales → Configuration → Settings → enable 'Inventory Warnings'",
          "Set reorder rules: Inventory → Operations → Replenishment → New",
          "Define minimum stock levels for each product. Odoo alerts you automatically when stock runs low",
          "Connect your e-commerce store via Odoo's built-in WooCommerce or Shopify connector (Settings → Technical → Connectors)",
        ],
      },
      {
        title: "Set Up Low-Stock Alerts",
        description: "Get notified before you run out — never lose a sale to empty shelves.",
        details: [
          "In Odoo Inventory, select a product and click 'Edit'",
          "Set the 'Minimum Quantity' field to your reorder point",
          "Under 'Reordering Rules', set your preferred vendor and order quantity",
          "Enable 'Email Alerts' to receive notifications when stock hits the minimum",
          "Odoo will automatically generate purchase orders for approval — you just click 'Approve'",
        ],
      },
    ],
  },
  {
    id: "compliance",
    title: "Compliance Management",
    subtitle: "California labor law, handled automatically.",
    icon: "04",
    steps: [
      {
        title: "Set Up Compliance Tracking in Odoo",
        description: "Track required documentation, certifications, and labor law requirements.",
        details: [
          "In Odoo, go to Employees → Configuration → Employee Tags",
          "Create tags for compliance categories: 'SB 553 Training', 'Safety Certification', 'I-9 Verified'",
          "Assign tags to each employee record",
          "Set expiration dates on certifications using the 'Activity' feature on each employee record",
          "Odoo will send automatic reminders 30 days before any certification expires",
        ],
      },
      {
        title: "Automate Compliance Reminders",
        description: "Never miss a deadline — the system tracks it for you.",
        details: [
          "Go to Settings → Technical → Automation → Automated Actions",
          "Create a new rule: 'Model' = Employee, 'When' = Based on a date (certification expiry)",
          "Set the action to send an email to the HR manager and the employee",
          "Set reminder timing: 30 days before, 7 days before, and on the day",
          "This covers: food handler cards, safety training, harassment prevention (AB 1825), and more",
        ],
        note: "California SB 553 requires a written Workplace Violence Prevention Plan. Store this document in Odoo's Document module and set an annual review reminder.",
      },
    ],
  },
  {
    id: "manus-support",
    title: "Requesting Manus Support",
    subtitle: "When you need a technical fix — here's exactly what to say.",
    icon: "05",
    steps: [
      {
        title: "How to Submit a Fix Request to Manus",
        description: "Use this template to get fast, accurate technical help.",
        details: [
          "Open a new conversation with Manus",
          "Start with: 'I need a fix for my Scale OS application.'",
          "Describe WHAT is broken: 'The profit simulator is not saving results when I click the button.'",
          "Describe WHAT YOU EXPECTED: 'I expected to see a confirmation message and a shareable link.'",
          "Describe WHAT HAPPENED INSTEAD: 'Nothing happened — no message, no link appeared.'",
          "Include WHEN it started: 'This started after I changed the number of staff to 5.'",
          "If possible, include a screenshot by attaching an image to the message",
        ],
        note: "You do NOT need to understand the technical cause. Describe the problem from your perspective as a user — Manus handles the rest.",
      },
      {
        title: "Template: Manus Fix Request",
        description: "Copy and fill in this template for any technical issue.",
        details: [
          "SUBJECT: Scale OS Fix Request — [Brief Description]",
          "WHAT IS BROKEN: [Describe the feature or button that isn't working]",
          "WHAT I EXPECTED: [Describe what should have happened]",
          "WHAT HAPPENED: [Describe what actually happened]",
          "STEPS TO REPRODUCE: [List the steps you took before the problem appeared]",
          "URGENCY: [High — demo in X hours / Medium — within 24 hours / Low — when convenient]",
          "SCREENSHOT: [Attach if possible]",
        ],
      },
    ],
  },
];

function SopSection({ section }: { section: Section }) {
  const [isOpen, setIsOpen] = useState(section.id === "odoo-setup");
  const [openSteps, setOpenSteps] = useState<Set<number>>(new Set([0]));

  const toggleStep = (i: number) => {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="ql-card overflow-hidden">
      {/* Section Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-6 md:p-8 text-left hover:bg-secondary/30 transition-colors touch-target"
      >
        <span className="font-display text-3xl font-light text-primary/40 flex-shrink-0 w-10">{section.icon}</span>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl md:text-2xl font-medium text-foreground">{section.title}</h2>
          <p className="font-body text-sm text-muted-foreground mt-0.5">{section.subtitle}</p>
        </div>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>

      {/* Steps */}
      {isOpen && (
        <div className="border-t border-border/40">
          {section.steps.map((step, i) => (
            <div key={i} className="border-b border-border/40 last:border-0">
              <button
                onClick={() => toggleStep(i)}
                className="w-full flex items-start gap-4 px-6 md:px-8 py-5 text-left hover:bg-secondary/20 transition-colors touch-target"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent flex items-center justify-center mt-0.5">
                  <span className="font-body text-xs font-medium text-accent-foreground">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-body text-sm font-medium text-foreground">{step.title}</h3>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{step.description}</p>
                </div>
                {openSteps.has(i) ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                )}
              </button>

              {openSteps.has(i) && (
                <div className="px-6 md:px-8 pb-6 space-y-3">
                  <ol className="space-y-2.5 ml-10">
                    {step.details.map((detail, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="font-body text-sm text-foreground leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ol>
                  {step.note && (
                    <div className="ml-10 flex items-start gap-3 bg-accent/40 rounded-lg p-4">
                      <AlertCircle className="h-4 w-4 text-accent-foreground flex-shrink-0 mt-0.5" />
                      <p className="font-body text-xs text-accent-foreground leading-relaxed">{step.note}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sop() {
  return (
    <div className="page-enter">
      {/* Header */}
      <section className="border-b border-border/40 bg-card">
        <div className="container py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-body text-xs tracking-widest uppercase text-primary mb-4">Implementation Guide</p>
              <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-3">
                Mika's No-Code
                <br />Playbook
              </h1>
              <p className="font-body text-muted-foreground max-w-xl">
                Step-by-step instructions for deploying AI automation in your clients' businesses. 
                No technical background required — just follow the steps.
              </p>
            </div>
            <Button
              variant="outline"
              className="font-body font-medium bg-card touch-target flex-shrink-0"
              onClick={() => window.print()}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print Guide
            </Button>
          </div>

          {/* Quick Reference */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="px-3 py-2 rounded-lg border border-border bg-secondary/50 hover:border-primary/50 hover:bg-accent/30 transition-all text-center touch-target"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="font-body text-xs text-muted-foreground">{s.title.split(" ")[0]}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SOP Sections */}
      <div className="container py-10 md:py-16 space-y-4 max-w-4xl mx-auto">
        {sections.map((section) => (
          <div key={section.id} id={section.id}>
            <SopSection section={section} />
          </div>
        ))}

        {/* Footer Note */}
        <div className="ql-card p-6 md:p-8 bg-primary text-primary-foreground">
          <h3 className="font-display text-xl font-medium mb-3">Remember: You Are Not Alone</h3>
          <p className="font-body text-sm leading-relaxed opacity-90">
            This guide covers the most common implementation scenarios. For anything not covered here, 
            or if something doesn't work as expected, use the Manus support template in Section 05. 
            Manus handles all technical fixes — your job is to describe what you see, not diagnose the cause.
          </p>
        </div>
      </div>
    </div>
  );
}

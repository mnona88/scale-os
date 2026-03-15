import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { X, Mail, Phone, Building2, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: ContactModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err) => {
      toast.error("Something went wrong. Please email us directly at m.nonaka@akanon-intl.com");
      console.error(err);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    submitMutation.mutate(form);
  };

  const handleClose = () => {
    setForm({ name: "", email: "", phone: "", businessName: "", message: "" });
    setSubmitted(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-light text-foreground mb-3">
              Message Received
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
              Mika will be in touch within one business day. You'll receive a confirmation at <strong>{form.email}</strong>.
            </p>
            <Button onClick={handleClose} className="font-body font-medium">
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="font-body text-xs tracking-widest uppercase text-primary mb-2">A-kanon International</p>
              <h2 className="font-display text-2xl font-light text-foreground">
                Schedule a Consultation
              </h2>
              <p className="font-body text-sm text-muted-foreground mt-2">
                Complimentary 15-minute call. We'll walk through your numbers.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Your name *"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email address *"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              {/* Phone */}
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              {/* Business Name */}
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Business name (optional)"
                  value={form.businessName}
                  onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              {/* Message */}
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                <textarea
                  placeholder="What's your biggest challenge right now? (optional)"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-md font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full font-body font-medium touch-target"
                disabled={submitMutation.isPending || !form.name || !form.email}
              >
                {submitMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-primary-foreground border-t-transparent animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

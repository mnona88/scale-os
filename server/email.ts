import { Resend } from "resend";

const OWNER_EMAIL = "m.nonaka@akanon-intl.com";
const FROM_ADDRESS = "Scale OS <onboarding@resend.dev>";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  return new Resend(apiKey);
}

/**
 * Send a contact inquiry notification to Mika.
 */
export async function sendContactNotification(params: {
  name: string;
  email: string;
  phone?: string;
  businessName?: string;
  message?: string;
}) {
  const resend = getResend();
  const { name, email, phone, businessName, message } = params;

  const body = `
New contact inquiry from Scale OS website

Name: ${name}
Email: ${email}
Phone: ${phone || "Not provided"}
Business: ${businessName || "Not provided"}
Message: ${message || "No message"}

Reply directly to this email to respond.
  `.trim();

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: [OWNER_EMAIL],
    replyTo: email,
    subject: `New Inquiry: ${name}${businessName ? ` — ${businessName}` : ""}`,
    text: body,
  });
}

/**
 * Send an appointment confirmation email to the prospect.
 */
export async function sendAppointmentConfirmation(params: {
  prospectName: string;
  prospectEmail: string;
  contactMethod: "phone" | "in-person" | "email";
  businessType?: string;
}) {
  const resend = getResend();
  const { prospectName, prospectEmail, contactMethod, businessType } = params;

  const methodText =
    contactMethod === "phone"
      ? "a phone call"
      : contactMethod === "in-person"
      ? "an in-person meeting"
      : "an email follow-up";

  const body = `
Dear ${prospectName},

Thank you for your interest in Scale OS. We look forward to connecting with you via ${methodText}.

Mika Nonaka from A-kanon International will be in touch shortly to confirm the details.

In the meantime, feel free to explore your personalized profit analysis at:
https://scaleos-krfdbrrv.manus.space/simulator

Warm regards,
Mika Nonaka
A-kanon International
Scale OS — Profit Recovery Suite
m.nonaka@akanon-intl.com
  `.trim();

  // Also notify Mika
  const mikaBody = `
Appointment request received

Prospect: ${prospectName}
Email: ${prospectEmail}
Preferred contact: ${methodText}
Business type: ${businessType || "Not specified"}

A confirmation email has been sent to ${prospectEmail}.
  `.trim();

  await Promise.all([
    resend.emails.send({
      from: FROM_ADDRESS,
      to: [prospectEmail],
      subject: "Your Scale OS Consultation — Next Steps",
      text: body,
    }),
    resend.emails.send({
      from: FROM_ADDRESS,
      to: [OWNER_EMAIL],
      subject: `Appointment Request: ${prospectName}`,
      text: mikaBody,
    }),
  ]);
}

/**
 * Lightweight connectivity test — just validates the API key.
 */
export async function validateResendKey(): Promise<boolean> {
  try {
    const resend = getResend();
    // Listing domains is a lightweight read-only call
    const result = await resend.domains.list();
    return !result.error;
  } catch {
    return false;
  }
}

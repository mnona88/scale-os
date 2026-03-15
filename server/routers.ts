import { z } from "zod";
import { nanoid } from "nanoid";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { saveSimulationResult, getSimulationByToken, updateSimulationEmail } from "./db";
import { sendContactNotification, sendAppointmentConfirmation } from "./email";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ── Profit Restoration Simulator ──────────────────────────────────────────
  simulator: router({
    calculate: publicProcedure
      .input(z.object({
        adminStaff: z.number().min(1).max(100),
        hoursPerWeek: z.number().min(1).max(80),
        businessType: z.string(),
        loadedHourlyRate: z.number().min(16.9).max(50).default(27.5),
      }))
      .mutation(async ({ input }) => {
        const { adminStaff, hoursPerWeek, businessType, loadedHourlyRate } = input;

        const automationRate = 0.68;
        const weeksPerYear = 52;

        const totalHoursPerYear = adminStaff * hoursPerWeek * weeksPerYear;
        const hoursFreedPerYear = Math.round(totalHoursPerYear * automationRate);
        const annualSavings = Math.round(hoursFreedPerYear * loadedHourlyRate);

        const monthlyInvestment = 3000;
        const annualInvestment = monthlyInvestment * 12;
        const netSavings = annualSavings - annualInvestment;
        const roiPercent = Math.round((netSavings / annualInvestment) * 100);

        const monthlyProjection = Array.from({ length: 12 }, (_, i) => {
          const rampFactor = Math.min(1, 0.4 + (i * 0.06));
          return {
            month: i + 1,
            savings: Math.round((annualSavings / 12) * rampFactor),
            cost: monthlyInvestment,
            net: Math.round((annualSavings / 12) * rampFactor) - monthlyInvestment,
          };
        });

        const timeBreakdown = [
          { name: "Reclaimed for Growth", value: hoursFreedPerYear, fill: "var(--color-chart-1)" },
          { name: "Remaining Manual Work", value: Math.round(totalHoursPerYear * (1 - automationRate)), fill: "var(--color-chart-4)" },
        ];

        const token = nanoid(16);

        await saveSimulationResult({
          token,
          businessType,
          adminStaff,
          hoursPerWeek,
          loadedHourlyRate,
          annualSavings,
          hoursFreedPerYear,
          roiPercent,
          createdAt: new Date(),
        });

        return {
          token,
          adminStaff,
          hoursPerWeek,
          businessType,
          loadedHourlyRate,
          annualSavings,
          netSavings,
          hoursFreedPerYear,
          roiPercent,
          monthlyProjection,
          timeBreakdown,
          totalHoursPerYear,
          automationRate,
        };
      }),

    getByToken: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        return await getSimulationByToken(input.token);
      }),

    saveContact: publicProcedure
      .input(z.object({
        token: z.string(),
        ownerEmail: z.string().email(),
        ownerName: z.string(),
        businessName: z.string(),
      }))
      .mutation(async ({ input }) => {
        await updateSimulationEmail(input.token, input.ownerEmail, input.ownerName, input.businessName);
        return { success: true };
      }),
  }),

  // ── Contact Form ──────────────────────────────────────────────────────────
  contact: router({
    submit: publicProcedure
      .input(z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        businessName: z.string().optional(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await sendContactNotification(input);
        return { success: true };
      }),

    sendAppointment: publicProcedure
      .input(z.object({
        prospectName: z.string().min(1),
        prospectEmail: z.string().email(),
        contactMethod: z.enum(["phone", "in-person", "email"]),
        businessType: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await sendAppointmentConfirmation(input);
        return { success: true };
      }),
  }),

  // ── 24/7 AI Concierge ─────────────────────────────────────────────────────
  concierge: router({
    chat: publicProcedure
      .input(z.object({
        messages: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })),
        businessType: z.string().default("general"),
      }))
      .mutation(async ({ input }) => {
        const businessContextMap: Record<string, string> = {
          clinic: "a high-end medical or aesthetic clinic in the South Bay area of Los Angeles",
          realestate: "a boutique real estate brokerage serving Palos Verdes, Torrance, and the South Bay",
          retail: "a premium retail boutique or specialty store in the South Bay",
          restaurant: "an upscale restaurant or hospitality business in the South Bay",
          general: "a successful small-to-medium business in the South Bay area of Los Angeles",
        };

        const businessContext = businessContextMap[input.businessType] || businessContextMap.general;

        const systemPrompt = `You are a trusted business advisor for Scale OS, speaking with the owner of ${businessContext}.

Your role: Help this owner understand how intelligent automation can restore their profitability in the face of California's rising labor costs.

Tone: Warm, empathetic, and executive-level. You speak the language of profit, time, and peace of mind — never technical jargon.

Key facts you know:
- California minimum wage is $16.90/hour, but the true loaded cost (taxes, benefits, overhead) is $25–30/hour per employee
- SB 553 and other CA labor laws add significant compliance burden
- Scale OS automates: customer inquiries (24/7), appointment scheduling, follow-ups, document processing, inventory alerts, and compliance tracking
- Typical client result: 60–70% reduction in administrative labor costs within 90 days
- Scale OS investment: $2,000–$4,000/month depending on scope
- ROI is typically 3–5x in the first year
- Mika Nonaka at A-kanon International (m.nonaka@akanon-intl.com) is the advisor who will follow up

Appointment booking flow — follow this EXACTLY when the conversation naturally reaches a point where the owner expresses interest in learning more or taking next steps:

STEP 1: Ask how they prefer to connect:
"I'd love to set up a complimentary 15-minute consultation for you. What works best — a quick phone call, meeting in person here in the South Bay, or would you prefer I send you some information by email first?"

STEP 2: After they choose, ask for their email:
"Perfect. Could I get your email address so we can confirm the details and send you a summary?"

STEP 3: Once you have their email, confirm:
"Wonderful. I'll have Mika reach out to confirm everything. You'll receive a confirmation email shortly. Looking forward to showing you what's possible for your business."

IMPORTANT: Never say you will send an email or invitation unless the user has provided their email address in this conversation. Only after they share their email should you confirm that a message will be sent.

Keep responses concise — 3 to 5 sentences maximum. This is a live demo conversation.`;

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            ...input.messages,
          ],
        });

        const content = response.choices?.[0]?.message?.content ?? "";
        return { content };
      }),
  }),
});

export type AppRouter = typeof appRouter;

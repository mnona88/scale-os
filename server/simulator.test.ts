import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("simulator.calculate", () => {
  it("calculates annual savings correctly for 2 staff at 20hrs/week at $27.50/hr", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulator.calculate({
      adminStaff: 2,
      hoursPerWeek: 20,
      businessType: "clinic",
      loadedHourlyRate: 27.5,
    });

    // 2 staff × 20 hrs/week × 52 weeks = 2080 total hours/year
    // 2080 × 68% automation = 1414.4 → rounded to 1414 hours freed
    // 1414 × $27.50 = $38,885 annual savings
    expect(result.totalHoursPerYear).toBe(2080);
    expect(result.hoursFreedPerYear).toBe(1414);
    expect(result.annualSavings).toBe(38885);
    expect(result.token).toBeTruthy();
    expect(result.token.length).toBe(16);
  });

  it("returns a 12-month projection array", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulator.calculate({
      adminStaff: 1,
      hoursPerWeek: 10,
      businessType: "retail",
      loadedHourlyRate: 25,
    });

    expect(result.monthlyProjection).toHaveLength(12);
    expect(result.monthlyProjection[0].month).toBe(1);
    expect(result.monthlyProjection[11].month).toBe(12);
    // Later months should have higher savings due to ramp-up
    expect(result.monthlyProjection[11].savings).toBeGreaterThan(result.monthlyProjection[0].savings);
  });

  it("calculates ROI correctly", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulator.calculate({
      adminStaff: 5,
      hoursPerWeek: 40,
      businessType: "realestate",
      loadedHourlyRate: 30,
    });

    // Net savings = annualSavings - (3000 × 12)
    const annualInvestment = 3000 * 12;
    const expectedNet = result.annualSavings - annualInvestment;
    const expectedRoi = Math.round((expectedNet / annualInvestment) * 100);

    expect(result.netSavings).toBe(expectedNet);
    expect(result.roiPercent).toBe(expectedRoi);
  });

  it("generates a unique token for each calculation", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const [r1, r2] = await Promise.all([
      caller.simulator.calculate({ adminStaff: 1, hoursPerWeek: 5, businessType: "general", loadedHourlyRate: 25 }),
      caller.simulator.calculate({ adminStaff: 1, hoursPerWeek: 5, businessType: "general", loadedHourlyRate: 25 }),
    ]);

    expect(r1.token).not.toBe(r2.token);
  });

  it("returns a time breakdown with two segments", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.simulator.calculate({
      adminStaff: 3,
      hoursPerWeek: 15,
      businessType: "restaurant",
      loadedHourlyRate: 27.5,
    });

    expect(result.timeBreakdown).toHaveLength(2);
    expect(result.timeBreakdown[0].name).toBe("Reclaimed for Growth");
    expect(result.timeBreakdown[1].name).toBe("Remaining Manual Work");
    // Total should equal original hours
    const total = result.timeBreakdown.reduce((sum, t) => sum + t.value, 0);
    expect(total).toBe(result.totalHoursPerYear);
  });
});

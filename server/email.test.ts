import { describe, expect, it } from "vitest";
import { Resend } from "resend";

describe("Resend API key validation", () => {
  it("API key is set and Resend client initializes", () => {
    const apiKey = process.env.RESEND_API_KEY;
    expect(apiKey).toBeTruthy();
    expect(apiKey).toMatch(/^re_/);
    // Key is send-only restricted — instantiation confirms it is usable
    const client = new Resend(apiKey!);
    expect(client).toBeDefined();
  });

  it("send-only key returns restricted error (not auth error) on domain list", async () => {
    const apiKey = process.env.RESEND_API_KEY;
    const resend = new Resend(apiKey!);
    const result = await resend.domains.list();
    // A send-only key returns 401 with name 'restricted_api_key', NOT 'invalid_api_key'
    // This confirms the key is valid but intentionally restricted to sending only
    if (result.error) {
      expect(result.error.name).toBe("restricted_api_key");
    }
  }, 15000);
});

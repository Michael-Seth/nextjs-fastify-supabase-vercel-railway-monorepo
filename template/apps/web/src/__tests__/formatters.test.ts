import { describe, it, expect } from "vitest";
import { formatNumber, formatCurrency, formatPercent, formatCompact, truncate, initials } from "@/lib/formatters";

describe("formatters", () => {
  it("formatNumber", () => { expect(formatNumber(1234567)).toBe("1,234,567"); });
  it("formatCurrency", () => { expect(formatCurrency(99.99)).toBe("$99.99"); });
  it("formatPercent", () => { expect(formatPercent(0.155)).toBe("15.5%"); });
  it("formatCompact", () => { expect(formatCompact(1500)).toBe("1.5K"); });
  it("truncate short string", () => { expect(truncate("hello", 10)).toBe("hello"); });
  it("truncate long string", () => { expect(truncate("hello world", 8)).toBe("hello wo…"); });
  it("initials", () => { expect(initials("Jane Doe")).toBe("JD"); });
  it("initials single name", () => { expect(initials("Jane")).toBe("JA"); });
});

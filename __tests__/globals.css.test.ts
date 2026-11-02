import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const cssPath = path.resolve(__dirname, "../app/globals.css");
const cssContent = fs.readFileSync(cssPath, "utf-8");

describe("globals.css – @keyframes float animation", () => {
  it("defines the @keyframes float rule", () => {
    expect(cssContent).toMatch(/@keyframes\s+float\s*\{/);
  });

  it("keyframe at 0% sets transform to translateY(0px)", () => {
    // Check that 0% block contains translateY(0px)
    expect(cssContent).toMatch(/0%[\s\S]*?translateY\(0px\)/);
  });

  it("keyframe at 50% sets transform to translateY(-10px)", () => {
    expect(cssContent).toMatch(/50%[\s\S]*?translateY\(-10px\)/);
  });

  it("keyframe at 100% sets transform to translateY(0px)", () => {
    // 100% and 0% share the same block: "0%, 100%"
    expect(cssContent).toMatch(/100%[\s\S]*?translateY\(0px\)/);
  });

  it("0% and 100% keyframes are grouped together", () => {
    // The PR defined them as "0%, 100% { ... }"
    expect(cssContent).toMatch(/0%,\s*\n?\s*100%\s*\{/);
  });

  it("float animation uses the transform property", () => {
    const floatBlock = cssContent.match(/@keyframes\s+float\s*\{([\s\S]*?)\}\s*(?:\n|$)/);
    expect(floatBlock).not.toBeNull();
    expect(floatBlock![1]).toContain("transform");
  });

  it("@keyframes float block is closed properly", () => {
    // The block must open and close with matching braces
    const floatMatch = cssContent.match(/@keyframes\s+float\s*\{([\s\S]*?)\n\}/);
    expect(floatMatch).not.toBeNull();
  });

  it("globals.css file ends with a newline (no missing newline at EOF)", () => {
    expect(cssContent.endsWith("\n")).toBe(true);
  });
});
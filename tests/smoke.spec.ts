import { test, expect } from "@playwright/test";

test.describe("Birdeye Sprint Radar Smoke Tests", () => {
  test("home page loads and shows radar title", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Birdeye Token Radar/i })).toBeVisible();
  });

  test("submission page loads and shows endpoints", async ({ page }) => {
    await page.goto("/submission");
    await expect(page.getByText(/Birdeye endpoints/i)).toBeVisible();
    await expect(page.getByText("/defi/token_trending", { exact: true })).toBeVisible();
    await expect(page.getByText("/v2/tokens/new_listing", { exact: true })).toBeVisible();
    await expect(page.getByText("/defi/token_security", { exact: true })).toBeVisible();
  });

  test("home page has responsive layout", async ({ page }) => {
    await page.goto("/");
    // Wait for page to be interactive
    await page.waitForLoadState("networkidle").catch(() => {});
    // Check that the main content area exists
    const main = page.locator("main");
    await expect(main).toBeVisible();
  });
});

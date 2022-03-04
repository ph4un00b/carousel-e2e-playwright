// @no-check
const { test, expect, devices } = require("@playwright/test");

test.use({
  ...devices["iPhone 11 landscape"],
});

test.describe("Tablet Carousel", () => {
  test("markup should be visible.", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await expect(page.locator("#carousel")).toBeVisible();
    await expect(page.locator("text=<")).toBeVisible();
    await expect(page.locator(".carousel-image")).toBeVisible();
    await expect(page.locator("text=>")).toBeVisible();
    await expect(page.locator("text=Featured Boxes")).toBeVisible();
    await expect(page.locator(".carousel-title")).toBeVisible();
    await expect(page.locator(".carousel-description")).toBeVisible();
    await expect(page.locator("text=Learn how it works")).toBeVisible();
    await expect(page.locator("text=or View available boxes")).toBeVisible();
  });

});

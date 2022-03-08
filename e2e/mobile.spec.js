// @no-check
const { test, expect, devices } = require("@playwright/test");

test.use({
  ...devices["iPhone 11"],
});

test.describe("Mobile Carousel", () => {
  test("markup should be visible.", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await expect(page.locator("#carousel")).toBeVisible();
    await expect(page.locator("text=<")).toBeVisible();
    await expect(page.locator(".carousel-image")).toBeVisible();
    await expect(page.locator("text=>")).toBeVisible();
    await expect(page.locator(".carousel-title")).toBeVisible();
    await expect(page.locator(".carousel-description")).toBeVisible();
    await expect(page.locator("text=Learn how it works")).toBeVisible();
    await expect(page.locator("text=or View available boxes")).toBeVisible();
    await expect(page.locator("text=Featured Boxes")).toBeHidden();
  });

  test("controls", async ({ page }) => {
    // Go to http://localhost:3000/static/
    await page.goto("http://localhost:3000/static/");
    // Click text=Alchemy
    await expect(page.locator("text=Alchemy")).toBeVisible();
    // Click text=Stock your home bar with pro-level cocktail wares.
    await expect(
      page.locator("text=Stock your home bar with pro-level cocktail wares."),
    ).toBeVisible();
    // Click [aria-label="product\:\ Alchemy"] >> text=>
    await page.locator("#next-0").click();
    // Click h1:has-text("Aged")
    await expect(page.locator('h1:has-text("Aged")')).toBeVisible();
    // Click text=A toast to the perfectly aged cocktail.
    await expect(page.locator("text=A toast to the perfectly aged cocktail."))
      .toBeVisible();
    // Click [aria-label="product\:\ Aged"] >> text=>
    await page.locator("#next-1").click();
    // Click text=Refresh
    await expect(page.locator("text=Refresh")).toBeVisible();
    // Click text=Bring some class to your morning routine.
    await expect(page.locator("text=Bring some class to your morning routine."))
      .toBeVisible();
    // Click [aria-label="product\:\ Refresh"] >> text=>
    await page.locator("#next-2").click();
    // Click text=Weekender
    await expect(page.locator("text=Weekender")).toBeVisible();
    // Click text=Don't just get away from the crowds — stand out from them.
    await expect(
      page.locator(
        "text=Don't just get away from the crowds — stand out from them.",
      ),
    ).toBeVisible();
    // Click [aria-label="product\:\ Weekender"] >> text=>
    await page.locator("#next-3").click();
    // Click text=Alchemy
    await expect(page.locator("text=Alchemy")).toBeVisible();
    // Click text=Stock your home bar with pro-level cocktail wares.
    await expect(
      page.locator("text=Stock your home bar with pro-level cocktail wares."),
    ).toBeVisible();
    // Click [aria-label="product\:\ Alchemy"] >> text=<
    await page.locator("#back-0").click();
    await expect(
      page.locator(
        "text=Don't just get away from the crowds — stand out from them.",
      ),
    ).toBeVisible();
    // Click [aria-label="product\:\ Weekender"] >> text=<
    await page.locator("#back-3").click();
    await expect(page.locator("text=Bring some class to your morning routine."))
      .toBeVisible();
    // Click [aria-label="product\:\ Refresh"] >> text=<
    await page.locator("#back-2").click();
    await expect(page.locator("text=A toast to the perfectly aged cocktail."))
      .toBeVisible();
    // Click [aria-label="product\:\ Aged"] >> text=<
    await page.locator("#back-1").click();
    await expect(
      page.locator("text=Stock your home bar with pro-level cocktail wares."),
    ).toBeVisible();
    // Click [aria-label="product\:\ Alchemy"] >> text=<
    await page.locator("#back-0").click();
    await expect(page.locator("text=A toast to the perfectly aged cocktail."))
      .toBeVisible();
    // Click [aria-label="product\:\ Aged"] >> text=<
    await expect(page.locator('[aria-label="product\\:\\ Aged"] >> text=<'))
      .toBeVisible();
  });
});

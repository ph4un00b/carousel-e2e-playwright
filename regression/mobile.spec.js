// @no-check
const { test, expect, devices } = require("@playwright/test");

test.use({
  ...devices["iPhone 11"],
});

test.describe("Mobile Carousel", () => {
  test("look and feel.", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    expect(await page.screenshot()).toMatchSnapshot("mobile-carousel.png");
  });
});

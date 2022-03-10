// @no-check
const { test, expect, devices } = require("@playwright/test");

test.use({
  ...devices["iPhone 11"],
});

test.describe("Mobile Carousel", () => {
  test("static look and feel.", async ({ page }) => {
    await page.goto("http://localhost:3000/static/", {
      waitUntil: "networkidle",
    });

    expect(await page.screenshot()).toMatchSnapshot(
      "mobile-carousel.png",
    );
  });

  test("dynamic look and feel.", async ({ page }) => {
    await page.goto("http://localhost:3000/dynamic/", {
      waitUntil: "networkidle",
    });

    expect(await page.screenshot()).toMatchSnapshot(
      "mobile-carousel.png",
    );
  });
});

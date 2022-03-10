// @no-check
const { test, expect, devices } = require("@playwright/test");

test.use({
  ...devices["iPhone 11 landscape"],
});

test.describe("Tablet Carousel", () => {
  test("static look and feel.", async ({ page }) => {
    await page.goto("http://localhost:3000/static/", {
      waitUntil: "networkidle",
    });

    expect(await page.screenshot()).toMatchSnapshot(
      "tablet-carousel.png",
    );
  });

  test("dynamic look and feel.", async ({ page }) => {
    await page.goto("http://localhost:3000/dynamic/", {
      waitUntil: "networkidle",
    });

    expect(await page.screenshot()).toMatchSnapshot(
      "tablet-carousel.png",
    );
  });
});

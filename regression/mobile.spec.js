// @no-check
const { test, expect, devices } = require("@playwright/test");

test.use({
  ...devices["iPhone 11"],
});

test.describe("Mobile Carousel", () => {
  test("static look and feel.", async ({ page }) => {
    await page.goto("/modules/static/", {
      waitUntil: "networkidle",
    });

    expect(await page.screenshot({ omitBackground: true })).toMatchSnapshot(
      "mobile-carousel.png",
    );
  });

  test("dynamic look and feel.", async ({ page }) => {
    await page.goto("/modules/dynamic/", {
      waitUntil: "networkidle"
    });

    expect(await page.screenshot({ omitBackground: true })).toMatchSnapshot(
      "mobile-carousel.png",
    );
  });

  test("component look and feel.", async ({ page }) => {
    await page.goto("/modules/component/", {
      waitUntil: "networkidle"
    });

    expect(await page.screenshot({ omitBackground: true })).toMatchSnapshot(
      "mobile-carousel.png",
    );
  });
});

// @no-check
const { test, expect, devices } = require("@playwright/test");

test.use({
  ...devices["iPad Pro 11 landscape"],
});

test.describe("Desktop Carousel", () => {
  test("static look and feel.", async ({ page }) => {
    await page.goto("/modules/static/", {
      waitUntil: "networkidle",
    });

    // expect(await page.screenshot({ mask: [page.locator(".carousel-image")]})).toMatchSnapshot(
    expect(await page.screenshot({ omitBackground: true })).toMatchSnapshot(
      "desktop-carousel.png",
    );
  });

  test("dynamic look and feel.", async ({ page }) => {
    await page.goto("/modules/dynamic/", {
      waitUntil: "networkidle",
    });

    expect(await page.screenshot({ omitBackground: true })).toMatchSnapshot(
      "desktop-carousel.png",
    );
  });

  test("component look and feel.", async ({ page }) => {
    await page.goto("/modules/component/", {
      waitUntil: "networkidle",
    });

    expect(await page.screenshot({ omitBackground: true })).toMatchSnapshot(
      "desktop-carousel.png",
    );
  });
});

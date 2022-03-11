// @no-check
const { test, expect, devices } = require("@playwright/test");

test.use({
  ...devices["iPad Pro 11 landscape"],
});

test.describe("Desktop Carousel", () => {
  test("static look and feel.", async ({ page }) => {
    await page.goto("http://localhost:3000/static/", {
      waitUntil: "networkidle",
    });

    // expect(await page.screenshot({ mask: [page.locator(".carousel-image")]})).toMatchSnapshot(
    expect(await page.screenshot({ omitBackground: true })).toMatchSnapshot(
      "desktop-carousel.png",
    );
  });

  test("dynamic look and feel.", async ({ page }) => {
    await page.goto("http://localhost:3000/dynamic/", {
      waitUntil: "networkidle",
    });

    expect(await page.screenshot({ omitBackground: true })).toMatchSnapshot(
      "desktop-carousel.png",
    );
  });
});

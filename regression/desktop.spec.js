// @no-check
const { test, expect, devices } = require("@playwright/test");

test.use({
  ...devices["iPad Pro 11 landscape"],
});

test.describe("Desktop Carousel", () => {
  test("look and feel.", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    expect(await page.screenshot()).toMatchSnapshot("desktop-carousel.png");
  });
});

// @no-check
const { test, expect, devices } = require("@playwright/test");
const {
  expect_static_controls,
  expect_dynamic_controls,
  expect_common_markup,
} = require("./shared");

test.use({
  ...devices["iPad Pro 11 landscape"],
});

test.describe("Desktop Carousel", () => {
  test("static markup should be visible.", async ({ page }) => {
    await page.goto("/modules/static/", {
      waitUntil: "networkidle",
    });

    await expect_common_markup(page);
    await expect(page.locator("text=Featured Boxes")).toBeVisible();
  });

  test("dynamic markup should be visible.", async ({ page }) => {
    await page.goto("/modules/dynamic/", {
      waitUntil: "networkidle",
    });

    await expect_common_markup(page);
    await expect(page.locator("text=Featured Boxes")).toBeVisible();
  });

  test("static controls", async ({ page }) => {
    await page.goto("/modules/static/", {
      waitUntil: "networkidle",
    });

    await expect_static_controls(page);
  });

  test("dynamic controls", async ({ page }) => {
    await page.goto("/modules/dynamic/", {
      waitUntil: "networkidle",
    });

    await expect_dynamic_controls(page);
  });
});

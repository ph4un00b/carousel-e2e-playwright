// @no-check
const { test, expect, devices } = require("@playwright/test");
const {
  expect_common_markup,
  expect_static_controls,
  expect_dynamic_controls,
} = require("./shared");

test.use({
  ...devices["iPhone 11"],
});

test.describe("Mobile Carousel", () => {
  test("static markup should be visible.", async ({ page }) => {
    await page.goto("/modules/static/", {
      waitUntil: "networkidle",
    });

    await expect_common_markup(page);
    await expect(page.locator("text=Featured Boxes")).toBeHidden();
  });

  test("static controls", async ({ page }) => {
    await page.goto("/modules/static/", {
      waitUntil: "networkidle",
    });

    await expect_static_controls(page);
  });

  test("dynamic markup should be visible.", async ({ page }) => {
    await page.goto("/modules/dynamic/", {
      waitUntil: "networkidle",
    });

    await expect_common_markup(page);
    await expect(page.locator("text=Featured Boxes")).toBeHidden();
  });

  test("dynamic controls", async ({ page }) => {
    await page.goto("/modules/dynamic/", {
      waitUntil: "networkidle",
    });

    await expect_dynamic_controls(page);
  });

  test("component markup should be visible.", async ({ page }) => {
    await page.goto("/modules/component/", {
      waitUntil: "networkidle",
    });

    await expect_common_markup(page);
    await expect(page.locator("text=Featured Boxes")).toBeHidden();
  });

  test("component controls", async ({ page }) => {
    await page.goto("/modules/component/", {
      waitUntil: "networkidle",
    });

    await expect_dynamic_controls(page);
  });
});

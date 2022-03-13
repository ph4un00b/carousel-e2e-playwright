// @no-check
const { test, expect, devices } = require("@playwright/test");
const {
  expect_common_markup,
  expect_static_controls,
  expect_dynamic_controls,
} = require("./shared");
`
`;
test.use({
  ...devices["iPhone 11 landscape"],
});

test.describe("Tablet Carousel", () => {
  test("static markup should be visible.", async ({ page }) => {
    await page.goto("http://localhost:3000/static/", {
      waitUntil: "networkidle",
    });

    await expect_common_markup(page);
    await expect(page.locator("text=Featured Boxes")).toBeVisible();
  });

  test("dynamic markup should be visible.", async ({ page }) => {
    await page.goto("http://localhost:3000/dynamic/", {
      waitUntil: "networkidle",
    });

    await expect_common_markup(page);
    await expect(page.locator("text=Featured Boxes")).toBeVisible();
  });

  test("static controls", async ({ page }) => {
    await page.goto("http://localhost:3000/static/", {
      waitUntil: "networkidle",
    });

    await expect_static_controls(page);
  });

  test("dynamic controls", async ({ page }) => {
    await page.goto("http://localhost:3000/dynamic/", {
      waitUntil: "networkidle",
    });

    await expect_dynamic_controls(page);
  });
});

// @no-check
const { expect } = require("@playwright/test");

async function expect_dynamic_controls(page) {
  // Click text=Alchemy
  await expect(page.locator("text=Alchemy")).toBeVisible();
  // Click text=Stock your home bar with pro-level cocktail wares.
  await expect(
    page.locator("text=Stock your home bar with pro-level cocktail wares."),
  ).toBeVisible();
  // Click [aria-label="product\:\ Alchemy"] >> text=>
  await page.locator("text=>").click();
  // Click h1:has-text("Aged")
  await expect(page.locator('h1:has-text("Aged")')).toBeVisible();
  // Click text=A toast to the perfectly aged cocktail.
  await expect(page.locator("text=A toast to the perfectly aged cocktail."))
    .toBeVisible();
  // Click [aria-label="product\:\ Aged"] >> text=>
  await page.locator("text=>").click();
  // Click text=Refresh
  await expect(page.locator("text=Refresh")).toBeVisible();
  // Click text=Bring some class to your morning routine.
  await expect(page.locator("text=Bring some class to your morning routine."))
    .toBeVisible();
  // Click [aria-label="product\:\ Refresh"] >> text=>
  await page.locator("text=>").click();
  // Click text=Weekender
  await expect(page.locator("text=Weekender")).toBeVisible();
  // Click text=Don't just get away from the crowds — stand out from them.
  await expect(
    page.locator(
      "text=Don't just get away from the crowds — stand out from them.",
    ),
  ).toBeVisible();
  // Click [aria-label="product\:\ Weekender"] >> text=>
  await page.locator("text=>").click();
  // Click text=Alchemy
  await expect(page.locator("text=Alchemy")).toBeVisible();
  // Click text=Stock your home bar with pro-level cocktail wares.
  await expect(
    page.locator("text=Stock your home bar with pro-level cocktail wares."),
  ).toBeVisible();
  // Click [aria-label="product\:\ Alchemy"] >> text=<
  await page.locator("text=<").click();
  await expect(
    page.locator(
      "text=Don't just get away from the crowds — stand out from them.",
    ),
  ).toBeVisible();
  // Click [aria-label="product\:\ Weekender"] >> text=<
  await page.locator("text=<").click();
  await expect(page.locator("text=Bring some class to your morning routine."))
    .toBeVisible();
  // Click [aria-label="product\:\ Refresh"] >> text=<
  await page.locator("text=<").click();
  await expect(page.locator("text=A toast to the perfectly aged cocktail."))
    .toBeVisible();
  // Click [aria-label="product\:\ Aged"] >> text=<
  await page.locator("text=<").click();
  await expect(
    page.locator("text=Stock your home bar with pro-level cocktail wares."),
  ).toBeVisible();
  // Click [aria-label="product\:\ Alchemy"] >> text=<
  await page.locator("text=<").click();
  await expect(page.locator("text=A toast to the perfectly aged cocktail."))
    .toBeVisible();
  // Click [aria-label="product\:\ Aged"] >> text=<
  await expect(page.locator('[aria-label="product\\:\\ Aged"] >> text=<'))
    .toBeVisible();
}

async function expect_static_controls(page) {
  // Click text=Alchemy
  await expect(page.locator("text=Alchemy")).toBeVisible();
  // Click text=Stock your home bar with pro-level cocktail wares.
  await expect(
    page.locator("text=Stock your home bar with pro-level cocktail wares."),
  ).toBeVisible();
  // Click [aria-label="product\:\ Alchemy"] >> text=>
  await page.locator("text=>").click();
  // Click h1:has-text("Aged")
  await expect(page.locator('h1:has-text("Aged")')).toBeVisible();
  // Click text=A toast to the perfectly aged cocktail.
  await expect(page.locator("text=A toast to the perfectly aged cocktail."))
    .toBeVisible();
  // Click [aria-label="product\:\ Aged"] >> text=>
  await page.locator("text=>").click();
  // Click text=Refresh
  await expect(page.locator("text=Refresh")).toBeVisible();
  // Click text=Bring some class to your morning routine.
  await expect(page.locator("text=Bring some class to your morning routine."))
    .toBeVisible();
  // Click [aria-label="product\:\ Refresh"] >> text=>
  await page.locator("text=>").click();
  // Click text=Weekender
  await expect(page.locator("text=Weekender")).toBeVisible();
  // Click text=Don't just get away from the crowds — stand out from them.
  await expect(
    page.locator(
      "text=Don't just get away from the crowds — stand out from them.",
    ),
  ).toBeVisible();
  // Click [aria-label="product\:\ Weekender"] >> text=>
  await page.locator("text=>").click();
  // Click text=Alchemy
  await expect(page.locator("text=Alchemy")).toBeVisible();
  // Click text=Stock your home bar with pro-level cocktail wares.
  await expect(
    page.locator("text=Stock your home bar with pro-level cocktail wares."),
  ).toBeVisible();
  // Click [aria-label="product\:\ Alchemy"] >> text=<
  await page.locator("text=<").click();
  await expect(
    page.locator(
      "text=Don't just get away from the crowds — stand out from them.",
    ),
  ).toBeVisible();
  // Click [aria-label="product\:\ Weekender"] >> text=<
  await page.locator("text=<").click();
  await expect(page.locator("text=Bring some class to your morning routine."))
    .toBeVisible();
  // Click [aria-label="product\:\ Refresh"] >> text=<
  await page.locator("text=<").click();
  await expect(page.locator("text=A toast to the perfectly aged cocktail."))
    .toBeVisible();
  // Click [aria-label="product\:\ Aged"] >> text=<
  await page.locator("text=<").click();
  await expect(
    page.locator("text=Stock your home bar with pro-level cocktail wares."),
  ).toBeVisible();
  // Click [aria-label="product\:\ Alchemy"] >> text=<
  await page.locator("text=<").click();
  await expect(page.locator("text=A toast to the perfectly aged cocktail."))
    .toBeVisible();
  // Click [aria-label="product\:\ Aged"] >> text=<
  await expect(page.locator('[aria-label="product\\:\\ Aged"] >> text=<'))
    .toBeVisible();
}

async function expect_common_markup(page) {
  await expect(page.locator("html")).toHaveClass(/webp/);
  await expect(page.locator("text=<")).toBeVisible();
  await expect(page.locator("text=>")).toBeVisible();
  await expect(page.locator("#carousel")).toBeVisible();
  await expect(page.locator(".item-name")).toBeVisible();
  await expect(page.locator(".carousel-image")).toBeVisible();
  await expect(page.locator(".item-description")).toBeVisible();
  await expect(page.locator("text=Learn how it works")).toBeVisible();
  await expect(page.locator("text=or View available boxes")).toBeVisible();
}

module.exports = {
  expect_static_controls,
  expect_dynamic_controls,
  expect_common_markup,
};

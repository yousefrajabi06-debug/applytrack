import { test, expect } from "@playwright/test";
test("application lifecycle, stage movement, search, follow-ups and persistence", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add application" }).click();
  await page.getByLabel("Company", { exact: true }).fill("Demo Company");
  await page.getByLabel("Role", { exact: true }).fill("Junior Developer");
  await page.getByLabel("Follow-up date (optional)").fill("2020-01-01");
  await page.getByRole("button", { name: "Save application" }).click();
  await page
    .getByRole("combobox", { name: "Stage for Demo Company", exact: true })
    .selectOption("Interview");
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Stage for Demo Company", exact: true }),
  ).toHaveValue("Interview");
  await page
    .getByRole("button", { name: "Follow-ups due", exact: true })
    .click();
  await expect(page.locator(".application-card")).toHaveCount(1);
  await page.getByLabel("Search applications").fill("missing");
  await expect(page.locator(".application-card")).toHaveCount(0);
  await page.getByLabel("Search applications").fill("");
  await page.getByRole("button", { name: "Edit Demo Company" }).click();
  await page.getByLabel("Role", { exact: true }).fill("React Intern");
  await page.getByRole("button", { name: "Save application" }).click();
  await expect(
    page.getByRole("heading", { name: "React Intern" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Delete Demo Company" }).click();
  await page
    .getByRole("button", { name: "Delete application", exact: true })
    .click();
  await expect(page.locator(".application-card")).toHaveCount(0);
});
test("unsafe links are rejected", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Add application" }).click();
  await page.getByLabel("Company", { exact: true }).fill("Demo");
  await page.getByLabel("Role", { exact: true }).fill("Intern");
  await page.getByLabel("Job link (optional)").fill("javascript:alert(1)");
  await page.getByRole("button", { name: "Save application" }).click();
  await expect(page.getByRole("alert")).toContainText("http or https");
});
test("mobile board is readable without horizontal overflow", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Load sample applications" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

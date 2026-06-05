import { test, expect, Page } from "@playwright/test";
import { LoginPage } from "../../page/AuthPages/LoginPage";
import { env } from "../../config/env";
import { users } from "../../fixtures/users";

test.describe.configure({ mode: "serial" });

test.describe("Authentication", () => {
  test("should display login page", async ({ page }: { page: Page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoPage();
    await loginPage.verifyPageLoaded();
  });

  users.forEach(({ role, expectedText }) => {
    test(`should login successfully as ${role}`, async ({
      page,
    }: {
      page: Page;
    }) => {
      const loginPage = new LoginPage(page);
      await loginPage.gotoPage();
      await loginPage.login(role);
      await expect(page.getByText(expectedText)).toBeVisible();
    });
  });

  test("should show error for invalid credentials", async ({
    page,
  }: {
    page: Page;
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoPage();
    await loginPage.loginWithCredentials(env.ADMIN_EMAIL, env.MEMBER_PASSWORD);
    await loginPage.expectLoginError();
  });

  test("should show error for empty credentials", async ({
    page,
  }: {
    page: Page;
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoPage();
    await loginPage.clickLogin();

    await loginPage.expectEmailError("Invalid email address");
    await loginPage.expectPasswordError("Password is required");
  });

  test("should show error for invalid email format", async ({
    page,
  }: {
    page: Page;
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoPage();
    await loginPage.fillLogin(env.INVALID_EMAIL, env.ADMIN_PASSWORD);
    await loginPage.expectEmailError("Invalid email address");
  });

  test("should show error for wrong password", async ({
    page,
  }: {
    page: Page;
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoPage();
    await loginPage.loginWithCredentials(env.ADMIN_EMAIL, env.INVALID_PASSWORD);
    await loginPage.expectLoginError();
  });

  test("should show error for non-existent user", async ({
    page,
  }: {
    page: Page;
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoPage();
    await loginPage.loginWithCredentials(
      env.NONEXISTENT_EMAIL,
      env.ADMIN_PASSWORD,
    );
    await loginPage.expectLoginError();
  });

  test("should show error for empty email", async ({
    page,
  }: {
    page: Page;
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoPage();
    await loginPage.loginWithCredentials("", env.ADMIN_PASSWORD);
    await loginPage.expectEmailError("Invalid email address");
  });

  test("should show error for empty password", async ({
    page,
  }: {
    page: Page;
  }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoPage();
    await loginPage.loginWithCredentials(env.ADMIN_EMAIL, "");
    await loginPage.expectPasswordError("Password is required");
  });
});

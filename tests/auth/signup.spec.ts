import { test, expect, Page } from "@playwright/test";
import { SignupPage } from "../../page/AuthPages/SignupPage";
import { env } from "../../config/env";
import { generateUniqueEmail } from "../../utils/emailGenerator";

test.describe("Signup Page", () => {
  test("should load the signup page", async ({ page }: { page: Page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.gotoPage();
    await signupPage.verifyPageLoaded();
  });

  test("should allow user to register valid credentials", async ({
    page,
  }: {
    page: Page;
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.gotoPage();

    //generate unique email
    const uniqueEmail = generateUniqueEmail(env.BASE_EMAIL);

    await signupPage.register("Test User", uniqueEmail, "password123");
    await expect(page.getByText("Account created successfully")).toBeVisible();
    await expect(page).toHaveURL(/verify-email/);
  });

  test("should show error for duplicate email", async ({
    page,
  }: {
    page: Page;
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.gotoPage();
    await signupPage.register(
      "Test User",
      env.MANAGER_EMAIL,
      env.MANAGER_PASSWORD,
    );
    await expect(
      page.getByText("User already exists. Use another email"),
    ).toBeVisible();
  });

  test("should show error for empty credentials", async ({
    page,
  }: {
    page: Page;
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.gotoPage();
    await signupPage.clickRegister();

    await signupPage.expectNameError("Name is required");
    await signupPage.expectEmailError("Invalid email address");
    await signupPage.expectPasswordError("Password is required");
  });

  test("should show error when signup with invalid email", async ({
    page,
  }: {
    page: Page;
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.gotoPage();
    await signupPage.fillSignup(
      "Test User",
      env.INVALID_EMAIL,
      env.INVALID_PASSWORD,
    );
    await signupPage.expectEmailError("Invalid email address");
  });

  test("should show error when signup with short password and name", async ({
    page,
  }: {
    page: Page;
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.gotoPage();
    await signupPage.fillSignup("T", env.BASE_EMAIL, "short");
    await signupPage.expectNameError("Name must be at least 2 characters long");
    await signupPage.expectPasswordError(
      "Password must be at least 8 characters long",
    );
  });

  test("should redirect to verify email page after successful registration", async ({
    page,
  }: {
    page: Page;
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.gotoPage();

    //generate unique email
    const uniqueEmail = generateUniqueEmail(env.BASE_EMAIL);

    await signupPage.register("Test User", uniqueEmail, "password123");
    await expect(page).toHaveURL(/.*\/verify-email.*/);
    await expect(page.getByText("Verify Your Email")).toBeVisible();
  });

  test("should redirect to login page when click to signin link", async ({
    page,
  }: {
    page: Page;
  }) => {
    const signupPage = new SignupPage(page);
    await signupPage.gotoPage();
    await signupPage.clickSigninLink();
    await expect(page).toHaveURL(/login/);
  });
});

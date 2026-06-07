import { expect, Locator, Page } from "@playwright/test";

export class SignupPage {
  readonly page: Page;
  readonly form: Locator;
  readonly signinLink: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly nameError: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.locator("form");
    this.nameInput = this.form.getByRole("textbox", { name: "name" });
    this.emailInput = this.form.getByRole("textbox", { name: "email" });
    this.passwordInput = this.form.getByRole("textbox", { name: "password" });

    this.registerButton = this.form.getByRole("button", {
      name: "register",
    });

    this.signinLink = page.getByText("Already have an account?").locator("a");
    this.emailError = page.locator("#email-error");
    this.passwordError = page.locator("#password-error");
    this.nameError = page.locator("#name-error");
  }

  async gotoPage() {
    await this.page.goto("/register");
  }

  async verifyPageLoaded() {
    await expect(this.nameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.registerButton).toBeVisible();
  }

  async fillSignup(name: string, email: string, password: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async clickRegister() {
    await this.registerButton.click();
  }

  async clickSigninLink() {
    await this.signinLink.click();
  }

  async register(name: string, email: string, password: string) {
    await this.fillSignup(name, email, password);
    await this.clickRegister();
  }

  async verifySignupSuccess() {
    await expect(
      this.page.getByText("Account created successfully"),
    ).toBeVisible();
    await expect(this.page).toHaveURL(/.*\/verify-email.*/);
    await expect(this.page.getByText("Verify Your Email")).toBeVisible();
  }

  async expectNameError(message: string) {
    await expect(this.nameError).toHaveText(message);
  }

  async expectEmailError(message: string) {
    await expect(this.emailError).toHaveText(message);
  }

  async expectPasswordError(message: string) {
    await expect(this.passwordError).toHaveText(message);
  }
}

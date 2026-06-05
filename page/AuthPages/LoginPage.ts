import { expect, Locator, Page } from "@playwright/test";
import { usersCredentials, UserRole } from "../../fixtures/users";

export class LoginPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly emailError: Locator;
  readonly passwordError: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.getByRole("textbox", {
      name: "email",
    });

    this.passwordInput = page.getByRole("textbox", {
      name: "password",
    });

    this.loginButton = page.getByRole("button", {
      name: "login",
    });

    this.errorMessage = page.getByText("Invalid email or password");

    this.emailError = page.locator("#email-error");
    this.passwordError = page.locator("#password-error");
  }

  async gotoPage() {
    await this.page.goto("/login");
  }

  async verifyPageLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async fillLogin(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(role: UserRole) {
    const user = usersCredentials[role];

    await this.fillLogin(user.email, user.password);
    await Promise.all([
      this.page.waitForURL("**/dashboard"),
      this.clickLogin(),
    ]);
  }

  async loginWithCredentials(email: string, password: string) {
    await this.fillLogin(email, password);
    await this.clickLogin();
  }

  async expectLoginError() {
    await expect(this.errorMessage).toBeVisible();
  }

  async expectEmailError(message: string) {
    await expect(this.emailError).toHaveText(message);
  }
  async expectPasswordError(message: string) {
    await expect(this.passwordError).toHaveText(message);
  }
}

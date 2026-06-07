import { Page, Locator, expect } from "@playwright/test";

export class MemberPage {
  readonly page: Page;
  readonly overviewHeading: Locator;
  readonly addMemberButton: Locator;

  readonly modal: Locator;
  readonly modalHeading: Locator;
  readonly memberNameInput: Locator;
  readonly houseDropdownInput: Locator;
  readonly memberEmailInput: Locator;
  readonly saveButton: Locator;
  readonly VerfiyToastMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.overviewHeading = page.getByRole("heading", {
      name: "Members Overview",
    });
    this.addMemberButton = page.getByRole("button", { name: "Add Member" });

    this.modal = page.getByRole("dialog");

    this.modalHeading = this.modal.getByRole("heading", {
      name: "Add New Member",
    });

    this.memberNameInput = this.modal.getByRole("textbox", {
      name: /name/i,
    });

    this.houseDropdownInput = this.modal.getByRole("combobox").first();

    this.memberEmailInput = this.modal.getByRole("textbox", {
      name: /email/i,
    });

    this.saveButton = this.modal.getByRole("button", {
      name: "Add Member",
    });

    this.VerfiyToastMessage = page.locator("[data-sonner-toast]");
  }

  async gotoPage() {
    await this.page.goto("/manager/dashboard/members");
  }

  async verifyPageLoaded() {
    await expect(this.overviewHeading).toBeVisible();
    await expect(this.addMemberButton).toBeVisible();
    await expect(this.page).toHaveURL(/\/dashboard\/members$/);
  }

  async openAddMemberModal() {
    await this.addMemberButton.click();
    await expect(this.modal).toBeVisible();
    await expect(this.modalHeading).toBeVisible();
  }

  async verifyMemberMessage(message: string) {
    await expect(
      this.page.locator("[data-sonner-toast]").filter({ hasText: message }),
    ).toBeVisible();
  }

  async selectHouse(houseName: string) {
    const dropdown = this.modal.getByRole("combobox").first();

    await dropdown.click();

    await this.page.getByRole("option", { name: houseName }).click();
  }

  async addNewMember(name: string, email: string, house: string) {
    await this.openAddMemberModal();
    await this.memberNameInput.fill(name);
    await this.memberEmailInput.fill(email);
    await this.selectHouse(house);
    await this.saveButton.click();
  }

  async getMemberRow(name: string) {
    return this.page.getByRole("row").filter({
      has: this.page.getByText(name),
    });
  }

  async verifyFieldError(message: string) {
    return expect(this.modal.getByText(message, { exact: true })).toBeVisible();
  }
}

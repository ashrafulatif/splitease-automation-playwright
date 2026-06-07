import { expect, Locator, Page } from "@playwright/test";

export class HousePage {
  readonly page: Page;

  readonly overviewHeading: Locator;
  readonly addHouseButton: Locator;

  readonly houseHeader: Locator;
  readonly overviewHeader: Locator;
  readonly creatorHeader: Locator;
  readonly actionsHeader: Locator;

  readonly modal: Locator;
  readonly modalHeading: Locator;
  readonly houseNameInput: Locator;
  readonly descriptionInput: Locator;
  readonly saveButton: Locator;

  readonly VerfiyToastMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.overviewHeading = page.getByRole("heading", {
      name: "Houses Overview",
    });

    this.addHouseButton = page.getByRole("button", {
      name: "Add House",
    });

    this.houseHeader = page.getByRole("columnheader", {
      name: "House",
    });

    this.overviewHeader = page.getByRole("columnheader", {
      name: "Overview",
    });

    this.creatorHeader = page.getByRole("columnheader", {
      name: "Creator",
    });

    this.actionsHeader = page.getByRole("columnheader", {
      name: "Actions",
    });

    this.modal = page.getByRole("dialog");

    this.modalHeading = this.modal.getByRole("heading", {
      name: "Add New House",
    });

    this.houseNameInput = this.modal.getByRole("textbox", {
      name: /house/i,
    });

    this.descriptionInput = this.modal.getByRole("textbox", {
      name: /description/i,
    });

    this.saveButton = this.modal.getByRole("button", {
      name: "Save House",
    });

    this.VerfiyToastMessage = page.locator("[data-sonner-toast]");
  }

  async gotoPage() {
    await this.page.goto("/manager/dashboard/house");
  }

  async verifyPageLoaded() {
    await expect(this.overviewHeading).toBeVisible();
    await expect(this.addHouseButton).toBeVisible();

    await expect(this.houseHeader).toBeVisible();
    await expect(this.overviewHeader).toBeVisible();
    await expect(this.creatorHeader).toBeVisible();
    await expect(this.actionsHeader).toBeVisible();
    await expect(this.page).toHaveURL(/\/dashboard\/house$/);
  }

  async openAddHouseModal() {
    await this.addHouseButton.click();
    await expect(this.modal).toBeVisible();
    await expect(this.modalHeading).toBeVisible();
  }

  async createHouse(name: string, description: string) {
    await this.openAddHouseModal();

    await this.houseNameInput.fill(name);
    await this.descriptionInput.fill(description);

    await this.saveButton.click();
  }

  getHouseRow(name: string): Locator {
    return this.page.getByRole("row").filter({
      has: this.page.getByText(name),
    });
  }

  async verifyHouseExists(name: string) {
    await expect(this.getHouseRow(name)).toBeVisible();
  }

  async verifyHouseNotExists(name: string) {
    await expect(this.getHouseRow(name)).not.toBeVisible();
  }

  async verifyHouseMessage(message: string) {
    await expect(
      this.page.locator("[data-sonner-toast]").filter({ hasText: message }),
    ).toBeVisible();
  }

  async verifyFieldError(message: string) {
    await expect(this.modal.getByText(message)).toBeVisible();
  }
}

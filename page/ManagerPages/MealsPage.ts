import { Locator, Page, expect } from "@playwright/test";
import { generateDataUtil } from "../../utils/generateData";

export class MealsPage {
  readonly page: Page;

  readonly overviewHeading: Locator;
  readonly logMealButton: Locator;

  readonly modal: Locator;
  readonly modalHeading: Locator;

  readonly memberDropdown: Locator;
  readonly mealTypeDropdown: Locator;
  readonly dateInput: Locator;

  readonly saveButton: Locator;
  readonly toast: Locator;

  constructor(page: Page) {
    this.page = page;

    this.overviewHeading = page.getByRole("heading", {
      name: "Meal Entries",
    });

    this.logMealButton = page.getByRole("button", {
      name: "Log Meal",
    });

    this.modal = page.getByRole("dialog");

    this.modalHeading = this.modal.getByRole("heading", {
      name: "Log a New Meal",
    });

    this.memberDropdown = this.modal.getByRole("combobox").nth(2);
    this.mealTypeDropdown = this.modal.getByRole("combobox").nth(3);

    this.dateInput = this.modal.locator("#date");

    this.saveButton = this.modal.getByRole("button", {
      name: "Save Meal",
    });

    this.toast = page.locator("[data-sonner-toast]");
  }

  async gotoPage() {
    await this.page.goto("/manager/dashboard/meals");
  }

  async verifyPageLoaded() {
    await expect(this.overviewHeading).toBeVisible();
    await expect(this.logMealButton).toBeVisible();
  }

  async openLogMealModal() {
    await this.logMealButton.click();
    await expect(this.modal).toBeVisible();
    await expect(this.modalHeading).toBeVisible();
  }

  async submitMeal() {
    await this.saveButton.click();
  }

  async verifySuccessToast(message: string) {
    await expect(this.toast.filter({ hasText: message })).toBeVisible();
  }

  private getMemberCard(memberName: string): Locator {
    return this.page.locator(".bg-card").filter({
      has: this.page.locator("h3", { hasText: memberName }),
    });
  }

  async getMemberMealCount(memberName: string): Promise<number> {
    const card = this.getMemberCard(memberName);

    const badge = card.locator('[data-slot="badge"]');
    const text = await badge.innerText();

    return Number(text?.match(/\d+/)?.[0] || 0);
  }

  private async selectRandomOption(dropdown: Locator) {
    await dropdown.click();

    const options = this.page.getByRole("option");

    await expect(options.first()).toBeVisible();

    const count = await options.count();

    if (count === 0) {
      throw new Error("No dropdown options found");
    }

    const randomIndex = Math.floor(Math.random() * count);

    await options.nth(randomIndex).click();
  }

  async createRandomMeal() {
    await this.selectRandomOption(this.memberDropdown);
    await this.selectRandomOption(this.mealTypeDropdown);

    await this.dateInput.fill(generateDataUtil.generateRandomDate());

    await this.submitMeal();
  }
}

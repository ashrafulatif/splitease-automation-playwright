import test, { expect, Page } from "@playwright/test";
import { LoginPage } from "../../page/AuthPages/LoginPage";
import { UserRole } from "../../fixtures/users";
import { MealsPage } from "../../page/ManagerPages/MealsPage";

test.describe("Meals Management test flow", () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    const loginPage = new LoginPage(page);

    await test.step("Go to login page", async () => {
      await loginPage.gotoPage();
    });

    await test.step("Login as manager", async () => {
      await loginPage.login(UserRole.MANAGER);
    });
  });

  test("should display the meals Entries page", async ({ page }) => {
    const mealsPage = new MealsPage(page);

    await test.step("Navigate to meals page", async () => {
      await mealsPage.gotoPage();
    });

    await test.step("Verify page loaded correctly", async () => {
      await mealsPage.verifyPageLoaded();
    });
  });

  test("should display a modal when the log meal button is clicked", async ({
    page,
  }) => {
    const mealsPage = new MealsPage(page);

    await test.step("Navigate to meals page", async () => {
      await mealsPage.gotoPage();
    });

    await test.step("Open log meal modal", async () => {
      await mealsPage.openLogMealModal();
    });
  });

  test("should create a meal with default values", async ({ page }) => {
    const mealsPage = new MealsPage(page);

    await test.step("Navigate to meals page", async () => {
      await mealsPage.gotoPage();
    });

    await test.step("Open modal", async () => {
      await mealsPage.openLogMealModal();
    });

    let memberName: string;

    await test.step("Capture selected member", async () => {
      memberName = (await mealsPage.memberDropdown
        .locator("span")
        .textContent())!.trim();
    });

    let beforeCount: number;

    await test.step("Get initial meal count", async () => {
      beforeCount = await mealsPage.getMemberMealCount(memberName);
    });

    await test.step("Submit meal without changes", async () => {
      await mealsPage.submitMeal();
    });

    await test.step("Verify success message", async () => {
      await mealsPage.verifySuccessToast("Meal added successfully");
    });

    await test.step("Verify meal count increased for member", async () => {
      await expect
        .poll(async () => {
          return await mealsPage.getMemberMealCount(memberName);
        })
        .toBeGreaterThan(beforeCount);
    });
  });

  test("should create meal with random values", async ({ page }) => {
    const mealsPage = new MealsPage(page);

    await mealsPage.gotoPage();
    await mealsPage.openLogMealModal();

    //select member
    const selectedMember = await mealsPage.memberDropdown
      .locator("span")
      .textContent();

    const memberName = selectedMember?.trim();
    if (!memberName) throw new Error("Member name not found");

    //get prev meal count
    const beforeTotal = await mealsPage.getMemberMealCount(memberName);

    await mealsPage.createRandomMeal();

    await mealsPage.verifySuccessToast("Meal added successfully");

    await expect
      .poll(async () => {
        return await mealsPage.getMemberMealCount(memberName);
      })
      .toBeGreaterThan(beforeTotal);
  });
});

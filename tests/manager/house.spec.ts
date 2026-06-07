import { Page, test } from "@playwright/test";
import { LoginPage } from "../../page/AuthPages/LoginPage";
import { HousePage } from "../../page/ManagerPages/HousePage";
import { generateDataUtil } from "../../utils/generateData";
import { UserRole } from "../../fixtures/users";

test.describe.configure({ mode: "serial" });

test.describe("Manage House page test flow", () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.gotoPage();
    await loginPage.login(UserRole.MANAGER);
  });

  test("should display the house overview page", async ({ page }) => {
    const housePage = new HousePage(page);
    await housePage.gotoPage();
    await housePage.verifyPageLoaded();
  });

  test("should display a modal when the add house button is clicked", async ({
    page,
  }) => {
    const housePage = new HousePage(page);
    await housePage.gotoPage();
    await housePage.openAddHouseModal();
  });

  test("should create a new house successfully", async ({ page }) => {
    const housePage = new HousePage(page);
    await housePage.gotoPage();
    //gen uniqeu name
    const houseName = generateDataUtil.generateUniqueHouseName();
    const description = "Created by Playwright";
    await housePage.createHouse(houseName, description);
    await housePage.verifyHouseMessage("House created successfully");
    // verify row exists
    await housePage.verifyHouseExists(houseName);
  });

  test("should display an error while creating a house with empty fields", async ({
    page,
  }) => {
    const housePage = new HousePage(page);
    await housePage.gotoPage();
    await housePage.openAddHouseModal();
    await housePage.saveButton.click();
    await housePage.verifyFieldError("House name is required");
  });

  test("should show duplicate house name validation", async ({ page }) => {
    const housePage = new HousePage(page);
    await housePage.gotoPage();
    const existingHouse = generateDataUtil.generateUniqueHouseName();
    //create new house
    await housePage.createHouse(existingHouse, "Test");
    // test agin
    await housePage.createHouse(existingHouse, "Test");
    await housePage.verifyHouseMessage(
      "You already have a house with this name",
    );
  });

  test("should not create house with more than 20 characters", async ({
    page,
  }) => {
    const housePage = new HousePage(page);

    await housePage.gotoPage();
    await housePage.openAddHouseModal();
    //gen big name
    const longName = "A".repeat(21);
    await housePage.houseNameInput.fill(longName);
    await housePage.descriptionInput.fill("Test");
    await housePage.saveButton.click();
    await housePage.verifyFieldError("House name cannot exceed 20 characters");
    await housePage.verifyHouseNotExists(longName);
  });
});

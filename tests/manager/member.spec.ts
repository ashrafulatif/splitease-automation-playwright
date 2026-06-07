import { test, Page, expect } from "@playwright/test";
import { LoginPage } from "../../page/AuthPages/LoginPage";
import { UserRole } from "../../fixtures/users";
import { MemberPage } from "../../page/ManagerPages/MemberPage";
import { generateDataUtil } from "../../utils/generateData";
import { env } from "../../config/env";

test.describe("Manager - Member Management test flow", () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    const loginPage = new LoginPage(page);

    await test.step("Go to login page", async () => {
      await loginPage.gotoPage();
    });

    await test.step("Login as manager", async () => {
      await loginPage.login(UserRole.MANAGER);
    });
  });

  test("should display the member overview page", async ({ page }) => {
    const memberPage = new MemberPage(page);

    await test.step("Navigate to members page", async () => {
      await memberPage.gotoPage();
    });

    await test.step("Verify page loaded correctly", async () => {
      await memberPage.verifyPageLoaded();
    });
  });

  test("should display a modal when the add member button is clicked", async ({
    page,
  }) => {
    const memberPage = new MemberPage(page);

    await test.step("Navigate to members page", async () => {
      await memberPage.gotoPage();
    });

    await test.step("Open Add Member modal", async () => {
      await memberPage.openAddMemberModal();
    });
  });

  test("should add a new member successfully", async ({ page }) => {
    const memberPage = new MemberPage(page);

    const name = generateDataUtil.generateName();
    const email = generateDataUtil.generateUniqueEmail(env.BASE_EMAIL);

    await test.step("Navigate to members page", async () => {
      await memberPage.gotoPage();
    });

    await test.step("Open modal", async () => {
      await memberPage.openAddMemberModal();
    });

    await test.step("Fill form and submit", async () => {
      await memberPage.addNewMember(name, email, "Black House");
    });

    await test.step("Verify success", async () => {
      await memberPage.verifyMemberMessage(
        "Member added to house successfully. Check your email for credentials.",
      );
      await memberPage.getMemberRow(name);
    });
  });

  test("should display an error while creating a member with empty fields", async ({
    page,
  }) => {
    const memberPage = new MemberPage(page);

    await test.step("Go to members page and open modal", async () => {
      await memberPage.gotoPage();
      await memberPage.openAddMemberModal();
    });

    await test.step("Submit empty form", async () => {
      await memberPage.saveButton.click();
    });

    await test.step("Verify validation errors", async () => {
      await memberPage.verifyFieldError("Name is required");
      await memberPage.verifyFieldError("Valid email is required");
    });
  });

  test("should show duplicate member email validation", async ({ page }) => {
    const memberPage = new MemberPage(page);

    const name = generateDataUtil.generateName();
    const email = generateDataUtil.generateUniqueEmail(env.BASE_EMAIL);

    await test.step("Create first member", async () => {
      await memberPage.gotoPage();
      await memberPage.addNewMember(name, email, "Black House");
      await expect(memberPage.modal).toBeHidden();
      await memberPage.verifyMemberMessage(
        "Member added to house successfully. Check your email for credentials.",
      );
    });

    await test.step("Try duplicate member creation", async () => {
      await memberPage.addNewMember(name, email, "Black House");
    });

    await test.step("Verify duplicate email error", async () => {
      await memberPage.verifyMemberMessage(
        "User with this email already exists",
      );
    });
  });

  test("should show error while creating member with invalid email format", async ({
    page,
  }) => {
    const memberPage = new MemberPage(page);

    await test.step("Open modal and enter invalid email", async () => {
      await memberPage.gotoPage();
      await memberPage.openAddMemberModal();
      await memberPage.memberNameInput.fill("Test User");
      await memberPage.memberEmailInput.fill(env.INVALID_EMAIL);
    });

    await test.step("Verify validation error", async () => {
      await memberPage.verifyFieldError("Valid email is required");
    });
  });

  test("should show validation error when member name is less than 3 characters", async ({
    page,
  }) => {
    const memberPage = new MemberPage(page);

    await test.step("Open modal and enter invalid name", async () => {
      await memberPage.gotoPage();
      await memberPage.openAddMemberModal();
      await memberPage.memberNameInput.fill("Te");
      await memberPage.memberEmailInput.fill(
        generateDataUtil.generateUniqueEmail(env.BASE_EMAIL),
      );
    });

    await test.step("Submit and verify validation", async () => {
      await memberPage.saveButton.click();
      await memberPage.verifyFieldError("Name must be at least 3 characters");
    });
  });
});

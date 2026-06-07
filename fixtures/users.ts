import { env } from "../config/env";
export const usersCredentials = {
  admin: {
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
  },
  manager: {
    email: env.MANAGER_EMAIL,
    password: env.MANAGER_PASSWORD,
  },
  member: {
    email: env.MEMBER_EMAIL,
    password: env.MEMBER_PASSWORD,
  },
} as const;

export type UserRoleKey = keyof typeof usersCredentials;

export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  MEMBER = "member",
}

export const users = [
  {
    role: UserRole.ADMIN,
    expectedText: "Admin Overview",
  },
  {
    role: UserRole.MANAGER,
    expectedText: "Manager Dashboard",
  },
  {
    role: UserRole.MEMBER,
    expectedText: "Member Insights",
  },
];

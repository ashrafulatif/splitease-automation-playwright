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

export type UserRole = keyof typeof usersCredentials;

//ui asertion after login
export const users = [
  {
    role: "admin" as const,
    expectedText: "Admin Overview",
  },
  {
    role: "manager" as const,
    expectedText: "Manager Dashboard",
  },
  {
    role: "member" as const,
    expectedText: "Member Insights",
  },
];

declare const process: {
  env: Record<string, string | undefined>;
};

export const env = {
  BASE_URL: process.env.BASE_URL!,

  ADMIN_EMAIL: process.env.ADMIN_EMAIL!,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD!,

  MANAGER_EMAIL: process.env.MANAGER_EMAIL!,
  MANAGER_PASSWORD: process.env.MANAGER_PASSWORD!,

  MEMBER_EMAIL: process.env.MEMBER_EMAIL!,
  MEMBER_PASSWORD: process.env.MEMBER_PASSWORD!,

  INVALID_EMAIL: "invalidgmail.com",
  INVALID_PASSWORD: "wrongpass",
  NONEXISTENT_EMAIL: "jamespotter@gmail.com",
};

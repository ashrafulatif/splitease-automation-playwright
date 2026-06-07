const generateUniqueHouseName = (): string => {
  return `Test House ${Date.now()}`;
};

const generateUniqueEmail = (baseEmail: string): string => {
  const randomNumber = Math.floor(10 + Math.random() * 900);
  const [localPart, domain] = baseEmail.split("@");

  return `${localPart}${randomNumber}@${domain}`;
};

export const generateDataUtil = {
  generateUniqueHouseName,
  generateUniqueEmail,
};

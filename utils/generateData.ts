const generateUniqueHouseName = (): string => {
  return `Test House ${Date.now()}`;
};

const generateUniqueEmail = (baseEmail: string): string => {
  const randomNumber = Math.floor(10 + Math.random() * 900);
  const [localPart, domain] = baseEmail.split("@");

  return `${localPart}${randomNumber}@${domain}`;
};

const generateName = (): string => {
  const randomNameString = `Test Member ${Math.floor(1 + Math.random() * 100)}`;
  return randomNameString;
};

const generateRandomDate = (daysBack = 7): string => {
  const date = new Date();

  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));

  return date.toISOString().split("T")[0];
};

export const generateDataUtil = {
  generateUniqueHouseName,
  generateUniqueEmail,
  generateName,
  generateRandomDate,
};

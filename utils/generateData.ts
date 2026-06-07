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

export const generateDataUtil = {
  generateUniqueHouseName,
  generateUniqueEmail,
  generateName,
};

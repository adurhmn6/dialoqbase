import { PrismaClient } from "@prisma/client";

export const getInventory = async (prisma: PrismaClient, user_id: number) => {
  let inventory = await prisma.inventory.findUnique({
    where: {
      user_id,
    },
  });

  if (!inventory) {
    inventory = await prisma.inventory.create({
      data: {
        user_id,
      },
    });
  }

  return inventory;
};

export const getSettings = (prisma: PrismaClient) => {
  const settings = prisma.dialoqbaseSettings.findFirst({
    where: {
      id: 1,
    },
  });

  if (!settings) {
    const defaultSettings = prisma.dialoqbaseSettings.create({
      data: {
        id: 1,
        allowUserToCreateBots: true,
        allowUserToRegister: false,
        noOfBotsPerUser: 10,
      },
    });

    return defaultSettings;
  }

  return settings;
};

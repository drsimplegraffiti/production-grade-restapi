import prisma from "../db/connector";
import PasswordHelper from "./hash";
import logger from "./logger";

class Seed {
  async seedData() {
    let cycleCount = 11;

    const userCount = await prisma.user.count();
    if (userCount > 0) await prisma.user.deleteMany();

    for (let i = 1; i < cycleCount; i++) {
      await prisma.user.create({
        data: {
          email: `user-${i}@yopmail.com`,
          password: await PasswordHelper.hashPassword(`user-pass-${i}`),
          name: `user-${i}-name`,
        },
      });
    }
    logger.info("seeded");
  }
}

const seed = new Seed();
seed.seedData();

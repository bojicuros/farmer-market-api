import { prisma } from "../../src/utils/db.server";
import seedData from "./data.json";

async function seed() {
  try {
    await prisma.price.deleteMany();
    await prisma.userMarket.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.user.deleteMany();
    await prisma.role.deleteMany();
    await prisma.market.deleteMany();
    await prisma.product.deleteMany();

    await prisma.role.createMany({ data: seedData.roles });
    await prisma.user.createMany({ data: seedData.users });
    await prisma.userRole.createMany({ data: seedData.userRoles });
    await prisma.market.createMany({ data: seedData.markets });
    await prisma.userMarket.createMany({ data: seedData.userMarket });
    await prisma.product.createMany({ data: seedData.products });
    await prisma.price.createMany({ data: seedData.prices });

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
    // Number of users to backfill
    const numberOfUsers = 100; // Adjust as needed
  
    const userPromises = Array.from({ length: numberOfUsers }).map(() => {
      return prisma.user.create({
        data: {
          name: faker.name.fullName(),
          email: faker.internet.email(),
          phoneNumber: faker.phone.number(),
        },
      });
    });
  
    await Promise.all(userPromises);
    console.log(`${numberOfUsers} users have been backfilled.`);
  }

  main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
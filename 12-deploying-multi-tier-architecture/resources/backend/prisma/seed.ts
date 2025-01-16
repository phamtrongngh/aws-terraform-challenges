import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // create a sample user
  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      name: 'Admin',
      username: 'admin',
      password: bcrypt.hashSync('admin@123', 10),
    },
  });

  console.log({ user });

  // create two sample tasks
  const task1 = await prisma.task.upsert({
    where: { id: 1 },
    update: {
      userId: user.id,
    },
    create: {
      title: 'Meet with team',
      description: 'Meet with the team to discuss the project requirements',
      completed: false,
      userId: user.id,
    },
  });

  const task2 = await prisma.task.upsert({
    where: { id: 2 },
    update: {
      userId: user.id,
    },
    create: {
      title: 'Deploy a multi-tier architecture',
      description: 'Deploy a multi-tier architecture on AWS using AWS CDK',
      completed: false,
      userId: user.id,
    },
  });

  console.log({ task1, task2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });

import { PrismaClient } from '../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.gradeTransmutation.createMany({
    skipDuplicates: true,
    data: [
      { initialFrom: 80.0, initialTo: 80.0, transmutatedGrade: 100 },
      { initialFrom: 78.7, initialTo: 79.99, transmutatedGrade: 99 },
      { initialFrom: 77.4, initialTo: 78.69, transmutatedGrade: 98 },
      { initialFrom: 76.1, initialTo: 77.39, transmutatedGrade: 97 },
      { initialFrom: 74.8, initialTo: 76.09, transmutatedGrade: 96 },
      { initialFrom: 73.5, initialTo: 74.79, transmutatedGrade: 95 },
      { initialFrom: 72.2, initialTo: 73.49, transmutatedGrade: 94 },
      { initialFrom: 70.9, initialTo: 72.19, transmutatedGrade: 93 },
      { initialFrom: 69.6, initialTo: 70.89, transmutatedGrade: 92 },
      { initialFrom: 68.3, initialTo: 69.59, transmutatedGrade: 91 },
      { initialFrom: 67.0, initialTo: 68.29, transmutatedGrade: 90 },
      { initialFrom: 65.7, initialTo: 66.99, transmutatedGrade: 89 },
      { initialFrom: 64.4, initialTo: 65.69, transmutatedGrade: 88 },
      { initialFrom: 63.1, initialTo: 64.39, transmutatedGrade: 87 },
      { initialFrom: 61.8, initialTo: 63.09, transmutatedGrade: 86 },
      { initialFrom: 60.5, initialTo: 61.79, transmutatedGrade: 85 },
      { initialFrom: 59.2, initialTo: 60.49, transmutatedGrade: 84 },
      { initialFrom: 57.9, initialTo: 59.19, transmutatedGrade: 83 },
      { initialFrom: 56.6, initialTo: 57.89, transmutatedGrade: 82 },
      { initialFrom: 55.3, initialTo: 56.59, transmutatedGrade: 81 },
      { initialFrom: 54.0, initialTo: 55.29, transmutatedGrade: 80 },
      { initialFrom: 52.7, initialTo: 53.99, transmutatedGrade: 79 },
      { initialFrom: 51.4, initialTo: 52.69, transmutatedGrade: 78 },
      { initialFrom: 50.1, initialTo: 51.39, transmutatedGrade: 77 },
      { initialFrom: 48.8, initialTo: 50.09, transmutatedGrade: 76 },
      { initialFrom: 47.5, initialTo: 48.79, transmutatedGrade: 75 },
      { initialFrom: 44.33, initialTo: 47.49, transmutatedGrade: 74 },
      { initialFrom: 41.16, initialTo: 44.32, transmutatedGrade: 73 },
      { initialFrom: 37.99, initialTo: 41.15, transmutatedGrade: 72 },
      { initialFrom: 34.82, initialTo: 37.98, transmutatedGrade: 71 },
      { initialFrom: 31.65, initialTo: 34.81, transmutatedGrade: 70 },
      { initialFrom: 28.48, initialTo: 31.64, transmutatedGrade: 69 },
      { initialFrom: 25.31, initialTo: 28.47, transmutatedGrade: 68 },
      { initialFrom: 22.14, initialTo: 25.3, transmutatedGrade: 67 },
      { initialFrom: 18.97, initialTo: 22.13, transmutatedGrade: 66 },
      { initialFrom: 15.8, initialTo: 18.96, transmutatedGrade: 65 },
      { initialFrom: 12.63, initialTo: 15.79, transmutatedGrade: 64 },
      { initialFrom: 9.46, initialTo: 12.62, transmutatedGrade: 63 },
      { initialFrom: 6.29, initialTo: 9.45, transmutatedGrade: 62 },
      { initialFrom: 3.12, initialTo: 6.28, transmutatedGrade: 61 },
      { initialFrom: 0.0, initialTo: 3.11, transmutatedGrade: 60 },
    ],
  });

  console.log('Grade transmutation table seeded.');
}

main().finally(() => prisma.$disconnect());

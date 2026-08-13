import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const dbUrl = new URL(process.env.DATABASE_URL!);
    const adapter = new PrismaMariaDb({
      host: dbUrl.hostname,
      port: dbUrl.port ? parseInt(dbUrl.port, 10) : 3306,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1), // strip leading "/"
    });
    super({ adapter });
  }

  getWrittenWorksPercentage() {
    throw new Error('Method not implemented.');
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

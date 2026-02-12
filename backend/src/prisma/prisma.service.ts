import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  // constructor() {
  //   // Trong Prisma 7, bạn phải truyền URL trực tiếp vào đây khi chạy App
  //   super({
  //     datasources: {
  //       db: {
  //         url: process.env.DATABASE_URL, 
  //       },
  //     },
  //   });
  // }

  async onModuleInit() {
    await this.$connect();
    console.log('Database connected successfully')
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}

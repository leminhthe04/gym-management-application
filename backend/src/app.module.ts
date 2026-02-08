import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { MembersModule } from './modules/members/members.module';
import { CheckinModule } from './modules/checkin/checkin.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ 
      isGlobal: true, 
    }),
    PrismaModule,
    AuthModule,
    MembersModule,
    CheckinModule,
  ],
  controllers: [],
  providers: [],  
})
export class AppModule {}

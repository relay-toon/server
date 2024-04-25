import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ToonsModule } from './toons/toons.module';
import { SuggestionModule } from './suggestion/suggestion.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    AuthModule,
    ToonsModule,
    SuggestionModule,
    AwsModule,
  ],
})
export class AppModule {}

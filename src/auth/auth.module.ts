import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { KakaoStrategy, NaverStrategy } from './strategies';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy, NaverStrategy],
})
export class AuthModule {}

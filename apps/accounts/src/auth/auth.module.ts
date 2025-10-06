import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../../configs/jwt.config';

@Module({
  imports:[UsersModule,    JwtModule.register(getJWTConfig()),],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

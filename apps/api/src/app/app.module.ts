import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { getRMQConfig } from '../configs/rmq.config';
import { RMQModule } from 'nestjs-rmq';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from '../configs/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { UserController } from '../controllers/user.controller';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['envs/.env.api'],
    }),
    RMQModule.forRootAsync(getRMQConfig()),
    JwtModule.registerAsync(getJWTConfig()),
    PassportModule
  ],
  providers: [JwtStrategy],
  controllers: [AuthController, UserController],
})
export class AppModule {}

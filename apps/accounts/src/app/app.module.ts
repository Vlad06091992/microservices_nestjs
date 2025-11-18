import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from '../../configs/mongo.config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { AppService } from './app.service';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from '../../configs/rmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['envs/.env.accounts'],
    }),
    MongooseModule.forRootAsync(getMongoConfig()),
    RMQModule.forRootAsync(getRMQConfig()),
    AuthModule,
    UsersModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}

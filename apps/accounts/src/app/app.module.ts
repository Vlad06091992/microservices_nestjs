import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from '../../configs/mongo.config';
import { UsersService } from '../users/users.service';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    // envFilePath:['envs/.env.accounts.accounts']
    envFilePath:['envs/.env.accounts']
  }, ),
    MongooseModule.forRootAsync(getMongoConfig()),],
  controllers: [AppController],
  providers: [AppService, UsersService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user.models';
import { UsersRepository } from './repositories/user.repository';
import { UsersCommands } from './commands/user.commands';
import { UsersQueries } from './queries/user.queries';
import { UserEventEmitter } from './user-event-emitter';
import { UsersService } from './users.service';

//Использование схемы mongoDB
@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  providers: [UsersRepository, UserEventEmitter,UsersService],
  exports: [UsersRepository],
  controllers: [UsersCommands,UsersQueries],
})
export class UsersModule {}

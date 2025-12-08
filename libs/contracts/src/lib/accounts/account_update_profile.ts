import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator';
import { IUser } from '@org/interfaces';

export namespace AccountUpdateUserProfile {
  //            сервис.название.тип_команды
  export const topic = 'account.update.command'

  export class Request {
    @IsString()
    userId:string

    @IsObject()
    user:Pick<IUser,'displayName'>

  }
}


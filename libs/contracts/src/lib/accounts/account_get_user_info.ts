import { IsEmail, IsString } from 'class-validator';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { IUser } from '@org/interfaces';

export namespace AccountGetUserInfo {
  //            сервис.название.тип_команды
  export const topic = 'account.user-info.query'

  export class Request {

    @IsString()
    userId:string
  }
  export class Response {
    profile:Omit<IUser, 'passwordHash'>;
  }
}


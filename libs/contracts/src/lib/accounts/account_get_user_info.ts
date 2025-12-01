import { IsEmail, IsString } from 'class-validator';
import { IUser } from '@org/interfaces';
// import { IUser } from '@org/interfaces';

export namespace AccountGetUserInfo {
  //            сервис.название.тип_команды
  export const topic = 'account.user-info.query'

  export class Request {

    @IsEmail()
    userId:string
  }
  export class Response {
    user:Omit<IUser, 'passwordHash'>;
  }
}


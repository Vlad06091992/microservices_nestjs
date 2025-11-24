import { IsEmail, IsString } from 'class-validator';

export namespace AccountLogin {
  //            сервис.название.тип_команды
  export const topic = 'account.login.command'

  export class Request {

    @IsEmail()
    email:string
    @IsString()
    password:string
  }
  export class Response {
    access_token:string
  }
}


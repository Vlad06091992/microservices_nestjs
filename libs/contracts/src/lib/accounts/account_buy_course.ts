import { IsString } from 'class-validator';

export namespace AccountByCourse {
  //            сервис.название.тип_команды
  export const topic = 'account.buy-course.command'

  export class Request {
    @IsString()
    userId:string

    @IsString()
    courseId:string
  }
  export class Response {
    paymentUrl:string;
  }
}


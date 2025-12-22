import { IsString } from 'class-validator';

export namespace PaymentCheck {
  //            сервис.название.тип_команды
  export const topic = 'payment.check.query';

  export class Request {
    @IsString()
    courseId: string;

    @IsString()
    userId: string;
  }
  export class Response {
    status: 'success' | 'canceled' | 'inProgress';
  }
}

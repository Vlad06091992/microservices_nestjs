import { IsString } from 'class-validator';

export type PaymentStatus = 'success' | 'canceled' | 'inProgress';


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
    status: PaymentStatus;
  }
}

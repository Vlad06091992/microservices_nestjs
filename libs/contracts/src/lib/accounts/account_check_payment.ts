import { IsString } from 'class-validator';
import { PaymentStatus } from '../payment/payment_check';

export namespace AccountCheckPayment {
  //            сервис.название.тип_команды
  export const topic = 'account.check-payment.command';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    courseId: string;
  }
  export class Response {
    status: PaymentStatus;
  }
}


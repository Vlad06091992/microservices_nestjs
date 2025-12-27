import { IsString } from 'class-validator';
import { PurchaseState } from '@org/interfaces';

export namespace AccountChangedCourse {
  //            сервис.название.тип_команды
  export const topic = 'account.changed-course.event';

  export class Request {
    @IsString()
    userId: string;

    @IsString()
    state: PurchaseState;

    @IsString()
    courseId: string;
  }
}


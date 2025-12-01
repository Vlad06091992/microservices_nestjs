import { IsString } from 'class-validator';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { IUserCourses } from '@org/interfaces';
// import { IUser } from '@org/interfaces';

export namespace AccountGetCoursesInfo {
  //            сервис.название.тип_команды
  export const topic = 'account.courses-info.query'

  export class Request {
    @IsString()
    userId:string
  }
  export class Response {
    courses:IUserCourses[];
  }
}


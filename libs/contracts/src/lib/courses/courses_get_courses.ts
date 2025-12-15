import { IsString } from 'class-validator';
import { ICourse } from '@org/interfaces';

export namespace CoursesGetCourse {
  //            сервис.название.тип_команды
  export const topic = 'courses.get-course.query'

  export class Request {
    @IsString()
    id:string
  }
  export class Response {
    course:ICourse | null;
  }
}


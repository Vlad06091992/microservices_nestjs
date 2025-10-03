import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersRepository } from '../users/repositories/user.repository';

// const User:IUser = {
//   name:"Vlad"
// }

@Controller()
export class AppController {


  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  getData() {
    console.log(process.env.NODE_ENV);
    return this.appService.getData();
  }
}

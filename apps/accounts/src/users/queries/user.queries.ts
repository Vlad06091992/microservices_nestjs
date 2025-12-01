import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountGetCoursesInfo, AccountGetUserInfo } from '@org/contracts';
import { UsersRepository } from '../repositories/user.repository';

@Controller()
export class UsersQueries {
  constructor(private readonly usersRepository: UsersRepository) {}

  @RMQValidate()
  @RMQRoute(AccountGetUserInfo.topic)
  findUser(
    @Body() { userId }: AccountGetUserInfo.Request
  ): Promise<AccountGetUserInfo.Response> {
    return this.usersRepository.findUserById(userId);
  }

  @RMQValidate()
  @RMQRoute(AccountGetUserInfo.topic)
  findAccounts(
    @Body() { userId }: AccountGetUserInfo.Request
  ): Promise<AccountGetCoursesInfo.Response> {
    return this.usersRepository.findCoursesByUserId(userId);
  }
}

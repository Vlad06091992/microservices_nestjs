import { Body, Controller, Inject } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  AccountByCourse,
  AccountCheckPayment,
  AccountUpdateUserProfile,
} from '@org/contracts';
import { UsersService } from '../users.service';

@Controller()
export class UsersCommands {
  constructor(
    // @Inject() private readonly userRepo: UsersRepository,
    @Inject() private readonly userService: UsersService // @Inject() private readonly rmqService: RMQService
  ) {}

  @RMQValidate()
  @RMQRoute(AccountUpdateUserProfile.topic)
  async changeProfile(
    @Body() { user, userId }: AccountUpdateUserProfile.Request
  ): Promise<boolean> {
    return await this.userService.changeProfile(user, userId);
  }

  @RMQValidate()
  @RMQRoute(AccountByCourse.topic)
  async buyCourse(
    @Body() { userId, courseId }: AccountByCourse.Request
  ): Promise<AccountByCourse.Response> {
    return await this.userService.buyCourse(userId, courseId);
  }

  @RMQValidate()
  @RMQRoute(AccountCheckPayment.topic)
  async checkPayment(
    @Body() { userId, courseId }: AccountCheckPayment.Request
  ): Promise<AccountCheckPayment.Response> {
    return await this.userService.checkPayment(userId, courseId);
  }
}

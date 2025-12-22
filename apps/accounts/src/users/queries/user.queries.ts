import { Body, Controller, NotFoundException } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  AccountByCourse,
  AccountCheckPayment,
  AccountGetUserInfo,
} from '@org/contracts';
import { UsersRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { PurchaseState } from '@org/interfaces';

@Controller()
export class UsersQueries {
  constructor(private readonly usersRepository: UsersRepository) {}

  @RMQValidate()
  @RMQRoute(AccountGetUserInfo.topic)
  async findUser(
    @Body() { userId }: AccountGetUserInfo.Request
  ): Promise<AccountGetUserInfo.Response> {
    const { user } = await this.usersRepository.findUserById(userId);
    //пример работы с Entity(создание из данных в БД)
    const userEntity = new UserEntity(user);
    //использование функционала Entity
    const profile = userEntity.getPublicProfile();
    return { profile };
  }

  @RMQValidate()
  @RMQRoute(AccountByCourse.topic)
  async buyCourse(
    @Body() { userId, courseId }: AccountByCourse.Request
  ): Promise<AccountByCourse.Response> {
    const {user} = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userEntity = new UserEntity(user);

    return { paymentUrl: 'url' };
  }

  @RMQValidate()
  @RMQRoute(AccountCheckPayment.topic)
  async checkPayment(
    @Body() { userId, courseId }: AccountCheckPayment.Request
  ): Promise<AccountCheckPayment.Response> {
    return { status: PurchaseState.Purchased };
  }
}

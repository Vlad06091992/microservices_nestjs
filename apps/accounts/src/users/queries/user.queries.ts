import { Body, Controller, NotFoundException } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  AccountByCourse,
  AccountCheckPayment,
  AccountGetCoursesInfo,
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
  @RMQRoute(AccountGetUserInfo.topic)
  async getUserCourses(
    @Body() { userId }: AccountGetCoursesInfo.Request
  ): Promise<AccountGetCoursesInfo.Response> {
    const { user } = await this.usersRepository.findUserById(userId);
    //пример работы с Entity(создание из данных в БД)
    const userEntity = new UserEntity(user);
    //использование функционала Entity
    const courses = userEntity.getUserCourses();
    return { courses };
  }
}

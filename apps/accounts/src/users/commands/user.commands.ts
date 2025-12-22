import { Body, Controller, Inject, NotFoundException } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
  AccountByCourse,
  AccountCheckPayment,
  AccountUpdateUserProfile,
} from '@org/contracts';
import { UsersRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { PurchaseState } from '@org/interfaces';

@Controller()
export class UsersCommands {
  constructor(
    @Inject() private readonly userRepo: UsersRepository
  ) {}

  @RMQValidate()
  @RMQRoute(AccountUpdateUserProfile.topic)
  async updateUser(
    @Body() { user, userId }: AccountUpdateUserProfile.Request
  ): Promise<boolean> {
    try {
      const { user: existedUser } = await this.userRepo.findUserById(userId);


      if (!existedUser) {
        throw new NotFoundException('User does not exist');
      }
      //пример работы с Entity(создание из данных в БД)
      const userEntity = new UserEntity(existedUser);
      // пример работы с Entity
      userEntity.updateProfile(user.displayName);

      await this.userRepo.updateUser(userEntity);
      return true;
    } catch (e) {
      console.log('ERROR', e);
    }
  }

  @RMQValidate()
  @RMQRoute(AccountByCourse.topic)
  async buyCourse(
    @Body() { userId, courseId }: AccountByCourse.Request
  ): Promise<AccountByCourse.Response> {
    const {user} = await this.userRepo.findUserById(userId);
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

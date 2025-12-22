import { Body, Controller, Inject, NotFoundException } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { RMQRoute, RMQService, RMQValidate } from 'nestjs-rmq';
import {
  AccountByCourse,
  AccountCheckPayment,
  AccountUpdateUserProfile,
} from '@org/contracts';
import { UsersRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { PurchaseState } from '@org/interfaces';
import { BuyCourseSaga } from '../sagas/buy-course.saga';

@Controller()
export class UsersCommands {
  constructor(
    @Inject() private readonly userRepo: UsersRepository,
    @Inject() private readonly rmqService: RMQService
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
    const { user:existedUser } = await this.userRepo.findUserById(userId);
    if (!existedUser) {
      throw new NotFoundException('User not found');
    }

    const userEntity = new UserEntity(existedUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    // запустили сагу в определенном состоянии
    //сага под капотом сделала что нужно, вернула пользователя и paymentLink
    const {paymentLink,user} = await saga.getState().pay();
    await this.userRepo.updateUser(user);
    return { paymentLink };
  }

  @RMQValidate()
  @RMQRoute(AccountCheckPayment.topic)
  async checkPayment(
    @Body() { userId, courseId }: AccountCheckPayment.Request
  ): Promise<AccountCheckPayment.Response> {

    const { user:existedUser } = await this.userRepo.findUserById(userId);
    if (!existedUser) {
      throw new NotFoundException('User not found');
    }

    const userEntity = new UserEntity(existedUser);

    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const {user,status} = await saga.getState().checkPayment();
    await this.userRepo.updateUser(user);
    return { status };
  }
}

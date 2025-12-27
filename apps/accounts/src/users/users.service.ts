import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AccountByCourse, AccountCheckPayment } from '@org/contracts';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './repositories/user.repository';
import { IUser } from '@org/interfaces';
import { BuyCourseSaga } from './sagas/buy-course.saga';
import { RMQService } from 'nestjs-rmq';
import { UserEventEmitter } from './user-event-emitter';

@Injectable()
export class UsersService {
  constructor(
    @Inject() private readonly userRepo: UsersRepository,
    @Inject() private readonly rmqService: RMQService,
    @Inject() private readonly userEventEmitter: UserEventEmitter
  ) {}

  async changeProfile(
    user: Pick<IUser, 'displayName'>,
    userId: string
  ): Promise<boolean> {
    try {
      const { user: existedUser } = await this.userRepo.findUserById(userId);

      if (!existedUser) {
        throw new NotFoundException('User does not exist');
      }
      //пример работы с Entity(создание из данных в БД)
      const userEntity = new UserEntity(existedUser).updateProfile(
        user.displayName
      );
      // пример работы с Entity
      userEntity.updateProfile(user.displayName);
      await this.updateUser(userEntity);
      return true;
    } catch (e) {
      console.log('ERROR', e);
    }
  }

  async buyCourse(
    userId: string,
    courseId: string
  ): Promise<AccountByCourse.Response> {
    const { user: existedUser } = await this.userRepo.findUserById(userId);
    if (!existedUser) {
      throw new NotFoundException('User not found');
    }

    const userEntity = new UserEntity(existedUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    // запустили сагу в определенном состоянии
    //сага под капотом сделала что нужно, вернула пользователя и paymentLink
    const { paymentLink, user } = await saga.getState().pay();
    await this.updateUser(user);
    return { paymentLink };
  }

  async checkPayment(
    userId: string,
    courseId: string
  ): Promise<AccountCheckPayment.Response> {
    const { user: existedUser } = await this.userRepo.findUserById(userId);
    if (!existedUser) {
      throw new NotFoundException('User not found');
    }

    const userEntity = new UserEntity(existedUser);
    const saga = new BuyCourseSaga(userEntity, courseId, this.rmqService);
    const { status, user } = await saga.getState().checkPayment();
    await this.updateUser(user);
    return { status };
  }

  private async updateUser(user: UserEntity) {
    return Promise.all([
      this.userEventEmitter.handle(user),
      this.userRepo.updateUser(user),
    ]);
  }
}

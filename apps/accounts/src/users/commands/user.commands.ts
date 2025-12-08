import { Body, Controller, Inject, NotFoundException } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountUpdateUserProfile } from '@org/contracts';
import { UsersRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';

@Controller()
export class UsersCommands {
  constructor(
    // @Inject() private readonly authService: AuthService
    @Inject() private readonly userRepo: UsersRepository
  ) {}

  @RMQValidate()
  @RMQRoute(AccountUpdateUserProfile.topic)
  async updateUser(
    @Body() { user, userId }: AccountUpdateUserProfile.Request
  ): Promise<boolean> {
    try {
      const {user:existedUser} = await this.userRepo.findUserById(userId);

      if (!existedUser) {
        throw new NotFoundException('User does not exist');
      }
      const userEntity = new UserEntity(existedUser).updateProfile(user.displayName);
      await this.userRepo.updateUser(userEntity);
      return true
    } catch (e) {
      console.log('ERROR', e);
    }
  }
}

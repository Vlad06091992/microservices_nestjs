import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountGetUserInfo } from '@org/contracts';
import { UsersRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';

@Controller()
export class UsersQueries {
  constructor(private readonly usersRepository: UsersRepository) {}

  @RMQValidate()
  @RMQRoute(AccountGetUserInfo.topic)
  async findUser(
    @Body() { userId }: AccountGetUserInfo.Request
  ): Promise<AccountGetUserInfo.Response> {
    const { user } = await this.usersRepository.findUserById(userId);
    const userEntity = new UserEntity(user);
    const profile = userEntity.getPublicProfile();
    return { profile };
  }
}

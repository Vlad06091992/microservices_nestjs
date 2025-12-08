import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AccountGetUserInfo, AccountUpdateUserProfile } from '@org/contracts';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RMQService } from 'nestjs-rmq';
import { UserId } from '../decorators/user.decorator';

@Controller('/users')
export class UserController {
  constructor(private readonly rmqService: RMQService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/info')
  async info(@UserId() dto: AccountGetUserInfo.Request) {
    console.log('send_message to queue with dto', dto);

    return await this.rmqService.send<
      AccountGetUserInfo.Request,
      AccountGetUserInfo.Response
    >(AccountGetUserInfo.topic, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/update-profile')
  @HttpCode(204)
  async updateProfile(
    @UserId() { userId }: { userId: string },
    @Body() user: AccountUpdateUserProfile.Request
  ) {

    const data = {
      userId: userId, ...user,
    }

    try {
      await this.rmqService.send<AccountUpdateUserProfile.Request, void>(
        AccountUpdateUserProfile.topic,
        data
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      } else {
        throw e;
      }
    }
  }
}

import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@org/contracts';
import { RMQService } from 'nestjs-rmq';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly rmqService: RMQService) {}

  @Post('/register')
  async register(@Body() dto: RegisterDto) {
    try {
      return await this.rmqService.send<RegisterDto, AccountLogin.Response>(
        AccountRegister.topic,
        dto
      );
    } catch (e) {
      if (e instanceof Error) {
        throw new UnauthorizedException(e.message);
      } else {
        throw e;
      }
    }
  }

  @Post('/login')
  async login(@Body() dto: LoginDto) {
    try {
      return await this.rmqService.send<LoginDto, AccountLogin.Response>(
        AccountLogin.topic,
        dto
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

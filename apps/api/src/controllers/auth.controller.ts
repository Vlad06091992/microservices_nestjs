import { Body, Controller, Post } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@org/contracts';
import { UserId } from '../decorators/user.decorator';


@Controller('/auth')
export class AuthController {


  @Post('/register')
  register(@UserId() id: string) {
    // return this.authService.register(dto);
  }

  @Post('/login')
  async login( @Body() dto: AccountLogin.Request) {
    // const { email, password } = dto;
    // const { id } = await this.authService.validateUser(email, password);
    // return await this.authService.login(id);
  }
}



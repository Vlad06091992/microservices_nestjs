import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AccountLogin, AccountRegister } from '@org/contracts';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';


@Controller('/auth')
export class UserController {


  @UseGuards(JwtAuthGuard)
  @Post('/info')
  async info(@Body() dto: AccountRegister.Request) {
    // return this.authService.register(dto);
  }
}



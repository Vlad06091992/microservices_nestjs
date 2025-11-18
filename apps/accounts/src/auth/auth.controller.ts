import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AccountLogin, AccountRegister } from '@org/contracts';



@Controller('/auth')
export class AuthController {
  constructor(
   @Inject() private readonly authService: AuthService) {}

  @Post("/register")
  register(@Body() dto: AccountRegister.Request):Promise<AccountRegister.Response> {
    return this.authService.register(dto);
  }

  @Post("/login")
 async login(@Body() dto: AccountLogin.Request):Promise<AccountLogin.Response> {
    const{email, password} = dto;
    const {id} = await this.authService.validateUser(email, password);
    return await this.authService.login(id)
  }
}



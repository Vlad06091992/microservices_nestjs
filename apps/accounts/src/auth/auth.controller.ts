import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

export class LoginDTO {
  email: string;
  password: string;
}


export class RegisterDTO extends LoginDTO {
  displayName?: string;
}


@Controller('/auth')
export class AuthController {
  constructor(
   @Inject() private readonly authService: AuthService) {}

  @Post("/register")
  register(@Body() dto: RegisterDTO) {
    return this.authService.register(dto);
  }

  @Post("/login")
 async login(@Body() dto: LoginDTO) {
    const{email, password} = dto;
    const {id} = await this.authService.validateUser(email, password);
    return await this.authService.login(id)
  }
}



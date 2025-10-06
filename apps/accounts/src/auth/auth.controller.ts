import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

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
  }
}

export class LoginDTO{
  email: string;
  password: string;
}


export class RegisterDTO extends LoginDTO {
  displayName?: string;
}


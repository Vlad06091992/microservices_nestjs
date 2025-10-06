import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { RegisterDTO } from './auth.controller';
import { UsersRepository } from '../users/repositories/user.repository';
import { User } from '../users/models/user.models';
import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from '@org/interfaces';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private readonly userRepo: UsersRepository,
    @Inject() private jwtService: JwtService
    ) {}

  async register(dto: RegisterDTO) {
    const { displayName, email, password } = dto;
    const oldUser = await this.userRepo.findUser(email);
    if (oldUser) {
      throw new Error('User already exists');
    }

    const newUserEntity = await new UserEntity({displayName,email,role:UserRole.Student,passwordHash:''}).setPassword(password);
    const newUser = await this.userRepo.createUser(newUserEntity);
    return {email:newUser.email};
  }


  async validateUser(email:string, password:string) {

    const user = await this.userRepo.findUser(email);
    if (!user) {
      throw new UnauthorizedException('Incorrect login or password');
    }

    const userEntity = new UserEntity(user)
    const isCorrectPassword = await userEntity.validatePassword(password)

    if(!isCorrectPassword){
      throw new UnauthorizedException('Incorrect login or password');
    }

    return {id:userEntity._id}


  }

  async login(id: string) {
    return {
      access_token: await this.jwtService.signAsync({id}),
    }
  }
}

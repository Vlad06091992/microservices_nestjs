import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/repositories/user.repository';
import { UserEntity } from '../users/entities/user.entity';
import { UserRole } from '@org/interfaces';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { AccountRegister } from '@org/contracts';

@Injectable()
export class AuthService {
  constructor(
    @Inject() private readonly userRepo: UsersRepository,
    @Inject() private jwtService: JwtService
  ) {}

  async register(dto: AccountRegister.Request):Promise<AccountRegister.Response> {
    const { displayName, email, password } = dto;
    const oldUser = await this.userRepo.findUser(email);
    if (oldUser) {
      throw new Error('User already exists');
    }


    const newUserEntity = await new UserEntity({
      displayName,
      email,
      role: UserRole.Student,
      passwordHash: '',
    }).setPassword(password);
    const newUser = await this.userRepo.createUser(newUserEntity);
    return { email: newUser.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepo.findUser(email);
    if (!user) {
      throw new UnauthorizedException('Incorrect login or password');
    }

    const userEntity = new UserEntity(user);
    const isCorrectPassword = await userEntity.validatePassword(password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException('Incorrect login or password');
    }

    return { id: userEntity._id };
  }

  async login(id: Types.ObjectId) {
    return {
      access_token: await this.jwtService.signAsync({ id }),
    };
  }
}

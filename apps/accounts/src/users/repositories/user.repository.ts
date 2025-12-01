import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.models';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private readonly userModel:Model<User>) {
  }

  //пример взаимодействия Entity и Model в mongoDB
  async createUser(user: UserEntity) {
    const newUser = new this.userModel(user)
    return await newUser.save();
  }

  async findUser(email: string) {
    return this.userModel.findOne({email}).exec()
  }

  async deleteUser(email: string) {
    return this.userModel.deleteOne({email}).exec()
  }

  async findAllUsers() {
    return this.userModel.find().exec()
  }
}

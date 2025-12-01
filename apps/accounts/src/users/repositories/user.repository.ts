import { InjectModel } from '@nestjs/mongoose';
import { User } from '../models/user.models';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  //пример взаимодействия Entity и Model в mongoDB
  async createUser(user: UserEntity) {
    const newUser = new this.userModel(user);
    return await newUser.save();
  }

  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findUserById(id: string) {
    const user = await this.userModel
      .findOne({ _id: new ObjectId(id) })
      // .select('') // альтернатива для выборки нужных полей, более правильная
      .exec();

    const {passwordHash, ...userData} = user

    return {user:userData};

  }

  async findCoursesByUserId(id: string) {
    const foundUser = await this.userModel
      .findOne({ _id: new ObjectId(id) })
      .exec();
    return{ courses: foundUser.courses};

  }

  async deleteUser(email: string) {
    return this.userModel.deleteOne({ email }).exec();
  }

  async findAllUsers() {
    return this.userModel.find().exec();
  }
}

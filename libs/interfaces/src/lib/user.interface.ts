import * as mongoose from 'mongoose';

export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student',
}

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  email: string;
  displayName?: string;
  passwordHash: string;
  role: UserRole;
}

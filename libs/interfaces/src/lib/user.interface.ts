import * as mongoose from 'mongoose';

export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student',
}

export enum PurchaseState {
  Waiting = 'Waiting',
  Purchased = 'Purchased',
  Canceled = 'Canceled',
  WaitingForPayment = 'WaitingForPayment',
}

export interface IUserCourses {
  _id?: mongoose.Types.ObjectId;
  courseId?: mongoose.Types.ObjectId;
  purchaseState:PurchaseState
}

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  email: string;
  displayName?: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];
}







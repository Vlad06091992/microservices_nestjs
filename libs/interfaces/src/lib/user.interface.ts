import * as mongoose from 'mongoose';

export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student',
}

export enum PurchaseState {
  Started = 'Started',
  WaitingForPayment = 'WaitingForPayment',
  Purchased = 'Purchased',
  Canceled = 'Canceled',
}

export interface IUserCourses {
  _id?: mongoose.Types.ObjectId;
  // courseId?: mongoose.Types.ObjectId;
  courseId?: string;
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







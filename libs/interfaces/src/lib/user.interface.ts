export enum UserRole {
  Teacher = 'Teacher',
  Student = 'Student',
}

export interface IUser {
  _id: string;
  email: string;
  displayName?: string;
  passwordHash: string;
  role: UserRole;
}

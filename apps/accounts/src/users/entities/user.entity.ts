import { IUser, UserRole } from '@org/interfaces';
import { compare, genSalt, hash } from 'bcrypt';
import { Types } from 'mongoose';

// Entity — это конкретный экземпляр документа, который Model создаёт, находит и которым управляет.
export class UserEntity implements IUser {
  _id: Types.ObjectId;
  email: string;
  displayName?: string;
  passwordHash: string;
  role: UserRole;

  constructor(user: IUser) {
    this.email = user.email;
    this.displayName = user.displayName;
    this.role = user.role;
    this.passwordHash = user.passwordHash;
  }

  public async setPassword(password: string) {
    this.passwordHash = await hash(password, await genSalt(10));
    return this;
  }

  public validatePassword(password: string) {
    const hashedPassword = this.passwordHash;
    return compare(password, hashedPassword);
  }
}

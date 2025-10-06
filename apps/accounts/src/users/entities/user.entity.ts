import { IUser, UserRole } from '@org/interfaces';
import { genSalt, hash, compare, compareSync } from 'bcrypt';

export class UserEntity implements IUser {
  _id?: string;
  email: string;
  displayName?: string;
  passwordHash: string;
  role: UserRole;

  constructor(user: IUser) {
    this._id = user._id;
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
    const hashedPassword = this.passwordHash
    return compare(password, hashedPassword);
  }
}

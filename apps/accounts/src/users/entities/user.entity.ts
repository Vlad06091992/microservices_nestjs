import { IUser, IUserCourses, PurchaseState, UserRole } from '@org/interfaces';
import { compare, genSalt, hash } from 'bcrypt';
import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';

// Entity — это конкретный экземпляр документа, который Model создаёт, находит и которым управляет.
export class UserEntity implements IUser {
  _id: Types.ObjectId;
  email: string;
  displayName?: string;
  passwordHash: string;
  role: UserRole;
  courses?: IUserCourses[];

  constructor(user: IUser) {
    this._id = user._id;
    this.email = user.email;
    this.displayName = user.displayName;
    this.role = user.role;
    this.passwordHash = user.passwordHash;
    this.courses = user.courses;
  }

  public async addCourse(courseId: string) {
    const isExist = this.courses.find((c) => c.courseId === courseId);
    if (isExist) {
      throw new Error('Course already exists');
    }

    this.courses.push({
      courseId,
      purchaseState: PurchaseState.Started,
    });
  }

  public deleteCourse(courseId: string) {
    this.courses = this.courses.filter((el) => el.courseId !== courseId);
  }


  public setCourseStaus(courseId: string, status: PurchaseState) {

    const isExistCourse = this.courses.find((course) => course.courseId === courseId);
    if (!isExistCourse) {
      this.courses.push({
        courseId,
        purchaseState: PurchaseState.Started,
      })
      return this;
    }

    if (status === PurchaseState.Canceled) {
      this.courses = this.courses.filter((course) => course.courseId !== courseId);
      return this;
    }

    this.courses.map((c) => {
      if (c.courseId === courseId) {
        c.purchaseState = status;
      }

      return c;
    });
  }

  public getUserCourses() {
    return this.courses;
  }

  public async setPassword(password: string) {
    this.passwordHash = await hash(password, await genSalt(10));
    return this;
  }

  public validatePassword(password: string) {
    const hashedPassword = this.passwordHash;
    return compare(password, hashedPassword);
  }

  public updateProfile(displayName: string) {
    this.displayName = displayName;
    return this;
  }

  public getPublicProfile() {
    return {
      email: this.email,
      role: this.role,
      displayName: this.displayName,
    };
  }
}

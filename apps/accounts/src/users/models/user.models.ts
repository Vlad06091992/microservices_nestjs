import { Document, Types } from 'mongoose';
import { IUser, IUserCourses, PurchaseState, UserRole } from '@org/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//код для создания схемы и модели в репозитории
// Model — это статический интерфейс для работы с коллекцией

@Schema()
export class UserCourses extends Document implements IUserCourses {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;
  @Prop({ required: true, type:String })
  purchaseState: PurchaseState;
  @Prop({ type: Types.ObjectId, required: true })
  courseId: string;
}

export const UserCoursesSchema = SchemaFactory.createForClass(UserCourses);


@Schema()
export class User extends Document implements IUser {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;
  @Prop()
  displayName?: string;
  @Prop({ required: true })
  passwordHash: string;
  @Prop({ required: true })
  email: string;
  @Prop({
    required: true,
    enum: UserRole,
    type: String,
    default: UserRole.Student,
  })
  role: UserRole;
  @Prop({ required: false, type:[UserCoursesSchema] })
  courses: Types.Array<UserCourses>;
}



export const UserSchema = SchemaFactory.createForClass(User);

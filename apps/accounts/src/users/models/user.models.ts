import mongoose, { Document,Model, Types  } from 'mongoose';
import { IUser, UserRole } from '@org/interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

//код для создания схемы и модели в репозитории
// Model — это статический интерфейс для работы с коллекцией

@Schema()
export class User extends Document implements IUser {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId;
  @Prop()
  displayName?: string;
  @Prop({required: true})
  passwordHash: string;
  @Prop({required: true})
  email: string;
  @Prop({required: true,enum: UserRole,type:String,default:UserRole.Student})
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);

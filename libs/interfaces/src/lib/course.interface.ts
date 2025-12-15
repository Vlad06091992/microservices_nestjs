import mongoose from 'mongoose';

export interface ICourse {
  _id?: mongoose.Types.ObjectId;
  price?: number;
}



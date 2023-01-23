import { Types } from 'mongoose';

export interface Friend {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  status: string;
}

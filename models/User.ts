import mongoose, { Document, Schema, model, models } from 'mongoose';
import { IOrganization } from './Organization';

export interface IUser extends Document {
  email: string;
  password?: string;
  displayName: string;
  role: 'admin' | 'user';
  orgId: IOrganization['_id'];
  createdAt: Date;
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  displayName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  orgId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = models.User || model<IUser>('User', UserSchema);

export default User;

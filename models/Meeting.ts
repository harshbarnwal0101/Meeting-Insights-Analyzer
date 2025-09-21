import mongoose, { Document, Schema, model, models } from 'mongoose';
import { IUser } from './User.js';
import { IOrganization } from './Organization.js';

export interface IMeeting extends Document {
  name: string;
  userId: IUser['_id'];
  orgId: IOrganization['_id'];
  createdAt: Date;
}

const MeetingSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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

const Meeting = models.Meeting || model<IMeeting>('Meeting', MeetingSchema);

export default Meeting;

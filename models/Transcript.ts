import mongoose, { Document, Schema, model, models } from 'mongoose';
import { IMeeting } from './Meeting';

export interface ITranscript extends Document {
  meetingId: IMeeting['_id'];
  text: string;
  processed: boolean;
  createdAt: Date;
}

const TranscriptSchema = new Schema({
  meetingId: {
    type: Schema.Types.ObjectId,
    ref: 'Meeting',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  processed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Transcript = models.Transcript || model<ITranscript>('Transcript', TranscriptSchema);

export default Transcript;

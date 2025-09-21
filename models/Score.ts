import mongoose, { Document, Schema, model, models } from 'mongoose';
import { ITranscript } from './Transcript';

export interface IScore extends Document {
  transcriptId: ITranscript['_id'];
  pitchScore: number;
  conversionScore: number;
  rapportScore: number;
  objectionScore: number;
  closingScore: number;
  overall: number;
  rationale: string;
  rawModelOutput: string;
  createdAt: Date;
}

const ScoreSchema = new Schema({
  transcriptId: {
    type: Schema.Types.ObjectId,
    ref: 'Transcript',
    required: true,
  },
  pitchScore: { type: Number, required: true },
  conversionScore: { type: Number, required: true },
  rapportScore: { type: Number, required: true },
  objectionScore: { type: Number, required: true },
  closingScore: { type: Number, required: true },
  overall: { type: Number, required: true },
  rationale: { type: String, required: true },
  rawModelOutput: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Score = models.Score || model<IScore>('Score', ScoreSchema);

export default Score;

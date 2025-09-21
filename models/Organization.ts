import mongoose, { Document, Schema, model, models } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  createdAt: Date;
}

const OrganizationSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Organization = models.Organization || model<IOrganization>('Organization', OrganizationSchema);

export default Organization;

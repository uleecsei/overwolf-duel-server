import mongoose, { Schema, Document } from 'mongoose';

export interface Invitation extends Document {
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
}

const InvitationSchema: Schema = new Schema({
    sender: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

export const Invitation = mongoose.model<Invitation>('Invitation', InvitationSchema);

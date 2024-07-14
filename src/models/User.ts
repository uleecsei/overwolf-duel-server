import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
        username: string;
        email: string;
        password: string;
        friends: mongoose.Types.ObjectId[];
        discordId?: string;
        discordData?: any;
        isVerified?: boolean;
}

const UserSchema: Schema = new Schema({
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        friends: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
        discordId: String,
        discordData: Schema.Types.Mixed,
        connections: Array,
        isVerified: Boolean
});

export const User = mongoose.model<IUser>('User', UserSchema);
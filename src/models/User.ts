import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        id: String,
        username: String,
        password: String,
        email: String,
        discordId: String,
        discordData: Object,
        connections: Array,
        isVerified: Boolean
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export { User };

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        id: String,
        username: String,
        avatar: String,
        connections: Array
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export { User };

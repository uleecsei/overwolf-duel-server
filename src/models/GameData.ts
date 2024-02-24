import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        data: Object
    },
    { timestamps: true }
);

const GameData = mongoose.model('GameData', userSchema);

export { GameData };

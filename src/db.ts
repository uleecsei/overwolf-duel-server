import mongoose from 'mongoose';
import { config } from './config';

const connectDB = async () => {
    try {
        await mongoose.connect(config.db.mongodbURI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }
};

export { connectDB };

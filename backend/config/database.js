import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Use environment variable or fallback to local MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/eco-report-center';
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    console.log('Please make sure MongoDB is running or set MONGODB_URI in .env file');
    process.exit(1);
  }
};

export default connectDB;

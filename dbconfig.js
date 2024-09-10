// dbconfig.js
import mongoose from "mongoose";
import express from "express";
import dotenv from 'dotenv'
import bodyParser from "body-parser";

dotenv.config();
const dbconfig = async () => {
  const app = express();
 
  app.use(bodyParser.json());

  // MongoDB connection
  try {
    // mongodb://localhost:27017/geoLTE
    // await mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@smart-server.fop0i76.mongodb.net/smartfind?ssl=true`, {
    await mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:5432/${process.env.MONGODB_CLUSTER}?directConnection=true`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // Handle the error, maybe throw it or handle it according to your application's needs
    throw error;
  }

  return app;
};

export default dbconfig;

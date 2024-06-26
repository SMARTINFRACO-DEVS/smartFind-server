import mongoose from "mongoose";
import express from "express";
import dotenv from 'dotenv';
import bodyParser from "body-parser";

dotenv.config();

const dbconfig = async () => {
  const app = express();

  app.use(bodyParser.json());

  // MongoDB connection
  try {
    await mongoose.connect('mongodb://root:tFhh2hQwHwKiIB7pwFhNfbylsafgxcfWOF9Yd532vcq4juGZFez0sQ02pa7abSMb@197.253.124.146:5432/?directConnection=true');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to your MongoDB:', error);
    throw error;
  }

  return app;
};

export default dbconfig;

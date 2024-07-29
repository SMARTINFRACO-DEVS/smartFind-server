import express from 'express';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from 'cors';
import dbconfig from './dbconfig.js';
import whitelist from './whitelist.js';

import basestationRoutes from './routes/basestations.js';
import connectivityRoutes from './routes/connectivity.js';
import orderFormRoutes from './routes/orderForm.js';
import apiRoutes from './routes/api.js';

dotenv.config();

(async () => {
  try {
    const app = await dbconfig();

    const db = mongoose.connection;
    db.on('error', (error) => console.error('MongoDB connection error:', error));
    db.once('open', () => console.log('Connected to MongoDB'));

    const corsOptions = {
      origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Access denied by CORS'));
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
      optionsSuccessStatus: 200,
    };

    app.use(cors(corsOptions));
    app.use(express.json());

    // Use routes
    app.use('/api/basestations', basestationRoutes);
    app.use('/api/connectivity', connectivityRoutes);
    app.use('/api/orderform', orderFormRoutes);
    app.use('/api', apiRoutes);

    // Global error handler
    app.use((err, req, res, next) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error configuring the app:', error);
  }
})();

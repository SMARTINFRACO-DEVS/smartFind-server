import express from 'express';
import BaseStationSchema from '../model/BaseStationSchema.js';
import DivSchema from '../model/DivSchema.js';
import { isWithinRadius } from '../helpers/lte.middleware.js';
import { isWithinCircularDIV } from '../helpers/div.middleware.js';
import mongoose from "mongoose";

const router = express.Router();
const Basestation = mongoose.model('Basestation', BaseStationSchema);
const Divstation = mongoose.model('Divstation', DivSchema);

router.post('/checkConnectivity', async (req, res) => {
  console.log('Received request data:', req.body);
  const { clientlatitude, clientlongitude } = req.body;

  try {
    const basestations = await Basestation.find({}, 'Latitude Longitude');
    const divstations = await Divstation.find({}, 'Latitude Longitude');
    
    // Helper function to check connectivity
    const checkConnectivity = (stations, checkFunction, radius) => {
      for (const station of stations) {
        const { Latitude, Longitude } = station._doc;
        if (isNaN(Latitude) || isNaN(Longitude)) {
          console.log('Invalid coordinates');
          continue;
        }
        const status = checkFunction(clientlatitude, clientlongitude, Latitude, Longitude, radius);
        if (status === 'Network available') {
          console.log('Connectivity status:', status);
          return { message: 'Network is Available', coordinates: { nLat: Latitude, nLng: Longitude } };
        }
      }
      return null;
    };

    // Check BaseStation Connectivity
    let responseData = checkConnectivity(basestations, isWithinRadius, 10);
    
    // If no BaseStation connectivity, check Divstation Connectivity
    if (!responseData) {
      responseData = checkConnectivity(divstations, isWithinCircularDIV, 7);
    }

    if (responseData) {
      console.log('Sending response data:', responseData);
      return res.json(responseData);
    }

    // No connectivity found
    const noConnectivityResponse = { message: 'No connectivity' };
    console.log('Sending response data:', noConnectivityResponse);
    res.json(noConnectivityResponse);
  } catch (error) {
    console.error('Error querying stations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

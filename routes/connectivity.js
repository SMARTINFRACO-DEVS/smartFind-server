import express from 'express';
import BaseStationSchema from '../model/BaseStationSchema.js';
import { isWithinRadius } from '../distanceFunctions.js';
import mongoose from "mongoose";

const router = express.Router();
const Basestation = mongoose.model('Basestation', BaseStationSchema);

router.post('/checkConnectivity', async (req, res) => {
  console.log('Received request data:', req.body);
  const { clientlatitude, clientlongitude } = req.body;

  try {
    const basestations = await Basestation.find({}, 'Latitude Longitude');

    for (const basestation of basestations) {
      const { Latitude, Longitude } = basestation._doc;

      if (isNaN(Latitude) || isNaN(Longitude)) {
        console.log('Invalid coordinates');
        continue;
      }

      const radiusInKm = 10;
      const connectivityStatus = isWithinRadius(clientlatitude, clientlongitude, Latitude, Longitude, radiusInKm);

      console.log('Connectivity status:', connectivityStatus);

      if (connectivityStatus === 'Network available') {
        req.nLat = Latitude;
        req.nLng = Longitude;
        const responseData = { message: 'Network is Available', coordinates: { nLat: Latitude, nLng: Longitude } };
        console.log('Sending response data:', responseData);
        return res.json(responseData);
      }
    }

    const noConnectivityResponse = { message: 'No connectivity' };
    console.log('Sending response data:', noConnectivityResponse);
    res.json(noConnectivityResponse);
  } catch (error) {
    console.error('Error querying basestations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

import express from 'express';
import BaseStationSchema from '../model/BaseStationSchema.js';
import mongoose from "mongoose";

const router = express.Router();
const Basestation = mongoose.model('Basestation', BaseStationSchema);

router.post('/', async (req, res) => {
  try {
    const basestation = new Basestation(req.body);
    const savedBasestation = await basestation.save();
    res.json(savedBasestation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const basestations = await Basestation.find();
    res.json(basestations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

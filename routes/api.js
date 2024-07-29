import express from 'express';

const router = express.Router();

router.get('/data', (req, res) => {
  const apiKey = process.env.VITE_GOOGLE_API_KEY;
  const mapId = process.env.VITE_GOOGLE_MAP_ID;
  res.json({ message: 'Server received request and processed data.', apiKey, mapId });
});

export default router;

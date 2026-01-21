import express from 'express';

const router = express.Router();

router.get('/data', (req, res) => {
  const apiKey = process.env.VITE_GOOGLE_API_KEY;
  const mapId = process.env.VITE_GOOGLE_MAP_ID;
  const styleUrl = process.env.VITE_MAPBOX_STYLE_URL;
  const accessToken = process.env.VITE_MAPBOX_ACCESS_TOKEN;
  res.json({ 
    message: 'Server received request and processed data.', 
    apiKey, 
    mapId, 
    styleUrl, 
    accessToken     });
});

export default router;

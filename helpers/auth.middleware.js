import dotenv from 'dotenv';

dotenv.config();

/**
 * API Key Authentication Middleware
 * Validates incoming requests with X-API-Key header
 * Usage: app.use(apiKeyAuth) or router.use(apiKeyAuth)
 */
export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.API_SECRET_KEY;

  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'API key is missing. Please provide X-API-Key header.',
    });
  }

  if (apiKey !== validApiKey) {
    console.warn(`Unauthorized API key attempt: ${apiKey}`);
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid API key.',
    });
  }

  // API key is valid, proceed to next middleware/route handler
  next();
};

/**
 * Input Validation Middleware for Connectivity Checks
 * Validates latitude and longitude coordinates
 */
export const validateCoordinates = (req, res, next) => {
  const { clientlatitude, clientlongitude } = req.body;

  if (clientlatitude === undefined || clientlongitude === undefined) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Missing required fields: clientlatitude, clientlongitude',
    });
  }

  const lat = parseFloat(clientlatitude);
  const lng = parseFloat(clientlongitude);

  // Validate latitude range (-90 to 90)
  if (isNaN(lat) || lat < -90 || lat > 90) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid latitude. Must be between -90 and 90.',
    });
  }

  // Validate longitude range (-180 to 180)
  if (isNaN(lng) || lng < -180 || lng > 180) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid longitude. Must be between -180 and 180.',
    });
  }

  // Add validated coordinates to request object
  req.validatedCoordinates = { latitude: lat, longitude: lng };
  next();
};

/**
 * Rate Limiting Middleware
 * Tracks requests per IP address to prevent abuse
 * Usage: app.use(rateLimiter)
 */
const requestMap = new Map();
const RATE_LIMIT = 100; // requests per hour
const TIME_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

export const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  if (!requestMap.has(ip)) {
    requestMap.set(ip, []);
  }

  const requests = requestMap.get(ip);
  
  // Remove old requests outside the time window
  const validRequests = requests.filter(timestamp => now - timestamp < TIME_WINDOW);
  requestMap.set(ip, validRequests);

  if (validRequests.length >= RATE_LIMIT) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Maximum ${RATE_LIMIT} requests per hour allowed.`,
    });
  }

  // Add current request timestamp
  validRequests.push(now);
  next();
};

/**
 * HTTPS Redirect Middleware
 * Redirects HTTP requests to HTTPS in production
 * Usage: app.use(httpsRedirect)
 */
export const httpsRedirect = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(301, `https://${req.get('host')}${req.url}`);
  }
  next();
};

/**
 * Security Headers Middleware
 * Adds security headers to all responses
 * Usage: app.use(securityHeaders)
 */
export const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict Transport Security (HSTS) - enable in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
};

export default { apiKeyAuth, validateCoordinates, rateLimiter, httpsRedirect, securityHeaders };

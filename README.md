# Smart-Find REST API

## Overview

Smart-Find is a web-integrated geolocation intelligence application designed to help customers identify network coverage availability by querying the geographic coordinates of base stations and towers. The system uses Haversine distance calculations to determine if network coverage is available at a user's current location or specified coordinates.

---

## MAIN GOAL OBJECTIVES

- **Enhance Customer Experience**: Enable customers to easily locate and verify network coverage in their area using GPS coordinates of towers and base stations
- **Reduce Network-Related Issues**: Decrease network complaints and reduce call center operational load by providing self-service coverage verification
- **Support Network Planning**: Assist network engineers and site planners in making informed rollout and infrastructure decisions based on actual coverage data

---

## TARGET USERS

- **Corporate Customers & MDAs** (Multi-Designation Agencies): Organizations needing reliable network coverage verification for operations
- **Network Engineers**: Technical teams responsible for network infrastructure planning and maintenance
- **Sales & Marketing Teams**: Business teams requiring coverage information for customer inquiries and service delivery planning

---

## KEY FEATURES

### Search & Find Network Coverage By:

- **GPS Location** (Auto-detect): Automatic detection of user's current coordinates
- **Town/Address Name**: Search coverage by specifying town or landmark locations
- **Geo-Coordinates**: Direct coordinate-based queries for precise location checking

### Network Data Support:

The system processes and stores comprehensive network infrastructure data including:

- Tower & Base Station Location Data
  - Tower ID
  - Site Name
  - Latitude & Longitude Coordinates
  - Network Type (LTE/Mobile Networks)
  - Coverage Radius Zones
  
- Geographic Information
  - District
  - Region
  - Agency Type
  - Town/Area Classification

### Interactive Map Visualization:

- **Google Maps Integration**: Interactive mapping interface for network visualization
- **Tower & Base Station Markers**: Visual representation of all network infrastructure points
- **Dynamic Coverage Radius Markers**: Real-time display of coverage zones and network availability areas
- **MapLibre Styling Support**: Advanced map styling and customization options

---

## API ENDPOINTS

### **GET** `/api/data`
Returns API configuration data for frontend integration
- **Response**: Google Maps API keys, Map ID, and MapBox styling information

### **GET** `/api/basestations`
Retrieves all base station records from the database
- **Response**: Complete list of base stations with coordinates and metadata

### **POST** `/api/basestations`
Creates a new base station record
- **Request Body**: Base station details (name, location, radius)
- **Response**: Saved base station object

### **POST** `/api/connectivity/checkConnectivity`
Core connectivity check endpoint - determines if network coverage is available at specified coordinates
- **Request Body**: 
  ```json
  {
    "clientlatitude": <number>,
    "clientlongitude": <number>
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Network is Available",
    "coordinates": { "nLat": <latitude>, "nLng": <longitude> }
  }
  ```
  or
  ```json
  {
    "message": "No connectivity"
  }
  ```

### **POST** `/api/orderform`
Handles order form submissions for additional services
- **Request Body**: Order details and customer information
- **Response**: Order confirmation with tracking details

---

## TECHNICAL ARCHITECTURE

### Technology Stack

- **Runtime**: Node.js with ES Modules
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Geospatial Calculations**: Haversine distance formula
- **Security**: CORS with whitelist, API authentication (to be enforced)
- **Additional Tools**: 
  - Nodemailer (email notifications)
  - Excel data processing (XLSX)
  - Environment configuration (dotenv)

### Database Structure

The application maintains two primary data models:

1. **BaseStationSchema**: LTE/Mobile base stations with geospatial indexing
2. **DivSchema**: Distribution points with district and regional categorization

Both models utilize MongoDB's 2dsphere geospatial indexing for efficient location-based queries.

---

## SECURITY IMPLEMENTATION

### Current Security Measures

1. **CORS Protection**: Domain whitelist validation on all incoming requests
2. **Body Parser Validation**: JSON payload size limits and validation
3. **Global Error Handler**: Centralized error handling to prevent information leakage
4. **MongoDB Connection**: Secure database credentials via environment variables

### Recommended Security Enhancements

The following security layers should be implemented to protect endpoints:

1. **API Key Authentication** (IMPLEMENTED - See below)
   - Validate API keys in request headers
   - Issue keys to authorized organizations and developers
   - Rotate keys periodically

2. **Rate Limiting**
   - Implement per-IP rate limiting (e.g., 100 requests/hour)
   - Prevent abuse and DDoS attacks on the connectivity check endpoint

3. **Request Validation**
   - Strict input validation for latitude/longitude parameters
   - Reject coordinates outside valid ranges (-90 to 90 for latitude, -180 to 180 for longitude)
   - Sanitize all user inputs

4. **HTTPS Enforcement**
   - All communications must use HTTPS/TLS
   - Redirect HTTP to HTTPS in production
   - Implement HSTS headers

5. **Logging & Monitoring**
   - Log all API requests with timestamps and user identifiers
   - Monitor for suspicious access patterns
   - Alert on authentication failures

6. **Data Protection**
   - Encrypt sensitive data in transit and at rest
   - Implement database encryption for MongoDB
   - Use VPN for internal communications

7. **Access Control**
   - Implement role-based access control (RBAC)
   - Corporate customers vs. internal users
   - Different permission levels for data access

---

## INSTALLATION & SETUP

### Prerequisites

- Node.js (v14 or higher)
- MongoDB instance
- npm or yarn package manager

### Installation Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd smartFind-server

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Create a .env file with the following:
PORT=5000
MONGODB_STRING=<your-mongodb-connection-string>
VITE_GOOGLE_API_KEY=<your-google-maps-api-key>
VITE_GOOGLE_MAP_ID=<your-google-map-id>
VITE_MAPBOX_STYLE_URL=<mapbox-style-url>
VITE_MAPBOX_ACCESS_TOKEN=<mapbox-token>
API_SECRET_KEY=<your-api-secret-key-for-authentication>

# 4. Start the development server
npm run dev

# 5. For production
npm start
```

---

## USAGE

### Example: Check Network Connectivity

```javascript
// Client-side example
const response = await fetch('http://localhost:5000/api/connectivity/checkConnectivity', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'your-api-key-here' // API authentication header
  },
  body: JSON.stringify({
    clientlatitude: 6.7241,
    clientlongitude: -1.0269
  })
});

const data = await response.json();
console.log(data);
// Response: { message: 'Network is Available', coordinates: { nLat: 6.7241, nLng: -1.0269 } }
```

---

## DEPLOYMENT

The application includes deployment configurations for:

- **Vercel**: Production deployment via `vercel.json`
- **Shell Script**: Custom deployment via `deploy.sh`

Configure environment variables on your hosting platform before deployment.

---

## TESTING

Run the test suite:

```bash
npm test
```

Tests are configured with Jest and Babel for ES module support.

---

## PROJECT STRUCTURE

```
smartFind-server/
├── index.js                          # Application entry point
├── dbconfig.js                       # MongoDB connection configuration
├── whitelist.js                      # CORS whitelist configuration
├── package.json                      # Dependencies
├── README.md                         # This file
├── deploy.sh                         # Deployment script
├── vercel.json                       # Vercel configuration
├── divstation.json                   # Sample DIV station data
├── model/
│   ├── BaseStationSchema.js          # Base station data model
│   ├── DivSchema.js                  # DIV station data model
│   └── OrderFormSchema.js            # Order form data model
├── routes/
│   ├── api.js                        # Configuration data endpoint
│   ├── basestations.js               # Base station CRUD operations
│   ├── connectivity.js               # Connectivity check endpoint
│   ├── divs.js                       # DIV station operations
│   └── orderForm.js                  # Order form submission endpoint
├── helpers/
│   ├── lte.middleware.js             # LTE network calculations (Haversine)
│   └── div.middleware.js             # DIV network calculations
└── test/
    └── db.test.js                    # Database tests
```

---

## CONNECTIVITY CHECK ALGORITHM

The system uses the **Haversine formula** to calculate great-circle distances between user coordinates and network infrastructure points:

1. **Check Base Stations First**: Query all LTE base stations within 10 km radius
2. **Fallback to DIV Stations**: If no base station coverage found, check DIV stations within 7 km radius
3. **Return Nearest Available**: Report the nearest infrastructure point with coverage

This two-tier approach ensures comprehensive network coverage detection.

---

## ENVIRONMENT VARIABLES

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_STRING` | MongoDB connection URI | `mongodb://...` |
| `VITE_GOOGLE_API_KEY` | Google Maps API key | `AIza...` |
| `VITE_GOOGLE_MAP_ID` | Google Map ID | `map-id-here` |
| `VITE_MAPBOX_STYLE_URL` | MapBox style URL | `https://api.mapbox...` |
| `VITE_MAPBOX_ACCESS_TOKEN` | MapBox access token | `pk.eyJ...` |
| `API_SECRET_KEY` | API authentication secret | `your-secret-key` |

---

## ERROR HANDLING

The application implements centralized error handling with:

- Validation error messages for invalid coordinates
- Database operation error reporting
- Generic error responses to prevent information disclosure
- Console logging for debugging (disabled in production)

---

## CONTRIBUTING

For contributions, please:

1. Follow the existing code structure and naming conventions
2. Add appropriate error handling
3. Test changes locally before submitting
4. Update documentation if modifying endpoints

---

## LICENSE

ISC

---

## SUPPORT

For issues, questions, or feature requests, please contact the development team or create an issue in the repository.
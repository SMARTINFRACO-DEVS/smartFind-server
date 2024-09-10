import mongoose from "mongoose";

// Define the DivSchema based on the provided JSON structure
const DivSchema = new mongoose.Schema({
    siteId: {
        type: String,
        required: true, // "Site ID"
    },
    town: {
        type: String,
        required: true, // "Town"
    },
    location: {
        type: {
            type: String,
            default: "Point" // Assuming GeoJSON format for spatial data
        },
        coordinates: {
            type: [Number], // Array to hold [longitude, latitude]
            required: true,
            index: "2dsphere", // For geospatial queries
        },
    },
    agencyType: {
        type: String, // "Agency Type"
        required: true,
    },
    district: {
        type: String, // "District"
        required: true,
    },
    region: {
        type: String, // "REGIONS"
        required: true,
    }
});

// Pre-save middleware to ensure proper format for location coordinates
DivSchema.pre('save', function (next) {
    if (this.location.coordinates.length !== 2) {
        next(new Error('Coordinates should contain exactly two values: longitude and latitude.'));
    } else {
        next();
    }
});

export default DivSchema;

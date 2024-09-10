export const isWithinCircularDIV = (searchLat, searchLng, centerLat, centerLng, radiusInKm) => {
    const searchLatNum = parseFloat(searchLat);
    const searchLngNum = parseFloat(searchLng);
    const centerLatNum = parseFloat(centerLat);
    const centerLngNum = parseFloat(centerLng);
  
    if (isNaN(searchLatNum) || isNaN(searchLngNum) || isNaN(centerLatNum) || isNaN(centerLngNum)) {
      return 'Invalid coordinates';
    }
  
    const distance = haversineDistance(centerLatNum, centerLngNum, searchLatNum, searchLngNum);
    return distance <= radiusInKm ? 'Within circular DIV' : 'Outside circular DIV';
  };
  
  // Utility function to check if a point is within a polygonal DIV
  export const isWithinPolygonalDIV = (searchLat, searchLng, polygon) => {
    const searchLatNum = parseFloat(searchLat);
    const searchLngNum = parseFloat(searchLng);
  
    if (isNaN(searchLatNum) || isNaN(searchLngNum)) {
      return 'Invalid coordinates';
    }
  
    const isInside = isPointInPolygon(searchLatNum, searchLngNum, polygon);
    return isInside ? 'Within polygonal DIV' : 'Outside polygonal DIV';
  };
  
  // Haversine distance function remains the same
  export const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };
  
  // Function to determine if a point is in a polygon using ray-casting algorithm
  export const isPointInPolygon = (lat, lng, polygon) => {
    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1];
      const xj = polygon[j][0], yj = polygon[j][1];
  
      const intersect = ((yi > lng) !== (yj > lng)) &&
        (lat < (xj - xi) * (lng - yi) / (yj - yi) + xi);
      if (intersect) isInside = !isInside;
    }
    return isInside;
  };
  
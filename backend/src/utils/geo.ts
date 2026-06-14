const EARTH_RADIUS_KM = 6371;

// 1. Convert degrees to radians (JS Math functions need radians)
//    radians = degrees * (Math.PI / 180)
const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180)
}

// 2. Calculate Δlat and Δlng (in radians)
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {

    const rLat1 = toRadians(lat1);
    const rLat2 = toRadians(lat2);
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    // 3. Apply the Haversine formula using Math.sin, Math.cos, Math.sqrt, Math.atan2
    const a =
        Math.sin(dLat / 2) ** 2 + 
        Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLng / 2 ) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    // 4. Multiply by Earth's radius (6371 km) to get the distance

    const distance = EARTH_RADIUS_KM * c;
    //return disrtance in km
    return Math.round(distance * 10) / 10; //round to 1 dp
} 
// Export a function to get a list of locations from a query using the nominatim openstreetmap API
export async function getSearchLocations(query) {
    if (query === "") return [];
    try {
        // Fetch the locations data with the query (encodeURIComponent replaces escape characters for use in URLs)
        const data = await fetch(
            `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
                query
            )}&format=json`
        );
        // Get the JSON data and format the return value
        const places = await data.json();
        return places.map(place => ({
            name: place.name,
            fullName: place.display_name,
            latitude: place.lat,
            longitude: place.lon
        }));
    } catch {
        // If an error occured then return an empty array
        return [];
    }
}

// Export a function to get location info for a specific latitude and longitude using the nominatim openstreetmap API
export async function getLocationInfo(latitude, longitude) {
    const data = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    const place = await data.json();
    // The reverse api does not give a name field, so go through the options and pick the most accurate one available
    const name =
        place.address.city ||
        place.address.town ||
        place.address.village ||
        place.address.hamlet ||
        place.address.municipality ||
        place.address.suburb ||
        place.address.city_district ||
        place.address.county ||
        place.address.country ||
        "Unknown Location";

    return { name, fullName: place.display_name, latitude: place.lat, longitude: place.lon };
}

// Export a function to detect the users current location
export async function detectCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                // Get the location info for the current position and call resolve on the result
                getLocationInfo(position.coords.latitude, position.coords.longitude).then(
                    location => resolve(location)
                );
            }, reject);
            return;
        }
        reject("Location not available");
    });
}

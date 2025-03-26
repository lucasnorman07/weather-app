import { detectCurrentLocation } from "./location_api.js";

// Choose a fallback location in case the current location could not be detected
const FALLBACK_LOCATION = {
    name: "Stockholm",
    fullName: "Stockholm, Stockholms kommun, Stockholms län, 111 29, Sverige",
    latitude: "59.3251172",
    longitude: "18.0710935"
};

// Export a function to get the currently active location from localStorage
export async function getActiveLocation() {
    const latestLocations = getLatestLocations();
    // Check if the latest locations from local storage is empty
    if (latestLocations.length === 0) {
        let location;
        try {
            // If local storage does not have an active location, then detect the users current location
            location = await detectCurrentLocation();
        } catch {
            // If the user doesn't allow access to their location then use a fallback
            location = FALLBACK_LOCATION;
        }
        // Set this as the active location (also adds it to the latest locations) and return it
        storeActiveLocation(location);
        return location;
    }
    // Return the latest location as the current location
    return latestLocations[0];
}

// Export a function to set a new location as the active location
export function storeActiveLocation(location) {
    const latestLocations = getLatestLocations();
    // If the location is already the latests location then don't add it
    if (
        latestLocations.length &&
        location.name === latestLocations[0].name &&
        location.fullName === latestLocations[0].fullName
    )
        return;

    // Add the location to latest locations
    latestLocations.unshift(location);
    // If there are more than 10 latest locations, then remove the last one
    if (latestLocations.length > 10) {
        latestLocations.pop();
    }
    localStorage.setItem("latestLocations", JSON.stringify(latestLocations));
}

// Export a function to simply get the latest locations as an array
export function getLatestLocations() {
    return JSON.parse(localStorage.getItem("latestLocations")) ?? [];
}

// Export a function to simply get the favorite locations as an array
export function getFavoriteLocations() {
    return JSON.parse(localStorage.getItem("favoriteLocations")) ?? [];
}

// Export a function to add a favorite location to local storage
export function addFavoriteLocation(location) {
    const favoriteLocations = getFavoriteLocations();
    // Do not add the location if it already exists
    if (favoriteLocations.some(l => l.fullName === location.fullName)) return;
    // Add the location and store it in local storage
    favoriteLocations.push(location);
    localStorage.setItem("favoriteLocations", JSON.stringify(favoriteLocations));
}

// Export a function to remove a favorite location from local storage
export function removeFavoriteLocation(location) {
    const favoriteLocations = getFavoriteLocations();
    // Find the index of the location
    const index = favoriteLocations.findIndex(l => l.fullName === location.fullName);
    // If the location does not exist then just return
    if (index === -1) return;
    // Remove the location and update local storage
    favoriteLocations.splice(index, 1);
    localStorage.setItem("favoriteLocations", JSON.stringify(favoriteLocations));
}

import { updateLocationButtonText } from "./modules/location_pop_up.js";
import { getActiveLocation } from "./modules/location_storage.js";
import showWeatherData from "./modules/view.js";

// Show the active location when the page loads
const location = await getActiveLocation();
showWeatherData(location);
updateLocationButtonText(location.name);

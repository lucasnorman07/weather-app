const CACHE_NAME = "weather-app-cache-v0";
const FILES_TO_CACHE = [
    // Default route
    ".",
    // HTML
    "index.html",
    // CSS (everything is compiled into one CSS file)
    "css/style.css",
    // JS
    "js/main.js",
    "js/modules/weather_codes.js",
    "js/modules/weather_code_map.js",
    "js/modules/weather_api.js",
    "js/modules/view.js",
    "js/modules/location_storage.js",
    "js/modules/location_pop_up.js",
    "js/modules/html_generator.js",
    "js/modules/display/aqi.js",
    "js/modules/display/daily_weather.js",
    "js/modules/display/day_night.js",
    "js/modules/display/hourly_weather.js",
    "js/modules/display/precipitation.js",
    // Icons
    "assets/icons/weather/thunderstorm_with_hail.svg",
    "assets/icons/weather/clear-night.svg",
    "assets/icons/weather/cloudy.svg",
    "assets/icons/weather/drizzle.svg",
    "assets/icons/weather/foggy.svg",
    "assets/icons/weather/freezing_drizzle.svg",
    "assets/icons/weather/freezing_rain.svg",
    "assets/icons/weather/heavy_drizzle.svg",
    "assets/icons/weather/heavy_rain.svg",
    "assets/icons/weather/heavy_showers.svg",
    "assets/icons/weather/heavy_showers-night.svg",
    "assets/icons/weather/heavy_snow.svg",
    "assets/icons/weather/light_drizzle.svg",
    "assets/icons/weather/light_freezing_drizzle.svg",
    "assets/icons/weather/light_freezing_rain.svg",
    "assets/icons/weather/light_rain.svg",
    "assets/icons/weather/light_showers.svg",
    "assets/icons/weather/light_showers-night.svg",
    "assets/icons/weather/light_snow.svg",
    "assets/icons/weather/light_snow_showers.svg",
    "assets/icons/weather/light_snow_showers-night.svg",
    "assets/icons/weather/light_thunderstorms_with_hail.svg",
    "assets/icons/weather/mainly_clear-night.svg",
    "assets/icons/weather/mainly_sunny.svg",
    "assets/icons/weather/partly_cloudy.svg",
    "assets/icons/weather/partly_cloudy-night.svg",
    "assets/icons/weather/rain.svg",
    "assets/icons/weather/rime_fog.svg",
    "assets/icons/weather/showers.svg",
    "assets/icons/weather/showers-night.svg",
    "assets/icons/weather/snow.svg",
    "assets/icons/weather/snow_grains.svg",
    "assets/icons/weather/snow_showers.svg",
    "assets/icons/weather/snow_showers-night.svg",
    "assets/icons/weather/sunny.svg",
    "assets/icons/weather/thunderstorm.svg",
    "assets/icons/dewpoint.svg",
    "assets/icons/humidity.svg",
    "assets/icons/location.svg",
    "assets/icons/logo.png",
    "assets/icons/logo.svg",
    "assets/icons/logo-512.png",
    "assets/icons/logo-maskable.png",
    "assets/icons/logo-maskable.webp",
    "assets/icons/pressure.svg",
    "assets/icons/star.svg",
    "assets/icons/unstar.svg",
    "assets/icons/uv_index.svg",
    "assets/icons/visibility.svg",
    "assets/icons/wind_speed.svg",
    // Manifest for PWA
    "manifest.json"
];

self.addEventListener("install", async e => {
    console.log("[SW] install");
    // Add the FILES_TO_CACHE to the cache with the name CACHE_NAME
    const cache = await caches.open(CACHE_NAME);
    self.skipWaiting();
    cache.addAll(FILES_TO_CACHE);
});

self.addEventListener("activate", async e => {
    console.log("[SW] activate");
    self.skipWaiting();
    e.waitUntil(cleanUpCache());
});

self.addEventListener("fetch", async e => {
    e.respondWith(fetchAssets(e));
});

async function cleanUpCache() {
    const keys = await caches.keys();
    const keysToDelete = keys.map(key => {
        if (key !== CACHE_NAME) {
            return caches.delete(key);
        }
    });

    return Promise.all(keysToDelete);
}

async function fetchAssets(e) {
    try {
        const response = await fetch(e.request);
        return response;
    } catch {
        const cache = await caches.open(CACHE_NAME);
        return cache.match(e.request);
    }
}

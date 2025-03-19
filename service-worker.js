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
    // TODO!
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

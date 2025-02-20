import getWeatherCodeMap from "./weather_code_map.js";

let weatherCodeMap = getWeatherCodeMap();

// Replace any string intervals with entries for each number in the interval
for (const weatherCode in weatherCodeMap) {
    if (weatherCode.includes("-")) {
        const interval = weatherCode.split("-");
        for (let i = +interval[0]; i <= +interval[1]; i++) {
            weatherCodeMap[i] = weatherCodeMap[weatherCode];
        }
        delete weatherCodeMap[weatherCode];
    }
}

// If the night data is not specified, then set it to the same as the day
for (const weatherCode in weatherCodeMap) {
    if (weatherCodeMap[weatherCode].night == null) {
        weatherCodeMap[weatherCode].night = weatherCodeMap[weatherCode].day;
    }
}

export function getWeatherDescription(weatherCode, isDay) {
    if (isDay) return weatherCodeMap[weatherCode].day.description;
    else return weatherCodeMap[weatherCode].night.description;
}

export function getWeatherIcon(weatherCode, isDay) {    
    if (isDay) return weatherCodeMap[weatherCode].day.icon;
    else return weatherCodeMap[weatherCode].night.icon;
}

import { getWeatherDescription, getWeatherIcon } from "./weather_codes.js";

// These functions are used to construct URLs to get the weather and air quality data on a certain location
const weatherDataURL = (latitude, longitude) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m&hourly=precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,dew_point_2m,temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,visibility,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&wind_speed_unit=ms&timezone=auto&past_days=1&forecast_days=16`;
const airQualityDataURL = (latitude, longitude) =>
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=pm10,pm2_5,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=auto`;

// These functions are used to retrive weather and air quality data from the URLs
async function getWeatherData(latitude, longitude) {
    const respone = await fetch(weatherDataURL(latitude, longitude));
    return await respone.json();
}
async function getAirQualityData(latitude, longitude) {
    const respone = await fetch(airQualityDataURL(latitude, longitude));
    return await respone.json();
}

// Helper function to apply a timezone offset to a date/time string
function applyTimezone(dateString, utcOffsetSeconds) {
    const sign = utcOffsetSeconds < 0 ? "-" : "+";
    const offsetSeconds = Math.abs(utcOffsetSeconds);
    const hours = "" + Math.floor(offsetSeconds / 3600);
    const minutes = "" + Math.floor((offsetSeconds % 3600) / 60);
    return `${dateString}${sign}${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
}

// Helper function to create date objects from a date string and a timezone offset
function createDate(dateString, utcOffsetSeconds) {
    return new Date(applyTimezone(dateString, utcOffsetSeconds));
}

// Helper function to only take the hours and minutes (time) from a date string
function extractTime(dateString) {
    return dateString.split("T").at(-1);
}

// This function parses the current weather data from the API and converts it to a more usable format
function parseCurrentWeather(data) {
    const {
        temperature_2m: currentTemp,
        apparent_temperature: apparentTemp,
        weather_code: weatherCode
    } = data.current;
    // Skip the first day in the array (yesterday)
    const {
        temperature_2m_max: [_yesterday_max, maxTemp],
        temperature_2m_min: [_yesterday_min, minTemp]
    } = data.daily;
    return {
        currentTemp: Math.round(currentTemp),
        apparentTemp: Math.round(apparentTemp),
        weatherText: getWeatherDescription(weatherCode, data.current.is_day),
        weatherIcon: getWeatherIcon(weatherCode, data.current.is_day),
        maxTemp: Math.round(maxTemp),
        minTemp: Math.round(minTemp)
    };
}

// This function parses the current weather conditions from the API and converts it to a more usable format
function parseWeatherConditions(data) {
    const {
        wind_speed_10m: windSpeed,
        surface_pressure: pressure,
        relative_humidity_2m: humidity
    } = data.current;
    const {
        visibility: [visibility],
        dew_point_2m: [dewpoint]
    } = data.hourly;
    // Skip the first day in the array (yesterday)
    const {
        uv_index_max: [_yesterday_uv, uvIndex]
    } = data.daily;
    return {
        windSpeed,
        pressure,
        humidity,
        uvIndex,
        visibility,
        dewpoint: Math.round(dewpoint)
    };
}

// This function parses the sunrise/sunset data from the API and converts it to a more usable format
function parseDayNightData(data) {
    const { is_day: isDay } = data.current;

    const {
        sunrise: [_previousSunrise, sunrise, nextSunrise],
        sunset: [previousSunset, sunset]
    } = data.daily;
    return {
        isDay,
        previousSunset: createDate(previousSunset, data.utc_offset_seconds),
        sunrise: createDate(sunrise, data.utc_offset_seconds),
        sunset: createDate(sunset, data.utc_offset_seconds),
        nextSunrise: createDate(nextSunrise, data.utc_offset_seconds),
        previousSunsetString: extractTime(previousSunset),
        sunriseString: extractTime(sunrise),
        sunsetString: extractTime(sunset),
        nextSunriseString: extractTime(nextSunrise)
    };
}

// This function parses the precipiation probabilities for each hour to a more usable format
function parsePrecipitation(data) {
    // Track how many hours that are filtered away so that the hours can be indexed correctly
    let filteredHours = 0;
    // Loop over all of the hours and construct an object with the precipitation probability and time
    return (
        data.hourly.time
            // Filter away any hours that have passed already
            .filter((time, _i) => {
                const keepHour = new Date() < createDate(time, data.utc_offset_seconds);
                if (!keepHour) filteredHours++;
                return keepHour;
            })
            // Only take the next 24 hours (one day)
            .slice(0, 24)
            // Loop over the 24 hours and construct a data object for that hour
            .map((time, i) => {
                return {
                    precipitationProbability:
                        data.hourly.precipitation_probability[i + filteredHours] / 100,
                    time: extractTime(time).slice(0, 2)
                };
            })
    );
}

// This function parser the air quality and pollen data from the API to a more usable format
function parseAirQuality(data) {
    const {
        alder_pollen: alderPollen,
        birch_pollen: birchPollen,
        european_aqi: AQI,
        grass_pollen: grassPollen,
        mugwort_pollen: mugwortPollen,
        olive_pollen: olivePollen,
        ragweed_pollen: ragweedPollen
    } = data.current;
    return {
        alderPollen,
        birchPollen,
        AQI,
        grassPollen,
        mugwortPollen,
        olivePollen,
        ragweedPollen
    };
}

// This function parses the hourly weather data from the API to a more usable format
function parseHourlyWeather(data) {
    // Track how many hours that are filtered away so that the hours can be indexed correctly
    let filteredHours = 0;
    // Loop over all of the hours and construct an object with the weather and time
    return (
        data.hourly.time
            // Filter away any hours that have passed already
            .filter((time, _i) => {
                const keepHour = new Date() < createDate(time, data.utc_offset_seconds);
                if (!keepHour) filteredHours++;
                return keepHour;
            })
            // Only take the next 24 hours (one day)
            .slice(0, 24)
            // Loop over the 24 hours and construct a data object for that hour
            .map((time, i) => {
                const weatherCode = data.hourly.weather_code[i + filteredHours];
                const date = createDate(time, data.utc_offset_seconds);
                const dayIndex = Math.floor((i + filteredHours) / 24);
                // Calculate if the current hour has day light or not
                const isDay =
                    date >= createDate(data.daily.sunrise[dayIndex], data.utc_offset_seconds) &&
                    date <= createDate(data.daily.sunset[dayIndex], data.utc_offset_seconds);

                return {
                    temp: Math.round(data.hourly.temperature_2m[i + filteredHours]),
                    weatherText: getWeatherDescription(weatherCode, isDay),
                    weatherIcon: getWeatherIcon(weatherCode, isDay),
                    time: extractTime(time)
                };
            })
    );
}

// This function parses the daily weather data from the API to a more usable format
function parseDailyWeather(data) {
    // Loop over all of the days and construct a data object for that day
    const days = data.daily.time.map((time, i) => {
        const weatherCode = data.daily.weather_code[i];
        return {
            minTemp: Math.round(data.daily.temperature_2m_min[i]),
            maxTemp: Math.round(data.daily.temperature_2m_max[i]),
            // Pass true to get day icons
            weatherText: getWeatherDescription(weatherCode, true),
            weatherIcon: getWeatherIcon(weatherCode, true),
            // Choose a correct name for the day
            name: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][
                new Date(time).getDay()
            ],
            time
        };
    });

    // Set the previous day and the current day names
    days[0].name = "Yesterday";
    days[1].name = "Today";

    return days;
}

// Export a function to retrive all of the weather data as a single object using the functions above
export default async function (latitude, longitude) {
    const weatherData = await getWeatherData(latitude, longitude);
    const airQualityData = await getAirQualityData(latitude, longitude);

    return {
        latitude,
        longitude,
        ...parseCurrentWeather(weatherData),
        ...parseWeatherConditions(weatherData),
        daily: parseDailyWeather(weatherData),
        hourly: parseHourlyWeather(weatherData),
        ...parseDayNightData(weatherData),
        ...parseAirQuality(airQualityData),
        precipitation: parsePrecipitation(weatherData),
        timezone: weatherData.timezone,
        time: new Date(),
        // Format the date into a time string in the local time of the specified timezone
        timeString: new Date()
            .toLocaleTimeString("sv-SE", { timeZone: weatherData.timezone })
            .slice(0, -3)
    };
}

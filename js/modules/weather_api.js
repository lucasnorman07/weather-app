import { getWeatherDescription, getWeatherIcon } from "./weather_codes.js";

// TODO, update urls to only include the necessary data ;)
const weatherDataURL = (latitude, longitude, timezone) =>
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m&hourly=precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,dew_point_2m,temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,visibility,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&wind_speed_unit=ms&timezone=${timezone}&past_days=2&forecast_days=16`;
const airQualityDataURL = (latitude, longitude, timezone) =>
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&hourly=pm10,pm2_5,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=${timezone}`;

async function getWeatherData(latitude, longitude, timezone) {
    const respone = await fetch(weatherDataURL(latitude, longitude, timezone));
    return await respone.json();
}
async function getAirQualityData(latitude, longitude, timezone) {
    const respone = await fetch(airQualityDataURL(latitude, longitude, timezone));
    return await respone.json();
}
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
        weatherIcon: getWeatherIcon(weatherCode, data.current.isDay),
        maxTemp: Math.round(maxTemp),
        minTemp: Math.round(minTemp)
    };
}
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
function parseDayNightData(data) {
    const { is_day: isDay } = data.current;
    const {
        sunrise: [sunrise],
        sunset: [sunset]
    } = data.daily;
    return {
        isDay,
        sunrise: new Date(sunrise).getHours() + ":" + new Date(sunrise).getMinutes(),
        sunset: new Date(sunset).getHours() + ":" + new Date(sunset).getMinutes()
    };
}
function parsePrecipitation(data) {
    // Loop over all of the hours and construct an object with the precipitation probability and time
    return data.hourly.time.map((time, i) => {
        return {
            precipitationProbability: data.hourly.precipitation_probability[i] / 100,
            time: new Date(time).getHours()
        };
    });
}
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
function parseHourlyWeather(data) {
    // Loop over all of the hours and construct a data object for that hour
    return data.hourly.time.map((time, i) => {
        const weatherCode = data.hourly.weather_code[i];
        const currentDate = new Date(time);
        const dayIndex = Math.floor(i / 24);
        // Calculate if the current hour has day light or not
        const isDay =
            currentDate > new Date(data.daily.sunrise[dayIndex]) &&
            currentDate < new Date(data.daily.sunset[dayIndex]);

        return {
            temp: Math.round(data.hourly.temperature_2m[i]),
            weatherText: getWeatherDescription(weatherCode, isDay),
            weatherIcon: getWeatherIcon(weatherCode, isDay),
            time: `${currentDate.getHours()}:00`
        };
    });
}
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
            name: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][
                new Date(time).getDay()
            ],
            time
        };
    });

    // Update the previous day and the current day
    days[0].name = "Yesterday";
    days[1].name = "Today";

    return days;
}
export default async function (latitude, longitude) {
    const weatherData = await getWeatherData(
        latitude,
        longitude,
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    const airQualityData = await getAirQualityData(
        latitude,
        longitude,
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );
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
        time: new Date().getHours() + ":" + new Date().getMinutes()
    };
}

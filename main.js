(async () => {
    // TODO, update urls to only include the necessary data ;)
    const weatherDataURL = (latitude, longitude, timezone) =>
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m&hourly=precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,dew_point_2m,temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,visibility,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&wind_speed_unit=ms&timezone=${timezone}&past_days=1`;
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
            temperature_2m: temp,
            apparent_temperature: apparentTemp,
            weather_code: weatherCode
        } = data.current;
        // skip the first day in the array (yesterday)
        const {
            temperature_2m_max: [_yesterday_max, maxTemp],
            temperature_2m_min: [_yesterday_min, minTemp]
        } = data.daily;
        return {
            temp,
            apparentTemp,
            weatherCode,
            maxTemp,
            minTemp
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
            dew_point_2m: [dewPoint]
        } = data.hourly;
        // skip the first day in the array (yesterday)
        const {
            uv_index_max: [_yesterday_uv, uvIndex]
        } = data.daily;
        return {
            windSpeed,
            pressure,
            humidity,
            uvIndex,
            visibility,
            dewPoint
        };
    }
    function parseGetDayNightData(data) {
        const { is_day: isDay } = data.current;
        const {
            sunrise: [sunrise],
            sunset: [sunset]
        } = data.daily;
        return {
            isDay,
            sunrise,
            sunset
        };
    }
    function parsePrecipitation(data) {
        // loop over all of the hours and construct an object with the precipitation probability and time
        return data.hourly.time.map((time, i) => {
            return {
                precipitationProbability: data.hourly.precipitation_probability[i],
                time
            };
        });
    }
    function parseAirQuality(data) {
        const {
            alder_pollen: alderPollen,
            birch_pollen: birchPollen,
            european_aqi: europeanAQI,
            grass_pollen: grassPollen,
            mugwort_pollen: mugwortPollen,
            olive_pollen: olivePollen,
            ragweed_pollen: ragweedPollen
        } = data.current;
        return {
            alderPollen,
            birchPollen,
            europeanAQI,
            grassPollen,
            mugwortPollen,
            olivePollen,
            ragweedPollen
        };
    }
    function parseHourlyWeather(data) {
        // loop over all of the hours and construct a data object for that hour
        return data.hourly.time.map((time, i) => {
            return {
                temp: data.hourly.temperature_2m[i],
                weatherCode: data.hourly.weather_code[i],
                time
            };
        });
    }
    function parseDailyWeather(data) {
        // loop over all of the days and construct a data object for that day
        return data.daily.time.map((time, i) => {
            return {
                minTemp: data.daily.temperature_2m_min[i],
                maxTemp: data.daily.temperature_2m_max[i],
                weatherCode: data.daily.weather_code[i],
                time
            };
        });
    }
    const weatherData = await getWeatherData(
        58,
        13,
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    const airQualityData = await getAirQualityData(
        58,
        13,
        Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    console.log({ airQualityData });
    console.log("Air quality", parseAirQuality(airQualityData));
    console.log({ weatherData });
    console.log("Current", parseCurrentWeather(weatherData));
    console.log("Conditions", parseWeatherConditions(weatherData));
    console.log("Hourly", parseHourlyWeather(weatherData));
    console.log("Daily", parseDailyWeather(weatherData));
    console.log("Night day", parseGetDayNightData(weatherData));
    console.log("Precip", parsePrecipitation(weatherData));
})();

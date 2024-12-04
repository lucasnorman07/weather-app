import getWeatherData from "./model.js"
import displayAQI from "./modules/aqi.js";
import displayDayNightData from "./modules/day_night.js";
import displayPrecipitation from "./modules/precipitation.js";
import displayHourlyWeather from "./modules/hourly_weather.js"
import displayDailyWeather from "./modules/daily_weather.js"

// const weatherData = {
//     currentTemp: -12,
//     apparentTemp: -3,
//     weatherText: "Heavy snow",
//     weatherIcon: "../temp/tempWeatherIcon.png",
//     maxTemp: 3,
//     minTemp: -24,
//     humidity: 75,
//     pressure: 1326,
//     visibility: 0.3,
//     uvIndex: 5.6,
//     windSpeed: 12,
//     dewpoint: 7.6,
//     sunrise: "7:40",
//     sunset: "23:30",
//     AQI: 51,
//     grassPollen: "High",
//     birchPollen: "None",
//     ragweedPollen: "Low",
//     alderPollen: "High",
//     precipitation: [
//         { time: "06", precipitationProbability: Math.random() },
//         { time: "07", precipitationProbability: Math.random() },
//         { time: "08", precipitationProbability: Math.random() },
//         { time: "09", precipitationProbability: Math.random() },
//         { time: "10", precipitationProbability: Math.random() },
//         { time: "11", precipitationProbability: Math.random() },
//         { time: "12", precipitationProbability: Math.random() },
//         { time: "13", precipitationProbability: Math.random() },
//         { time: "15", precipitationProbability: Math.random() },
//         { time: "16", precipitationProbability: Math.random() },
//         { time: "17", precipitationProbability: Math.random() },
//         { time: "18", precipitationProbability: Math.random() },
//         { time: "19", precipitationProbability: Math.random() },
//         { time: "20", precipitationProbability: Math.random() },
//         { time: "21", precipitationProbability: Math.random() }
//     ],
//     hourly: [
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" },
//         { temp: 34, weatherIcon: "../temp/sunIcon.png", time: "12:56" }
//     ],
//     daily: [
//         {
//             dayName: "Yesterday",
//             maxTemp: 19,
//             minTemp: 4,
//             weatherIcon: "../temp/tempWeatherIcon.png"
//         },
//         { dayName: "Today", maxTemp: 19, minTemp: 4, weatherIcon: "../temp/tempWeatherIcon.png" },
//         { dayName: "Tuesday", maxTemp: 19, minTemp: 4, weatherIcon: "../temp/tempWeatherIcon.png" },
//         {
//             dayName: "Wednesday",
//             maxTemp: 19,
//             minTemp: 4,
//             weatherIcon: "../temp/tempWeatherIcon.png"
//         },
//         {
//             dayName: "Thursday",
//             maxTemp: 19,
//             minTemp: 4,
//             weatherIcon: "../temp/tempWeatherIcon.png"
//         },
//         { dayName: "Friday", maxTemp: 19, minTemp: 4, weatherIcon: "../temp/tempWeatherIcon.png" },
//         {
//             dayName: "Saturday",
//             maxTemp: 19,
//             minTemp: 4,
//             weatherIcon: "../temp/tempWeatherIcon.png"
//         },
//         { dayName: "Sunday", maxTemp: 19, minTemp: 4, weatherIcon: "../temp/tempWeatherIcon.png" }
//     ],
//     time: new Date().getHours() + ":" + new Date().getMinutes()
// };

const weatherData = await getWeatherData();

console.log( weatherData );

function timeToSeconds(time) {
    const [hours, minutes] = time.split(":");
    return (+hours * 60 + +minutes) * 60;
}

// console.log((weatherData.time - weatherData.sunrise) / (weatherData.sunset - weatherData.sunrise));

displayDayNightData(
    (timeToSeconds(weatherData.time) - timeToSeconds(weatherData.sunrise)) /
        (timeToSeconds(weatherData.sunset) - timeToSeconds(weatherData.sunrise))
);

displayAQI(weatherData.AQI);

displayPrecipitation(weatherData.precipitation);

displayHourlyWeather(weatherData.hourly);

displayDailyWeather(weatherData.daily);

function setPropertyValue(element, value) {
    if (element.tagName === "IMG") {
        element.src = value;
    } else {
        element.textContent = value;
    }
}

$("[data-property]").each(function () {
    setPropertyValue(this, weatherData[this.dataset.property]);
});


{/* <div class="hourly-weather-item">
    <p data-array-element-property="time" class="hourly-weather-item-time">
        06:00
    </p>
    <img
        data-array-element-property="weatherIcon"
        src="temp/tempWeatherIcon.png"
        alt="Weather"
    />
    <p>
        <span
            data-array-element-property="temp"
            class="hourly-weather-item-temperature"
            >22</span
        >°
    </p>
</div> */}

$("[data-array-property]").each(function () {
    // Store the parent element so it can be referenced in the inner loop (because it overrides "this")
    const wrapper = this;

    // Track the count of each property so they can be indexed correctly
    const propertiesCount = new Map();
    $(
        `[data-array-property="${wrapper.dataset.arrayProperty}"] [data-array-element-property]`
    ).each(function () {
        const index = propertiesCount.get(this.dataset.arrayElementProperty) || 0;
        console.log(wrapper.dataset.arrayProperty);
        
        setPropertyValue(
            this,
            weatherData[wrapper.dataset.arrayProperty][index][this.dataset.arrayElementProperty]
        );

        propertiesCount.set(this.dataset.arrayElementProperty, index + 1);
    });
});

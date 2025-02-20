import getWeatherData from "./weather_api.js"
import displayAQI from "./display/aqi.js";
import displayDailyWeather from "./display/daily_weather.js";
import displayDayNightData from "./display/day_night.js";
import displayHourlyWeather from "./display/hourly_weather.js";
import displayPrecipitation from "./display/precipitation.js";

export default async function (location) {
    const weatherData = await getWeatherData(location.latitude, location.longitude);

    displayDayNightData(
        (timeToSeconds(weatherData.time) - timeToSeconds(weatherData.sunrise)) /
            (timeToSeconds(weatherData.sunset) - timeToSeconds(weatherData.sunrise))
    );
    displayAQI(weatherData.AQI);
    displayPrecipitation(weatherData.precipitation);
    displayHourlyWeather(weatherData.hourly);
    displayDailyWeather(weatherData.daily);

    $("[data-property]").each(function () {
        setPropertyValue(this, weatherData[this.dataset.property]);
    });

    $("[data-array-property]").each(function () {
        // Store the parent element so it can be referenced in the inner loop (because it overrides "this")
        const wrapper = this;

        // Track the count of each property so they can be indexed correctly
        const propertiesCount = new Map();
        $(
            `[data-array-property="${wrapper.dataset.arrayProperty}"] [data-array-element-property]`
        ).each(function () {
            const index = propertiesCount.get(this.dataset.arrayElementProperty) || 0;

            setPropertyValue(
                this,
                weatherData[wrapper.dataset.arrayProperty][index][this.dataset.arrayElementProperty]
            );

            propertiesCount.set(this.dataset.arrayElementProperty, index + 1);
        });
    });
}

function timeToSeconds(time) {
    const [hours, minutes] = time.split(":");
    return (+hours * 60 + +minutes) * 60;
}

function setPropertyValue(element, value) {
    if (element.tagName === "IMG") {
        element.src = value;
    } else {
        element.textContent = value;
    }
}

$("[data-horizontal-scroll], [data-vertical-scroll]").each(function () {
    const horizontalScroll = this.dataset.horizontalScroll != null;

    // This tracks if the mouse is pressed or not
    this.onmousedown = () => {
        this.dataset.mouseDown = "";
    };
    this.onmouseup = this.onmouseleave = () => {
        delete this.dataset.mouseDown;
        delete this.dataset.previousPosition;
    };

    // If the mouse is pressed and moved then scroll horizontally
    this.onmousemove = e => {
        if (this.dataset.mouseDown == null) return;

        const currentPosition = horizontalScroll ? e.pageX : e.pageY;

        this.dataset.previousPosition = this.dataset.previousPosition ?? currentPosition;
        if (horizontalScroll) this.scrollBy(-(currentPosition - +this.dataset.previousPosition), 0);
        else this.scrollBy(0, -(currentPosition - +this.dataset.previousPosition));
        this.dataset.previousPosition = currentPosition;
    };
});

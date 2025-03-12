import createElement from "../html_generator.js";

// Export a function to generate HTML elements to display weather data for each hour
export default function (hours) {
    $("#hourly-weather-items").empty();

    hours.forEach(hour => {
        const weatherItem = createElement("div", {
            classList: "hourly-weather-item",
            children: [
                createElement("p", {
                    classList: "hourly-weather-item-time",
                    textContent: hour.time
                }),
                createElement("img", {
                    src: hour.weatherIcon,
                    alt: "Weather"
                }),
                createElement("p", {
                    classList: "hourly-weather-item-temperature",
                    textContent: hour.temp
                })
            ]
        });

        $("#hourly-weather-items").append(weatherItem);
    });
}

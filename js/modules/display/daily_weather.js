import createElement from "../html_generator.js";

// Export a function to generate HTML elements to display weather data for each day
export default function (days) {
    $("#daily-weather-items").empty();

    days.forEach(day => {
        const weatherItem = createElement("div", {
            classList: "daily-weather-item",
            children: [
                createElement("p", {
                    classList: "daily-weather-item-day",
                    textContent: day.name
                }),
                createElement("img", {
                    src: day.weatherIcon,
                    alt: "Weather"
                }),
                createElement("p", {
                    classList: "daily-weather-item-max-temperature",
                    textContent: day.maxTemp
                }),
                createElement("p", {
                    classList: "daily-weather-item-min-temperature",
                    textContent: day.minTemp
                })
            ]
        });

        $("#daily-weather-items").append(weatherItem);
    });
}

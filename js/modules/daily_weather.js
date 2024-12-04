import createElement from "./html_generator.js";

export default function (days) {
    days.forEach(day => {
        const weatherItem = createElement("div", {
            classList: "daily-weather-item",
            children: [
                createElement("p", {
                    classList: "daily-weather-item-day",
                    textContent: "Friday!"
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

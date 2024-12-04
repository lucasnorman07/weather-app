import createElement from "./html_generator.js";

export default function (hours) {
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

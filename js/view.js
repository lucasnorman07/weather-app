const weatherData = { currentTemp: -12, apparentTemp: -3, weatherText: "Heavy snow", weatherIcon: "../temp/sunIcon.png", maxTemp: 3, minTemp: -24, time: new Date().getHours() + ":" + new Date().getMinutes() };

console.log({weatherData});

$("[data-property]").each(function() {
    if (this.tagName === "IMG") {
        this.src = weatherData[this.dataset.property];
    } else {
        this.textContent = weatherData[this.dataset.property];
    }
});


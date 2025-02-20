export default function (AQI) {
    const aqiIndicator = $("#aqi-indicator");
    const airQualityMeter = $("#aqi-meter");
    let aqiText;
    let aqiColor;
    if (AQI >= 100) {
        aqiText = "Very Poor";
        aqiColor = "red";
    } else if (AQI > 75) {
        aqiText = "Poor";
        aqiColor = "orange";
    } else if (AQI > 50) {
        aqiText = "Moderate";
        aqiColor = "yellow";
    } else if (AQI > 25) {
        aqiText = "Good";
        aqiColor = "lightgreen";
    } else {
        aqiText = "Very good";
        aqiColor = "green";
    }

    aqiIndicator.text(`${aqiText} (${AQI})`);
    airQualityMeter.val(AQI);
    // Change the "color" of the meter so the progress value color can use "currentColor"
    airQualityMeter.css("color", aqiColor);
}

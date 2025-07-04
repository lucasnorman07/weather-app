// Export a function to update the air quality meter and indicator text
export default function (AQI) {
    const aqiIndicator = $("#aqi-indicator");
    const airQualityMeter = $("#aqi-meter");
    let aqiText;
    let aqiColor;
    if (AQI >= 100) {
        aqiText = "Extremely Poor";
        aqiColor = "purple";
    } else if (AQI >= 80) {
        aqiText = "Very Poor";
        aqiColor = "red";
    } else if (AQI > 60) {
        aqiText = "Poor";
        aqiColor = "orange";
    } else if (AQI > 40) {
        aqiText = "Moderate";
        aqiColor = "yellow";
    } else if (AQI > 20) {
        aqiText = "Fair";
        aqiColor = "lightgreen";
    } else {
        aqiText = "Good";
        aqiColor = "green";
    }

    aqiIndicator.text(`${aqiText} (${AQI})`);
    airQualityMeter.val(AQI);
    // Change the "color" of the meter so the progress value color can use "currentColor"
    airQualityMeter.css("color", aqiColor);
}

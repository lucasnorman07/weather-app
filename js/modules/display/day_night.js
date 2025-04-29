const $title = $("#day-night-card-title");
const $sunriseText = $("#sunrise");
const $sunsetText = $("#sunset");
const $canvas = $("#day-night-canvas");
const ctx = $canvas.get(0).getContext("2d");

// Define a scale factor to use to improve the resolution
const RESOLUTION_UPSCALE = 3;
const LINE_WIDTH = 3;
const INSET = { x: 13, y: 12 };
const SUN_RADIUS = 12;

let width, height;
let ELLIPSE_WIDTH;
let ELLIPSE_HEIGHT;
const resize = () => {
    [width, height] = [$canvas.width(), $canvas.height()];
    $canvas.prop("width", width * RESOLUTION_UPSCALE);
    $canvas.prop("height", height * RESOLUTION_UPSCALE);

    ELLIPSE_WIDTH = width - INSET.x * 2;
    ELLIPSE_HEIGHT = height - INSET.y;
};
resize();

// Save the day night data so it can be re-rendered if the window is resized
let savedDayNightData;

// In case the canvas is resized, then update the canvas width and height and re-render
$(window).on("resize", () => {
    resize();
    render(savedDayNightData);
});

// Helper function to get the x and y positions (-1 to 1) from a percentage (0 = left, 1 = right)
function getCirclePosition(position) {
    return {
        x: Math.cos(((position - 1) * 180 * Math.PI) / 180),
        y: Math.sin(((position - 1) * 180 * Math.PI) / 180)
    };
}

// Export a function to render the day-night graph
export default function render(dayNightData) {
    // Save the day night data
    savedDayNightData = dayNightData;

    // Extract the necessary variables
    const {
        time,
        previousSunset,
        sunrise,
        sunset,
        nextSunrise,
        previousSunsetString,
        sunriseString,
        sunsetString,
        nextSunriseString
    } = dayNightData;

    // This is used later to render correctly
    const isDay = time >= sunrise && time <= sunset;
    let sunPosition = 0;

    if (time < sunrise) {
        // If the sun is not up yet then set the sun position to the sunrise
        sunPosition = (time - previousSunset) / (sunset - previousSunset);

        // If the sun is not up yet then set the title to night and the texts to previousSunrise and sunrise
        $title.text("Time of night");
        $sunriseText.text(previousSunsetString);
        $sunsetText.text(sunriseString);
    } else if (time > sunset) {
        // If the sun has passed then set the sun position to the next sunrise
        sunPosition = (time - sunset) / (nextSunrise - sunset);

        // If the sun has passed then set the title to night and the texts to sunset and nextSunrise
        $title.text("Time of night");
        $sunriseText.text(sunsetString);
        $sunsetText.text(nextSunriseString);
    } else {
        // If the sun is up then set the sun position to the sunset
        sunPosition = (time - sunrise) / (sunset - sunrise);

        // If the sun is up then set the title to day and the texts to sunrise and sunset
        $title.text("Time of day");
        $sunriseText.text(sunriseString);
        $sunsetText.text(sunsetString);
    }
    
    ctx.save();
    ctx.scale(RESOLUTION_UPSCALE, RESOLUTION_UPSCALE);

    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = LINE_WIDTH;
    // Change the color if it's night respektive day
    ctx.strokeStyle = isDay ? "rgb(255, 217, 0)" : "lightgray";
    ctx.fillStyle = isDay ? "rgb(255, 217, 0)" : "lightgray";

    // Draw the arc
    ctx.beginPath();
    ctx.ellipse(width / 2, height, ELLIPSE_WIDTH / 2, ELLIPSE_HEIGHT, 0, Math.PI, 0);
    ctx.stroke();

    // Draw the sun
    const position = getCirclePosition(sunPosition);
    ctx.beginPath();
    ctx.arc(
        INSET.x + ((position.x + 1) / 2) * ELLIPSE_WIDTH,
        INSET.y + (position.y + 1) * ELLIPSE_HEIGHT,
        SUN_RADIUS * 1.1,
        0,
        Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    // Change the color if it's night respektive day
    ctx.fillStyle = isDay ? "orange" : "white";
    ctx.arc(
        INSET.x + ((position.x + 1) / 2) * ELLIPSE_WIDTH,
        INSET.y + (position.y + 1) * ELLIPSE_HEIGHT,
        SUN_RADIUS * 0.8,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Restore the scale
    ctx.restore();
}

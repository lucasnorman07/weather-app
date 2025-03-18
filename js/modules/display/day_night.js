const canvas = $("#day-night-canvas");
const ctx = canvas.get(0).getContext("2d");

// Define a scale factor to use to improve the resolution
const RESOLUTION_UPSCALE = 2;
const LINE_WIDTH = 3;
const INSET = { x: 13, y: 12 };
const SUN_RADIUS = 12;

let width, height;
let ELLIPSE_WIDTH;
let ELLIPSE_HEIGHT;
const resize = () => {
    [width, height] = [canvas.width(), canvas.height()];
    canvas.prop("width", width * RESOLUTION_UPSCALE);
    canvas.prop("height", height * RESOLUTION_UPSCALE);

    ELLIPSE_WIDTH = width - INSET.x * 2;
    ELLIPSE_HEIGHT = height - INSET.y;
};
resize();

// Track the sun position so it can be re-rendered if the window is resized
let latestSunPosition;

// In case the canvas is resized, then update the canvas width and height and re-render
$(window).on("resize", () => {
    resize();
    render(latestSunPosition);
});

// Helper function to get the x and y positions (-1 to 1) from a percentage (0 = left, 1 = right)
function getCirclePosition(position) {
    return {
        x: Math.cos(((position - 1) * 180 * Math.PI) / 180),
        y: Math.sin(((position - 1) * 180 * Math.PI) / 180)
    };
}

// Export a function to render the day-night graph
export default function render(sunPosition) {
    latestSunPosition = sunPosition;

    ctx.save();
    ctx.scale(RESOLUTION_UPSCALE, RESOLUTION_UPSCALE);

    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = LINE_WIDTH;
    // Change the color if it's night respektive day
    ctx.strokeStyle = sunPosition > 1 ? "lightgray" : "rgb(255, 217, 0)";
    ctx.fillStyle = "orange";

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
        SUN_RADIUS,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Restore the scale
    ctx.restore();
}

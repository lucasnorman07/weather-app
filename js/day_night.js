const canvas = $("#day-night-canvas");
const ctx = canvas.get(0).getContext("2d");

let width, height;
const resize = () => {
    [width, height] = [canvas.width(), canvas.height()];
    canvas.prop("width", width);
    canvas.prop("height", height);
};
resize();

// In case the canvas is resized, then update the canvas width and height
canvas.on("resize", resize);

const LINE_WIDTH = 3;
const INSET = { x: 13, y: 12 };
const SUN_RADIUS = 12;
const ELLIPSE_WIDTH = width - INSET.x * 2;
const ELLIPSE_HEIGHT = height - INSET.y;

// Helper function to get the x and y positions (from -1 to 1) from an angle (0 = left, 180 = right)
function getCirclePosition(angle) {
    return {
        x: Math.cos(((angle - 180) * Math.PI) / 180),
        y: Math.sin(((angle - 180) * Math.PI) / 180)
    };
}

function render(sunPosition) {
    ctx.lineWidth = LINE_WIDTH;
    ctx.strokeStyle = "rgb(255, 217, 0)";
    ctx.fillStyle = "orange";

    // Draw the arc
    ctx.beginPath();
    ctx.ellipse(width / 2, height, ELLIPSE_WIDTH / 2, ELLIPSE_HEIGHT, 0, Math.PI, 0);
    ctx.stroke();

    // Draw the sun
    const position = getCirclePosition(sunPosition);
    ctx.beginPath();
    ctx.fillStyle = "orange";
    ctx.arc(
        INSET.x + ((position.x + 1) / 2) * ELLIPSE_WIDTH,
        INSET.y + (position.y + 1) * ELLIPSE_HEIGHT,
        SUN_RADIUS,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

// TODO, temporary code that is to be removed when the actual data is put in place
let position = 0;
let velocity = 2;
setInterval(() => {
    position += velocity;
    if (position <= 0 || position >= 180) velocity *= -1;
    ctx.clearRect(0, 0, width, height);
    render(position);
}, 1000 / 60);

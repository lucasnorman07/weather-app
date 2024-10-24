// TODO: use JQuery
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

// Helper function to get the x and y positions (from -1 to 1) from an angle (0 = left, 180 = right)
function getCirclePosition(angle) {
    return {
        x: Math.cos(((angle - 180) * Math.PI) / 180),
        y: Math.sin(((angle - 180) * Math.PI) / 180)
    };
}

const lineWidth = 3;
const inset = { x: 13, y: 12 };
const sunRadius = 12;
const ellipseWidth = width - inset.x * 2;
const ellipseHeight = height - inset.y;

function render(sunPosition) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "rgb(255, 217, 0)";
    ctx.fillStyle = "orange";

    // Draw the arc
    ctx.beginPath();
    ctx.ellipse(width / 2, height, ellipseWidth / 2, ellipseHeight, 0, Math.PI, 0);
    ctx.stroke();

    // Draw the sun
    const position = getCirclePosition(sunPosition);
    ctx.beginPath();
    ctx.fillStyle = "orange";
    ctx.arc(
        inset.x + ((position.x + 1) / 2) * ellipseWidth,
        inset.y + (position.y + 1) * ellipseHeight,
        sunRadius,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

let position = 0;
let velocity = 2;
setInterval(() => {
    position += velocity;
    if (position <= 0 || position >= 180) velocity *= -1;
    ctx.clearRect(0, 0, width, height);
    render(position);
}, 1000 / 60);

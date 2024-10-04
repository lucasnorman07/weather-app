// TODO: use JQuery
const canvas = document.getElementById("day-night-canvas");
const ctx = canvas.getContext("2d");

const resize = () => {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
};
resize();

// In case the canvas is resized, then update the canvas width and height
canvas.addEventListener("resize", resize);

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
const ellipseWidth = canvas.width - inset.x * 2;
const ellipseHeight = canvas.height - inset.y;

function render(sunPosition) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "yellow";
    ctx.fillStyle = "orange";

    // Draw the arc
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height, ellipseWidth / 2, ellipseHeight, 0, Math.PI, 0);
    ctx.stroke();

    // Draw the line endings of the arc
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - lineWidth / 2);
    ctx.lineTo(inset.x * 2, canvas.height - lineWidth / 2);
    ctx.moveTo(canvas.width, canvas.height - lineWidth / 2);
    ctx.lineTo(canvas.width - inset.x * 2, canvas.height - lineWidth / 2);
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render(position);
}, 1000 / 60);

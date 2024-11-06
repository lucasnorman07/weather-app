const canvasWrapper = $("#precipitation-canvas-wrapper");
const canvas = $("#precipitation-canvas");
const ctx = canvas.get(0).getContext("2d");

const data = [
    { time: "06", precipitationProbability: Math.random() },
    { time: "07", precipitationProbability: Math.random() },
    { time: "08", precipitationProbability: Math.random() },
    { time: "09", precipitationProbability: Math.random() },
    { time: "10", precipitationProbability: Math.random() },
    { time: "11", precipitationProbability: Math.random() },
    { time: "12", precipitationProbability: Math.random() },
    { time: "13", precipitationProbability: Math.random() },
    { time: "15", precipitationProbability: Math.random() },
    { time: "16", precipitationProbability: Math.random() },
    { time: "17", precipitationProbability: Math.random() },
    { time: "18", precipitationProbability: Math.random() },
    { time: "19", precipitationProbability: Math.random() },
    { time: "20", precipitationProbability: Math.random() },
    { time: "21", precipitationProbability: Math.random() }
];

const verticalLabels = ["100%", "50%", "0%"];

const SPACING = 1.5;
const LINE_WIDTH = 0.5;
const TEXT_COLOR = "white";
const OPAQUE_TEXT_COLOR = "rgba(255, 255, 255, 0.5)";
const FONT = "1rem Arial";
const TEXT_BASELINE = "bottom";
const VERTICAL_LABELS_FONT = "0.95rem Arial";

// Set the FONT to be able to define the size of the horizontal text elements and the size of the shift (the width of the text along the y-axis)
ctx.font = FONT;
ctx.textBaseline = TEXT_BASELINE;
const textWidth = ctx.measureText(data[0].time).actualBoundingBoxRight;
const textHeight = ctx.measureText(data[0].time).fontBoundingBoxAscent;
const shift = ctx.measureText(verticalLabels[0]).actualBoundingBoxRight;

const [width, height] = [textWidth * data.length * SPACING + shift, canvas.height()];
canvas.prop("width", width);
canvas.prop("height", height);
canvas.css("width", width + "px");
const graphHeight = height - textHeight - LINE_WIDTH;

// Set the line width, fill color, font and text baseline after the canvas size has been set (which clears the screen)
ctx.lineWidth = LINE_WIDTH;
ctx.fillStyle = TEXT_COLOR;
ctx.font = FONT;
ctx.textBaseline = TEXT_BASELINE;

function plotData() {
    ctx.save();
    ctx.translate(shift, 0);

    // Plot the data graph
    ctx.beginPath();
    data.forEach((item, i) => {
        const positionX = textWidth * i * SPACING + textWidth / 2;
        if (i === 0) {
            ctx.moveTo(positionX, item.precipitationProbability * graphHeight);
            return;
        }
        ctx.lineTo(positionX, item.precipitationProbability * graphHeight);
    });
    ctx.stroke();

    // Plot the data points
    data.forEach((item, i) => {
        ctx.beginPath();
        const positionX = textWidth * i * SPACING + textWidth / 2;
        ctx.arc(positionX, item.precipitationProbability * graphHeight, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Render the text along the x-axis (times)
    data.forEach((item, i) => {
        const positionX = textWidth * i * SPACING;
        ctx.fillText(item.time, positionX, height);
    });

    // Restore the translate with shift
    ctx.restore();
}

function render() {
    ctx.clearRect(0, 0, width, height);

    plotData();

    ctx.save();
    ctx.translate(canvasWrapper.prop("scrollLeft"), 0);

    // Clear the space underneath the text for the y-axis
    if (canvasWrapper.prop("scrollLeft") > 0) {
        // Used to fix any glitches
        const glitchOffset = 1;
        ctx.clearRect(-glitchOffset, 0, shift + glitchOffset * 2, height);
    }

    // Render the text along the y-axis
    ctx.beginPath();
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = VERTICAL_LABELS_FONT;
    ctx.fillStyle = OPAQUE_TEXT_COLOR;
    const textHeight = ctx.measureText(verticalLabels[0]).fontBoundingBoxAscent;
    verticalLabels.forEach((text, i) => {
        const positionY =
            textHeight + (graphHeight - textHeight) * (i / (verticalLabels.length - 1));
        ctx.fillText(text, shift / 2, positionY);
    });
    ctx.restore();

    // Render the lines for the x-axis and y-axis
    ctx.beginPath();
    ctx.moveTo(shift + LINE_WIDTH, 0);
    ctx.lineTo(shift + LINE_WIDTH, graphHeight);
    ctx.lineTo(shift + width + LINE_WIDTH, graphHeight);
    ctx.stroke();

    // restore the translate
    ctx.restore();
}
render();

canvasWrapper.on("scroll", render);

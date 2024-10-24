// TODO: use JQuery
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

const spacing = 1.5;
const lineWidth = 0.5;
const textColor = "white";
const opaqueTextColor = "rgba(255, 255, 255, 0.5)";
const font = "1rem Arial";
const verticalLabelsFont = "0.95rem Arial";

// Set the font to be able to define the width and height of the timestamps and the size of the shift (the width of the text along the y-axis)
ctx.font = font;
const textWidth = ctx.measureText(data[0].time).actualBoundingBoxRight;
const textHeight = ctx.measureText(data[0].time).fontBoundingBoxAscent;
const shift = ctx.measureText(verticalLabels[0]).actualBoundingBoxRight;

const [width, height] = [textWidth * data.length * spacing + shift, canvas.height()];
canvas.prop("width", width);
canvas.prop("height", height);
canvas.css("width", width + "px");
const graphHeight = height - textHeight - lineWidth;

// Set the line width, fill color and font after the canvas size has been set (which clears the screen)
ctx.lineWidth = lineWidth;
ctx.fillStyle = textColor;
ctx.font = font;

function plotData() {
    ctx.save();
    ctx.translate(shift, 0);

    // Plot the data graph
    ctx.beginPath();
    data.forEach((item, i) => {
        const positionX = textWidth * i * spacing + textWidth / 2;
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
        const positionX = textWidth * i * spacing + textWidth / 2;
        ctx.arc(positionX, item.precipitationProbability * graphHeight, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Render the text along the x-axis (times)
    data.forEach((item, i) => {
        const positionX = textWidth * i * spacing;
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
    ctx.font = verticalLabelsFont;
    ctx.fillStyle = opaqueTextColor;
    const textHeight = ctx.measureText(verticalLabels[0]).fontBoundingBoxAscent;
    verticalLabels.forEach((text, i) => {
        ctx.fillText(text, shift / 2, textHeight + height * (i / verticalLabels.length));
    });
    ctx.restore();

    // Render the lines for the x-axis and y-axis
    ctx.beginPath();
    ctx.moveTo(shift + lineWidth, 0);
    ctx.lineTo(shift + lineWidth, graphHeight);
    ctx.lineTo(shift + width + lineWidth, graphHeight);
    ctx.stroke();

    // restore the translate
    ctx.restore();
}
render();

canvasWrapper.on("scroll", render);

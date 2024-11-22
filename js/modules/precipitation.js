const canvasWrapper = $("#precipitation-canvas-wrapper");
const canvas = $("#precipitation-canvas");
const ctx = canvas.get(0).getContext("2d");

// This will be updated when the default export function is called
let precipitationData;

const VERTICAL_LABELS = ["100%", "50%", "0%"];
const SPACING = 1.5;
const LINE_WIDTH = 0.5;
const TEXT_COLOR = "white";
const OPAQUE_TEXT_COLOR = "rgba(255, 255, 255, 0.5)";
const FONT = "1rem Arial";
const TEXT_BASELINE = "bottom";
const VERTICAL_LABELS_FONT = "0.95rem Arial";

let textWidth, textHeight, width, height, shift, graphHeight;
function updatePreciptationData(data) {
    precipitationData = data;

    // Set the FONT to be able to define the size of the horizontal text elements and the size of the shift (the width of the text along the y-axis)
    ctx.font = FONT;
    ctx.textBaseline = TEXT_BASELINE;
    textWidth = ctx.measureText(data[0].time).actualBoundingBoxRight;
    textHeight = ctx.measureText(data[0].time).fontBoundingBoxAscent;
    shift = ctx.measureText(VERTICAL_LABELS[0]).actualBoundingBoxRight;

    [width, height] = [textWidth * data.length * SPACING + shift, canvas.height()];
    canvas.prop("width", width);
    canvas.prop("height", height);
    canvas.css("width", width + "px");
    graphHeight = height - textHeight - LINE_WIDTH;

    // Set the line width, fill color, font and text baseline after the canvas size has been set (which clears the screen)
    ctx.lineWidth = LINE_WIDTH;
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = FONT;
    ctx.textBaseline = TEXT_BASELINE;
}

function plotData() {
    ctx.save();
    ctx.translate(shift, 0);

    // Plot the data graph
    ctx.beginPath();
    precipitationData.forEach((item, i) => {
        const positionX = textWidth * i * SPACING + textWidth / 2;
        if (i === 0) {
            ctx.moveTo(positionX, item.precipitationProbability * graphHeight);
            return;
        }
        ctx.lineTo(positionX, item.precipitationProbability * graphHeight);
    });
    ctx.stroke();

    // Plot the data points
    precipitationData.forEach((item, i) => {
        ctx.beginPath();
        const positionX = textWidth * i * SPACING + textWidth / 2;
        ctx.arc(positionX, item.precipitationProbability * graphHeight, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Render the text along the x-axis (times)
    precipitationData.forEach((item, i) => {
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
    const textHeight = ctx.measureText(VERTICAL_LABELS[0]).fontBoundingBoxAscent;
    VERTICAL_LABELS.forEach((text, i) => {
        const positionY =
            textHeight + (graphHeight - textHeight) * (i / (VERTICAL_LABELS.length - 1));
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

canvasWrapper.on("scroll", render);

export default function (data) {
    updatePreciptationData(data);
    render();
}

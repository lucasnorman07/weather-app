const canvasWrapper = $("#precipitation-canvas-wrapper");
const canvas = $("#precipitation-canvas");
const ctx = canvas.get(0).getContext("2d");

// This will be updated when the default export function is called
let precipitationData;

const VERTICAL_LABELS = ["100%", "50%", "0%"];
const SPACING = 2.8;
const DOT_RADIUS = 2;
const EDGE_PADDING = 6;
const LINE_WIDTH = 0.5;
const TEXT_COLOR = "white";
const OPAQUE_TEXT_COLOR = "rgba(255, 255, 255, 0.5)";
const FONT = "1rem Arial";
const TEXT_BASELINE = "bottom";
const VERTICAL_LABELS_FONT = "0.95rem Arial";

let textWidth, textHeight, width, height, shift, graphHeight, fullGraphHeight;
function updatePrecipitationData(data) {
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
    fullGraphHeight = height - textHeight - LINE_WIDTH;
    graphHeight = fullGraphHeight - EDGE_PADDING * 2;

    // Set the line width, fill color, font and text baseline after the canvas size has been set (which clears the screen)
    ctx.lineWidth = LINE_WIDTH;
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = FONT;
    ctx.textBaseline = TEXT_BASELINE;
}

function plotData() {
    ctx.save();
    ctx.translate(shift + EDGE_PADDING, EDGE_PADDING);

    // Plot the data graph
    ctx.beginPath();
    precipitationData.forEach((item, i) => {
        const positionX = textWidth * i * SPACING + textWidth / 2;
        if (i === 0) {
            // Subtract from the graph height so it's not flipped
            ctx.moveTo(positionX, graphHeight - item.precipitationProbability * graphHeight);
            return;
        }
        // Subtract from the graph height so it's not flipped
        ctx.lineTo(positionX, graphHeight - item.precipitationProbability * graphHeight);
    });
    ctx.stroke();
    
    // Plot the data points
    precipitationData.forEach((item, i) => {
        ctx.beginPath();
        const positionX = textWidth * i * SPACING + textWidth / 2;
        // Subtract from the graph height so it's not flipped
        ctx.arc(positionX, graphHeight - item.precipitationProbability * graphHeight, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
    });

    // Restore the translate with shift and the dot radius
    ctx.restore();

    // Render the text along the x-axis (times)
    precipitationData.forEach((item, i) => {
        const positionX = textWidth * i * SPACING + shift;
        ctx.fillText(item.time, positionX, height);
    });
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
            textHeight + (fullGraphHeight - textHeight) * (i / (VERTICAL_LABELS.length - 1));
        ctx.fillText(text, shift / 2, positionY);
    });
    ctx.restore();

    // Render the lines for the x-axis and y-axis
    ctx.beginPath();
    ctx.moveTo(shift + LINE_WIDTH, 0);
    ctx.lineTo(shift + LINE_WIDTH, fullGraphHeight);
    ctx.lineTo(shift + width + LINE_WIDTH, fullGraphHeight);
    ctx.stroke();

    // restore the translate
    ctx.restore();
}

canvasWrapper.on("scroll", render);

export default function (data) {    
    updatePrecipitationData(data);
    render();
}

// TODO: use JQuery
const canvasWrapper = document.getElementById("precipitation-canvas-wrapper");
const canvas = document.getElementById("precipitation-canvas");
const ctx = canvas.getContext("2d");

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

// set the font to be able to define the width and height of the timestamps and the size of the shift (the width of the text along the y-axis)
ctx.font = font;
const textWidth = ctx.measureText(data[0].time).actualBoundingBoxRight;
const textHeight = ctx.measureText(data[0].time).fontBoundingBoxAscent;
const shift = ctx.measureText(verticalLabels[0]).actualBoundingBoxRight;

canvas.width = textWidth * data.length * spacing + shift;
canvas.height = canvas.getBoundingClientRect().height;
canvas.style.width = canvas.width + "px";
const availableGraphHeight = canvas.height - textHeight - lineWidth;

// set the line width, fill color and font after the canvas size has been set (which clears the screen)
ctx.lineWidth = lineWidth;
ctx.fillStyle = textColor;
ctx.font = font;

function plotData() {
    ctx.save();
    ctx.translate(shift, 0);

    // plot the data graph
    ctx.beginPath();
    data.forEach((item, i) => {
        const positionX = textWidth * i * spacing + textWidth / 2;
        if (i === 0) {
            ctx.moveTo(positionX, item.precipitationProbability * availableGraphHeight);
            return;
        }
        ctx.lineTo(positionX, item.precipitationProbability * availableGraphHeight);
    });
    ctx.stroke();

    // plot the data points
    data.forEach((item, i) => {
        ctx.beginPath();
        const positionX = textWidth * i * spacing + textWidth / 2;
        ctx.arc(positionX, item.precipitationProbability * availableGraphHeight, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // render the text along the x-axis (times)
    data.forEach((item, i) => {
        const positionX = textWidth * i * spacing;
        ctx.fillText(item.time, positionX, canvas.height);
    });

    // restore the translate with shift
    ctx.restore();
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    plotData();

    // clear the space underneath the text for the y-axis
    if (canvasWrapper.scrollLeft > 0) {
        // - 1 to fix any glitches
        ctx.clearRect(canvasWrapper.scrollLeft - 1, 0, shift + 2, canvas.height);
    }

    // render the text along the y-axis
    ctx.beginPath();
    ctx.save();
    ctx.textAlign = "center";
    ctx.font = verticalLabelsFont;
    ctx.fillStyle = opaqueTextColor;
    const textHeight = ctx.measureText(verticalLabels[0]).fontBoundingBoxAscent;
    verticalLabels.forEach((text, i) => {
        ctx.fillText(
            text,
            canvasWrapper.scrollLeft + shift / 2,
            textHeight + canvas.height * (i / verticalLabels.length)
        );
    });
    ctx.restore();

    // render the lines for the x-axis and y-axis
    ctx.beginPath();
    ctx.moveTo(shift + canvasWrapper.scrollLeft + lineWidth, 0);
    ctx.lineTo(shift + canvasWrapper.scrollLeft + lineWidth, availableGraphHeight);
    ctx.lineTo(shift + canvasWrapper.scrollLeft + canvas.width + lineWidth, availableGraphHeight);
    ctx.stroke();
}
render();

canvasWrapper.onscroll = () => {
    render();
};

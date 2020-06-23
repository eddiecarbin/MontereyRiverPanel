// Pew-Pew-Pew! v2.0.0 (Pattern for PixelBlaze)
// by Scott Balay -- https://github.com/zenblender

// Written for a 150-LED strip, adjust settings to your liking!


function clamp(num, min, max) {
    // return num <= min ? min : num >= max ? max : num;
    return Math.min(Math.max(min, num), max);
}

let isForwardDirection = false; // flip to run backwards
let laserCount = 5;  // use a multiple of numPaletteRGBs to have each available color represented equally
let fadeFactor = 0.8;
let speedFactor = 0.01;

// when on, new lasers cause entire strip to flash blue
// when off, blue component of each laser affects its color as normal
let useBlueLightning = true;

// init RGBs that in the palette of available colors:
let numPaletteRGBs = 5;
let paletteRGBs = [];
paletteRGBs.push(packRGB(13, 140, 255));
paletteRGBs.push(packRGB(12, 100, 232));
paletteRGBs.push(packRGB(0, 120, 208));
paletteRGBs.push(packRGB(12, 148, 232));
paletteRGBs.push(packRGB(13, 114, 255));
let v = "0x000000";

// ambient color added to all LEDs to provide a base color:
let ambientR = 0;
let ambientG = 0;
let ambientB = 10;

let pixelCount = 50;

function getRandomVelocity() { return Math.floor(Math.random() * 4) + 3 }

// init RGB of each laser:
let laserRGBs = createArray(laserCount, function (i) { return paletteRGBs[i % numPaletteRGBs] }, true);

// init randomized starting positions of each laser:
let laserPositions = createArray(laserCount, function () { return Math.floor(Math.random() * pixelCount); }, true);

// init each laser's velocity
let laserVelocities = createArray(laserCount, function () { return getRandomVelocity() }, true);

// init the full pixel array:
let pixelRGBs = createArray(pixelCount);

function beforeRender(delta) {
    // fade existing pixels:
    var laserIndex, pixelIndex;
    for (pixelIndex = 0; pixelIndex < pixelCount; pixelIndex++) {
        pixelRGBs[pixelIndex] = packRGB(
            Math.floor(getR(pixelRGBs[pixelIndex]) * fadeFactor),
            Math.floor(getG(pixelRGBs[pixelIndex]) * fadeFactor),
            Math.floor(getB(pixelRGBs[pixelIndex]) * fadeFactor)
        )
    }

    // advance laser positions:
    var currentLaserPosition, nextLaserPosition;
    for (laserIndex = 0; laserIndex < laserCount; laserIndex++) {
        currentLaserPosition = laserPositions[laserIndex];
        nextLaserPosition = currentLaserPosition + (delta * speedFactor * laserVelocities[laserIndex]);
        for (pixelIndex = Math.floor(nextLaserPosition); pixelIndex >= currentLaserPosition; pixelIndex--) {
            // draw new laser edge, but fill in "gaps" from last draw:
            if (pixelIndex < pixelCount) {
                pixelRGBs[pixelIndex] = packRGB(
                    Math.min(255, getR(pixelRGBs[pixelIndex]) + getR(laserRGBs[laserIndex])),
                    Math.min(255, getG(pixelRGBs[pixelIndex]) + getG(laserRGBs[laserIndex])),
                    Math.min(255, getB(pixelRGBs[pixelIndex]) + getB(laserRGBs[laserIndex]))
                );
            }
        }

        laserPositions[laserIndex] = nextLaserPosition;
        if (laserPositions[laserIndex] >= pixelCount) {
            // wrap this laser back to the start
            laserPositions[laserIndex] = 0;
            laserVelocities[laserIndex] = getRandomVelocity();
        }
    }
}

let RGB = [];

function render(rawIndex) {
    let index = isForwardDirection ? rawIndex : (pixelCount - rawIndex - 1)
    // console.log(pixelRGBs[index]);
    RGB[0] = clamp((getR(pixelRGBs[index]) + ambientR) / 255, 0, 1);
    RGB[1] = clamp((getG(pixelRGBs[index]) + ambientG) / 255, 0, 1);
    RGB[2] = clamp((getB(pixelRGBs[useBlueLightning ? 0 : index]) + ambientB) / 255, 0, 1);
    // rgb(
    //     clamp((getR(pixelRGBs[index]) + ambientR) / 255, 0, 1),
    //     clamp((getG(pixelRGBs[index]) + ambientG) / 255, 0, 1),
    //     clamp((getB(pixelRGBs[useBlueLightning ? 0 : index]) + ambientB) / 255, 0, 1)
    // )
}


//===== UTILS =====
// ARRAY INIT FUNCTIONS:
function createArray(size, valueOrFn, isFn) {
    let arr = [];
    if (!valueOrFn) return arr;
    for (i = 0; i < size; i++) {
        arr[i] = isFn ? valueOrFn(i) : valueOrFn;
    }
    return arr
}
// RGB FUNCTIONS:
// assume each component is an 8-bit "int" (0-255)
function packRGB(r, g, b) { return _packColor(r, g, b) }
function getR(value) { return _getFirstComponent(value) }
function getG(value) { return _getSecondComponent(value) }
function getB(value) { return _getThirdComponent(value) }
// HSV FUNCTIONS:
// assume each component is an 8-bit "int" (0-255)
function packHSV(h, s, v) { return _packColor(h, s, v) }
function getH(value) { return _getFirstComponent(value) }
function getS(value) { return _getSecondComponent(value) }
function getV(value) { return _getThirdComponent(value) }
// "PRIVATE" COLOR FUNCTIONS:
// assume each component is an 8-bit "int" (0-255)
function _packColor(a, b, c) { return (a << 8) + b + (c >> 8) }
function _getFirstComponent(value) { return (value >> 8) & 0xff } // R or H
function _getSecondComponent(value) { return value & 0xff } // G or S
function _getThirdComponent(value) { return (value << 8) & 0xff } // B or V


module.exports = {
    RGB,
    beforeRender,
    render
};
// Global variables
let myShader;
let textGraphics;
let customFont = null;

// DOM elements - Controls
let dispSlider = document.getElementById('disp-slider');
let bgColorPicker = document.getElementById('background-color');
let textColorPicker = document.getElementById('text-color');
let textInput = document.getElementById('text-input');
let container = document.getElementById('canvas-container');
let fontPicker = document.getElementById('font-picker');
let fontSizeSlider = document.getElementById('font-size');
let lineHeightSlider = document.getElementById('line-height');
let numBubblesSlider = document.getElementById('num-bubbles');
let bubbleSpeedSlider = document.getElementById('bubble-speed');
let minBubbleSizeSlider = document.getElementById('min-bubble-size');
let maxBubbleSizeSlider = document.getElementById('max-bubble-size');
let fontUpload = document.getElementById('font-upload');
let customFontOption = document.getElementById('custom-font-option');
let bubbleHighlightSizeSlider = document.getElementById('bubble-highlight-size');
let bubbleHighlightStrengthSlider = document.getElementById('bubble-highlight-strength');
let zoomLevelSlider = document.getElementById('zoom-level');
let bubbleContrastSlider = document.getElementById('bubble-contrast');
let canvasDimensionsPicker = document.getElementById('canvas-dimensions');
let flipDimensionsCheckbox = document.getElementById('flip-dimensions')
let showControlsCheckbox = document.getElementById('show-controls');
let navigationPanel = document.getElementById('navigation-panel');

// DOM elements - Value displays
let fontSizeValue = document.getElementById('font-size-value');
let lineHeightValue = document.getElementById('line-height-value');
let dispSliderValue = document.getElementById('disp-slider-value');
let numBubblesValue = document.getElementById('num-bubbles-value');
let bubbleSpeedValue = document.getElementById('bubble-speed-value');
let minBubbleSizeValue = document.getElementById('min-bubble-size-value');
let maxBubbleSizeValue = document.getElementById('max-bubble-size-value');
let bubbleHighlightSizeValue = document.getElementById('bubble-highlight-size-value');
let bubbleHighlightStrengthValue = document.getElementById('bubble-highlight-strength-value');
let bubbleContrastValue = document.getElementById('bubble-contrast-value');
let zoomLevelValue = document.getElementById('zoom-level-value');

// Event listeners for slider value updates
fontSizeSlider.addEventListener('input', () => fontSizeValue.textContent = fontSizeSlider.value);
lineHeightSlider.addEventListener('input', () => lineHeightValue.textContent = lineHeightSlider.value);
dispSlider.addEventListener('input', () => dispSliderValue.textContent = dispSlider.value);
numBubblesSlider.addEventListener('input', () => numBubblesValue.textContent = numBubblesSlider.value);
bubbleSpeedSlider.addEventListener('input', () => bubbleSpeedValue.textContent = bubbleSpeedSlider.value);
minBubbleSizeSlider.addEventListener('input', () => minBubbleSizeValue.textContent = minBubbleSizeSlider.value);
maxBubbleSizeSlider.addEventListener('input', () => maxBubbleSizeValue.textContent = maxBubbleSizeSlider.value);
bubbleHighlightSizeSlider.addEventListener('input', () => bubbleHighlightSizeValue.textContent = bubbleHighlightSizeSlider.value);
bubbleHighlightStrengthSlider.addEventListener('input', () => bubbleHighlightStrengthValue.textContent = bubbleHighlightStrengthSlider.value);
bubbleContrastSlider.addEventListener('input', () => bubbleContrastValue.textContent = bubbleContrastSlider.value);

zoomLevelSlider.addEventListener('input', () => {
  zoomLevelValue.textContent = Math.floor(zoomLevelSlider.value * 100) + '%';
  updateCanvasTransform();
});

// Update canvas transform with zoom
function updateCanvasTransform() {
  const zoomLevel = Number(zoomLevelSlider.value);
  container.style.transform = `translate(-50%, -50%) scaleY(-1) scale(${zoomLevel})`;
}

// Resize canvas container based on selected dimensions
function resizeCanvasContainer() {
  const dimensions = canvasDimensionsPicker.value.split('x');
  let width = parseInt(dimensions[0]);
  let height = parseInt(dimensions[1]);
  
  if (flipDimensionsCheckbox.checked) {
    [width, height] = [height, width];
  }
  
  container.style.width = `${width}px`;
  container.style.height = `${height}px`;
  
  resizeCanvas(width, height);
  textGraphics.resizeCanvas(width, height);
}

// Event listeners for canvas controls
canvasDimensionsPicker.addEventListener('change', resizeCanvasContainer);
flipDimensionsCheckbox.addEventListener('change', resizeCanvasContainer);

// Toggle control panel visibility
showControlsCheckbox.addEventListener('change', () => {
  const controlPanel = document.getElementById('control-panel');
  controlPanel.style.display = showControlsCheckbox.checked ? 'block' : 'none';
});

// Handle font upload
fontUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      loadFont(e.target.result, (font) => {
        customFont = font;
        customFontOption.disabled = false;
        customFontOption.textContent = `Custom Font (${file.name})`;
        fontPicker.value = 'custom';
      });
    };
    reader.readAsDataURL(file);
  }
});

function preload() {
  myShader = loadShader('vertexShader.vert', 'fragmentShader.frag');
}

function setup() {
  let containerWidth = container.offsetWidth;
  let containerHeight = container.offsetHeight;
  
  let canvas = createCanvas(containerWidth, containerHeight, WEBGL);
  canvas.parent('canvas-container');
  
  textGraphics = createGraphics(containerWidth, containerHeight);
  
  updateCanvasTransform();
  resizeCanvasContainer();
}

function draw() {
  textGraphics.background(bgColorPicker.value);
  textGraphics.fill(textColorPicker.value);
  textGraphics.textSize(Number(fontSizeSlider.value));
  textGraphics.textLeading(Number(fontSizeSlider.value) * Number(lineHeightSlider.value));
  textGraphics.textAlign(CENTER, CENTER);
  
  if (fontPicker.value === 'custom' && customFont) {
    textGraphics.textFont(customFont);
  } else {
    textGraphics.textFont(fontPicker.value);
  }
  
  textGraphics.text(textInput.value, width/2, height/2);

  shader(myShader);
  myShader.setUniform('tex1', textGraphics);
  myShader.setUniform('dispAmt', Number(dispSlider.value));
  myShader.setUniform('time', (frameCount/100) * Number(bubbleSpeedSlider.value));
  myShader.setUniform('resolution', [width, height]);
  myShader.setUniform('numBubbles', Number(numBubblesSlider.value));
  myShader.setUniform('minBubbleSize', Number(minBubbleSizeSlider.value));
  myShader.setUniform('maxBubbleSize', Number(maxBubbleSizeSlider.value));
  myShader.setUniform('bubbleHighlightSize', Number(bubbleHighlightSizeSlider.max) - Number(bubbleHighlightSizeSlider.value));
  myShader.setUniform('bubbleHighlightStrength', Number(bubbleHighlightStrengthSlider.value));
  myShader.setUniform('bubbleContrast', Number(bubbleContrastSlider.value));

  push();
  translate(0, 0, -100);
  rect(0, 0, width, height);
  pop();
}

function windowResized() {
  let containerWidth = container.offsetWidth;
  let containerHeight = container.offsetHeight;
  resizeCanvas(containerWidth, containerHeight);
  textGraphics.resizeCanvas(containerWidth, containerHeight);
}
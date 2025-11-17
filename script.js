// Global variables
let myShader;
let textGraphics;
let customFont = null;

// Preset configurations
const presets = {
  bubble: {
    backgroundColor: "#a6d1f2",
    textColor: "#0797df",
    textInput: "BE\nLIKE\nTHE\nWATER",
    fontSize: 180,
    lineHeight: 0.9,
    displacement: 0.06,
    numBubbles: 8,
    minBubbleSize: 0.25,
    maxBubbleSize: 1.5,
    bubbleSpeed: 2.0,
    bubbleOpacity: 0.1,
    bubbleContrast: 1,
    bubbleHighlightSize: 20,
    bubbleHighlightStrength: 7,
    fontFamily: "Trebuchet MS"
  },
  vampiric: {
    backgroundColor: "#db0000",
    textColor: "#000000",
    textInput: "BLOOD\nSWEAT\nAND\nTEARS",
    fontSize: 115,
    lineHeight: 1.4,
    displacement: -0.2,
    numBubbles: 10,
    minBubbleSize: 0.1,
    maxBubbleSize: 1.0,
    bubbleSpeed: 1.3,
    bubbleOpacity: 0.15,
    bubbleContrast: 0.5,
    bubbleHighlightSize: 100,
    bubbleHighlightStrength: 0,
    fontFamily: "Georgia"
  },
  groovy: {
    backgroundColor: "#c21aff",
    textColor: "#ff822e",
    textInput: "Go\nWith\nThe\nFlow",
    fontSize: 245,
    lineHeight: 1.0,
    displacement: 0.2,
    numBubbles: 6,
    minBubbleSize: 0.1,
    maxBubbleSize: 2.0,
    bubbleSpeed: 3.0,
    bubbleOpacity: 0.12,
    bubbleContrast: 1.0,
    bubbleHighlightSize: 98,
    bubbleHighlightStrength: 2.5,
    fontFamily: "Brush Script MT"
  }
};

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
let bubbleOpacitySlider = document.getElementById('bubble-opacity');
let bubbleContrastSlider = document.getElementById('bubble-contrast');
let canvasDimensionsPicker = document.getElementById('canvas-dimensions');
let flipDimensionsCheckbox = document.getElementById('flip-dimensions')
let showControlsCheckbox = document.getElementById('show-controls');
let navigationPanel = document.getElementById('navigation-panel');
let exportJpgButton = document.getElementById('export-jpg');
let exportPngButton = document.getElementById('export-png');
let presetsSelect = document.getElementById('presets');

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
let bubbleOpacityValue = document.getElementById('bubble-opacity-value');
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
bubbleOpacitySlider.addEventListener('input', () => bubbleOpacityValue.textContent = Math.floor(bubbleOpacitySlider.value * 1000) + '%');

zoomLevelSlider.addEventListener('input', () => {
  zoomLevelValue.textContent = Math.floor(zoomLevelSlider.value * 100) + '%';
  updateCanvasTransform();
});

// Update canvas transform with zoom
function updateCanvasTransform() {
  const zoomLevel = Number(zoomLevelSlider.value);
  container.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`;
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

// Export button event listeners
exportJpgButton.addEventListener('click', () => {
  exportImage('jpg');
});

exportPngButton.addEventListener('click', () => {
  exportImage('png');
});

// Preset selection event listener
presetsSelect.addEventListener('change', () => {
  loadPreset(presetsSelect.value);
});

// Export function
function exportImage(format) {
  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `bubble-shift-${timestamp}`;
  
  // Save the current canvas
  save(filename + '.' + format);
}

// Preset functions
function loadPreset(presetName) {
  const preset = presets[presetName];
  if (!preset) return;
  
  // Apply all preset values
  bgColorPicker.value = preset.backgroundColor;
  textColorPicker.value = preset.textColor;
  textInput.value = preset.textInput;
  fontSizeSlider.value = preset.fontSize;
  lineHeightSlider.value = preset.lineHeight;
  dispSlider.value = preset.displacement;
  numBubblesSlider.value = preset.numBubbles;
  minBubbleSizeSlider.value = preset.minBubbleSize;
  maxBubbleSizeSlider.value = preset.maxBubbleSize;
  bubbleSpeedSlider.value = preset.bubbleSpeed;
  bubbleOpacitySlider.value = preset.bubbleOpacity;
  bubbleContrastSlider.value = preset.bubbleContrast;
  bubbleHighlightSizeSlider.value = preset.bubbleHighlightSize;
  bubbleHighlightStrengthSlider.value = preset.bubbleHighlightStrength;
  fontPicker.value = preset.fontFamily;
  
  // Update all display values
  updateAllDisplayValues();
}

function updateAllDisplayValues() {
  fontSizeValue.textContent = fontSizeSlider.value;
  lineHeightValue.textContent = lineHeightSlider.value;
  dispSliderValue.textContent = dispSlider.value;
  numBubblesValue.textContent = numBubblesSlider.value;
  bubbleSpeedValue.textContent = bubbleSpeedSlider.value;
  minBubbleSizeValue.textContent = minBubbleSizeSlider.value;
  maxBubbleSizeValue.textContent = maxBubbleSizeSlider.value;
  bubbleHighlightSizeValue.textContent = bubbleHighlightSizeSlider.value;
  bubbleHighlightStrengthValue.textContent = bubbleHighlightStrengthSlider.value;
  bubbleOpacityValue.textContent = Math.floor(bubbleOpacitySlider.value * 1000) + '%';
  bubbleContrastValue.textContent = bubbleContrastSlider.value;
}

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
  
  // Remove MP4 option from p5.capture.js after it loads
  setTimeout(removeMp4Option, 100);
}

// Function to remove MP4 option from p5.capture interface
function removeMp4Option() {
  // Look for p5.capture.js format selector
  const formatSelectors = document.querySelectorAll('select');
  formatSelectors.forEach(select => {
    // Check if this is the p5.capture format selector
    const mp4Option = select.querySelector('option[value="mp4"]');
    if (mp4Option) {
      mp4Option.remove();
    }
  });
  
  // Also try common p5.capture.js class names
  const captureSelects = document.querySelectorAll('.p5c-formats select, #p5c-format-select');
  captureSelects.forEach(select => {
    const mp4Option = select.querySelector('option[value="mp4"]');
    if (mp4Option) {
      mp4Option.remove();
    }
  });
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
  
  // Flip the text graphics to render upside down (so CSS flip shows it right-side up)
  textGraphics.push();
  textGraphics.scale(1, -1);
  textGraphics.text(textInput.value, width/2, -height/2);
  textGraphics.pop();

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
  myShader.setUniform('bubbleOpacity', Number(bubbleOpacitySlider.value));

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
/**
 * Bubble Shift Type Tool
 * Interactive WebGL shader-based text distortion tool
 * Uses p5.js and custom GLSL shaders for real-time bubble effects
 */

// ===== CORE VARIABLES =====
let myShader;
let textGraphics;
let customFont = null;

// ===== PERFORMANCE OPTIMIZATION =====
let textNeedsUpdate = true;
let lastTextValue = '';
let lastFontValue = '';
let lastFontSize = '';
let lastLineHeight = '';
let lastBgColor = '';
let lastTextColor = '';
let uniformCache = {};

// ===== PRESET CONFIGURATIONS =====
const presets = {
  bubble: {
    backgroundColor: '#0064ff',
    textColor: '#dbe9ff',
    textInput: 'BE\nLIKE\nTHE\nWATER',
    fontSize: 120,
    lineHeight: 1.2,
    displacement: 0.06,
    numBubbles: 8,
    minBubbleSize: 0.25,
    maxBubbleSize: 1.65,
    bubbleSpeed: 2.0,
    bubbleOpacity: 0.07,
    bubbleContrast: 1.2,
    bubbleHighlightSize: 0,
    bubbleHighlightStrength: 8,
    fontFamily: 'Trebuchet MS'
  },
  vampiric: {
    backgroundColor: '#db0000',
    textColor: '#000000',
    textInput: 'BLOOD\nSWEAT\nAND\nTEARS',
    fontSize: 175,
    lineHeight: 1,
    displacement: 0.03,
    numBubbles: 6,
    minBubbleSize: 0.1,
    maxBubbleSize: 1,
    bubbleSpeed: 1.3,
    bubbleOpacity: 0.15,
    bubbleContrast: 0.5,
    bubbleHighlightSize: 100,
    bubbleHighlightStrength: 0,
    fontFamily: 'Georgia'
  },
  slick: {
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    textInput: 'GO WITH\nTHE FLOW',
    fontSize: 50,
    lineHeight: 1,
    displacement: 0,
    numBubbles: 12,
    minBubbleSize: 1,
    maxBubbleSize: 2,
    bubbleSpeed: 2,
    bubbleOpacity: 0.17,
    bubbleContrast: 0.2,
    bubbleHighlightSize: 98,
    bubbleHighlightStrength: 5,
    fontFamily: 'Arial Black'
  },
  minimal: {
    backgroundColor: '#ffffff',
    textColor: '#333333',
    textInput: 'GREETINGS,\nWORLD',
    fontSize: 60,
    lineHeight: 2,
    displacement: 0.03,
    numBubbles: 6,
    minBubbleSize: 0.75,
    maxBubbleSize: 2,
    bubbleSpeed: 3,
    bubbleOpacity: 0,
    bubbleContrast: 0,
    bubbleHighlightSize: 0,
    bubbleHighlightStrength: 0,
    fontFamily: 'Arial Narrow'
  }
};

// ===== DOM ELEMENT REFERENCES =====

// Control Elements
const dispSlider = document.getElementById('disp-slider');
const bgColorPicker = document.getElementById('background-color');
const textColorPicker = document.getElementById('text-color');
const textInput = document.getElementById('text-input');
const container = document.getElementById('canvas-container');
const fontPicker = document.getElementById('font-picker');
const fontSizeSlider = document.getElementById('font-size');
const lineHeightSlider = document.getElementById('line-height');
const numBubblesSlider = document.getElementById('num-bubbles');
const bubbleSpeedSlider = document.getElementById('bubble-speed');
const minBubbleSizeSlider = document.getElementById('min-bubble-size');
const maxBubbleSizeSlider = document.getElementById('max-bubble-size');
const fontUpload = document.getElementById('font-upload');
const customFontOption = document.getElementById('custom-font-option');
const bubbleHighlightSizeSlider = document.getElementById('bubble-highlight-size');
const bubbleHighlightStrengthSlider = document.getElementById('bubble-highlight-strength');
const zoomLevelSlider = document.getElementById('zoom-level');
const bubbleOpacitySlider = document.getElementById('bubble-opacity');
const bubbleContrastSlider = document.getElementById('bubble-contrast');
const canvasDimensionsPicker = document.getElementById('canvas-dimensions');
const flipDimensionsCheckbox = document.getElementById('flip-dimensions');
const showControlsCheckbox = document.getElementById('show-controls');
const navigationPanel = document.getElementById('navigation-panel');
const exportJpgButton = document.getElementById('export-jpg');
const exportPngButton = document.getElementById('export-png');
const presetsSelect = document.getElementById('presets');

// Value Display Elements
const fontSizeValue = document.getElementById('font-size-value');
const lineHeightValue = document.getElementById('line-height-value');
const dispSliderValue = document.getElementById('disp-slider-value');
const numBubblesValue = document.getElementById('num-bubbles-value');
const bubbleSpeedValue = document.getElementById('bubble-speed-value');
const minBubbleSizeValue = document.getElementById('min-bubble-size-value');
const maxBubbleSizeValue = document.getElementById('max-bubble-size-value');
const bubbleHighlightSizeValue = document.getElementById('bubble-highlight-size-value');
const bubbleHighlightStrengthValue = document.getElementById('bubble-highlight-strength-value');
const bubbleOpacityValue = document.getElementById('bubble-opacity-value');
const bubbleContrastValue = document.getElementById('bubble-contrast-value');
const zoomLevelValue = document.getElementById('zoom-level-value');

// ===== EVENT LISTENERS =====

// Slider Value Updates
fontSizeSlider.addEventListener('input', () => fontSizeValue.textContent = fontSizeSlider.value);
lineHeightSlider.addEventListener('input', () => lineHeightValue.textContent = lineHeightSlider.value);
dispSlider.addEventListener('input', () => dispSliderValue.textContent = dispSlider.value);
numBubblesSlider.addEventListener('input', () => numBubblesValue.textContent = numBubblesSlider.value);
bubbleSpeedSlider.addEventListener('input', () => bubbleSpeedValue.textContent = bubbleSpeedSlider.value);
minBubbleSizeSlider.addEventListener('input', () => minBubbleSizeValue.textContent = minBubbleSizeSlider.value);
maxBubbleSizeSlider.addEventListener('input', () => maxBubbleSizeValue.textContent = maxBubbleSizeSlider.value);
bubbleHighlightSizeSlider.addEventListener('input', () => bubbleHighlightSizeValue.textContent = bubbleHighlightSizeSlider.value);
bubbleHighlightStrengthSlider.addEventListener('input', () => bubbleHighlightStrengthValue.textContent = bubbleHighlightStrengthSlider.value);
bubbleContrastSlider.addEventListener('input', () => bubbleContrastValue.textContent = Math.floor(bubbleContrastSlider.value * 100) + '%');
bubbleOpacitySlider.addEventListener('input', () => bubbleOpacityValue.textContent = Math.floor(bubbleOpacitySlider.value * 1000) + '%');

// Zoom Control
zoomLevelSlider.addEventListener('input', () => {
  zoomLevelValue.textContent = Math.floor(zoomLevelSlider.value * 100) + '%';
  updateCanvasTransform();
});

// Canvas Controls
canvasDimensionsPicker.addEventListener('change', resizeCanvasContainer);
flipDimensionsCheckbox.addEventListener('change', resizeCanvasContainer);

// UI Controls
showControlsCheckbox.addEventListener('change', () => {
  const controlPanel = document.getElementById('control-panel');
  controlPanel.style.display = showControlsCheckbox.checked ? 'block' : 'none';
});

// Export Controls
exportJpgButton.addEventListener('click', () => exportImage('jpg'));
exportPngButton.addEventListener('click', () => exportImage('png'));

// Preset Controls
presetsSelect.addEventListener('change', () => loadPreset(presetsSelect.value));

// Font Upload
fontUpload.addEventListener('change', handleFontUpload);

// ===== UTILITY FUNCTIONS =====

/**
 * Updates canvas transform with current zoom level
 */
function updateCanvasTransform() {
  const zoomLevel = Number(zoomLevelSlider.value);
  container.style.transform = `translate(-50%, -50%) scale(${zoomLevel})`;
}

/**
 * Resizes canvas container based on selected dimensions
 */
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
  
  // Force text graphics to redraw after resize
  textNeedsUpdate = true;
  
  // Clear uniform cache to ensure shader uniforms are updated
  uniformCache = {};
}

/**
 * Exports the current canvas as an image file
 * @param {string} format - File format ('jpg' or 'png')
 */
function exportImage(format) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `bubble-shift-${timestamp}.${format}`;
  save(filename);
}

/**
 * Loads a preset configuration
 * @param {string} presetName - Name of the preset to load
 */
function loadPreset(presetName) {
  const preset = presets[presetName];
  if (!preset) return;
  
  // Apply preset values to controls
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
  
  updateAllDisplayValues();
}

/**
 * Updates all slider display values
 */
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

/**
 * Handles custom font file upload
 * @param {Event} event - File input change event
 */
function handleFontUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
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

// ===== P5.JS CORE FUNCTIONS =====

/**
 * Preloads assets before setup
 */
function preload() {
  myShader = loadShader('vertexShader.vert', 'fragmentShader.frag');
}

/**
 * Initial setup function
 */
function setup() {
  frameRate(30); // Performance optimization: limit to 30fps
  
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;
  
  const canvas = createCanvas(containerWidth, containerHeight, WEBGL);
  canvas.parent('canvas-container');
  
  textGraphics = createGraphics(containerWidth, containerHeight);
  
  updateCanvasTransform();
  resizeCanvasContainer();
  
  // Clean up p5.capture.js interface after loading
  setTimeout(removeUnsupportedFormats, 100);
}

// Function to remove unsupported formats and limit framerate from p5.capture interface
function removeUnsupportedFormats() {
  // Formats to remove due to orientation issues
  const unsupportedFormats = ['mp4', 'gif'];
  
  // Look for p5.capture.js format selector
  const formatSelectors = document.querySelectorAll('select');
  formatSelectors.forEach(select => {
    unsupportedFormats.forEach(format => {
      const option = select.querySelector(`option[value="${format}"]`);
      if (option) {
        option.remove();
      }
    });
  });
  
  // Also try common p5.capture.js class names
  const captureSelects = document.querySelectorAll('.p5c-formats select, #p5c-format-select');
  captureSelects.forEach(select => {
    unsupportedFormats.forEach(format => {
      const option = select.querySelector(`option[value="${format}"]`);
      if (option) {
        option.remove();
      }
    });
  });
  
  // Limit framerate inputs to maximum 30fps
  const framerateInputs = document.querySelectorAll('input[type="number"]');
  framerateInputs.forEach(input => {
    // Check if this looks like a framerate input
    const parentText = input.parentElement?.textContent?.toLowerCase() || '';
    const placeholder = input.placeholder?.toLowerCase() || '';
    
    if (parentText.includes('fps') || parentText.includes('framerate') || 
        placeholder.includes('fps') || input.max > 60) {
      
      // Set maximum value
      input.max = 30;
      
      // Clamp current value if it's too high
      if (parseInt(input.value) > 30) {
        input.value = 30;
      }
      
      // Add event listeners to prevent high values
      input.addEventListener('input', (e) => {
        if (parseInt(e.target.value) > 30) {
          e.target.value = 30;
        }
      });
      
      input.addEventListener('blur', (e) => {
        if (parseInt(e.target.value) > 30) {
          e.target.value = 30;
        }
      });
    }
  });
}

/**
 * Main drawing loop with performance optimizations
 */
function draw() {
  // Check if text graphics need updating (performance optimization)
  if (shouldUpdateText()) {
    textNeedsUpdate = true;
  }
  
  // Update text graphics only when necessary
  if (textNeedsUpdate) {
    updateTextGraphics();
    updateTextCache();
    textNeedsUpdate = false;
  }

  // Apply shader and set uniforms
  shader(myShader);
  myShader.setUniform('tex1', textGraphics);
  
  // Update shader uniforms (conditional updates for performance)
  updateShaderUniforms();
  
  // Render the shader quad
  push();
  translate(0, 0, -100);
  rect(0, 0, width, height);
  pop();
}

/**
 * Handles window resize events
 */
function windowResized() {
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;
  resizeCanvas(containerWidth, containerHeight);
  textGraphics.resizeCanvas(containerWidth, containerHeight);
}

// ===== HELPER FUNCTIONS =====

/**
 * Checks if text graphics need updating
 * @returns {boolean} True if text should be redrawn
 */
function shouldUpdateText() {
  return textInput.value !== lastTextValue || 
         fontPicker.value !== lastFontValue ||
         fontSizeSlider.value !== lastFontSize ||
         lineHeightSlider.value !== lastLineHeight ||
         bgColorPicker.value !== lastBgColor ||
         textColorPicker.value !== lastTextColor;
}

/**
 * Updates the text graphics buffer
 */
function updateTextGraphics() {
  textGraphics.background(bgColorPicker.value);
  textGraphics.fill(textColorPicker.value);
  textGraphics.textSize(Number(fontSizeSlider.value));
  textGraphics.textLeading(Number(fontSizeSlider.value) * Number(lineHeightSlider.value));
  textGraphics.textAlign(CENTER, CENTER);
  
  // Set font (custom or system)
  if (fontPicker.value === 'custom' && customFont) {
    textGraphics.textFont(customFont);
  } else {
    textGraphics.textFont(fontPicker.value);
  }
  
  // Render text (flipped for shader coordinate system)
  textGraphics.push();
  textGraphics.scale(1, -1);
  textGraphics.text(textInput.value, width/2, -height/2);
  textGraphics.pop();
}

/**
 * Updates cached text values for performance optimization
 */
function updateTextCache() {
  lastTextValue = textInput.value;
  lastFontValue = fontPicker.value;
  lastFontSize = fontSizeSlider.value;
  lastLineHeight = lineHeightSlider.value;
  lastBgColor = bgColorPicker.value;
  lastTextColor = textColorPicker.value;
}

/**
 * Updates shader uniforms with performance optimization
 */
function updateShaderUniforms() {
  // Conditional updates (only when values change)
  setUniformIfChanged('dispAmt', Number(dispSlider.value));
  setUniformIfChanged('numBubbles', Number(numBubblesSlider.value));
  setUniformIfChanged('minBubbleSize', Number(minBubbleSizeSlider.value));
  setUniformIfChanged('maxBubbleSize', Number(maxBubbleSizeSlider.value));
  setUniformIfChanged('bubbleHighlightSize', Number(bubbleHighlightSizeSlider.max) - Number(bubbleHighlightSizeSlider.value));
  setUniformIfChanged('bubbleHighlightStrength', Number(bubbleHighlightStrengthSlider.value));
  setUniformIfChanged('bubbleContrast', Number(bubbleContrastSlider.value));
  setUniformIfChanged('bubbleOpacity', Number(bubbleOpacitySlider.value));
  
  // Frame-dependent updates (always update)
  myShader.setUniform('time', (frameCount/100) * Number(bubbleSpeedSlider.value));
  myShader.setUniform('resolution', [width, height]);
}

/**
 * Sets shader uniform only if value has changed (performance optimization)
 * @param {string} name - Uniform name
 * @param {*} value - Uniform value
 */
function setUniformIfChanged(name, value) {
  if (uniformCache[name] !== value) {
    myShader.setUniform(name, value);
    uniformCache[name] = value;
  }
}
# Bubble Shift Type Tool

![Bubble Shift Type Tool Demo](bubbleshift-example.gif)

An interactive web-based typographic tool that creates liquid bubble distortion effects on text using WebGL shaders and p5.js. This tool allows you to create dynamic, water-like text effects with customizable animated bubbles that displace and refract the typography.

Developed by [Sara Soltis](https://www.sarasoltis.com)
Special thanks to [edankwan](https://www.shadertoy.com/user/edankwan) and [aferriss](https://github.com/aferriss/p5jsShaderExamples) for shader logic

## Features

### Text Customization
- **Custom Text Input**: Enter any text with multiline support
- **Font Selection and Upload**: Choose from built-in fonts (Arial, Verdana, Impact, Times New Roman, Georgia, Trebuchet MS, etc.) or upload your own TTF/OTF fonts
- **Font Size & Line Height**: Adjustable typography spacing controls (100-300px font size, 0.5-2.0 line height)
- **Color Controls**: Independent background and text color pickers

### Bubble Effects
- **Displacement Mapping**: Real-time text distortion through bubble refraction (-0.3 to 0.2 range)
- **Animated Bubbles**: Floating spheres with organic movement patterns using raymarching
- **Bubble Count**: Control number of bubbles (1-12)
- **Size Range**: Adjustable minimum (0.1-1.0) and maximum (1.0-2.0) bubble sizes
- **Speed Control**: Variable animation speed for bubble movement (0.5-3.0x)
- **Opacity Control**: Adjustable bubble transparency (0-20%)
- **Contrast & Highlighting**: Fine-tune bubble appearance with contrast and specular highlight controls

### Canvas & Export
- **Multiple Resolutions**: Preset canvas dimensions (1080p, 1280x720, 1080x1080, 1080x1350, 4K, ultrawide)
- **Orientation Toggle**: Flip between landscape and portrait modes
- **Direct Export**: One-click JPG and PNG export buttons
- **p5.capture Integration**: Advanced video/sequence exports (WebM, PNG sequence, JPG sequence, WebP sequence)
- **Zoom Control**: Scale the viewport (25%-200%) for detailed work
- **Preset System**: Quick-apply style presets (Bubble, Vampiric, Sleek)
- **Real-time Preview**: All changes update immediately

## Technical Implementation

### WebGL Shaders
- **Fragment Shader**: Custom GLSL shader implementing:
  - Signed Distance Functions (SDF) for sphere rendering
  - Raymarching algorithm for 3D bubble rendering
  - Metaball blending using smooth union operations
  - Surface normal calculations for realistic lighting
  - Displacement mapping for text distortion effects
- **Vertex Shader**: Handles texture coordinate mapping and positioning

### Technologies Used
- **p5.js**: Main graphics library and WebGL context management
- **WebGL/GLSL**: Custom shaders for real-time rendering effects
- **HTML5 Canvas**: Rendering surface and text graphics generation
- **CSS3**: Interface styling and responsive layout
- **Vanilla JavaScript**: DOM manipulation and control logic

## Installation & Usage

1. **Clone or Download** the project files
2. **Serve Locally**: Use a local web server (required for shader loading)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using Live Server (VS Code extension)
   ```
3. **Open in Browser**: Navigate to local host port

## File Structure

```
├── index.html              # Main HTML structure and UI controls
├── script.js               # p5.js sketch and interaction logic
├── style.css               # Interface styling
├── fragmentShader.frag     # WebGL fragment shader (bubble effects)
├── vertexShader.vert       # WebGL vertex shader (basic positioning)
├── p5.min.js              # p5.js library
├── p5.capture.js          # Screen capture extension
└── jsconfig.json          # JavaScript configuration
```

## Controls Reference

### Typography Controls
- **Background/Text Color**: Color pickers for styling
- **Text Input**: Multiline text area for content
- **Font Picker**: Dropdown with system fonts (Arial, Verdana, Impact, Times New Roman, Georgia, etc.)
- **Font Upload**: File input for custom TTF, OTF, WOFF, WOFF2 fonts
- **Font Size**: 100-300px range
- **Line Height**: 0.5-2.0 spacing multiplier
- **Presets**: Quick-apply style presets (Bubble, Vampiric, Sleek)

### Bubble Effects Controls
- **Displacement Factor**: -0.3 to 0.2 (negative values create inward distortion)
- **Number of Bubbles**: 1-12 animated spheres
- **Bubble Size Range**: Min (0.1-1.0) and Max (1.0-2.0) size controls
- **Bubble Speed**: 0.5-3.0 animation speed multiplier
- **Bubble Opacity**: 0-20% transparency control
- **Bubble Contrast**: 0-2.0 visibility enhancement
- **Highlight Size/Strength**: Specular reflection controls (0-100 size, 0-10 strength)

### Navigation Controls
- **Zoom**: 10%-200% viewport scaling
- **Canvas Dimensions**: Preset resolution options (1080p, 720p, 4K, Instagram formats, etc.)
- **Flip Orientation**: Swap width/height for portrait/landscape
- **Show Controls**: Toggle control panel visibility for clean export view
- **Export Buttons**: Direct JPG and PNG export with timestamped filenames

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: WebGL support required

## Performance Notes

- **Recommended browser**: Google Chrome for best WebGL performance
- **Optimized rendering**: Uses 16-20 raymarching steps and optimized normal calculations
- **Bubble count impact**: Higher bubble counts affect frame rate (recommended: 8 or fewer for 60fps)
- **Resolution scaling**: 4K resolution may require powerful graphics hardware
- **Format compatibility**: MP4 and GIF exports disabled due to quality issues; use WebM, PNG, JPG, or WebP instead and use external convert tool for MP4 and GIF

## License

Created for educational purposes as part of a Generative Tools workshop with [Vera Van Der Seyp](https://veravandeseyp.com/)
All rights reserved
# Bubble Shift Type Tool

An interactive web-based typographic tool that creates liquid bubble distortion effects on text using WebGL shaders and p5.js. This tool allows users to create dynamic, underwater-like text effects with customizable animated bubbles that displace and refract the typography.

## Features

### Text Customization
- **Custom Text Input**: Enter any text with multiline support
- **Font Selection**: Choose from built-in fonts (Impact, Helvetica, Arial variants, etc.)
- **Custom Font Upload**: Upload your own TTF, OTF, WOFF, or WOFF2 fonts
- **Font Size & Line Height**: Adjustable typography spacing controls
- **Color Controls**: Independent background and text color pickers

### Bubble Effects
- **Displacement Mapping**: Real-time text distortion through bubble refraction
- **Animated Bubbles**: Floating spheres with organic movement patterns
- **Bubble Count**: Control number of bubbles (1-12)
- **Size Range**: Adjustable minimum and maximum bubble sizes
- **Speed Control**: Variable animation speed for bubble movement
- **Contrast & Highlighting**: Fine-tune bubble appearance with contrast and highlight controls

### Canvas & Export
- **Multiple Resolutions**: Preset canvas dimensions (1080p, 4K, Instagram formats, etc.)
- **Orientation Toggle**: Flip between landscape and portrait modes
- **Zoom Control**: Scale the viewport for detailed work
- **Responsive Design**: Auto-resizing canvas container

### Interface
- **Draggable Controls**: Moveable navigation panel
- **Collapsible UI**: Show/hide control panels for clean export view
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
3. **Open in Browser**: Navigate to `http://localhost:8000`

## File Structure

```
├── index.html              # Main HTML structure and UI controls
├── script.js               # p5.js sketch and interaction logic
├── style.css               # Interface styling
├── fragmentShader.frag     # WebGL fragment shader (bubble effects)
├── vertexShader.vert       # WebGL vertex shader (basic positioning)
├── sphereFragmentShader.frag # Alternative sphere shader (unused)
├── sphereVertexShader.vert   # Alternative sphere shader (unused)
├── p5.min.js              # p5.js library
├── p5.capture.js          # Screen capture extension
└── jsconfig.json          # JavaScript configuration
```

## Controls Reference

### Typography Panel
- **Background/Text Color**: Color pickers for styling
- **Text Input**: Multiline text area for content
- **Font Picker**: Dropdown with system and uploaded fonts
- **Font Upload**: File input for custom fonts
- **Font Size**: 100-300px range
- **Line Height**: 0.75-2.0 spacing multiplier

### Bubble Effects Panel
- **Displacement Factor**: -0.3 to 0.2 (negative values create inward distortion)
- **Number of Bubbles**: 1-12 animated spheres
- **Bubble Size Range**: Min (0.1-1.0) and Max (1.0-2.0) size controls
- **Bubble Speed**: 0.5-3.0 animation speed multiplier
- **Bubble Contrast**: 0-2.0 visibility enhancement
- **Highlight Size/Strength**: Specular reflection controls (0-100 size, 0-10 strength)

### Navigation Panel (Draggable)
- **Zoom**: 25%-200% viewport scaling
- **Canvas Dimensions**: Preset resolution options
- **Flip Orientation**: Swap width/height
- **Show Controls**: Toggle UI visibility

## Creative Applications

- **Motion Graphics**: Export frames for video projects
- **Print Design**: High-resolution typography with unique distortion effects
- **Web Design**: Interactive headers and hero sections
- **Experimental Typography**: Exploring liquid and refractive text treatments
- **Social Media**: Custom branded content with animated text effects

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: WebGL support required
- **Mobile**: Limited performance on complex scenes

## Performance Notes

- Higher bubble counts and larger canvases impact frame rate
- Recommended: 8 bubbles or fewer for smooth 60fps performance
- 4K resolution may require powerful graphics hardware

## License

Created for educational purposes as part of a Generative Tools class assignment.
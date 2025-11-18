precision mediump float;

varying vec2 vTexCoord;

// Uniforms passed from p5.js
uniform sampler2D tex1;
uniform float dispAmt;
uniform float time;
uniform vec2 resolution;
uniform float numBubbles;
uniform float minBubbleSize;
uniform float maxBubbleSize;
uniform float bubbleHighlightSize;
uniform float bubbleHighlightStrength;
uniform float bubbleContrast;
uniform float bubbleOpacity;

// ========== SIGNED DISTANCE FUNCTIONS ==========

// Smooth union blends two shapes together organically (metaball effect)
float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
}

// Sphere SDF - returns distance from point to sphere surface
float sdSphere(vec3 p, float s) {
    return length(p) - s;
}

// Map function - defines the entire scene by combining all spheres
float map(vec3 p) {
    float d = 2.0;
    for (int i = 0; i < 12; i++) {
        if (float(i) >= numBubbles) break;
        
        float fi = float(i);
        float animTime = time * (fract(fi * 412.531 + 0.513) - 0.5);
        vec3 startOffset = fi * vec3(52.5126, 64.62744, 632.25);
        
        d = opSmoothUnion(
            sdSphere(
                p + sin(animTime + startOffset) * vec3(2.0, 2.0, 0.8), 
                mix(minBubbleSize, maxBubbleSize, fract(fi * 412.531 + 0.5124))
            ),
            d,
            0.4
        );
    }
    return d;
}

// Calculate surface normal using optimized 3-sample method
vec3 calcNormal(in vec3 p) {
    const float h = 0.002;
    return normalize(vec3(
        map(p + vec3(h, 0, 0)) - map(p - vec3(h, 0, 0)),
        map(p + vec3(0, h, 0)) - map(p - vec3(0, h, 0)),
        map(p + vec3(0, 0, h)) - map(p - vec3(0, 0, h))
    ));
}

// ========== MAIN SHADER ==========

void main() {
  // Setup UV coordinates
  vec2 uv = vTexCoord;
  
  // Raymarching setup
  vec2 screenUV = (uv - 0.5) * vec2(resolution.x / resolution.y, 1.0) * 6.0;
  vec3 rayOri = vec3(screenUV, 3.0);
  vec3 rayDir = vec3(0.0, 0.0, -1.0);
  
  float depth = 0.0;
  vec3 p;
  
  // Raymarch loop
  for(int i = 0; i < 22; i++) {
      p = rayOri + rayDir * depth;
      float dist = map(p);
      depth += dist;
      if (dist < 2e-5 || depth > 6.0) break;
  }
  
  // Create sphere mask
  float sphereMask = step(depth, 5.9);
  
  // Early exit if no sphere
  if (sphereMask < 0.5) {
    gl_FragColor = texture2D(tex1, uv);
    return;
  }
  
  // Calculate surface normal
  vec3 n = calcNormal(p);
  
  // Displacement effect
  vec2 displacement = n.xy * dispAmt * sphereMask;
  vec4 baseImg = texture2D(tex1, uv + displacement);
  vec4 bgImg = texture2D(tex1, uv);
  vec4 finalImg = mix(bgImg, baseImg, sphereMask);
  
  // Lighting calculations
  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  
  float diffuse = max(0.1, dot(n, lightDir));
  float specular = pow(max(0.0, dot(n, normalize(lightDir + viewDir))), bubbleHighlightSize);
  float edgeFactor = pow(1.0 - max(0.0, dot(n, viewDir)), 1.5);
  
  // Material and lighting colors
  vec3 materialColor = vec3(2.0, 2.0, 2.0);
  vec3 lightingColor = vec3(1.0, 1.0, 1.0);
  
  vec3 sphereCol = materialColor * lightingColor * diffuse + lightingColor * vec3(specular * bubbleHighlightStrength) * (1.0 - edgeFactor);
  sphereCol = mix(sphereCol, materialColor * lightingColor * vec3(edgeFactor * 0.1), edgeFactor);
  sphereCol *= exp(-depth * 0.01) * bubbleContrast;
  
  // Final output
  gl_FragColor = mix(finalImg, vec4(sphereCol, 1.0), sphereMask * bubbleOpacity);
}
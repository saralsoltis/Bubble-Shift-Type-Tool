// Vertex shader for sphere geometry with displacement
attribute vec3 aPosition;
attribute vec2 aTexCoord;
attribute vec3 aNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;
uniform float uFrameCount;

varying vec2 vTexCoord;

void main() {
  vec4 positionVec4 = vec4(aPosition, 1.0);
  
  // Vertex displacement parameters
  float frequency = 20.0;
  float amplitude = 0.1;

  // Displace vertices along their normals
  float distortion = sin(positionVec4.x * frequency + uFrameCount * 0.1);
  positionVec4.xyz += aNormal * distortion * amplitude;

  gl_Position = uProjectionMatrix * uModelViewMatrix * positionVec4;
  vTexCoord = aTexCoord;
}

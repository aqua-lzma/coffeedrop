#version 300 es

precision highp float;

uniform vec2 u_resolution;

out vec4 outColour;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  uv -= 0.5;
  // vec2 uv = ((gl_FragCoord.xy / u_resolution) * 2.0) - 1.0;
  float c = length(uv);
  outColour = vec4(uv.x, uv.y, 0, 1);
}

#version 300 es

precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_sample;

out vec4 outColour;

void main () {
  vec2 uv = gl_FragCoord.xy / (u_resolution);
  outColour = vec4(texture(u_sample, uv).rgb, 1);
}

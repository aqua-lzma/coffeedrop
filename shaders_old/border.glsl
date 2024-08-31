#version 300 es

precision highp float;

uniform vec3 u_colour;
uniform vec2 u_offset;
uniform vec2 u_resolution;

out vec4 outColour;

void main () {
  vec2 uv = ((gl_FragCoord.xy / u_resolution) * 2.0) - 1.0;
  vec2 d = uv * u_offset;
  outColour = vec4(u_colour + d.x + d.y, 1);
}

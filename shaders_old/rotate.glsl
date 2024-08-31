#version 300 es

precision highp float;
precision highp sampler2D;

uniform sampler2D u_sample;
uniform vec2 u_resolution;

out vec4 outColour;

void main () {
  // Clip space coordinates, -1 to 1
  vec2 uv = ((gl_FragCoord.xy / u_resolution) * 2.0) - 1.0;

  float rot = radians(360.0) * 0.0005;
  float s = sin(rot);
  float c = cos(rot);

  vec2 src = vec2(
    (uv.x * c) - (uv.y * s),
    (uv.x * s) + (uv.y * c)
  );

  outColour = texture(u_sample, (src * 0.5) + 0.5);
}

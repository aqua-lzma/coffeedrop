#version 300 es

precision mediump float;

uniform vec2 u_resolution;
uniform sampler2D u_texture;

out vec4 outColour;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec4 col = texture(u_texture, uv);
  outColour = vec4(col.rgb * 1.25, 1);
}

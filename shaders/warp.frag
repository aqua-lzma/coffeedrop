#version 300 es

precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_sample;
uniform sampler2D u_blur;

out vec4 o_colour;

void main () {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec3 prev = texture(u_sample, uv.xy).rgb;
  if (prev.b == 0.0) {
    o_colour = vec4(floor(uv.x * 20.0) / 20.0, floor(uv.y * 20.0) / 20.0, 1.0, 1.0);
  } else {
    prev = texture(u_sample, uv.xy + vec2(-0.001, -0.001)).rgb;
    vec3 blur = texture(u_blur, uv.xy + vec2(0.0, 0.0)).rgb;
    float r = mod(prev.r + 0.003 * (blur.r * 0.001), 1.0);
    float g = mod(prev.g + 0.006 * (blur.g * 0.001), 1.0);
    float b = mod(prev.r * prev.b - 0.01, 1.0);
    o_colour = vec4(r, g, b, 0.1);
  }
}

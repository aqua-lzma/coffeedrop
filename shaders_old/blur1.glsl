#version 300 es

precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_sample;

out vec4 outColour;

void main () {
  vec2 uv = (gl_FragCoord.xy / u_resolution);
  float iwidth = 1.0 / u_resolution.x;

  float w1 = 4.0 + 3.8;
  float w2 = 3.5 + 2.9;
  float w3 = 1.9 + 1.2;
  float w4 = 0.7 + 0.3;
  float d1 = 0.0 + 2.0 * 3.8 / w1;
  float d2 = 2.0 + 2.0 * 2.9 / w2;
  float d3 = 4.0 + 2.0 * 1.2 / w3;
  float d4 = 6.0 + 2.0 * 0.3 / w4;
  float w_div = 0.5 / (w1 + w2 + w3 + w4);

  float blur_min = 0.0;
  float blur_max = 1.0;
  float fscale = 1.0 / (blur_max - blur_min);
  float fbias = -blur_min * fscale;

  vec3 blur =
  (texture(u_sample, uv + vec2(d1 * iwidth, 0)).rgb + texture(u_sample, uv + vec2(-d1 * iwidth, 0)).rgb) * w1 +
  (texture(u_sample, uv + vec2(d2 * iwidth, 0)).rgb + texture(u_sample, uv + vec2(-d2 * iwidth, 0)).rgb) * w2 +
  (texture(u_sample, uv + vec2(d3 * iwidth, 0)).rgb + texture(u_sample, uv + vec2(-d3 * iwidth, 0)).rgb) * w3 +
  (texture(u_sample, uv + vec2(d4 * iwidth, 0)).rgb + texture(u_sample, uv + vec2(-d4 * iwidth, 0)).rgb) * w4;
  blur.rgb *= w_div;
  blur.rgb = blur.rgb * fscale + fbias;

  outColour = vec4(blur, 1);
}

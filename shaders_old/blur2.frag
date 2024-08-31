#version 300 es

precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_sample;

out vec4 outColour;

void main () {
  vec2 n_resolution = u_resolution / 2.0;
  vec2 clip = ((gl_FragCoord.xy / n_resolution) * 2.0) - 1.0;
  vec2 uv = (gl_FragCoord.xy / n_resolution);
  float iheight = 1.0 / n_resolution.y;

  float w1 = 4.0 + 3.8 + 3.5 + 2.9;
  float w2 = 1.9 + 1.2 + 0.7 + 0.3;
  float d1 = 0.0 + 2.0 * ((3.5 + 2.9) / w1);
  float d2 = 2.0 + 2.0 * ((0.7 + 0.3) / w2);
  float w_div = 1.0 / ((w1 + w2) * 2.0);

  float edge_darken_c1 = 0.75;
  float edge_darken_c2 = 0.25;
  float edge_darken_c3 = 0.5;

  vec3 blur =
    (texture(u_sample, uv + vec2(0, d1 * iheight)).rgb + texture(u_sample, uv + vec2(0, -d1 * iheight)).rgb) * w1 +
    (texture(u_sample, uv + vec2(0, d2 * iheight)).rgb + texture(u_sample, uv + vec2(0, -d2 * iheight)).rgb) * w2;
  blur.rgb *= w_div;
  float t = min(min(clip.x, clip.y), 1.0 - max(clip.x, clip.y));
  t = sqrt(abs(t));
  t = edge_darken_c1 + edge_darken_c2 * clamp(t * edge_darken_c3, 0.0, 1.0);
  blur.rgb *= t;

  outColour = vec4(blur, 1);
}

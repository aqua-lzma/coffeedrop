#version 300 es
precision highp float;

in vec2 v_texture;

uniform vec4 u_size;
uniform int u_time;
uniform sampler2D u_warpTex;
uniform sampler2D u_blur1Tex;
uniform sampler2D u_blur2Tex;
uniform sampler2D u_blur3Tex;
uniform sampler2D u_perlinTex;

out vec4 o_colour;

float PI = 3.1415926538;
float PI2 = 6.28318530718;

vec3 normalise (vec3 col) {
  float m = max(max(col.x, col.y), col.z);
  col /= m;
  col = 0.5 + 0.5 * col;
  return col;
}

vec3 hue () {
  vec2 uv = v_texture;
  float time = float(u_time) / 400.0;
  return mix(
    mix(
      normalise(vec3(
        0.6 + 0.3 * sin(time * 30.0 * 0.0143 + 3.0 + 0.0 * 21.0),
        0.6 + 0.3 * sin(time * 30.0 * 0.0107 + 3.0 + 0.0 * 13.0),
        0.6 + 0.3 * sin(time * 30.0 * 0.0129 + 3.0 + 0.0 * 9.0)
      )),
      normalise(vec3(
        0.6 + 0.3 * sin(time * 30.0 * 0.0143 + 3.0 + 1.0 * 21.0),
        0.6 + 0.3 * sin(time * 30.0 * 0.0107 + 3.0 + 1.0 * 13.0),
        0.6 + 0.3 * sin(time * 30.0 * 0.0129 + 3.0 + 1.0 * 9.0)
      )),
      uv.x
    ),
    mix(
      normalise(vec3(
        0.6 + 0.3 * sin(time * 30.0 * 0.0143 + 3.0 + 2.0 * 21.0),
        0.6 + 0.3 * sin(time * 30.0 * 0.0107 + 3.0 + 2.0 * 13.0),
        0.6 + 0.3 * sin(time * 30.0 * 0.0129 + 3.0 + 2.0 * 9.0)
      )),
      normalise(vec3(
        0.6 + 0.3 * sin(time * 30.0 * 0.0143 + 3.0 + 3.0 * 21.0),
        0.6 + 0.3 * sin(time * 30.0 * 0.0107 + 3.0 + 3.0 * 13.0),
        0.6 + 0.3 * sin(time * 30.0 * 0.0129 + 3.0 + 3.0 * 9.0)
      )),
      uv.x
    ),
    uv.y
  );
}

void main () {
    vec2 d = u_size.zw * 1.5;

    vec4 dx = texture(u_warpTex, v_texture + vec2(1, 0) * d) - texture(u_warpTex, v_texture - vec2(1, 0) * d);
    vec4 dy = texture(u_warpTex, v_texture + vec2(0, 1) * d) - texture(u_warpTex, v_texture - vec2(0, 1) * d);

    vec4 warp = texture(u_warpTex, v_texture);

    o_colour.rgb = pow(hue(), vec3(6,6,6)) * warp.r * (1.0 - length(vec2(dx.y, dy.y) * 8.0)) * 1.4;
    o_colour.rgb = mix(o_colour.rgb, vec3(1, 1, 1), length(vec2(dx.z, dy.z) * 4.0));
    o_colour.a = 1.0;

    // o_colour = texture(u_warpTex, v_texture);
}

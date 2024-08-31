#version 300 es

precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_sample;
uniform float u_time;

vec3 normalise (vec3 col) {
  float m = max(max(col.x, col.y), col.z);
  col /= m;
  col = 0.5 + 0.5 * col;
  return col;
}

vec3 hue () {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  return mix(
    mix(
      normalise(vec3(
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0143 + 3.0 + 0.0 * 21.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0107 + 3.0 + 0.0 * 13.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0129 + 3.0 + 0.0 * 9.0)
      )),
      normalise(vec3(
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0143 + 3.0 + 1.0 * 21.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0107 + 3.0 + 1.0 * 13.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0129 + 3.0 + 1.0 * 9.0)
      )),
      uv.x
    ),
    mix(
      normalise(vec3(
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0143 + 3.0 + 2.0 * 21.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0107 + 3.0 + 2.0 * 13.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0129 + 3.0 + 2.0 * 9.0)
      )),
      normalise(vec3(
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0143 + 3.0 + 3.0 * 21.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0107 + 3.0 + 3.0 * 13.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0129 + 3.0 + 3.0 * 9.0)
      )),
      uv.x
    ),
    uv.y
  );
}


out vec4 outColour;

void main () {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  vec2 d = (1.0 / u_resolution) * 1.5;

  vec4 dxa = texture(u_sample, uv + vec2(1, 0) * d);
  vec4 dxb = texture(u_sample, uv - vec2(1, 0) * d);
  vec4 dx = dxa - dxb;

  vec4 dya = texture(u_sample, uv + vec2(0, 1) * d);
  vec4 dyb = texture(u_sample, uv - vec2(0, 1) * d);
  vec4 dy = dya - dyb;

  float lg = length(vec2(dx.g, dy.g) * 8.0);
  float lb = length(vec2(dx.b, dy.b) * 4.0);
  float r = texture(u_sample, uv).r * (1.0 - lg) * 1.4;
  vec3 col = pow(hue(), vec3(6, 6, 6)) * r;
  outColour = vec4(mix(col, vec3(1, 1, 1), lb), 1);
}

// Based on the Milkdrop preset TonyMilkdrop - Angels Of Glory Flexi - baby blue techstyle --- Isosceles edit
/*
d = texsize.zw*1.5;
dx = GetPixel(uv_orig + float2(1,0)*d) - GetPixel(uv_orig - float2(1,0)*d);
dy = GetPixel(uv_orig + float2(0,1)*d) - GetPixel(uv_orig - float2(0,1)*d);

ret = GetPixel(uv).x*(1-length(float2(dx.y,dy.y)*8))*pow(hue_shader,6)*1.4;
ret = lerp(ret,float3(1,1,1),length(float2(dx.z,dy.z)*4));
*/

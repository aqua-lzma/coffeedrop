#version 300 es

precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_sample;
uniform sampler2D u_blur;

out vec4 outColour;

// Threshold for floaters to break away, lower = lower chance
float c1 = 0.042;
// Lifespan of trails - higher = more
float c2 = -0.0075;
float c3 = 7.0;

void main () {
  vec2 d = (1.0 / u_resolution) * c3;
  vec2 d2 = (d * -1.0) * c3;

  vec2 uv = gl_FragCoord.xy / u_resolution;

  vec2 dxa = fract(uv + vec2(1, 0) * d);
  vec2 dxb = fract(uv - vec2(1, 0) * d);
  vec4 dx = texture(u_blur, dxa) - texture(u_blur, dxb);

  vec2 dya = fract(uv + vec2(0, 1) * d);
  vec2 dyb = fract(uv - vec2(0, 1) * d);
  vec4 dy = texture(u_blur, dya) - texture(u_blur, dyb);

  vec4 b1 = texture(u_sample, uv);

  vec2 uvr = (uv - (vec2(dx.r, dy.r) * d)) - (vec2(dx.r, dy.r) * d2);
  float r = texture(u_sample, uvr - floor(uvr)).r;
  r += (r - b1.r) * c1 + c2;

  vec2 uvg = (uv - (vec2(dx.g, dy.g) * d)) - (vec2(dx.g, dy.g) * d2);
  float g = texture(u_sample, uvg - floor(uvg)).g;
  g += (g - b1.g) * c1 + c2;

  vec2 uvb = (uv - (vec2(dx.b, dy.b) * d)) - (vec2(dx.b, dy.b) * d2);
  float b = texture(u_sample, uvb - floor(uvb)).b;
  b += (b - b1.b) * c1 + c2;

  outColour = vec4(r, g, b, 1);
}


// Based on the Milkdrop preset TonyMilkdrop - Angels Of Glory Flexi - baby blue techstyle --- Isosceles edit
/*
float2 d = texsize.zw*4;
float3 dx = GetBlur1(frac(uv+float2(1,0)*d))-GetBlur1(frac(uv-float2(1,0)*d));
float3 dy = GetBlur1(frac(uv+float2(0,1)*d))-GetBlur1(frac(uv-float2(0,1)*d));
float3 b1 = GetBlur1(uv) - 0;
d *= -1;
float d2 = d*4;
float1 c1 = 0.042;
float1 c2 = -0.0075;

float2 my_uv = uv - float2(dx.y,dy.y)*d - float2(dx.x,dy.x)*d2;
ret.y = tex2D( sampler_fc_main, my_uv-floor(my_uv)).y;
ret.y += (ret.y - b1.y)*c1 + c2;

my_uv = uv - float2(dx.x,dy.x)*d - float2(dx.z,dy.z)*d2;
ret.x = tex2D( sampler_fc_main, my_uv-floor(my_uv)).x;
ret.x += (ret.x - b1.x)*c1 + c2;

my_uv = uv - float2(dx.z,dy.z)*d - float2(dx.y,dy.y)*d2;
ret.z = tex2D( sampler_fc_main, my_uv-floor(my_uv)).z;
ret.z += (ret.z - b1.z)*c1 + c2;
*/

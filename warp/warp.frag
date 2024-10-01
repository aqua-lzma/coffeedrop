#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_warpTex;
uniform sampler2D u_perlinTex;

out vec4 o_colour;

float PI = 3.1415926538;
float PI2 = 6.28318530718;

float posterise = 7.0;

void main () {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float a = texture(u_perlinTex, uv).x;
    vec2 shift = vec2(sin(PI2 * a), cos(PI2 * a));
    shift *= 0.0;
    float v = texture(u_perlinTex, uv + shift).y;

    v = sin(PI * v * 14.0);
    v *= v;

    v = pow(v, 13.0);
    v = clamp(v, 0.06, 0.8);

    o_colour = vec4(v, v, v, 1.0);
}

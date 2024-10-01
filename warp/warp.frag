#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_warpTex;
uniform sampler2D u_perlinTex;

out vec4 o_colour;

float PI2 = 6.28318530718;

void main () {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec4 prev = texture(u_warpTex, uv);

    vec4 perlin = texture(u_perlinTex, uv);
    float v = floor(perlin.x / 10.0) * 10;
    o_colour = (perlin.x, perlin.x, perlin.x, 1.0);
}

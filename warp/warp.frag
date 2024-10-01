#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_warpTex;
uniform sampler2D u_perlinTex;

out vec4 o_colour;

float PI2 = 6.28318530718;

float posterise = 7.0;

void main () {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec4 prev = texture(u_warpTex, uv);

    vec4 perlin = texture(u_perlinTex, uv);
    float v = floor(perlin.x * posterise) / posterise;
    o_colour = vec4(v, v, v, 1.0);
}

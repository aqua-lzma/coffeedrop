#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_warpTex;
uniform sampler2D u_perlinTex;

out vec4 o_colour;

float PI2 = 6.28318530718;

// Chromatic abberation distance (uv)
float cad = 0.0015;

void main () {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float x = texture(u_perlinTex, uv).x;

    float degR = x;
    float degG = mod(x + (1.0 / 3.0), 1.0);
    float degB = mod(x + (2.0 / 3.0), 1.0);

    vec2 angleR = vec2(sin(degR * PI2), cos(degR * PI2)) * cad;
    vec2 angleG = vec2(sin(degG * PI2), cos(degG * PI2)) * cad;
    vec2 angleB = vec2(sin(degB * PI2), cos(degB * PI2)) * cad;

    float r = texture(u_warpTex, uv + angleR).r;
    float g = texture(u_warpTex, uv + angleG).g;
    float b = texture(u_warpTex, uv + angleB).b;

    o_colour = vec4(r, g, b, 1.0);
}

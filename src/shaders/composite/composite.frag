#version 300 es
precision highp float;

in vec2 v_texture;

uniform sampler2D u_warpTex;
uniform sampler2D u_blur1Tex;
uniform sampler2D u_blur2Tex;
uniform sampler2D u_blur3Tex;
uniform sampler2D u_perlinTex;

out vec4 o_colour;

float PI = 3.1415926538;
float PI2 = 6.28318530718;

// Chromatic abberation distance (uv)
float cad = 0.0015;

float subTex (vec2 uv) {
    float y = texture(u_perlinTex, uv).y;
    // Number of lines from 0 -> 1
    float a = sin(PI * y * 14.0);
    a *= a;
    // Thinness of lines (higher = thinner)
    a = pow(a, 13.0);
    a = clamp(a, 0.06, 0.8);
    if (y > 0.7) a = 1.0 - a;
    return a;
}

void main () {
    vec4 warp = texture(u_warpTex, v_texture);
    vec4 perlin = texture(u_perlinTex, v_texture);

    warp.g = abs(warp.r - warp.g);
    warp.b = abs(warp.r - warp.b);
    warp.r = 1.0 - pow(warp.r, 7.0);
    warp.b = pow(warp.b, 10.0);

    warp = mod(warp * 1.1, 1.0);
    o_colour = vec4(warp.gbr, 1.0);
}

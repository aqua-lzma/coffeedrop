#version 300 es
precision highp float;

in vec2 v_texture;

uniform sampler2D u_warpTex;
uniform sampler2D u_perlinTex;

out vec4 o_colour;

float PI = 3.1415926538;
float PI2 = 6.28318530718;

// Chromatic abberation distance (uv)
float cad = 0.0015;

float subTex (vec2 uv) {
    float a = texture(u_perlinTex, uv).y;
    // Number of lines from 0 -> 1
    a = sin(PI * a * 14.0);
    a *= a;
    // Thinness of lines (higher = thinner)
    a = pow(a, 13.0);
    a = clamp(a, 0.06, 0.8);
    return a;
}

void main () {
    vec2 uv = v_texture;
    float x = texture(u_perlinTex, uv).x;

    float degR = x;
    float degG = mod(x + (1.0 / 3.0), 1.0);
    float degB = mod(x + (2.0 / 3.0), 1.0);

    vec2 angleR = vec2(sin(degR * PI2), cos(degR * PI2)) * cad;
    vec2 angleG = vec2(sin(degG * PI2), cos(degG * PI2)) * cad;
    vec2 angleB = vec2(sin(degB * PI2), cos(degB * PI2)) * cad;

    float r = subTex(uv + angleR);
    float g = subTex(uv + angleG);
    float b = subTex(uv + angleB);

    o_colour = vec4(r, g, b, 1.0);
}

#version 300 es
precision highp float;

in vec2 v_texture;

uniform sampler2D u_warpTex;
uniform sampler2D u_perlinTex;

out vec4 o_colour;

float PI = 3.1415926538;
float PI2 = 6.28318530718;

vec2 scalarToVec (float scalar) {
    return vec2(sin(scalar * PI2), cos(scalar * PI2));
}

void main () {
    vec4 perlin = texture(u_perlinTex, v_texture);

    vec2 offset = scalarToVec(perlin.x) * 0.004;

    vec4 sample1 = texture(u_warpTex, v_texture + offset);

    float r = sample1.b + (perlin.z * 0.01);
    float g = sample1.g - (perlin.z * 0.01);
    float b = sample1.r * perlin.z * 1.7;

    o_colour = vec4(r, g, b, 1.0);
    o_colour = mod(o_colour, 1.0);
    // o_colour = vec4(perlin.x, perlin.y, perlin.z, 1.0);
}

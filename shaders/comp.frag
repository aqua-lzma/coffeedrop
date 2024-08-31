#version 300 es

precision mediump float;

uniform vec2 u_resolution;
uniform sampler2D u_sample;

out vec4 o_colour;

// Constants for the LCG
const uint A = 1664525u;
const uint C = 1013904223u;
const uint M = 0xFFFFFFFFu;  // 2^32 - 1, same as 4294967295 in decimal

// Seed for the generator (this could be passed as a uniform or vary per pixel)
uniform uint u_seed;

// LCG function to generate a pseudo-random number
uint lcg(inout uint seed) {
    seed = (A * seed + C) & M;
    return seed;
}

// Function to generate a normalized float in the range [0, 1)
float lcg_random(inout uint seed) {
    return float(lcg(seed)) / float(M);
}

void main() {
    // Example usage in a fragment shader
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float scale = 3.0;
    uint seed = u_seed + uint(floor(gl_FragCoord.x / scale) * scale) * uint(floor(gl_FragCoord.y / scale) * scale) * 32769u;

    // Generate random noise for the fragment
    float r = lcg_random(seed);
    float g = lcg_random(seed);
    float b = lcg_random(seed);

    g /= 10.0;
    b /= 10.0;

    // Output noise as color (for demonstration purposes)
    o_colour = vec4(r, g, b, 1.0);
}
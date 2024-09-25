#version 300 es
precision highp float;

in vec2 v_texture;
flat in vec4 v_perlin;

out vec4 o_colour;

float PI = 3.14159265359;
float SQRT2 = 1.41421356237;

vec2 decomposeValue (float value) {
    return vec2(
        SQRT2 * sin(2.0 * PI * value),
        SQRT2 * cos(2.0 * PI * value)
    );
}

void main () {
    float dotA = dot(decomposeValue(v_perlin.x), v_texture - vec2(0, 0));
    float dotB = dot(decomposeValue(v_perlin.y), v_texture - vec2(1, 0));
    float dotC = dot(decomposeValue(v_perlin.z), v_texture - vec2(0, 1));
    float dotD = dot(decomposeValue(v_perlin.w), v_texture - vec2(1, 1));

    vec2 cosDis = (1.0 - cos(v_texture * PI)) / 2.0;
    float ab = mix(dotA, dotB, cosDis.x);
    float cd = mix(dotC, dotD, cosDis.x);
    float value = mix(ab, cd, cosDis.y);
    value = (value + 1.0) / 2.0;

    o_colour = vec4(value, value, value, 1.0);
}

#version 300 es
precision highp float;

in vec2 v_texture;

uniform sampler2D u_perlinTex;

out vec4 o_colour;

void main () {
    vec4 perlin = texture(u_perlinTex, v_texture);
    float value = floor(perlin.x * 10.0) / 10.0;
    o_colour = vec4(value, value, value, 1.0);
}

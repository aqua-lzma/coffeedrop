#version 300 es
precision highp float;

in vec2 v_texture;

uniform sampler2D u_perlinTex;

out vec4 o_colour;

void main () {
    vec3 perlin = texture(u_perlinTex, v_texture).xyz;
    perlin = sin(perlin * 30.0);
    perlin *= perlin;
    o_colour = vec4(perlin.xyz, 1.0);
}

#version 300 es
precision highp float;

in vec2 v_texture;

uniform sampler2D u_perlinTex;

out vec4 o_colour;

void main () {
    vec4 perlin = texture(u_perlinTex, v_texture);
    o_colour = vec4(perlin.x, perlin.x, perlin.x, 1.0);
}

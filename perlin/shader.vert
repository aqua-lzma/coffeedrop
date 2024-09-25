#version 300 es

in vec4 a_position;
in vec2 a_texture;
in vec4 a_perlin;

out vec2 v_texture;
flat out vec4 v_perlin;

void main () {
    gl_Position = a_position;
    v_texture = a_texture;
    v_perlin = a_perlin;
}

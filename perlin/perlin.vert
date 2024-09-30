#version 300 es

in vec4 a_position;
in vec2 a_texture;
in vec4 a_scalar;
in vec4 a_scalar2;

out vec2 v_texture;
flat out vec4 v_scalar;
flat out vec4 v_scalar2;

void main () {
    gl_Position = a_position;
    v_texture = a_texture;
    v_scalar = a_scalar;
    v_scalar2 = a_scalar2;
}

#version 300 es

in vec4 a_position;
in vec2 a_texture;
in mat4 a_scalar;

out vec2 v_texture;
flat out mat4 v_scalar;

void main () {
    gl_Position = a_position;
    v_texture = a_texture;
    v_scalar = a_scalar;
}

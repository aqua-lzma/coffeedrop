#version 300 es

in vec4 a_position;
in vec2 a_texture;

out vec2 v_texture;

void main () {
    gl_Position = a_position;
    v_texture = vec2(a_texture.x, a_texture.y);
}

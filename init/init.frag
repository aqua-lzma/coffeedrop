#version 300 es
precision highp float;

in vec2 v_texture;

out vec4 o_colour;

void main () {
    vec2 uv = v_texture;
    o_colour = vec4(uv.x, uv.y, 0.5, 1.0);
}

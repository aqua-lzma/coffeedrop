#version 300 es
precision highp float;

in vec2 v_texture;

out vec4 o_colour;

void main () {
    o_colour = vec4(v_texture.xy, 0.5, 1.0);
}

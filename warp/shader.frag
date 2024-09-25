#version 300 es
precision highp float;

uniform vec2 u_resolution;

out vec4 o_colour;

void main () {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    o_colour = vec4(uv.x, uv.y, 1.0, 1.0);
}

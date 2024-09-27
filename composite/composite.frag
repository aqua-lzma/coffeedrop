#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_warpTex;

out vec4 o_colour;

void main () {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    o_colour = texture(u_warpTex, uv);
}

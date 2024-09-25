#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_warpTex;

out vec4 o_colour;

void main () {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    float a = texture(u_warpTex, uv).r;
    o_colour = vec4(a, a, a, 1.0);
}

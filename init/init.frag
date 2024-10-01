#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_perlinTex;

out vec4 o_colour;

void main () {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec4 perlin = texture(u_perlinTex, uv);
    o_colour = vec4(perlin.y, perlin.x, perlin.z, 1.0);
}

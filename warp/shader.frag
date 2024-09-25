#version 300 es
precision highp float;

uniform vec2 u_resolution;
uniform sampler2D u_warpTex;
uniform sampler2D u_perlinTex;

out vec4 o_colour;

void main () {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    vec4 warp = texture(u_warpTex, uv);
    if (warp.g != 1.0) {
        float perlin = texture(u_perlinTex, uv).r;
        o_colour = vec4(perlin, 1.0, 1.0, 1.0);
    } else {
        warp.r += 0.01;
        warp.r %= 1.0;
        o_colour = warp;
    }
}

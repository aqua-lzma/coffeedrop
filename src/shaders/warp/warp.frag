#version 300 es
precision highp float;

in vec2 v_texture;

uniform vec4 u_size;
uniform sampler2D u_warpTex;
uniform sampler2D u_blur1Tex;
uniform sampler2D u_blur2Tex;
uniform sampler2D u_blur3Tex;
uniform sampler2D u_perlinTex;

out vec4 o_colour;

void main () {
    vec2 uv = v_texture;
    vec2 d = u_size.zw * 4.0;

    vec4 dx = texture(u_blur1Tex, fract(uv + vec2(1, 0) * d)) - texture(u_blur1Tex, fract(uv - vec2(1, 0) * d));
    vec4 dy = texture(u_blur1Tex, fract(uv + vec2(0, 1) * d)) - texture(u_blur1Tex, fract(uv - vec2(0, 1) * d));
    vec4 b1 = texture(u_blur1Tex, v_texture);

    d *= -1.0;
    vec2 d2 = d * 4.0;

    float c1 = 0.042;
    float c2 = -0.0075;

    vec2 uv2 = uv - vec2(dx.y, dy.y) * d - vec2(dx.x, dy.x) * d2;
    o_colour.y = texture(u_warpTex, uv2 - floor(uv2)).y;
    o_colour.y += (o_colour.y - b1.y) * c1 + c2;

    uv2 = uv - vec2(dx.x, dy.x) * d - vec2(dx.z, dy.z) * d2;
    o_colour.x = texture(u_warpTex, uv2 - floor(uv2)).x;
    o_colour.x += (o_colour.x - b1.x) * c1 + c2;

    uv2 = uv - vec2(dx.z, dy.z) * d - vec2(dx.y, dy.y) * d2;
    o_colour.z = texture(u_warpTex, uv2 - floor(uv2)).z;
    o_colour.z += (o_colour.z - b1.z) * c1 + c2;

    o_colour.w = 1.0;

    vec3 perlin = texture(u_perlinTex, uv).xyz;
    perlin = sin(perlin * 7.0);
    perlin *= perlin;
    float p = 15.0;
    perlin = pow(perlin, vec3(p, p, p));
    float threshold = 0.9999;
    if (perlin.x > threshold) o_colour.x = perlin.x;
    if (perlin.y > threshold) o_colour.y = perlin.y;
    if (perlin.z > threshold) o_colour.z = perlin.z;
}

#version 300 es
precision highp float;

in vec2 v_texture;

uniform sampler2D u_sample;
uniform vec4 u_srcSize; // Source texture size (.xy), and inverse (.zw)
uniform vec4 u_b2wd; // Weigted averages (.xy) and sample offsets (.zw)
uniform vec4 u_b2etc; // Weight divider, 1 - edge darken, edge_darken

out vec4 o_colour;

void main(){
    #define weightDiv   u_b2etc.x
    #define edgeDarkeni u_b2etc.y
    #define edgeDarken  u_b2etc.z

    vec2 uv2 = v_texture.xy + u_srcSize.zw*vec2(0,0);

    vec3 blur = (
        texture(u_sample, uv2 + vec2(0, u_b2wd.z * u_srcSize.w)).xyz +
        texture(u_sample, uv2 + vec2(0, -u_b2wd.z * u_srcSize.w)).xyz
    ) * u_b2wd.x + (
        texture(u_sample, uv2 + vec2(0, u_b2wd.w * u_srcSize.w)).xyz +
        texture(u_sample, uv2 + vec2(0, -u_b2wd.w * u_srcSize.w)).xyz
    ) * u_b2wd.y;

    blur.xyz *= weightDiv;

    // Tone it down at the edges (only happens on 1st run)
    float t = min(min(v_texture.x, v_texture.y),
    1.0 - max(v_texture.x, v_texture.y));
    t = sqrt(t);
    t = edgeDarkeni + edgeDarken * clamp(t * 5.0, 0.0, 1.0);
    blur.xyz *= t;

    o_colour.rgb = blur;
    o_colour.a = 1.0;
}

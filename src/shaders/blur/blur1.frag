#version 300 es
precision highp float;

in vec2 v_texture;

uniform sampler2D u_sample;
uniform vec4 u_srcSize; // Source texture size (.xy), and inverse (.zw)
uniform vec4 u_b1w; // Weighted averages
uniform vec4 u_b1d; // Sample offsets
uniform vec4 u_b1etc; // Scale, bias, weight divider

out vec4 o_colour;

void main() {
    // Long horizontal pass 1:
    #define fscale    u_b1etc.x
    #define fbias     u_b1etc.y
    #define weightDiv u_b1etc.z

    vec2 uv2 = v_texture.xy + u_srcSize.zw * vec2(1.0, 1.0);

    vec3 blur = (
        texture(u_sample, uv2 + vec2(u_b1d.x * u_srcSize.z, 0)).xyz +
        texture(u_sample, uv2 + vec2(-u_b1d.x * u_srcSize.z, 0)).xyz
    ) * u_b1w.x + (
        texture(u_sample, uv2 + vec2(u_b1d.y * u_srcSize.z, 0)).xyz +
        texture(u_sample, uv2 + vec2(-u_b1d.y * u_srcSize.z, 0)).xyz
    ) * u_b1w.y + (
        texture(u_sample, uv2 + vec2(u_b1d.z * u_srcSize.z, 0)).xyz +
        texture(u_sample, uv2 + vec2(-u_b1d.z * u_srcSize.z, 0)).xyz
    ) * u_b1w.z + (
        texture(u_sample, uv2 + vec2(u_b1d.w * u_srcSize.z, 0)).xyz +
        texture(u_sample, uv2 + vec2(-u_b1d.w * u_srcSize.z, 0)).xyz
    ) * u_b1w.w;

    blur.xyz *= weightDiv;

    blur.xyz = blur.xyz * fscale + fbias;

    o_colour.rgb = blur;
    o_colour.a = 1.0;
}

#version 300 es
precision highp float;

in vec2 v_texture;

uniform mat4 u_perlin;

out vec4 o_colour;

float PI = 3.14159265359;
float PI2 = 6.28318530718;
float SQRT2 = 1.41421356237;

mat4x2 decompScalars (vec4 scalars) {
    scalars *= PI2;
    mat4x2 gradients = mat4x2(
        sin(scalars.x), cos(scalars.x),
        sin(scalars.y), cos(scalars.y),
        sin(scalars.z), cos(scalars.z),
        sin(scalars.w), cos(scalars.w)
    );
    gradients *= SQRT2;
    return gradients;
}

float calcPerlin (mat4x2 gradients, mat4x2 offsets, vec2 easedUV) {
    float a = dot(gradients[0], offsets[0]);
    float b = dot(gradients[1], offsets[1]);
    float c = dot(gradients[2], offsets[2]);
    float d = dot(gradients[3], offsets[3]);

    float ab = mix(a, b, easedUV.x);
    float cd = mix(c, d, easedUV.x);
    float value = mix(ab, cd, easedUV.y);
    return (value + 1.0) / 2.0;
}

void main () {
    vec2 easedUV = sin((v_texture * PI) / 2.0);
    easedUV *= easedUV;

    mat4x2 centeredTex = mat4x2(
        v_texture - vec2(0, 0),
        v_texture - vec2(1, 0),
        v_texture - vec2(0, 1),
        v_texture - vec2(1, 1)
    );


    float v1 = calcPerlin(decompScalars(u_perlin[0]), centeredTex, easedUV);
    float v2 = calcPerlin(decompScalars(u_perlin[1]), centeredTex, easedUV);
    float v3 = calcPerlin(decompScalars(u_perlin[2]), centeredTex, easedUV);
    float v4 = calcPerlin(decompScalars(u_perlin[3]), centeredTex, easedUV);

    o_colour = vec4(v1, v2, v3, v4);
}

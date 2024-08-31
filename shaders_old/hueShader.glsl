#version 300 es

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 outColour;

vec3 normalise (vec3 col) {
  float m = max(max(col.x, col.y), col.z);
  col /= m;
  col = 0.5 + 0.5 * col;
  return col;
}

vec3 hue () {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  return mix(
    mix(
      normalise(vec3(
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0143 + 3.0 + 0.0 * 21.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0107 + 3.0 + 0.0 * 13.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0129 + 3.0 + 0.0 * 9.0)
      )),
      normalise(vec3(
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0143 + 3.0 + 1.0 * 21.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0107 + 3.0 + 1.0 * 13.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0129 + 3.0 + 1.0 * 9.0)
      )),
      uv.x
    ),
    mix(
      normalise(vec3(
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0143 + 3.0 + 2.0 * 21.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0107 + 3.0 + 2.0 * 13.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0129 + 3.0 + 2.0 * 9.0)
      )),
      normalise(vec3(
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0143 + 3.0 + 3.0 * 21.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0107 + 3.0 + 3.0 * 13.0),
        0.6 + 0.3 * sin(u_time * 30.0 * 0.0129 + 3.0 + 3.0 * 9.0)
      )),
      uv.x
    ),
    uv.y
  );
}

void main () {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec3 col = hue();
  outColour = vec4(col, 1);
}

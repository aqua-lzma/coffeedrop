const DEFAULT_VERT_SRC = `#version 300 es

in vec4 a_position;
in vec2 a_texture;

out vec2 v_texture;

void main () {
    gl_Position = a_position;
    v_texture = a_texture;
}
`

const DEFAULT_FRAG_SRC = `#version 300 es
precision highp float;

in vec2 v_texture;

out vec4 o_colour;

void main () {
    o_colour = vec4(v_texture.xy, 0.5, 1.0);
}
`

/**
 * @param {WebGL2RenderingContext} gl
 * @param {number} type
 * @param {string} source
 */
function createShader (gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!success) {
    const error = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw error
  }
  return shader
}

export default class Shader {
  initProgram (fragSrc, vertSrc) {
    if (vertSrc == null) vertSrc = DEFAULT_VERT_SRC
    if (fragSrc == null) fragSrc = DEFAULT_FRAG_SRC

    const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertSrc)
    const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragSrc)
    this.program = this.gl.createProgram()
    this.gl.attachShader(this.program, vertexShader)
    this.gl.attachShader(this.program, fragmentShader)
    this.gl.linkProgram(this.program)
    const success = this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)
    if (!success) {
      const error = this.gl.getProgramInfoLog(this.program)
      this.gl.deleteProgram(this.program)
      throw error
    }
  }

  initVertices () {
    this.gl.useProgram(this.program)

    this.vao = this.gl.createVertexArray()
    this.gl.bindVertexArray(this.vao)

    const vertices = new Float32Array([
      -1, 1, 0, 0, // Top-left
      -1, -1, 0, 1, // Bottom-left
      1, 1, 1, 0, // Top-right
      1, -1, 1, 1 // Bottom-right
    ])
    this.vertexCount = 4

    const buffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW)

    const textureLoc = this.gl.getAttribLocation(this.program, 'a_position')
    this.gl.enableVertexAttribArray(textureLoc)
    this.gl.vertexAttribPointer(textureLoc, 2, this.gl.FLOAT, false, 16, 0)

    const positionLoc = this.gl.getAttribLocation(this.program, 'a_texture')
    this.gl.enableVertexAttribArray(positionLoc)
    this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 16, 8)
  }

  initUniforms () {
    const warpTexLoc = this.gl.getUniformLocation(this.program, 'u_warpTex')
    if (warpTexLoc != null) this.warpTexLoc = warpTexLoc

    const perlinTexLoc = this.gl.getUniformLocation(this.program, 'u_perlinTex')
    if (perlinTexLoc != null) this.gl.uniform1i(perlinTexLoc, 2)
  }

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {number} index
   */
  initBuffer (index) {
    const texture = this.gl.createTexture()
    this.gl.activeTexture(this.gl.TEXTURE0 + index)
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGB8, this.gl.canvas.width, this.gl.canvas.height, 0, this.gl.RGB, this.gl.UNSIGNED_BYTE, null)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT)
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT)

    const buffer = this.gl.createFramebuffer()
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, buffer)
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0)
    return buffer
  }

  draw () {
    this.gl.useProgram(this.program)
    this.gl.bindVertexArray(this.vao)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
  }
}

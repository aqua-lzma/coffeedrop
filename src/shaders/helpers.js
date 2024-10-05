const DEFAULT_VERT_SRC = `#version 300 es

in vec4 a_position;
in vec2 a_texture;

out vec2 v_texture;

void main () {
    gl_Position = a_position;
    v_texture = vec2(a_texture.x, a_texture.y);
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

export class Program {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl, vertSrc, fragSrc, args) {
    this.gl = gl
    for (const key in args) this[key] = args[key]

    // Compile shaders
    if (vertSrc == null) vertSrc = DEFAULT_VERT_SRC
    if (fragSrc == null) fragSrc = DEFAULT_FRAG_SRC
    const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, vertSrc)
    const fragmentShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, fragSrc)

    // Create program and link shaders
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

    this.gl.useProgram(this.program)
    // Default single quad VAO
    this.initVAO()
    // Default shared uniforms
    this.initUniforms()
  }

  initVAO () {
    this.vao = this.gl.createVertexArray()
    this.gl.bindVertexArray(this.vao)

    const vertices = new Float32Array([
      -1, 1, 0, 1, // Top-left
      -1, -1, 0, 0, // Bottom-left
      1, 1, 1, 1, // Top-right
      1, -1, 1, 0 // Bottom-right
    ])
    this.drawMode = this.gl.TRIANGLE_STRIP
    this.vertexCount = 4

    const buffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW)

    const positionLoc = this.gl.getAttribLocation(this.program, 'a_position')
    this.gl.enableVertexAttribArray(positionLoc)
    this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 16, 0)

    const textureLoc = this.gl.getAttribLocation(this.program, 'a_texture')
    this.gl.enableVertexAttribArray(textureLoc)
    this.gl.vertexAttribPointer(textureLoc, 2, this.gl.FLOAT, false, 16, 8)
  }

  initUniforms () {
    const warpTexLoc = this.gl.getUniformLocation(this.program, 'u_warpTex')
    if (warpTexLoc != null) this.warpTexLoc = warpTexLoc

    const perlinTexLoc = this.gl.getUniformLocation(this.program, 'u_perlinTex')
    if (perlinTexLoc != null) this.gl.uniform1i(perlinTexLoc, 2)
  }

  preDraw () {}

  draw () {
    this.gl.useProgram(this.program)
    this.gl.bindVertexArray(this.vao)
    this.preDraw(...arguments)
    this.gl.drawArrays(this.drawMode, 0, this.vertexCount)
  }
}

/** @param {WebGL2RenderingContext} gl */
export class Texture {
  constructor (gl, index, params = {}) {
    const width = params.width ?? gl.canvas.width
    const height = params.height ?? gl.canvas.height
    const internalFormat = params.format ?? gl.RGB
    const formatMap = {
      [gl.RGB]: [gl.RGB, gl.UNSIGNED_BYTE],
      [gl.RGBA]: [gl.RGBA, gl.UNSIGNED_BYTE],
      [gl.RGBA16F]: [gl.RGBA, gl.HALF_FLOAT]
    }
    const [bufferFormat, bufferType] = formatMap[internalFormat]
    const filterType = params.filter ?? gl.LINEAR
    const wrap = params.wrap ?? gl.REPEAT

    this.texture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0 + index)
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D,
      0, // Mipmap level
      internalFormat,
      width, height,
      0, // Border,
      bufferFormat,
      bufferType,
      null // Pixel data
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filterType)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filterType)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap)

    this.framebuffer = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0)
  }
}

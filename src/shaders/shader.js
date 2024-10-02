import { createProgram } from '../webgl-helpers.js'

export default class Shader {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl, name, args = {}) {
    return (async () => {
      this.gl = gl
      for (const key in args) this[key] = args[key]

      const vertSrc = await (await fetch(`./shaders/${name}/${name}.vert`)).text()
      const fragSrc = await (await fetch(`./shaders/${name}/${name}.frag`)).text()
      this.program = createProgram(gl, vertSrc, fragSrc)

      this.initVertices()

      this.initUniforms()

      return this
    })()
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

  initUniforms () {}

  updateVertexes () {}

  updateUniforms () {}

  /** @param {WebGLFramebuffer} framebuffer */
  draw (framebuffer) {
    this.gl.useProgram(this.program)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer)
    this.gl.bindVertexArray(this.vao)
    this.updateVertexes()
    this.updateUniforms()
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertexCount)
  }
}

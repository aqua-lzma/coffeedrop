import { createProgram } from "../webgl-helpers.js"

const VERT_SRC = await (await fetch('./perlin/shader.vert')).text()
const FRAG_SRC = await (await fetch('./perlin/shader.frag')).text()

export default class Warp {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    const width = gl.canvas.width
    const height = gl.canvas.height
    this.gl = gl
    this.program = createProgram(gl, VERT_SRC, FRAG_SRC)

    gl.useProgram(this.program)

    const positionLoc = gl.getAttribLocation(this.program, 'a_position')
    const posVertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posVertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)


  }

  draw (framebuffer) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer)
    this.gl.useProgram(this.program)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 3)
  }
}

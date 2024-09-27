import { createProgram } from "../webgl-helpers.js"

const VERT_SRC = await (await fetch('./composite/composite.vert')).text()
const FRAG_SRC = await (await fetch('./composite/composite.frag')).text()

export default class Composite {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    const width = gl.canvas.width
    const height = gl.canvas.height
    this.gl = gl
    this.program = createProgram(gl, VERT_SRC, FRAG_SRC)
    this.curWarpBuffer = 0

    gl.useProgram(this.program)

    this.vao = gl.createVertexArray()
    gl.bindVertexArray(this.vao)

    const positionLoc = gl.getAttribLocation(this.program, 'a_position')
    const posVertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posVertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    const resolutionLoc = gl.getUniformLocation(this.program, 'u_resolution')
    gl.uniform2fv(resolutionLoc, [width, height])

    this.warpTexLoc = gl.getUniformLocation(this.program, 'u_warpTex')

    const perlinTexLoc = gl.getUniformLocation(this.program, 'u_perlinTex')
    gl.uniform1i(perlinTexLoc, 0)
  }

  draw (curWarpBuffer) {
    this.gl.useProgram(this.program)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.bindVertexArray(this.vao)
    this.gl.uniform1i(this.warpTexLoc, curWarpBuffer)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
  }
}

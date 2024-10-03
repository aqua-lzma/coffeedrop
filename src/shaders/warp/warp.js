import Shader from '../shader.js'

import fragSrc from './warp.frag'

export default class Warp extends Shader {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    console.log('Compiling warp shader.')
    super()
    this.gl = gl
    this.framebuffer0 = this.initBuffer(0)
    this.framebuffer1 = this.initBuffer(1)
    this.initProgram(fragSrc)
    this.initVertices()
    this.initUniforms()
  }

  draw (curFrameBuffer) {
    this.gl.useProgram(this.program)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, curFrameBuffer === 0 ? this.framebuffer0 : this.framebuffer1)
    this.gl.bindVertexArray(this.vao)
    this.gl.uniform1i(this.warpTexLoc, curFrameBuffer === 0 ? 1 : 0)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
  }
}

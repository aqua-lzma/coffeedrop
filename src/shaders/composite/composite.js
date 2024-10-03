import Shader from '../shader.js'

const fragSrc = await (await fetch('./shaders/composite/composite.frag')).text()

export default class Composite extends Shader {
  constructor (gl) {
    console.log('Compiling composite shader.')
    super()
    this.gl = gl
    this.initProgram(fragSrc)
    this.initVertices()
    this.initUniforms()
  }

  draw (curFrameBuffer) {
    this.gl.useProgram(this.program)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.bindVertexArray(this.vao)
    this.gl.uniform1i(this.warpTexLoc, curFrameBuffer === 0 ? 1 : 0)
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
  }
}

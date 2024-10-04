import Shader from '../shader.js'

import fragSrc from './composite.frag'

export default class Composite extends Shader {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    console.log('Compiling composite shader.')
    super(gl)
    this.initProgram(null, fragSrc)
    this.initVertices()
    this.initUniforms()
  }

  preDraw (curFrameBuffer) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.uniform1i(this.warpTexLoc, curFrameBuffer === 0 ? 1 : 0)
  }
}

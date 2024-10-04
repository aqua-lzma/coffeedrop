import Shader from '../shader.js'

import fragSrc from './init.frag'

export default class Init extends Shader {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    console.log('Compiling init shader.')
    super(gl)
    this.initProgram(null, fragSrc)
    this.initVertices()
    this.initUniforms()
  }

  preDraw (warpBuffer) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, warpBuffer)
  }
}

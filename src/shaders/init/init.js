import { Program } from '../helpers.js'

import fragSrc from './init.frag'

export default class Init extends Program {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    console.log('Compiling init shader.')
    super(gl, null, fragSrc)
  }

  preDraw (warpBuffer) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, warpBuffer)
  }
}

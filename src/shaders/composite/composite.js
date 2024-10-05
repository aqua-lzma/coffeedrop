import { Program } from '../helpers.js'

import fragSrc from './composite.frag'

export default class Composite extends Program {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    console.log('Compiling composite shader.')
    super(gl, null, fragSrc)
  }

  preDraw (curFrameBuffer) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.uniform1i(this.warpTexLoc, curFrameBuffer === 0 ? 1 : 0)
  }
}

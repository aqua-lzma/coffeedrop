import { Program, Texture } from '../helpers.js'

import fragSrc from './warp.frag'

export default class Warp extends Program {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    console.log('Compiling warp shader.')
    super(gl, null, fragSrc)
    this.texture0 = new Texture(gl, 0)
    this.texture1 = new Texture(gl, 1)
  }

  preDraw (curFrameBuffer) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, curFrameBuffer === 0 ? this.texture0.framebuffer : this.texture1.framebuffer)
    this.gl.uniform1i(this.warpTexLoc, curFrameBuffer === 0 ? 1 : 0)
  }
}

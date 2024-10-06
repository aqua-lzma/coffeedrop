import { Program, Texture } from '../helpers.js'

import fragSrc from './warp.frag'

export default class Warp extends Program {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    console.log('Compiling warp shader.')
    super(gl, null, fragSrc)
    this.texture0 = new Texture(gl, 0)
    this.texture1 = new Texture(gl, 0)
    this.currentTexture = 0
  }

  get texture () {
    if (this.currentTexture === 0) return this.texture0.texture
    else return this.texture1.texture
  }

  preDraw () {
    if (this.currentTexture === 0) {
      this.gl.activeTexture(this.gl.TEXTURE0)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture1.texture)
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.texture0.framebuffer)
    } else {
      this.gl.activeTexture(this.gl.TEXTURE0)
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture0.texture)
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.texture1.framebuffer)
    }
    this.currentTexture = +!this.currentTexture
  }
}

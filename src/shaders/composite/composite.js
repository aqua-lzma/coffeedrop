import { Program } from '../helpers.js'

import fragSrc from './composite.frag'

export default class Composite extends Program {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    console.log('Compiling composite shader.')
    super(gl, null, fragSrc)
  }

  preDraw () {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
  }
}

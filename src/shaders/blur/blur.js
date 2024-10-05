import { Program } from '../helpers'

import vertSrc from './blur.vert'
import frag1Src from './blur1.frag'

class BlurProg extends Program {
  constructor (gl, fragSrc) {
    super(gl, vertSrc, fragSrc)
  }
}

export default class Blur {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    console.log('Compiling blur shader.')

    // All textures: LINEAR, CLAMP_TO_EDGE
  }
}

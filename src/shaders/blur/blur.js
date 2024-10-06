import { Program, Texture } from '../helpers'

import vertSrc from './blur.vert'
import frag1Src from './blur1.frag'

class BlurProg extends Program {
  constructor (gl, fragSrc) {
    super(gl, vertSrc, fragSrc)
  }
}

const blurMin = [0, 0, 0]
const blurMax = [0, 0, 0]
const edgeDarken = 0.25

const scale = []
const bias = []

for (let i = 0; i < 3; i++) {
  const min = i === 0
    ? blurMin[i]
    : (blurMin[i] - blurMin[i - 1]) / (blurMax[i - 1] - blurMin[i - 1])
  const max = i === 0
    ? blurMax[i]
    : (blurMax[i] - blurMin[i - 1]) / (blurMax[i - 1] - blurMin[i - 1])

  scale[i] = 1 / (max - min)
  bias[i] = -min * scale[i]
}

export default class Blur {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    console.log('Compiling blur shader.')
    this.gl = gl

    let width = gl.canvas.width
    let height = gl.canvas.height

    this.textures = []
    // Size of each texture is smaller, and aligned to 16 x 4
    for (let i = 0; i < 6; i++) {
      if ((i % 2 === 0) || i < 2) {
        width = Math.max(16, Math.floor(width / 2))
        height = Math.max(16, Math.floor(height / 2))
      }
      const width2 = Math.floor((width + 3) / 16) * 16
      const height2 = Math.floor((width + 3) / 4) * 4
      this.textures.push(new Texture(gl, 1 + Math.floor(i / 2), {
        width: width2,
        height: height2
      }))
    }
  }
}

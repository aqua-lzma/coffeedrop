import { Program, Texture } from '../helpers'

import vertSrc from './blur.vert'
import frag1Src from './blur1.frag'
import frag2Src from './blur2.frag'

// Configurable variables
// -----------------------------------------------------
const blurMin = [0, 0, 0]
const blurMax = [1, 1, 1]
const edgeDarken = 0.25
const weights = [4, 3.8, 3.5, 2.9, 1.9, 1.2, 0.7, 0.3]
// -----------------------------------------------------

// Scale and bias calc
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

// Calculate weighted averages, sample offsets and weight dividors
// Blur 1 weighted averages
const b1w = [
  weights[0] + weights[1],
  weights[2] + weights[3],
  weights[4] + weights[5],
  weights[6] + weights[7]
]
// Blur 1 sample offsets
const b1d = [
  0 + 2 * weights[1] / b1w[0],
  2 + 2 * weights[3] / b1w[1],
  4 + 2 * weights[5] / b1w[2],
  6 + 2 * weights[7] / b1w[3]
]
const b1weightDiv = 0.5 / (b1w[0] + b1w[1] + b1w[2] + b1w[3])
// Blur 2
// Blur 2 weighted averages
const b2w = [
  weights[0] + weights[1] + weights[2] + weights[3],
  weights[4] + weights[5] + weights[6] + weights[7]
]
// Blur 2 sample offsets
const b2d = [
  0 + 2 * ((weights[2] + weights[3]) / b2w[0]),
  2 + 2 * ((weights[6] + weights[7]) / b2w[1])
]
const b2weightDiv = 1 / ((b2w[0] + b2w[1]) * 2)

class BlurProg extends Program {
  constructor (gl, fragSrc) {
    super(gl, vertSrc, fragSrc)
  }

  initUniforms () {
    this.sampleLoc = this.gl.getUniformLocation(this.program, 'u_sample')
    this.srcSizeLoc = this.gl.getUniformLocation(this.program, 'u_srcSize')

    const b1wLoc = this.gl.getUniformLocation(this.program, 'u_b1w')
    if (b1wLoc != null) this.gl.uniform4f(b1wLoc, b1w[0], b1w[1], b1w[2], b1w[3])
    const b1dLoc = this.gl.getUniformLocation(this.program, 'u_b1d')
    if (b1dLoc != null) this.gl.uniform4f(b1dLoc, b1d[0], b1d[1], b1d[2], b1d[3])
    this.b1etcLoc = this.gl.getUniformLocation(this.program, 'u_b1etc')

    const b2wdLoc = this.gl.getUniformLocation(this.program, 'u_b2wd')
    if (b2wdLoc != null) this.gl.uniform4f(b2wdLoc, b2w[0], b2w[1], b2d[0], b2d[1])
    this.b2etcLoc = this.gl.getUniformLocation(this.program, 'u_b2etc')
  }
}

export default class Blur {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    console.log('Compiling blur shader.')
    this.gl = gl

    this.blur1 = new BlurProg(gl, frag1Src)
    this.blur2 = new BlurProg(gl, frag2Src)

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
      const height2 = Math.floor((height + 3) / 4) * 4
      this.textures.push(new Texture(gl, 1 + Math.floor(i / 2), {
        width: width2,
        height: height2
      }))
    }
  }

  draw () {
    const passes = 6

    for (let i = 0; i < passes; i++) {
      this.gl.viewport(0, 0, this.textures[i].width, this.textures[i].height)

      if (i % 2 === 0) { // Long horizontal pass (blur1)
        this.gl.useProgram(this.blur1.program)

        if (i === 0) {
          this.gl.uniform1i(this.blur1.sampleLoc, 0)
        } else {
          this.gl.activeTexture(this.gl.TEXTURE1 + Math.floor(i / 2))
          this.gl.uniform1i(this.blur1.sampleLoc, Math.floor(i / 2))
        }

        const srcSize = i === 0
          ? [this.gl.canvas.width, this.gl.canvas.height]
          : [this.textures[i - 1].width, this.textures[i - 1].height]
        this.gl.uniform4f(this.blur1.srcSizeLoc, srcSize[0], srcSize[1], 1 / srcSize[0], 1 / srcSize[1])

        this.gl.uniform4f(this.blur1.b1etcLoc, scale[Math.floor(i / 2)], bias[Math.floor(i / 2)], b1weightDiv, 0)

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.textures[i].framebuffer)

        this.blur1.draw()
      } else { // Short vertical pass (blur2)
        this.gl.useProgram(this.blur2.program)

        this.gl.activeTexture(this.gl.TEXTURE1 + Math.floor(i / 2))
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.textures[i - 1].texture)
        this.gl.uniform1i(this.blur2.sampleLoc, 1 + Math.floor(i / 2))

        const srcSize = [this.textures[i - 1].width, this.textures[i - 1].height]
        this.gl.uniform4f(this.blur2.srcSizeLoc, srcSize[0], srcSize[1], 1 / srcSize[0], 1 / srcSize[1])

        // Edge darken only first run
        if (i === 1) this.gl.uniform4f(this.blur2.b2etcLoc, b2weightDiv, (1 - edgeDarken), edgeDarken, 0)
        else this.gl.uniform4f(this.blur2.b2etcLoc, b2weightDiv, 1, 0, 0)

        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.textures[i].framebuffer)
        this.blur2.draw()
      }
    }

    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height)
  }
}

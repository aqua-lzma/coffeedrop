import Shader from '../shader.js'

import vertSrc from './perlin.vert'
import fragSrc from './perlin.frag'

export default class Perlin extends Shader {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl, scale, speeds) {
    console.log('Compiling perlin shader.')
    super()
    this.gl = gl
    this.scale = scale
    this.speeds = speeds
    this.framebuffer = this.initBuffer(2)
    this.initProgram(fragSrc, vertSrc)
    this.initVertices()
  }

  initVertices () {
    // Calculate gradient grid size / dimensions
    const { width, height } = this.gl.canvas
    let pixelSize, gridW, gridH
    if (width > height) {
      gridW = Math.ceil(1 / this.scale)
      pixelSize = width * this.scale
      gridH = Math.ceil(height / pixelSize)
    } else {
      gridH = Math.ceil(1 / this.scale)
      pixelSize = height * this.scale
      gridW = Math.ceil(width / pixelSize)
    }
    const viewWidth = (2 / width) * pixelSize
    const viewHeight = (2 / height) * pixelSize

    // Prepare position and texture vertices, also prepare indices for scalar vertices
    const posVerts = []
    const texVerts = []
    this.scalarMap = []
    for (let y = 0; y < gridH; y++) {
      for (let x = 0; x < gridW; x++) {
        const [x0, y0] = [-1 + (x * viewWidth), 1 - (y * viewHeight)]
        const [x1, y1] = [x0 + viewWidth, y0 - viewHeight]
        posVerts.push(
          x0, y0, x0, y1, x1, y0,
          x0, y1, x1, y0, x1, y1
        )
        texVerts.push(
          0, 0, 0, 1, 1, 0,
          0, 1, 1, 0, 1, 1
        )
        const i1 = ((gridW + 1) * (y + 0)) + x + 0
        const i2 = ((gridW + 1) * (y + 0)) + x + 1
        const i3 = ((gridW + 1) * (y + 1)) + x + 0
        const i4 = ((gridW + 1) * (y + 1)) + x + 1
        for (let i = 0; i < 6; i++) this.scalarMap.push(i1, i2, i3, i4)
      }
    }

    this.scalars = new Array((gridW + 1) * (gridH + 1)).fill().map(() =>
      new Array(4).fill().map((_, i) => ({
        value: Math.random(), rate: Math.random() * this.speeds[i]
      }))
    )
    this.scalarVerts = new Float32Array(this.scalarMap.length * 4)
    this.vertexCount = gridW * gridH * 6

    this.gl.useProgram(this.program)
    this.vao = this.gl.createVertexArray()
    this.gl.bindVertexArray(this.vao)

    const positionLoc = this.gl.getAttribLocation(this.program, 'a_position')
    const posVertBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, posVertBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(posVerts), this.gl.STATIC_DRAW)
    this.gl.enableVertexAttribArray(positionLoc)
    this.gl.vertexAttribPointer(positionLoc, 2, this.gl.FLOAT, false, 0, 0)

    const textureLoc = this.gl.getAttribLocation(this.program, 'a_texture')
    const texVertBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texVertBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texVerts), this.gl.STATIC_DRAW)
    this.gl.enableVertexAttribArray(textureLoc)
    this.gl.vertexAttribPointer(textureLoc, 2, this.gl.FLOAT, false, 0, 0)

    const scalarLoc = this.gl.getAttribLocation(this.program, 'a_scalar')
    this.scalarVertBuffer = this.gl.createBuffer()
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.scalarVertBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.scalarVerts, this.gl.STREAM_DRAW)
    this.gl.enableVertexAttribArray(scalarLoc + 0)
    this.gl.enableVertexAttribArray(scalarLoc + 1)
    this.gl.enableVertexAttribArray(scalarLoc + 2)
    this.gl.enableVertexAttribArray(scalarLoc + 3)
    this.gl.vertexAttribPointer(scalarLoc + 0, 4, this.gl.FLOAT, false, 0, 4 * this.scalarMap.length * 0)
    this.gl.vertexAttribPointer(scalarLoc + 1, 4, this.gl.FLOAT, false, 0, 4 * this.scalarMap.length * 1)
    this.gl.vertexAttribPointer(scalarLoc + 2, 4, this.gl.FLOAT, false, 0, 4 * this.scalarMap.length * 2)
    this.gl.vertexAttribPointer(scalarLoc + 3, 4, this.gl.FLOAT, false, 0, 4 * this.scalarMap.length * 3)
  }

  updateVertices () {
    for (let i = 0; i < this.scalars.length; i++) {
      for (let j = 0; j < 4; j++) {
        this.scalars[i][j].value = (this.scalars[i][j].value + this.scalars[i][j].rate) % 1
      }
    }
    for (let i = 0; i < this.scalarMap.length; i++) {
      for (let j = 0; j < 4; j++) {
        this.scalarVerts[i + (this.scalarMap.length * j)] = this.scalars[this.scalarMap[i]][j].value
      }
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.scalarVertBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.scalarVerts, this.gl.STREAM_DRAW)
  }

  draw () {
    this.gl.useProgram(this.program)
    this.gl.bindVertexArray(this.vao)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)
    // this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.updateVertices()
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount)
  }
}

import { initBuffer } from "../../webgl-helpers.js"
import Shader from "../shader.js"

export default class Perlin extends Shader {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl, scale, speed) {
    return super(gl, 'perlin', {scale, speed})
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
      new Array(4).fill().map(() => ({
        value: Math.random(), rate: Math.random() / this.speed
      }))
    )
    this.scalarVerts = new Float32Array(this.scalarMap.length * 4)
    this.vertexCount = gridW * gridH * 6

    gl.useProgram(this.program)
    this.vao = gl.createVertexArray()
    gl.bindVertexArray(this.vao)

    const positionLoc = gl.getAttribLocation(this.program, 'a_position')
    const posVertBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posVertBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posVerts), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    const textureLoc = gl.getAttribLocation(this.program, 'a_texture')
    const texVertBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texVertBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texVerts), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(textureLoc)
    gl.vertexAttribPointer(textureLoc, 2, gl.FLOAT, false, 0, 0)

    const scalarLoc = gl.getAttribLocation(this.program, 'a_scalar')
    this.scalarVertBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.scalarVertBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.scalarVerts, gl.STREAM_DRAW)
    gl.enableVertexAttribArray(scalarLoc + 0)
    gl.enableVertexAttribArray(scalarLoc + 1)
    gl.enableVertexAttribArray(scalarLoc + 2)
    gl.enableVertexAttribArray(scalarLoc + 3)
    gl.vertexAttribPointer(scalarLoc + 0, 4, gl.FLOAT, false, 0, 4 * this.scalarMap.length * 0)
    gl.vertexAttribPointer(scalarLoc + 1, 4, gl.FLOAT, false, 0, 4 * this.scalarMap.length * 1)
    gl.vertexAttribPointer(scalarLoc + 2, 4, gl.FLOAT, false, 0, 4 * this.scalarMap.length * 2)
    gl.vertexAttribPointer(scalarLoc + 3, 4, gl.FLOAT, false, 0, 4 * this.scalarMap.length * 3)
  }

  updateVertexes () {
    for (let i = 0; i < this.scalars.length; i++) {
      for (let j = 0; j < 4; j++) {
        this.scalars[i][j].value = (this.scalars[i][j].value + this.scalars[i][j].rate) % 1
      }
      /*
      this.scalars[i][0].value = (this.scalars[i][0].value + this.scalars[i][0].rate) % 1
      this.scalars[i][1].value = (this.scalars[i][1].value + this.scalars[i][1].rate) % 1
      this.scalars[i][2].value = (this.scalars[i][2].value + this.scalars[i][2].rate) % 1
      this.scalars[i][3].value = (this.scalars[i][3].value + this.scalars[i][3].rate) % 1
      */
    }
    for (let i = 0; i < this.scalarMap.length; i++) {
      for (let j = 0; j < 4; j++) {
        this.scalarVerts[i + (this.scalarMap.length * j)] = this.scalars[this.scalarMap[i]][j].value
      }
      /*
      this.scalarVerts[i + (this.scalarMap.length * 0)] = this.scalars[this.scalarMap[i]][0].value
      this.scalarVerts[i + (this.scalarMap.length * 1)] = this.scalars[this.scalarMap[i]][1].value
      this.scalarVerts[i + (this.scalarMap.length * 3)] = this.scalars[this.scalarMap[i]][2].value
      this.scalarVerts[i + (this.scalarMap.length * 4)] = this.scalars[this.scalarMap[i]][3].value
      */
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.scalarVertBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.scalarVerts, this.gl.STREAM_DRAW)
  }

  draw () {
    super.draw(this.framebuffer)
  }
}

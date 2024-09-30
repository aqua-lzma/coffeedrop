import { createProgram, initBuffer } from "../webgl-helpers.js"

const VERT_SRC = await (await fetch('./perlin/perlin.vert')).text()
const FRAG_SRC = await (await fetch('./perlin/perlin.frag')).text()

export default class Perlin {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl, scale, speed, framebufferIndex) {
    const width = gl.canvas.width
    const height = gl.canvas.height
    this.gl = gl
    this.program = createProgram(gl, VERT_SRC, FRAG_SRC)
    this.framebuffer = initBuffer(gl, framebufferIndex)

    let pixelSize, gridW, gridH
    if (width > height) {
      gridW = Math.ceil(1 / scale)
      pixelSize = width * scale
      gridH = Math.ceil(height / pixelSize)
    } else {
      gridH = Math.ceil(1 / scale)
      pixelSize = height * scale
      gridW = Math.ceil(width / pixelSize)
    }
    const posWidth = (2 / width) * pixelSize
    const posHeight = (2 / height) * pixelSize

    const posVerts = []
    const texVerts = []
    this.scalarMap = []
    for (let y = 0; y < gridH; y++) {
      for (let x = 0; x < gridW; x++) {
        const [x0, y0] = [-1 + (x * posWidth), 1 - (y * posHeight)]
        const [x1, y1] = [x0 + posWidth, y0 - posHeight]
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
    this.scalars = new Array((gridW + 1) * (gridH + 1)).fill().map(() => ({
      value: Math.random(), rate: Math.random() / speed
    }))
    this.scalars2 = new Array((gridW + 1) * (gridH + 1)).fill().map(() => ({
      value: Math.random(), rate: Math.random() / speed
    }))
    this.scalarVerts = new Float32Array(this.scalarMap.length)
    this.scalar2Verts = new Float32Array(this.scalarMap.length)
    for (let i = 0; i < this.scalarMap.length; i++) {
      this.scalarVerts[i] = this.scalars[this.scalarMap[i]].value
      this.scalar2Verts[i] = this.scalars2[this.scalarMap[i]].value
    }
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
    gl.bufferData(gl.ARRAY_BUFFER, this.scalarVerts, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(scalarLoc)
    gl.vertexAttribPointer(scalarLoc, 4, gl.FLOAT, false, 0, 0)

    const scalar2Loc = gl.getAttribLocation(this.program, 'a_scalar2')
    this.scalar2VertBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.scalar2VertBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, this.scalar2Verts, gl.STATIC_DRAW)
    gl.enableVertexAttribArray(scalar2Loc)
    gl.vertexAttribPointer(scalar2Loc, 4, gl.FLOAT, false, 0, 0)
  }

  updateScalars () {
    for (let i = 0; i < this.scalars.length; i++) {
      this.scalars[i].value = (this.scalars[i].value + this.scalars[i].rate) % 1
      this.scalars2[i].value = (this.scalars2[i].value + this.scalars2[i].rate) % 1
    }
    for (let i = 0; i < this.scalarMap.length; i++) {
      this.scalarVerts[i] = this.scalars[this.scalarMap[i]].value
      this.scalar2Verts[i] = this.scalars2[this.scalarMap[i]].value
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.scalarVertBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.scalarVerts, this.gl.STATIC_DRAW)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.scalar2VertBuffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this.scalar2Verts, this.gl.STATIC_DRAW)
  }

  draw () {
    this.gl.useProgram(this.program)
    // this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.bindVertexArray(this.vao)
    this.updateScalars()
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertexCount)
  }
}

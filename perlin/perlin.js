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

    const posVertices = []
    const texVertices = []
    const scalars = []
    const vertIndices = []
    for (let y = 0; y <= gridH; y++) {
      for (let x = 0; x <= gridW; x++) {
        if (x < gridW && y < gridH) {
          vertIndices.push(
            ((gridW + 1) * (y + 0)) + x + 0,
            ((gridW + 1) * (y + 1)) + x + 0,
            ((gridW + 1) * (y + 0)) + x + 1,
            ((gridW + 1) * (y + 1)) + x + 0,
            ((gridW + 1) * (y + 0)) + x + 1,
            ((gridW + 1) * (y + 1)) + x + 1
          )
        }
        const [dx, dy] = [-1 + (x * posWidth), 1 - (y * posHeight)]
        posVertices.push(dx, dy)
        texVertices.push(x, y)
        scalars.push(Math.random())
      }
    }
    this.vertexCount = vertIndices.length

    gl.useProgram(this.program)
    this.vao = gl.createVertexArray()
    gl.bindVertexArray(this.vao)

    const positionLoc = gl.getAttribLocation(this.program, 'a_position')
    const posVertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posVertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(posVertices), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    const textureLoc = gl.getAttribLocation(this.program, 'a_texture')
    const texVertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texVertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texVertices), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(textureLoc)
    gl.vertexAttribPointer(textureLoc, 2, gl.FLOAT, false, 0, 0)

    const scalarLoc = gl.getAttribLocation(this.program, 'a_scalar')
    const scalarBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, scalarBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(scalars), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(scalarLoc)
    gl.vertexAttribPointer(scalarLoc, 2, gl.FLOAT, false, 0, 0)

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(vertIndices), gl.STATIC_DRAW)
  }

  draw () {
    this.gl.useProgram(this.program)
    // this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posVertexBuffer)
    this.gl.bindVertexArray(this.vao)
    this.gl.drawElements(this.gl.TRIANGLES, this.vertexCount, this.gl.UNSIGNED_SHORT, 0)
  }
}

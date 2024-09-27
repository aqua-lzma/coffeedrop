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

    let pixelSize
    if (width > height) {
      this.gridW = Math.ceil(1 / scale)
      pixelSize = width * scale
      this.gridH = Math.ceil(height / pixelSize)
    } else {
      this.gridH = Math.ceil(1 / scale)
      pixelSize = height * scale
      this.gridW = Math.ceil(width / pixelSize)
    }
    this.posWidth = (2 / width) * pixelSize
    this.posHeight = (2 / height) * pixelSize

    this.scalars = new Array(this.gridH).fill().map(() => {
      return new Array(this.gridW).fill().map(() => {
        return new Array(4).fill().map(() => Math.random())
      })
    })
    this.scalarRates = new Array(this.gridH).fill().map(() => {
      return new Array(this.gridW).fill().map(() => {
        return new Array(4).fill().map(() => Math.random() / speed)
      })
    })

    gl.useProgram(this.program)
    this.vao = gl.createVertexArray()
    gl.bindVertexArray(this.vao)

    const positionLoc = gl.getAttribLocation(this.program, 'a_position')
    this.posVertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.posVertexBuffer)
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    const textureLoc = gl.getAttribLocation(this.program, 'a_texture')
    const texVertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texVertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(textureLoc)
    gl.vertexAttribPointer(textureLoc, 2, gl.FLOAT, false, 0, 0)

    this.perlinLoc = gl.getUniformLocation(this.program, 'u_perlin')
  }

  draw () {
    this.gl.useProgram(this.program)
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.posVertexBuffer)
    this.gl.bindVertexArray(this.vao)
    for (let y = 0; y < this.gridH; y++) {
      for (let x = 0; x < this.gridW; x++) {
        const x0 = -1 + (this.posWidth * x)
        const y0 = 1 - (this.posHeight * y)
        const x1 = x0 + this.posWidth
        const y1 = y0 - this.posHeight
        const x2 = (x + 1) % this.gridW
        const y2 = (y + 1) % this.gridH
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([x0, y0, x0, y1, x1, y0, x1, y1]), this.gl.STATIC_DRAW)
        this.gl.uniformMatrix4fv(this.perlinLoc, false, new Float32Array([
          this.scalars[y][x][0], this.scalars[y][x2][0], this.scalars[y2][x][0], this.scalars[y2][x2][0],
          this.scalars[y][x][1], this.scalars[y][x2][1], this.scalars[y2][x][1], this.scalars[y2][x2][1],
          this.scalars[y][x][2], this.scalars[y][x2][2], this.scalars[y2][x][2], this.scalars[y2][x2][2],
          this.scalars[y][x][3], this.scalars[y][x2][3], this.scalars[y2][x][3], this.scalars[y2][x2][3]
        ]))
        for (let i = 0; i < 4; i++) {
          this.scalars[y][x][i] = (this.scalars[y][x][i] + this.scalarRates[y][x][i]) % 1
        }
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4)
      }
    }
  }
}

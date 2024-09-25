import { createProgram } from "../webgl-helpers.js"

const VERT_SRC = await (await fetch('./perlin/shader.vert')).text()
const FRAG_SRC = await (await fetch('./perlin/shader.frag')).text()

const SCALE = 0.1
// Lower = faster
const SPEED = 200

export default class Perlin {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    const width = gl.canvas.width
    const height = gl.canvas.height
    this.gl = gl
    this.program = createProgram(gl, VERT_SRC, FRAG_SRC)

    // Calculate size of grid
    let pixelSize, gridW, gridH, uvW, uvH
    if (width > height) {
      gridW = Math.ceil(1 / SCALE)
      pixelSize = width * SCALE
      gridH = Math.ceil(height / pixelSize)
    } else {
      gridH = Math.ceil(1 / SCALE)
      pixelSize = height * SCALE
      gridW = Math.ceil(width / pixelSize)
    }
    uvW = (2 / width) * pixelSize
    uvH = (2 / height) * pixelSize
    console.log({pixelSize, gridW, gridH, uvW, uvH})
    // Populate perlin grid
    this.perlinArray = Array((gridW + 1) * (gridH + 1)).fill().map(() => [Math.random(), Math.random() / SPEED])

    // Populate vertex and texture positions, also prepare perlin value mapping
    const vertexPositions = []
    const texturePositions = []
    this.perlinMap = []
    for (let y = 0; y < gridH; y++) {
      for (let x = 0; x < gridW; x++) {
        const [ax, ay] = [-1 + (uvW * x), 1 - (uvH * y)]
        const [bx, by] = [ax + uvW, ay - uvH]
        // TL, BL, TR
        // BL, TR, BR
        vertexPositions.push(
          ax, ay, ax, by, bx, ay,
          ax, by, bx, ay, bx, by
        )
        texturePositions.push(
          0, 0, 0, 1, 1, 0,
          0, 1, 1, 0, 1, 1
        )
        const tl = ((gridW + 1) * y) + x
        const tr = tl + 1
        const bl = tl + gridW + 1
        const br = bl + 1
        this.perlinMap.push(
          tl, tr, bl, br,
          tl, tr, bl, br,
          tl, tr, bl, br,
          tl, tr, bl, br,
          tl, tr, bl, br,
          tl, tr, bl, br
        )
      }
    }
    this.verticies = gridW * gridH * 6

    gl.useProgram(this.program)

    const positionLoc = gl.getAttribLocation(this.program, 'a_position')
    const posVertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posVertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositions), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    const textureLoc = gl.getAttribLocation(this.program, 'a_texture')
    const texVertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, texVertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texturePositions), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(textureLoc)
    gl.vertexAttribPointer(textureLoc, 2, gl.FLOAT, false, 0, 0)

    const perlinLoc = gl.getAttribLocation(this.program, 'a_perlin')
    this.perlinBuffer = gl.createBuffer()
    this.updatePelinBuffer()
    gl.enableVertexAttribArray(perlinLoc)
    gl.vertexAttribPointer(perlinLoc, 4, gl.FLOAT, false, 0, 0)
  }

  updatePelinBuffer () {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.perlinBuffer)
    this.perlinArray.forEach(i => {
      i[0] += i[1]
      i[0] = i[0] % 1
    })
    const perlinValues = this.perlinMap.map(i => this.perlinArray[i][0])
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(perlinValues), this.gl.STATIC_DRAW)
  }

  draw (framebuffer) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, framebuffer)
    this.gl.useProgram(this.program)
    this.updatePelinBuffer()
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.verticies)
  }
}

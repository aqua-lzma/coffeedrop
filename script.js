import Composite from './composite/composite.js'
import Warp from './warp/warp.js'
import Perlin from './perlin/perlin.js'

const canvas = document.getElementById('canvas')
canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight
const gl = canvas.getContext('webgl2')

const composite = new Composite(gl)
const warp = new Warp(gl)
const perlin1 = new Perlin(gl, 0.1, 200, 2)

let curWarpBuffer = 0
function drawFrame () {
  perlin1.draw()
  // warp.draw(curWarpBuffer)
  // composite.draw(curWarpBuffer)
  // curWarpBuffer = curWarpBuffer === 0 ? 1 : 0
  window.requestAnimationFrame(drawFrame)
}

perlin1.draw()
// drawFrame()

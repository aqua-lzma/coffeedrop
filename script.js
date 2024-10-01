import Init from './init/init.js'
import Composite from './composite/composite.js'
import Warp from './warp/warp.js'
import Perlin from './perlin/perlin.js'

const canvas = document.getElementById('canvas')
canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight
const gl = canvas.getContext('webgl2')

const init = new Init(gl)
const composite = new Composite(gl)
const warp = new Warp(gl)
const perlin = new Perlin(gl, 0.05, 200, 2)

/*
Texture / framebuffer locations:
0 / 1 : Warp
2 : Perlin
*/

let curWarpBuffer = 0
function drawFrame () {
  perlin.draw()
  warp.draw(curWarpBuffer)
  composite.draw(curWarpBuffer)
  curWarpBuffer = curWarpBuffer === 0 ? 1 : 0
  window.requestAnimationFrame(drawFrame)
}

perlin.draw()
init.draw(warp.framebuffer1)

drawFrame()

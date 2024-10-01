import Init from './init/init.js'
/*
import Composite from './composite/composite.js'
import Warp from './warp/warp.js'
*/
import Perlin from './perlin/perlin.js'

const canvas = document.getElementById('canvas')
canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight
const gl = canvas.getContext('webgl2')

let init, composite, warp, perlin
try {
  // init = await new Init(gl)
  // composite = new Composite(gl)
  // warp = new Warp(gl)
  perlin = await new Perlin(gl, 0.3, 400, 2)
} catch (e) {
  const text = document.createElement('p')
  text.textContent = String(e)
  canvas.remove()
  text.style.color = '#ff0000'
  document.body.append(text)
  throw e
}
/*
Texture / framebuffer locations:
0 / 1 : Warp
2 : Perlin
*/

let curWarpBuffer = 0
function drawFrame () {
  perlin.draw()
  // warp.draw(curWarpBuffer)
  // composite.draw(curWarpBuffer)
  // curWarpBuffer = curWarpBuffer === 0 ? 1 : 0
  window.requestAnimationFrame(drawFrame)
}

// init.draw()
perlin.draw()
drawFrame()

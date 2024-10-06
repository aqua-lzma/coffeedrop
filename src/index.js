import Init from './shaders/init/init.js'
import Composite from './shaders/composite/composite.js'
import Warp from './shaders/warp/warp.js'
import Perlin from './shaders/perlin/perlin.js'

const canvas = document.getElementById('canvas')
canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight
const gl = canvas.getContext('webgl2')
gl.getExtension('EXT_color_buffer_float')

/*
Texture / framebuffer locations:
0 / 1 : Warp
2 : Perlin
*/

const init = new Init(gl)
const perlin = new Perlin(gl, 0.3, [1 / 100, 1 / 400, 1 / 400, 1 / 400])
const warp = new Warp(gl)
const composite = new Composite(gl)

function drawFrame () {
  perlin.draw()
  warp.draw()
  composite.draw(warp.texture)
  window.requestAnimationFrame(drawFrame)
}

perlin.draw()
init.draw(warp.texture1.framebuffer)
drawFrame()

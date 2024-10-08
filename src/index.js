import Composite from './shaders/composite/composite.js'
import Warp from './shaders/warp/warp.js'
import Blur from './shaders/blur/blur.js'
import Perlin from './shaders/perlin/perlin.js'
import Init from './shaders/init/init.js'

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

const composite = new Composite(gl)
const warp = new Warp(gl)
const blur = new Blur(gl)
const perlin = new Perlin(gl, 0.3, [1 / 100, 1 / 400, 1 / 400, 1 / 400])
const init = new Init(gl)

function drawFrame () {
  perlin.draw()
  warp.draw()
  blur.draw()
  composite.draw(warp.texture)
  window.requestAnimationFrame(drawFrame)
}

perlin.draw()
init.draw(warp.texture1.framebuffer)
drawFrame()

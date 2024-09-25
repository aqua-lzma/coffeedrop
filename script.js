import Perlin from './perlin/index.js'

const canvas = document.getElementById('canvas')
canvas.width = canvas.clientWidth
canvas.height = canvas.clientHeight
const gl = canvas.getContext('webgl2')

const perlin = new Perlin(gl)

function drawFrame () {
  window.requestAnimationFrame(drawFrame)
  perlin.draw()
}

// perlin.draw()
drawFrame()

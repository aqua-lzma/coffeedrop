const startTime = (new Date()).getTime()
const perlinGridSize = 4

/**
 * @param {WebGL2RenderingContext} gl
 * @param {number} type
 * @param {string} source
 */
async function createShader (gl, type, path) {
  console.log('Compiling shader:', path)
  const source = await (await fetch(path)).text()
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) return shader
  console.error(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {string} vertexShaderPath
 * @param {string} fragmentShaderPath
 */
async function createProgram (gl, vertexShaderPath, fragmentShaderPath) {
  const vertexShader = await createShader(gl, gl.VERTEX_SHADER, vertexShaderPath)
  const fragmentShader = await createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderPath)
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (success) return program
  console.error(gl.getProgramInfoLog(program))
  gl.deleteProgram(program)
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {string} fragmentShaderPath
 * @returns {WebGLProgram}
 */
async function initProg (gl, fragmentShaderPath) {
  const prog = await createProgram(gl, 'shaders/flat.vert', fragmentShaderPath)
  const positionLoc = gl.getAttribLocation(prog, 'a_position')
  const vertexPositions = new Float32Array([-1, 1, 1, 1, 1, -1, -1, -1])
  const positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW)
  gl.enableVertexAttribArray(positionLoc)
  gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

  gl.useProgram(prog)

  const resolutionLoc = gl.getUniformLocation(prog, 'u_resolution')
  gl.uniform2fv(resolutionLoc, [gl.canvas.width, gl.canvas.height])

  return prog
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {number} textureIndex
 */
function initBuffer (gl, textureIndex) {
  const texture = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0 + textureIndex)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, gl.canvas.width, gl.canvas.height, 0, gl.RGB, gl.UNSIGNED_BYTE, null)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)

  const buffer = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, buffer)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
  return buffer
}

window.addEventListener('load', async () => {
  const canvas = document.createElement('canvas')
  document.body.append(canvas)
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight
  const gl = canvas.getContext('webgl2')

  const blur1Prog = await initProg(gl, 'shaders/blur1.frag')
  const warpProg = await initProg(gl, 'shaders/warp.frag')
  const compProg = await initProg(gl, 'shaders/comp.frag')

  const blur1SampleLoc = gl.getUniformLocation(blur1Prog, 'u_sample')
  const warpSampleLoc = gl.getUniformLocation(warpProg, 'u_sample')
  const compSampleLoc = gl.getUniformLocation(compProg, 'u_sample')
  const compTimeLoc = gl.getUniformLocation(compProg, 'u_time')
  const compSeedLoc = gl.getUniformLocation(compProg, 'u_seed')

  gl.useProgram(warpProg)
  const warpBlurLoc = gl.getUniformLocation(warpProg, 'u_blur')
  gl.uniform1i(warpBlurLoc, 2)

  const warpBuffer1 = initBuffer(gl, 0)
  const warpBuffer2 = initBuffer(gl, 1)
  const blurBuffer1 = initBuffer(gl, 2)

  let lastWarpBuffer = 0
  let n = 1

  function drawFrame () {
    gl.bindFramebuffer(gl.FRAMEBUFFER, blurBuffer1)
    gl.useProgram(blur1Prog)
    gl.uniform1i(blur1SampleLoc, lastWarpBuffer)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)

    gl.bindFramebuffer(gl.FRAMEBUFFER, (lastWarpBuffer === 1 ? warpBuffer1 : warpBuffer2))
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.useProgram(warpProg)
    gl.uniform1i(warpSampleLoc, lastWarpBuffer)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
    lastWarpBuffer = lastWarpBuffer === 1 ? 0 : 1

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.useProgram(compProg)
    gl.uniform1i(compSampleLoc, lastWarpBuffer)
    gl.uniform1f(compTimeLoc, (new Date()).getTime() - startTime)
    gl.uniform1ui(compSeedLoc, n += 10)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)

    window.requestAnimationFrame(drawFrame)
  }
  drawFrame()
})

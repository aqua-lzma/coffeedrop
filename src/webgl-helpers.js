/**
 * @param {WebGL2RenderingContext} gl
 * @param {number} type
 * @param {string} source
 */
function createShader (gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (!success) {
    const error = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw error
  }
  return shader
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {string} vertexShaderSrc
 * @param {string} fragmentShaderSrc
 */
export function createProgram (gl, vertexShaderSrc, fragmentShaderSrc) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc)
  const program = gl.createProgram()
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)
  if (!success) {
    const error = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw error
  }
  return program
}

/**
 * @param {WebGL2RenderingContext} gl
 * @param {number} index
 */
export function initBuffer (gl, index) {
  const texture = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0 + index)
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

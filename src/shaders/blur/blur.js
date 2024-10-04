import Shader from '../shader.js'

export default class Init extends Shader {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    console.log('Compiling blur shader.')
    super()
    this.gl = gl
  }
}

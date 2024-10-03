import Shader from '../shader.js'

const fragSrc = await (await fetch('./shaders/init/init.frag')).text()

export default class Init extends Shader {
  /** @param {WebGL2RenderingContext} gl */
  constructor (gl) {
    console.log('Compiling init shader.')
    super()
    this.gl = gl
    this.initProgram(fragSrc)
    this.initVertices()
  }
}

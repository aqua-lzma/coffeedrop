module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    allowedHosts: 'all'
  },
  module: {
    rules: [{
      test: /\.vert|\.frag/,
      type: 'asset/source'
    }]
  }
}

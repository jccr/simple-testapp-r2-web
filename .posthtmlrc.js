module.exports = {
  plugins: [
    require('posthtml-include')({
      root: './src'
    })
  ]
};
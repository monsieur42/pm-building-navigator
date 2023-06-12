module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : 'http://192.168.0.106:8080/',
  configureWebpack: {
    output: {
      filename: 'pmbn-app.js',
      chunkFilename: 'pmbn-app-vendors.js'
    },
  },
  css: {
    extract: {
      filename: 'pmbn-app.css',
      chunkFilename: 'pmbn-app-vendors.css'
    }
  },
}
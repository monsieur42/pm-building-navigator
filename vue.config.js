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
  /*devServer: {
    public: 'http://localhost:8080',
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': 'http://local.wptest.hu',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    }
  }*/
}
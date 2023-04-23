module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8080/',
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
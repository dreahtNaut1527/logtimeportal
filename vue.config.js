module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  productionSourceMap: false,
  devServer: {
    host: '0.0.0.0',
    port: '1003', //name of port
    public: '0.0.0.0:1003',
    disableHostCheck: true,
    noInfo: true
  },
  publicPath: process.env.NODE_ENV ==='production' ? '/logtimeportal/' : '/'
} 
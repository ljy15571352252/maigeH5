const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const path = require('path')
// 当前执行的js文件的根路径
const root = path.resolve(process.cwd());
module.exports = {
  publicPath: '/mobile/',
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer({
            // 新版本不再推荐使用browsers,改用overrideBrowserslist
            overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7']
          }),
          pxtorem({
            // 和vant框架保持1:1,即37.5
            rootValue: 37.5,
            propList: ['*'],
          })
        ]
      }
    }
  },
  lintOnSave: false,
  devServer: {
    // 禁用主机检查，以便可以局域网外部访问
    disableHostCheck: true,
    // 开发环境页面访问的域名(允许外部可以访问)
    host: '0.0.0.0',
    // 开发环境页面访问的端口
    port: 8081,
    https: false, // 启用https，false不启用
    // 是否允许警告或错误覆盖在屏幕表面
    overlay: {
      warnings: false,
      errors: true
    },
    // 开发环境跨域代理
    /*proxy: {
      // 当本地请求路径字符串中含有api字符串则开启代理
      '/api': {
        // 要代理的目标接口域名(实际请求中会把本机的域名替换成这个字符串)
        target: 'http://www.maige.com/api/',
        // 设置同源
        changeOrigin: true,
        // 设置跨域
        ws: true,
        // 实际请求中不存在代理字段则重写接口路径把api字符串去掉
        pathRewrite: {
          '^/api': '/'
        }
      }
    }*/
  },
  // 简单webpack配置（最终会和vue-cli进行合并）
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 去掉source-map
      config.devtool = ''
      // 为生产环境修改配置...
      config.mode = 'production'
      // 将每个依赖包打包成单独的js文件
      let optimization = {
        // 将runtime单独抽离出来
        // runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          minSize: 20000, // 依赖包超过20000bit将被单独打包
          cacheGroups: {
            // npm包基础代码
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendor',
              chunks: 'all',
              // 优先级（最先提取）
              priority: 10
            },
            // 公共业务代码
            commons: {
              name: 'commons',
              chunks: 'all',
              // 公共包引入的最低次数
              minChunks: 2,
              priority: 0
            }
          }
        }
      }
      Object.assign(config, {
        optimization
      })
    } else {
      // 为开发环境修改配置...
      config.mode = 'development'
      // 开发环境开启source-map
      config.devtool = 'source-map'
    }
  },
  // 复杂webpack配置（可以通过其提供的一些链式操作来定义loader和plugins）
  chainWebpack: (config) => {
    // 给src的子目录配置别名
    config.resolve.alias
      .set('@', `${root}/src`) // 入口文件夹
      .set('assets', `${root}/src/assets`) // 静态资源文件夹（全局样式混入样式，全局图片）
      .set('components', `${root}/src/components`) // 一些公共组件
      .set('router', `${root}/src/router`) // 路由文件夹
      .set('configs', `${root}/src/configs`) // 配置文件夹(主要包括需要动态添加的js文件，比如接口，公共数组，正则，按需加载vant等等)
      .set('http', `${root}/src/http`) // 请求文件夹
      .set('utils', `${root}/src/utils`) // 常用的一些js逻辑/插件封装文件夹
      .set('store', `${root}/src/store`) // vuex仓库文件夹
      .set('views', `${root}/src/views`) // 我们要写的业务文件夹
  }
};
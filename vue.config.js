'use strict'
const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title // 网址标题
const port = 8010 // 端口配置

module.exports = {
  publicPath: '/',
  outputDir: resolve('dist'),
  assetsDir: 'static',
  // lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: process.env.NODE_ENV === 'development',
  devServer: {
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/api': 'api'
        }
      },
      '/auth': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/auth': 'auth'
        }
      },
      '/resource': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/resource': 'resource'
        }
      },
      '/widgets': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/widgets': 'widgets'
        }
      },
      navWidgets: {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/navWidgets': 'navWidgets'
        }
      },
      '/config': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/config': 'config'
        }
      },
      '/analysis': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
        pathRewrite: {
          '^/analysis': 'analysis'
        }
      }
    }
  },
  configureWebpack: () => {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    return {
      name: name,
      resolve: {
        alias: {
          '@': resolve('src')
        }
      },
      output: {
        chunkFilename: 'static/js/[name].[chunkhash].chunk.js'
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
        strictMath: false
      },
      postcss: {
        plugins: [
          require('postcss-plugin-px2rem')({
            rootValue: 50, // 换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
            // unitPrecision: 5, //允许REM单位增长到的十进制数字。
            // propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
            // propBlackList: [], //黑名单
            exclude: false, // 默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)\/如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
            // selectorBlackList: [], //要忽略并保留为px的选择器
            // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
            // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
            mediaQuery: false, // （布尔值）允许在媒体查询中转换px。
            minPixelValue: 0 // 设置要替换的最小像素值(3px会被转rem)。 默认 0
          })
        ]
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    // set BundleAnalyzerPlugin
    config
      .plugin('webpack-bundle-analyzer')
      .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.module
      .rule('css')
      .test(/\.css$/)
      .oneOf('vue')
      .resourceQuery(/\?vue/)
      .use('px2rem')
      .loader('px2rem-loader')
      .options({
        remUnit: 50
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config.when(process.env.NODE_ENV === 'development', config =>
      config.devtool('source-map')
    )

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      // config.optimization.splitChunks({
      //   chunks: 'all',
      //   cacheGroups: {
      //     libs: {
      //       name: 'chunk-libs',
      //       test: /[\\/]node_modules[\\/]/,
      //       priority: 10,
      //       chunks: 'initial' // only package third parties that are initially dependent
      //     },
      //     elementUI: {
      //       name: 'chunk-elementUI', // split elementUI into a single package
      //       priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
      //       test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
      //     },
      //     commons: {
      //       name: 'chunk-commons',
      //       test: resolve('src/components'), // can customize your rules
      //       minChunks: 3, //  minimum common number
      //       priority: 5,
      //       reuseExistingChunk: true
      //     }
      //   }
      // })
      config.optimization.runtimeChunk('single')

      config
        .plugin('compression-webpack-plugin')
        .use(
          new CompressionPlugin({
            // filename: '[path].gz[query]',
            // algorithm: 'gzip',
            test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
            threshold: 10240,
            deleteOriginalAssets: false
            // minRatio: 0.8
          })
        )
        .end()
    })

    // set externals
    config.set('externals', {
      vue: 'Vue',
      iview: 'iView',
      echarts: 'echarts',
      html2canvas: 'html2canvas',
      jspdf: 'jsPDF',
      nprogress: 'NProgress',
      'vue-router': 'VueRouter'
    })
  },
  transpileDependencies: ['vue-echarts', 'resize-detector']
}

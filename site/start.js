const path = require('path')
const fs = require('fs')
const glob = require('glob')
const ejs = require('ejs')

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const openBrowser = require('react-dev-utils/openBrowser')
const {
  getWebpackConfig
} = require('./config')

const isProduction = process.argv.includes('--build')

const actuator = {
  init: () => {
    let rootPath = process.cwd()
    let renderData = {}

    let readToData = (name, dir) => {
      renderData[name] = []
      dir = dir || [name]
      let mdFiles = []
      for (const item of dir) {
        mdFiles = mdFiles.concat(glob.sync(path.join(rootPath, 'src', item, '/**/index.md')))
      }
      for (const mdPath of mdFiles) {
        let dir = path.dirname(mdPath)
        let demoFiles = glob.sync(path.join(dir, 'demos/*.tsx'))
        renderData[name].push({
          index: mdPath.replace(rootPath, '../..'),
          demos: demoFiles.map(n => {
            return {
              key: n.replace(dir + '/', ''),
              path: n.replace(rootPath, '../..')
            }
          })
        })
      }
    }

    readToData('components')
    readToData('hooks')
    readToData('pages')
    readToData('others', ['core', 'utils'])

    let templatePath = path.join(__dirname, 'templates', 'data.ejs.js')
    let templateContent = fs.readFileSync(templatePath).toString()

    let renderResult = ejs.render(templateContent, renderData)

    let dataPath = path.join(__dirname, 'docs', 'index.js')
    fs.writeFileSync(dataPath, renderResult)
  },
  run: () => {
    let webpackConfig = getWebpackConfig(isProduction)

    const compiler = webpack(webpackConfig)

    if (isProduction) {
      compiler.run((err, stats) => {
        if (err !== null) {
          return console.error(err)
        }
        if (stats.hasErrors()) {
          console.log(stats.toString('errors-only'))
          return
        }
      })
    } else {
      const serverOptions = {
        quiet: true,
        hot: true,
        contentBase: path.join(process.cwd(), 'site', 'src'),
        historyApiFallback: true,
        host: 'localhost',
      }
      const server = new WebpackDevServer(compiler, serverOptions)
      server.listen(5200, '0.0.0.0', () => openBrowser(`http://localhost:5200`))
    }
  }
}

actuator.init()
actuator.run()
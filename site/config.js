const path = require('path')
const { tmpdir } = require('os')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const WebpackBar = require('webpackbar')

const isWindows = process.platform === 'win32'

const demoRegs = !isWindows ?
  [
    /src\/components\/.*\/demos\/.*tsx$/,
    /src\/hooks\/.*\/demos\/.*tsx$/,
    /src\/pages\/.*\/demos\/.*tsx$/,
    /src\/utils\/.*\/demos\/.*tsx$/,
  ] :
  [
    /src\\components\\.*\\demos\\.*tsx$/,
    /src\\hooks\\.*\\demos\\.*tsx$/,
    /src\\pages\\.*\\demos\\.*tsx$/,
    /src\\utils\\.*\\demos\\.*tsx$/,
  ]

const getBabelCommonConfig = () => {
  return {
    cacheDirectory: tmpdir(),
    presets: [
      require.resolve('@babel/preset-react'),
      [
        require.resolve('@babel/preset-env'),
        {
          targets: {
            browsers: [
              'last 2 versions',
              'Firefox ESR',
              '> 1%',
              'ie >= 8',
              'iOS >= 8',
              'Android >= 4',
            ],
          },
        },
      ],
    ],
    plugins: []
  }
}

const getTsCommonConfig = () => {
  return {
    target: 'es6',
    jsx: 'react',
    noImplicitAny: true,
    moduleResolution: 'node',
    declaration: false,
    allowJs: true,
    sourceMap: true,
  }
}

exports.getWebpackConfig = (isProduction) => {
  const babelOptions = getBabelCommonConfig()
  const tsOptions = getTsCommonConfig()

  let config = {
    mode: isProduction ? 'production' : 'development',
    entry: './site/src/index.tsx',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, '../', 'site-build')
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    module: {
      rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        options: babelOptions,
      },
      {
        test: /\.tsx?$/,
        use: [{
          loader: require.resolve('babel-loader'),
          options: babelOptions,
        },
        {
          loader: require.resolve('ts-loader'),
          options: {
            transpileOnly: true,
            compilerOptions: tsOptions,
          },
        }
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [{
          loader: 'style-loader'
        },
        {
          loader: 'css-loader'
        }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
      {
        test: /\.md$/,
        use: [{
          loader: path.join(__dirname, 'loaders', 'docsLoader.js')
        }]
      },
      {
        test: (filename) => {
          for (const item of demoRegs) {
            if (item.test(filename)) {
              return true
            }
          }
          return false
        },
        use: [{
          loader: path.join(__dirname, 'loaders', 'demoLoader.js')
        }]
      },
      ]
    },
    plugins: [
      new WebpackBar(),
      new webpack.HotModuleReplacementPlugin()
    ],
  }
  if (isProduction) {
    config.output.publicPath = './'
    config.plugins.unshift(new CopyPlugin([
      { from: './site/src/public', to: 'public' },
      { from: './site/src/index.html', to: 'index.html', toType: 'file' },
    ]))
    config.plugins.unshift(new CleanWebpackPlugin())
  } else {
    config.devtool = 'source-map'
  }
  return config
}
const path = require(`path`);
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);
const CopyWebpackPlugin = require(`copy-webpack-plugin`);
const ImageminPlugin = require(`imagemin-webpack-plugin`).default;

// need to fix Error: error:0308010C:digital envelope routines::unsupported
const crypto = require('crypto');
const crypto_orig_createHash = crypto.createHash;
crypto.createHash = algorithm => crypto_orig_createHash(algorithm === 'md4' ? 'sha256' : algorithm);
// ------------------------------------------------------------------------

module.exports = {
  entry: {
    app: `./src/index.js`
  },
  output: {
    filename: `./[name].js`,
    path: path.join(__dirname, `public`)
  },
  devServer: {
    contentBase: path.join(__dirname, `public`),
    open: true,
    port: 1337,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: `babel-loader`,
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: `css-loader?url=false`,
          },
          {
            loader: `postcss-loader`,
            options: {
              config: {
                path: `./postcss.config.js`
              }
            }
          }, {
            loader: `sass-loader`,
          }
        ],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: [
          `url-loader?limit=100000`
        ]
      }
    ],
  },
  devtool: `source-map`,
  plugins: [
    new MiniCssExtractPlugin({
      filename: `./css/[name].css`
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `./src/fonts`,
          to: `./fonts`,
        },
        {
          from: `./src/img`,
          to: `./img`,
        }
      ],
    }),
    new ImageminPlugin({
      test: `./src/img`,
      optimizationLevel: 3,
      progressive: true,
    }),
  ]
};

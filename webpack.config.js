const path = require(`path`);
const MiniCssExtractPlugin = require(`mini-css-extract-plugin`);
module.exports = {
  entry: {
    app: `./src/index.js`
  },
  output: {
    filename: `[name].js`,
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
          // `style-loader`,
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: `css-loader`,
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
          },

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
      filename: `css/[name].css`
    })
  ]
};

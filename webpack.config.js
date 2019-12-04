const path = require('path');

module.exports = {
  mode: "production",
  entry: './src/outCsv.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  optimization: {
    usedExports: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            // Babelの利用
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      browsers: ["last 2 versions"]
                    }
                  }
                ]
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};

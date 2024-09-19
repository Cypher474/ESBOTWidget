const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/widget.js', // Entry point for the widget
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'widget.bundle.js', // Output file
    library: 'ESChatWidget', // Global variable name for the library
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Process both .js and .jsx files
        exclude: /node_modules/, // Exclude node_modules
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Transpile JSX and modern JavaScript
          },
        },
      },
      {
        test: /\.css$/, // Add this if you're using CSS files in your project
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve both .js and .jsx files
  },
};

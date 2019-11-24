var webpack = require('webpack');
var OpenBrowserPlugin = require('open-browser-webpack4-plugin');

module.exports = {
    entry: './src/App.js',
    output: {
        filename: 'dist/app.bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    module: {
        rules:[
            {
                test: /\.(js|jsx)$/, // Matches .js and .jsx files
                exclude:/node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [
                            require("@babel/plugin-transform-async-to-generator"),
                            require("@babel/plugin-transform-arrow-functions"),
                            require("@babel/plugin-transform-modules-commonjs"),
                            require("@babel/plugin-proposal-class-properties"),
                            require("babel-plugin-styled-components")
                        ]
                    }
                },
            },
            {
                test:/\.(scss|css)$/,
                use:['style-loader','css-loader','cssimportant-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
                use: {
                  loader: 'url-loader',
                  options: {
                    name: '[name].[ext]'
                  }
                }
            },
            
        ],
    },
    plugins: [
        // Auto open the demo
        new OpenBrowserPlugin({ url: 'http://localhost:8080' })
    ]
};
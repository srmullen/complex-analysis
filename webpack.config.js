const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
    devtool: "source-map",
    entry: {
        "index": "./src/index",
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
    },
    plugins:[
        new DashboardPlugin({
            port: 3031
        }),
        new HtmlWebpackPlugin({
            filename: "julia.html",
            template: "./index.html",
            chunks: ["index"]
        })
    ],
    module: {
        loaders: [{
            test: /\.css$/,
            loaders: ["style-loader", "css-loader"]
        },
        {
            test: /\.js$/,
            loaders: ["babel-loader"],
            exclude: /node_modules/
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, "./"),
        index: "julia.html",
        port: 3030
    }
}

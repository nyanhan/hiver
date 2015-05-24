var path = require("path");

module.exports = {
    entry: "./js/entry.js",
    output: {
        path: "./build/",
        filename: "bundle.js",
        publicPath: "/build/"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: "style!css",
            exclude: /(node_modules|bower_components)/
        }, {
            test: /\.js$/,
            loader: "babel",
            exclude: /(node_modules|bower_components)/
        }, {
            test: /\.jsx$/,
            loader: "babel",
            exclude: /(node_modules|bower_components)/
        }]
    }
};


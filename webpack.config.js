"use strict";

module.exports = {
    devtool: 'source-map',
    entry: "./src/index.js",
    output: {
        filename: "lib.js",
        path: ".",

        libraryTarget: "umd",
        library: "HTMLEditor" //The global variable exported by the UMD definition
    },
    node: {
        fs: "empty"
    },
    module: {
        loaders: [
            {
                test: /.json$/,
                loader: "json-loader"
            },
            {
                // Turn off AMD module loading on eventemitter2
                // https://github.com/webpack/webpack/issues/829
                test: /eventemitter2/,
                loader: 'imports?define=>false'
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /.hbs$/,
                loader: "handlebars-loader",
                query: {
                    helperDirs: __dirname + "/src/templates/helpers" //eslint-disable-line no-undef
                }
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    compact: false //Not necessary, and turning this off eliminates some build noise
                }
            },
        ]
    }
};

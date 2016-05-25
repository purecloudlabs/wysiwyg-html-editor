module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "lib.js",
        path: ".",

        libraryTarget: "umd",
        library: "Editor"
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
                test: /.html$/,
                loader: "html-loader"
            }
        ]
    }
}

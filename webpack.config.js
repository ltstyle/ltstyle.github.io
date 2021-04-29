const TerserPlugin = require('terser-webpack-plugin')
let path = require('path')

const config = {
    mode: 'production',
    entry: './formVerify-1.0.4.js',
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: 'formVerify-1.0.5.min.js'
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true,
                    },
                },
            })
        ]
    },
    plugins: [

    ],
    module: {
        rules: []
    }
}
module.exports = config

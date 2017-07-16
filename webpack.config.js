import webpack from 'webpack';

const defaultConfig = {
    entry: {
        index: './src/js/index.js'
    },
    output: {
        path: '/dist',
        filename: '[name].js',
        publicPath: '/dist/'
    },
    module: {
        loaders: [{
            test: /\.js/,
            loader: 'babel-loader'
        }]
    },
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM',
        'Zepto': 'Zepto',
        'anim': 'anim'
    }
};

const pluginsConfig = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
}

export var develop = defaultConfig;

export var publish = Object.assign({}, defaultConfig, pluginsConfig);
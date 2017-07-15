import webpack from 'webpack';

export default {
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
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	]
}
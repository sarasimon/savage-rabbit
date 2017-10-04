module.exports = {
	entry: './src/js/scripts.js',
	module: {
		rules: [
		{ 
			enforce: "pre",
			test: /\.jsx?$/, 
			exclude: /node_modules/, 
			loader: "eslint-loader"
		},
		{ 
			test: /\.jsx?$/, 
			exclude: /node_modules/, 
			loader: "babel-loader"
		},
		{
			test: /\.(s)?css$/,
			use: [ 'style-loader', 'css-loader', 'sass-loader']
		}
		]
	},

	resolve: {
		extensions: ['.js', '.json', '.jsx']
	},

	output: {
		filename: './dist/bundle.js'
	},
}

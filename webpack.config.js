const path = require('path');

module.exports = {
	entry: './src/index.js',
	mode: 'development',
	output: {
		filename: 'script.js',
		path: path.resolve(__dirname, 'public')
	},
	devServer: {
		port: 9000
	}
}
const path = require('path');

module.exports = {
	entry: './src/index.js',
	mode: 'development',
	output: {
		filename: 'script.js',
		path: __dirname
	},
	devServer: {
		static: {
			directory: __dirname,
		},
		port: 9000
	}
}
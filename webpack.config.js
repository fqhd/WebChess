const path = require('path');

module.exports = {
	entry: {
		openings: './src/openings.js',
		puzzles: './src/puzzles.js',
		endgames: './src/endgames.js'
	},
	mode: 'development',
	output: {
		filename: './[name]/script.js',
		path: __dirname
	},
	devServer: {
		static: {
			directory: __dirname,
		},
		port: 9000
	}
}
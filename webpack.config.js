const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './dist/index.html',
			filename: "./index.html"
		}),
		new CopyPlugin({
			patterns: [
			  { from: "./src/images", to: "./images" },
			],
		}),
	],
	devServer: {
		allowedHosts: ["all"]
	}
};
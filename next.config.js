const webpack = require('webpack');
const withCSS = require('@zeit/next-css');

/* With CSS Modules */
module.exports = withCSS({
	useFileSystemPublicRoutes: false,
	webpack: (config, {}) => {
		config.module.rules.push({
			test: /\.md$/,
			use: 'raw-loader'
		});

		config.plugins.push(
			new webpack.DefinePlugin({
				'process.env.ROOT': JSON.stringify(process.env.ROOT),
				'process.env.MAPBOX_ACCESS_TOKEN': JSON.stringify(process.env.MAPBOX_ACCESS_TOKEN),
			})
		);

		return config;
	},
})